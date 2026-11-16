# 编导技能·开源对照·waoowaoo

- 星数：14,867（GitHub API 核实，2026-11-17）
- 地址：https://github.com/waooAI/waoowaoo
- 协议：Elastic License 2.0（source-available，非 OSI 开源；v0.5.0-beta.1 起，README 标注）

## 它是干什么的

工业级全流程 AI 影视生产平台，按好莱坞制片思路搭的。技术栈 Next.js 16 + MySQL/Prisma + Temporal + Redis + MinIO；右侧 Assistant + 画布；模型感知宽高比/时长/分辨率/参考角色；首帧/首尾帧/参考图模式；OpenRouter 配置（GPT Image 2、Nano Banana、Seedance、MiniMax H3/H3 Max）。还是预览版，无音乐/配音控制。

## 编导环节具体怎么写

来源文件：`standards/capabilities/image-video.catalog.json`、`docs/architecture/modules/ai-prompt-output-contract.md`、`docs/architecture/modules/asset-scope-ownership.md`、`README.md`。

### 模型能力目录（image-video.catalog.json，889 行）
- 每个模型一条记录：modelType（image/video）、provider、modelId，再加 capabilities：分辨率选项、质量选项、视频生成模式（normal / firstlastframe）、是否支持音频、是否支持视频输入、时长选项、首尾帧支持。
- 例如豆包 Seedance 2.0：时长 4–15 秒，720p/480p，支持首尾帧、支持音频、支持视频输入。时长、分辨率、模式这些能力是**按模型查表**得来的，不是写在提示词里许愿的。
- 提示词和生成参数分权：Agent 只写创作提示词和叙事参数；系统配置拥有各媒体类别的唯一模型选择，模型身份不是工具输入；画幅、资产格式、能力校验、计费、审批由系统负责。未配置有效模型时不提供该类生成工具，不得猜测或提交可执行项。

### Agent 指令与输出契约（ai-prompt-output-contract.md）
- 不变量 APO-01–APO-11，核心几条：
  - **APO-05 专业输出是一个 typed 对象**：每个专业结果恰好一个 outputKind 和 strict schema；响应、显式保存与媒体提交必须使用同一个对象，不从 Skill 散文、历史消息或临时文件猜字段。
  - **APO-06 业务输入冻结**：提交只接受 ready Resource 的 id + 内容版本，服务端验证所有权并冻结当时路径与内容摘要，再把完整提示词、参数与引用冻结到任务 payload。
  - **APO-07 参数分权**：主 Agent 拥有完整创作提示词与叙事参数；系统拥有模型选择、画幅、计费、审批。画布中用户明确选择的生成要求由已准入 Turn 的持久上下文拥有，工具参数不得改写；付费前比对实际执行参数。
  - **APO-08 缺能力显式失败**：缺 Skill、无效生成批次、未知关键事件、缺能力或版本不兼容必须原地失败；禁止 fallback 到另一个 Agent、服务端提示词编译或第二套 schema。
  - **APO-10 不用提示词伪造媒体能力边界**：能力只读取系统注入的声明式 View；Provider 拒绝只通过统一 typed failure 返回，不得再投影成常驻 Agent 政策。
- 踩过的坑（写进文档的教训）：一份“真人视觉安全政策”曾作为唯一正文注入主 Agent，用来规避当时视频模型的输入限制，结果把已过期的 Provider 能力限制固化成了常驻政策；模型支持后政策文件与注入点一并删除。教训：**能力限制要跟着模型能力走，过期了就删掉，不要写进常驻规则。**

### 资产归属（asset-scope-ownership.md，标题已核实，细则未展开读）
- 资产按归属划分作用域，生成提交只接受已就绪（ready）状态的资产 id。

## 咱们缺什么

1. **模型能力目录**：咱们的锁 A 只写了“Seedance 2.0（豆包 15 秒档）”，没有一张按模型查的表（时长上限、分辨率、首尾帧支持、音频支持）。以后换模型（比如 2.5 的 30 秒）容易凭印象写错参数。
2. **提示词与参数分权**：咱们的提示词里有时会写时长、画幅这些本该由投喂设置决定的东西；waoowaoo 的做法是创作提示词只管画面和叙事，模型、画幅、时长由配置表管，付费前再比对一次。
3. **提交前冻结**：咱们的投喂稿没有“冻结”概念，改了提示词、换了参考图顺序，旧的生成结果还摆在那，容易拿旧图当新结果。waoowaoo 是提交时把提示词、参数、引用全部冻结进任务，改了就得重新提交。
4. **过期限制要删**：咱们的规则里有些限制可能是某个模型当时的短板（比如某模型不支持首尾帧），模型升级后要记得删掉，不要固化成常驻规则。

## 采纳建议

- P1 直接采纳：给锁 A 配一张小表，Seedance 2.0 一行：15 秒上限、16:9、720p、支持首尾帧续接、不支持首尾帧原生模式；以后加模型就加一行。
- P2、P3 轻量采纳：投喂稿末尾加一行“冻结清单”（提示词版本 + 参考图顺序 + 模型 + 时长），改了任何一项就标新版本；不搭它那套服务端冻结系统。
- P4 记成一条总则：每换一次模型，先核对旧限制还成不成立。
- 不采纳：整套平台架构（Next.js + Temporal + Redis + MinIO + Prisma）、Assistant + 画布、OpenRouter 配置、Elastic License 下的代码。
