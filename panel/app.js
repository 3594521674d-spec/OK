// GitHub Pages 版面板：静态文件，接口指向阿里云 FC 网关。
// 与网关自带面板同一份源码，只改了接口地址与相对路径；密钥存在本源 localStorage，不进仓库。
const API_BASE = 'https://free-ll-gateway-ilghvenboz.cn-hangzhou.fcapp.run';
/*
 * 管理面板前端逻辑。
 *
 * ## 两个关键设计（都是踩过坑才这样写的）
 *
 * 1. **无密钥时也要有内容** —— 早期版本在没输密钥时什么都不加载，
 *    页面一片空白，用户以为「坏了」。现在显式显示「请填密钥」的引导卡片。
 *
 * 2. **密钥用 Authorization 头，不用 cookie** —— cookie 会被浏览器自动附带，
 *    需要额外的 CSRF 防护；Authorization 头不会，天然免疫。
 */
'use strict'

const $ = (id) => document.getElementById(id)

// ── 触碰反馈（v18 批次 4）：Android 上点按按钮/设置行/导航 tab 时轻震 10ms。
// 只在真实用户手势（click 事件同步回调）里调才有效，await 之后调无效；
// 先判 'vibrate' in navigator； iOS 从来没有 navigator.vibrate，不做假震动
// （不要碰 iOS 26.5 已封掉的开关 trick）。无震动马达的设备静默跳过。
if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
  document.addEventListener('click', (e) => {
    const t = e.target && e.target.closest ? e.target.closest('button, .settings-row, ion-tab-button, [role="button"]') : null
    if (t && !t.disabled) { try { navigator.vibrate(10) } catch (_) { /* 无马达或被禁就静默 */ } }
  }, { passive: true })
}

// ── Framework7（iOS 结构 + 动效 + 交互）──
// 读过 framework7.io/docs/ 全部核心页（app / sheet-modal / messages /
// messagebar / tabbar / list / toggle / segmented / preloader / touch）。
// F7 是 CDN 引进的静态 bundle；CDN 挂了也没事——下面所有调用都先判
// `typeof Framework7 !== 'undefined'`，面板退回原生的 hidden 开关。
// 抽屉 / 气泡 / 输入条的实例都存在这几个变量里，相关函数直接用。
let f7 = null
let f7SheetModal = null
let f7SheetInfo = null
let f7Messages = null
let f7Messagebar = null
if (typeof Framework7 !== 'undefined') {
  try {
    f7 = new Framework7({
      el: 'body',
      theme: 'ios',
      darkMode: true,
      colors: { primary: '#d9a441' },
      iosTranslucentBars: true,
      iosTranslucentModals: true,
      touch: { tapHold: true },
      activeState: true,
      touchHighlight: true,
      panel: { swipe: true },
    })
    document.documentElement.classList.add('ios', 'dark')
    // 抽屉：供应商弹窗 + 通用信息弹窗，下滑可关
    f7SheetModal = f7.sheet.create({ el: '#modal', swipeToClose: true, backdrop: true })
    f7SheetInfo = f7.sheet.create({ el: '#info-modal', swipeToClose: true, backdrop: true })
    // 对话：iOS 消息气泡
    f7Messages = f7.messages.create({ el: '#chat-messages' })
    // 输入条：自动长高的大圆角输入框
    f7Messagebar = f7.messagebar.create({ el: '#chat-composer', maxHeight: 120 })
    // 抽屉关完（包括下滑 / 点遮罩）才真正藏起来，并恢复标签条
    f7SheetModal.on('closed', () => { $('modal').hidden = true; resetModalTabs() })
    f7SheetInfo.on('closed', () => { $('info-modal').hidden = true })
  } catch (e) { f7 = null; f7SheetModal = null; f7SheetInfo = null; f7Messages = null; f7Messagebar = null }
}

/** 读取已保存的密钥。 */
function apiKey() {
  return localStorage.getItem('wb_api_key') || ''
}

/**
 * 统一的鉴权请求封装。
 * 401 时不抛错，而是返回 `{status:401}` 让调用方决定怎么提示。
 */
async function api(path, options) {
  const opts = Object.assign({}, options)
  opts.headers = Object.assign({}, opts.headers, { authorization: 'Bearer ' + apiKey() })
  let res
  try {
    res = await fetch(API_BASE + path, opts)
  } catch (e) {
    return { status: 0, ok: false, body: '网络错误：' + e.message }
  }
  const text = await res.text()
  let body
  try { body = JSON.parse(text) } catch { body = text }
  if (res.status === 401) setAuth('密钥无效或未设置', false)
  return { status: res.status, ok: res.ok, body: body }
}

/**
 * 设置顶部密钥状态。
 *
 * ⚠️ **用户要求删掉「密钥有效」** —— 顶部常态显示它没有信息量（能打开面板
 * 就说明密钥有效）。故现在：
 * - 成功时**整个 pill 隐藏**；
 * - 只有**出错**（密钥无效/未设置）时才显示，因为那时的提示是有用的。
 *
 * ⚠️ 用 `hidden` 属性而不是 `display:none` 内联样式：前者可被
 * `[hidden]` 的 CSS 规则统一处理，也不会在元素上留垃圾样式。
 */
function setAuth(message, ok) {
  const el = $('auth-status')
  if (ok) { el.hidden = true; el.textContent = ''; el.className = 'pill'; return }
  el.hidden = false
  el.textContent = message
  el.className = 'pill err'
}

function show(id, value) {
  const el = $(id)
  if (typeof value === 'string') { el.textContent = value; return }
  el.textContent = JSON.stringify(value, null, 2)
}

/** 清空元素（比 innerHTML='' 更明确，且不解析 HTML）。 */
function clear(el) { while (el.firstChild) el.removeChild(el.firstChild) }

/** 建一个计数块。 */
/**
 * 一个计数块。
 *
 * @param onClick 传了就变成可点击（并在 hover 时给出手型与提示），
 *   用于「冷却中 / 模型限流」—— 用户要求点开能看到**具体是哪些账号/模型**。
 *   计数本身说明不了问题：看到「冷却中 3」但不知道是哪 3 个，等于没信息。
 */
function countBlock(label, value, onClick) {
  const d = document.createElement('div')
  d.className = onClick ? 'count clickable' : 'count'
  const b = document.createElement('b'); b.textContent = String(value)
  const s = document.createElement('span'); s.textContent = label
  d.appendChild(b); d.appendChild(s)
  if (onClick) {
    d.title = '点击查看明细'
    d.onclick = onClick
  }
  return d
}

/** 打开通用信息弹窗。 */
function openInfo(title, nodes) {
  $('info-title').textContent = title
  const body = $('info-body')
  clear(body)
  if (nodes.length === 0) {
    const p = document.createElement('p'); p.className = 'hint'; p.textContent = '（无）'
    body.appendChild(p)
  } else for (const n of nodes) body.appendChild(n)
  $('info-modal').hidden = false
  if (f7SheetInfo) f7SheetInfo.open()
}

/** 把毫秒剩余时长说成人话。 */
function humanWait(ms) {
  if (ms <= 0) return '已恢复'
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s} 秒后恢复`
  const m = Math.round(s / 60)
  if (m < 60) return `${m} 分钟后恢复`
  return `${Math.round(m / 60)} 小时后恢复`
}

/** 建一个表格。`cols` 是列名，`rows` 是二维数组；数字列右对齐。 */
function buildTable(cols, rows, numericFrom) {
  const t = document.createElement('table')
  const head = document.createElement('tr')
  cols.forEach((c, i) => {
    const th = document.createElement('th')
    th.textContent = c
    if (numericFrom !== undefined && i >= numericFrom) th.className = 'num'
    head.appendChild(th)
  })
  t.appendChild(head)
  for (const r of rows) {
    const tr = document.createElement('tr')
    r.forEach((cell, i) => {
      const td = document.createElement('td')
      // ⚠️ 单元格可以是 `[显示文本, 悬浮全文]` 两元组。
      // 用途：表格里不得不截断的长文案（如失败原因），截断后仍能通过
      // `title` 悬浮看到全文 —— 否则用户只看到半句话，无从判断该怎么办。
      // ⚠️ 三种单元格形态（按优先级）：
      //   1. `{ node }` —— **富单元格**：直接插一个 DOM 节点（用于徽章等）；
      //   2. `[显示文本, 悬浮全文]` 两元组 —— 截断但保留全文；
      //   3. 普通值 —— 当文本。
      // ⚠️ `null` / `undefined` ⇒ **空单元格**（不渲染 "null" 字样）。
      // 用途：「该字段不存在」时留白，比播报「未标注」干净得多
      //（一列里 39/46 都是同一个词，看着像坏了）。
      const empty = cell === null || cell === undefined
      const rich = !empty && typeof cell === 'object'
        && !Array.isArray(cell) && 'node' in cell
      if (empty) {
        // 什么都不写 ⇒ 空单元格（见上方说明）
      } else if (rich) {
        td.appendChild(cell.node)
        if (cell.title !== undefined) td.title = String(cell.title)
      } else {
        const text = Array.isArray(cell) ? cell[0] : cell
        td.textContent = String(text)
        if (Array.isArray(cell) && cell[1]) td.title = String(cell[1])
      }
      if (numericFrom !== undefined && i >= numericFrom) td.className = 'num'
      tr.appendChild(td)
    })
    t.appendChild(tr)
  }
  return t
}

/**
 * 把表格包进一个可横向滚动的容器。
 *
 * ## ⚠️ 为什么必须包（用户报障「手机上界面超出屏幕」）
 *
 * `table { width: 100% }` 只表示「尽量占满」，而默认 `table-layout: auto`
 * 会按**内容的最小宽度**计算列宽 —— 表格里的长 uid、长模型名、长原因
 * 会把表撑得比屏幕还宽，于是整个页面横向溢出。
 *
 * 手机上处理宽表格的标准做法是**让表格自己横向滚动**，而不是让它撑破页面。
 * 故所有表格统一经过这里。
 */
function wrapTable(table) {
  const box = document.createElement('div')
  box.className = 'table-wrap'
  box.appendChild(table)
  return box
}

// ─────────────────────────── 视图切换 ───────────────────────────

const VIEW_LOADERS = {
  // ⚠️ 首页现在是对话（用户要求）：打开就是跟模型聊天的界面。
  chat: () => initChat(),
  // ⚠️ 设置是二级入口：只显示设置菜单，不拉数据；点菜单项再进各子视图。
  settings: () => {},
  // ⚠️ 仪表盘已退役（首页改成了对话，设置里也没有它）：保留 section 与
  // 加载器不动，免得删 id 牵连别处；导航与设置菜单都不再指向它。
  // 数据全部复用已有端点（用量 / 账号池 / API Key / 模型目录），不新增后端接口。
  dashboard: () => loadDashboard(),
  // ⚠️ 账号池已**并入**供应商视图（用户要求合并）：账号在各自的供应商弹窗里管理，
  // 顶层不再单独列一遍。
  providers: () => loadProviders(),
  // loadAccounts 现在只负责刷新「任务进度」的账号下拉（内部委托 loadTaskUids），
  // 故这里**只调它一个** —— 两个都调会对同一份账号列表白打两遍上游。
  tasks: () => loadAccounts(),
  usage: () => loadUsage(),
  apikeys: () => loadApiKeys(),
  // ⚠️ 已改为**自动加载**（用户要求）：进视图就拉目录，不必再点按钮。
  // 按钮随之改名为「刷新目录」—— 它的语义现在是「重新拉一次」而非「首次加载」。
  models: () => loadModels(),
  imagegen: () => initImageGen(),
  knowledge: () => initKB(),
  extract: () => initExtract(),
  config: () => loadConfig(),
  logs: () => loadLogs(),
}

// 顶层视图只有两个：首页（对话）与设置。其余旧视图是设置里的子视图，
// 由 openSettingsSection() 打开，不走 switchView。
const TOP_VIEWS = ['chat', 'settings']
// 设置里的子视图（顺序与设置菜单一致）。
const SUB_VIEWS = ['apikeys', 'usage', 'providers', 'tasks', 'models', 'logs', 'config', 'imagegen', 'knowledge', 'extract']
// 当前打开的子视图（'' 表示没有，停在设置菜单）。
let currentSubView = ''

/**
 * 切换顶层视图。
 *
 * ⚠️ 名字非法时**回退到 chat**，而不是静默不加载任何东西。
 * 历史上出现过「视图名不存在 → 加载器是 undefined → 页面空白」，
 * 而空白页面极难归因（用户只会说「坏了」）。宁可显示一个默认视图。
 */
/**
 * 视图切换动效（iOS 推入 / 返回 / tab 淡入，弹簧曲线在 CSS 里）。
 * 动画播完就把类摘掉，下次切换能重新播。
 */
function animateView(el, cls) {
  if (!el || !cls) return
  el.classList.remove('f7-push-in', 'f7-push-back', 'f7-tab-in')
  void el.offsetWidth
  el.classList.add(cls)
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true })
}
function switchView(name) {
  if (!TOP_VIEWS.includes(name)) {
    name = 'chat'
  }
  // 从设置子视图返回设置菜单时，用「向右滑回」的推回动效
  const fromSubView = currentSubView
  currentSubView = ''
  const back = $('settings-back')
  // 底部导航已撤（2026-11-16 用户：设置移到顶栏）：设置菜单里也留着
  // 左上角返回箭头，点它回首页；子视图里点它回设置菜单。
  if (back) {
    back.hidden = name !== 'settings'
    if (name === 'settings') back.title = '返回首页'
  }
  for (const btn of document.querySelectorAll('.nav-item')) {
    btn.classList.toggle('active', btn.dataset.view === name)
  }
  for (const sec of document.querySelectorAll('section.view')) {
    sec.hidden = sec.id !== 'view-' + name
  }
  localStorage.setItem('wb_view', name)
  animateView($('view-' + name), fromSubView && name === 'settings' ? 'f7-push-back' : 'f7-tab-in')
  const loader = VIEW_LOADERS[name]
  if (loader && apiKey() !== '') loader()
}

/**
 * 打开设置里的一个子视图（API Key / 用量 / 账号 / 任务 / 模型 / 日志 / 设置）。
 *
 * ⚠️ 子视图的 section 与旧代码**原样保留**（id、JS 钩子、API 调用全不动），
 * 只是不再挂在底部导航上；打开时把设置菜单藏起来、露出对应 section，
 * 并跑它原来的加载器。底部导航保持「设置」高亮，顶栏出现返回按钮。
 */
function openSettingsSection(name) {
  if (!SUB_VIEWS.includes(name)) return
  currentSubView = name
  const back = $('settings-back')
  if (back) { back.hidden = false; back.title = '返回设置' }
  for (const btn of document.querySelectorAll('.nav-item')) {
    btn.classList.toggle('active', btn.dataset.view === 'settings')
  }
  for (const sec of document.querySelectorAll('section.view')) {
    sec.hidden = sec.id !== 'view-' + name
  }
  localStorage.setItem('wb_view', 'settings')
  animateView($('view-' + name), 'f7-push-in')
  const loader = VIEW_LOADERS[name]
  if (loader && apiKey() !== '') loader()
}

// ─────────────────────────── 账号池 ───────────────────────────

/**
 * 账号池计数。
 *
 * ⚠️ 账号池视图已并入「供应商与账号」，故这里**不再有独立的 DOM 容器**。
 * 计数现在渲染在供应商视图顶部（见 loadProviders 的调用处）。
 * 保留此函数是为了让「导入/删除后刷新」的调用点不必到处改。
 */
async function loadPool() {
  const box = $('pool-counts')
  if (!box) return
  const counts = await fetchPoolCounts()
  const res = { ok: true, body: { counts } }
  clear(box)
  if (!res.ok || !res.body || !res.body.counts) return
  const c = res.body.counts
  box.appendChild(countBlock('总账号', c.total))
  box.appendChild(countBlock('可用', c.healthy))
  // ⚠️ 这两项**必须可点开**：只给一个数字，用户不知道是哪个账号/哪个模型，
  // 也就无法判断「该等一会」还是「该重新登录」。
  box.appendChild(countBlock('冷却中', c.cooling, () => showCoolingDetail()))
  box.appendChild(countBlock('模型限流', c.modelExempt, () => showModelThrottleDetail()))
  box.appendChild(countBlock('已禁用', c.disabled))
  // ⚠️ **「供应商」计数块紧跟「已禁用」右边**（用户要求：放在已禁用右边）。
  // 它复用 `countBlock` 的**同款样式**（不是另做一套）—— 视觉统一。
  // 数字是**已启用的供应商数**，点开调整顺序与开关。
  const enabledProviders = providerCache.filter((p) => !providerDisabled.has(p.id)).length
  box.appendChild(countBlock('供应商', enabledProviders, () => openProviderManager()))
}

/**
 * 「冷却中」明细：列出**每个**在冷却的账号，含供应商、uid、剩余时间、原因。
 *
 * ⚠️ 数据来自 `/admin/accounts`（它已带 `until` / `breakerUntil` / `degradeUntil` /
 * `coolKind` / `reason`），不需要新端点 —— 池计数的数字本来就是从这些算出来的。
 */
async function showCoolingDetail() {
  const accounts = await fetchAccounts()
  const res = { ok: true, body: { accounts } }
  if (!res.ok || !res.body) return openInfo('冷却中的账号', [])
  const now = Date.now()
  const hot = res.body.accounts.filter((a) => {
    const u = Math.max(a.until || 0, a.breakerUntil || 0, a.degradeUntil || 0)
    return u > now
  })
  hot.sort((a, b) => {
    const ua = Math.max(a.until || 0, a.breakerUntil || 0, a.degradeUntil || 0)
    const ub = Math.max(b.until || 0, b.breakerUntil || 0, b.degradeUntil || 0)
    return ub - ua
  })
  const rows = hot.map((a) => {
    const u = Math.max(a.until || 0, a.breakerUntil || 0, a.degradeUntil || 0)
    const kind = a.until === u ? '账号冷却' : a.breakerUntil === u ? '熔断' : '降权'
    const reason = a.reason || ''
    // ⚠️ 原因列在密集表格里仍截断，但**用两元组带上全文** ——
    // 表格内截断是为了不让一列把整张表撑得极宽，而 `title` 保证信息不丢。
    // 表格本身现在可横向滚动（见 style.css 的 .table-wrap > table 规则）。
    return [
      a.provider || '(默认)',
      shortUid(a.uid),
      `${humanWait(u - now)}（${new Date(u).toLocaleTimeString()}）`,
      kind,
      reason.length > 60 ? [reason.slice(0, 60) + '…', reason] : reason,
    ]
  })
  const nodes = []
  const tip = document.createElement('p')
  tip.className = 'hint'
  tip.textContent = '这些账号因连续失败被自动退避，到期后会自动恢复，无需人工干预。'
  nodes.push(tip)
  // ⚠️ 这两张表（冷却中 / 模型限流）列多且含长 uid、长原因，手机上最易横向溢出。
  // 统一走 wrapTable 让表格自己滚动。
  if (rows.length > 0) nodes.push(wrapTable(buildTable(['供应商', '账号', '剩余', '类型', '原因'], rows, [])))
  openInfo(`冷却中的账号（${rows.length}）`, nodes)
}

/**
 * 「模型限流」明细：列出**具体哪个账号的哪个模型**被限流。
 *
 * ⚠️ 与「冷却中」不同：模型限流是**按模型**记的（`modelCooldowns`），
 * 一个账号可以有多个模型各自限流。故这里按「账号 × 模型」展开成行。
 */
async function showModelThrottleDetail() {
  const accounts = await fetchAccounts()
  const res = { ok: true, body: { accounts } }
  if (!res.ok || !res.body) return openInfo('模型限流', [])
  const now = Date.now()
  const rows = []
  for (const a of res.body.accounts) {
    // 后端给的是 [{model, until, reason, hits}]；
    // 兼容纯字符串数组（旧格式），避免面板与后端版本错配时整个弹窗空掉。
    const raw = a.modelCooldowns
    const items = Array.isArray(raw)
      ? raw.map((m) => (typeof m === 'string' ? { model: m, until: 0 } : m))
      : Object.entries(raw || {}).map(([model, info]) => ({ model, ...(info || {}) }))
    for (const it of items) {
      const u = typeof it.until === 'number' ? it.until : 0
      const reason = it.reason ? String(it.reason) : ''
      rows.push([
        a.provider || '(默认)',
        shortUid(a.uid),
        it.model,
        u > now ? humanWait(u - now) : '已恢复',
        // 同「冷却中」：表格内截断，但用两元组带上全文供悬浮查看
        reason.length > 50 ? [reason.slice(0, 50) + '…', reason] : reason,
      ])
    }
  }
  const nodes = []
  const tip = document.createElement('p')
  tip.className = 'hint'
  tip.textContent = '这些「账号 + 模型」组合被上游限流，只会影响该组合，同一账号的其它模型仍可用。'
  nodes.push(tip)
  if (rows.length > 0) nodes.push(wrapTable(buildTable(['供应商', '账号', '模型', '剩余', '原因'], rows, [])))
  openInfo(`模型限流（${rows.length}）`, nodes)
}

/** uid 太长时截断显示（保留尾部，尾部才有区分度）。 */
function shortUid(uid) {
  const s = String(uid || '')
  // ⚠️ 手机上留 24 字符太占位（会把「剩余」「原因」两列挤到看不见）。
  // 尾部的 uid 才有区分度（前缀常是 `provider:` 这类固定串），故保留尾部。
  return s.length > 18 ? '…' + s.slice(-16) : s
}

/**
 * 取**两个 realm** 的账号并合并。
 *
 * ## ⚠️ 为什么必须查两个 realm（实测踩到）
 *
 * 账号按凭据的 `realm` 分片存放：WorkBuddy 国际版在 `global`，其余在 `cn`。
 * 面板原先一律只查 `?realm=cn` —— 于是**国际版登录成功后账号列表仍然是空的**，
 * 用户看到「该供应商下还没有账号」，而账号其实好好地存在 global 里。
 *
 * ⚠️ 合并顺序：`cn` 在前、`global` 在后，保证列表顺序稳定
 *（否则每次渲染顺序可能变，用户会以为列表在跳）。
 */
async function fetchAccounts() {
  const realms = ['cn', 'global']
  const all = []
  for (const realm of realms) {
    const res = await api(`/admin/accounts?realm=${realm}`)
    if (res.ok && res.body && Array.isArray(res.body.accounts)) {
      for (const a of res.body.accounts) all.push({ ...a, realm })
    }
  }
  return all
}

/**
 * 取两个 realm 的池计数并**相加**。
 *
 * 只报 `cn` 会让「总账号 9」而实际有 10 个（国际版那个不算），
 * 用户会以为账号丢了。
 */
async function fetchPoolCounts() {
  const total = { total: 0, healthy: 0, cooling: 0, modelExempt: 0, disabled: 0 }
  for (const realm of ['cn', 'global']) {
    const res = await api(`/admin/pool?realm=${realm}`)
    if (!res.ok || !res.body || !res.body.counts) continue
    for (const k of Object.keys(total)) total[k] += res.body.counts[k] || 0
  }
  return total
}

/**
 * 取两个 realm 的积分快照并合并账号数组。
 *
 * ⚠️ 不在这里相加总额：面板是按**供应商卡片**汇总的，
 * 相加会把不同供应商的积分混成一个数（静默算错）。
 */
/**
 * 积分查询结果的**短时缓存**。
 *
 * ## 为什么需要它
 *
 * `/admin/packages` 是**逐账号串行实时打上游**，实测 **16～41 秒**。
 * 而它的触发点是「打开某个供应商的账号弹窗」—— 用户会反复开关、来回切供应商。
 * 每次都真打一遍上游的代价是：
 * 1. **白等**（数据几乎不会在几秒内变化）；
 * 2. **白耗额度 + 触发风控** —— 本项目对此一贯保守（见 AGENTS.md 的风控纪律）。
 *
 * ⚠️ TTL 取 **60 秒**：短到数据基本可信，长到足以覆盖「反复开关弹窗」这个场景。
 * ⚠️ 缓存的是**整个 realm 的结果**，不是单账号 —— 一次请求本来就返回全部账号。
 * ⚠️ 不缓存失败：失败往往是**瞬时**的（上游慢/超时），缓存它会让用户
 * 在 60 秒内都看到「查询失败」，而重试本来就能好。
 */
const PACKAGES_CACHE_TTL_MS = 60_000
let packagesCache = null

async function fetchPackages(force) {
  const now = Date.now()
  if (force !== true && packagesCache !== null && now - packagesCache.at < PACKAGES_CACHE_TTL_MS) {
    return packagesCache.rows
  }
  const rows = await fetchPackagesUncached()
  // ⚠️ 只在**拿到东西**时缓存：全空可能是一次失败，缓存它会让用户白等 60 秒
  if (rows.length > 0) packagesCache = { at: now, rows }
  return rows
}

async function fetchPackagesUncached() {
  const accounts = []
  for (const realm of ['cn', 'global']) {
    const res = await api(`/admin/packages?realm=${realm}`)
    if (res.ok && res.body && Array.isArray(res.body.accounts)) {
      for (const a of res.body.accounts) accounts.push({ ...a, realm })
    }
  }
  return accounts
}

/**
 * 刷新任务中心的「账号」下拉（任务进度用）。
 *
 * ⚠️ 本函数**曾经**还会往 `#accounts` 里渲染账号卡片，但那个容器早已随
 * 「账号池并入供应商视图」一起删掉了，只剩下面两行：
 *
 *     const box = $('accounts')   // → null（index.html 里没有这个 id）
 *     clear(box)                  // → 抛 TypeError
 *
 * 这与 P0 那次「登录后空白」是**同一类缺陷**：删了元素没删引用。
 * 区别是这里被同视图的 `loadTaskUids()` 掩盖成了**静默失效** ——
 * 任务中心看着正常（下拉由 loadTaskUids 填），但本函数的后续逻辑一行都没执行，
 * 而导入 / 登录 / 删除后共 7 个调用点都在白调它。
 *
 * 现在它只做仍然需要的唯一一件事：刷新下拉。真正的填充逻辑复用
 * `loadTaskUids()`（它更严格：只列可用的 buddy 账号，且有明确的空状态文案）。
 *
 * 回归测试：panel.test.ts 里有一条不变式 —— `$('literal')` 引用的 id
 * 必须真实存在于 HTML，本行这类悬空引用会被直接拦下。
 */
async function loadAccounts() {
  await loadTaskUids()
}

let loginTimer = null

/**
 * 登录等待文案的**流程相关**后缀。
 *
 * ⚠️ 不同家的完成方式是**相反**的，不能共用一句文案：
 * - 设备码（buddy / workbuddy / qoder / zcode / cline）：用户在别处确认，本页等着即可；
 * - 浏览器回跳（codearts / trae）：上游会把浏览器打到**本服务**的提示页，
 *   而凭据要由**本面板的轮询**写入，所以用户必须回到本页
 *   （提示页上也没有写凭据的入口）。
 */
function loginWaitHint(providerId) {
  if (providerId === 'codearts') {
    return '\n\n（完成华为登录后浏览器会跳到本服务的提示页，请回到本面板等待，凭据会自动保存）'
  }
  if (providerId === 'trae') {
    return '\n\n（完成 TRAE 登录后浏览器会跳到本服务的提示页，请回到本面板等待，凭据会自动保存）'
  }
  return ''
}

/**
 * 渲染登录提示：**扫码**家显示二维码，**用户码**家显示用户码 + 链接，其余显示授权链接。
 *
 * ## ⚠️ 为什么必须抽成共享函数（实测踩到）
 *
 * 面板里有**两个**登录入口：
 * - （原先还有顶部「一键登录」区，已按用户要求**删除** —— 登录入口只在各供应商卡片内）
 * - 供应商弹窗的「添加账号」页（`startModalLogin`）
 *
 * 我第一版只给顶部的旧登录区加了扫码支持，忘了 `startModalLogin` ——
 * 于是用户在**弹窗里**发起商汤登录时，`res.body.qrSvg` 被完全忽略，
 * 代码去读不存在的 `res.body.authUrl`（扫码家不返回它），
 * 页面就显示 **`undefined`**。
 *
 * 两个入口渲染同一件事，就该调同一个函数 —— 否则必然再次分叉。
 */
function renderLoginPrompt(el, body, providerId) {
  const qrSvg = body.qrSvg
  const authUrl = body.authUrl
  const userCode = body.userCode

  // ── 设备码（**用户码**式：cline）──
  //
  // ⚠️ cline 的授权页要求用户**手输一个 user code**，故这里必须把 code
  // 显眼地展示出来。它既不是扫码（raccoon 的 `qrSvg`）也不是纯链接
  //（buddy / qoder 的 `authUrl`）—— 只给链接会让用户卡在「请输入代码」那一步。
  //
  // 链接优先用 `verificationUriComplete`（URL 里已带 code，用户少输一次），
  // 没有才回落到 `verificationUri`。
  if (typeof userCode === 'string' && userCode !== '') {
    const tip = document.createElement('div')
    tip.textContent = '请在浏览器打开下面的链接，并输入以下代码完成授权：'
    el.appendChild(tip)

    const codeBox = document.createElement('div')
    codeBox.className = 'user-code'
    codeBox.textContent = userCode
    el.appendChild(codeBox)

    const url = typeof body.verificationUriComplete === 'string' && body.verificationUriComplete !== ''
      ? body.verificationUriComplete
      : (typeof body.verificationUri === 'string' ? body.verificationUri : '')
    if (url !== '') {
      const a = document.createElement('a')
      a.href = url; a.target = '_blank'; a.rel = 'noreferrer noopener'
      a.textContent = '打开授权页面'
      el.appendChild(a)
      const hint = document.createElement('div')
      hint.className = 'hint'
      hint.textContent = '代码已填进链接时可直接确认，否则请手工输入上面的代码。'
      el.appendChild(hint)
    }

    // 轮询时只更新这段状态文字 —— 用户码必须留在页面上，不能被文字覆盖掉
    const status = document.createElement('div')
    status.textContent = '等待授权中…' + loginWaitHint(providerId)
    el.appendChild(status)
    el._loginStatus = status
    return
  }

  // ── 扫码登录（raccoon）：二维码由服务端渲染好，这里只负责显示 ──
  //
  // ⚠️ 这条路径**不需要用户打开任何链接**：掏出微信扫一下即可。
  // 与「打开浏览器 → 登录 → 等回跳」的家相比省掉一整步。
  // ⚠️ **`qrImageUrl` 与 `qrSvg` 是两种不同形态**，都要支持：
  //   · `qrSvg`（raccoon）—— 服务端**渲染好的 SVG 字符串**，插进 DOM；
  //   · `qrImageUrl`（loomy 微信）—— 微信官方图片端点的 **URL**，
  //     用 `<img src>` 显示（服务端不自己画二维码）。
  // 只支持其中一种会让另一家显示空白（本文件上方记过同类缺陷：
  // 「商汤登录显示 undefined」）。
  if (typeof body.qrImageUrl === 'string' && body.qrImageUrl !== '') {
    const tip = document.createElement('div')
    // ⚠️ 二维码是谁家的就写谁家：loomy 是微信，doubao 是豆包 App。
    // 写死「微信」会让豆包用户掏出微信扫一个扫不出的码。
    tip.textContent = providerId === 'doubao' ? '请用豆包 App 扫描下方二维码完成授权：' : '请用微信扫描下方二维码完成授权：'
    el.appendChild(tip)
    const box = document.createElement('div')
    box.className = 'qr-box'
    const img = document.createElement('img')
    // ⚠️ 图片来自微信官方端点；`alt` 必须有（图挂了也要能看出是什么）
    img.src = body.qrImageUrl
    img.alt = providerId === 'doubao' ? '豆包登录二维码' : '微信登录二维码'
    img.width = 180
    img.height = 180
    // ⚠️ 只带 referrerpolicy，**不带** crossorigin：微信该端点无 CORS 头，
    // 加 crossorigin 会让图片加载失败（而它不需要被 canvas 读取）。
    img.referrerPolicy = 'no-referrer'
    box.appendChild(img)
    el.appendChild(box)
    const status = document.createElement('div')
    status.textContent = '等待扫码…'
    el.appendChild(status)
    el._loginStatus = status
    return
  }
  if (typeof qrSvg === 'string' && qrSvg !== '') {
    const tip = document.createElement('div')
    tip.textContent = '请用微信扫描下方二维码完成授权：'
    el.appendChild(tip)

    const box = document.createElement('div')
    box.className = 'qr-box'
    // ⚠️ 统一走 setSvg()：它用 `DOMParser` 解析（**不用 innerHTML**），
    // 且对缺失的 `xmlns` 做了兜底注入。
    // 本项目的二维码 SVG 由 `raccoon-qr.ts` 生成、自带 xmlns，本来就能显示；
    // 但这里不再手写一份解析逻辑 —— 同一段代码出现了两遍就容易只修一处
    //（主题图标那次就是这样漏掉的）。
    setSvg(box, qrSvg)
    el.appendChild(box)

    const status = document.createElement('div')
    status.textContent = '等待扫码…'
    el.appendChild(status)
    // 轮询时只更新这段状态文字 —— 二维码必须留在页面上，不能被文字覆盖掉
    el._loginStatus = status

    if (typeof body.qrUrl === 'string' && body.qrUrl !== '') {
      const a = document.createElement('a')
      a.href = body.qrUrl; a.target = '_blank'; a.rel = 'noreferrer noopener'
      a.textContent = '（打不开二维码时点此）'
      el.appendChild(document.createElement('br'))
      el.appendChild(a)
    }
    return
  }

  // ── 链接式（设备码 / 浏览器回跳）──
  // 用 DOM API 构造（不把上游返回的 URL 拼进 innerHTML —— 那有注入风险）
  if (typeof authUrl !== 'string' || authUrl === '') {
    // 既不返回二维码也不返回链接 = 后端与前端版本不匹配，如实说明而不是显示 undefined
    el.textContent = '服务端未返回可用的登录方式（请刷新页面重试）。'
    return
  }
  el.textContent = '请在浏览器打开以下链接完成授权：\n' + authUrl + '\n\n等待授权中…' + loginWaitHint(providerId)
  const a = document.createElement('a')
  a.href = authUrl; a.target = '_blank'; a.rel = 'noreferrer noopener'
  a.textContent = '打开授权页面'
  el.appendChild(document.createElement('br'))
  el.appendChild(a)
}

// ─────────────────────────── 任务中心 ───────────────────────────

/**
 * 给「查进度」下拉填 buddy 账号。
 *
 * ⚠️ 任务只对**声明了动作表**的供应商跑，当前实际只有国内版 buddy
 * 有完整的自动任务链路，故这里筛出 buddy 的账号（两个 realm 都查，
 * 万一将来国际版也接了任务表就不用再改这里）。
 */
async function loadTaskUids() {
  const res = { ok: true, body: { accounts: await fetchAccounts() } }
  const sel = $('task-uid')
  if (!sel) return
  clear(sel)
  if (!res.ok) return
  const mine = (res.body.accounts || []).filter((a) => (a.provider || 'buddy') === 'buddy' && !a.disabled)
  for (const a of mine) {
    const o = document.createElement('option')
    o.value = a.uid
    o.textContent = (a.nickname || a.uid.slice(0, 12))
    sel.appendChild(o)
  }
  if (mine.length === 0) {
    const o = document.createElement('option')
    o.value = ''; o.textContent = '（没有可用的 buddy 账号）'
    sel.appendChild(o)
  }
}

/**
 * 积分缓存失效并立即重拉。
 *
 * ## ⚠️ 为什么必须做（用户报障「任务说完成了但积分没变化」）
 *
 * `loadProviderCredits` 只在**首次进视图**时拉一次（`creditsLoaded` 标记），
 * 之后靠缓存 —— 这是为了省掉反复真打上游的开销。
 * 但**签到与每日任务会真的改变积分**，跑完却still显示旧数字，
 * 用户就会以为「任务白做了」。
 *
 * 故凡是**会改积分的操作**（签到、每日任务）跑完都要调这里。
 */
function invalidateCredits() {
  creditsLoaded = false
  void loadProviderCredits()
}

/** 卡片一：全部供应商一键签到。 */
async function runCheckinAll() {
  const btn = $('run-checkin-all')
  btn.disabled = true
  show('task-result', '签到中（逐账号串行，需要一点时间）…')
  const res = await api('/admin/checkin/all', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ realm: 'cn' }),
  })
  btn.disabled = false
  if (!res.ok) { show('task-result', res.body); return }

  const d = res.body
  const lines = ['成功 ' + d.ok + ' · 跳过 ' + d.skipped + ' · 失败 ' + d.failed + '（共 ' + d.total + '）', '']
  for (const r of d.results) {
    // ⚠️ 跳过用 `⏭`（U+23ED，杂项技术符号区）在部分手机字体里**缺字形**，
    // 会渲染成空框。这里改用文字标记，语义更清楚且不依赖字体。
    // （✓ / ✕ 是文字标记，不依赖 emoji 字体，覆盖广。）
    const mark = r.ok ? '✓' : (r.skipped ? '－' : '✕')
    lines.push(mark + ' [' + r.provider + '] ' + (r.nickname || r.uid.slice(0, 16)))
    if (r.detail) lines.push('     ' + r.detail)
  }
  show('task-result', lines.join('\n'))
  loadAccounts(); loadProviders()
  // ⚠️ 签到会真的加积分，必须刷新缓存，否则卡片还显示旧数字
  invalidateCredits()
}

/** 卡片二：buddy 每日任务（签到 + 零消耗成长任务 + 领奖，全部做一遍）。 */
async function runDailyAll() {
  const btn = $('run-daily-all')
  btn.disabled = true
  show('task-result', '正在为全部 buddy 账号入队…')
  const res = await api('/admin/tasks/daily-all', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ realm: 'cn' }),
  })
  btn.disabled = false
  if (!res.ok) { show('task-result', res.body); return }

  const lines = []
  for (const st of res.body.started) {
    if (st.error) { lines.push('✕ ' + (st.nickname || st.uid.slice(0, 16)) + '：' + st.error); continue }
    lines.push('✓ ' + (st.nickname || st.uid.slice(0, 16)) + '：已入队 ' + st.queued + ' 步')
  }
  lines.push('')
  lines.push('任务由 Durable Object 按 alarm 逐步执行（每步间隔 1s+），稍后点「查进度」看结果。')
  show('task-result', lines.join('\n'))
  // ⚠️ 任务是**异步**跑的（DO 逐步执行），故这里先刷一次（可能还没加完），
  // 再排一个延时刷新把最终数字带上 —— 否则用户看到的永远是跑之前的余额。
  invalidateCredits()
  setTimeout(invalidateCredits, 45_000)
  setTimeout(invalidateCredits, 120_000)
  loadTaskUids()
}

/** 卡片三：星巴克运营活动 —— 查进度（只读，不领奖）。 */
async function runCampaignStatus() {
  const btn = $('run-campaign-status')
  btn.disabled = true
  show('task-result', '正在逐账号读活动进度…')
  const res = await api('/admin/campaign?realm=cn')
  btn.disabled = false
  if (!res.ok) { show('task-result', res.body); return }

  const d = res.body
  const lines = ['活动：星巴克（11 月 12 日 ~ 16 日）｜已有达标任务的账号 ' + d.accountsReady + ' 个', '']
  for (const a of d.accounts) {
    const name = a.nickname || (a.uid || '').slice(0, 16)
    if (a.skipped) { lines.push('－ ' + name + '：' + a.detail); continue }
    if (a.error) { lines.push('✕ ' + name + '：' + a.error); continue }
    lines.push((a.ready && a.ready.length > 0 ? '✓ ' : '· ') + name +
      '（' + (a.inPeriod ? '进行中' : '不在活动期') + '）')
    for (const t of a.tasks || []) {
      const mark = (a.ready || []).includes(t.taskCode) ? '✓ 可领' : (t.progress >= t.target && t.target > 0 ? '✓ 已领' : '')
      lines.push('     ' + t.taskCode + ' ' + t.progress + '/' + t.target +
        '（+' + t.rewardCredit + ' 积分）' + (mark ? ' ' + mark : ''))
    }
    for (const v of a.vouchers || []) {
      lines.push('     ' + v.title + '：' + v.status + (v.claimable ? '（可领）' : ''))
    }
  }
  show('task-result', lines.join('\n'))
}

/** 卡片三：星巴克运营活动 —— 一键领奖（只领已达标的）。 */
async function runCampaignClaim() {
  const btn = $('run-campaign-claim')
  btn.disabled = true
  show('task-result', '正在领奖（逐账号串行，需要一点时间）…')
  const res = await api('/admin/campaign/claim', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ realm: 'cn', dryRun: false }),
  })
  btn.disabled = false
  if (!res.ok) { show('task-result', res.body); return }

  const d = res.body
  const lines = ['领到 ' + d.claimedTotal + ' 个任务 · 共 +' + d.claimedCreditTotal + ' 积分', '']
  for (const r of d.rows) {
    const name = r.nickname || (r.uid || '').slice(0, 16)
    if (r.errors && r.errors.length > 0) lines.push('✕ ' + name + '：' + r.errors.join('；'))
    if (r.claimed && r.claimed.length > 0) lines.push('✓ ' + name + '：领了 ' + r.claimed.join('、') + '（+' + r.claimedCredit + ' 积分）')
    if (r.skipped && r.skipped.length > 0) lines.push('－ ' + name + '：' + r.skipped.join('；'))
    if ((!r.claimed || r.claimed.length === 0) && (!r.errors || r.errors.length === 0) && (!r.skipped || r.skipped.length === 0)) {
      lines.push('· ' + name + '：没有已达标的任务')
    }
  }
  show('task-result', lines.join('\n'))
  invalidateCredits()
}

async function loadTaskStatus(continuePolling) {
  const uid = $('task-uid').value
  if (!uid) return
  const res = await api('/admin/tasks/status?uid=' + encodeURIComponent(uid))
  if (!res.ok) { show('task-status', res.body); return }
  const status = res.body && res.body.status
  if (!status) { show('task-status', '还没有运行记录'); return }

  const lines = []
  lines.push('状态：' + (status.finished ? '已完成' : '进行中') +
    '｜队列剩余 ' + status.queue.length + '｜已完成 ' + status.done.length)
  if (status.lastError) lines.push('最后错误：' + status.lastError)
  lines.push('')
  for (const item of status.done) {
    lines.push((item.ok ? '✓ ' : '✕ ') + item.code + ' → ' + item.action)
    if (item.detail) lines.push('     ' + item.detail)
  }
  show('task-status', lines.join('\n'))
  if (continuePolling && !status.finished) setTimeout(() => loadTaskStatus(true), 5000)
}

// ─────────────────────────── 用量 ───────────────────────────

/**
 * 时间窗选项。
 *
 * ⚠️ `days` 与服务端约定一致（1 = 今日；0 = 全部）。用户明确要求
 * 「切换 1 天 / 7 天 / 30 天」，并选了「再加一个全部」。
 */
const USAGE_RANGES = [
  { key: 'today', label: '今日', days: 1 },
  { key: '7d', label: '近 7 天', days: 7 },
  { key: '30d', label: '近 30 天', days: 30 },
  { key: 'all', label: '全部', days: 0 },
]

/** 当前选中的时间窗（**记住用户选择**，刷新后不跳回默认）。 */
let usageRangeKey = localStorage.getItem('wb_usage_range') || 'today'
if (!USAGE_RANGES.some((r) => r.key === usageRangeKey)) usageRangeKey = 'today'

/** 当前窗口的 `days` 值。 */
function usageDays() {
  const hit = USAGE_RANGES.find((r) => r.key === usageRangeKey)
  return hit === undefined ? 1 : hit.days
}

/**
 * 一张 KPI 卡片（照参考项目：彩色图标章 + 大数字 + 带单位副标题）。
 *
 * @param tone - 色系：blue / purple / green / orange / cyan / pink / red
 * @param icon - 图标章里的单字符（不引图标库，避免打包体积与主题冲突）
 * @param label - 小号标签
 * @param value - **大号主数字**（已格式化）
 * @param sub - 副标题（**必须带单位**，见调用处的说明）
 *
 * 趋势不放在卡片上 —— 按天趋势在用量页的主图表里（`renderUsageTrend`）。
 */
function kpiCard(tone, icon, label, value, sub) {
  const card = document.createElement('div')
  card.className = 'kpi ' + tone
  const chip = document.createElement('div'); chip.className = 'kpi-chip'; chip.textContent = icon
  const lb = document.createElement('div'); lb.className = 'kpi-label'; lb.textContent = label
  const vv = document.createElement('div'); vv.className = 'kpi-value'; vv.textContent = value
  const sb = document.createElement('div'); sb.className = 'kpi-sub'; sb.textContent = sub
  card.appendChild(chip); card.appendChild(lb); card.appendChild(vv); card.appendChild(sb)
  return card
}

/**
 * 毫秒 → 人话（`1.2s` / `3分12秒`）。
 *
 * ⚠️ 旧版直接显示裸毫秒（`11856`），用户必须自己换算 —— 而本轮用户已经
 * 明确抱怨过「裸数字看不懂」。超过 1 秒就不该再给毫秒。
 */
function fmtDuration(ms) {
  const v = typeof ms === 'number' && Number.isFinite(ms) && ms >= 0 ? ms : 0
  if (v < 1000) return v + ' ms'
  const sec = v / 1000
  if (sec < 60) return sec.toFixed(1).replace(/\.0$/, '') + ' 秒'
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return m + ' 分 ' + s + ' 秒'
}

/** 千分位（避免 1234567 这种读不出来的数字）。 */
function fmtNum(n) {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : 0
  return v.toLocaleString('zh-CN')
}

/**
 * token 数量的紧凑格式（`1.2M` / `34.5k`）。
 *
 * ⚠️ 只用于**柱子标签**这种空间紧张处；汇总卡片仍用千分位全量 ——
 * 汇总处用户要的是精确值，紧凑格式会丢掉有效数字。
 */
function fmtTokensShort(n) {
  const v = typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : 0
  if (v >= 1e9) return (v / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
  if (v >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(v)
}

/**
 * 日键 `YYYY-MM-DD` → 短标签 `MM-DD`（非法输入给空串，由调用方降级）。
 */
function dayShortLabel(day) {
  if (typeof day !== 'string' || day.length < 10) return ''
  const m = day.slice(5, 7)
  const d = day.slice(8, 10)
  return /^\d{2}$/.test(m) && /^\d{2}$/.test(d) ? `${m}-${d}` : ''
}

/**
 * 渲染时间窗切换（分段控件）。
 *
 * ⚠️ 一次性建好按钮，切换时只改 `active` 类 —— 不每次重建 DOM，
 * 这样点击手感与焦点都不会丢。
 */
function renderUsageRanges() {
  const box = $('usage-range')
  clear(box)
  for (const r of USAGE_RANGES) {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'button' + (r.key === usageRangeKey ? ' button-active' : '')
    b.textContent = r.label
    b.onclick = () => {
      if (usageRangeKey === r.key) return
      usageRangeKey = r.key
      localStorage.setItem('wb_usage_range', r.key)
      void loadUsage()
    }
    box.appendChild(b)
  }
}

/**
 * 按天趋势柱（照参考实现 `token-ledger-panel.js` 的取舍）。
 *
 * ⚠️ **缺数据的天不补零**：补零要造日历序列，会让「近 30 天」在数据稀疏时
 * 出现一长排空柱，观感差且信息量为零。
 *
 * ⚠️ **柱高必须有上限**（参考实现记录的真实缺陷）：单日窗口下「今日」
 * 既是最大值又是它自己，比值恒为 1 ⇒ 高度 100% ⇒ 唯一那根柱撑满容器，
 * 看着像「一整条白块」。故最大值那根留白、其余压进 [保底, 上限] 区间。
 */
function renderUsageTrend(byDay, windowDays) {
  const box = $('usage-trend')
  const title = $('usage-trend-title')
  const panel = $('usage-trend-panel')
  const note = $('usage-trend-note')
  clear(box)
  box.classList.remove('series')

  const bars = Array.isArray(byDay) ? byDay : []

  // ## 🔴 「今日」窗口**直接隐藏整个按天趋势面板**（用户明确要求）
  //
  // 今日窗口只有**一根柱** —— 那既不构成「趋势」，观感也差
  //（单根柱要么被拉成整条白块，要么孤零零杵着）。
  // 旧版还留着面板 + 一句说明，用户看到的就是「今日 + 一根柱」。
  //
  // ⚠️ 用 `hidden` 隐藏**整个面板**（含标题），而不是只清空内容 ——
  // 留一个空标题比不显示更让人困惑。
  // ⚠️ 单日窗口下这段时间的信息由下方「按小时」承担（那个才有意义）。
  if (windowDays === 1) {
    panel.hidden = true
    return
  }
  panel.hidden = false
  title.textContent = '按天趋势'
  note.textContent = bars.length > 0 ? `${bars.length} 天有记录` : ''

  if (bars.length === 0) {
    const p = document.createElement('p'); p.className = 'hint'
    p.textContent = '该窗口内没有请求记录（用 /v1/chat/completions 发一次对话就会出现）'
    box.appendChild(p)
    return
  }

  // ≥2 天：画多序列曲线图（总计/输入/输出），不用竖柱
  if (bars.length >= 2) {
    const pts = [...bars].reverse().map((b) => ({
      label: dayShortLabel(b.day),
      input: b.input || 0, output: b.output || 0, total: b.tokens || 0,
    }))
    renderSeriesChart(box, pts)
    return
  }

  const maxTokens = Math.max(0, ...bars.map((b) => b.tokens))
  const count = bars.length
  const todayKey = bars[0] && bars[0].day ? bars[0].day : ''
  for (const b of bars) {
    const col = document.createElement('div')
    col.className = 'trend-col'
    col.title = `${b.day}\n请求 ${fmtNum(b.count)}（失败 ${fmtNum(b.failed)}）\n`
      + `输入 ${fmtNum(b.input)} · 输出 ${fmtNum(b.output)}`

    const val = document.createElement('span'); val.className = 'trend-val'
    val.textContent = b.tokens > 0 ? fmtTokensShort(b.tokens) : ''

    const track = document.createElement('div'); track.className = 'trend-track'
    const fill = document.createElement('div')
    fill.className = 'trend-fill' + (b.failed > 0 ? ' bad' : '')
    // 柱高：数量为 0 时给 0（不画），否则按比例 + 保底
    let pct = 0
    if (b.tokens > 0 && maxTokens > 0) {
      if (count <= 1) pct = 72
      else pct = Math.round(4 + (b.tokens / maxTokens) * 84)
      pct = Math.min(88, Math.max(4, pct))
    }
    fill.style.height = pct > 0 ? pct + '%' : '2px'
    if (pct === 0) fill.classList.add('empty')
    track.appendChild(fill)

    const lab = document.createElement('span'); lab.className = 'trend-label'
    lab.textContent = dayShortLabel(b.day)
    if (b.day === todayKey) lab.classList.add('today')

    col.appendChild(val); col.appendChild(track); col.appendChild(lab)
    box.appendChild(col)
  }
}

/** 渲染「按小时」（仅今日窗口有意义）。 */
function renderUsageHours(byHour, windowDays) {
  const box = $('usage-hours')
  const title = $('usage-hours-title')
  const panel = $('usage-hours-panel')
  clear(box)

  // ## 非「今日」窗口 ⇒ **整个面板隐藏**（用户明确要求：不显示那个框）
  //
  // ⚠️ 跨天的小时标签会互相覆盖（两个不同的「09:00」），合并起来没有解释力，
  // 故这段时间本来就不该有内容。
  // ⚠️ 上一版留着**面板 + 一句说明**，用户反馈那是「一个没用的框」——
  // 隐藏**整个面板**（含标题）才是对的：留个空标题 + 说明比不显示更碍眼。
  if (windowDays !== 1) {
    panel.hidden = true
    return
  }
  panel.hidden = false
  title.textContent = '按小时（今日）'
  const hours = Array.isArray(byHour) ? byHour : []
  if (hours.length === 0) {
    const p = document.createElement('p'); p.className = 'hint'
    p.textContent = '今天还没有请求记录。'
    box.appendChild(p)
    return
  }
  const maxCount = Math.max(1, ...hours.map((h) => h.count))
  for (const h of hours) {
    const row = document.createElement('div'); row.className = 'bar-row'
    const label = document.createElement('span'); label.className = 'bar-label'; label.textContent = h.hour
    const track = document.createElement('div'); track.className = 'bar-track'
    const fill = document.createElement('div')
    fill.className = 'bar-fill' + (h.failed > 0 ? ' bad' : '')
    fill.style.width = Math.round((h.count / maxCount) * 100) + '%'
    track.appendChild(fill)
    // ⚠️⚠️ **必须带单位**。旧版只渲染一个裸 `count`（如「22」「21」），
    // 用户原话：「这个每小时用量的 21 24 是什么意思」—— 完全看不出是
    // 请求数还是 token 数。现在明确写「22 次请求」+ 该小时的 token 量。
    const val = document.createElement('span'); val.className = 'bar-val'
    val.textContent = fmtNum(h.count) + ' 次请求'
      + (h.failed ? `（失败 ${fmtNum(h.failed)}）` : '')
    val.title = `${h.hour}：${fmtNum(h.count)} 次请求`
      + (h.failed ? `，失败 ${fmtNum(h.failed)} 次` : '')
      + `\n输入 ${fmtNum(h.input ?? 0)} tokens · 输出 ${fmtNum(h.output ?? 0)} tokens`
    // 该小时的 token 量单独一列（原来完全没有，用户不知道每小时花了多少）
    const tok = document.createElement('span'); tok.className = 'bar-tokens'
    const tot = (h.input ?? 0) + (h.output ?? 0)
    tok.textContent = tot > 0 ? fmtTokensShort(tot) + ' tok' : '—'
    row.appendChild(label); row.appendChild(track); row.appendChild(val); row.appendChild(tok)
    box.appendChild(row)
  }
  // 表头（否则右侧那两个数字仍然要靠猜）
  const head = document.createElement('div'); head.className = 'bar-row bar-head'
  for (const t of ['时段', '', '请求数', 'Tokens']) {
    const c = document.createElement('span'); c.textContent = t; head.appendChild(c)
  }
  box.insertBefore(head, box.firstChild)
}

/**
 * 加载用量。
 *
 * ## 🔴 这个页面曾经「数字永远不动」（用户报「用量怎么始终是 500」）
 *
 * 那不是 HTTP 500 —— 是旧后端的 `total` **撞上了明细环形缓冲的上限**
 *（500 条），且**没有时间窗概念**。现在后端汇总走**按天聚合**（保留 90 天），
 * 窗口内的数字不再被封顶，且支持四个窗口。
 *
 * ⚠️ 页面必须**如实说明两份数据的边界**（明细 500 条 / 聚合 90 天）——
 * 否则用户会拿「明细列表只有 12 行」去质疑「总数 300」。
 */
async function loadUsage() {
  renderUsageRanges()
  const days = usageDays()

  // ⚠️ 两个 realm 都查并**相加**：只查 cn 会漏掉国际版（workbuddy）的用量。
  // 串行请求（同时出站连接上限 6，且并行没有收益）。
  const parts = []
  for (const realm of ['cn', 'global']) {
    const res = await api(`/admin/usage?realm=${realm}&days=${days}`)
    if (res.ok) parts.push(res.body)
  }
  if (parts.length === 0) {
    const box = $('usage-summary'); clear(box)
    const p = document.createElement('p'); p.className = 'hint'
    p.textContent = '加载失败（密钥或网络问题）。'
    box.appendChild(p)
    return
  }

  // 合并两个 realm 的结果
  const sum = (k) => parts.reduce((n, p) => n + (typeof p[k] === 'number' ? p[k] : 0), 0)
  const mergeDims = (key, idKey) => {
    const map = new Map()
    for (const p of parts) {
      for (const row of (p[key] || [])) {
        const id = row[idKey]
        const cur = map.get(id) || { count: 0, input: 0, output: 0, failed: 0 }
        cur.count += row.count; cur.input += row.input
        cur.output += row.output; cur.failed += row.failed
        map.set(id, cur)
      }
    }
    return [...map.entries()]
      .map(([id, v]) => Object.assign({ [idKey]: id }, v))
      .sort((a, b) => b.count - a.count)
  }
  const byDayMap = new Map()
  for (const p of parts) {
    for (const b of (p.byDay || [])) {
      const cur = byDayMap.get(b.day) || { day: b.day, count: 0, failed: 0, input: 0, output: 0, tokens: 0 }
      cur.count += b.count; cur.failed += b.failed
      cur.input += b.input; cur.output += b.output; cur.tokens += b.tokens
      byDayMap.set(b.day, cur)
    }
  }
  const byHourMap = new Map()
  for (const p of parts) {
    for (const h of (p.byHour || [])) {
      const cur = byHourMap.get(h.hour) || { hour: h.hour, count: 0, failed: 0 }
      cur.count += h.count; cur.failed += h.failed
      byHourMap.set(h.hour, cur)
    }
  }

  const total = sum('total')
  const ok = sum('ok')
  const failed = sum('failed')
  const inputTokens = sum('inputTokens')
  const outputTokens = sum('outputTokens')
  const avgMs = total === 0 ? 0 : Math.round(parts.reduce((n, p) => n + p.avgMs * p.total, 0) / total)
  const windowDays = parts[0].windowDays
  // ## 🔴 **不能把两个 realm 的 `activeDays` 相加**（用户报「7 天却显示 8 天有记录」）
  //
  // 每个 realm 各返回自己窗口内的活跃天数，而两个 realm 的天数会**重叠**
  //（同一天 cn 与 global 都可能有用量）。相加会把重叠的天算两遍 ——
  // 实测 7 天窗口：cn=7 + global=3 = **10**，而窗口本身只有 7 天。
  // 极端情况 1 天窗口：两边当天都有 ⇒ 1+1 = **2 天**（用户看到的就是这个）。
  //
  // ⇒ 正确做法是**按日键去重**。而 `byDayMap` 恰好已经按 `b.day` 合并过了，
  // 故活跃天数就是它的 size —— 这也与「按天趋势」柱数天然一致
  //（两处用同一个事实，不会出现「N 天有记录」与柱子数对不上）。
  const activeDays = byDayMap.size

  // ── KPI 卡片（照 cpa-usage-keeper 的观感：大数字 + 彩色图标章 + 带单位副标题）──
  //
  // ⚠️ 每条副标题都**必须带单位**。旧版这里只写裸数字，而「按小时」那处更糟 ——
  // 只渲染 `count` 一个数，用户看到「21」「24」完全不知道是请求数还是 token
  //（用户原话：「这个每小时用量的 21 24 是什么意思」）。
  const box = $('usage-summary')
  clear(box)
  // ⚠️⚠️ `rangeLabel` **必须在使用之前声明**。
  //
  // 我上一轮加 KPI 卡时把它用在了声明之前 —— `const` 有 TDZ，
  // 于是 `loadUsage` 一执行就抛 `Cannot access 'rangeLabel' before initialization`，
  // **整个用量页空白**（用户报「直接加载不出来了」）。
  //
  // ⚠️ 教训：这类错误**语法检查发现不了**（`new Function()` 也照样通过，
  // 因为它是**运行时**错误）。改渲染顺序时必须确认所有 `const` 都在使用点之前。
  const rangeLabel = (USAGE_RANGES.find((r) => r.key === usageRangeKey) || {}).label || '今日'
  const successRate = total === 0 ? 0 : (ok / total) * 100

  box.appendChild(kpiCard('blue', 'Σ', rangeLabel + '总请求', fmtNum(total),
    `${activeDays} 天有记录`))
  box.appendChild(kpiCard('green', '✓', '成功', fmtNum(ok),
    `成功率 ${successRate.toFixed(1)}%`))
  // ⚠️ 图标用 `×`（U+00D7，拉丁字母区，所有字体都有），**不要**用
  // `✕`（U+2715，杂项符号区）—— 项目实测后者在部分手机字体缺字形、
  // 会渲染成空框（单测明确禁止，见 tests/panel.test.ts 的 RISKY 列表）。
  // 这与本项目其它地方（能力标签）的约定一致。
  box.appendChild(kpiCard(failed > 0 ? 'red' : 'cyan', '×', '失败', fmtNum(failed),
    failed > 0 ? `占 ${((failed / total) * 100).toFixed(1)}%` : '无失败'))
  box.appendChild(kpiCard('purple', '↓', '输入 token', fmtTokensShort(inputTokens),
    fmtNum(inputTokens) + ' tokens'))
  box.appendChild(kpiCard('pink', '↑', '输出 token', fmtTokensShort(outputTokens),
    fmtNum(outputTokens) + ' tokens'))
  box.appendChild(kpiCard('orange', '时', '平均耗时', fmtDuration(avgMs),
    fmtNum(total) + ' 次请求的平均'))
  // （原先这里有一段「数据边界说明」，按用户要求**删除**。
  //   用户原话：「切换天数下面不要显示说明，能看懂」。
  //   ⚠️ 信息本身没丢：`activeDays` 已作为「总请求」卡的副标题 ——
  //   它能回答「这段时间有多少天真的用过」，正是说明里唯一有用的那部分。）

  renderUsageTrend([...byDayMap.values()].sort((a, b) => b.day.localeCompare(a.day)), windowDays)
  renderUsageHours([...byHourMap.values()].sort((a, b) => a.hour.localeCompare(b.hour)), windowDays)

  // ── 排名列表（照参考项目：序号 + 占比条 + 行内指标）──
  //
  // ⚠️ 从「表格」改成「排名行」的理由：表格只给绝对数字，而用户真正想知道的
  // 是**「谁占大头」** —— 占比条一眼就能看出来，表格要自己心算。
  // 参考项目的 Top Models 就是这种形态。
  renderUsageRanking($('usage-models'), mergeDims('byModel', 'model'), 'model',
    (r) => r.model)
  renderUsageRanking($('usage-accounts'), mergeDims('byAccount', 'uid'), 'uid',
    (r) => r.uid)
}

/**
 * 渲染一个「排名列表」（照参考项目的 Top Models / Usage Distribution）。
 *
 * 每行：`序号徽章 · 名称 · 占比条 · 数值 · 请求数 · 失败数`
 *
 * @param box - 容器
 * @param rows - 已按 count 降序的行
 * @param key - 行的标识字段名（用于 title）
 * @param labelOf - 从行取展示名
 */
function renderUsageRanking(box, rows, key, labelOf) {
  clear(box)
  if (!Array.isArray(rows) || rows.length === 0) {
    const p = document.createElement('p'); p.className = 'hint'; p.textContent = '无数据'
    box.appendChild(p)
    return
  }
  const max = Math.max(1, ...rows.map((r) => r.count))
  const totalCount = rows.reduce((n, r) => n + r.count, 0)
  rows.forEach((r, i) => {
    const row = document.createElement('div'); row.className = 'rank-row'
    row.title = `${labelOf(r)}\n请求 ${fmtNum(r.count)} 次`
      + `\n输入 ${fmtNum(r.input)} tokens · 输出 ${fmtNum(r.output)} tokens`
      + (r.failed > 0 ? `\n失败 ${fmtNum(r.failed)} 次` : '')

    // 序号（前三名高亮，照参考项目的排名徽章）
    const rank = document.createElement('span')
    rank.className = 'rank-idx' + (i < 3 ? ' top' + (i + 1) : '')
    rank.textContent = String(i + 1)

    const main = document.createElement('div'); main.className = 'rank-main'
    const head = document.createElement('div'); head.className = 'rank-head'
    const name = document.createElement('span'); name.className = 'rank-name'
    name.textContent = labelOf(r)
    const share = document.createElement('span'); share.className = 'rank-share'
    // ⚠️ 占比用**总请求数**做分母（不是 max）——「占多少」问的是整体份额，
    // 而条的**宽度**用 max 归一（让第一名铺满，视觉上更好读）。
    share.textContent = totalCount === 0 ? '' : ((r.count / totalCount) * 100).toFixed(1) + '%'
    head.appendChild(name); head.appendChild(share)
    // 占比条
    const track = document.createElement('div'); track.className = 'rank-track'
    const fill = document.createElement('div')
    fill.className = 'rank-fill' + (r.failed > 0 ? ' bad' : '')
    fill.style.width = Math.round((r.count / max) * 100) + '%'
    track.appendChild(fill)
    main.appendChild(head); main.appendChild(track)

    const metrics = document.createElement('div'); metrics.className = 'rank-metrics'
    const mk = (v, t) => { const e = document.createElement('span'); e.textContent = v; if (t) e.title = t; return e }
    metrics.appendChild(mk(fmtNum(r.count) + ' 次请求'))
    metrics.appendChild(mk(fmtTokensShort(r.input + r.output) + ' tok'))
    if (r.failed > 0) {
      const f = mk(fmtNum(r.failed) + ' 失败')
      f.className = 'rank-failed'
      metrics.appendChild(f)
    }

    row.appendChild(rank); row.appendChild(main); row.appendChild(metrics)
    box.appendChild(row)
  })
}

// ─────────────────────────── 仪表盘 ───────────────────────────

/**
 * 仪表盘（首页，照观澜 AI 的版式：统计卡 → 筛选条 → 图表行 → 最近使用 + 快捷操作）。
 *
 * ⚠️ 数据全部复用已有端点（用量 / 账号池 / API Key / 模型目录），不新增后端接口。
 * ⚠️ 用量合并口径与 loadUsage 完全一致（两 realm 相加、按日键去重算活跃天数），
 *    只是这里自成一份加载函数 —— 不重构 loadUsage，避免动到正在跑的用量页。
 * ⚠️ 总积分**不在**仪表盘上（`/admin/packages` 是逐账号实时打上游，实测 16～41 秒，
 *    放首页会让仪表盘每次打开都白等几十秒）；账号数与冷却数是本地快接口，随时可看。
 */
let dashActionsBound = false

/** 仪表盘的时间窗切换（与用量页共用 `usageRangeKey`，两边口径一致）。 */
function renderDashRanges() {
  const box = $('dash-range')
  if (!box) return
  clear(box)
  for (const r of USAGE_RANGES) {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'button' + (r.key === usageRangeKey ? ' button-active' : '')
    b.textContent = r.label
    b.onclick = () => {
      if (usageRangeKey === r.key) return
      usageRangeKey = r.key
      localStorage.setItem('wb_usage_range', r.key)
      void loadDashboard()
    }
    box.appendChild(b)
  }
}

/** 快捷操作只绑一次（onclick 赋值本身是幂等的，但守卫更直白）。 */
function bindDashActions() {
  if (dashActionsBound) return
  dashActionsBound = true
  const refresh = $('refresh-dashboard')
  if (refresh) refresh.onclick = () => void loadDashboard()
  const createKey = $('qa-create-key')
  if (createKey) createKey.onclick = () => {
    openSettingsSection('apikeys')
    const b = $('create-apikey')
    if (b) b.click()
  }
  const checkin = $('qa-checkin')
  if (checkin) checkin.onclick = () => openSettingsSection('tasks')
  const usage = $('qa-usage')
  if (usage) usage.onclick = () => openSettingsSection('usage')
}

async function loadDashboard() {
  renderDashRanges()
  bindDashActions()
  const days = usageDays()
  const rangeLabel = (USAGE_RANGES.find((r) => r.key === usageRangeKey) || {}).label || '今日'

  // ── 用量（两 realm 相加；与 loadUsage 同一套合并口径）──
  const parts = []
  for (const realm of ['cn', 'global']) {
    const res = await api(`/admin/usage?realm=${realm}&days=${days}`)
    if (res.ok) parts.push(res.body)
  }
  const sum = (k) => parts.reduce((n, p) => n + (typeof p[k] === 'number' ? p[k] : 0), 0)
  const mergeDims = (key, idKey) => {
    const map = new Map()
    for (const p of parts) {
      for (const row of (p[key] || [])) {
        const id = row[idKey]
        const cur = map.get(id) || { count: 0, input: 0, output: 0, failed: 0 }
        cur.count += row.count; cur.input += row.input
        cur.output += row.output; cur.failed += row.failed
        map.set(id, cur)
      }
    }
    return [...map.entries()]
      .map(([id, v]) => Object.assign({ [idKey]: id }, v))
      .sort((a, b) => b.count - a.count)
  }
  const byDayMap = new Map()
  for (const p of parts) {
    for (const b of (p.byDay || [])) {
      const cur = byDayMap.get(b.day) || { day: b.day, count: 0, failed: 0, input: 0, output: 0, tokens: 0 }
      cur.count += b.count; cur.failed += b.failed
      cur.input += b.input; cur.output += b.output; cur.tokens += b.tokens
      byDayMap.set(b.day, cur)
    }
  }
  const byHourMap = new Map()
  for (const p of parts) {
    for (const h of (p.byHour || [])) {
      const cur = byHourMap.get(h.hour) || { hour: h.hour, count: 0, failed: 0, input: 0, output: 0 }
      cur.count += h.count; cur.failed += h.failed
      cur.input += h.input || 0; cur.output += h.output || 0
      byHourMap.set(h.hour, cur)
    }
  }
  const total = sum('total')
  const ok = sum('ok')
  const failed = sum('failed')
  const inputTokens = sum('inputTokens')
  const outputTokens = sum('outputTokens')
  const avgMs = total === 0 ? 0 : Math.round(parts.reduce((n, p) => n + p.avgMs * p.total, 0) / total)
  const windowDays = parts.length > 0 ? parts[0].windowDays : days
  // ⚠️ 活跃天数按日键去重（与 loadUsage 同一原因：两 realm 的天数会重叠，相加会算两遍）。
  const activeDays = byDayMap.size
  const successRate = total === 0 ? 0 : (ok / total) * 100
  const byDayDesc = [...byDayMap.values()].sort((a, b) => b.day.localeCompare(a.day))
  const byHourAsc = [...byHourMap.values()].sort((a, b) => a.hour.localeCompare(b.hour))
  const byModel = mergeDims('byModel', 'model')

  // ── 账号池 / API Key / 模型（本地快接口，不打上游）──
  const counts = await fetchPoolCounts()
  let keyTotal = 0
  let keyEnabled = 0
  const kr = await api('/admin/apikeys')
  if (kr.ok) {
    const keys = (kr.body && kr.body.keys) || []
    keyTotal = keys.length
    keyEnabled = keys.filter((k) => k.enabled).length
  }
  let modelTotal = 0
  const mr = await api('/v1/models')
  if (mr.ok) modelTotal = ((mr.body && mr.body.data) || []).length

  // ── 8 张统计卡（2 行 × 4 列，照观澜的卡片模板）──
  const box = $('dash-summary')
  clear(box)
  if (parts.length === 0) {
    const p = document.createElement('p'); p.className = 'hint'
    p.textContent = '加载失败（密钥或网络问题）。'
    box.appendChild(p)
    return
  }
  box.appendChild(kpiCard('blue', 'Σ', rangeLabel + '总请求', fmtNum(total),
    `${activeDays} 天有记录`))
  box.appendChild(kpiCard('green', '✓', '成功', fmtNum(ok),
    `成功率 ${successRate.toFixed(1)}%`))
  box.appendChild(kpiCard('purple', '↓', rangeLabel + ' Token', fmtTokensShort(inputTokens + outputTokens),
    `输入 ${fmtNum(inputTokens)} · 输出 ${fmtNum(outputTokens)}`))
  box.appendChild(kpiCard('orange', '时', '平均耗时', fmtDuration(avgMs),
    fmtNum(total) + ' 次请求的平均'))
  // ⚠️ 图标用汉字单字（户/钥/型）：符号区字符在部分手机字体会缺字形变空框，
  // 汉字在中文用户手机上一定有字形，且一眼能读懂。
  box.appendChild(kpiCard('cyan', '户', '账号', fmtNum(counts.total),
    `${fmtNum(counts.healthy)} 可用 · ${fmtNum(counts.cooling)} 冷却中`))
  box.appendChild(kpiCard('pink', '钥', 'API 密钥', fmtNum(keyTotal),
    `${fmtNum(keyEnabled)} 启用`))
  box.appendChild(kpiCard('blue', '型', '模型', fmtNum(modelTotal),
    '可用模型数'))
  box.appendChild(kpiCard(failed > 0 ? 'red' : 'green', '×', '失败', fmtNum(failed),
    failed > 0 ? `占 ${((failed / total) * 100).toFixed(1)}%` : '无失败'))
  // 渲染的实物 moment：工作台卡挂在第一张 KPI 卡（总请求）里
  attachPoolCard()

  renderDashTrend(byDayDesc, byHourAsc, windowDays)
  renderUsageRanking($('dash-models'), byModel, 'model', (r) => r.model)
  renderDashRecent(byDayDesc, rangeLabel)
}

/**
 * 平滑曲线路径（Catmull-Rom 转贝塞尔），供多序列曲线图用。
 * @param {Array<{x:number,y:number}>} pts
 * @returns {string} SVG path 的 `d`
 */
function smoothPath(pts) {
  if (pts.length === 0) return ''
  if (pts.length === 1) return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

/**
 * 多序列曲线图（unslop 仪表盘 after 的主图表做法）。
 *
 * 三条曲线各代表一个序列 —— 总计（强调色领头）、输入（琥珀）、输出（绿），
 * 每种颜色都有含义；下方是同数据的灰色镜像（mirrored grey comparison）。
 * 数据来自现成的按天 / 按小时聚合（input / output / total），不改后端。
 * SVG 经 setSvg（DOMParser）注入；图例用 DOM API 建。
 *
 * @param {HTMLElement} box - 容器（调用方已清空；会加 `.series` 类）
 * @param {Array<{label:string,input:number,output:number,total:number}>} pts
 *   升序（左→右），至少 2 点
 */
function renderSeriesChart(box, pts) {
  box.classList.add('series')
  clear(box)
  // 图例（DOM API）
  const legend = document.createElement('div')
  legend.className = 'series-legend'
  const items = [['dot-total', '总计'], ['dot-in', '输入'], ['dot-out', '输出']]
  for (const [cls, label] of items) {
    const item = document.createElement('span')
    item.className = 'series-item'
    const dot = document.createElement('i')
    dot.className = 'series-dot ' + cls
    item.appendChild(dot)
    item.appendChild(document.createTextNode(label))
    legend.appendChild(item)
  }
  box.appendChild(legend)

  const W = 640, H = 240, ML = 46, MR = 10, PT = 12, BASE = 140
  const n = pts.length
  const maxV = Math.max(1, ...pts.map((p) => p.total || 0)) * 1.08
  const X = (i) => ML + (i * (W - ML - MR)) / (n - 1)
  const Y = (v) => BASE - ((v || 0) / maxV) * (BASE - PT)
  const series = [
    { key: 'total', values: pts.map((p) => p.total || 0) },
    { key: 'in', values: pts.map((p) => p.input || 0) },
    { key: 'out', values: pts.map((p) => p.output || 0) },
  ]
  // 网格线与 Y 轴刻度（0 / 25% / 50% / 75% / 100%）
  let grid = ''
  for (let f = 0; f <= 4; f++) {
    const y = BASE - (f / 4) * (BASE - PT)
    const val = (maxV * f) / 4
    grid += `<line class="series-grid" x1="${ML}" y1="${y.toFixed(1)}" x2="${W - MR}" y2="${y.toFixed(1)}"/>`
    grid += `<text class="series-lab" x="${ML - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end">${f === 0 ? '0' : fmtTokensShort(Math.round(val))}</text>`
  }
  // X 轴标签（最多约 6 个，避免挤；尾点一定标）
  const stride = Math.max(1, Math.ceil(n / 6))
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  let xlab = ''
  for (let i = 0; i < n; i += stride) {
    xlab += `<text class="series-lab" x="${X(i).toFixed(1)}" y="228" text-anchor="middle">${esc(pts[i].label)}</text>`
  }
  if ((n - 1) % stride !== 0) {
    xlab += `<text class="series-lab" x="${X(n - 1).toFixed(1)}" y="228" text-anchor="middle">${esc(pts[n - 1].label)}</text>`
  }
  let body = grid
  body += `<line class="series-axis" x1="${ML}" y1="${BASE}" x2="${W - MR}" y2="${BASE}"/>`
  for (const s of series) {
    const pp = s.values.map((v, i) => ({ x: X(i), y: Y(v) }))
    const line = smoothPath(pp)
    const area = line + ` L ${X(n - 1).toFixed(1)} ${BASE} L ${X(0).toFixed(1)} ${BASE} Z`
    // 镜像：绕基线翻转并压扁（0.55），灰色
    const mp = pp.map((p) => ({ x: p.x, y: BASE + (BASE - p.y) * 0.55 }))
    const mirror = smoothPath(mp)
    body += `<path d="${area}" class="sa-${s.key}" fill-opacity="0.07" stroke="none"/>`
    body += `<path d="${line}" class="sp-${s.key}" fill="none" stroke-width="7" stroke-linecap="round" opacity="0.22"/>`
    body += `<path d="${line}" class="sp-${s.key}" fill="none" stroke-width="2.5" stroke-linecap="round"/>`
    body += `<path d="${mirror}" class="s-mirror" fill="none" stroke-width="2" stroke-linecap="round" opacity="0.3"/>`
  }
  body += xlab
  const host = document.createElement('div')
  setSvg(host, `<svg class="series-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="按时间趋势：总计、输入、输出 token">${body}</svg>`)
  box.appendChild(host)
}

/**
 * 渲染的实物 moment（unslop 仪表盘 after 的做法）：
 * 一张用代码建的工作台卡，放在仪表盘第一张 KPI 卡（总请求）里 ——
 * 两张叠放的卡、微转，有芯片与卡号，像一张真实的卡。
 * 只挂仪表盘（#dash-summary），用量页不动；kpiCard 本身不改（仍 5 参数）。
 */
function attachPoolCard() {
  const first = document.querySelector('#dash-summary .kpi')
  if (!first || first.querySelector('.pool-card')) return
  first.classList.add('has-poolcard')
  const wrap = document.createElement('div')
  wrap.className = 'pool-card'
  wrap.setAttribute('aria-hidden', 'true')
  const back = document.createElement('div')
  back.className = 'pool-card-back'
  const front = document.createElement('div')
  front.className = 'pool-card-front'
  const top = document.createElement('div')
  top.className = 'pool-card-top'
  const chip = document.createElement('span')
  chip.className = 'pool-chip'
  setSvg(chip, '<svg viewBox="0 0 20 16" width="20" height="16" aria-hidden="true"><rect x="1" y="1" width="18" height="14" rx="3" fill="#d8a93c"/><path d="M7 1v14M13 1v14M1 8h18" stroke="#8a6a1f" stroke-width="1" fill="none"/></svg>')
  const name = document.createElement('span')
  name.className = 'pool-name'
  name.textContent = 'page工作台'
  top.appendChild(chip); top.appendChild(name)
  const num = document.createElement('div')
  num.className = 'pool-num'
  num.textContent = '•••• •••• •••• 4821'
  const bottom = document.createElement('div')
  bottom.className = 'pool-card-bottom'
  const kind = document.createElement('span')
  kind.className = 'pool-kind'
  kind.textContent = 'POOL'
  const seal = document.createElement('span')
  seal.className = 'pool-seal'
  seal.textContent = '算'
  bottom.appendChild(kind); bottom.appendChild(seal)
  front.appendChild(top); front.appendChild(num); front.appendChild(bottom)
  wrap.appendChild(back); wrap.appendChild(front)
  first.appendChild(wrap)
}

/**
 * 仪表盘的趋势区。
 *
 * ⚠️ 与用量页不同：这里**不隐藏**面板 —— 今日窗口画「按小时」曲线，
 * 多日窗口画「按天趋势」曲线，仪表盘永远有一张图可看。
 * 曲线是多序列（总计/输入/输出），见 renderSeriesChart；
 * 数据不足 2 点时才回落到旧的柱/条。
 */
function renderDashTrend(byDayDesc, byHourAsc, windowDays) {
  const trendBox = $('dash-trend')
  const hoursBox = $('dash-hours')
  const title = $('dash-trend-title')
  const note = $('dash-trend-note')
  if (!trendBox || !hoursBox) return
  clear(trendBox)
  clear(hoursBox)
  trendBox.classList.remove('series'); hoursBox.classList.remove('series')

  if (windowDays === 1) {
    title.textContent = '按小时（今日）'
    note.textContent = ''
    const hours = Array.isArray(byHourAsc) ? byHourAsc : []
    if (hours.length === 0) {
      const p = document.createElement('p'); p.className = 'hint'
      p.textContent = '今天还没有请求记录。'
      hoursBox.appendChild(p)
      return
    }
    // ≥2 小时：画多序列曲线图（总计/输入/输出），不用横条
    if (hours.length >= 2) {
      const pts = hours.map((h) => ({
        label: h.hour,
        input: h.input || 0, output: h.output || 0,
        total: (h.input || 0) + (h.output || 0),
      }))
      renderSeriesChart(hoursBox, pts)
      return
    }
    const maxCount = Math.max(1, ...hours.map((h) => h.count))
    for (const h of hours) {
      const row = document.createElement('div'); row.className = 'bar-row'
      const label = document.createElement('span'); label.className = 'bar-label'; label.textContent = h.hour
      const track = document.createElement('div'); track.className = 'bar-track'
      const fill = document.createElement('div')
      fill.className = 'bar-fill' + (h.failed > 0 ? ' bad' : '')
      fill.style.width = Math.round((h.count / maxCount) * 100) + '%'
      track.appendChild(fill)
      const val = document.createElement('span'); val.className = 'bar-val'
      val.textContent = fmtNum(h.count) + ' 次请求' + (h.failed ? `（失败 ${fmtNum(h.failed)}）` : '')
      const tok = document.createElement('span'); tok.className = 'bar-tokens'
      const tot = (h.input || 0) + (h.output || 0)
      tok.textContent = tot > 0 ? fmtTokensShort(tot) + ' tok' : '—'
      row.appendChild(label); row.appendChild(track); row.appendChild(val); row.appendChild(tok)
      hoursBox.appendChild(row)
    }
    return
  }

  title.textContent = '按天趋势'
  note.textContent = byDayDesc.length > 0 ? `${byDayDesc.length} 天有记录` : ''
  const bars = Array.isArray(byDayDesc) ? byDayDesc : []
  if (bars.length === 0) {
    const p = document.createElement('p'); p.className = 'hint'
    p.textContent = '该窗口内没有请求记录（用 /v1/chat/completions 发一次对话就会出现）'
    trendBox.appendChild(p)
    return
  }
  // ≥2 天：画多序列曲线图（总计/输入/输出），不用竖柱
  if (bars.length >= 2) {
    const pts = [...bars].reverse().map((b) => ({
      label: dayShortLabel(b.day),
      input: b.input || 0, output: b.output || 0, total: b.tokens || 0,
    }))
    renderSeriesChart(trendBox, pts)
    return
  }
  const maxTokens = Math.max(0, ...bars.map((b) => b.tokens))
  const count = bars.length
  const todayKey = bars[0] && bars[0].day ? bars[0].day : ''
  for (const b of bars) {
    const col = document.createElement('div')
    col.className = 'trend-col'
    col.title = `${b.day}\n请求 ${fmtNum(b.count)}（失败 ${fmtNum(b.failed)}）\n`
      + `输入 ${fmtNum(b.input)} · 输出 ${fmtNum(b.output)}`
    const val = document.createElement('span'); val.className = 'trend-val'
    val.textContent = b.tokens > 0 ? fmtTokensShort(b.tokens) : ''
    const track = document.createElement('div'); track.className = 'trend-track'
    const fill = document.createElement('div')
    fill.className = 'trend-fill' + (b.failed > 0 ? ' bad' : '')
    let pct = 0
    if (b.tokens > 0 && maxTokens > 0) {
      if (count <= 1) pct = 72
      else pct = Math.round(4 + (b.tokens / maxTokens) * 84)
      pct = Math.min(88, Math.max(4, pct))
    }
    fill.style.height = pct > 0 ? pct + '%' : '2px'
    if (pct === 0) fill.classList.add('empty')
    track.appendChild(fill)
    const lab = document.createElement('span'); lab.className = 'trend-label'
    lab.textContent = dayShortLabel(b.day)
    if (b.day === todayKey) lab.classList.add('today')
    col.appendChild(val); col.appendChild(track); col.appendChild(lab)
    trendBox.appendChild(col)
  }
}

/** 仪表盘的「最近使用」：按天倒序的前 5 天（照观澜的空状态文案）。 */
function renderDashRecent(byDayDesc, rangeLabel) {
  const box = $('dash-recent')
  const note = $('dash-recent-note')
  if (!box) return
  clear(box)
  if (note) note.textContent = rangeLabel
  const rows = Array.isArray(byDayDesc) ? byDayDesc.slice(0, 5) : []
  if (rows.length === 0) {
    const wrap = document.createElement('div'); wrap.className = 'empty-state'
    const t = document.createElement('p'); t.className = 'empty-title'; t.textContent = '暂无使用记录'
    const s = document.createElement('p'); s.className = 'hint'
    s.textContent = '开始使用 API 后，您的使用历史将显示在这里。'
    wrap.appendChild(t); wrap.appendChild(s)
    box.appendChild(wrap)
    return
  }
  for (const d of rows) {
    const row = document.createElement('div'); row.className = 'recent-row'
    const day = document.createElement('span'); day.className = 'recent-day'
    day.textContent = dayShortLabel(d.day) || d.day
    const cnt = document.createElement('span'); cnt.className = 'recent-count'
    cnt.textContent = fmtNum(d.count) + ' 次请求'
    const tok = document.createElement('span'); tok.className = 'recent-tok'
    tok.textContent = fmtTokensShort(d.tokens) + ' tok'
    const rate = document.createElement('span'); rate.className = 'recent-rate'
    rate.textContent = d.count === 0 ? '—' : (((d.count - d.failed) / d.count) * 100).toFixed(1) + '% 成功'
    row.appendChild(day); row.appendChild(cnt); row.appendChild(tok); row.appendChild(rate)
    box.appendChild(row)
  }
}

// ─────────────────────────── 模型 ───────────────────────────



/**
 * 计费倍率徽章（照参考 fork 的观感：彩色药丸 + 人话）。
 *
 * ⚠️ 三态语义**必须区分**（`priceFactor` 的约定）：
 *   · `0`        ⇒ **免费**
 *   · 有限值      ⇒ `x N` 倍率
 *   · `Infinity` ⇒ **不可用 / 未标倍率**（**不是免费**）
 * 把 Infinity 显示成「免费」会误导用户去调一个其实要计费的模型。
 */
function priceBadge(factor) {
  const span = document.createElement('span')
  const free = factor === 0
  const unknown = !Number.isFinite(factor) && factor !== 0
  if (unknown) {
    // ⚠️⚠️ **不能说「不可用」** —— 实测这些模型**能正常调通**，
    // 它们只是该家没下发倍率字段（如 opencode 这类）。
    //
    // ⚠️ 更不该**满屏都写「未标注」** —— 那看着像坏了。
    // 一列里绝大多数都是同一个「未知」时，**留空**比重复 39 次更有信息量：
    // 空白一眼就知道「这列对我这批模型没意义」。
    // ⚠️ 返回 `null` 而不是空标签：空标签仍会占一格宽度，
    // 整列看着就是一片小方框。`null` 让表格**什么都不渲染**。
    return null
  } else if (free) {
    span.className = 'tag ok'
    span.textContent = '免费'
    span.title = '免费额度模型'
  } else {
    span.className = 'tag warn'
    span.textContent = 'x' + factor.toLocaleString('zh-CN')
    span.title = '计费倍率 ' + factor
  }
  return { node: span, title: span.title }
}

/**
 * 模型目录页。
 *
 * ⚠️ **自动加载**（用户要求）：进视图就拉，不必再点按钮。
 * 按钮语义随之改成「刷新目录」—— 它现在是「重新拉一次」而不是「首次加载」。
 */
async function loadModels() {
  const box = $('models')
  clear(box)
  const p = document.createElement('p'); p.className = 'hint'; p.textContent = '加载中…'
  box.appendChild(p)

  const res = await api('/v1/models')
  clear(box)
  if (!res.ok) {
    const e = document.createElement('p'); e.className = 'hint'
    e.textContent = '加载失败（密钥或网络问题）'
    box.appendChild(e)
    return
  }
  const data = (res.body && res.body.data) || []
  if (data.length === 0) {
    const e = document.createElement('p'); e.className = 'hint'
    e.textContent = '没有可用模型（可能所有账号都在冷却，或全部模型被停用）'
    box.appendChild(e)
    return
  }

  // ⚠️ 列顺序照参考 fork：**模型 id 在最左**（用户最先看它），
  // 然后名称 / 所属提供商 / 倍率 / 状态。
  // ⚠️ 名称缺失时**回落到 id** —— 少一个字段不该渲染出空单元格
  //（实测反馈：整列空白看起来像渲染失败）。
  const rows = data.map((m) => {
    // realm 是 `'*'` 表示聚合（跨分片汇总）
    return [
      m.id,
      m.name || m.id,
      m.providerName || (m.owned_by === 'aggregate' ? '聚合（跨渠道）' : '—'),
      // ⚠️ 模型类型（`/v1/models` 透传的 `kind`）：对话 / 生图 / 生视频。
      // 缺省是对话 —— 老客户端与聚合条目没有这个字段，不能显示成空白。
      m.kind === 'image' ? '生图' : m.kind === 'video' ? '生视频' : '对话',
      // ⚠️ **`isFree` 优先于 `priceFactor`**（用户要求「免费用绿色显示免费」）。
      //
      // ## 🔴 这是我上一版「好多不显示」的真正原因
      //
      // `cline` 有 **21 个 `cline-free/*` 模型**，其 `isFree` 已被 provider
      // 正确算出（`recommended-models` 是免费集合的权威来源），但这家
      // **不下发 `credits`** ⇒ `priceFactor` 是 undefined ⇒ 倍率列**一片空白**。
      // 而「免费」这个事实**本来就有**，只是被塞在另一列的文字里。
      //
      // ⚠️ 故这里让 `isFree` **压过** `priceFactor`：免费就是免费，
      // 不管上游有没有给倍率。
      // ⚠️ **聚合条目不给倍率**（用户要求）—— 它的倍率是「各候选里最便宜的那个」，
      // 那是个**推导值**而非上游事实；显示它会让用户以为聚合自己有报价。
      // 聚合的价值是「自动挑渠道」，倍率对它没有决策意义。
      m.owned_by === 'aggregate' || String(m.id).startsWith('aggregate/')
        ? null
        : priceBadge(m.isFree === true
          ? 0
          : (m.priceFactor === undefined ? Number.POSITIVE_INFINITY : m.priceFactor)),
    ]
  })
  box.appendChild(wrapTable(buildTable(
    // ⚠️ 「区域」列已去掉（用户要求）—— 它只区分国内/国际，
    // 对日常选模型没有决策价值，却占一格宽度。
    ['模型 id', '名称', '所属提供商', '类型', '计费倍率'], rows,
  )))

  const note = document.createElement('p'); note.className = 'hint'
  note.textContent = `共 ${data.length} 个模型`
  // ⚠️ 如实说明「倍率」的来源，免得用户以为它是上游的权威报价：
  // 它是从模型**名字的后缀**（`· x0.05`）解析出来的，没标就是「不可用」。
  // ⚠️ 说明必须**与实际数据源一致**：倍率现在取自**上游下发的 `credits` 字段**，
  // 不再是从名字里抠 —— 旧文案写的「取自模型名后缀」「标不可用」都已过时。
  note.textContent += '。计费倍率来自上游下发的字段；留空的表示该供应商未提供倍率'
  box.appendChild(note)
}

// ─────────────────────────── 供应商 ───────────────────────────

/** 能力标签（只显示 ✓/✕ + 名称，**不显示说明文案**）。 */
/**
 * 卡片上展示的能力标签。
 *
 * ⚠️ 刻意**不列** `listModels` 与 `chat` —— 所有 12 个变体都支持这两项，
 * 每个卡片都挂两个永远为 ✓ 的标签只是噪音，反而淹没了真正有区分度的
 * 「登录 / 余额 / 签到」。
 */
const CAPS = [
  ['login', '设备码登录'],
  ['balance', '查余额'],
  ['checkin', '每日签到'],
]

/**
 * 登录方式**不是标准设备码轮询**的供应商：卡片标签与弹窗标题要写实际方式。
 *
 * ⚠️ 为什么必须有它：codearts 与 trae 都是**浏览器回跳**式登录（把浏览器的授权
 * 结果打回本服务的 `/login/<家>/callback/<state>`），与设备码轮询完全不是一回事。
 * 标签写成「设备码登录」会误导用户去找一个并不存在的设备码。
 *
 * ⚠️ cline 也是设备码，但它是**用户码**式：用户要先把一个短码抄进授权页，
 * 与 buddy/qoder 那种「点开链接就完事」的体验不同，故标签写明「用户码登录」，
 * 让用户在点之前就知道要准备抄一串代码。
 * 其余家（buddy / workbuddy / qoder / zcode）确实都是标准设备码轮询。
 *
 * ⚠️ **它同时决定面板是否把该家放进「添加账号」下拉**（见 `loadProviders`）——
 * 但入选条件是 `capabilities.login === true`，与本表无关；本表只改**显示文案**。
 * 也就是说：把 trae 加进来只是让它显示成「浏览器登录」，
 * 真正让它出现在下拉里的是 `trae.ts` 的 `capabilities.login = true`。
 */
const LOGIN_KIND_LABEL = { codearts: '浏览器登录', trae: '浏览器登录', raccoon: '微信扫码', cline: '用户码登录', loomy: '短信验证码登录', doubao: '豆包扫码' }

/** 缓存的供应商目录（弹窗要用）。 */
let providerCache = []
/** 服务端的面板设置：展示顺序 与 已关闭的供应商。 */
let providerOrder = []
let providerDisabled = new Set()

/**
 * 各供应商的剩余总积分（**每张卡片右上角**）。
 *
 * ⚠️ 未登录（该供应商没有账号）时**不显示徽标** ——
 * 显示「0」会让用户以为额度用光了，而真实情况是还没加账号。
 *
 * ⚠️ 逐账号查余额是**真打上游**的操作，故只在用户点「刷新」或
 * 主动触发时执行（`refreshCredits`），不在每次切视图时自动跑 ——
 * 否则会无谓地消耗上游配额并可能触发风控。
 */
let creditCache = {}
/** 是否已成功拉过一次积分（避免每次切视图都真打上游）。 */
let creditsLoaded = false
/** 各供应商的账号数（决定是否要自动关闭模型）。 */
let accountCounts = {}

async function loadProviderCredits() {
  const accounts = await fetchPackages()
  const res = { ok: true, body: { accounts } }
  if (!res.ok || !res.body || !Array.isArray(res.body.accounts)) return
  const byProvider = {}
  for (const a of res.body.accounts) {
    if (a.error || typeof a.total !== 'number') continue
    const pid = a.provider || 'buddy'
    byProvider[pid] = (byProvider[pid] || 0) + a.total
  }
  creditCache = byProvider
  creditsLoaded = true
  // 只更新徽标，不重建整张卡片（避免闪烁）
  for (const [pid, total] of Object.entries(byProvider)) {
    const el = document.querySelector(`.prov-card[data-provider="${pid}"] .prov-credits`)
    if (el) { el.hidden = false; el.textContent = total.toLocaleString('zh-CN') }
  }
}

async function loadProviders() {
  // ⚠️⚠️ **`loadPool()` 不能在这里调**（见下方它的新位置）。
  //
  // ## 🔴 为什么（实测缺陷：「供应商」计数首屏恒为 0）
  //
  // `loadPool()` 末尾要用 `providerCache` 算「已启用的供应商数」，
  // 而 `providerCache` 要到本函数**后面**（`await api('/admin/providers')`
  // 之后）才被赋值。原先在这里同步调用它 ⇒ 读到的是模块级初值 `[]`
  // ⇒ **首屏恒显示「0 供应商」**，而下方明明渲染了 13 张卡片，自相矛盾。
  //
  // ⚠️ 这不是偶发：`loadPool` 内部 `await fetchPoolCounts()` 至少要等两个
  // 网络往返，**必然**晚于这里对 `providerCache` 的读取 ⇒ 100% 复现。
  //（点一次「刷新」会正确，因为那时 `providerCache` 已被上一轮填好了 ——
  //  这种「刷新一下就好」的症状最容易被当成偶发抖动放过去。）
  //
  // ⇒ 把 `loadPool()` 移到 `providerCache` / `providerDisabled` 赋值**之后**。

  // 先取各供应商的账号数（决定是否自动关闭模型 + 卡片是否显示积分）
  accountCounts = {}
  // ⚠️ 必须合并两个 realm：国际版账号在 global，
  // 只数 cn 会让卡片显示「0 个账号」，从而误判成「这家没登录」。
  for (const a of await fetchAccounts()) {
    const pid = a.provider || 'buddy'
    accountCounts[pid] = (accountCounts[pid] || 0) + 1
  }
  // ⚠️ 首次进入视图时要自动拉一次积分，否则卡片右上角永远是空的
  //（之前只在点「刷新」时才拉 —— 用户看到的就是「有账号也不显示余额」）。
  if (!creditsLoaded) void loadProviderCredits()
  const res = await api('/admin/providers')
  const box = $('providers')
  clear(box)
  if (!res.ok) {
    const p = document.createElement('p'); p.className = 'hint'; p.textContent = '加载失败'; box.appendChild(p)
    // ⚠️ 供应商列表取失败时**仍要渲染计数**（否则整块统计栏是空的，
    //    用户连「有多少账号」都看不到）——此时用已有的 `providerCache` 兜底。
    loadPool()
    // 额度区块独立于供应商列表，失败时也照常拉。
    loadGenQuota()
    return
  }
  providerCache = res.body.providers || []
  // ⚠️ 面板设置（顺序 + 已关闭的家）来自**服务端** —— 「关闭」是真的关掉
  //（模型从 /v1/models 消失、且拒绝路由），不是浏览器本地偏好。
  providerOrder = Array.isArray(res.body.order) ? res.body.order : []
  providerDisabled = new Set(Array.isArray(res.body.disabled) ? res.body.disabled : [])

  // ⚠️ **到这里 `providerCache` / `providerDisabled` 才就绪**，
  // 现在调 `loadPool()` 才能算出正确的「供应商」计数（见函数开头的说明）。
  // 不 await：计数是独立的次要请求，不该拖住下面的卡片渲染。
  loadPool()

  // ⚠️ **按服务端设置排序**：`providerOrder` 是用户拖出来的顺序，
  // 不在里面的（新加的供应商）**按注册表原顺序追加在后面** ——
  // 这样新供应商出现时不会「插队」到用户排好的前面，也不会消失。
  const ordered = []
  const seen = new Set()
  for (const id of providerOrder) {
    const p = providerCache.find((x) => x.id === id)
    if (p !== undefined) { ordered.push(p); seen.add(id) }
  }
  for (const p of providerCache) if (!seen.has(p.id)) ordered.push(p)

  for (const prov of ordered) {
    // 卡片：名称 + id + 能力标签
    const card = document.createElement('div')
    // ⚠️ 已关闭的家加 `off` 类：面板要能一眼看出「这家我关了」，
    // 而不是以为它坏了（它只是**按你的选择**不参与）。
    card.className = 'prov-card' + (providerDisabled.has(prov.id) ? ' off' : '')
    card.dataset.provider = prov.id
    card.onclick = () => openProviderModal(prov.id)

    // 右上角：该供应商的剩余总积分（无账号时不显示）
    const credits = document.createElement('span')
    credits.className = 'prov-credits'
    credits.hidden = true
    if (typeof creditCache[prov.id] === 'number') {
      credits.hidden = false
      // ⚠️ **必须带单位**：原来只有一个裸数字（`10,296`），
      // 而账号弹层里同样的值写的是「5,049 积分」—— 同一份数据两种口径，
      // 用户不知道这个数字是什么（实测反馈）。
      credits.textContent = creditCache[prov.id].toLocaleString('zh-CN') + ' 积分'
      credits.title = '该供应商全部账号的剩余积分合计（实时查上游）'
    }
    card.appendChild(credits)

    const name = document.createElement('div'); name.className = 'prov-name'; name.textContent = prov.name
    const id = document.createElement('div'); id.className = 'prov-id'; id.textContent = prov.id
    card.appendChild(name); card.appendChild(id)

    const caps = document.createElement('div'); caps.className = 'caps'
    for (const [key, label] of CAPS) {
      const tag = document.createElement('span')
      const on = prov.capabilities[key] === true
      tag.className = 'cap ' + (on ? 'on' : 'off')
      const shown = key === 'login' ? (LOGIN_KIND_LABEL[prov.id] || label) : label
      // ⚠️ 用 `×`（U+00D7，拉丁字母区，所有字体都有）而不是 `✕`（U+2715，
      // 杂项符号区，部分手机字体缺字形会渲染成空框）。
      // `✓`（U+2713）覆盖较广，且这是**文本标记**而非按钮，保留。
      tag.textContent = (on ? '✓ ' : '× ') + shown
      caps.appendChild(tag)
    }
    card.appendChild(caps)
    // ⚠️ 已关闭的家在卡片上**明说**，否则用户会以为是账号/网络问题。
    if (providerDisabled.has(prov.id)) {
      const off = document.createElement('div'); off.className = 'prov-off-tag'
      off.textContent = '已关闭（不参与 API）'
      card.appendChild(off)
    }
    box.appendChild(card)
  }

  // ⚠️ 生成额度区块与卡片列表**分开渲染**（它在 `#gen-quota` 容器里，
  // 不在 `.prov-grid` 里 —— 挤进网格会被当成一张卡片压扁）。
  // 不 await：额度是独立的次要请求，不该拖住卡片渲染。
  loadGenQuota()

}

// ─────────────────── 生成额度（豆包生图/生视频） ───────────────────

/**
 * 「生成额度（豆包）」区块：每个豆包账号当日生图/生视频用了多少。
 *
 * ## 数据来源
 *
 * `GET /admin/doubao/gen-quota`（当日北京时间的本地计数 + 上限）。
 * 豆包网页端没有公开额度接口，数字是网关自己数的（提交成功才记），
 * 不是上游下发的剩余额度 —— 文案里写明是「当日用量」，不写成「剩余额度」。
 *
 * ## 样式
 *
 * 复用量化页的 `.bar-row` / `.bar-track` / `.bar-fill` / `.bar-val`
 *（不新写 CSS：酒红配色与深浅两套主题都已覆盖这组类）。
 */
async function loadGenQuota() {
  const box = $('gen-quota')
  if (!box) return
  clear(box)
  const sec = document.createElement('section'); sec.className = 'panel'
  const head = document.createElement('h3'); head.textContent = '生成额度（豆包）'
  sec.appendChild(head)
  const res = await api('/admin/doubao/gen-quota')
  if (!res.ok) {
    const p = document.createElement('p'); p.className = 'hint'
    p.textContent = '生成额度加载失败（密钥或网络问题）'
    sec.appendChild(p); box.appendChild(sec)
    return
  }
  const accounts = (res.body && res.body.accounts) || []
  const imagesLimit = typeof res.body.imagesLimit === 'number' ? res.body.imagesLimit : 50
  const videosLimit = typeof res.body.videosLimit === 'number' ? res.body.videosLimit : 10
  const hint = document.createElement('p'); hint.className = 'hint'
  hint.textContent = accounts.length === 0
    ? '还没有豆包账号。扫码登录后，这里会显示每个账号当日生图/生视频用了多少。'
    : `当日（${res.body.day || ''}，北京时间）用量；图片上限 ${imagesLimit} 张/号/天，视频上限 ${videosLimit} 条/号/天。用完的号自动切下一个号。`
  sec.appendChild(hint)
  for (const a of accounts) {
    const name = document.createElement('div'); name.className = 'uid'
    name.textContent = (a.nickname || '(无昵称)') + ' · ' + a.uid + (a.disabled ? '（已停用）' : '')
    sec.appendChild(name)
    const mkBar = (label, used, limit, unit) => {
      const row = document.createElement('div'); row.className = 'bar-row'
      const lab = document.createElement('span'); lab.className = 'bar-label'; lab.textContent = label
      const track = document.createElement('div'); track.className = 'bar-track'
      const fill = document.createElement('div')
      fill.className = 'bar-fill' + (used >= limit ? ' bad' : '')
      fill.style.width = Math.min(100, Math.round((used / Math.max(1, limit)) * 100)) + '%'
      track.appendChild(fill)
      const val = document.createElement('span'); val.className = 'bar-val'
      val.textContent = `${used}/${limit} ${unit}`
      row.appendChild(lab); row.appendChild(track); row.appendChild(val)
      return row
    }
    sec.appendChild(mkBar('图片', a.imagesUsed || 0, imagesLimit, '张'))
    sec.appendChild(mkBar('视频', a.videosUsed || 0, videosLimit, '条'))
  }
  box.appendChild(sec)
}

// ─────────────────── 供应商管理（排序 + 开关） ───────────────────

/**
 * 打开「供应商」管理弹窗：调整展示顺序、启用/停用整家。
 *
 * ## ⚠️ 两件事的语义完全不同（用户 2026-10-07 明确）
 *
 * | 操作 | 影响范围 |
 * |---|---|
 * | **排序** | **只影响面板展示顺序**。⚠️ **不改默认供应商** —— 裸模型名仍回落到 `buddy`。 |
 * | **关闭** | **彻底关掉**：模型从 `/v1/models` 消失，**且拒绝路由到它**（403）。 |
 *
 * ⚠️ 关闭是**服务端**状态（存 DO），故关掉后**任何客户端**都调不到 ——
 * 这是用户要的语义（不是只在面板藏起来）。
 *
 * ## 为什么用「上移/下移」而不是拖拽
 *
 * 拖拽需要 pointer 事件 + 占位符 + 触摸适配，在手机上尤其容易误操作；
 * 而上移/下移是**确定性**的（点一下移动一格），手机上与大屏上行为一致。
 * 供应商总数是十几家，逐格移动完全够用。
 */
function openProviderManager() {
  // ⚠️ 用**当前展示顺序**初始化（含用户已排的部分），而不是注册表原顺序 ——
  // 否则每次打开都从原顺序开始，用户的排序看着就「丢了」。
  const ordered = []
  const seen = new Set()
  for (const id of providerOrder) {
    const p = providerCache.find((x) => x.id === id)
    if (p !== undefined) { ordered.push(p); seen.add(id) }
  }
  for (const p of providerCache) if (!seen.has(p.id)) ordered.push(p)

  const body = document.createElement('div')

  const hint = document.createElement('p'); hint.className = 'hint'
  hint.textContent = '拖动左侧手柄调整顺序（只影响面板展示）；开关会真的停用该供应商。'
  body.appendChild(hint)

  const list = document.createElement('div')

  const save = async () => {
    const r = await api('/admin/providers/settings', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ order: ordered.map((p) => p.id), disabled: [...providerDisabled] }),
    })
    if (!r.ok) { alert('保存失败：' + JSON.stringify(r.body)); return false }
    providerOrder = r.body.order || []
    providerDisabled = new Set(r.body.disabled || [])
    return true
  }

  // ⚠️ **拖动排序**（用户要求「加一个拖动移动位置」）。
  //
  // 用 HTML5 drag-and-drop（`draggable`）而不是 pointer 事件：
  // 前者在桌面浏览器上零依赖，且**手机上由浏览器映射成长按拖动**。
  // 手柄只放在左侧的 `≡` 上（不是整行可拖）—— 否则点「启用/关闭」按钮时
  // 会误触发拖动，按钮变得难以点中。
  // ── 拖动排序：用 **Pointer Events**（不是 HTML5 drag-and-drop）──
  //
  // ## 🔴 为什么必须换掉 HTML5 drag-and-drop（用户实测反馈）
  //
  // 用户报：「供应商拖动排序功能在 iOS 的浏览器上只会选择文字，
  // 在 Chromium 内核的浏览器上能正常拖动，但也不太顺手」。
  //
  // 根因是**两个独立问题**：
  //
  // 1. **iOS Safari 对普通元素根本不支持 HTML5 拖放**。
  //    `draggable="true"` 只对少数原生可拖元素（链接、图片、选中文本）有效，
  //    对 `<div>` 只会触发**文字选择**——这正是用户看到的现象。
  //    ⇒ 这不是「配置不对」，是**平台没有这个能力**，改属性救不回来。
  // 2. **整行都在拖**（`row.draggable = true`），而注释声称「只有手柄可拖」。
  //    于是按「启用/关闭」按钮时很容易误触发拖动，按钮因此变得难以点中。
  //
  // ⇒ 改用 Pointer Events（`pointerdown/move/up`）：iOS 与 Chromium 都支持，
  //   且能自己控制触发区域与手感。
  //
  // ## 手感设计（用户要求「更顺手」）
  //
  // - **只有手柄**能起拖（`pointerdown` 挂在手柄上），按钮回归可点；
  // - `touch-action: none` 挂在手柄上，**阻止 iOS 把长按解释成文字选择**；
  // - 起拖前先等 `DRAG_START_PX` 位移 —— 轻点手柄不该算拖动（避免误触）；
  // - 拖动中给被拖行加 `.dragging`（半透明），其余行按位置让位；
  // - 用**指针的 Y 坐标**判断该插到哪一行，而不是依赖 `dragover` 事件；
  // - 松手即落位并保存；**取消**（`pointercancel`）则原样回退，不留半个改动。
  //
  // ⚠️ 用 `setPointerCapture` 把后续 move/up 都收给手柄元素：
  // 否则指针一旦滑出手柄范围，就再也收不到 `pointerup`（拖到一半卡住）。
  const DRAG_START_PX = 4
  let drag = null // { pointerId, fromIdx, startY, active }

  /** 把当前指针的 Y 坐标换算成「应插入到第几行」。 */
  const indexAtY = (clientY) => {
    const rows = [...list.querySelectorAll('.card')]
    for (let i = 0; i < rows.length; i += 1) {
      const box = rows[i].getBoundingClientRect()
      if (clientY < box.top + box.height / 2) return i
    }
    return rows.length - 1
  }

  const endDrag = (commit) => {
    if (drag === null) return
    const { fromIdx, active } = drag
    drag = null
    list.classList.remove('dragging-active')
    for (const el of list.querySelectorAll('.card')) {
      el.classList.remove('dragging', 'drop-target')
    }
    if (!active) return // 只是轻点，没真拖
    if (commit) {
      // 落位：把被拖的那条移到目标位置（`targetIdx` 由 move 阶段实时存下）
      const to = commit
      if (to !== fromIdx) {
        const moved = ordered.splice(fromIdx, 1)[0]
        ordered.splice(to, 0, moved)
        void (async () => { if (await save()) { render(); void loadProviders() } })()
      }
    }
    render() // 无论成功与否都重画，清掉临时类名
  }

  const render = () => {
    clear(list)
    ordered.forEach((prov, idx) => {
      // ⚠️ 复用现有的 `.card` 样式（与「账号」页统一），不另造一套。
      const row = document.createElement('div')
      row.className = 'card'
      // ⚠️ **不再设 `row.draggable`** —— 整行可拖会让按钮点不中，
      // 而且 iOS 上它只会触发文字选择（见上方说明）。

      const handle = document.createElement('span')
      handle.className = 'drag-handle'
      handle.textContent = '≡'
      handle.title = '按住拖动调整顺序'
      // ⚠️ `touch-action: none` 由 CSS 设在这个手柄上 —— 那是阻止 iOS
      // 把长按解释成**文字选择**的关键，缺了它就还是「只会选择文字」。
      handle.addEventListener('pointerdown', (e) => {
        // 只响应主指针（忽略右键/多指）
        if (e.button !== 0 && e.pointerType === 'mouse') return
        drag = { pointerId: e.pointerId, fromIdx: idx, startY: e.clientY, active: false }
        // ⚠️ 捕获指针：否则滑出手柄后就收不到 pointerup（拖到一半卡住）
        if (handle.setPointerCapture) { try { handle.setPointerCapture(e.pointerId) } catch { /* 忽略 */ } }
        // ⚠️ 阻止默认行为，否则 iOS 会开始文字选择
        e.preventDefault()
      })

      handle.addEventListener('pointermove', (e) => {
        if (drag === null || e.pointerId !== drag.pointerId) return
        if (!drag.active) {
          // 位移超过阈值才算真的开始拖（轻点不该算）
          if (Math.abs(e.clientY - drag.startY) < DRAG_START_PX) return
          drag.active = true
          list.classList.add('dragging-active')
          row.classList.add('dragging')
        }
        e.preventDefault()
        const to = indexAtY(e.clientY)
        drag.targetIdx = to
        // 高亮「将要插入的位置」
        const rows = [...list.querySelectorAll('.card')]
        for (let i = 0; i < rows.length; i += 1) {
          rows[i].classList.toggle('drop-target', i === to && i !== drag.fromIdx)
        }
      })

      const onUp = (e) => {
        if (drag === null || e.pointerId !== drag.pointerId) return
        // ⚠️ 先取走目标位置再 endDrag（endDrag 会把 drag 置空）
        const to = drag.targetIdx
        endDrag(drag.active ? (typeof to === 'number' ? to : drag.fromIdx) : false)
      }
      handle.addEventListener('pointerup', onUp)
      // ⚠️ `pointercancel`（系统中断、来电等）**不提交** —— 原样回退，
      // 免得留下一个用户没意图的排序。
      handle.addEventListener('pointercancel', () => endDrag(false))
      row.appendChild(handle)

      const nm = document.createElement('div'); nm.className = 'grow'
      const strong = document.createElement('strong'); strong.textContent = prov.name
      const idLine = document.createElement('div'); idLine.className = 'uid'; idLine.textContent = prov.id
      nm.appendChild(strong); nm.appendChild(idLine)
      row.appendChild(nm)

      // 开关：复用现有的 ghost / danger 按钮样式
      //
      // ⚠️ 这里**不能**只靠背景色区分「开/关」：两种状态都显示按钮的
      // **动作名**（「关闭」/「启用」），于是 12 家全启用时就是**排一整列红色
      // 「关闭」按钮** —— 远看像一整列错误。用户要的是「一眼看出哪家关了」。
      //
      // 故补上 `.prov-sw` 的**动作型**视觉：
      //   · 要关闭（当前启用）→ 中性底色 + 红字，**红色只在文字上**，不成片；
      //   · 已关闭        → 强调色实心（「启用」是可恢复的推荐动作，不是危险操作）。
      // ⚠️ 仍然保留 `ghost`/`danger` 基类（项目既有约定是复用它们），
      // 由 `.prov-sw` 在其上做覆盖 —— 不另造一套按钮体系。
      const off = providerDisabled.has(prov.id)
      const sw = document.createElement('button')
      sw.className = (off ? 'ghost' : 'danger') + ' prov-sw' + (off ? ' is-off' : '')
      sw.textContent = off ? '启用' : '关闭'
      // ⚠️ 纯图标/单选类控件要暴露状态；这个按钮是「操作型」
      // （文案已说明会做什么），故用 `title` 补充**当前状态**供悬停查看。
      sw.title = off ? '该家已关闭（不参与 API），点击重新启用' : '该家已启用，点击关闭'
      sw.onclick = async () => {
        if (!off && !confirm('关闭「' + prov.name + '」？\n\n它的模型会从 /v1/models 消失，'
          + '并且调用它会返回 403。账号与凭据都保留，随时可以重新启用。')) return
        if (off) providerDisabled.delete(prov.id); else providerDisabled.add(prov.id)
        if (await save()) { render(); void loadProviders() }
      }
      row.appendChild(sw)
      list.appendChild(row)
    })
  }
  render()
  body.appendChild(list)
  // ⚠️ `openInfo(title, nodes)` 收的是**节点数组**（不是单个节点）。
  openInfo('供应商设置', [body])
}



// ─────────────────── 供应商弹窗（管理账号 / 模型 / 添加） ───────────────────

let modalProviderId = ''

async function openProviderModal(providerId) {
  modalProviderId = providerId
  const prov = providerCache.find((p) => p.id === providerId)
  $('modal-title').textContent = prov ? `${prov.name}（${prov.id}）` : providerId
  // ⚠️ 第二道防线：万一有某条路径没走 closeModal（例如将来新加的文件），
  // 这里也把标签条恢复回来 —— 「看不见标签」比「多显示一次」糟糕得多。
  const tabs = document.querySelector('.modal-tabs')
  if (tabs) tabs.style.display = ''
  $('modal').hidden = false
  if (f7SheetModal) f7SheetModal.open()
  switchModalTab('accounts')
}

function switchModalTab(name) {
  for (const b of document.querySelectorAll('.mtab')) b.classList.toggle('active', b.dataset.mtab === name)
  for (const p of document.querySelectorAll('.mtab-panel')) p.hidden = p.id !== 'modal-' + name
  if (name === 'accounts') loadModalAccounts()
  if (name === 'models') loadModalModels()
  if (name === 'add') renderModalAdd()
}

/** 弹窗「账号」页：只显示该供应商的账号。 */
/**
 * 账号弹窗的加载轮次号。
 *
 * ⚠️ 积分是**异步补**的（见 `loadModalAccounts`）。用户快速切换供应商时，
 * 上一轮的积分结果可能在下一轮才回来 —— 用轮次号把过期结果**丢弃**，
 * 否则旧一家的积分会写进新一家的卡片。
 */
let modalAccountsSeq = 0

async function loadModalAccounts() {
  const box = $('modal-accounts')
  clear(box)
  // 本轮渲染出的积分槽（uid → 元素），异步补齐时逐个更新。
  const creditSlots = new Map()
  // ⚠️ 临期积分提示槽（uid → 元素），与积分槽同一轮更新。
  // 数据来自 `/admin/packages` 行里本来就有的 `expiring`（7 天内过期）
  // 与 `earliestExpiry`，只是面板一直没显示 —— 积分悄悄过期用户看不到。
  const expiringSlots = new Map()
  // ⚠️ 每轮递增：异步补齐回来时若已经不是同一轮就**丢弃**结果，
  // 否则用户快速切换供应商时，旧一家的积分会写进新一家的卡片。
  const loadSeq = ++modalAccountsSeq
  // ## 🔴 积分必须**异步补**，不能挡住账号列表（用户报「半天加载不出来」）
  //
  // 实测：`/admin/packages` 要 **16.3 秒**（cn 14.7s + global 1.6s）——
  // 它是**逐账号串行实时打上游**。而 `/admin/accounts` 只要 **1.5 秒**。
  //
  // 旧写法把两者**串在一起**（先 await 积分、再 await 账号）⇒ 用户点开弹窗后
  // 要盯着空白等 16 秒才看到任何东西。那是**纯粹的等待浪费**：
  // 账号信息 1.5 秒就好了，积分慢是它自己的事。
  //
  // ⇒ 现在分两段：**先把账号渲染出来**，积分**后台补**，补到了逐个更新那一格。
  // 用户 1.5 秒内就能操作（停用 / 删除 / 看 uid），积分慢不再阻塞任何事。
  //
  // ⚠️ 积分数据源仍是 `/admin/packages`（**不是** `a.credits` —— 那个字段
  // 只在 `AccountPoolDO.revive()` 里被写，平时恒为 0，是个废弃字段）。
  // ⚠️ 合并两个 realm —— 否则国际版（global）的账号弹窗永远显示「还没有账号」。
  const res = { ok: true, body: { accounts: await fetchAccounts() } }
  if (!res.ok) { box.textContent = '加载失败'; return }
  const mine = (res.body.accounts || []).filter((a) => (a.provider || 'buddy') === modalProviderId)
  if (mine.length === 0) {
    const p = document.createElement('p'); p.className = 'hint'
    p.textContent = '该供应商下还没有账号。切到「添加账号」页导入或登录。'
    box.appendChild(p); return
  }
  for (const a of mine) {
    const card = document.createElement('div'); card.className = 'card'
    const left = document.createElement('div'); left.className = 'grow'
    // ⚠️ 续期失败是最要紧的状态（以前只记日志，用户发现不了）——
    // 先算出来，标签和登录态两处都用它。
    const refreshFailed = typeof a.lastRefreshError === 'string' && a.lastRefreshError !== ''
    const nm = document.createElement('strong'); nm.textContent = a.nickname || '(无昵称)'
    const uid = document.createElement('div'); uid.className = 'uid'; uid.textContent = a.uid
    left.appendChild(nm); left.appendChild(uid)
    // 登录态：失败亮原因，没失败显示过期时间，未知的说明是定期续期。
    const ls = document.createElement('div'); ls.className = 'uid'
    if (refreshFailed) {
      ls.textContent = '续期失败：' + a.lastRefreshError.slice(0, 100)
        + (a.lastRefreshErrorAt ? '（' + new Date(a.lastRefreshErrorAt).toLocaleString('zh-CN') + '）' : '')
      ls.style.color = 'var(--err)'
    } else if (typeof a.expiresAt === 'number' && a.expiresAt > 0) {
      ls.textContent = '登录有效期至 ' + new Date(a.expiresAt).toLocaleString('zh-CN')
    } else if (a.refreshable === false) {
      // ⚠️ 没有续期能力的家（如豆包）绝不能写「定期续期」——
      // 那是不实承诺。失效后只能重新扫码登录。
      ls.textContent = '登录有效期未知（无自动续期，失效后需重新登录）'
    } else {
      ls.textContent = '登录有效期未知（每 10 天定期续期）'
    }
    left.appendChild(ls); card.appendChild(left)

    const tag = document.createElement('span')
    const cooling = a.until && a.until > Date.now()
    if (a.disabled) { tag.className = 'tag err'; tag.textContent = '已禁用' }
    else if (refreshFailed) { tag.className = 'tag err'; tag.textContent = '续期失败' }
    else if (cooling) { tag.className = 'tag warn'; tag.textContent = '冷却中' }
    else { tag.className = 'tag ok'; tag.textContent = '正常' }
    card.appendChild(tag)

    const m = document.createElement('span'); m.className = 'metrics'
    m.textContent = '成功 ' + a.successCount + ' · 错误 ' + a.errTotal
    card.appendChild(m)

    // ⚠️ **每个账号单独显示积分**（用户要求）。
    // 数据来自 `/admin/packages`（逐账号实时查上游），**不是** `a.credits`
    //（那个字段永远是 0，见本函数开头的说明）。
    const cr = document.createElement('span'); cr.className = 'acct-credits'
    // ⚠️ 先占位「查询中…」—— 积分是**异步补**的（见本函数开头说明）。
    // 不用「—」占位：那会让用户以为「查不到」，而其实只是**还没查到**。
    cr.textContent = '查询中…'
    cr.title = '正在实时查上游（较慢，但不阻塞账号列表）'
    creditSlots.set(a.uid, cr)
    card.appendChild(cr)

    // ⚠️ 临期积分提醒（只读展示，不新增上游请求）：有 7 天内到期的积分时，
    // 在总积分下面补一行「⚠️ 7天内过期 X 积分，最早 M月D日到期」。
    // 空着不写字：没临期积分时不占地方。
    const ex = document.createElement('span'); ex.className = 'acct-expiring'
    expiringSlots.set(a.uid, ex)
    card.appendChild(ex)

    // ⚠️ **停用/启用放在「删除」左边**（用户要求），且两者视觉要区分：
    // 停用是可逆的轻操作（用 ghost 样式），删除是不可逆的重操作（danger）。
    // 把可逆操作也做成红色会让用户不敢点。
    const tog = document.createElement('button')
    tog.className = a.disabled ? 'ghost' : 'ghost'
    tog.textContent = a.disabled ? '启用' : '停用'
    tog.title = a.disabled
      ? '重新启用该账号（会同时清掉它的冷却/熔断，否则「启用了仍选不到」）'
      : '停用该账号（保留凭据与积分，随时可再启用）'
    tog.onclick = async () => {
      const r = await api('/admin/accounts/toggle', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ uid: a.uid, realm: a.realm || 'cn', disabled: !a.disabled }),
      })
      if (!r.ok) { alert('操作失败：' + JSON.stringify(r.body)); return }
      loadModalAccounts(); loadAccounts(); loadPool()
    }
    card.appendChild(tog)

    const del = document.createElement('button'); del.className = 'danger'; del.textContent = '删除'
    del.onclick = async () => {
      if (!confirm('删除账号 ' + a.uid + '（含凭据）？不可恢复。')) return
      const r = await api('/admin/accounts/remove', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ uid: a.uid, realm: 'cn', confirm: true }),
      })
      if (!r.ok) alert('删除失败：' + JSON.stringify(r.body))
      loadModalAccounts(); loadAccounts(); loadPool()
    }
    card.appendChild(del)
    box.appendChild(card)
  }

  // ── 账号已渲染完，现在**异步**补积分（不阻塞上面的渲染）──
  //
  // ⚠️ 这一段的全部意义就是「不 await 在渲染之前」：用户此刻已经能操作了。
  // 积分回来得慢（实测 16 秒）只影响那一格文字。
  void (async () => {
    let packages = []
    try {
      packages = await fetchPackages()
    } catch {
      // 取不到积分不该影响已经渲染好的账号列表
      packages = []
    }
    // ⚠️ 轮次校验：不是同一轮就丢弃（用户已切换供应商/已重载）
    if (loadSeq !== modalAccountsSeq) return
    const byUid = new Map()
    for (const p of packages) {
      if (p && typeof p.uid === 'string') byUid.set(p.uid, p)
    }
    for (const [uid, el] of creditSlots) {
      // ⚠️ 元素可能已被下一次重载移除（`clear(box)`）—— 那就跳过，
      // 对一个已脱离文档的元素写文字是静默无效果的。
      if (!el.isConnected) continue
      const p = byUid.get(uid)
      const total = p === undefined ? undefined : p.total
      const err = p === undefined ? undefined : p.error
      if (typeof total === 'number' && total > 0) {
        el.textContent = total.toLocaleString('zh-CN') + ' 积分'
        el.title = '该账号剩余积分（实时查上游）'
      } else if (typeof err === 'string' && err !== '') {
        // ⚠️ 查失败要说**原因**，不能只显示 `—` —— 否则用户以为「这家没额度」，
        // 而真实原因可能是「登录态过期」（该重新登录）或「上游不支持查余额」。
        el.textContent = '查询失败'
        el.title = err
        el.style.color = 'var(--err)'
      } else if (p !== undefined && p.skipped === true) {
        // 后端用它标记「该供应商不支持查余额」—— 不该显示成「查询失败」
        el.textContent = '不支持查余额'
        el.title = typeof p.reason === 'string' ? p.reason : '该供应商不支持查余额'
      } else {
        el.textContent = '—'
        el.title = '未查到积分（该账号可能在冷却，或上游未返回额度）'
      }
      // ⚠️ 临期积分：只在有 7 天内到期的积分时写字，否则留空。
      // `expiring` / `earliestExpiry` 与总积分同一行、同一批数据，不新增请求。
      const exEl = expiringSlots.get(uid)
      if (exEl !== undefined && exEl.isConnected) {
        const exp = p === undefined ? undefined : p.expiring
        const earliest = p === undefined ? undefined : p.earliestExpiry
        if (typeof exp === 'number' && exp > 0) {
          let txt = '7天内过期 ' + exp.toLocaleString('zh-CN') + ' 积分'
          if (typeof earliest === 'number' && earliest > 0) {
            txt += '，最早 ' + new Date(earliest).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) + ' 到期'
          }
          exEl.textContent = txt
          exEl.title = '这部分积分在 7 天内到期，先用掉就不会浪费'
        } else {
          exEl.textContent = ''
        }
      }
    }
  })()
}

/** 弹窗「模型」页：只列该供应商的模型（带 provider/ 前缀去重）。 */
async function loadModalModels() {
  const box = $('modal-models')
  clear(box)
  const p = document.createElement('p'); p.className = 'hint'; p.textContent = '加载中…'
  box.appendChild(p)
  const res = await api('/admin/providers/models?provider=' + encodeURIComponent(modalProviderId))
  clear(box)
  if (!res.ok) {
    const e = document.createElement('p'); e.className = 'hint'
    e.textContent = (res.body && res.body.error && res.body.error.message) || '加载失败'
    box.appendChild(e); return
  }
  const models = res.body.models || []
  if (res.body.note) {
    const n = document.createElement('p'); n.className = 'hint'; n.textContent = res.body.note; box.appendChild(n)
  }
  if (models.length === 0) {
    const n = document.createElement('p'); n.className = 'hint'; n.textContent = '没有模型可显示。'; box.appendChild(n); return
  }
  // 模型列表 + 开关（打开/关闭）
  const head = document.createElement('p'); head.className = 'hint'
  head.textContent = '共 ' + models.length + ' 个模型，已关闭 ' + (res.body.disabledCount || 0) + ' 个。'
    + '关闭后该模型会从 /v1/models 消失，客户端拿不到也调不到。'
  box.appendChild(head)

  // 工具条：一键关闭全部 / 一键开启全部
  const bar = document.createElement('div'); bar.className = 'model-toolbar'
  const offAll = document.createElement('button')
  offAll.className = 'ghost'; offAll.textContent = '全部关闭'
  // ⚠️ 用**批量**接口（一次往返），不在前端循环调 toggle ——
  // 那会产生 N 次 DO 往返，中途失败还会留下「关了一半」的不一致状态。
  const bulk = async (enabled) => {
    const r = await api('/admin/providers/models/bulk', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ provider: modalProviderId, models: models.map((m) => m.id), enabled }),
    })
    if (!r.ok) { alert('操作失败：' + JSON.stringify(r.body)); return }
    loadModalModels()
  }
  offAll.onclick = async () => {
    if (!confirm('关闭该供应商的全部 ' + models.length + ' 个模型？关闭后客户端在 /v1/models 里看不到它们。')) return
    offAll.disabled = true; await bulk(false); offAll.disabled = false
  }
  const onAll = document.createElement('button')
  onAll.className = 'ghost'; onAll.textContent = '全部开启'
  onAll.onclick = async () => { onAll.disabled = true; await bulk(true); onAll.disabled = false }
  bar.appendChild(offAll); bar.appendChild(onAll)
  box.appendChild(bar)

  for (const m of models) {
    const row = document.createElement('div')
    row.className = 'model-row' + (m.disabled ? ' off' : '')

    const mid = document.createElement('span'); mid.className = 'mid'; mid.textContent = m.id
    const mname = document.createElement('span'); mname.className = 'mname'; mname.textContent = m.name || ''
    row.appendChild(mid); row.appendChild(mname)

    // Framework7 Toggle：label + checkbox + toggle-icon（F7 负责金色开启态）
    const sw = document.createElement('label')
    sw.className = 'toggle'
    sw.title = m.disabled ? '已关闭，点击打开' : '已打开，点击关闭'
    const swInput = document.createElement('input')
    swInput.type = 'checkbox'
    swInput.checked = !m.disabled
    const swIcon = document.createElement('span')
    swIcon.className = 'toggle-icon'
    sw.appendChild(swInput)
    sw.appendChild(swIcon)
    sw.onclick = async (ev) => {
      ev.preventDefault() // 不让复选框自己先翻，状态由接口返回后重渲染决定
      const nextEnabled = m.disabled === true // 当前关闭 → 打开
      const r = await api('/admin/providers/models/toggle', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ provider: modalProviderId, model: m.id, enabled: nextEnabled }),
      })
      if (!r.ok) { alert('切换失败：' + JSON.stringify(r.body)); return }
      loadModalModels()
    }
    row.appendChild(sw)
    box.appendChild(row)
  }
}

/** 弹窗「添加账号」页：导入 + （若支持）设备码登录。 */
function renderModalAdd() {
  const box = $('modal-add-body')
  clear(box)
  const prov = providerCache.find((p) => p.id === modalProviderId)
  const canLogin = prov && prov.capabilities.login

  // ⚠️ **顺序**：设备码登录在上、粘贴凭据在下（用户要求）。
  // ⚠️ 文案**保持原样不动** —— 只调顺序，不改用词。
  if (!canLogin) {
    const n = document.createElement('p'); n.className = 'hint'
    n.textContent = '该供应商不支持从本服务发起登录，请导入凭据。'
    box.appendChild(n)
  } else {
    const h2 = document.createElement('h3')
    h2.textContent = LOGIN_KIND_LABEL[modalProviderId] || '设备码登录'
    box.appendChild(h2)
    const btn = document.createElement('button'); btn.textContent = '发起登录'
    const out = document.createElement('pre'); out.className = 'out'
    btn.onclick = () => startModalLogin(modalProviderId, out)
    box.appendChild(btn); box.appendChild(out)
  }

  // 粘贴凭据导入（移到登录**下面**）。
  //
  // ⚠️ **必须与上面的登录标题同级**（都是 `h3` + 同款 `hint`）——
  // 用户报「粘贴凭据导入 字体颜色大小也不统一」：登录那边是 `h3`（13px），
  // 而导入这边原先只有一句 `hint`（12px），两个区块看起来不像同一层级。
  // 现在两块各有一个 `h3` 标题 + 一句 `hint` 说明，视觉一致。
  const ih = document.createElement('h3')
  ih.textContent = '粘贴凭据导入'
  box.appendChild(ih)
  const hint = document.createElement('p'); hint.className = 'hint'
  hint.textContent = '粘贴凭据 JSON（会自动声明为本供应商）。'
  box.appendChild(hint)

  const ta = document.createElement('textarea')
  ta.id = 'modal-import-body'; ta.rows = 6
  ta.placeholder = '{"accessToken":"...","uid":"..."}'
  // ⚠️ 必须给可访问名：这个 textarea **没有 `<label>`**（它由 JS 动态插进弹窗，
  // 没有稳定的 HTML 位置可挂 label）。没有 `aria-label` 时屏幕阅读器
  // 只会念「编辑框」，用户不知道要粘什么进去（实测可访问性扫描报出此项）。
  // `placeholder` **不能**代替可访问名：它一输入内容就消失，且不是所有
  // 辅助技术都读它。
  ta.setAttribute('aria-label', '粘贴凭据 JSON')
  box.appendChild(ta)

  const imp = document.createElement('button'); imp.textContent = '导入'
  imp.onclick = async () => {
    const raw = ta.value.trim()
    if (raw === '') { alert('请先粘贴凭据'); return }
    let payload
    try { payload = JSON.parse(raw) } catch (e) { alert('JSON 解析失败：' + e.message); return }
    // ⚠️ 显式声明供应商，避免被别家按形状抢走
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      payload = Object.assign({}, payload, { provider: modalProviderId })
    }
    const r = await api('/admin/import', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
    })
    alert(r.ok ? '导入成功' : '导入失败：' + JSON.stringify(r.body))
    if (r.ok) { ta.value = ''; loadModalAccounts(); loadAccounts(); loadPool() }
  }
  box.appendChild(imp)
}

let modalLoginTimer = null

/**
 * loomy（讯飞）**短信验证码**登录：两步，不是轮询。
 *
 * ⚠️ 与其它所有家都不同 —— 参考实现写得很清楚
 *（`loomy-oauth.ts:6-7`）：
 * > 那 7 个都是「返回 loginUrl → 前端 window.open → 轮询 login.poll」。
 * > 短信登录**没有 URL 可打开**，故走「发验证码 → 用户输入 → 提交」三步。
 *
 * 故这里**不能**走 `renderLoginPrompt` + 轮询那套 —— 那套是「等服务端状态变化」，
 * 而这里要**用户输入一个值**。混在一起会让用户干等一个永远不会自己完成的流程。
 */
async function startLoomySmsLogin(out) {
  clear(out)
  // ── 先让用户选登录方式 ──
  //
  // ⚠️ 两种方式**都可行**（微信流程全是出站 HTTPS，见 `providers/loomy.ts`
  // 的更正说明）—— 此前只提供短信，是因为一条**错误的**可行性判断把微信
  // 永久排除了。现在两条都给出，默认短信（少一步扫码）。
  const pick = document.createElement('div')
  pick.className = 'hint'
  pick.textContent = '选择登录方式：'
  out.appendChild(pick)
  const row = document.createElement('div')
  row.className = 'row'
  const smsBtn = document.createElement('button')
  smsBtn.textContent = '短信验证码'
  const wxBtn = document.createElement('button')
  wxBtn.className = 'ghost'
  wxBtn.textContent = '微信扫码'
  row.appendChild(smsBtn)
  row.appendChild(wxBtn)
  out.appendChild(row)

  wxBtn.onclick = () => { void startLoomyWechatLogin(out) }
  smsBtn.onclick = () => {
    // 切到短信表单（清掉选择器，避免两套 UI 叠在一起）
    clear(out)
    void renderLoomySmsForm(out)
  }
}

/**
 * loomy 微信扫码登录（与 raccoon 同形态：服务端给二维码，面板轮询）。
 *
 * ⚠️ 与 raccoon 的差异：扫完之后讯飞侧若**没绑手机号**，还要补一步绑定
 *（轮询返回 `status: 'need_phone'`）—— 故轮询回调里要处理这个分支。
 */
async function startLoomyWechatLogin(out) {
  clear(out)
  const res = await api('/admin/providers/login/start', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ provider: 'loomy', realm: 'cn', mode: 'wechat' }),
  })
  if (!res.ok) { out.textContent = JSON.stringify(res.body, null, 2); return }
  const state = res.body.state
  clear(out)
  renderLoginPrompt(out, res.body, 'loomy')
  if (modalLoginTimer) clearInterval(modalLoginTimer)
  let tries = 0
  modalLoginTimer = setInterval(async () => {
    tries += 1
    if (tries > 100) { clearInterval(modalLoginTimer); out.textContent += '\n授权超时。'; return }
    const r = await api('/admin/providers/login/poll?state=' + encodeURIComponent(state))
    if (!r.ok) return
    const status = out._loginStatus
    if (r.body && r.body.done) {
      clearInterval(modalLoginTimer)
      alert('登录成功')
      loadModalAccounts(); loadAccounts(); loadPool()
      return
    }
    // ⚠️ 需要补绑手机号：轮询停掉，转到绑定表单
    if (r.body && r.body.status === 'need_phone') {
      clearInterval(modalLoginTimer)
      void renderLoomyBindForm(out, state, r.body.nickname)
      return
    }
    if (status) {
      status.textContent = r.body && r.body.message ? r.body.message : '等待扫码…'
    }
  }, 3000)
}

/**
 * 微信已授权但讯飞侧未绑手机号 ⇒ 补绑（`bind === 0` 才走到这里）。
 *
 * ⚠️ 两个动作走同一个端点（`action: 'send' | 'check'`）：
 * 先发码、再校验。验证码一次性，校验后会话即被清掉。
 */
async function renderLoomyBindForm(out, state, nickname) {
  clear(out)
  const tip = document.createElement('div')
  tip.className = 'hint'
  tip.textContent = (nickname ? `微信「${nickname}」` : '该微信号')
    + '还没绑定手机号，请填写手机号完成绑定。'
  out.appendChild(tip)

  const phoneInput = document.createElement('input')
  phoneInput.type = 'tel'
  phoneInput.placeholder = '11 位手机号'
  const sendBtn = document.createElement('button')
  sendBtn.textContent = '发送验证码'
  const row1 = document.createElement('div')
  row1.className = 'row'
  row1.appendChild(phoneInput)
  row1.appendChild(sendBtn)
  out.appendChild(row1)

  const codeInput = document.createElement('input')
  codeInput.type = 'text'
  codeInput.placeholder = '短信验证码'
  const checkBtn = document.createElement('button')
  checkBtn.textContent = '完成绑定'
  const row2 = document.createElement('div')
  row2.className = 'row'
  row2.appendChild(codeInput)
  row2.appendChild(checkBtn)
  out.appendChild(row2)

  const msg = document.createElement('div')
  msg.className = 'hint'
  out.appendChild(msg)

  sendBtn.onclick = async () => {
    const r = await api('/admin/providers/login/loomy/bind', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ state, action: 'send', phone: phoneInput.value.trim(), realm: 'cn' }),
    })
    msg.textContent = r.ok ? '验证码已发送' : '发送失败：' + JSON.stringify(r.body)
  }
  checkBtn.onclick = async () => {
    const r = await api('/admin/providers/login/loomy/bind', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ state, action: 'check', code: codeInput.value.trim(), realm: 'cn' }),
    })
    if (r.ok) {
      alert('登录成功')
      loadModalAccounts(); loadAccounts(); loadPool()
    } else {
      msg.textContent = '绑定失败：' + JSON.stringify(r.body)
    }
  }
}

async function renderLoomySmsForm(out) {
  // 第一步：填手机号 → 发码
  const tip = document.createElement('div')
  tip.textContent = '讯飞（loomy）用短信验证码登录。请填写手机号后点「发送验证码」。'
  out.appendChild(tip)

  const row = document.createElement('div'); row.className = 'row'
  const phone = document.createElement('input')
  phone.type = 'tel'; phone.placeholder = '11 位手机号'; phone.maxLength = 11
  row.appendChild(phone)
  const send = document.createElement('button'); send.textContent = '发送验证码'
  row.appendChild(send)
  out.appendChild(row)

  const status = document.createElement('div'); status.className = 'hint'
  out.appendChild(status)

  send.onclick = async () => {
    const value = phone.value.trim()
    status.textContent = '发送中…'
    const r = await api('/admin/providers/login/start', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ provider: 'loomy', phone: value, realm: 'cn' }),
    })
    if (!r.ok) {
      status.textContent = (r.body && r.body.error && r.body.error.message) || '发送失败'
      return
    }
    // 第二步：填验证码 → 提交
    status.textContent = '验证码已发送。'
    phone.disabled = true; send.disabled = true
    const codeRow = document.createElement('div'); codeRow.className = 'row'
    const code = document.createElement('input')
    code.type = 'text'; code.placeholder = '收到的验证码'; code.maxLength = 8
    codeRow.appendChild(code)
    const submit = document.createElement('button'); submit.textContent = '登录'
    codeRow.appendChild(submit)
    out.appendChild(codeRow)
    const msg = document.createElement('div'); msg.className = 'hint'
    out.appendChild(msg)

    submit.onclick = async () => {
      msg.textContent = '校验中…'
      const r2 = await api('/admin/providers/login/loomy/sms', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ state: r.body.state, code: code.value.trim(), realm: 'cn' }),
      })
      if (r2.ok) {
        msg.textContent = '登录成功：' + (r2.body.nickname || r2.body.uid)
        loadModalAccounts(); loadAccounts(); loadPool()
        return
      }
      // ⚠️ 失败文案里已含「请重新获取验证码」（服务端加的）——
      // 验证码是一次性的，失败后**必须重新发码**，不能让用户反复重试同一个码。
      msg.textContent = (r2.body && r2.body.error && r2.body.error.message) || '登录失败'
      codeRow.remove()
      phone.disabled = false; send.disabled = false
      status.textContent = '请重新点「发送验证码」获取新验证码。'
    }
  }
}

/**
 * doubao（豆包）登录：先让用户选登录方式。
 *
 * ⚠️ 两种方式**都可行**（短信是 2026-11-11 新增，见 `doubao.ts`
 * 「短信验证码登录」小节）：扫码要第二台手机（豆包 App 扫码器只用后置
 * 摄像头，单台手机扫不了自己屏幕上的码），短信只需要本机收码。
 * 默认短信（少一步扫码）。
 */
async function startDoubaoLogin(out) {
  clear(out)
  const pick = document.createElement('div')
  pick.className = 'hint'
  pick.textContent = '选择登录方式：'
  out.appendChild(pick)
  const row = document.createElement('div')
  row.className = 'row'
  const smsBtn = document.createElement('button')
  smsBtn.textContent = '短信验证码'
  const qrBtn = document.createElement('button')
  qrBtn.className = 'ghost'
  qrBtn.textContent = '豆包扫码'
  row.appendChild(smsBtn)
  row.appendChild(qrBtn)
  out.appendChild(row)

  qrBtn.onclick = () => { clear(out); void startModalLoginPolling('doubao', out) }
  smsBtn.onclick = () => {
    // 切到短信表单（清掉选择器，避免两套 UI 叠在一起）
    clear(out)
    void renderDoubaoSmsForm(out)
  }
}

/**
 * doubao 短信验证码登录：发码 → 填码 → 验码 →（多账号时）选号。
 *
 * ⚠️ 与 loomy 的短信表单同型，但有两处不同：
 * 1. 验码失败**不**清表单：服务端保留会话（10 分钟内），验证码输错
 *    不会把真码作废，用户可检查后重试，或点「重新获取验证码」；
 * 2. 一个手机号可能绑多个豆包账号：验码成功时上游回 `needsSelect` +
 *    账号列表，要用户挑一个再调 `select`（票据在服务端会话里）。
 */
async function renderDoubaoSmsForm(out) {
  // 第一步：填手机号 → 发码
  const tip = document.createElement('div')
  tip.textContent = '豆包用短信验证码登录。请填写手机号后点「发送验证码」。'
  out.appendChild(tip)

  const row = document.createElement('div'); row.className = 'row'
  const phone = document.createElement('input')
  phone.type = 'tel'; phone.placeholder = '11 位手机号'; phone.maxLength = 11
  row.appendChild(phone)
  const send = document.createElement('button'); send.textContent = '发送验证码'
  row.appendChild(send)
  out.appendChild(row)

  const status = document.createElement('div'); status.className = 'hint'
  out.appendChild(status)

  // 发码后才出现的第二步 UI（只建一次，重发时复用）。
  let state = ''
  let codeRow = null
  let code = null
  let submit = null
  const msg = document.createElement('div'); msg.className = 'hint'
  out.appendChild(msg)

  const showCodeRow = () => {
    if (codeRow) { code.value = ''; return }
    codeRow = document.createElement('div'); codeRow.className = 'row'
    code = document.createElement('input')
    code.type = 'text'; code.placeholder = '收到的验证码'; code.maxLength = 6
    codeRow.appendChild(code)
    submit = document.createElement('button'); submit.textContent = '登录'
    codeRow.appendChild(submit)
    out.appendChild(codeRow)

    submit.onclick = async () => {
      msg.textContent = '校验中…'
      const r2 = await api('/admin/providers/login/doubao/sms', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'verify', state, code: code.value.trim(), realm: 'cn' }),
      })
      if (r2.ok && r2.body && r2.body.done) {
        msg.textContent = '登录成功：' + (r2.body.nickname || r2.body.uid)
        loadModalAccounts(); loadAccounts(); loadPool()
        return
      }
      if (r2.ok && r2.body && r2.body.needsSelect) {
        // 多账号：列出账号让用户挑一个。
        msg.textContent = '该手机号绑定了多个豆包账号，请选择要登录的一个：'
        codeRow.remove(); codeRow = null
        const list = document.createElement('div')
        for (const account of r2.body.accounts || []) {
          const btn = document.createElement('button')
          // ⚠️ 服务端回的账号列表用 `secUid`（驼峰，见 doubao.ts 的
          // DoubaoSmsSubAccount）；第一版这里读 `account.sec_uid`
          // 恒为 undefined，选号请求没带 sec_uid，服务端回
          // missing_sec_uid「请选择要登录的账号」。见 AGENTS.md §9.1b ⑪。
          const secUid = account.secUid ?? account.sec_uid
          btn.textContent = account.name || secUid
          btn.onclick = async () => {
            msg.textContent = '登录中…'
            const r3 = await api('/admin/providers/login/doubao/sms', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ action: 'select', state, sec_uid: secUid, realm: 'cn' }),
            })
            if (r3.ok && r3.body && r3.body.done) {
              msg.textContent = '登录成功：' + (r3.body.nickname || r3.body.uid)
              loadModalAccounts(); loadAccounts(); loadPool()
              return
            }
            msg.textContent = '选号失败：' + ((r3.body && r3.body.error && r3.body.error.message) || '未知错误')
              + '请重新获取验证码。'
            list.remove()
            phone.disabled = false; send.disabled = false; send.textContent = '重新获取验证码'
          }
          list.appendChild(btn)
        }
        out.appendChild(list)
        return
      }
      // ⚠️ 验码失败：服务端保留会话，用户可检查验证码后重试，
      // 也可以重新发码（重发会产生新会话，旧会话作废）。
      msg.textContent = '验码失败：' + ((r2.body && r2.body.error && r2.body.error.message) || '未知错误')
        + '请检查验证码后重试，或重新获取验证码。'
      send.disabled = false; send.textContent = '重新获取验证码'
    }
  }

  send.onclick = async () => {
    const value = phone.value.trim()
    status.textContent = '发送中…'
    const r = await api('/admin/providers/login/start', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ provider: 'doubao', mode: 'sms', phone: value, realm: 'cn' }),
    })
    if (!r.ok) {
      status.textContent = (r.body && r.body.error && r.body.error.message) || '发送失败'
      return
    }
    // 第二步：填验证码 → 提交（重发时复用同一行，只清掉旧码）。
    state = r.body.state
    status.textContent = '验证码已发送。'
    phone.disabled = true; send.disabled = true; send.textContent = '发送验证码'
    showCodeRow()
    msg.textContent = ''
  }
}

async function startModalLogin(providerId, out) {
  if (modalLoginTimer) clearInterval(modalLoginTimer)
  // ⚠️ loomy 是**短信**流程（需用户输入），与「设备码/扫码 + 轮询」完全不同，
  // 故在这里就分派走，不进入下面的轮询逻辑。
  if (providerId === 'loomy') { await startLoomySmsLogin(out); return }
  // ⚠️ doubao 有两种登录方式（扫码 / 短信验证码），先让用户选一种：
  // 扫码走下面的轮询逻辑，短信走表单流程（与 loomy 的短信形态同型）。
  if (providerId === 'doubao') { await startDoubaoLogin(out); return }
  await startModalLoginPolling(providerId, out)
}

/**
 * 设备码 / 扫码登录的通用流程：发起 → 渲染提示 → 3 秒轮询。
 *
 * （从 `startModalLogin` 里抽出，供 doubao 的「扫码」选项复用；
 * 其余供应商的行为与抽出前完全一致。）
 */
async function startModalLoginPolling(providerId, out) {
  const endpoint = providerId === 'buddy' ? '/admin/login/start' : '/admin/providers/login/start'
  const res = await api(endpoint, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ realm: 'cn', provider: providerId }),
  })
  if (!res.ok) { out.textContent = JSON.stringify(res.body, null, 2); return }
  const state = res.body.state
  clear(out)
  // ⚠️ 必须走**共享**渲染函数：扫码家（raccoon）返回的是 `qrSvg` 而非 `authUrl`。
  // 我第一版这里直接读 `res.body.authUrl` —— 对扫码家就是 `undefined`，
  // 用户看到的就是「商汤登录显示 undefined」。
  renderLoginPrompt(out, res.body, providerId)

  let tries = 0
  modalLoginTimer = setInterval(async () => {
    tries += 1
    if (tries > 100) { clearInterval(modalLoginTimer); out.textContent += '\n授权超时。'; return }
    const pollPath = providerId === 'buddy' ? '/admin/login/poll' : '/admin/providers/login/poll'
    const r = await api(pollPath + '?state=' + encodeURIComponent(state))
    if (r.ok && r.body && r.body.done) {
      clearInterval(modalLoginTimer)
      out.textContent = '授权成功：' + (r.body.nickname || r.body.uid)
      loadModalAccounts(); loadAccounts(); loadPool()
    } else if (r.ok && r.body && (r.body.status === 'failed' || r.body.status === 'canceled')) {
      // 终态：停下并如实显示（继续轮询只会得到同一答案）
      clearInterval(modalLoginTimer)
      out.textContent = (r.body.message || '登录失败') + '\n可改用「粘贴凭据导入」，或稍后重试。'
    } else if (r.ok && r.body && r.body.message) {
      // 扫码流程只更新状态文字（二维码必须留在页面上，不能被文字覆盖掉）
      if (out._loginStatus) out._loginStatus.textContent = r.body.message
      else if (typeof res.body.authUrl === 'string') {
        out.textContent = '请在浏览器打开以下链接完成授权：\n' + res.body.authUrl + '\n\n' + r.body.message
      } else out.textContent = r.body.message
    }
  }, 3000)
}

/**
 * 关闭供应商/编辑弹窗。
 *
 * ⚠️ **必须收口成一个函数**，不能每个入口各写一句 `$('modal').hidden = true`。
 *
 * 根因：API Key 编辑**复用**了主弹窗，它会把标签条（`.modal-tabs`）藏起来。
 * 若关闭时只在「关闭按钮」里恢复标签条，那么走「点遮罩」「Esc」关闭的路径
 * 就不会恢复 —— 下次打开供应商弹窗时，用户会看不到「账号/模型/添加账号」
 * 三个标签（而且刷新才恢复，极难归因）。
 */
/** 恢复标签条（API Key 编辑时被隐藏）+ 回到「账号」页。 */
function resetModalTabs() {
  const tabs = document.querySelector('.modal-tabs')
  if (tabs) tabs.style.display = ''
  $('modal-accounts').hidden = false
  $('modal-models').hidden = true
  $('modal-add').hidden = true
}
function closeModal() {
  resetModalTabs()
  if (f7SheetModal) { f7SheetModal.close(); return }
  $('modal').hidden = true
}
function closeInfo() {
  if (f7SheetInfo) { f7SheetInfo.close(); return }
  $('info-modal').hidden = true
}
$('modal-close').onclick = closeModal
$('info-close').onclick = closeInfo
$('info-modal').onclick = (e) => { if (e.target === $('info-modal')) closeInfo() }
$('modal').onclick = (e) => { if (e.target === $('modal')) closeModal() }
for (const b of document.querySelectorAll('.mtab')) b.onclick = () => switchModalTab(b.dataset.mtab)

/**
 * Escape 关闭弹窗。
 *
 * ## 为什么必须有（实测缺陷）
 *
 * 两个弹窗都只支持「点关闭按钮」与「点遮罩」，**不支持 Esc** ——
 * 而 Esc 是弹窗的**通用约定**（Windows 对话框、macOS、以及所有主流 UI 库
 * 都支持），键盘使用者会习惯性地按它，然后发现「没反应」，
 * 只能费力去寻那个小叉。实测确认：按 Esc 后弹窗**仍然打开**。
 *
 * ## 实现要点
 * - 监听 `document`（不是某个弹窗）—— 焦点在弹窗内的任何元素上都要生效；
 * - 只处理真正可见的弹窗，并把**最上层**的那个关掉（info 弹窗可能叠在
 *   供应商弹窗之上，先关上面那个才符合直觉）；
 * - 无弹窗时**不拦截**，不干扰页面其余键盘行为。
 */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  const info = $('info-modal')
  const main = $('modal')
  if (info && !info.hidden) { info.hidden = true; return }
  // ⚠️ 走 closeModal()（不是直接 `hidden = true`）——它还要恢复标签条，
  // 否则 Esc 关闭 API Key 编辑后，供应商弹窗的标签页会一直失踪。
  if (main && !main.hidden) closeModal()
})

// ────────────────────── 自定义 API Key（子密钥） ──────────────────────
//
// ## 与面板登录密钥的区别（必须让用户看明白）
//
// 面板登录用主密钥（Worker secret `API_KEY`），权限是全量的。
// 这里管理的是**子密钥**：只能调 `/v1/*`，且可逐把限制用量/IP/模型。
// ▼ 页面上有一句明确说明 —— 否则用户会以为「这里显示的就是我登录的那个」。

/** 缓存最近一次拉到的列表（编辑弹窗需要拿原始限制值回填）。 */
let apiKeyCache = []

/** 把毫秒时间戳说成人话（相对现在）。 */
function humanAgo(at) {
  if (!at) return '从未使用'
  const diff = Date.now() - at
  if (diff < 0) return new Date(at).toLocaleString()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s} 秒前`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} 分钟前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} 小时前`
  return `${Math.floor(h / 24)} 天前`
}

/** 配额进度条的百分比（不限时返回 null，表示「不画进度」）。 */
function quotaPct(used, max) {
  if (!max || max <= 0) return null
  return Math.min(100, Math.round((used / max) * 100))
}

/**
 * 把一段剩余时长说成「多久之后」。
 *
 * ⚠️ 与 `humanWait()` **不是同一个函数**：后者返回「N 小时后**恢复**」
 *（用于账号冷却），直接拿它拼「重置」会得到「3 小时后恢复重置」这种病句。
 * 语义不同的文案就该有两个函数，硬复用只会产出错句。
 */
function humanUntil(ms) {
  if (ms <= 0) return '即将'
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s} 秒后`
  const m = Math.round(s / 60)
  if (m < 60) return `${m} 分钟后`
  const h = Math.round(m / 60)
  return `${h} 小时后`
}

/** 把窗口设置说成人话。 */
function humanWindow(hours) {
  if (hours <= 0) return '不重置（累计）'
  if (hours === 24) return '每 24 小时'
  if (hours % 24 === 0) return `每 ${hours / 24} 天`
  return `每 ${hours} 小时`
}

/** 建一个「标签 · 值」的行（弹窗里用）。 */
function kvRow(label, value) {
  const row = document.createElement('div')
  row.className = 'key-kv'
  const k = document.createElement('span'); k.className = 'key-kv-k'; k.textContent = label
  const v = document.createElement('span'); v.className = 'key-kv-v'; v.textContent = value
  row.appendChild(k); row.appendChild(v)
  return row
}

async function loadApiKeys() {
  const box = $('apikeys')
  if (!box) return
  clear(box)
  const res = await api('/admin/apikeys')
  if (!res.ok) {
    const p = document.createElement('p'); p.className = 'hint'; p.textContent = '加载失败'
    box.appendChild(p)
    return
  }
  const keys = (res.body && res.body.keys) || []
  apiKeyCache = keys
  if (keys.length === 0) {
    const p = document.createElement('p'); p.className = 'hint'
    p.textContent = '还没有自定义 API Key。点右上角「新建 API Key」创建一把。'
    box.appendChild(p)
    return
  }
  for (const k of keys) box.appendChild(buildKeyCard(k))
}

/** 建一张密钥卡片。 */
function buildKeyCard(k) {
  const card = document.createElement('div')
  card.className = 'key-card' + (k.enabled ? '' : ' off')
  card.dataset.id = k.id

  // 标题行：名称 + 前缀 + 状态
  const head = document.createElement('div')
  head.className = 'key-head'
  const name = document.createElement('div'); name.className = 'key-name'; name.textContent = k.name
  head.appendChild(name)
  const state = document.createElement('span')
  const expired = k.limits.expiresAt > 0 && Date.now() >= k.limits.expiresAt
  if (!k.enabled) {
    state.className = 'tag err'; state.textContent = '已停用'
  } else if (expired) {
    state.className = 'tag warn'; state.textContent = '已过期'
  } else {
    state.className = 'tag ok'; state.textContent = '启用中'
  }
  head.appendChild(state)
  card.appendChild(head)

  // 前缀（可辨认不可复原）
  const prefix = document.createElement('code')
  prefix.className = 'key-prefix'
  prefix.textContent = k.prefix + '…'
  prefix.title = '这是密钥的开头几位，用于辨认；完整密钥只在创建时显示过一次'
  card.appendChild(prefix)

  // 用量：请求数 + token
  const usage = document.createElement('div')
  usage.className = 'key-usage'
  const reqUsed = k.usage.requests
  const reqMax = k.limits.maxRequests
  const tokUsed = k.usage.inputTokens + k.usage.outputTokens
  const tokMax = k.limits.maxTokens
  usage.appendChild(buildQuotaBar('请求', reqUsed, reqMax))
  usage.appendChild(buildQuotaBar('Token', tokUsed, tokMax))
  // ⚠️ 窗口说明**只写一次**（放在两条配额条下面），不每条都挂一遍：
  // 两条条的窗口本来就是同一个值，重复两遍「每 24 小时」是纯噪音
  //（实测截图确认：同一行文字上下各出现一次，看着像排版错误）。
  // 顺带把「下次重置时刻」算出来 —— 那才是用户真正想知道的信息。
  const winNote = document.createElement('div')
  winNote.className = 'key-quota-note'
  const hours = k.limits.windowHours
  if (hours <= 0) {
    winNote.textContent = '统计窗口：累计不重置'
  } else if (k.usage.windowStart > 0) {
    const resetAt = k.usage.windowStart + hours * 3600 * 1000
    const remain = resetAt - Date.now()
    winNote.textContent = `统计窗口：${humanWindow(hours)}，${humanUntil(remain)}重置`
  } else {
    winNote.textContent = `统计窗口：${humanWindow(hours)}（首次调用后开始计时）`
  }
  usage.appendChild(winNote)
  card.appendChild(usage)

  // 范围：模型 / IP
  const scope = document.createElement('div')
  scope.className = 'key-scope'
  scope.appendChild(kvRow('模型', k.limits.models.length === 0 ? '全部' : `${k.limits.models.length} 个已限定`))
  scope.appendChild(kvRow('来源 IP', k.limits.allowedIps.length === 0 ? '不限' : k.limits.allowedIps.join('、')))
  scope.appendChild(kvRow('过期', k.limits.expiresAt > 0 ? new Date(k.limits.expiresAt).toLocaleString() : '永不过期'))
  scope.appendChild(kvRow('最近使用', humanAgo(k.usage.lastAt)))
  if (k.usage.lastIp) scope.appendChild(kvRow('最近来源', k.usage.lastIp))
  if (k.usage.lastModel) scope.appendChild(kvRow('最近模型', k.usage.lastModel))
  if (k.usage.rejected > 0) {
    scope.appendChild(kvRow('被拒次数', `${k.usage.rejected}（配额/IP/模型）`))
  }
  card.appendChild(scope)

  // 操作
  const actions = document.createElement('div')
  actions.className = 'key-actions'
  const mk = (label, cls, fn, title) => {
    const b = document.createElement('button')
    b.className = cls; b.textContent = label
    if (title) b.title = title
    b.onclick = fn
    return b
  }
  actions.appendChild(mk('编辑', 'ghost', () => openKeyEditor(k)))
  actions.appendChild(mk('重置密钥', 'ghost', () => resetKey(k),
    '生成新的密钥材料；旧密钥立即失效（用量会一并清零）'))
  actions.appendChild(mk('重置用量', 'ghost', () => resetKeyUsage(k)))
  actions.appendChild(mk(k.enabled ? '停用' : '启用', 'ghost', () => toggleKey(k)))
  actions.appendChild(mk('删除', 'danger', () => removeKey(k)))
  card.appendChild(actions)

  return card
}

/** 建一个配额条（不限时不画进度，只显示数字）。 */
function buildQuotaBar(label, used, max) {
  const wrap = document.createElement('div')
  wrap.className = 'key-quota'
  const head = document.createElement('div')
  head.className = 'key-quota-head'
  const l = document.createElement('span'); l.textContent = label
  const v = document.createElement('span'); v.className = 'key-quota-val'
  v.textContent = max > 0 ? `${used.toLocaleString()} / ${max.toLocaleString()}` : `${used.toLocaleString()} / 不限`
  head.appendChild(l); head.appendChild(v)
  wrap.appendChild(head)
  const pct = quotaPct(used, max)
  if (pct !== null) {
    const track = document.createElement('div'); track.className = 'key-quota-track'
    const fill = document.createElement('div'); fill.className = 'key-quota-fill'
    fill.style.width = pct + '%'
    // 接近上限时变色（给一个「快用完了」的前置信号）
    if (pct >= 100) fill.classList.add('full')
    else if (pct >= 80) fill.classList.add('warn')
    track.appendChild(fill)
    wrap.appendChild(track)
  }
  return wrap
}

/** 展示一次性明文（新建 / 重置后）。 */
async function revealKey(plaintext, title, note) {
  $('apikey-reveal-title').textContent = title
  $('apikey-reveal-value').textContent = plaintext
  $('apikey-reveal-note').textContent = note || ''
  $('apikey-reveal').hidden = false
  try { $('apikey-reveal').scrollIntoView({ block: 'nearest' }) } catch { /* 忽略 */ }
}

/** 复制明文到剪贴板（带降级与明确反馈）。 */
async function copyReveal() {
  const text = $('apikey-reveal-value').textContent || ''
  if (text === '') return
  try {
    // ⚠️ `navigator.clipboard` 在**非 HTTPS / 无用户手势**下不可用。
    // 生产环境是 HTTPS，但本地面板可能走 http://localhost —— 故要有降级。
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    $('apikey-copy').textContent = '已复制'
    setTimeout(() => { $('apikey-copy').textContent = '复制' }, 1500)
  } catch {
    // 复制失败也要**让用户能手动选**，而不是什么都没发生
    $('apikey-copy').textContent = '请手动选择复制'
    setTimeout(() => { $('apikey-copy').textContent = '复制' }, 2500)
  }
}

/** 新建 API Key（弹窗填限制）。 */
function createApiKey() {
  openKeyEditor(null)
}

/**
 * 打开密钥编辑弹窗（`existing === null` = 新建）。
 *
 * ⚠️ 新建与编辑共用同一个弹窗：两边的字段完全一样，
 * 写两份必然分叉（本项目在「登录提示渲染」上已经吃过一次这个亏）。
 */
function openKeyEditor(existing) {
  const isNew = existing === null
  const lim = isNew
    ? { maxRequests: 0, maxTokens: 0, windowHours: 24, models: [], allowedIps: [], expiresAt: 0 }
    : existing.limits

  const body = document.createElement('div')
  const hint = document.createElement('p'); hint.className = 'hint'
  hint.textContent = isNew
    ? '填好限制后点「创建」，新密钥会显示一次（务必立刻复制）。'
    : '修改后立即生效。密钥本身不会变（要换密钥请用「重置密钥」）。'
  body.appendChild(hint)

  const nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.placeholder = '名称（例如：我的客户端）'
  nameInput.value = isNew ? '' : existing.name
  nameInput.setAttribute('aria-label', 'API Key 名称')

  // 数字字段统一走这个构造器（保证 label 关联，可访问性不遗漏）
  const numField = (label, value, placeholder) => {
    const wrap = document.createElement('label')
    wrap.className = 'key-field'
    const span = document.createElement('span'); span.textContent = label
    const input = document.createElement('input')
    input.type = 'number'; input.min = '0'; input.step = '1'
    input.value = String(value)
    if (placeholder) input.placeholder = placeholder
    wrap.appendChild(span); wrap.appendChild(input)
    return { wrap, input }
  }

  const req = numField('请求数上限（0 = 不限）', lim.maxRequests)
  const tok = numField('Token 上限（0 = 不限）', lim.maxTokens)
  const win = numField('统计窗口（小时，0 = 累计不重置）', lim.windowHours)

  const modelsWrap = document.createElement('label')
  modelsWrap.className = 'key-field'
  const modelsLabel = document.createElement('span')
  modelsLabel.textContent = '允许的模型（每行一个，留空 = 全部）'
  const modelsArea = document.createElement('textarea')
  modelsArea.rows = 4
  modelsArea.value = lim.models.join('\n')
  modelsArea.placeholder = 'glm-5.3-flash\nbuddy/deepseek-v4.1-flash'
  modelsWrap.appendChild(modelsLabel); modelsWrap.appendChild(modelsArea)

  const ipsWrap = document.createElement('label')
  ipsWrap.className = 'key-field'
  const ipsLabel = document.createElement('span')
  ipsLabel.textContent = '允许的来源 IP（每行一个，留空 = 不限；支持 CIDR）'
  const ipsArea = document.createElement('textarea')
  ipsArea.rows = 3
  ipsArea.value = lim.allowedIps.join('\n')
  ipsArea.placeholder = '203.0.113.7\n10.0.0.0/8'
  ipsWrap.appendChild(ipsLabel); ipsWrap.appendChild(ipsArea)

  const exp = document.createElement('label')
  exp.className = 'key-field'
  const expSpan = document.createElement('span'); expSpan.textContent = '过期时间（留空 = 永不过期）'
  const expInput = document.createElement('input')
  expInput.type = 'datetime-local'
  if (lim.expiresAt > 0) {
    // ⚠️ `datetime-local` 要的是**本地时区**的 `YYYY-MM-DDTHH:mm`，
    // 直接喂 epoch 会显示成 1970。这里做本地时区转换。
    const d = new Date(lim.expiresAt - new Date().getTimezoneOffset() * 60000)
    expInput.value = d.toISOString().slice(0, 16)
  }
  exp.appendChild(expSpan); exp.appendChild(expInput)

  body.appendChild(nameInput)
  body.appendChild(req.wrap)
  body.appendChild(win.wrap)
  body.appendChild(tok.wrap)
  body.appendChild(modelsWrap)
  body.appendChild(ipsWrap)
  body.appendChild(exp)

  const submit = document.createElement('button')
  submit.textContent = isNew ? '创建' : '保存'
  submit.onclick = async () => {
    const lines = (el) => el.value.split('\n').map((x) => x.trim()).filter((x) => x !== '')
    const limits = {
      maxRequests: Number(req.input.value) || 0,
      maxTokens: Number(tok.input.value) || 0,
      // ⚠️ 窗口 0 是合法值（累计不重置）—— 不能用 `|| 24` 吃掉它
      windowHours: req.input.value === '' && win.input.value === '' ? 24 : Math.max(0, Number(win.input.value) || 0),
      models: lines(modelsArea),
      allowedIps: lines(ipsArea),
      expiresAt: expInput.value === '' ? 0 : new Date(expInput.value).getTime(),
    }
    const name = nameInput.value.trim() || '未命名'

    submit.disabled = true
    if (isNew) {
      const r = await api('/admin/apikeys', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, limits }),
      })
      submit.disabled = false
      if (!r.ok) { alert('创建失败：' + JSON.stringify(r.body)); return }
      closeModal()
      await loadApiKeys()
      await revealKey(r.body.key, '密钥已生成（' + name + '）',
        '复制后即可在客户端里用它调用 /v1/chat/completions 或 /v1/responses。')
    } else {
      const r = await api('/admin/apikeys/update', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: existing.id, name, limits }),
      })
      submit.disabled = false
      if (!r.ok) { alert('保存失败：' + JSON.stringify(r.body)); return }
      closeModal()
      await loadApiKeys()
    }
  }
  body.appendChild(submit)

  $('modal-title').textContent = isNew ? '新建 API Key' : `编辑「${existing.name}」`
  const panel = document.createElement('div')
  panel.className = 'key-editor'
  panel.appendChild(body)
  const host = $('modal-add-body')
  clear(host)
  host.appendChild(panel)
  $('modal').hidden = false
  if (f7SheetModal) f7SheetModal.open()
  // ⚠️ 复用主弹窗时要**藏掉三个无关标签页**（它们是供应商维度的），
  // 否则用户会看到「账号/模型/添加账号」而不知道自己在编辑密钥。
  // 关闭时由 `closeModal()` 统一恢复（不能只在这里藏、在关闭按钮里恢复）。
  $('modal-accounts').hidden = true
  $('modal-models').hidden = true
  $('modal-add').hidden = false
  document.querySelector('.modal-tabs').style.display = 'none'
  nameInput.focus()
}

/** 重置密钥（重新生成材料）。 */
async function resetKey(k) {
  if (!confirm(`重置「${k.name}」的密钥？\n\n旧密钥会立即失效（用它的客户端需要换成新密钥）。\n用量计数也会一并清零。`)) return
  const r = await api('/admin/apikeys/reset', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: k.id }),
  })
  if (!r.ok) { alert('重置失败：' + JSON.stringify(r.body)); return }
  await loadApiKeys()
  await revealKey(r.body.key, '已重置（' + k.name + '）',
    '旧密钥已立即失效。请把新密钥更新到使用它的客户端。')
}

/** 只清用量计数（不动密钥）。 */
async function resetKeyUsage(k) {
  if (!confirm(`把「${k.name}」的用量计数清零？\n\n密钥本身不变，只是当前窗口的计数归零。`)) return
  const r = await api('/admin/apikeys/reset-usage', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: k.id }),
  })
  if (!r.ok) { alert('重置失败：' + JSON.stringify(r.body)); return }
  loadApiKeys()
}

/** 停用 / 启用。 */
async function toggleKey(k) {
  const r = await api('/admin/apikeys/update', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: k.id, enabled: !k.enabled }),
  })
  if (!r.ok) { alert('操作失败：' + JSON.stringify(r.body)); return }
  loadApiKeys()
}

/** 删除（不可逆，必须确认）。 */
async function removeKey(k) {
  if (!confirm(`删除「${k.name}」？\n\n这是不可逆操作：用它调用的客户端会立即失败。\n（如果只是想暂时停用，请用「停用」。）`)) return
  const r = await api('/admin/apikeys/remove', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: k.id }),
  })
  if (!r.ok) { alert('删除失败：' + JSON.stringify(r.body)); return }
  loadApiKeys()
}

// ─────────────────────────── 配置 ───────────────────────────

async function loadConfig() {
  const box = $('config')
  clear(box)
  const pairs = []

  const cfgCounts = await fetchPoolCounts()
  const pool = { ok: true, body: { counts: cfgCounts } }
  if (pool.ok && pool.body.counts) {
    const c = pool.body.counts
    pairs.push(['账号总数', c.total], ['可用', c.healthy], ['冷却中', c.cooling],
      ['模型限流', c.modelExempt], ['已禁用', c.disabled])
  }

  const waf = await api('/admin/waf?realm=cn')
  if (waf.ok && waf.body) {
    pairs.push(['IP 级拦截窗口', (waf.body.windowMs / 1000) + ' 秒'],
      ['触发阈值（不同账号数）', waf.body.threshold],
      ['IP 级拦截当前状态', waf.body.active ? '已激活（暂停轮转）' : '未激活'])
  }

  const cred = await api('/admin/credentials?realm=cn')
  // ⚠️ 「已存凭据数」与「账号总数」口径**不同**（前者是凭据存储里的条数，
  // 后者是账号池里能被选中的账号数），可能相差 1~2。
  // 并排展示会让人怀疑有脏数据 ⇒ 把口径写进**值**里说明清楚。
  //（不加 tooltip：表格单元格的 title 在手机上点不出来，等于没有。）
  if (cred.ok && cred.body) {
    pairs.push(['已存凭据数', `${cred.body.count}（凭据存储条数；与账号总数口径不同，可能相差 1~2）`])
  }

  // 任务计划构成（让用户知道会自动做什么）
  pairs.push(['Cron 触发', '每小时 1 次（0 * * * *）'],
    ['任务时点（UTC+8）', '09 签到 / 10 活跃 / 21 签到'],
    ['凭据加密', 'AES-GCM（密钥来自 CREDENTIAL_KEY secret）'])

  box.appendChild(wrapTable(buildTable(['项', '值'], pairs)))

  const note = document.createElement('p'); note.className = 'hint'
  note.textContent = '运行时配置目前通过阿里云 FC 函数的环境变量管理，面板暂不支持在线修改。QQ 机器人配置（见下方）可直接在本页修改，存在账号池加密存储。'
  box.appendChild(note)

  await loadQqSettings()
}

// ─────────────────── QQ 机器人 ───────────────────

/**
 * QQ 机器人（大肥鱼）设置。
 *
 * ## 顺序纪律（写错会直接坏掉）
 *
 * 1. **先在这里填好 AppID 与 AppSecret 并保存**，再去 QQ 开放平台填
 *    回调地址 —— 平台一填地址就立刻发 op=13 验证请求，没配好会验证失败。
 * 2. AppSecret 只在首次配置时必填；之后留空表示“沿用已存的”，不覆盖。
 * 3. 模型默认 `buddy/deepseek-v4.1-flash`（WorkBuddy 的 deepseek，之前用过，
 *    能接住嘴贱/脏话人设；模型名必须带 `buddy/` 前缀）。
 *
 * ## 状态行
 *
 * 只读：是否已配置、开关、最近一次成功回消息时刻、最近失败原因+时刻。
 * AppSecret **永不回显**（接口只回 `hasSecret` 布尔值）。
 */
async function loadQqSettings() {
  const box = $('config')
  const sec = document.createElement('section'); sec.className = 'panel'
  const head = document.createElement('h3'); head.textContent = 'QQ 机器人（大肥鱼）'
  sec.appendChild(head)
  const hint = document.createElement('p'); hint.className = 'hint'
  hint.textContent = '把 QQ 机器人接到网关：群里 @机器人或私聊它，回答由池内账号（WorkBuddy/豆包）出。v1 是无状态的：一条消息进、一条回答出，不保留上下文。'
  sec.appendChild(hint)

  const status = document.createElement('p'); status.className = 'hint'; status.textContent = '加载中…'
  sec.appendChild(status)

  const fmtTime = (ms) => (ms ? new Date(ms).toLocaleString('zh-CN') : '无')

  // 模型下拉（从 /v1/models 取，失败时只留默认值）。
  const modelList = document.createElement('datalist'); modelList.id = 'qq-model-list'
  const mr = await api('/v1/models')
  const modelIds = mr.ok ? ((mr.body && mr.body.data) || []).map((m) => m.id).filter((id) => typeof id === 'string') : []
  if (!modelIds.includes('buddy/deepseek-v4.1-flash')) modelIds.unshift('buddy/deepseek-v4.1-flash')
  for (const id of modelIds) {
    const opt = document.createElement('option'); opt.value = id
    modelList.appendChild(opt)
  }
  sec.appendChild(modelList)

  const mkField = (label, input) => {
    const wrap = document.createElement('div'); wrap.className = 'key-field'
    const lab = document.createElement('label'); lab.textContent = label
    wrap.appendChild(lab); wrap.appendChild(input)
    sec.appendChild(wrap)
    return wrap
  }

  const appId = document.createElement('input'); appId.type = 'text'; appId.placeholder = '1905994654'
  mkField('AppID（QQ 开放平台）', appId)

  const appSecret = document.createElement('input'); appSecret.type = 'password'; appSecret.placeholder = '未设置（必填）'
  mkField('AppSecret（只存加密，不回显）', appSecret)

  const model = document.createElement('input'); model.type = 'text'; model.setAttribute('list', 'qq-model-list')
  model.placeholder = 'buddy/deepseek-v4.1-flash'
  mkField('机器人用的模型', model)

  const enabledWrap = document.createElement('div'); enabledWrap.className = 'key-field'
  const enabledLab = document.createElement('label'); enabledLab.textContent = '启用机器人'
  const enabled = document.createElement('input'); enabled.type = 'checkbox'
  enabledWrap.appendChild(enabledLab); enabledWrap.appendChild(enabled)
  sec.appendChild(enabledWrap)

  const cbWrap = document.createElement('div'); cbWrap.className = 'key-field'
  const cbLab = document.createElement('label'); cbLab.textContent = '回调地址（复制到 QQ 开放平台的回调地址栏）'
  const cbRow = document.createElement('div'); cbRow.style.display = 'flex'; cbRow.style.gap = '8px'
  const cb = document.createElement('input'); cb.type = 'text'; cb.readOnly = true; cb.style.flex = '1'
  const copyBtn = document.createElement('button'); copyBtn.type = 'button'; copyBtn.textContent = '复制'
  copyBtn.onclick = async () => {
    try { await navigator.clipboard.writeText(cb.value); copyBtn.textContent = '已复制' }
    catch { cb.select(); copyBtn.textContent = '已选中，请按 Ctrl+C' }
    setTimeout(() => { copyBtn.textContent = '复制' }, 2000)
  }
  cbRow.appendChild(cb); cbRow.appendChild(copyBtn)
  cbWrap.appendChild(cbLab); cbWrap.appendChild(cbRow)
  sec.appendChild(cbWrap)

  const msg = document.createElement('p'); msg.className = 'hint'
  sec.appendChild(msg)
  const save = document.createElement('button'); save.textContent = '保存 QQ 设置'
  save.onclick = async () => {
    msg.textContent = '保存中…'
    const r = await api('/admin/qq', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        appId: appId.value.trim(),
        appSecret: appSecret.value,
        model: model.value.trim(),
        enabled: enabled.checked,
      }),
    })
    if (!r.ok) {
      msg.textContent = '保存失败：' + ((r.body && r.body.error && r.body.error.message) || '未知错误')
      return
    }
    appSecret.value = ''
    appSecret.placeholder = '已设置（留空则不改）'
    msg.textContent = '已保存。去 QQ 开放平台填回调地址（见上方），并订阅 GROUP_AND_C2C_EVENT 事件。'
    await refreshQqStatus()
  }
  sec.appendChild(save)
  box.appendChild(sec)

  async function refreshQqStatus() {
    const r = await api('/admin/qq')
    if (!r.ok || !r.body) { status.textContent = 'QQ 状态加载失败（密钥或网络问题）'; return }
    const b = r.body
    appId.value = b.appId || '1905994654'
    model.value = b.model || 'buddy/deepseek-v4.1-flash'
    enabled.checked = b.enabled !== false
    cb.value = b.callbackUrl || (API_BASE + '/qq/webhook')
    if (b.hasSecret) appSecret.placeholder = '已设置（留空则不改）'
    const parts = []
    parts.push(b.configured ? '已配置' : '未配置')
    parts.push(b.enabled === false ? '已停用' : '已启用')
    parts.push('最近成功回消息：' + fmtTime(b.lastReplyAt))
    if (b.lastError) parts.push('最近失败：' + b.lastError + '（' + fmtTime(b.lastErrorAt) + '）')
    status.textContent = parts.join(' · ')
  }
  await refreshQqStatus()
}

// ─────────────────────────── 日志 ───────────────────────────

async function loadLogs() {
  const box = $('logs')
  clear(box)
  const res = await api('/admin/logs?realm=cn&limit=100')
  if (!res.ok) { box.textContent = '加载失败'; return }
  const logs = (res.body && res.body.logs) || []
  if (logs.length === 0) {
    box.textContent = '暂无日志。\n\n提示：FC 运行日志在阿里云控制台的日志服务（SLS）里查看（本页只显示面板侧记录的操作）。'
    return
  }
  box.textContent = logs.map((l) => JSON.stringify(l)).join('\n')
}

// ─────────────────────────── WAF 护栏 ───────────────────────────

async function loadWaf() {
  const res = await api('/admin/waf?realm=cn')
  const banner = $('waf-banner')
  if (!res.ok || !res.body || !res.body.active) { banner.hidden = true; return }
  banner.hidden = false
  const remain = Math.max(0, Math.round(((res.body.until || 0) - Date.now()) / 1000))
  $('waf-detail').textContent =
    '已暂停账号轮转（约 ' + remain + ' 秒后自动恢复）。短窗内有 ' +
    (res.body.recentUids || 0) + ' 个不同账号命中 403。'
}

// ─────────────────────────── 知识库（纯前端，零新增服务器） ───────────────────────────
//
// 档 0：全文直塞 + BM25（不用向量、不用下载模型，零成本）。
//   · 只有一篇小文档（≤6000 字）→ 全文贴进 system prompt（Open WebUI 的 RAG_FULL_CONTEXT 思路）。
//   · 多篇文档 → 纯 JS BM25（中文按字/二字词切分）取最相关的块，不全文贴。
// 档 1：纯前端向量 RAG。
//   · 切块：递归切块 1000 字符 / 重叠 150（抄 RecursiveCharacterTextSplitter，
//     分隔符 \n\n → \n → 句 → 字，纯函数无依赖）。
//   · 向量化：bge-small-zh-v1.5（Transformers.js v4，CDN），必须在 Web Worker
//     里跑（kb-worker.js），不放主线程；首次下载约 25MB（q8 量化版），
//     之后走浏览器 Cache Storage。中文只用它，不用 all-MiniLM-L6-v2（英文模型）。
//   · 存储：IndexedDB 存块 + 向量（Float32Array），原文和向量分开存；
//     不要放 localStorage（~5MB 放不下向量）。单库上限 200 篇 / 3000 块。
//   · 检索：BM25 先行，再补向量（余弦 top-4，阈值 0.3），两路合并去重，BM25 优先。
//   · 拼进对话：和 Open WebUI 一样，只是在发给 /v1/chat/completions 的消息数组
//     最前面加一条 system 消息，不改协议；开关关掉时一条多余消息都不加。
//   · 不能做的：扫描版 PDF 没有文本层，抽不到就明确提示，不假装读到了；
//     LanceDB 不能放浏览器（写不了），Chroma/Qdrant/Milvus 要单独部署，都不碰。
const KB_DOCS_KEY = 'wb_kb_docs_v1'
const KB_SETTINGS_KEY = 'wb_kb_settings_v1'
const KB_MAX_DOCS = 200
const KB_MAX_CHUNKS = 3000
const KB_CHUNK_SIZE = 1000
const KB_CHUNK_OVERLAP = 150
const KB_FULL_TEXT_SINGLE_LIMIT = 6000
const KB_CONTEXT_MAX_CHARS = 6000
const KB_VEC_TOPK = 4
const KB_VEC_THRESHOLD = 0.3
const KB_PDFJS_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs'
const KB_PDFJS_WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs'
const KB_MAMMOTH_CDN = 'https://cdn.jsdelivr.net/npm/mammoth@1.11.0/mammoth.browser.min.js'

/* ── 文档（localStorage，只存原文小文本）── */
function kbLoadDocs() {
  try {
    const arr = JSON.parse(localStorage.getItem(KB_DOCS_KEY) || '[]')
    return Array.isArray(arr)
      ? arr.filter((d) => d && typeof d.id === 'string' && typeof d.text === 'string')
      : []
  } catch { return [] }
}
function kbSaveDocs(docs) {
  try { localStorage.setItem(KB_DOCS_KEY, JSON.stringify(docs)) } catch { /* 满了就丢，聊天不受影响 */ }
}
function kbLoadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(KB_SETTINGS_KEY) || '{}')
    return { enabled: s && s.enabled !== false }
  } catch { return { enabled: true } }
}
function kbSaveSettings(s) {
  try { localStorage.setItem(KB_SETTINGS_KEY, JSON.stringify(s)) } catch { /* 忽略 */ }
}
function kbIsEnabled() { return kbLoadSettings().enabled }
function kbTitleOf(docId) {
  const d = kbLoadDocs().find((x) => x.id === docId)
  return d ? d.title : '文档'
}

/* ── IndexedDB（存块 + 向量；localStorage 只有 ~5MB，放不下向量）── */
let kbDbPromise = null
function kbOpenDb() {
  if (kbDbPromise) return kbDbPromise
  kbDbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open('wb_kb_db', 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('chunks')) {
        const st = db.createObjectStore('chunks', { keyPath: 'id' })
        st.createIndex('docId', 'docId', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error || new Error('IndexedDB 打开失败'))
  })
  return kbDbPromise
}
function kbChunksPutAll(rows) {
  return kbOpenDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction('chunks', 'readwrite')
    const st = tx.objectStore('chunks')
    for (const r of rows) st.put(r)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error || new Error('IndexedDB 写入失败'))
  }))
}
function kbChunksDeleteByDoc(docId) {
  return kbOpenDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction('chunks', 'readwrite')
    const st = tx.objectStore('chunks')
    const req = st.index('docId').openKeyCursor(IDBKeyRange.only(docId))
    req.onsuccess = () => {
      const cur = req.result
      if (cur) { st.delete(cur.primaryKey); cur.continue() }
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error || new Error('IndexedDB 删除失败'))
  }))
}
function kbChunksGetAll() {
  return kbOpenDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction('chunks', 'readonly')
    const req = tx.objectStore('chunks').getAll()
    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error || new Error('IndexedDB 读取失败'))
  }))
}

/* ── 切块：递归分隔符 \n\n → \n → 句 → 字，再贪心合并 + 150 字重叠 ── */
function kbRecursiveSplit(text, seps, size) {
  if (text.length <= size) return [text]
  const sep = seps.find((s) => s !== '' && text.indexOf(s) !== -1)
  if (sep === undefined) {
    const out = []
    for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size))
    return out
  }
  const rest = seps.slice(seps.indexOf(sep) + 1)
  const parts = text.split(sep)
  const pieces = []
  for (let i = 0; i < parts.length; i++) {
    const p = i < parts.length - 1 ? parts[i] + sep : parts[i]
    if (!p) continue
    if (p.length > size) pieces.push(...kbRecursiveSplit(p, rest, size))
    else pieces.push(p)
  }
  return pieces
}
function kbSplitText(text, size, overlap) {
  const seps = ['\n\n', '\n', '。', '！', '？', '；', '，', '、', ' ', '']
  const pieces = kbRecursiveSplit(String(text || ''), seps, size).filter((p) => p && p.trim())
  const chunks = []
  let cur = ''
  for (const p of pieces) {
    if (!cur) { cur = p; continue }
    if (cur.length + p.length <= size) { cur += p; continue }
    chunks.push(cur)
    cur = (cur.length > overlap ? cur.slice(-overlap) : cur) + p
    while (cur.length > size) {
      chunks.push(cur.slice(0, size))
      cur = cur.slice(size - overlap)
    }
  }
  if (cur) chunks.push(cur)
  return chunks.filter((c) => c.trim())
}

/* ── BM25：纯 JS 约 50 行，中文按字/二字词切分 ── */
function kbTokenize(text) {
  const toks = []
  const s = String(text || '').toLowerCase()
  let i = 0
  while (i < s.length) {
    const ch = s[i]
    if (/[\u4e00-\u9fff]/.test(ch)) {
      toks.push(ch)
      if (i + 1 < s.length && /[\u4e00-\u9fff]/.test(s[i + 1])) toks.push(ch + s[i + 1])
      i++
    } else if (/[a-z0-9]/.test(ch)) {
      let j = i
      while (j < s.length && /[a-z0-9]/.test(s[j])) j++
      toks.push(s.slice(i, j))
      i = j
    } else i++
  }
  return toks
}
function kbBm25(query, units) {
  const k1 = 1.5, b = 0.75
  const docTokens = units.map((u) => kbTokenize(u.text))
  const df = new Map()
  for (const ts of docTokens) {
    for (const t of new Set(ts)) df.set(t, (df.get(t) || 0) + 1)
  }
  const n = units.length
  const avgLen = docTokens.reduce((a, t) => a + t.length, 0) / Math.max(1, n)
  const qToks = [...new Set(kbTokenize(query))]
  return units.map((u, di) => {
    const ts = docTokens[di]
    const tf = new Map()
    for (const t of ts) tf.set(t, (tf.get(t) || 0) + 1)
    let score = 0
    for (const qt of qToks) {
      const f = tf.get(qt) || 0
      if (!f) continue
      const d = df.get(qt) || 0
      const idf = Math.log(1 + (n - d + 0.5) / (d + 0.5))
      score += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * ts.length / Math.max(1, avgLen)))
    }
    return { unit: u, score }
  }).sort((a, b2) => b2.score - a.score)
}
function kbCosine(a, b) {
  let dot = 0, na = 0, nb = 0
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  const d = Math.sqrt(na) * Math.sqrt(nb)
  return d === 0 ? 0 : dot / d
}

/* ── 向量模型：Web Worker（kb-worker.js）── */
let kbWorker = null
let kbWorkerSeq = 0
const kbWorkerPending = new Map()
let kbModelState = 'idle' // idle | loading | ready | error
let kbModelProgress = 0
let kbModelError = ''
let kbModelReadyPromise = null
function kbEnsureWorker() {
  if (kbWorker) return kbWorker
  kbWorker = new Worker('kb-worker.js?v=2', { type: 'module' })
  kbWorker.onmessage = (ev) => {
    const m = (ev && ev.data) || {}
    if (m.type === 'progress') {
      kbModelState = 'loading'
      kbModelProgress = Math.round((m.progress || 0) * 100)
      kbRenderStatus()
      return
    }
    if (m.type === 'ready') {
      kbModelState = 'ready'
      kbModelProgress = 100
      kbRenderStatus()
      return
    }
    if (m.type === 'embedded') {
      const p = kbWorkerPending.get(m.id)
      if (p) { kbWorkerPending.delete(m.id); p.resolve(m.vectors) }
      return
    }
    if (m.type === 'error') {
      if (m.id !== undefined && m.id !== null) {
        const p = kbWorkerPending.get(m.id)
        if (p) { kbWorkerPending.delete(m.id); p.reject(new Error(m.error || '向量模型失败')); return }
      }
      kbModelState = 'error'
      kbModelError = m.error || '向量模型加载失败'
      kbRenderStatus()
      return
    }
  }
  kbWorker.onerror = (e) => {
    kbModelState = 'error'
    kbModelError = (e && e.message) || 'Worker 加载失败（可能是 CDN 被拦）'
    kbRenderStatus()
  }
  return kbWorker
}
// 只在用户主动点“开始建索引”时调。聊天时绝不因此等 25MB 下载——
// 模型没就绪，提问就只走 BM25。
function kbEnsureModel() {
  if (kbModelState === 'ready') return Promise.resolve(true)
  if (kbModelReadyPromise) return kbModelReadyPromise
  kbModelReadyPromise = new Promise((resolve) => {
    const done = (ok) => { kbModelReadyPromise = null; resolve(ok) }
    const check = setInterval(() => {
      if (kbModelState === 'ready') { clearInterval(check); done(true) }
      else if (kbModelState === 'error') { clearInterval(check); done(false) }
    }, 400)
    try {
      const w = kbEnsureWorker()
      kbModelState = 'loading'
      kbModelProgress = 0
      kbRenderStatus()
      w.postMessage({ type: 'init' })
    } catch (e) {
      clearInterval(check)
      kbModelState = 'error'
      kbModelError = e && e.message ? e.message : String(e)
      kbRenderStatus()
      done(false)
    }
  })
  return kbModelReadyPromise
}
function kbEmbedTexts(texts) {
  return new Promise((resolve, reject) => {
    if (kbModelState !== 'ready') { reject(new Error('向量模型未就绪')); return }
    const w = kbEnsureWorker()
    const id = ++kbWorkerSeq
    kbWorkerPending.set(id, { resolve, reject })
    setTimeout(() => {
      if (kbWorkerPending.has(id)) { kbWorkerPending.delete(id); reject(new Error('向量化超时（60 秒）')) }
    }, 60000)
    w.postMessage({ type: 'embed', id, texts })
  })
}

/* ── 文档操作 ── */
function kbAddDoc(title, text, source) {
  const docs = kbLoadDocs()
  if (docs.length >= KB_MAX_DOCS) { alert('知识库已满（最多 ' + KB_MAX_DOCS + ' 篇），先删一些再传'); return null }
  const clean = String(text || '').replace(/\r\n/g, '\n').trim()
  if (!clean) { alert('内容是空的'); return null }
  if (clean.length > 200000) { alert('单篇文档超过 20 万字，太大了，先拆小再传'); return null }
  const doc = {
    id: 'kb' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
    title: String(title || '未命名文档').slice(0, 60) || '未命名文档',
    text: clean, chars: clean.length, source: source || 'paste', createdAt: Date.now(),
  }
  docs.push(doc)
  kbSaveDocs(docs)
  // 入库就切块存 IndexedDB（不含向量）；向量等“开始建索引”时再嵌。
  void kbIndexDoc(doc)
  kbRenderDocs()
  kbRenderStatus()
  return doc
}
async function kbIndexDoc(doc) {
  const chunks = kbSplitText(doc.text, KB_CHUNK_SIZE, KB_CHUNK_OVERLAP)
  const all = await kbChunksGetAll().catch(() => [])
  const others = all.filter((c) => c.docId !== doc.id).length
  if (others + chunks.length > KB_MAX_CHUNKS) {
    kbSetStatus('块数超过上限（最多 ' + KB_MAX_CHUNKS + ' 块），这篇只存了原文，没切块。')
    return false
  }
  await kbChunksDeleteByDoc(doc.id).catch(() => {})
  await kbChunksPutAll(chunks.map((t, i) => ({ id: doc.id + ':' + i, docId: doc.id, idx: i, text: t, vec: null })))
  kbRenderStatus()
  return true
}
async function kbDeleteDoc(id) {
  kbSaveDocs(kbLoadDocs().filter((d) => d.id !== id))
  await kbChunksDeleteByDoc(id).catch(() => {})
  kbRenderDocs()
  kbRenderStatus()
}

/* ── 建索引：切块 → 加载模型 → 分批嵌向量 ── */
let kbIndexing = false
let kbIndexProgress = ''
async function kbIndexAll() {
  if (kbIndexing) return
  kbIndexing = true
  kbIndexProgress = ''
  kbRenderStatus()
  try {
    const docs = kbLoadDocs()
    if (!docs.length) { kbSetStatus('库里还没有文档，先上传或粘贴一篇。'); return }
    for (const d of docs) await kbIndexDoc(d)
    const chunks = await kbChunksGetAll()
    const missing = chunks.filter((c) => !c.vec)
    if (!missing.length) { kbSetStatus('全部块都已有向量，无需重嵌。'); return }
    kbSetStatus('正在加载向量模型（首次约 25MB，之后走缓存）…')
    const ok = await kbEnsureModel()
    if (!ok) {
      kbSetStatus('向量模型加载失败：' + (kbModelError || '未知原因') + '。块已切好，检索先走 BM25，不影响聊天。')
      return
    }
    const BATCH = 8
    const total = missing.length
    for (let i = 0; i < missing.length; i += BATCH) {
      const batch = missing.slice(i, i + BATCH)
      kbIndexProgress = '正在嵌向量：第 ' + (i + 1) + '–' + Math.min(i + BATCH, total) + ' / ' + total + ' 块'
      kbRenderStatus()
      const vecs = await kbEmbedTexts(batch.map((c) => c.text))
      await kbChunksPutAll(batch.map((c, j) => ({ id: c.id, docId: c.docId, idx: c.idx, text: c.text, vec: new Float32Array(vecs[j]) })))
    }
    kbIndexProgress = ''
    kbSetStatus('索引完成：' + total + ' 块已有向量。')
  } catch (e) {
    kbIndexProgress = ''
    kbSetStatus('建索引失败：' + (e && e.message ? e.message : String(e)))
  } finally {
    kbIndexing = false
    kbRenderDocs()
    kbRenderStatus()
  }
}

/* ── 检索：BM25 先行，再补向量，两路合并去重，BM25 优先 ── */
async function kbRetrieve(question) {
  const docs = kbLoadDocs()
  const q = String(question || '').trim()
  if (!docs.length || !q) return []
  // 只有一篇小文档：全文直塞。
  if (docs.length === 1 && docs[0].chars <= KB_FULL_TEXT_SINGLE_LIMIT) {
    return [{ id: 'doc:' + docs[0].id, docId: docs[0].id, title: docs[0].title, text: docs[0].text, score: 1, source: 'full' }]
  }
  const chunks = await kbChunksGetAll().catch(() => [])
  let units
  if (chunks.length) {
    units = chunks.map((c) => ({ id: c.id, docId: c.docId, title: kbTitleOf(c.docId), text: c.text, vec: c.vec || null }))
  } else {
    units = docs.map((d) => ({ id: 'doc:' + d.id, docId: d.id, title: d.title, text: d.text, vec: null }))
  }
  const ranked = kbBm25(q, units)
  const top = ranked.length ? ranked[0].score : 0
  const bm = ranked.filter((r) => r.score > 0 && r.score >= Math.max(0.01, top * 0.25)).slice(0, 3)
  let vecHits = []
  if (kbModelState === 'ready') {
    const withVec = units.filter((u) => u.vec)
    if (withVec.length) {
      try {
        const qv = (await kbEmbedTexts([q]))[0]
        vecHits = withVec
          .map((u) => ({ unit: u, score: kbCosine(qv, u.vec) }))
          .filter((r) => r.score >= KB_VEC_THRESHOLD)
          .sort((a, b) => b.score - a.score)
          .slice(0, KB_VEC_TOPK)
          .map((r) => ({ id: r.unit.id, docId: r.unit.docId, title: r.unit.title, text: r.unit.text, score: r.score, source: 'vec' }))
      } catch { /* 向量失败就只用 BM25，不卡聊天 */ }
    }
  }
  const seen = new Set()
  const merged = []
  for (const r of bm) {
    if (seen.has(r.unit.id)) continue
    seen.add(r.unit.id)
    merged.push({ id: r.unit.id, docId: r.unit.docId, title: r.unit.title, text: r.unit.text, score: r.score, source: 'bm25' })
  }
  for (const r of vecHits) {
    if (seen.has(r.id)) continue
    seen.add(r.id)
    merged.push(r)
  }
  return merged.slice(0, 4)
}

/* ── 拼进对话的 system 消息（Open WebUI 的模板思路）──
 * 开关关掉 / 没命中 / 库是空的 → 返回 ''，调用方一条多余消息都不加。 */
async function kbBuildSystemMessage(question) {
  if (!kbIsEnabled()) return ''
  let hits
  try { hits = await kbRetrieve(question) } catch { return '' }
  if (!hits.length) return ''
  let total = 0
  const blocks = []
  for (const h of hits) {
    let t = h.text
    if (total + t.length > KB_CONTEXT_MAX_CHARS) t = t.slice(0, Math.max(0, KB_CONTEXT_MAX_CHARS - total))
    if (!t) continue
    total += t.length
    blocks.push('[' + (blocks.length + 1) + '] 《' + h.title + '》：\n' + t)
  }
  if (!blocks.length) return ''
  return '以下是从你的知识库检索到的资料，请只根据这些资料回答，资料里没有答案就直接说不知道，不要编造；回答时在相关句子后标注来源编号，如 [1]：\n\n' + blocks.join('\n\n')
}

/* ── 文件抽文本：txt/md 直接读；文本型 PDF 用 pdf.js；DOCX 用 mammoth ── */
let kbPdfjsPromise = null
function kbLoadPdfjs() {
  if (!kbPdfjsPromise) {
    kbPdfjsPromise = import(KB_PDFJS_CDN).then((m) => {
      m.GlobalWorkerOptions.workerSrc = KB_PDFJS_WORKER
      return m
    })
  }
  return kbPdfjsPromise
}
let kbMammothPromise = null
function kbLoadMammoth() {
  if (!kbMammothPromise) {
    kbMammothPromise = new Promise((resolve, reject) => {
      if (window.mammoth) { resolve(window.mammoth); return }
      const s = document.createElement('script')
      s.src = KB_MAMMOTH_CDN
      s.onload = () => resolve(window.mammoth)
      s.onerror = () => reject(new Error('mammoth.js 加载失败（CDN 被拦）'))
      document.head.appendChild(s)
    })
  }
  return kbMammothPromise
}
async function kbExtractFile(file) {
  const name = file.name || '未命名'
  const ext = (name.split('.').pop() || '').toLowerCase()
  if (ext === 'txt' || ext === 'md' || ext === 'markdown' || (file.type && file.type.indexOf('text/') === 0)) {
    return { title: name.replace(/\.[^.]+$/, ''), text: await file.text() }
  }
  if (ext === 'pdf') {
    const buf = await file.arrayBuffer()
    const pdfjs = await kbLoadPdfjs()
    const pdf = await pdfjs.getDocument({ data: buf }).promise
    let text = ''
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p)
      const tc = await page.getTextContent()
      text += tc.items.map((it) => it.str || '').join('') + '\n'
    }
    text = text.trim()
    // ⚠️ 扫描版 / 无文本层：抽不到字就明说，不假装读到了，不入库。
    // 阈值 10 个非空字符：扫描件通常是 0 字（最多一两字页码），而真正的
    // 短文本 PDF（一行标题也不止 10 字）不会被误杀。
    if (text.replace(/\s/g, '').length < 10) {
      throw new Error('这份 PDF 几乎没有可抽取的文字（共 ' + pdf.numPages + ' 页），可能是扫描版图片型 PDF，浏览器读不到文字，需要先 OCR 才能入库；没有入库。')
    }
    return { title: name.replace(/\.pdf$/i, ''), text }
  }
  if (ext === 'docx') {
    const buf = await file.arrayBuffer()
    const mammoth = await kbLoadMammoth()
    const r = await mammoth.extractRawText({ arrayBuffer: buf })
    const text = (r.value || '').trim()
    if (!text) throw new Error('这个 DOCX 里没有抽到文字。')
    return { title: name.replace(/\.docx$/i, ''), text }
  }
  throw new Error('不支持的文件格式：只支持 txt / md / 文本型 PDF / DOCX。')
}

/* ── 知识库视图 ── */
let kbBound = false
let kbStatusText = ''
function kbSetStatus(t) {
  kbStatusText = t || ''
  const el = $('kb-status')
  if (el) el.textContent = kbStatusText
}
function kbRenderDocs() {
  const box = $('kb-docs')
  if (!box) return
  clear(box)
  const docs = kbLoadDocs()
  if (!docs.length) {
    const p = document.createElement('p')
    p.className = 'hint'
    p.textContent = '还没有文档。传 txt/md/PDF/DOCX，或在上面粘贴文本建一篇。'
    box.appendChild(p)
    return
  }
  for (const d of docs) {
    const row = document.createElement('div')
    row.className = 'kb-doc'
    const info = document.createElement('div')
    info.className = 'kb-doc-info'
    const title = document.createElement('div')
    title.className = 'kb-doc-title'
    title.textContent = d.title
    const meta = document.createElement('div')
    meta.className = 'kb-doc-meta'
    meta.textContent = d.chars + ' 字 · ' + (d.source === 'upload' ? '上传' : d.source === 'pdf' ? 'PDF' : d.source === 'docx' ? 'DOCX' : '粘贴')
    info.appendChild(title)
    info.appendChild(meta)
    const del = document.createElement('button')
    del.type = 'button'
    del.className = 'ghost kb-doc-del'
    del.textContent = '删除'
    del.onclick = () => {
      if (!confirm('删除《' + d.title + '》？它的块和向量也会一起删掉。')) return
      void kbDeleteDoc(d.id)
    }
    row.appendChild(info)
    row.appendChild(del)
    box.appendChild(row)
  }
}
async function kbRenderStatus() {
  const sizeEl = $('kb-size')
  if (!sizeEl) return
  const docs = kbLoadDocs()
  const chunks = await kbChunksGetAll().catch(() => [])
  const withVec = chunks.filter((c) => c.vec).length
  sizeEl.textContent = '文档 ' + docs.length + ' 篇 / 块 ' + chunks.length + ' 个 / 已嵌向量 ' + withVec + ' 块'
  const modelEl = $('kb-model-status')
  if (modelEl) {
    modelEl.textContent = kbModelState === 'ready'
      ? '向量模型已就绪（bge-small-zh-v1.5，512 维）'
      : kbModelState === 'loading'
        ? '向量模型下载中 ' + kbModelProgress + '%（首次约 25MB，之后走浏览器缓存）'
        : kbModelState === 'error'
          ? '向量模型加载失败：' + kbModelError + '（检索先走 BM25，不影响聊天）'
          : '向量模型未加载（点“开始建索引”加载，首次约 25MB）'
  }
  const progEl = $('kb-index-progress')
  if (progEl) progEl.textContent = kbIndexProgress
  const stEl = $('kb-status')
  if (stEl) stEl.textContent = kbStatusText
}
function initKB() {
  kbRenderDocs()
  void kbRenderStatus()
  if (kbBound) return
  kbBound = true
  const toggle = $('kb-enabled')
  if (toggle) {
    toggle.checked = kbIsEnabled()
    toggle.onchange = () => {
      kbSaveSettings({ enabled: !!toggle.checked })
      kbSetStatus(toggle.checked ? '知识库已开启，对话时会先检索再回答。' : '知识库已关闭，对话不再拼任何资料。')
    }
  }
  const uploadBtn = $('kb-upload-btn')
  const fileInput = $('kb-file')
  if (uploadBtn && fileInput) {
    uploadBtn.onclick = () => fileInput.click()
    fileInput.onchange = async () => {
      const files = [...(fileInput.files || [])]
      fileInput.value = ''
      if (!files.length) return
      for (const f of files) {
        try {
          kbSetStatus('正在读《' + f.name + '》…')
          const out = await kbExtractFile(f)
          const src = /\.pdf$/i.test(f.name) ? 'pdf' : /\.docx$/i.test(f.name) ? 'docx' : 'upload'
          const doc = kbAddDoc(out.title, out.text, src)
          if (doc) kbSetStatus('已入库《' + doc.title + '》（' + doc.chars + ' 字）。')
        } catch (e) {
          alert(e && e.message ? e.message : '读取失败')
          kbSetStatus('')
        }
      }
      kbRenderDocs()
      void kbRenderStatus()
    }
  }
  const pasteBtn = $('kb-paste-add')
  if (pasteBtn) {
    pasteBtn.onclick = () => {
      const titleEl = $('kb-paste-title')
      const textEl = $('kb-paste-text')
      const text = textEl ? textEl.value : ''
      const title = titleEl && titleEl.value.trim() ? titleEl.value.trim() : '粘贴文档'
      const doc = kbAddDoc(title, text, 'paste')
      if (doc) {
        if (titleEl) titleEl.value = ''
        if (textEl) textEl.value = ''
        kbSetStatus('已入库《' + doc.title + '》（' + doc.chars + ' 字）。')
      }
    }
  }
  const indexBtn = $('kb-index-btn')
  if (indexBtn) indexBtn.onclick = () => { void kbIndexAll() }
  const clearBtn = $('kb-clear-btn')
  if (clearBtn) {
    clearBtn.onclick = async () => {
      if (!kbLoadDocs().length) return
      if (!confirm('清空整个知识库？所有文档、块和向量都会删掉。')) return
      for (const d of kbLoadDocs()) await kbChunksDeleteByDoc(d.id).catch(() => {})
      kbSaveDocs([])
      kbSetStatus('知识库已清空。')
      kbRenderDocs()
      void kbRenderStatus()
    }
  }
}

// 测试/排障用（Playwright 验检索时直接调，不影响正常使用）。
window.__kb = {
  docs: kbLoadDocs,
  chunks: kbChunksGetAll,
  retrieve: kbRetrieve,
  buildSystemMessage: kbBuildSystemMessage,
  indexAll: kbIndexAll,
  ensureModel: kbEnsureModel,
  modelState: () => ({ state: kbModelState, progress: kbModelProgress, error: kbModelError }),
  enabled: kbIsEnabled,
}

// ─────────────────────────── 对话（首页） ───────────────────────────

/**
 * 首页对话：直接调网关的 /v1/chat/completions（OpenAI 兼容）。
 *
 * ## 鉴权：用 panel 已存的 key（wb_api_key，主密钥）
 *
 * 网关 `authenticate()` 的规矩（见网关源码 server.mjs）：
 * - Bearer == 环境变量 API_KEY ⇒ kind "admin"，**不限模型白名单、不计子密钥配额**；
 * - 否则按哈希查子密钥 ⇒ kind "subkey"，受**用量限额、模型白名单、IP 白名单**卡，
 *   超了就 403/429。
 * 对话是机主本人在用，不是发给外部调用方 —— 用主密钥最直接，
 * 且不会被某个子密钥的限额挡住。请求走下面 `chatComplete`，与 `api()` 同一套
 * Authorization 头，只是要读流式响应所以不用 `api()`（它会先 `res.text()` 读完）。
 *
 * ## 流式：stream: true 走 SSE
 *
 * 网关 `handleChatCompletions` 支持 `stream: true`（回 text/event-stream），
 * 也支持 `stream: false`（回 JSON）。这里先走流式逐字回显；若响应不是
 * event-stream（或流中途断了），回落到一次性的 JSON 解析。
 */
const CHAT_HISTORY_KEY = 'wb_chat_history_v1'
const CHAT_MODEL_KEY = 'wb_chat_model'
const CHAT_MAX_MESSAGES = 100
// 一次请求最多带多少条历史（绑住 token 消耗；本地仍存满 100 条）。
const CHAT_MAX_CONTEXT = 40
let chatMessages = []
let chatModels = []
let chatModelsLoaded = false
let chatStreaming = false
let chatAbort = null
let chatBound = false

/** 读本地对话记录（坏了就丢弃，不让坏 JSON 堵死首页）。
 *  content 可能是字符串，也可能是多模态数组（带图的消息在内存里是数组；
 *  存盘时只留文字，见 saveChatHistory）。读到数组只取文字部分。 */
function loadChatHistory() {
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY)
    const arr = raw ? JSON.parse(raw) : []
    chatMessages = Array.isArray(arr)
      ? arr.filter((m) => m && (m.role === 'user' || m.role === 'assistant') && (typeof m.content === 'string' || Array.isArray(m.content)))
        .map((m) => (typeof m.content === 'string' ? m : { role: m.role, content: chatContentText(m.content) }))
      : []
  } catch {
    chatMessages = []
  }
}

/** 存本地对话记录（只留最近 100 条）。
 *  ⚠️ 图片 base64 不进 localStorage（5MB 放不下）：数组 content 存盘时
 *  只留文字部分，原图数据发完就丢（内存里的那份也只活到本次会话）。 */
function saveChatHistory() {
  try {
    // 动作卡片是面板 UI，不进对话记录（重开面板后卡片消失，确认态也不留）。
    const clean = chatMessages.filter((m) => m.role !== 'action').slice(-CHAT_MAX_MESSAGES).map((m) => (
      typeof m.content === 'string' ? m : { role: m.role, content: chatContentText(m.content) }
    ))
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(clean))
  } catch {
    // localStorage 满了也不影响聊天本身。
  }
}

/** 通用复制：先走 navigator.clipboard，不可用时降级 textarea+execCommand。 */
async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

const COPY_ICON_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
const CHECK_ICON_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'
const SPEAKER_ICON_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>'
const STOP_SMALL_SVG = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>'

/** 多模态 content 里的文字部分（字符串直接返回，数组只拼 text 块）。 */
function chatContentText(content) {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.filter((p) => p && p.type === 'text').map((p) => p.text || '').join('')
  }
  return ''
}

/** 多模态 content 里的图片 data URL（没有就返回空串）。 */
function chatContentImage(content) {
  if (!Array.isArray(content)) return ''
  const p = content.find((x) => x && x.type === 'image_url' && x.image_url && typeof x.image_url.url === 'string')
  return p ? p.image_url.url : ''
}
/** 多模态 content 里的全部图片 data URL（附件最多 3 张）。 */
function chatContentImages(content) {
  if (!Array.isArray(content)) return []
  return content.filter((x) => x && x.type === 'image_url' && x.image_url && typeof x.image_url.url === 'string').map((x) => x.image_url.url)
}

/** 兜底气泡里的动作卡片（F7 模式走 actionCardHtml 那条 HTML）。 */
function actionCardEl(c) {
  const row = document.createElement('div')
  row.className = 'chat-msg assistant'
  const card = document.createElement('div')
  card.className = 'action-card'
  const title = document.createElement('div')
  title.className = 'action-card-title'
  const statusText = { pending: '等你确认', running: '执行中…', done: '已执行', cancelled: '已取消', failed: '失败' }[c.status] || c.status
  title.textContent = '⚙️ ' + actionCardTitle(c) + ' · ' + statusText
  card.appendChild(title)
  if ((c.status === 'done' || c.status === 'failed') && c.result) {
    const body = document.createElement('div')
    body.className = 'action-card-body'
    body.textContent = c.status === 'done'
      ? '结果：' + (c.result.title ? c.result.title + '（' + (c.result.chars || 0) + ' 字）' : c.result.model || c.result.view || '完成')
      : '原因：' + (c.result.error || '未知错误')
    card.appendChild(body)
  }
  if (c.status === 'pending') {
    const actions = document.createElement('div')
    actions.className = 'action-card-actions'
    const okBtn = document.createElement('button')
    okBtn.type = 'button'
    okBtn.className = 'action-confirm'
    okBtn.textContent = '确认执行'
    okBtn.onclick = () => panelActionConfirm(c.id, true)
    const noBtn = document.createElement('button')
    noBtn.type = 'button'
    noBtn.className = 'action-cancel'
    noBtn.textContent = '取消'
    noBtn.onclick = () => panelActionConfirm(c.id, false)
    actions.appendChild(okBtn)
    actions.appendChild(noBtn)
    card.appendChild(actions)
  }
  row.appendChild(card)
  return row
}

/** 发给模型的历史：只保留最新一条用户消息里的图片，旧图只留文字
 *  （省 token，也避免同一张 base64 每次请求都重发）。动作卡片是面板 UI，
 *  不发给模型。 */
function chatRequestMessages(list) {
  const filtered = list.filter((m) => m.role !== 'action')
  let lastUserIdx = -1
  for (let i = filtered.length - 1; i >= 0; i--) {
    if (filtered[i].role === 'user') { lastUserIdx = i; break }
  }
  return filtered.map((m, i) => {
    if (typeof m.content === 'string' || i === lastUserIdx) return m
    return { role: m.role, content: chatContentText(m.content) }
  })
}

/* ── 朗读：speechSynthesis 手动点按朗读 ──────────────────────────
 * 只做手动点按，不做回答完自动朗读：iOS 上流式回答结束后再调 speak()，
 * 手势已过期会报 not-allowed。第一次 speak 必须同步发生在点按处理
 * 函数里，下面 ttsSpeak() 里没有任何 await 就调 speak()，满足这点。
 * 长回答按句切段、每段不超过约 200 字，逐段念。 */
let ttsState = null // { btn }：正在朗读的按钮
function ttsPickVoice() {
  try {
    const vs = window.speechSynthesis.getVoices() || []
    return vs.find((v) => v.lang && v.lang.toLowerCase().indexOf('zh') === 0) || null
  } catch { return null }
}
function ttsSplit(text) {
  const clean = String(text || '').replace(/[*`#_~>|]/g, '').replace(/\s+/g, ' ').trim()
  if (!clean) return []
  const parts = clean.match(/[^。！？!?\n]+[。！？!?\n]?/g) || [clean]
  const chunks = []
  for (const p of parts) {
    const t = p.trim()
    if (!t) continue
    if (t.length <= 200) chunks.push(t)
    else for (let i = 0; i < t.length; i += 200) chunks.push(t.slice(i, i + 200))
  }
  return chunks
}
function ttsStop() {
  try { if ('speechSynthesis' in window) window.speechSynthesis.cancel() } catch { /* 忽略 */ }
  if (ttsState && ttsState.btn) {
    ttsState.btn.classList.remove('speaking')
    ttsState.btn.innerHTML = SPEAKER_ICON_SVG
    ttsState.btn.title = '朗读'
  }
  ttsState = null
}
function ttsSpeak(text, btn) {
  if (!('speechSynthesis' in window)) { alert('当前浏览器不支持朗读'); return }
  // 再点一次同一按钮 = 停止。
  if (ttsState && ttsState.btn === btn) { ttsStop(); return }
  ttsStop()
  const chunks = ttsSplit(text)
  if (chunks.length === 0) return
  const voice = ttsPickVoice()
  let idx = 0
  ttsState = { btn }
  btn.classList.add('speaking')
  btn.innerHTML = STOP_SMALL_SVG
  btn.title = '停止朗读'
  const speakNext = () => {
    if (!ttsState || ttsState.btn !== btn) return
    if (idx >= chunks.length) { ttsStop(); return }
    const u = new SpeechSynthesisUtterance(chunks[idx++])
    u.lang = 'zh-CN'
    if (voice) u.voice = voice
    u.onend = () => { if (ttsState && ttsState.btn === btn) speakNext() }
    u.onerror = () => { ttsStop() }
    try { window.speechSynthesis.speak(u) } catch { ttsStop() }
  }
  // ⚠️ 同步调 speak()：第一次 speak 发生在点按处理函数里，手势不过期。
  speakNext()
}

/* ── 附件：图片 + 文件（2026-11-16 用户：输入框少了上传功能）──
 * 开源做法（ChatGPT / Open WebUI / LibreChat）：`+` 常驻，点开底部菜单
 * （拍照 / 相册选图 / 选文件），附件以 chips 排在输入框上方，每个带 ×，
 * 最多 3 个。图片走 NextChat 的 base64 路线（canvas 压到约 256KB JPEG，
 * HEIC 也靠 canvas 转出来），发消息时拼成 OpenAI 多模态 content 数组。
 * 注：/v1/models 里确实有 supportsImage 字段，但 10 个 buddy 模型全是
 * true（连 deepseek-v4.1-flash 也是），拿它当视觉开关会把上传按钮挂到
 * 所有 buddy 模型上——所以只按名字匹配 kimi（唯一实测过的视觉模型）；
 * 非视觉模型下按钮也不藏了（以前藏起来等于功能消失），选图后在预览条
 * 上给“当前模型看不懂图”+“切到 kimi 看图”，用户自己决定。
 * 文件走知识库现成的 kbExtractFile（txt/md 直接读，文本型 PDF 用 pdf.js，
 * DOCX 用 mammoth）：≤6000 字默认本次对话直接读，可切到存知识库；
 * 超过 6000 字或 PDF/DOCX 默认存知识库（长文档塞对话烧积分又容易超上下文）。 */
const ATTACH_MAX = 3
const ATTACH_CHAT_TEXT_LIMIT = 6000
let pendingAttachments = [] // [{kind:'image', name, size, dataUrl, blobUrl} | {kind:'file', name, size, title, text, dest:'chat'|'kb'}]
const VISION_MODEL_RE = /kimi/i
function isVisionModel(id) { return !!id && VISION_MODEL_RE.test(id) }
function updateAttachVisibility() {
  // + 按钮永远显示（2026-11-16 用户：藏起来等于没有）；模型切换只改
  // 预览条上的视觉提示，不改按钮显隐。
  const btn = $('chat-attach')
  if (btn) btn.hidden = false
  updateAttachHint()
}
function updateAttachHint() {
  const hint = $('attach-hint')
  if (!hint) return
  const hasImage = pendingAttachments.some((a) => a.kind === 'image')
  hint.hidden = !(hasImage && !isVisionModel(chatModel()))
}
function attachCountLabel(a) {
  return a.name + '（约 ' + Math.round(a.size / 1024) + 'KB）'
}
function renderAttachPreview() {
  const wrap = $('chat-image-preview')
  const chips = $('attach-chips')
  if (!wrap || !chips) return
  clear(chips)
  for (let i = 0; i < pendingAttachments.length; i++) {
    const a = pendingAttachments[i]
    const chip = document.createElement('div')
    chip.className = 'attach-chip'
    if (a.kind === 'image') {
      const img = document.createElement('img')
      img.src = a.blobUrl
      img.alt = a.name
      chip.appendChild(img)
    }
    const name = document.createElement('span')
    name.className = 'attach-chip-name'
    name.textContent = attachCountLabel(a)
    chip.appendChild(name)
    if (a.kind === 'file') {
      const dest = document.createElement('button')
      dest.type = 'button'
      dest.className = 'attach-chip-dest'
      dest.textContent = a.dest === 'kb' ? '存知识库' : '本次直接读'
      dest.title = '点一下切换去向'
      dest.onclick = () => {
        a.dest = a.dest === 'kb' ? 'chat' : 'kb'
        renderAttachPreview()
      }
      chip.appendChild(dest)
    }
    const rm = document.createElement('button')
    rm.type = 'button'
    rm.className = 'attach-chip-remove'
    rm.textContent = '×'
    rm.title = '删除这个附件'
    rm.setAttribute('aria-label', '删除附件 ' + a.name)
    rm.onclick = () => removeAttachment(i)
    chip.appendChild(rm)
    chips.appendChild(chip)
  }
  wrap.hidden = pendingAttachments.length === 0
  updateAttachHint()
  // 预览占了高度，消息区底部多留空，免得最后一条消息滑到预览底下。
  const box = $('chat-messages')
  if (box) box.style.paddingBottom = pendingAttachments.length ? '170px' : ''
}
function removeAttachment(i) {
  const a = pendingAttachments[i]
  if (a && a.kind === 'image' && a.blobUrl) URL.revokeObjectURL(a.blobUrl)
  pendingAttachments.splice(i, 1)
  renderAttachPreview()
}
function clearPendingAttachments() {
  for (const a of pendingAttachments) {
    if (a.kind === 'image' && a.blobUrl) URL.revokeObjectURL(a.blobUrl)
  }
  pendingAttachments = []
  renderAttachPreview()
  for (const id of ['chat-image-input', 'chat-camera-input', 'chat-file-input']) {
    const fi = $(id)
    if (fi) fi.value = ''
  }
}
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const maxSide = 1024
        let w = img.naturalWidth, h = img.naturalHeight
        const s = Math.min(1, maxSide / Math.max(w, h))
        w = Math.max(1, Math.round(w * s))
        h = Math.max(1, Math.round(h * s))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        URL.revokeObjectURL(url)
        // 质量逐档降，直到 ≤256KB 或到底线 0.4。
        const tryQ = (q) => {
          canvas.toBlob((blob) => {
            if (!blob) { reject(new Error('图片压缩失败')); return }
            if (blob.size > 256 * 1024 && q > 0.4) { tryQ(Math.round((q - 0.15) * 100) / 100); return }
            const reader = new FileReader()
            reader.onload = () => resolve({ dataUrl: reader.result, blob, name: file.name, size: blob.size })
            reader.onerror = () => reject(new Error('图片读取失败'))
            reader.readAsDataURL(blob)
          }, 'image/jpeg', q)
        }
        tryQ(0.85)
      } catch (e) { URL.revokeObjectURL(url); reject(e) }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('这张图打不开（可能是 HEIC 格式，当前浏览器不支持），换一张试试'))
    }
    img.src = url
  })
}
async function onImageFile(file) {
  if (!file) return
  if (!file.type || file.type.indexOf('image/') !== 0) { alert('请选择图片文件'); return }
  if (pendingAttachments.length >= ATTACH_MAX) { alert('一次最多挂 ' + ATTACH_MAX + ' 个附件，先发掉或删一个再加'); return }
  try {
    const out = await compressImage(file)
    pendingAttachments.push({ kind: 'image', dataUrl: out.dataUrl, blobUrl: URL.createObjectURL(out.blob), name: out.name, size: out.size })
    renderAttachPreview()
    focusChatInput()
  } catch (e) {
    alert(e && e.message ? e.message : '图片处理失败，换一张试试')
  }
}
async function onAttachFile(file) {
  if (!file) return
  if (pendingAttachments.length >= ATTACH_MAX) { alert('一次最多挂 ' + ATTACH_MAX + ' 个附件，先发掉或删一个再加'); return }
  try {
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    const { title, text } = await kbExtractFile(file)
    // txt/md 且 ≤6000 字默认本次直接读；长的或 PDF/DOCX 默认存知识库。
    const dest = (ext === 'txt' || ext === 'md' || ext === 'markdown') && text.length <= ATTACH_CHAT_TEXT_LIMIT ? 'chat' : 'kb'
    pendingAttachments.push({ kind: 'file', name: file.name, size: file.size, title, text, dest })
    renderAttachPreview()
    focusChatInput()
  } catch (e) {
    alert(e && e.message ? e.message : '文件读取失败，换一个试试')
  }
}
/** 上传动作菜单：点 + 弹出，点遮罩或取消收起。 */
function openAttachSheet() {
  const sheet = $('attach-sheet')
  if (sheet) sheet.hidden = false
}
function closeAttachSheet() {
  const sheet = $('attach-sheet')
  if (sheet) sheet.hidden = true
}
/** 切到能看图的模型：模型列表里找 kimi，换完马上生效。 */
function switchToKimi() {
  const kimi = chatModels.find((m) => VISION_MODEL_RE.test(m.id))
  if (!kimi) { alert('模型列表里没有能看图的模型'); return false }
  setChatModel(kimi.id)
  return true
}

/* ── 语音输入：Web Speech API（零后端）──────────────────────────
 * 点麦克风说话，识别出的文字填进输入框，不直接发送，等用户确认后再发。
 * 麦克风按钮永远显示（用户要求：标识不变、一直在那儿）。
 * 网页语音识别在 iOS 主屏幕模式下可能不可用——不可用时点按钮就聚焦输入框，
 * 并提示用 iOS 键盘自带的话筒听写（一样是说话转文字，键盘话筒在任何模式下都能用）。 */
let speechRec = null
let speechListening = false
// 语音会话号：每次开始/停止/发送都 +1。Web Speech 在 stop() 之后还会
// 补发一次最终 onresult——没有这道闸，那句旧话会在输入框清空之后又
// 写回来（2026-11-16 11:02 用户报的 bug：第二次点麦克风，输入框里
// 直接出现上一句语音转出来的文字）。onresult/onerror 先对号，对不上就扔掉。
let speechSession = 0
// 旧会话正在收尾：stop() 之后 iOS 不会立刻放开麦克风，旧会话的 onend
// 还没到就建新会话，新会话常常只亮麦克风图标、收不到任何声音
// （2026-11-16 11:54 用户在车里报的 bug：第二下麦克风显示开着，
// 说了好几句都不转换）。收尾期间点麦克风先排队，等放开再自动起。
let speechStopping = false
let speechStoppingTimer = null
let speechPendingStart = false
// 看门狗：开始后 8 秒还没收到任何声音/结果，说明这次识别卡死了，
// 自动停掉重置，别让麦克风一直亮着却什么都不转。
let speechWatchdog = null
function speechClearWatchdog() {
  if (speechWatchdog) { clearTimeout(speechWatchdog); speechWatchdog = null }
}
function speechReleaseStopping() {
  if (!speechStopping) return
  speechStopping = false
  if (speechStoppingTimer) { clearTimeout(speechStoppingTimer); speechStoppingTimer = null }
  if (speechPendingStart && document.visibilityState === 'visible') {
    speechPendingStart = false
    toggleSpeech()
  } else {
    speechPendingStart = false
  }
}
/** 停掉语音识别，并让它之后再到的结果全部作废。 */
function speechStop() {
  speechSession++
  speechClearWatchdog()
  const old = speechRec
  try { old && old.stop() } catch { /* 忽略 */ }
  speechRec = null
  setMicState(false)
  speechStopping = true
  if (speechStoppingTimer) clearTimeout(speechStoppingTimer)
  // 旧会话收尾完成（onend）或 1.5 秒超时，都算放开。
  if (old) {
    const prevOnEnd = old.onend
    old.onend = (ev) => { try { prevOnEnd && prevOnEnd(ev) } catch { /* 忽略 */ } speechReleaseStopping() }
  }
  speechStoppingTimer = setTimeout(speechReleaseStopping, 1500)
}
function speechSupported() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
}
function setMicState(listening) {
  speechListening = listening
  const btn = $('chat-mic')
  if (btn) {
    btn.classList.toggle('listening', listening)
    btn.title = listening ? '正在听…再点一次停止' : '语音输入：点一下说话，文字进输入框（说完再点一下停止）'
  }
}
function focusChatInput() {
  // #chat-input 是 <ion-textarea>（影子 DOM）：普通 .focus() 聚不到里面的
  // 原生输入框，必须调它自己的 setFocus()，键盘才能弹出来。
  const input = $('chat-input')
  if (!input) return
  if (typeof input.setFocus === 'function') input.setFocus()
  else input.focus()
}
function toggleSpeech() {
  if (speechListening) {
    speechStop()
    return
  }
  // 旧会话还没收尾：排队，等放开再自动起，别硬建新会话抢麦克风。
  if (speechStopping) {
    speechPendingStart = true
    return
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) {
    // 网页语音识别不可用：不藏按钮，先提示，再聚焦输入框（alert 关掉后
    // 仍在点按手势里，iOS 上聚焦能弹出键盘，键盘上有话筒就能听写）。
    alert('这边用不了网页语音识别。点一下输入框，弹出键盘后点键盘上的话筒，说话就能转成文字，不用打字')
    focusChatInput()
    return
  }
  const base = chatInputValue()
  const session = ++speechSession
  const rec = new SR()
  speechRec = rec
  rec.lang = 'zh-CN'
  rec.interimResults = true
  rec.continuous = true
  rec.onresult = (ev) => {
    // 旧会话的迟到结果（stop() 之后补发的那一次）：直接扔掉，别写回输入框。
    if (session !== speechSession) return
    speechClearWatchdog()
    let finalText = '', interim = ''
    for (let i = 0; i < ev.results.length; i++) {
      const r = ev.results[i]
      if (r.isFinal) finalText += r[0].transcript
      else interim += r[0].transcript
    }
    const val = (base ? base + ' ' : '') + finalText + interim
    const input = $('chat-input')
    if (input) input.value = val
  }
  // 收到任何音频信号都说明这次识别活着，看门狗可以撤了。
  rec.onaudiostart = () => { if (session === speechSession) speechClearWatchdog() }
  rec.onsoundstart = () => { if (session === speechSession) speechClearWatchdog() }
  rec.onspeechstart = () => { if (session === speechSession) speechClearWatchdog() }
  rec.onerror = (ev) => {
    // 旧会话的迟到错误：别动新会话的状态（之前没这道闸，旧会话的
    // aborted 错误会在新会话开始后把麦克风状态关掉，越用越乱）。
    if (session !== speechSession) return
    speechClearWatchdog()
    const err = ev && ev.error
    if (err === 'not-allowed' || err === 'service-not-allowed') { alert('麦克风权限被拒绝：请在系统设置里允许 Safari 使用麦克风，或直接用 iOS 键盘听写'); focusChatInput() }
    else if (err === 'no-speech') alert('没听到声音，再试一次')
    else if (err === 'network') { alert('语音识别需要联网，请检查网络；也可以直接用 iOS 键盘听写'); focusChatInput() }
    else if (err !== 'aborted') { alert('语音输入失败（' + err + '），可用 iOS 键盘听写代替'); focusChatInput() }
    setMicState(false)
  }
  rec.onend = () => { if (session === speechSession) { setMicState(false); speechClearWatchdog() } }
  try {
    // ⚠️ 必须同步调 start()（点按手势里），iOS 上 await 之后调会被拒。
    rec.start()
    setMicState(true)
    // 8 秒还没收到任何声音/结果：这次识别卡死了，自动重置。
    speechClearWatchdog()
    speechWatchdog = setTimeout(() => {
      if (session !== speechSession) return
      speechStop()
      alert('语音识别没反应，已重置：点麦克风再说一次；不行就用 iOS 键盘上的话筒听写')
    }, 8000)
  } catch {
    alert('语音识别启动失败，可用 iOS 键盘听写代替')
    setMicState(false)
  }
}

/** 建一条消息气泡（⚠️ 只用 textContent，不用 innerHTML）。
 *  气泡下面跟一排小图标：复制（AI 和用户都有）+ 朗读（只有 AI 回答有），
 *  点复制读的是气泡当下的 textContent，流式还没吐完时点的也是当前已吐出的那部分。
 *  content 可能是字符串，也可能是多模态数组：文字显示在气泡里，
 *  图片部分在气泡里显示缩略图。 */
function chatBubble(role, content, opts) {
  const row = document.createElement('div')
  row.className = 'chat-msg ' + (role === 'user' ? 'user' : 'assistant')
  const bubble = document.createElement('div')
  bubble.className = 'chat-bubble'
  bubble.textContent = chatContentText(content)
  for (const imgUrl of chatContentImages(content)) {
    const img = document.createElement('img')
    img.className = 'chat-img'
    img.src = imgUrl
    img.alt = '图片'
    bubble.appendChild(img)
  }
  row.appendChild(bubble)
  const actions = document.createElement('div')
  actions.className = 'msg-actions'
  const copyBtn = document.createElement('button')
  copyBtn.type = 'button'
  copyBtn.className = 'msg-copy'
  copyBtn.title = '复制'
  copyBtn.setAttribute('aria-label', '复制这条消息')
  copyBtn.innerHTML = COPY_ICON_SVG
  copyBtn.addEventListener('click', async () => {
    const ok = await copyTextToClipboard(bubble.textContent || '')
    if (!ok) return
    copyBtn.innerHTML = CHECK_ICON_SVG
    copyBtn.classList.add('copied')
    setTimeout(() => {
      copyBtn.innerHTML = COPY_ICON_SVG
      copyBtn.classList.remove('copied')
    }, 1200)
  })
  actions.appendChild(copyBtn)
  if (role === 'assistant' && (!opts || opts.readAloud !== false)) {
    const readBtn = document.createElement('button')
    readBtn.type = 'button'
    readBtn.className = 'msg-read'
    readBtn.title = '朗读'
    readBtn.setAttribute('aria-label', '朗读这条回答')
    readBtn.innerHTML = SPEAKER_ICON_SVG
    readBtn.addEventListener('click', () => { ttsSpeak(bubble.textContent || '', readBtn) })
    actions.appendChild(readBtn)
  }
  row.appendChild(actions)
  return row
}

/** F7 消息气泡（有 F7 时用它；没 F7 时退回 chatBubble）。返回气泡元素。 */
function f7AddMessage(role, text, cssClass, opts) {
  const box = $('chat-messages')
  if (!box) return null
  if (f7Messages) {
    f7Messages.addMessage({ text, type: role === 'user' ? 'sent' : 'received', cssClass: cssClass || '' }, 'append', true)
    const els = box.querySelectorAll('.message')
    return els.length ? els[els.length - 1] : null
  }
  const row = chatBubble(role, text, opts)
  if (cssClass) row.classList.add(cssClass)
  box.appendChild(row)
  box.scrollTop = box.scrollHeight
  return row
}

/** 读输入框内容（F7 Messagebar 接管时走它的 getValue）。 */
function chatInputValue() {
  if (f7Messagebar) return f7Messagebar.getValue() || ''
  const input = $('chat-input')
  return input ? input.value : ''
}

/** 清空输入框（F7 Messagebar 接管时走它的 clear，会顺便把框缩回去）。 */
function chatClearInput() {
  if (f7Messagebar) { f7Messagebar.clear(); return }
  const input = $('chat-input')
  if (input) input.value = ''
}

/** 按本地记录重画消息列表；空记录时显示空态提示。 */
function renderChat() {
  const box = $('chat-messages')
  if (!box) return
  if (f7Messages) f7Messages.clear()
  clear(box)
  for (const m of chatMessages) {
    if (m.role === 'action') {
      if (f7Messages) f7Messages.addMessage({ text: actionCardHtml(m.content), type: 'received' }, 'append', false)
      else box.appendChild(actionCardEl(m.content))
      continue
    }
    if (f7Messages) f7Messages.addMessage({ text: chatContentText(m.content), image: chatContentImage(m.content) || undefined, type: m.role === 'user' ? 'sent' : 'received' }, 'append', false)
    else box.appendChild(chatBubble(m.role, m.content))
  }
  const empty = $('chat-empty')
  if (empty) empty.hidden = chatMessages.length !== 0
  if (f7Messages) f7Messages.scroll()
  else box.scrollTop = box.scrollHeight
}

/** 拉 /v1/models（只要对话类，过滤掉生图/生视频）：填“设置 → 模型”里的
 * 聊天模型下拉，顺带把待命状态里的模型名刷新出来。聊天用的模型 id 只存在
 * localStorage（CHAT_MODEL_KEY），不依赖页面上的任何下拉框。 */
async function loadChatModels() {
  if (chatModelsLoaded) return
  const res = await api('/v1/models')
  const data = (res.ok && res.body && res.body.data) || []
  chatModels = data.filter((m) => m && typeof m.id === 'string' && m.kind !== 'image' && m.kind !== 'video')
  // 默认模型：有 deepseek-v4.1-flash 就用它（buddy 主力），否则用列表第一个。
  const stored = localStorage.getItem(CHAT_MODEL_KEY) || ''
  const flash = chatModels.find((m) => m.id.indexOf('deepseek-v4.1-flash') !== -1)
  const def = chatModels.some((m) => m.id === stored)
    ? stored
    : (flash ? flash.id : (chatModels[0] ? chatModels[0].id : ''))
  if (def) {
    try { localStorage.setItem(CHAT_MODEL_KEY, def) } catch { /* 忽略 */ }
  }
  chatModelsLoaded = true
  fillSettingsChatModel()
  setChatStatus('idle')
  updateAttachVisibility()
}
/** “设置 → 模型”里的聊天模型下拉：值变了就换模型，马上生效。 */
function fillSettingsChatModel() {
  const sel = $('settings-chat-model')
  if (!sel) return
  clear(sel)
  if (!chatModels.length) {
    const o = document.createElement('option')
    o.value = ''
    o.textContent = '模型加载失败（密钥或网络问题）'
    sel.appendChild(o)
    return
  }
  for (const m of chatModels) {
    const o = document.createElement('option')
    o.value = m.id
    o.textContent = m.name && m.name !== m.id ? m.name + '(' + m.id + ')' : m.id
    sel.appendChild(o)
  }
  sel.value = chatModel()
  sel.onchange = () => { setChatModel(sel.value) }
}

/** 当前聊天模型 id（只读 localStorage，没拉到列表时返回空串，发送时再提示）。 */
function chatModel() {
  try { return localStorage.getItem(CHAT_MODEL_KEY) || '' } catch { return '' }
}
/** 换聊天模型：存本机 + 刷新待命状态 + 同步设置里的下拉。 */
function setChatModel(id) {
  if (!id) return
  try { localStorage.setItem(CHAT_MODEL_KEY, id) } catch { /* 忽略 */ }
  const sel = $('settings-chat-model')
  if (sel) sel.value = id
  setChatStatus('idle')
  updateAttachVisibility()
}
function isBuddyModel(id) { return typeof id === 'string' && id.indexOf('buddy/') === 0 }

/**
 * 发一次对话：先走 SSE 流式，逐字更新气泡；不是 event-stream 时回落 JSON。
 * 失败时抛错（调用方把原因写进气泡里，不吞掉）。
 */
async function chatComplete(model, messages, onToken, signal) {
  const res = await fetch(API_BASE + '/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + apiKey(), 'content-type': 'application/json' },
    // ⚠️ 面板对话不走破甲：破甲是给外部调用的“成品交付”预设，面板里它会把
    // 预设格式指令漏进可见回复（用户截图：模型回了 "## … Bench Status … payload"）。
    // 网关收到 pojia:false 就跳过预设注入（字段在转发上游前会被剥掉）。
    body: JSON.stringify({ model, messages, stream: true, pojia: false }),
    signal,
  })
  if (!res.ok) {
    let msg = 'HTTP ' + res.status
    try {
      const j = JSON.parse(await res.text())
      if (j && j.error && typeof j.error.message === 'string' && j.error.message) msg = j.error.message
    } catch { /* 非 JSON 错误体就用 HTTP 状态 */ }
    throw new Error(msg)
  }
  const ctype = res.headers.get('content-type') || ''
  if (ctype.indexOf('text/event-stream') === -1) {
    // 非流式回落：一次读完 JSON。
    const data = await res.json()
    const c = data && data.choices && data.choices[0]
    const text = c && c.message && typeof c.message.content === 'string' ? c.message.content : ''
    if (text) onToken(text)
    return text
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  let full = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    let idx
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx).trim()
      buf = buf.slice(idx + 1)
      if (line.indexOf('data:') !== 0) continue
      const payload = line.slice(5).trim()
      if (payload === '[DONE]') return full
      try {
        const j = JSON.parse(payload)
        const c = j && j.choices && j.choices[0]
        const delta = c && c.delta && typeof c.delta.content === 'string' ? c.delta.content : ''
        if (delta) { full += delta; onToken(full) }
        // 个别上游在末 chunk 直接给完整 message。
        const msg = c && c.message && typeof c.message.content === 'string' ? c.message.content : ''
        if (msg && !full) { full = msg; onToken(full) }
      } catch { /* 坏帧跳过，不中断整条流 */ }
    }
  }
  return full
}

/** AI 工作状态（2026-11-16 用户：模型下拉框那个位置，换成 AI 正在干什么的状态）。
 * 状态条一直显示，不再是下拉框：
 * · 平时：“AI 待命 · 当前模型名”（模型去设置 → 模型里换）。
 * · 干活时：正在思考… → 正在查知识库…（走了知识库检索）→ 正在回复…
 *   → 正在存知识库… / 正在生图…（执行面板动作时）。
 * 圆点只在忙的时候呼吸，待命时是稳的。 */
function chatStatusIdleText() {
  const id = chatModel()
  if (!id) return 'AI 待命'
  const m = chatModels.find((x) => x.id === id)
  let name = (m && m.name) || id
  const paren = name.indexOf('(')
  if (paren > 0) name = name.slice(0, paren).trim()
  if (!name) name = id.replace(/^(buddy|today)\//, '')
  return 'AI 待命 · ' + name
}
function setChatStatus(state, label) {
  const st = $('chat-status'), txt = $('chat-status-text')
  if (!st || !txt) return
  if (state === 'idle') {
    st.classList.remove('busy')
    txt.textContent = label || chatStatusIdleText()
    return
  }
  st.classList.add('busy')
  const map = { thinking: '正在思考…', kb: '正在查知识库…', replying: '正在回复…' }
  txt.textContent = label || map[state] || '正在思考…'
}

/* ── AI 操控面板：文本 JSON 动作块（第一阶段，2026-11-16 用户要的）──
 * 做法（开源调研的共识：CopilotKit / Vercel AI SDK / Open WebUI 都是
 * “先给模型一张动作表 + 一个执行器”）：面板只改前端，不动网关；buddy
 * 模型都能用（Today 模型已证实不能调工具，不给它动作表）。模型在回复
 * 末尾夹一个 ```action JSON 块，面板解析、校验白名单、执行、把结果喂回
 * 去让它继续说，最多 3 轮。读/导航/换模型直接执行；写库/生图/删东西
 * 要用户在卡片上点一下确认才执行。
 * 永远不做的事：读/改/发 API Key、退出登录、清空知识库、碰 /admin/*、
 * 任何花钱的动作；参数里出现 key/password/token 字样的直接拒绝。 */
const PANEL_ACTION_CONTRACT = [
  '【面板操作】你可以直接操作这个面板。需要操作时，在回复末尾另起一个代码块写：',
  '```action',
  '{"action":"kb_upload","title":"标题","content":"全文"}',
  '```',
  '可用动作（只用这四个，别编别的）：',
  '- panel_state：查当前模型、所在页面、知识库篇数、生图上游状态',
  '- model_switch：{"model":"buddy/kimi-k2.5"} 换聊天模型（只能用模型目录里的 id）',
  '- goto：{"view":"chat"|"settings"|"kb"|"imggen"|"extract"} 切页面',
  '- kb_upload：{"title":"标题","content":"全文"} 存进知识库（会先问用户确认）',
  '一次只发一个动作块；动作执行完我会把结果告诉你，你再继续回话。',
  '动作块不要写在正文里冒充回答；不需要操作时就别发动作块。',
].join('\n')
const PANEL_ACTION_MAX_ROUNDS = 3
const PANEL_ACTIONS = {
  panel_state: {
    label: '查面板状态', confirm: false,
    run() {
      return { ok: true, model: chatModel(), view: currentSubView || 'chat', kbDocs: kbLoadDocs().length, kbOn: kbIsEnabled(), imggen: '上游未接' }
    },
  },
  model_switch: {
    label: '切换模型', confirm: false,
    run(p) {
      if (typeof p.model !== 'string' || !p.model) return { ok: false, error: '没给 model' }
      if (chatModels.length && !chatModels.some((m) => m.id === p.model)) return { ok: false, error: '模型目录里没有 ' + p.model }
      setChatModel(p.model)
      return { ok: true, model: p.model }
    },
  },
  goto: {
    label: '切换页面', confirm: false,
    run(p) {
      const v = p.view
      if (v === 'chat') { switchView('chat'); return { ok: true, view: 'chat' } }
      if (v === 'settings') { switchView('settings'); return { ok: true, view: 'settings' } }
      if (v === 'kb' || v === 'imggen' || v === 'extract') { openSettingsSection(v); return { ok: true, view: v } }
      return { ok: false, error: '去不了 ' + String(v) }
    },
  },
  kb_upload: {
    label: '存入知识库', confirm: true,
    run(p) {
      if (typeof p.content !== 'string' || !p.content.trim()) return { ok: false, error: '内容是空的' }
      if (p.content.length > 200000) return { ok: false, error: '内容超过 20 万字，太大了' }
      const doc = kbAddDoc(p.title || '未命名文档', p.content, 'chat-ai')
      return doc ? { ok: true, title: doc.title, chars: doc.chars } : { ok: false, error: '入库失败（库可能满了）' }
    },
  },
}
/** 从回复里抠最后一个 ```action JSON 块；没有、解析失败或不在白名单里都返回 null。 */
function parsePanelAction(text) {
  if (typeof text !== 'string') return null
  const re = /```action\s*([\s\S]*?)```/g
  let m = null, last = null
  while ((m = re.exec(text)) !== null) last = m[1]
  if (!last) return null
  try {
    const j = JSON.parse(last.trim())
    if (!j || typeof j.action !== 'string' || !PANEL_ACTIONS[j.action]) return null
    const params = j.action === 'panel_state' ? {} : j
    if (/key|password|token|secret/i.test(JSON.stringify(params))) return null
    return { action: j.action, params: j }
  } catch { return null }
}
/** 把回复里的 ```action 块去掉，只留给人看的正文。 */
function stripPanelAction(text) {
  if (typeof text !== 'string') return text
  return text.replace(/```action\s*[\s\S]*?```/g, '').trim()
}
/** 转义 HTML（动作卡片的标题/结果里可能带用户或模型给的文字）。 */
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
let actionConfirmResolvers = {}
/** 动作卡片上的确认/取消按钮调这个（F7 气泡里的行内 onclick 也走这里）。 */
function panelActionConfirm(id, ok) {
  const r = actionConfirmResolvers[id]
  if (r) { delete actionConfirmResolvers[id]; r(ok) }
}
/** 等用户在动作卡片上点确认/取消；卡片不存在时直接当取消。 */
function waitActionConfirm(id) {
  return new Promise((resolve) => { actionConfirmResolvers[id] = resolve })
}
function actionCardTitle(c) {
  const def = PANEL_ACTIONS[c.action]
  const label = def ? def.label : c.action
  if (c.action === 'kb_upload') return label + '：' + (c.params.title || '未命名文档')
  if (c.action === 'model_switch') return label + '：' + (c.params.model || '')
  if (c.action === 'goto') return label + '：' + (c.params.view || '')
  return label
}
function actionCardHtml(c) {
  const statusText = { pending: '等你确认', running: '执行中…', done: '已执行', cancelled: '已取消', failed: '失败' }[c.status] || c.status
  const body = c.status === 'done' && c.result
    ? '结果：' + (c.result.title ? c.result.title + '（' + (c.result.chars || 0) + ' 字）' : c.result.model || c.result.view || '完成')
    : c.status === 'failed' && c.result
      ? '原因：' + (c.result.error || '未知错误')
      : ''
  const btns = c.status === 'pending'
    ? '<button type="button" class="action-confirm" onclick="panelActionConfirm(\'' + c.id + '\', true)">确认执行</button>'
      + '<button type="button" class="action-cancel" onclick="panelActionConfirm(\'' + c.id + '\', false)">取消</button>'
    : ''
  return '<div class="action-card"><div class="action-card-title">⚙️ ' + escapeHtml(actionCardTitle(c)) + ' · ' + statusText + '</div>'
    + (body ? '<div class="action-card-body">' + escapeHtml(body) + '</div>' : '')
    + (btns ? '<div class="action-card-actions">' + btns + '</div>' : '') + '</div>'
}
/** 执行一个动作：要确认的先在卡片上等用户点，执行完更新卡片状态并返回结果。 */
async function executePanelAction(card) {
  const def = PANEL_ACTIONS[card.action]
  if (!def) return { ok: false, error: '未知动作' }
  if (def.confirm && card.status === 'pending') {
    const ok = await waitActionConfirm(card.id)
    if (!ok) {
      card.status = 'cancelled'
      saveChatHistory()
      renderChat()
      return { ok: false, error: '用户取消了这个动作' }
    }
  }
  card.status = 'running'
  setChatStatus('action', '正在' + def.label + '…')
  renderChat()
  let result
  try { result = def.run(card.params) || { ok: false, error: '没有返回结果' } }
  catch (e) { result = { ok: false, error: (e && e.message) || '执行出错' } }
  card.status = result.ok ? 'done' : 'failed'
  card.result = result
  saveChatHistory()
  renderChat()
  return result
}

/** 发送按钮 / 回车：把输入框内容发出去，流式回显回答。 */
/** 一轮流式对话：占一个助手气泡往里填字，返回完整回复；用户点了停止就抛 AbortError。 */
async function streamAssistantRound(reqMessages, model) {
  const box = $('chat-messages')
  const msgEl = f7AddMessage('assistant', '思考中…', null, { readAloud: false })
  // F7 气泡里装文字的是 .message-text，兜底气泡里是 .chat-bubble
  const bubble = msgEl ? (msgEl.querySelector('.message-text') || msgEl.querySelector('.chat-bubble') || msgEl) : null
  if (f7Messages) f7Messages.scroll()
  else if (box) box.scrollTop = box.scrollHeight
  const full = await chatComplete(model, reqMessages, (t) => {
    setChatStatus('replying')
    if (bubble) bubble.textContent = t
    if (f7Messages) f7Messages.scroll()
    else if (box) box.scrollTop = box.scrollHeight
  }, chatAbort.signal)
  if (full === '') throw new Error('模型返回了空内容')
  return { full, msgEl, bubble }
}

async function sendChat() {
  if (chatStreaming) return
  const input = $('chat-input')
  const sendBtn = $('chat-send')
  const model = chatModel()
  if (!input || !sendBtn) return
  const text = chatInputValue().trim()
  if (text === '' && pendingAttachments.length === 0) return
  if (model === '') {
    alert('模型还没加载出来，稍等一下再发')
    return
  }
  ttsStop()
  // 发之前先停语音识别：stop() 之后识别还会补发一次最终结果，不先作废
  // 它，那句旧话会在清空之后又写回输入框（2026-11-16 11:02 用户报的 bug）。
  if (speechListening) speechStop()
  // 附件拼成 OpenAI 多模态数组；纯文字保持字符串。
  // 存知识库的附件：发之前先入库，气泡里留一句“已存入知识库：xxx”。
  const parts = []
  const kbNotes = []
  for (const a of pendingAttachments) {
    if (a.kind === 'image') {
      parts.push({ type: 'image_url', image_url: { url: a.dataUrl } })
    } else if (a.kind === 'file') {
      if (a.dest === 'kb') {
        const doc = kbAddDoc(a.title, a.text, 'chat')
        kbNotes.push(doc ? '已存入知识库：' + a.name : '存入知识库失败：' + a.name)
      } else {
        parts.push({ type: 'text', text: '【文件：' + a.name + '】\n' + a.text })
      }
    }
  }
  const headText = text || (parts.some((p) => p.type === 'image_url') ? '这张图里有什么？' : '')
  const textParts = []
  if (headText) textParts.push(headText)
  if (kbNotes.length) textParts.push(kbNotes.join('\n'))
  const userContent = parts.length === 0
    ? textParts.join('\n')
    : [{ type: 'text', text: textParts.join('\n') || '（附件）' }, ...parts]
  chatMessages.push({ role: 'user', content: userContent })
  saveChatHistory()
  chatClearInput()
  clearPendingAttachments()
  renderChat()

  const box = $('chat-messages')
  const empty = $('chat-empty')
  if (empty) empty.hidden = true
  chatStreaming = true
  chatAbort = new AbortController()
  sendBtn.classList.add('streaming')
  setChatStatus('thinking')
  input.disabled = true
  let lastBubble = null, lastMsgEl = null
  try {
    // 第一轮的请求：知识库命中时在最前面加 system 消息；buddy 模型再加
    // 一张面板动作表（Today 模型不能调工具，不给它）。
    const history = chatRequestMessages(chatMessages.slice(-CHAT_MAX_CONTEXT))
    setChatStatus('kb')
    const kbSys = await kbBuildSystemMessage(chatContentText(userContent))
    let reqMessages = kbSys ? [{ role: 'system', content: kbSys }, ...history] : history
    if (isBuddyModel(model)) reqMessages = [{ role: 'system', content: PANEL_ACTION_CONTRACT }, ...reqMessages]
    // 动作循环：模型可能在回复里夹一个 ```action 动作块；执行完把结果
    // 喂回去让它继续说，最多 3 轮，免得来回打转。
    for (let round = 0; ; round++) {
      setChatStatus('thinking')
      const r = await streamAssistantRound(reqMessages, model)
      lastBubble = r.bubble
      lastMsgEl = r.msgEl
      const full = r.full
      const action = isBuddyModel(model) ? parsePanelAction(full) : null
      const cleanText = action ? stripPanelAction(full) : full
      chatMessages.push({ role: 'assistant', content: cleanText })
      if (!action || round >= PANEL_ACTION_MAX_ROUNDS) {
        saveChatHistory()
        renderChat()
        break
      }
      const card = {
        id: 'act' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36),
        action: action.action, params: action.params, status: PANEL_ACTIONS[action.action].confirm ? 'pending' : 'running', result: null,
      }
      chatMessages.push({ role: 'action', content: card })
      saveChatHistory()
      renderChat()
      const result = await executePanelAction(card)
      // 动作结果喂回去（只进本次请求，不进保存的对话记录）。
      reqMessages = [...reqMessages, { role: 'assistant', content: cleanText }, { role: 'user', content: '【动作执行结果】' + JSON.stringify(result) }]
      setChatStatus('thinking')
    }
  } catch (e) {
    // ⚠️ 用户点了停止是 AbortError：不算失败，不写红字、不留残句。
    if (e && e.name === 'AbortError') {
      renderChat()
    } else if (lastBubble) {
      // 流式进行中失败：复用占位气泡写红字（和原来一样）。
      lastBubble.textContent = '发送失败：' + (e && e.message ? e.message : '未知错误')
      if (lastMsgEl) lastMsgEl.classList.add('chat-err')
      if (f7Messages) f7Messages.scroll()
      else if (box) box.scrollTop = box.scrollHeight
    } else {
      const msgEl = f7AddMessage('assistant', '发送失败：' + (e && e.message ? e.message : '未知错误'), 'chat-err', { readAloud: false })
      if (msgEl) msgEl.classList.add('chat-err')
      if (f7Messages) f7Messages.scroll()
      else if (box) box.scrollTop = box.scrollHeight
    }
  } finally {
    chatStreaming = false
    chatAbort = null
    sendBtn.classList.remove('streaming')
    setChatStatus('idle')
    input.disabled = false
    input.focus()
  }
}

/** 首页初始化（只绑一次）：画记录、拉模型、绑输入框与按钮。 */
function initChat() {
  loadChatHistory()
  renderChat()
  void loadChatModels()
  if (chatBound) return
  chatBound = true
  const input = $('chat-input')
  const sendBtn = $('chat-send')
  const newBtn = $('chat-new')
  if (sendBtn) {
    sendBtn.onclick = () => {
      // 流式进行中点按钮 = 停止。
      if (chatStreaming && chatAbort) { chatAbort.abort(); return }
      void sendChat()
    }
  }
  if (input) {
    input.addEventListener('keydown', (ev) => {
      // 回车发送，Shift+回车换行。
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault()
        void sendChat()
      }
    })
  }
  if (newBtn) {
    newBtn.onclick = () => {
      if (chatMessages.length === 0) return
      if (!confirm('清空当前对话记录？')) return
      chatMessages = []
      saveChatHistory()
      renderChat()
    }
  }
  // 附件：+ 按钮 → 底部动作菜单（拍照 / 相册选图 / 选文件）。
  const attachBtn = $('chat-attach')
  if (attachBtn) attachBtn.onclick = () => openAttachSheet()
  const optCamera = $('attach-opt-camera')
  if (optCamera) optCamera.onclick = () => { closeAttachSheet(); const i = $('chat-camera-input'); if (i) i.click() }
  const optPhoto = $('attach-opt-photo')
  if (optPhoto) optPhoto.onclick = () => { closeAttachSheet(); const i = $('chat-image-input'); if (i) i.click() }
  const optFile = $('attach-opt-file')
  if (optFile) optFile.onclick = () => { closeAttachSheet(); const i = $('chat-file-input'); if (i) i.click() }
  const optCancel = $('attach-opt-cancel')
  if (optCancel) optCancel.onclick = () => closeAttachSheet()
  const sheetBackdrop = $('attach-sheet-backdrop')
  if (sheetBackdrop) sheetBackdrop.onclick = () => closeAttachSheet()
  const imageInput = $('chat-image-input')
  if (imageInput) imageInput.onchange = () => { const f = imageInput.files && imageInput.files[0]; void onImageFile(f) }
  const cameraInput = $('chat-camera-input')
  if (cameraInput) cameraInput.onchange = () => { const f = cameraInput.files && cameraInput.files[0]; void onImageFile(f) }
  const fileInput = $('chat-file-input')
  if (fileInput) fileInput.onchange = () => { const f = fileInput.files && fileInput.files[0]; void onAttachFile(f) }
  const switchKimiBtn = $('attach-switch-kimi')
  if (switchKimiBtn) switchKimiBtn.onclick = () => { if (switchToKimi()) updateAttachHint() }
  // 粘贴图片：剪贴板里的图直接贴进附件（聊天页打开时才接，最多 3 个）。
  document.addEventListener('paste', (e) => {
    const files = e.clipboardData && e.clipboardData.files
    if (!files || !files.length) return
    const view = $('view-chat')
    if (!view || view.hidden) return
    for (const f of files) {
      if (f.type && f.type.indexOf('image/') === 0) { void onImageFile(f); return }
    }
  })
  // 语音输入：麦克风按钮永远显示（用户要求：标识不变、一直在那儿）。
  // 网页语音识别不可用时，点按钮会聚焦输入框并提示用 iOS 键盘话筒听写。
  const micBtn = $('chat-mic')
  if (micBtn) {
    micBtn.hidden = false
    micBtn.onclick = () => toggleSpeech()
  }
  setChatStatus('idle')
  updateAttachVisibility()
}

/**
 * iOS 手势（不依赖 Framework7，纯手写）：
 * · 左滑返回：从左边缘（≤28px）向右拖，子视图跟着手指走，松手过阈值回设置菜单。
 * · 下拉刷新：页面在最顶上时往下拉，露出 F7 风格的加载圈，松手刷新当前视图。
 * 抽屉打开、输入框、聊天消息区里不触发（免得跟 F7 的下滑关抽屉 / 滚动打架）。
 */
let ptrBound = false
function initGestures() {
  if (ptrBound) return
  ptrBound = true
  const ptr = $('ptr-indicator')
  const ptrLabel = $('ptr-label')
  let startX = 0, startY = 0, active = null, moved = 0

  function inSheet(t) { return !!(t && t.closest && t.closest('.sheet-modal, textarea, input, select, #chat-messages')) }
  function currentViewEl() {
    if (currentSubView) return $('view-' + currentSubView)
    if ($('view-chat') && !$('view-chat').hidden) return $('view-chat')
    if ($('view-settings') && !$('view-settings').hidden) return $('view-settings')
    return null
  }

  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    startX = t.clientX; startY = t.clientY; moved = 0
    if (inSheet(e.target)) { active = null; return }
    // 左滑返回：只在子视图打开、且从左边缘起手时
    if (currentSubView && startX <= 28) active = 'back'
    // 下拉刷新：页面在最顶上、且从内容区起手时
    else if (window.scrollY === 0) active = 'ptr'
    else active = null
  }, { passive: true })

  document.addEventListener('touchmove', (e) => {
    if (!active) return
    const t = e.touches[0]
    const dx = t.clientX - startX
    const dy = t.clientY - startY
    if (active === 'back') {
      if (dx < 0 || Math.abs(dy) > Math.abs(dx)) { active = null; return }
      moved = dx
      const el = currentViewEl()
      if (el) el.style.transform = 'translateX(' + Math.min(dx, 120) + 'px)'
    } else if (active === 'ptr') {
      if (dy < 0 || Math.abs(dx) > Math.abs(dy)) { active = null; return }
      moved = dy
      if (ptr && moved > 0) {
        ptr.classList.add('visible')
        if (ptrLabel) ptrLabel.textContent = moved > 80 ? '松手刷新' : '下拉刷新'
      }
    }
  }, { passive: true })

  document.addEventListener('touchend', () => {
    if (!active) return
    if (active === 'back') {
      const el = currentViewEl()
      if (el) el.style.transform = ''
      if (moved > 80) switchView('settings')
    } else if (active === 'ptr') {
      if (ptr) ptr.classList.remove('visible')
      if (moved > 80) refreshCurrentView()
    }
    active = null; moved = 0
  }, { passive: true })
}

/** 刷新当前视图（下拉刷新用）：跑当前视图的加载器；首页对话则重拉模型。 */
function refreshCurrentView() {
  if (currentSubView) {
    const loader = VIEW_LOADERS[currentSubView]
    if (loader && apiKey() !== '') loader()
    return
  }
  if ($('view-chat') && !$('view-chat').hidden) {
    chatModelsLoaded = false
    void loadChatModels()
    return
  }
  const loader = VIEW_LOADERS['settings']
  if (loader && apiKey() !== '') loader()
}

// ─────────────────────────── 初始化 ───────────────────────────

// ─────────────────────────── 主题（深色 / 浅色） ───────────────────────────

/**
 * 应用主题。
 *
 * ⚠️ 主题记在 localStorage，且**在页面加载最早期就应用**（见文件末尾的
 * applyTheme 调用）—— 若等 DOMContentLoaded 再切，浅色用户会先看到
 * 一帧深色闪烁（FOUC）。
 */
/**
 * 主题按钮的三个图标（内联 SVG，**不用 emoji**）。
 *
 * ⚠️ emoji 的字形随系统差异很大（大小、基线、颜色），在手机上容易与相邻
 * 按钮不齐；且 `⏻`（U+23FB）这类符号在部分手机字体里**缺字形**，
 * 会渲染成空方框（用户报障「右上角退出按钮只有一个框」）。
 * 内联 SVG 不依赖系统字体，尺寸完全可控。
 */
const THEME_ICON = {
  // ⚠️ 每条字符串都必须带 `xmlns`！
  //
  // 根因（线上实测，P1）：这些串是用 `image/svg+xml` 交给 DOMParser 解析的，
  // 而 **XML 解析不像 HTML 解析那样隐式补上 SVG 命名空间** —— 缺 `xmlns` 时
  // 根元素只是一个 `namespaceURI: null` 的普通 Element，浏览器按 **0×0** 渲染。
  // 于是主题按钮的图标完全不显示，按钮因只剩 padding 而缩成 20×10px
  //（既看不见、也很难点到）。实测对照：
  //   无 xmlns → { ctor: 'Element',     ns: null,                           0×0 }
  //   有 xmlns → { ctor: 'SVGSVGElement', ns: 'http://www.w3.org/2000/svg', 16×16 }
  // setSvg() 另有兜底注入，但图标自带 xmlns 才是最直白的写法。
  // 自动：半明半暗的圆
  auto: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none"/></svg>',
  // 浅色：太阳
  light: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>',
  // 深色：月亮
  dark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>',
}

/**
 * 应用主题（三态：auto / light / dark）。
 *
 * - `auto` 跟随系统（靠 CSS 的 `prefers-color-scheme`，JS 不干预）；
 * - `light` / `dark` 显式指定（写 `data-theme`，CSS 里优先级更高）。
 *
 * ⚠️ `auto` 时**必须移除** `data-theme` 属性，而不是设成 'auto' ——
 * 设成字符串 'auto' 会让 CSS 的 `[data-theme='light']` 选择器都不匹配，
 * 但同时也失去了「跟随系统」的能力（因为属性存在会覆盖媒体查询的意图）。
 */
/**
 * 把一个 SVG 字符串安全地放进元素里（清空原有内容）。
 *
 * ⚠️ 用 `DOMParser` 而非 `innerHTML`：解析出的文档**从不执行脚本**，
 * 且本仓库有不变量测试禁止 `innerHTML` 赋值。
 * 也不要用 `textContent` —— 那会把标记当纯文本显示出来。
 */
function setSvg(el, svg) {
  clear(el)
  try {
    // ⚠️ 兜底注入 `xmlns`：`image/svg+xml` 是 **XML** 解析，不会像 HTML 解析
    // 那样隐式把 `<svg>` 放进 SVG 命名空间。缺 xmlns 时根元素是普通 Element，
    // 浏览器按 **0×0** 渲染 —— 图标看起来「莫名其妙消失了」，且不报任何错。
    //（THEME_ICON 的三条串已各自带 xmlns，这里是防止以后新增图标时重蹈覆辙。）
    const withNs = /<svg[^>]*\sxmlns\s*=/.test(svg)
      ? svg
      : svg.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"')
    const doc = new DOMParser().parseFromString(withNs, 'image/svg+xml')
    const node = doc.documentElement
    if (node && node.nodeName.toLowerCase() === 'svg' && node.namespaceURI) {
      el.appendChild(document.importNode(node, true))
    }
  } catch {
    // 解析失败：留空（图标缺失不影响功能）
  }
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'light' || theme === 'dark') root.dataset.theme = theme
  else delete root.dataset.theme
  const btn = $('toggle-theme')
  if (btn) {
    // ⚠️ 用 `DOMParser` 注入 SVG，**不用 innerHTML** ——
    // ① `DOMParser` 解析出的文档从不执行脚本；
    // ② 本仓库有既有不变量测试禁止任何 `innerHTML` 赋值。
    // `textContent` 也不行：那会把 SVG 当**文本**显示出来。
    setSvg(btn, THEME_ICON[theme] || THEME_ICON.auto)
    btn.title = '主题：' + ({ auto: '跟随系统', light: '浅色', dark: '深色' }[theme] || '跟随系统')
  }
  localStorage.setItem('wb_theme', theme)
}


/* ── 生图面板（InvokeAI 式界面，批次 2）────────────────────────────
 * 只做界面形态 + 能走的通路。后端只有对话模型，没有生图接口：
 * 生成走网关真实的 POST /v1/images/generations（OpenAI 图片接口形态）。
 * 现在上游会直接 400（buddy 不支持生图），任务就进 failed 并明说
 * 「生图上游还没接，等网关接了生图模型就能用」，绝不造假图、假进度。
 * 等网关接了生图模型，同一条调用就能真的出图，不用改面板。
 * 任务串行跑（一次一个）；刷新后未完成的任务标记 failed（刷新后中断）。
 * 图片只存内存 + 远程 URL 进 localStorage，base64 大图不进 localStorage（5MB 放不下）。
 * JSZip 走 CDN（jsdelivr，与 Ionic 同源），挂了就逐张下载兜底。
 */
const IMGGEN_UPSTREAM_MSG = '生图上游还没接，等网关接了生图模型就能用'
const IMGGEN_TASKS_KEY = 'wb_imggen_tasks_v1'
const IMGGEN_SETTINGS_KEY = 'wb_imggen_settings_v1'
const IMGGEN_RATIOS_KEY = 'wb_imggen_ratios_v1'
const IMGGEN_RATIOS = {
  '21:9': [21, 9], '16:9': [16, 9], '3:2': [3, 2], '4:3': [4, 3], '1:1': [1, 1],
  '3:4': [3, 4], '2:3': [2, 3], '9:16': [9, 16], '9:21': [9, 21], 'Free': null,
}
const IMGGEN_TERMINAL = ['completed', 'failed', 'canceled']
const imggen = {
  bound: false, tasks: [], running: false, abort: null,
  ratio: '16:9', locked: true, customRatios: [], qtab: 'all',
  lastSeed: null, modelsLoaded: false, tickTimer: null,
}

function imggenSnap8(v) {
  const n = Math.round(Number(v) / 8) * 8
  return Math.max(64, Math.min(2048, n || 64))
}
function imggenClampInt(v, lo, hi, def) {
  const n = parseInt(v, 10)
  if (isNaN(n)) return def
  return Math.max(lo, Math.min(hi, n))
}
function imggenSummary(text, n) {
  const t = String(text || '').replace(/\s+/g, ' ').trim()
  if (!t) return '（空提示词）'
  return t.length > (n || 40) ? t.slice(0, n || 40) + '…' : t
}
function imggenNow() { return Date.now() }
function imggenDur(task) {
  if (!task.startedAt) return ''
  const end = task.endedAt || imggenNow()
  const s = Math.max(0, Math.round((end - task.startedAt) / 1000))
  return s + ' 秒'
}

/* ── 持久化 ── */
function imggenSaveTasks() {
  try {
    const clean = imggen.tasks.map((t) => {
      const c = Object.assign({}, t)
      // base64 大图不进 localStorage；远程 URL 很小，可以留。
      if (c.imageData && c.imageData.indexOf('data:') === 0) delete c.imageData
      return c
    })
    localStorage.setItem(IMGGEN_TASKS_KEY, JSON.stringify(clean))
  } catch { /* 存不下也不影响生成 */ }
}
function imggenLoadTasks() {
  let arr = []
  try {
    const raw = localStorage.getItem(IMGGEN_TASKS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    arr = Array.isArray(parsed) ? parsed : []
  } catch { arr = [] }
  // 刷新后未完成的任务标记为失败，并注明「刷新后中断」。
  for (const t of arr) {
    if (t && (t.status === 'pending' || t.status === 'running')) {
      t.status = 'failed'
      t.error = '刷新后中断'
      t.detail = '页面刷新了，这个任务没跑完；可以点重试再跑一次。'
      t.endedAt = imggenNow()
    }
  }
  imggen.tasks = arr.filter((t) => t && typeof t.prompt === 'string')
  imggenSaveTasks()
}
function imggenSaveSettings() {
  try {
    localStorage.setItem(IMGGEN_SETTINGS_KEY, JSON.stringify(imggenReadParams()))
  } catch { /* 忽略 */ }
}
function imggenLoadSettings() {
  try {
    const raw = localStorage.getItem(IMGGEN_SETTINGS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function imggenLoadRatios() {
  try {
    const raw = localStorage.getItem(IMGGEN_RATIOS_KEY)
    const arr = raw ? JSON.parse(raw) : []
    imggen.customRatios = Array.isArray(arr) ? arr.filter((r) => r && r.name && r.w && r.h) : []
  } catch { imggen.customRatios = [] }
}
function imggenSaveRatios() {
  try { localStorage.setItem(IMGGEN_RATIOS_KEY, JSON.stringify(imggen.customRatios.slice(0, 50))) } catch { /* 忽略 */ }
}

/* ── 参数读写 ── */
function imggenReadParams() {
  const w = imggenSnap8($('imggen-w-num') ? $('imggen-w-num').value : 1024)
  const h = imggenSnap8($('imggen-h-num') ? $('imggen-h-num').value : 576)
  return {
    prompt: $('imggen-prompt') ? $('imggen-prompt').value : '',
    negative: $('imggen-negative') ? $('imggen-negative').value : '',
    model: $('imggen-model') ? $('imggen-model').value : '',
    width: w, height: h, ratio: imggen.ratio, locked: imggen.locked,
    cfg: Math.max(1, Math.min(20, parseFloat($('imggen-cfg-num').value) || 7)),
    steps: imggenClampInt($('imggen-steps-num') ? $('imggen-steps-num').value : 20, 1, 60, 20),
    sampler: $('imggen-sampler') ? $('imggen-sampler').value : 'euler_a',
    seed: imggenClampInt($('imggen-seed') ? $('imggen-seed').value : -1, -1, 2147483647, -1),
    count: imggenClampInt($('imggen-count-num') ? $('imggen-count-num').value : 1, 1, 4, 1),
  }
}
function imggenApplyParams(p) {
  if (!p) return
  if (typeof p.prompt === 'string') $('imggen-prompt').value = p.prompt
  if (typeof p.negative === 'string') $('imggen-negative').value = p.negative
  if (p.ratio && IMGGEN_RATIOS[p.ratio] !== undefined) imggenSetRatio(p.ratio, false)
  else if (p.ratio === 'Free') imggenSetRatio('Free', false)
  if (typeof p.locked === 'boolean') imggen.locked = p.locked
  imggenSetSize(p.width || 1024, p.height || 576)
  imggenSetSlider('imggen-cfg', 'imggen-cfg-num', 'imggen-cfg-val', p.cfg != null ? p.cfg : 7)
  imggenSetSlider('imggen-steps', 'imggen-steps-num', 'imggen-steps-val', p.steps != null ? p.steps : 20)
  if (p.sampler) $('imggen-sampler').value = p.sampler
  if (p.seed != null) $('imggen-seed').value = p.seed
  imggenSetSlider('imggen-count', 'imggen-count-num', 'imggen-count-val', p.count != null ? p.count : 1)
  if (p.model) $('imggen-model').value = p.model
  imggenUpdateLockBtn()
}

/* ── 尺寸 / 比例 ── */
function imggenSetSlider(rangeId, numId, valId, v) {
  const r = $(rangeId), n = $(numId), l = $(valId)
  if (r) r.value = v
  if (n) n.value = v
  if (l) l.textContent = String(v)
}
function imggenSetSize(w, h) {
  w = imggenSnap8(w); h = imggenSnap8(h)
  imggenSetSlider('imggen-w', 'imggen-w-num', 'imggen-w-val', w)
  imggenSetSlider('imggen-h', 'imggen-h-num', 'imggen-h-val', h)
}
function imggenRatioDims(name, keepW) {
  const r = IMGGEN_RATIOS[name]
  if (!r) return null
  const w = keepW || 1024
  let h = imggenSnap8(w * r[1] / r[0])
  let ww = w
  if (h > 2048) { h = 2048; ww = imggenSnap8(h * r[0] / r[1]) }
  return [ww, h]
}
function imggenSetRatio(name, resize) {
  imggen.ratio = name
  const chips = document.querySelectorAll('#imggen-ratios .imggen-ratio')
  for (const c of chips) c.classList.toggle('active', c.dataset.ratio === name)
  if (name !== 'Free') {
    imggen.locked = true
    if (resize !== false) {
      const d = imggenRatioDims(name, imggenSnap8($('imggen-w-num').value))
      if (d) imggenSetSize(d[0], d[1])
    }
  } else {
    imggen.locked = false
  }
  imggenUpdateLockBtn()
}
function imggenUpdateLockBtn() {
  const b = $('imggen-lock')
  if (!b) return
  b.textContent = imggen.locked ? '🔒 已锁定比例' : '🔓 未锁定比例'
  b.setAttribute('aria-pressed', imggen.locked ? 'true' : 'false')
}
function imggenFollowFromWidth() {
  if (!imggen.locked || imggen.ratio === 'Free') return
  const d = imggenRatioDims(imggen.ratio, imggenSnap8($('imggen-w-num').value))
  if (d) imggenSetSize(d[0], d[1])
}
function imggenFollowFromHeight() {
  if (!imggen.locked || imggen.ratio === 'Free') return
  const r = IMGGEN_RATIOS[imggen.ratio]
  if (!r) return
  const h = imggenSnap8($('imggen-h-num').value)
  let w = imggenSnap8(h * r[0] / r[1])
  let hh = h
  if (w > 2048) { w = 2048; hh = imggenSnap8(w * r[1] / r[0]) }
  imggenSetSize(w, hh)
}
function imggenRenderCustomRatios() {
  const box = $('imggen-custom-ratios')
  if (!box) return
  clear(box)
  for (const r of imggen.customRatios) {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'imggen-ratio'
    b.textContent = r.name + ' '
    const x = document.createElement('span')
    x.className = 'x'
    x.textContent = r.w + ':' + r.h
    b.appendChild(x)
    b.title = '点一下按 ' + r.w + ':' + r.h + ' 出图；长按删除'
    b.addEventListener('click', () => {
      imggen.ratio = 'custom:' + r.name
      imggen.locked = true
      const chips = document.querySelectorAll('#imggen-ratios .imggen-ratio')
      for (const c of chips) c.classList.remove('active')
      const w = imggenSnap8($('imggen-w-num').value)
      let h = imggenSnap8(w * r.h / r.w)
      let ww = w
      if (h > 2048) { h = 2048; ww = imggenSnap8(h * r.w / r.h) }
      imggenSetSize(ww, h)
      imggenUpdateLockBtn()
      imggenSaveSettings()
    })
    b.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      imggen.customRatios = imggen.customRatios.filter((v) => v !== r)
      imggenSaveRatios()
      imggenRenderCustomRatios()
    })
    box.appendChild(b)
  }
}
function imggenGcd(a, b) { return b === 0 ? a : imggenGcd(b, a % b) }

/* ── 批量解析：txt 每行一条，A1111 式 --参数 值 逐行覆盖 ── */
function imggenParseBatchLine(line) {
  const overrides = {}
  let rest = String(line || '')
  const re = /--([a-z_]+)\s+("[^"]*"|'[^']*'|\S+)/g
  let m
  while ((m = re.exec(rest)) !== null) {
    const k = m[1]
    let v = m[2]
    if ((v[0] === '"' && v[v.length - 1] === '"') || (v[0] === "'" && v[v.length - 1] === "'")) v = v.slice(1, -1)
    if (k === 'prompt') overrides.prompt = v
    else if (k === 'negative_prompt' || k === 'negative') overrides.negative = v
    else if (k === 'steps') overrides.steps = imggenClampInt(v, 1, 60, 20)
    else if (k === 'cfg_scale' || k === 'cfg') overrides.cfg = Math.max(1, Math.min(20, parseFloat(v) || 7))
    else if (k === 'width') overrides.width = imggenSnap8(v)
    else if (k === 'height') overrides.height = imggenSnap8(v)
    else if (k === 'seed') overrides.seed = imggenClampInt(v, -1, 2147483647, -1)
    else if (k === 'sampler') overrides.sampler = v
    else if (k === 'model') overrides.model = v
  }
  rest = rest.replace(/--[a-z_]+\s+("[^"]*"|'[^']*'|\S+)/g, ' ').replace(/\s+/g, ' ').trim()
  const prompt = overrides.prompt || rest
  delete overrides.prompt
  if (!prompt) return null
  return { prompt, overrides }
}
function imggenParseBatch(text) {
  const out = []
  for (const line of String(text || '').split(/\r?\n/)) {
    const t = line.trim()
    if (!t) continue
    const parsed = imggenParseBatchLine(t)
    if (parsed) out.push(parsed)
  }
  return out
}

/* ── 任务队列 ── */
function imggenNewId() {
  return 't' + imggenNow().toString(36) + (imggen.tasks.length + Math.floor(Math.random() * 1e6)).toString(36)
}
function imggenEnqueue(items) {
  const base = imggenReadParams()
  let n = 0
  for (const it of items) {
    const p = Object.assign({}, base, it.overrides || {})
    p.prompt = it.prompt
    imggen.tasks.push({
      id: imggenNewId(), prompt: p.prompt, params: p,
      status: 'pending', createdAt: imggenNow(), startedAt: null, endedAt: null,
      error: '', detail: '', imageUrl: '', imageData: '',
    })
    n++
  }
  if (n > 0) { imggenSaveTasks(); imggenRenderAll(); imggenPump() }
  return n
}
function imggenCounts() {
  const c = { all: imggen.tasks.length, completed: 0, failed: 0 }
  for (const t of imggen.tasks) {
    if (t.status === 'completed') c.completed++
    if (t.status === 'failed') c.failed++
  }
  return c
}
function imggenTerminalCount() {
  let n = 0
  for (const t of imggen.tasks) if (IMGGEN_TERMINAL.indexOf(t.status) !== -1) n++
  return n
}
function imggenRenderProgress() {
  const total = imggen.tasks.length
  const done = imggenTerminalCount()
  const pct = total === 0 ? 0 : Math.round(done / total * 100)
  const fill = $('imggen-progress-fill')
  if (fill) fill.style.transform = 'scaleX(' + (pct / 100) + ')'
  const pctEl = $('imggen-progress-pct')
  if (pctEl) pctEl.textContent = pct + '%'
  const label = $('imggen-progress-label')
  if (!label) return
  const running = imggen.tasks.find((t) => t.status === 'running')
  if (running) label.textContent = '生成中：' + imggenSummary(running.prompt, 24)
  else if (imggen.tasks.some((t) => t.status === 'pending')) label.textContent = '排队中：' + imggen.tasks.filter((t) => t.status === 'pending').length + ' 个待处理'
  else if (total > 0) label.textContent = done === total ? '全部完成' : '队列空闲'
  else label.textContent = '队列空闲'
}
function imggenStatusText(s) {
  return { pending: '排队中', running: '生成中', completed: '已完成', failed: '失败', canceled: '已取消' }[s] || s
}
function imggenRenderQueue() {
  const box = $('imggen-queue')
  if (!box) return
  clear(box)
  const c = imggenCounts()
  const setCount = (id, v) => { const el = $(id); if (el) el.textContent = String(v) }
  setCount('imggen-count-all', c.all)
  setCount('imggen-count-completed', c.completed)
  setCount('imggen-count-failed', c.failed)
  const tabs = document.querySelectorAll('#imggen-qtabs button')
  for (const b of tabs) b.classList.toggle('active', b.dataset.qtab === imggen.qtab)
  const list = imggen.tasks.filter((t) => imggen.qtab === 'all' || (imggen.qtab === 'completed' ? t.status === 'completed' : t.status === 'failed'))
  const empty = $('imggen-queue-empty')
  if (empty) empty.hidden = list.length !== 0
  for (const t of list) {
    const row = document.createElement('div')
    row.className = 'imggen-task'
    const top = document.createElement('div')
    top.className = 'imggen-task-top'
    const promptEl = document.createElement('span')
    promptEl.className = 'imggen-task-prompt'
    promptEl.textContent = imggenSummary(t.prompt, 40)
    promptEl.title = t.prompt
    top.appendChild(promptEl)
    const pill = document.createElement('span')
    pill.className = 'imggen-pill st-' + t.status
    pill.textContent = imggenStatusText(t.status)
    top.appendChild(pill)
    row.appendChild(top)
    const meta = document.createElement('div')
    meta.className = 'imggen-task-meta'
    const p = t.params || {}
    meta.textContent = (p.width || '?') + '×' + (p.height || '?') + ' · 步数 ' + (p.steps || '?') + ' · CFG ' + (p.cfg || '?') + ' · 种子 ' + (p.seed != null ? p.seed : '?')
    const elapsed = document.createElement('span')
    elapsed.setAttribute('data-elapsed', t.id)
    elapsed.textContent = t.status === 'running' ? ' · 已用 0 秒' : (t.startedAt ? ' · 耗时 ' + imggenDur(t) : '')
    meta.appendChild(elapsed)
    row.appendChild(meta)
    if (t.status === 'failed' && t.error) {
      const err = document.createElement('div')
      err.className = 'imggen-task-err'
      err.textContent = t.error
      row.appendChild(err)
      if (t.detail) {
        const d = document.createElement('div')
        d.className = 'imggen-task-detail'
        d.textContent = t.detail
        row.appendChild(d)
      }
    }
    const acts = document.createElement('div')
    acts.className = 'imggen-task-actions'
    if (t.status === 'pending' || t.status === 'running') {
      const cancel = document.createElement('button')
      cancel.type = 'button'
      cancel.className = 'ghost'
      cancel.textContent = '取消'
      cancel.addEventListener('click', () => imggenCancel(t.id))
      acts.appendChild(cancel)
    }
    if (t.status === 'failed') {
      const retry = document.createElement('button')
      retry.type = 'button'
      retry.className = 'ghost'
      retry.textContent = '重试'
      retry.addEventListener('click', () => imggenRetry(t.id))
      acts.appendChild(retry)
    }
    if (acts.children.length > 0) row.appendChild(acts)
    box.appendChild(row)
  }
}
function imggenRenderGallery() {
  const box = $('imggen-gallery')
  if (!box) return
  clear(box)
  const done = imggen.tasks.filter((t) => t.status === 'completed' && (t.imageUrl || t.imageData))
  const empty = $('imggen-gallery-empty')
  if (empty) empty.hidden = done.length !== 0
  const zipBtn = $('imggen-zip')
  if (zipBtn) zipBtn.disabled = done.length === 0
  for (const t of done) {
    const src = t.imageUrl || t.imageData
    const fig = document.createElement('figure')
    fig.className = 'imggen-figure'
    const img = document.createElement('img')
    img.src = src
    img.alt = imggenSummary(t.prompt, 40)
    img.loading = 'lazy'
    img.addEventListener('click', () => {
      const big = document.createElement('img')
      big.className = 'imggen-view-img'
      big.src = src
      big.alt = t.prompt
      const cap = document.createElement('p')
      cap.className = 'hint'
      cap.textContent = t.prompt
      openInfo('出图', [big, cap])
    })
    fig.appendChild(img)
    const cap = document.createElement('figcaption')
    cap.textContent = imggenSummary(t.prompt, 24)
    fig.appendChild(cap)
    const row = document.createElement('div')
    row.className = 'row'
    const dl = document.createElement('button')
    dl.type = 'button'
    dl.className = 'ghost'
    dl.textContent = '下载'
    dl.addEventListener('click', () => { imggenDownload(t) })
    row.appendChild(dl)
    fig.appendChild(row)
    box.appendChild(fig)
  }
}
function imggenRenderAll() {
  imggenRenderProgress()
  imggenRenderQueue()
  imggenRenderGallery()
}
function imggenCancel(id) {
  const t = imggen.tasks.find((v) => v.id === id)
  if (!t) return
  if (t.status === 'pending') {
    t.status = 'canceled'
    t.endedAt = imggenNow()
    imggenSaveTasks()
    imggenRenderAll()
  } else if (t.status === 'running') {
    t.cancelRequested = true
    if (imggen.abort) imggen.abort.abort()
  }
}
function imggenRetry(id) {
  const t = imggen.tasks.find((v) => v.id === id)
  if (!t) return
  t.status = 'pending'
  t.error = ''
  t.detail = ''
  t.startedAt = null
  t.endedAt = null
  imggenSaveTasks()
  imggenRenderAll()
  imggenPump()
}

/* ── 生成：走真实的 /v1/images/generations；没有上游就诚实失败 ── */
async function imggenGenerate(task) {
  const p = task.params || {}
  const ctrl = new AbortController()
  imggen.abort = ctrl
  const timer = setTimeout(() => ctrl.abort(), 180000)
  try {
    const res = await fetch(API_BASE + '/v1/images/generations', {
      method: 'POST',
      headers: { authorization: 'Bearer ' + apiKey(), 'content-type': 'application/json' },
      body: JSON.stringify({
        model: p.model || undefined,
        prompt: task.prompt,
        negative_prompt: p.negative || undefined,
        size: (p.width || 1024) + 'x' + (p.height || 576),
        n: 1, steps: p.steps, cfg_scale: p.cfg, seed: p.seed, sampler: p.sampler,
      }),
      signal: ctrl.signal,
    })
    let data = null
    try { data = await res.json() } catch { data = null }
    if (!res.ok) {
      const gwMsg = data && data.error && typeof data.error.message === 'string' ? data.error.message : ('HTTP ' + res.status)
      task.status = 'failed'
      task.error = IMGGEN_UPSTREAM_MSG
      task.detail = '网关返回：' + gwMsg
      return
    }
    const item = data && Array.isArray(data.data) && data.data[0] ? data.data[0] : null
    if (item && typeof item.url === 'string' && item.url) {
      task.status = 'completed'
      task.imageUrl = item.url
      if (typeof item.revised_prompt === 'string' && item.revised_prompt) task.detail = '上游改写提示词：' + item.revised_prompt
      return
    }
    if (item && typeof item.b64_json === 'string' && item.b64_json) {
      task.status = 'completed'
      task.imageData = 'data:image/png;base64,' + item.b64_json
      task.detail = 'base64 图片只存本页内存，刷新后不再显示（localStorage 放不下大图）。'
      return
    }
    task.status = 'failed'
    task.error = IMGGEN_UPSTREAM_MSG
    task.detail = '网关返回了 200，但响应里没有图片（既无 url 也无 b64_json）。'
  } catch (e) {
    if (task.cancelRequested || (e && e.name === 'AbortError')) {
      task.status = 'canceled'
      task.error = ''
      task.detail = ''
    } else {
      task.status = 'failed'
      task.error = IMGGEN_UPSTREAM_MSG
      task.detail = '请求失败：' + (e && e.message ? e.message : '未知错误')
    }
  } finally {
    clearTimeout(timer)
    if (imggen.abort === ctrl) imggen.abort = null
    task.endedAt = imggenNow()
    imggenSaveTasks()
    imggenRenderAll()
  }
}
async function imggenPump() {
  if (imggen.running) return
  imggen.running = true
  try {
    for (;;) {
      const next = imggen.tasks.find((t) => t.status === 'pending')
      if (!next) break
      next.status = 'running'
      next.startedAt = imggenNow()
      next.cancelRequested = false
      imggenSaveTasks()
      imggenRenderAll()
      await imggenGenerate(next)
    }
  } finally {
    imggen.running = false
    imggenRenderAll()
  }
}

/* ── PNG 元数据：把生成参数写进 tEXt 块（CRC32 自算，无依赖）── */
const IMGGEN_CRC_TABLE = (function () {
  const table = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    table[n] = c >>> 0
  }
  return table
})()
function imggenCrc32(bytes) {
  let c = 0xffffffff
  for (let i = 0; i < bytes.length; i++) c = IMGGEN_CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
async function imggenAddPngText(blob, keyword, text) {
  const buf = new Uint8Array(await blob.arrayBuffer())
  if (buf.length < 8 || buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) return null
  const enc = new TextEncoder()
  const kw = enc.encode(keyword)
  const tx = enc.encode(text)
  const data = new Uint8Array(kw.length + 1 + tx.length)
  data.set(kw, 0)
  data.set(tx, kw.length + 1)
  const type = enc.encode('tEXt')
  const chunkData = new Uint8Array(type.length + data.length)
  chunkData.set(type, 0)
  chunkData.set(data, type.length)
  const crc = imggenCrc32(chunkData)
  const chunk = new Uint8Array(4 + chunkData.length + 4)
  const view = new DataView(chunk.buffer)
  view.setUint32(0, data.length)
  chunk.set(chunkData, 4)
  view.setUint32(4 + chunkData.length, crc)
  // 插到 IEND 之前。
  let off = 8
  let iend = -1
  while (off + 8 <= buf.length) {
    const len = new DataView(buf.buffer, off, 4).getUint32(0)
    const name = String.fromCharCode(buf[off + 4], buf[off + 5], buf[off + 6], buf[off + 7])
    if (name === 'IEND') { iend = off; break }
    off += 12 + len
  }
  if (iend === -1) return null
  const out = new Uint8Array(buf.length + chunk.length)
  out.set(buf.slice(0, iend), 0)
  out.set(chunk, iend)
  out.set(buf.slice(iend), iend + chunk.length)
  return new Blob([out], { type: 'image/png' })
}
function imggenFileName(task) {
  const p = task.params || {}
  return 'imggen-' + task.id + '-' + (p.width || '?') + 'x' + (p.height || '?') + '-seed' + (p.seed != null ? p.seed : 'x') + '.png'
}
function imggenTriggerDownload(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
async function imggenDownloadBlob(task) {
  const src = task.imageUrl || task.imageData
  const p = task.params || {}
  const meta = JSON.stringify({ prompt: task.prompt, negative_prompt: p.negative || '', width: p.width, height: p.height, steps: p.steps, cfg: p.cfg, seed: p.seed, sampler: p.sampler, model: p.model })
  const res = await fetch(src)
  if (!res.ok) throw new Error('HTTP ' + res.status)
  let blob = await res.blob()
  if (blob.type === 'image/png' || (src && src.indexOf('.png') !== -1)) {
    const withMeta = await imggenAddPngText(blob, 'parameters', meta)
    if (withMeta) return { blob: withMeta, metaOk: true }
    return { blob, metaOk: false }
  }
  return { blob, metaOk: false }
}
async function imggenDownload(task) {
  const name = imggenFileName(task)
  try {
    const r = await imggenDownloadBlob(task)
    if (!r.metaOk) alert('这张图的 PNG 元数据没写进去，参数已写进文件名。')
    imggenTriggerDownload(r.blob, name)
  } catch (e) {
    // 远程图 fetch 不到（跨域）就直接用原链接下载，不静默失败。
    const a = document.createElement('a')
    a.href = task.imageUrl || task.imageData
    a.download = name
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
}
async function imggenDownloadZip() {
  const done = imggen.tasks.filter((t) => t.status === 'completed' && (t.imageUrl || t.imageData))
  if (done.length === 0) return
  if (typeof JSZip === 'undefined') {
    alert('打包组件没加载出来（JSZip CDN），改成逐张下载。')
    for (const t of done) await imggenDownload(t)
    return
  }
  const zip = new JSZip()
  let metaFailed = 0
  for (const t of done) {
    try {
      const r = await imggenDownloadBlob(t)
      if (!r.metaOk) metaFailed++
      zip.file(imggenFileName(t), r.blob)
    } catch {
      // 单张取不到就跳过，不让整包失败。
      metaFailed++
    }
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  imggenTriggerDownload(blob, 'imggen-全部-' + done.length + '张.zip')
  if (metaFailed > 0) alert(metaFailed + ' 张图的元数据没写进去（参数在文件名里），其余已打包。')
}

/* ── 生图模型下拉 ── */
async function imggenLoadModels() {
  const sel = $('imggen-model')
  if (!sel || imggen.modelsLoaded) return
  const res = await api('/v1/models')
  clear(sel)
  const data = (res.ok && res.body && res.body.data) || []
  if (data.length === 0) {
    const o = document.createElement('option')
    o.value = ''
    o.textContent = '模型加载失败（密钥或网络问题）'
    sel.appendChild(o)
    return
  }
  for (const m of data) {
    if (!m || typeof m.id !== 'string') continue
    const o = document.createElement('option')
    o.value = m.id
    o.textContent = m.name && m.name !== m.id ? m.name + '(' + m.id + ')' : m.id
    sel.appendChild(o)
  }
  const saved = imggenLoadSettings()
  const prefer = data.find((m) => /image|draw|dall|flux|stable|sd\b|midjourney/i.test(m.id))
    || data.find((m) => m.id.indexOf('buddy/') === 0)
    || data[0]
  sel.value = (saved && saved.model && data.some((m) => m.id === saved.model)) ? saved.model : (prefer ? prefer.id : '')
  imggen.modelsLoaded = true
  imggenRefreshNotice(data)
}
function imggenRefreshNotice(models) {
  const notice = $('imggen-notice')
  if (!notice) return
  const hasImage = (models || []).some((m) => m && typeof m.id === 'string' && /image|draw|dall|flux|stable|midjourney/i.test(m.id))
  if (hasImage) {
    notice.textContent = '已检测到生图模型，点「生成」会真的出图。'
    notice.style.color = '#86efac'
    notice.style.borderColor = 'rgba(134, 239, 172, 0.4)'
    notice.style.background = 'rgba(134, 239, 172, 0.08)'
  }
}

/* ── 初始化（只绑一次）── */
function imggenBindSlider(rangeId, numId, valId, onChange) {
  const r = $(rangeId), n = $(numId)
  if (!r || !n) return
  r.addEventListener('input', () => {
    n.value = r.value
    const l = $(valId)
    if (l) l.textContent = r.value
    if (onChange) onChange()
  })
  n.addEventListener('change', () => {
    const lo = parseFloat(n.min), hi = parseFloat(n.max)
    let v = parseFloat(n.value)
    if (isNaN(v)) v = parseFloat(r.value)
    v = Math.max(lo, Math.min(hi, v))
    if (n.step === '8' || r.step === '8') v = imggenSnap8(v)
    if (n.step === '0.5' || r.step === '0.5') v = Math.round(v * 2) / 2
    else v = Math.round(v)
    r.value = v
    n.value = v
    const l = $(valId)
    if (l) l.textContent = String(v)
    if (onChange) onChange()
  })
}
function initImageGen() {
  if (imggen.bound) { imggenRenderAll(); return }
  imggen.bound = true
  imggenLoadTasks()
  imggenLoadRatios()
  const saved = imggenLoadSettings()

  // 比例 chips
  const box = $('imggen-ratios')
  for (const name of Object.keys(IMGGEN_RATIOS)) {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'imggen-ratio' + (name === '16:9' ? ' active' : '')
    b.dataset.ratio = name
    b.textContent = name
    b.addEventListener('click', () => { imggenSetRatio(name, true); imggenSaveSettings() })
    box.appendChild(b)
  }
  imggenRenderCustomRatios()

  // 尺寸联动
  imggenBindSlider('imggen-w', 'imggen-w-num', 'imggen-w-val', () => imggenFollowFromWidth())
  imggenBindSlider('imggen-h', 'imggen-h-num', 'imggen-h-val', () => imggenFollowFromHeight())
  $('imggen-lock').addEventListener('click', () => {
    imggen.locked = !imggen.locked
    if (imggen.locked && imggen.ratio === 'Free') imggen.ratio = '16:9'
    imggenUpdateLockBtn()
    if (imggen.locked) imggenFollowFromWidth()
    imggenSaveSettings()
  })
  $('imggen-swap').addEventListener('click', () => {
    const w = imggenSnap8($('imggen-w-num').value)
    const h = imggenSnap8($('imggen-h-num').value)
    imggenSetSize(h, w)
    imggenSaveSettings()
  })
  $('imggen-optimize').addEventListener('click', () => {
    // 恢复推荐尺寸：按当前比例、宽 1024 起算（1:1 则 1024×1024）。
    if (imggen.ratio === 'Free' || !IMGGEN_RATIOS[imggen.ratio]) { imggenSetSize(1024, 1024) }
    else {
      const d = imggenRatioDims(imggen.ratio, 1024)
      if (d) imggenSetSize(d[0], d[1])
    }
    imggenSaveSettings()
  })
  $('imggen-ratio-save').addEventListener('click', () => {
    const name = ($('imggen-ratio-name').value || '').trim()
    if (!name) { alert('先给自定义比例起个名'); return }
    if (imggen.customRatios.length >= 50) { alert('自定义比例最多 50 个，先删掉不用的（长按删除）'); return }
    const w = imggenSnap8($('imggen-w-num').value)
    const h = imggenSnap8($('imggen-h-num').value)
    const g = imggenGcd(w, h)
    const exist = imggen.customRatios.findIndex((r) => r.name === name)
    const rec = { name, w: w / g, h: h / g }
    if (exist >= 0) imggen.customRatios[exist] = rec
    else imggen.customRatios.push(rec)
    $('imggen-ratio-name').value = ''
    imggenSaveRatios()
    imggenRenderCustomRatios()
  })

  // 其余滑块
  imggenBindSlider('imggen-cfg', 'imggen-cfg-num', 'imggen-cfg-val', null)
  imggenBindSlider('imggen-steps', 'imggen-steps-num', 'imggen-steps-val', null)
  imggenBindSlider('imggen-count', 'imggen-count-num', 'imggen-count-val', null)
  $('imggen-seed-random').addEventListener('click', () => { $('imggen-seed').value = -1; imggenSaveSettings() })
  $('imggen-seed-reuse').addEventListener('click', () => {
    if (imggen.lastSeed == null) {
      const prev = imggen.tasks.filter((t) => t.params && t.params.seed != null && t.params.seed >= 0).pop()
      if (prev) imggen.lastSeed = prev.params.seed
    }
    if (imggen.lastSeed == null) { alert('还没有用过的种子'); return }
    $('imggen-seed').value = imggen.lastSeed
    imggenSaveSettings()
  })

  // 生成：一次出 N 张，每张一个任务（种子递增，-1 则每张随机）。
  $('imggen-generate').addEventListener('click', () => {
    const p = imggenReadParams()
    if (!p.prompt.trim()) { alert('先写一句提示词'); return }
    imggenSaveSettings()
    const items = []
    let seed = p.seed
    for (let i = 0; i < p.count; i++) {
      const s = seed === -1 ? Math.floor(Math.random() * 2147483647) : seed + i
      imggen.lastSeed = s
      items.push({ prompt: p.prompt, overrides: { seed: s } })
    }
    const n = imggenEnqueue(items)
    if (n > 0) {
      const hint = $('imggen-generate-hint')
      if (hint) hint.textContent = '已加入 ' + n + ' 个任务，串行执行中'
    }
  })

  // 批量：文件先读进文本框，再走同一解析。
  $('imggen-batch-file').addEventListener('change', () => {
    const f = $('imggen-batch-file').files && $('imggen-batch-file').files[0]
    const nameEl = $('imggen-batch-file-name')
    if (!f) { if (nameEl) nameEl.textContent = ''; return }
    if (nameEl) nameEl.textContent = f.name + '（' + Math.round(f.size / 1024) + 'KB）'
    const reader = new FileReader()
    reader.onload = () => { $('imggen-batch-text').value = String(reader.result || '') }
    reader.onerror = () => alert('文件读不出来，换一个 txt 试试')
    reader.readAsText(f)
  })
  $('imggen-batch-add').addEventListener('click', () => {
    const text = $('imggen-batch-text').value || ''
    const parsed = imggenParseBatch(text)
    const countEl = $('imggen-batch-count')
    if (parsed.length === 0) {
      if (countEl) countEl.textContent = '没解析出提示词（每行一条，空行跳过）'
      return
    }
    imggenSaveSettings()
    const n = imggenEnqueue(parsed)
    if (countEl) countEl.textContent = '已加入 ' + n + ' 个任务'
  })

  // 队列 Tab / 清空已完成 / 打包下载
  for (const b of document.querySelectorAll('#imggen-qtabs button')) {
    b.addEventListener('click', () => { imggen.qtab = b.dataset.qtab; imggenRenderQueue() })
  }
  $('imggen-clear-done').addEventListener('click', () => {
    imggen.tasks = imggen.tasks.filter((t) => t.status !== 'completed')
    imggenSaveTasks()
    imggenRenderAll()
  })
  $('imggen-zip').addEventListener('click', () => { imggenDownloadZip() })

  // 恢复上次参数（模型下拉拉完后再套一次 model）
  imggenApplyParams(saved)
  if (saved && saved.ratio) imggenSetRatio(saved.ratio, false)
  imggenLoadModels().then(() => { if (saved && saved.model) $('imggen-model').value = saved.model })
  imggenRenderAll()
  // 每秒刷新运行中任务的已用时间（只改文字，不重画列表）。
  imggen.tickTimer = setInterval(() => {
    for (const el of document.querySelectorAll('[data-elapsed]')) {
      const t = imggen.tasks.find((v) => v.id === el.getAttribute('data-elapsed'))
      if (t && t.status === 'running' && t.startedAt) {
        el.textContent = ' · 已用 ' + Math.max(0, Math.round((imggenNow() - t.startedAt) / 1000)) + ' 秒'
      }
    }
    imggenRenderProgress()
  }, 1000)
}

// 退出登录按钮已从顶栏撤掉（2026-11-16 用户），守住空引用，
// 万一以后加回来也不用改这行。
const logoutBtn = $('logout')
if (logoutBtn) logoutBtn.onclick = () => {
  localStorage.removeItem('wb_api_key')
  location.href = 'login.html'
}

$('toggle-theme').onclick = () => {
  const cur = localStorage.getItem('wb_theme') || 'auto'
  // 循环：auto → light → dark → auto
  const next = cur === 'auto' ? 'light' : cur === 'light' ? 'dark' : 'auto'
  applyTheme(next)
}

$('run-checkin-all').onclick = runCheckinAll
$('run-daily-all').onclick = runDailyAll
$('run-campaign-status').onclick = runCampaignStatus
$('run-campaign-claim').onclick = runCampaignClaim
// 「查进度」时**顺带刷新积分** —— 这是用户确认「到底加没加」的入口。
// 只刷进度不刷积分的话，用户会看到「任务全 OK，但余额没动」，
// 而真相只是余额没重新拉（缓存），非常容易误判成任务白做。
$('refresh-status').onclick = () => { loadTaskStatus(false); invalidateCredits() }
$('refresh-usage').onclick = loadUsage
$('load-models').onclick = loadModels
$('refresh-logs').onclick = loadLogs
$('refresh-apikeys').onclick = () => { $('apikey-reveal').hidden = true; loadApiKeys() }
$('create-apikey').onclick = createApiKey
$('apikey-copy').onclick = copyReveal
$('clear-logs').onclick = async () => {
  if (!confirm('清空日志？')) return
  await api('/admin/logs/clear', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })
  loadLogs()
}
$('clear-waf').onclick = async () => {
  const r = await api('/admin/waf/clear', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ realm: 'cn' }),
  })
  alert(r.ok ? '已解除' : '解除失败：' + JSON.stringify(r.body))
  loadWaf()
}
// 顶栏返回按钮：子视图里点回设置菜单，设置菜单里点回首页
// （底部导航已撤，这是回首页的路）。子视图里标题是“返回设置”，
// 设置菜单里是“返回首页”，由 switchView / openSettingsSection 改。
const settingsBack = $('settings-back')
if (settingsBack) settingsBack.onclick = () => {
  if (currentSubView) switchView('settings')
  else switchView('chat')
}
// 顶栏齿轮：设置移到顶栏（2026-11-16 用户），点进设置菜单。
const topSettings = $('top-settings')
if (topSettings) topSettings.onclick = () => switchView('settings')
// 设置菜单：点一行进一个子视图。
for (const row of document.querySelectorAll('.settings-row')) {
  row.onclick = () => openSettingsSection(row.dataset.section)
}
for (const btn of document.querySelectorAll('.nav-item')) {
  btn.onclick = () => switchView(btn.dataset.view)
}

/**
 * 移动端抽屉导航（照观澜：汉堡按钮开合左侧栏）。
 *
 * 桌面端侧边栏常驻，汉堡按钮隐藏（CSS 控制）；手机上侧边栏平时收起，
 * 点汉堡滑出，点遮罩或任意导航项收起。
 */
const menuBtn = $('menu-toggle')
const navScrim = $('nav-scrim')
function setNavOpen(open) {
  document.body.classList.toggle('nav-open', open)
  if (navScrim) navScrim.hidden = !open
}
if (menuBtn) menuBtn.onclick = () => setNavOpen(!document.body.classList.contains('nav-open'))
if (navScrim) navScrim.onclick = () => setNavOpen(false)
for (const btn of document.querySelectorAll('.nav-item')) {
  btn.addEventListener('click', () => setNavOpen(false))
}

/**
 * 启动：**无论有没有密钥都要让页面有内容**。
 *
 * ⚠️ 早期版本在这里写成「没密钥就什么都不做」，结果页面一片空白，
 * 用户以为坏了。现在显式区分三种状态：未填密钥 / 密钥无效 / 正常。
 */
async function bootstrap() {
  const key = apiKey()

  if (key === '') {
    // ⚠️ 未登录 → 跳到独立登录页（而不是在面板顶部塞一个密码框）。
    location.href = 'login.html'
    return
  }

  // ⚠️ 这里**不要**再去操作顶部提示元素。
  //
  // 历史（一次 P0 级事故）：这里曾有一行 `$('setup-hint').hidden = true`。
  // 后来「独立登录页」把 `#setup-hint` 从 index.html 删掉了，这行却留着 ——
  // `$()` 返回 null，赋值抛 `TypeError: Cannot set properties of null`。
  // 它恰好位于 setAuth() 与 switchView() **之前**，于是 bootstrap() 整个中断：
  // 登录明明成功，面板却只剩顶栏与导航，正文一片空白、且**没有任何报错**。
  //
  // 教训：bootstrap 里引用 DOM id 时，删元素必须同步删引用；
  // 这类悬空引用不会自己暴露（不报错只是不生效），只能靠测试锁住（见 panel.test.ts）。
  //
  // ⚠️ 这里只为**验证密钥有效**，查 cn 即可（密钥对所有 realm 通用）；
  // 真正的数据加载在 switchView 里，那里会查两个 realm。
  const res = await api('/admin/pool?realm=cn')
  // ⚠️⚠️ **只有 401 才代表「密钥无效」** —— 不能把所有 `!ok` 都当成密钥问题。
  //
  // 实测缺陷（网络抽动的代价）：原先写的是 `if (!res.ok) { 删密钥 → 跳登录页 }`。
  // 而 `api()` 在**网络错误**时返回 `status: 0`（如 `Could not resolve host`）——
  // 于是一次瞬时 DNS 抖动就会被当成「密钥失效」，**把用户已存的密钥删掉并踢回登录页**。
  // 用户重输一遍密钥后又能用，于是这个缺陷看着像「面板偶尔掉登录」这种玄学问题。
  //
  // 正确语义：
  //   · `401` → 密钥确实无效 ⇒ 删密钥并回登录页（原行为）；
  //   · 其余失败（0=网络 / 5xx / 5xx 网关）⇒ **保留密钥**，留在面板上把
  //     真实原因告诉用户（下面会显式显示）——到底能不能用，让用户重试决定。
  if (res.status === 401) {
    localStorage.removeItem('wb_api_key')
    location.href = 'login.html'
    return
  }
  if (!res.ok) {
    // 非 401 的失败：密钥保留，但必须**明确告知**（否则用户只看到一堆空面板，
    // 会误以为账号/密钥坏了）。顶部药丸正是为这种「出错时要提示」而留的。
    setAuth(res.status === 0 ? '网络错误，请重试' : `服务异常（HTTP ${res.status}）`, false)
  } else {
    setAuth('密钥有效', true)
  }
  // ⚠️ **存下来的视图名也要校验**，不能只改默认值。
  //
  // 实测踩到：`accounts` 曾是独立视图名，后来账号池并入了「供应商与账号」，
  // 导航里不再有它。我第一版只把**默认值**改成 `providers` —— 但用户的
  // localStorage 里**早就存了 `'accounts'`**（旧版代码写进去的），
  // 于是 `getItem` 仍然返回旧值，`VIEW_LOADERS['accounts']` 依旧是
  // `undefined`，**加载器依然不执行**，刷新后照样空白。
  //
  // 修法：把存下来的值与**真实导航项**比对，不合法就丢弃并回到 `providers`。
  // 顺带清掉这个陈旧键，避免它一直阴魂不散。
  // ⚠️ 旧版存的 'dashboard' 已不再是首页：首页现在是对话。
  // 子视图也不直接做初始视图（刷新后回到设置菜单即可）。
  const stored = localStorage.getItem('wb_view')
  const mapped = stored === 'dashboard' ? 'chat' : stored
  const initialView = mapped !== null && TOP_VIEWS.includes(mapped) ? mapped : 'chat'
  initGestures()
  switchView(initialView)
  loadWaf()
  setInterval(loadWaf, 20000)
}

// ⚠️ 主题要在**最早期**应用（在任何渲染之前），否则浅色用户会看到深色闪烁。
applyTheme(localStorage.getItem('wb_theme') || 'light')

bootstrap()

/* ─────────────────────────── 提视频（自研解析 + 图片工具 + 本地提音频） ───────────────────────────
 *
 * 链接解析走网关 POST /v1/extract（抖音 / 快手已通；小红书纯服务端解析走不通，
 * 网关会如实报“暂不支持”，面板不假装能下）。
 * 图片压缩 / 格式转换是纯前端 canvas，不上传服务器。
 * 本地视频提音频是实验功能：ffmpeg.wasm 单线程版，首次加载约 31MB，
 * 只适合 60 秒以内、80MB 以内的短视频；大文件可能闪退，失败如实提示。
 * 直链有时效（抖音约 5 分钟）：解析完尽快下载，别存下来以后用。
 */

let extractBound = false
/** 最近一次解析出的音频直链（复制按钮用）。 */
let extractLastAudioUrl = ''
/** 图片工具当前选中的图。 */
let imgtoolState = null
/** 音频工具当前选中的文件 + 已加载的 ffmpeg 实例。 */
let audiotoolState = { file: null, ffmpeg: null }

function extractFormatDuration(ms) {
  const s = Math.round(ms / 1000)
  const m = Math.floor(s / 60)
  const rest = s % 60
  return m > 0 ? m + '分' + rest + '秒' : rest + '秒'
}

function extractSetStatus(text) {
  const el = $('extract-status')
  if (el) el.textContent = text
}

async function extractCopyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // 剪贴板 API 不可用时（旧系统 / 非安全上下文）退回选区复制。
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy') } catch { /* 复制失败就失败，不假装成功 */ }
    ta.remove()
  }
  if (btn) {
    const old = btn.textContent
    btn.textContent = '已复制 ✓'
    setTimeout(() => { btn.textContent = old }, 1200)
  }
}

function initExtract() {
  if (extractBound) return
  extractBound = true

  $('extract-parse').addEventListener('click', () => { void extractParse() })
  $('extract-url').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { void extractParse() }
  })
  $('extract-paste').addEventListener('click', async () => {
    try {
      const t = await navigator.clipboard.readText()
      if (t) $('extract-url').value = t
      else extractSetStatus('剪贴板是空的，请手动粘贴')
    } catch {
      alert('剪贴板读不到，请手动粘贴链接')
    }
  })
  $('extract-audio-copy').addEventListener('click', (e) => {
    if (extractLastAudioUrl) void extractCopyText(extractLastAudioUrl, e.currentTarget)
  })

  // 图片工具
  $('imgtool-pick').addEventListener('click', () => $('imgtool-file').click())
  $('imgtool-file').addEventListener('change', () => { imgtoolOnFile() })
  $('imgtool-quality').addEventListener('input', () => {
    $('imgtool-quality-val').textContent = Math.round(Number($('imgtool-quality').value) * 100) + '%'
  })
  $('imgtool-run').addEventListener('click', () => { void imgtoolRun() })

  // 音频工具
  $('audiotool-pick').addEventListener('click', () => $('audiotool-file').click())
  $('audiotool-file').addEventListener('change', () => { audiotoolOnFile() })
  $('audiotool-run').addEventListener('click', () => { void audiotoolRun() })
}

/** 解析一条链接并渲染结果。 */
async function extractParse() {
  const url = $('extract-url').value.trim()
  if (!url) { alert('先粘贴一条视频链接'); return }
  const btn = $('extract-parse')
  btn.disabled = true
  extractSetStatus('正在解析…')
  $('extract-result').hidden = true
  extractLastAudioUrl = ''
  try {
    const res = await api('/v1/extract', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (!res.ok) {
      const msg = res.body && res.body.error && res.body.error.message
        ? res.body.error.message
        : '解析失败（HTTP ' + res.status + '）'
      extractSetStatus('解析失败：' + msg)
      return
    }
    const d = res.body || {}
    const cover = $('extract-cover')
    if (d.cover) { cover.src = d.cover; cover.hidden = false } else { cover.hidden = true }
    $('extract-title').textContent = d.title || '（无标题）'
    const parts = [d.platform_name, d.author]
    if (d.duration_ms) parts.push(extractFormatDuration(d.duration_ms))
    if (d.width && d.height) parts.push(d.width + '×' + d.height)
    $('extract-meta').textContent = parts.filter(Boolean).join(' · ')
    const box = $('extract-videos')
    clear(box)
    const videos = Array.isArray(d.videos) ? d.videos : []
    if (videos.length === 0) {
      extractSetStatus('解析到了视频信息，但没有可下载的地址')
      return
    }
    videos.forEach((v) => {
      const a = document.createElement('a')
      a.className = 'ghost extract-dl'
      a.target = '_blank'
      a.rel = 'noopener'
      a.href = v.url
      a.textContent = '下载视频' + (v.label ? '（' + v.label + '）' : '')
      box.appendChild(a)
      const c = document.createElement('button')
      c.type = 'button'
      c.className = 'ghost'
      c.textContent = '复制链接'
      c.addEventListener('click', () => { void extractCopyText(v.url, c) })
      box.appendChild(c)
    })
    const audioRow = $('extract-audio-row')
    if (d.audio_url) {
      extractLastAudioUrl = d.audio_url
      $('extract-audio').href = d.audio_url
      audioRow.hidden = false
    } else {
      audioRow.hidden = true
    }
    $('extract-result').hidden = false
    extractSetStatus('解析成功，直链约 5 分钟过期，尽快下载。')
  } catch (e) {
    extractSetStatus('解析失败：' + (e && e.message ? e.message : '网络错误'))
  } finally {
    btn.disabled = false
  }
}

/* ── 图片工具：canvas 压缩 / 格式转换（纯本机） ── */

function imgtoolOnFile() {
  const f = $('imgtool-file').files && $('imgtool-file').files[0]
  if (!f) return
  if (!f.type || !f.type.startsWith('image/')) {
    $('imgtool-info').textContent = '这不是图片文件'
    return
  }
  const url = URL.createObjectURL(f)
  const img = new Image()
  img.onload = () => {
    imgtoolState = { file: f, name: f.name, type: f.type, width: img.naturalWidth, height: img.naturalHeight, img }
    const prev = $('imgtool-preview')
    prev.src = url
    prev.hidden = false
    $('imgtool-info').textContent = f.name + ' · ' + img.naturalWidth + '×' + img.naturalHeight
      + ' · ' + (f.size / 1024).toFixed(0) + ' KB'
    $('imgtool-run').disabled = false
    $('imgtool-result').textContent = ''
    $('imgtool-download').hidden = true
  }
  img.onerror = () => {
    URL.revokeObjectURL(url)
    $('imgtool-info').textContent = '这张图读不出来，换一张试试'
  }
  img.src = url
}

async function imgtoolRun() {
  const s = imgtoolState
  if (!s || !s.img) return
  const btn = $('imgtool-run')
  btn.disabled = true
  try {
    const q = Number($('imgtool-quality').value) || 0.85
    const maxw = parseInt($('imgtool-maxw').value, 10) || 0
    const fmtSel = $('imgtool-format').value
    let mime = fmtSel === 'keep' ? (s.type || 'image/jpeg') : fmtSel
    // canvas 只认 jpeg/png/webp；原格式是别的（如 gif/bmp）回落 jpeg。
    if (mime !== 'image/jpeg' && mime !== 'image/png' && mime !== 'image/webp') mime = 'image/jpeg'
    let w = s.width
    let h = s.height
    if (maxw > 0 && Math.max(w, h) > maxw) {
      const k = maxw / Math.max(w, h)
      w = Math.max(1, Math.round(w * k))
      h = Math.max(1, Math.round(h * k))
    }
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    // JPEG/WebP 没有透明通道，先铺白底，免得透明变黑。
    if (mime !== 'image/png') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h) }
    ctx.drawImage(s.img, 0, 0, w, h)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, q))
    if (!blob) {
      $('imgtool-result').textContent = '转换失败，换个格式再试'
      return
    }
    const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg'
    const base = (s.name || 'image').replace(/\.[^.]+$/, '') || 'image'
    const a = $('imgtool-download')
    if (a.href && a.href.startsWith('blob:')) URL.revokeObjectURL(a.href)
    a.href = URL.createObjectURL(blob)
    a.download = base + '-compressed.' + ext
    a.hidden = false
    $('imgtool-result').textContent = '处理后：' + w + '×' + h + ' · ' + (blob.size / 1024).toFixed(0)
      + ' KB（原来 ' + (s.file.size / 1024).toFixed(0) + ' KB）'
  } finally {
    btn.disabled = false
  }
}

/* ── 音频工具：本地视频提音频（ffmpeg.wasm 单线程，实验功能） ── */

function audiotoolOnFile() {
  const f = $('audiotool-file').files && $('audiotool-file').files[0]
  if (!f) return
  audiotoolState.file = f
  $('audiotool-info').textContent = f.name + ' · ' + (f.size / 1024 / 1024).toFixed(1) + ' MB'
  $('audiotool-run').disabled = false
  $('audiotool-status').textContent = ''
  $('audiotool-download').hidden = true
}

async function audiotoolRun() {
  const f = audiotoolState.file
  if (!f) return
  if (f.size > 80 * 1024 * 1024) {
    $('audiotool-status').textContent = '文件超过 80MB，浏览器可能闪退，先剪短或压缩再试'
    return
  }
  const btn = $('audiotool-run')
  btn.disabled = true
  try {
    if (!audiotoolState.ffmpeg) {
      $('audiotool-status').textContent = '正在加载处理核心（首次约 31MB，走流量注意）…'
      // 动态加载：只有点“提取音频”时才拉 31MB，平时不占流量。
      const mod = await import('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/esm/index.js')
      const ffmpeg = new mod.FFmpeg()
      await ffmpeg.load({
        coreURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js',
        wasmURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm',
      })
      audiotoolState.ffmpeg = ffmpeg
    }
    const ffmpeg = audiotoolState.ffmpeg
    $('audiotool-status').textContent = '正在提取音频…'
    const ext = (f.name.includes('.') ? f.name.slice(f.name.lastIndexOf('.')) : '.mp4').toLowerCase()
    const inName = 'input' + (ext === '.mov' || ext === '.mp4' || ext === '.m4v' || ext === '.webm' ? ext : '.mp4')
    await ffmpeg.writeFile(inName, new Uint8Array(await f.arrayBuffer()))
    const ok = await ffmpeg.exec(['-i', inName, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', 'out.mp3'])
    if (ok !== 0) throw new Error('提取失败（ffmpeg 返回 ' + ok + '）')
    const data = await ffmpeg.readFile('out.mp3')
    const blob = new Blob([data.buffer], { type: 'audio/mpeg' })
    const a = $('audiotool-download')
    if (a.href && a.href.startsWith('blob:')) URL.revokeObjectURL(a.href)
    a.href = URL.createObjectURL(blob)
    a.download = (f.name.replace(/\.[^.]+$/, '') || 'audio') + '.mp3'
    a.hidden = false
    $('audiotool-status').textContent = '提取完成：' + (blob.size / 1024).toFixed(0) + ' KB MP3，点上面下载。'
    try { await ffmpeg.deleteFile(inName); await ffmpeg.deleteFile('out.mp3') } catch { /* 清理失败不影响结果 */ }
  } catch (e) {
    $('audiotool-status').textContent = '提取失败：' + (e && e.message ? e.message : '处理核心加载失败，请检查网络后重试')
  } finally {
    btn.disabled = false
  }
}
