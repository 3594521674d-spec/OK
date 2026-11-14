// ==UserScript==
// @name         抖音退群助手 v1（只扫描，不退群）
// @namespace    douyin-quit-helper
// @version      1.0
// @description  扫描抖音消息页的群聊，记录哪些是群、是否置顶、有无退出入口。不退任何群，不点退出，不发消息。
// @match        https://www.douyin.com/chat*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';
  if (window.__dqHelperLoaded) return;
  window.__dqHelperLoaded = true;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const results = [];
  const seenNames = new Set();
  let stopFlag = false;

  // ---------- 面板 ----------
  const panel = document.createElement('div');
  panel.id = 'dq-helper-panel';
  panel.style.cssText = 'position:fixed;top:12px;right:12px;width:340px;max-height:80vh;z-index:999999;background:#111;color:#eee;font-size:13px;border:1px solid #555;border-radius:8px;padding:10px;overflow:auto;box-shadow:0 4px 20px rgba(0,0,0,.5);font-family:sans-serif;';
  panel.innerHTML =
    '<div style="font-weight:bold;margin-bottom:6px;">退群助手 v1（只扫描，不退群）</div>' +
    '<button id="dq-start" style="margin-right:6px;padding:4px 10px;">开始扫描</button>' +
    '<button id="dq-stop" style="padding:4px 10px;">停止</button>' +
    '<pre id="dq-log" style="white-space:pre-wrap;word-break:break-all;margin:8px 0 0;font-size:12px;line-height:1.5;"></pre>';
  document.body.appendChild(panel);
  const logEl = panel.querySelector('#dq-log');
  function log(msg) {
    const line = '[' + new Date().toLocaleTimeString() + '] ' + msg;
    logEl.textContent += line + '\n';
    logEl.scrollTop = logEl.scrollHeight;
    console.log('[退群助手]', msg);
  }
  panel.querySelector('#dq-stop').onclick = () => { stopFlag = true; log('已点停止，当前这一步做完就停。'); };

  // ---------- 工具 ----------
  function findByText(root, text, exact) {
    const xp = exact
      ? `.//*[normalize-space(text())="${text}"]`
      : `.//*[contains(normalize-space(text()),"${text}")]`;
    const it = document.evaluate(xp, root || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const out = [];
    for (let i = 0; i < it.snapshotLength; i++) out.push(it.snapshotItem(i));
    return out;
  }
  function captchaPresent() {
    if (/验证码/.test(document.title)) return true;
    return findByText(document, '验证码').some((el) => el.offsetParent !== null && el.children.length === 0);
  }
  function findGroupTitle() {
    // 找标题文字“群名(人数)”：直接文本以 (数字) 结尾的元素，取最内层
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let node;
    let best = null;
    while ((node = walker.nextNode())) {
      if (panel.contains(node)) continue;
      let direct = '';
      node.childNodes.forEach((cn) => { if (cn.nodeType === 3) direct += cn.textContent; });
      direct = direct.trim();
      const m = direct.match(/^(.*)\((\d+)\)\s*$/);
      if (m && m[1].trim().length > 0 && m[1].trim().length < 50) {
        const childHas = Array.from(node.children).some((ch) => /\(\d+\)\s*$/.test((ch.textContent || '').trim()));
        if (!childHas) return { el: node, title: direct };
        if (!best) best = { el: node, title: direct };
      }
    }
    return best;
  }
  function findMoreButton(titleEl) {
    // “...”按钮和标题在同一行：从标题元素往上找，直到找到带 <button> 的容器，取最后一个按钮
    let scope = titleEl;
    for (let i = 0; i < 5 && scope; i++) {
      const btns = scope.querySelectorAll('button');
      if (btns.length) return btns[btns.length - 1];
      scope = scope.parentElement;
    }
    return null;
  }
  function toggleState(labelText) {
    const labels = findByText(document, labelText, true).filter((el) => el.offsetParent !== null);
    if (!labels.length) return { state: 'NOTFOUND', info: '' };
    const label = labels[labels.length - 1];
    let scope = label.parentElement;
    for (let depth = 0; depth < 3 && scope; depth++) {
      const sw = scope.querySelector('[role="switch"]');
      if (sw) {
        const ac = sw.getAttribute('aria-checked');
        return { state: ac === 'true' ? 'ON' : ac === 'false' ? 'OFF' : 'UNKNOWN', info: 'role=switch aria-checked=' + ac };
      }
      const sw2 = scope.querySelector('[class*="switch" i], [class*="Switch"]');
      if (sw2) {
        const c = String(sw2.className || '');
        const bg = getComputedStyle(sw2).backgroundColor || '';
        const on = /open|checked|active/i.test(c) || /rgb\(0,\s*1[89]\d/.test(bg) || /rgb\(7[0-9],\s*2[0-9]{2}/.test(bg);
        return { state: on ? 'ON' : 'OFF', info: 'class=' + c.slice(0, 80) + ' bg=' + bg };
      }
      scope = scope.parentElement;
    }
    return { state: 'UNKNOWN', info: '没找到开关' };
  }

  // ---------- 找会话行 ----------
  function findListContainer() {
    const input = document.querySelector('input[placeholder*="搜索"]');
    if (input) {
      let el = input;
      for (let i = 0; i < 6 && el; i++) {
        el = el.parentElement;
        if (el && el.scrollHeight > el.clientHeight + 20) return el;
      }
      if (input.closest('div')) return input.closest('div').parentElement || document.body;
    }
    return document.body;
  }
  function collectRows() {
    const container = findListContainer();
    const timeRe = /(\d+分钟前|\d+小时前|昨天|前天|周[一二三四五六日]|刚刚|\d{1,2}:\d{2}|\d+月\d+日)/;
    const rows = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      if (node === panel || panel.contains(node)) continue;
      const txt = (node.innerText || '').trim();
      if (!txt || txt.length > 200) continue;
      if (!timeRe.test(txt)) continue;
      // 行：包含名字 + 时间 + 预览，且没有更小的同类子元素
      const hasChildRow = Array.from(node.children).some((ch) => timeRe.test((ch.innerText || '').trim()) && (ch.innerText || '').trim().length > 10);
      if (hasChildRow) continue;
      const name = txt.split('\n')[0].trim();
      if (!name || name.length > 40) continue;
      rows.push({ el: node, name, text: txt });
    }
    // 去重（按名字）
    const uniq = [];
    const seen = new Set();
    for (const r of rows) {
      if (seen.has(r.name)) continue;
      seen.add(r.name);
      uniq.push(r);
    }
    return uniq;
  }

  // ---------- 扫描 ----------
  async function scan() {
    stopFlag = false;
    results.length = 0;
    seenNames.clear();
    log('开始扫描（只看不退）…');
    for (let round = 0; round < 4; round++) {
      if (stopFlag) break;
      if (captchaPresent()) { log('出现验证，已停止。'); return; }
      // 滚动列表加载更多
      const container = findListContainer();
      if (container && container.scrollTo) { container.scrollTop = container.scrollHeight; await sleep(1200); container.scrollTop = 0; await sleep(800); }
      const rows = collectRows();
      log('第 ' + (round + 1) + ' 轮：找到 ' + rows.length + ' 个会话行。');
      let newCount = 0;
      for (const row of rows) {
        if (stopFlag) break;
        if (captchaPresent()) { log('出现验证，已停止。'); return; }
        if (seenNames.has(row.name)) continue;
        seenNames.add(row.name);
        newCount++;
        try {
          row.el.click();
          await sleep(1500);
          const found = findGroupTitle();
          if (!found) { log('[' + row.name + '] 没看到“群名(人数)”标题，按单人私信处理，跳过。'); results.push({ name: row.name, isGroup: false }); continue; }
          const title = found.title;
          const m = title.match(/^(.*)\((\d+)\)\s*$/);
          const gname = m[1].trim();
          const count = m[2];
          // 点 ... 打开右侧面板
          const moreBtn = findMoreButton(found.el);
          if (moreBtn) { moreBtn.click(); await sleep(1000); }
          const pinned = toggleState('置顶聊天');
          const hasExit = findByText(document, '退出群聊').some((el) => el.offsetParent !== null);
          log('[' + gname + '] 群(' + count + '人) 置顶=' + pinned.state + ' 有退出入口=' + (hasExit ? '是' : '否') + ' (' + pinned.info + ')');
          results.push({ name: gname, isGroup: true, members: count, pinned: pinned.state, hasExit });
          // 关面板：按 Esc
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
          await sleep(600);
        } catch (e) {
          log('[' + row.name + '] 出错：' + e.message);
        }
        await sleep(800);
      }
      if (newCount === 0) break;
      await sleep(1000);
    }
    log('—— 扫描完成（未退任何群）——');
    const groups = results.filter((r) => r.isGroup);
    const toExit = groups.filter((r) => r.pinned === 'OFF' && r.hasExit);
    log('群聊共 ' + groups.length + ' 个；置顶 ' + groups.filter((r) => r.pinned === 'ON').length + ' 个；未置顶且有退出入口（可退）' + toExit.length + ' 个：' + toExit.map((r) => r.name).join('、'));
    log('未置顶但无退出入口：' + groups.filter((r) => r.pinned === 'OFF' && !r.hasExit).map((r) => r.name).join('、'));
    log('置顶状态不明：' + groups.filter((r) => r.pinned !== 'ON' && r.pinned !== 'OFF').map((r) => r.name).join('、'));
    window.__dqScanResults = results;
  }

  panel.querySelector('#dq-start').onclick = () => { scan(); };
  log('退群助手已加载。点“开始扫描”只扫描不退群。');
})();
