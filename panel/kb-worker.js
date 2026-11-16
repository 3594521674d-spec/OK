// kb-worker.js — 知识库档 1：向量模型跑在 Web Worker 里，不卡主线程。
//
// 模型：Xenova/bge-small-zh-v1.5（Transformers.js v4，Hugging Face 官方，
// CDN：https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2/dist/transformers.min.js）
// 中文专用，384 维；dtype q8 走 model_quantized.onnx，首次下载约 25MB，
// 之后走浏览器 Cache Storage（transformers.js 默认 useBrowserCache）。
// 中文不要用 all-MiniLM-L6-v2（英文模型，中文检索差）。
//
// 协议（postMessage）：
//   主线程 → { type: 'init' }              // 开始加载模型（只加载一次）
//   主线程 → { type: 'embed', id, texts }  // 嵌一批文本
//   Worker → { type: 'progress', file, progress, loaded, total }  // 下载进度
//   Worker → { type: 'ready' }             // 模型就绪
//   Worker → { type: 'embedded', id, vectors } // vectors: number[][]，已 mean pooling + 归一化
//   Worker → { type: 'error', id?, error } // 加载/推理失败
//
// 注意：这是 ES module worker（new Worker('kb-worker.js', { type: 'module' })），
// 直接 import CDN 上的 ESM 构建；jsdelivr 带 CORS 头，模块 worker 可用。

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2/dist/transformers.min.js'

env.allowLocalModels = false

const MODEL_ID = 'Xenova/bge-small-zh-v1.5'

let extractor = null
let loadingPromise = null

function loadModel() {
  if (extractor) return Promise.resolve(extractor)
  if (!loadingPromise) {
    loadingPromise = pipeline('feature-extraction', MODEL_ID, {
      dtype: 'q8',
      progress_callback: (p) => {
        // p: { status, file, progress, loaded, total }
        try {
          self.postMessage({
            type: 'progress',
            file: p && p.file ? String(p.file) : '',
            progress: p && typeof p.progress === 'number' ? p.progress : 0,
            loaded: p && typeof p.loaded === 'number' ? p.loaded : 0,
            total: p && typeof p.total === 'number' ? p.total : 0,
          })
        } catch { /* 忽略 */ }
      },
    }).then((ext) => {
      extractor = ext
      return ext
    }).catch((e) => {
      loadingPromise = null
      throw e
    })
  }
  return loadingPromise
}

self.onmessage = async (ev) => {
  const msg = ev && ev.data
  if (!msg || typeof msg !== 'object') return
  if (msg.type === 'init') {
    try {
      await loadModel()
      self.postMessage({ type: 'ready' })
    } catch (e) {
      self.postMessage({ type: 'error', error: e && e.message ? String(e.message) : String(e) })
    }
    return
  }
  if (msg.type === 'embed') {
    const id = msg.id
    const texts = Array.isArray(msg.texts) ? msg.texts : []
    try {
      const ext = await loadModel()
      // pooling mean + normalize：余弦相似度直接点积即可。
      const out = await ext(texts, { pooling: 'mean', normalize: true })
      const vectors = out.tolist()
      self.postMessage({ type: 'embedded', id, vectors })
    } catch (e) {
      self.postMessage({ type: 'error', id, error: e && e.message ? String(e.message) : String(e) })
    }
    return
  }
}
