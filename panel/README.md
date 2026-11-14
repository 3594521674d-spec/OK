# page 算力池面板（GitHub Pages 版）

WorkBuddy 网关管理面板的静态版，托管在 GitHub Pages 上。
面板本身不含任何密钥：打开后输入网关 API Key（存在浏览器 localStorage），
再调用阿里云 FC 网关的接口。接口地址写在 app.js / login.js 顶部的 API_BASE。

与网关自带面板同一份源码，只改了接口地址与相对路径；网关升级时同步更新这里。
