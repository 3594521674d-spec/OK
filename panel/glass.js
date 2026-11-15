// ── 液态玻璃（iOS 26 Liquid Glass）──
// 做法来源：axot/agent-skills liquid-glass SKILL.md + kartie/liquid-glass-react +
// LogRocket/dev.to 的网页端液态玻璃文章。index.html 与 login.html 共用这一个文件。
//
// 原理：SVG feDisplacementMap 用一张超椭圆（squircle，n=4）SDF 位移图把玻璃后面的
// 画面“折”一下，边缘弯得厉害、中间平坦，就是 iOS 26 那个透镜感。位移图由下面
// buildLensMap() 在 canvas 上逐像素算出来，写进 #lensMap。
//
// 兼容：backdrop-filter: url(#lg-lens) 只有 Chromium（Chrome/Edge 桌面版）支持真折射。
// Safari/Firefox 会把整条声明丢掉，所以样式里先写一遍纯 blur() 再写 url() 版，
// 丢了 url() 的那一版仍有毛玻璃。Safari 的 CSS.supports('backdrop-filter','url(#x)')
// 会误报 true，所以这里用 UA 判断（CriOS/FxiOS 是 iOS 上的 WebKit 壳，不算 Chromium），
// 只有 Chromium 才给 <html> 加 lg-lens 类，样式只在 .lg-lens 下才开 url() 透镜。
// iPhone 上看到的就是：毛玻璃 + 色散边缘 + 高光 + 极光背景，依然是液态玻璃的味儿。
(function () {
  'use strict'

  // 生成透镜位移图：255px 的 squircle SDF，四周留 20% 中性灰边距
  // （位移图边缘若采到透明黑，feDisplacementMap 会在玻璃边缘抹出黑边）。
  function buildLensMap() {
    try {
      var SZ = 255
      var PAD = Math.round(SZ * 0.2)
      var S = SZ + PAD * 2
      var c = document.createElement('canvas')
      c.width = c.height = S
      var ctx = c.getContext('2d')
      var im = ctx.createImageData(S, S)
      var d = im.data
      var x, y, i
      // 底色：中性灰 128（= 不位移），透明度全满
      for (y = 0; y < S; y++) for (x = 0; x < S; x++) {
        i = (y * S + x) * 4
        d[i] = 128; d[i + 1] = 128; d[i + 2] = 128; d[i + 3] = 255
      }
      for (y = 0; y < SZ; y++) for (x = 0; x < SZ; x++) {
        i = ((y + PAD) * S + (x + PAD)) * 4
        var nx = x / (SZ - 1) * 2 - 1
        var ny = y / (SZ - 1) * 2 - 1
        var r = Math.pow(Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4), 0.25)
        var t = Math.min(r, 1)
        var e = Math.pow(t, 5) // 边缘衰减指数 5：中间平坦、边缘陡峭
        d[i] = 128 + nx * e * 127
        d[i + 1] = 128 + ny * e * 127
        d[i + 2] = 128; d[i + 3] = 255
      }
      ctx.putImageData(im, 0, 0)
      var url = c.toDataURL()
      var fe = document.getElementById('lensMap')
      if (fe) {
        fe.setAttribute('href', url)
        fe.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url)
      }
    } catch (err) { /* 位移图失败不影响毛玻璃兜底 */ }
  }

  function supportsLens() {
    var ua = navigator.userAgent || ''
    // Chrome/Chromium/Edge 桌面版；CriOS（iOS 版 Chrome）和 FxiOS 仍是 WebKit，不支持 url() 透镜
    return (/Chrome\/|Chromium\/|Edg\//.test(ua)) && !/CriOS\/|FxiOS\//.test(ua)
  }

  // 指针光晕：导航栏 / 底部栏里预先画好的一个金色光盘，只用 transform 移动（零重绘），仅鼠标指针
  function initGlow() {
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return
    var hosts = document.querySelectorAll('header.appbar, nav#nav')
    var raf = 0
    hosts.forEach(function (host) {
      var glow = host.querySelector('.glass-glow')
      if (!glow) return
      host.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return
        var r = host.getBoundingClientRect()
        var gx = e.clientX - r.left - 160
        var gy = e.clientY - r.top - 160
        if (raf) return
        raf = requestAnimationFrame(function () {
          raf = 0
          glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)'
          glow.style.opacity = '1'
        })
      })
      host.addEventListener('pointerleave', function () { glow.style.opacity = '0' })
    })
  }

  buildLensMap()
  if (supportsLens()) document.documentElement.classList.add('lg-lens')
  initGlow()
})()
