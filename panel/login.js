// GitHub Pages 版面板：静态文件，接口指向阿里云 FC 网关。
// 与网关自带面板同一份源码，只改了接口地址与相对路径；密钥存在本源 localStorage，不进仓库。
const API_BASE = 'https://free-ll-gateway-ilghvenboz.cn-hangzhou.fcapp.run';
/*
 * 独立登录页。
 *
 * ## 为什么要单独一页（而不是把密钥框放面板顶部）
 *
 * 面板顶部塞一个密钥输入框有两个问题：
 * 1. **不好看**：管理界面常驻一个密码框，像是没做完；
 * 2. **职责混淆**：面板是「已登录后的工作台」，登录是入口。
 *
 * 这里做成独立页，验证通过才跳转到面板；未登录访问面板会被重定向回来。
 */
'use strict'

const $ = (id) => document.getElementById(id)

function setMsg(text, ok) {
  const el = $('login-msg')
  el.textContent = text
  el.className = 'login-msg ' + (ok ? 'ok' : 'err')
}

/**
 * 验证密钥：调一个需要鉴权的轻量端点。
 *
 * ⚠️ 返回三态而不是布尔值。
 *
 * 原先返回 `res.ok`，于是**网络错误与「密钥无效」被归为同一种结果** ——
 * 一次 DNS 抖动会让用户看到「密钥无效，请检查后重试」，然后去反复改一个
 * 本来完全正确的密钥（实测踩到：面板侧同一类缺陷会把已存密钥删掉）。
 */
async function verify(key) {
  let res
  try {
    res = await fetch(API_BASE + '/admin/pool?realm=cn', {
      headers: { authorization: 'Bearer ' + key },
    })
  } catch {
    return 'network'
  }
  if (res.ok) return 'ok'
  // ⚠️ 只有 401/403 才是「密钥不对」；5xx 是**服务端**的问题，
  // 把它们混为一谈会让用户白改密钥。
  return res.status === 401 || res.status === 403 ? 'bad' : 'error'
}

$('login-form').onsubmit = async (e) => {
  e.preventDefault()
  const key = $('apikey').value.trim()
  if (key === '') { setMsg('请输入密钥', false); return }

  const btn = $('login-btn')
  btn.disabled = true
  setMsg('验证中…', true)

  const verdict = await verify(key)
  btn.disabled = false

  // ⚠️ 必须**分开**报告：把网络/服务端错误说成「密钥无效」会让用户
  // 去改一个完全正确的密钥（实测踩到过这一类误报）。
  if (verdict === 'network') {
    setMsg('网络错误：连不上服务，请检查网络后重试', false)
    return
  }
  if (verdict === 'error') {
    setMsg('服务暂时不可用，请稍后重试（密钥未被判错）', false)
    return
  }
  if (verdict === 'bad') {
    setMsg('密钥无效，请检查后重试', false)
    return
  }
  localStorage.setItem('wb_api_key', key)
  setMsg('验证通过，正在进入…', true)
  location.href = 'index.html'
}

// 已存密钥时先自动验一次（免去每次手输）
const saved = localStorage.getItem('wb_api_key') || ''
if (saved !== '') {
  $('apikey').value = saved
  void verify(saved).then((verdict) => {
    // ⚠️ 只在**确认有效**时才自动进入。
    // 网络错误/服务端错误时**什么都不做** —— 既不能进面板（无法确认），
    // 也不能删密钥（那会把一次网络抖动变成「被登出」）。
    if (verdict === 'ok') { setMsg('已保存的密钥有效，正在进入…', true); location.href = 'index.html' }
  })
}
