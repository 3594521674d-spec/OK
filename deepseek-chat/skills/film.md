# AI电影漫剧技能包

来源库：lemomo-ai/lemo-opuscar（20226 星，HEAD 8ca0dd80，2026-11-23，协议未声明）、OpenMontageInc/OpenMontage（82654 星，HEAD 2e003e65，2026-11-16，AGPL-3.0）、Vincentwei1021/video-shotcraft（22260 星，HEAD 59f3e9b9，2026-11-21，Apache-2.0）、JuneYaooo/rea-video（12586 星，HEAD c7162340，2026-11-23，Apache-2.0）、alchaincyf/huashu-motion（3078 星，HEAD f4f38bfe，2026-11-23，MIT）。查时 2026-11-24。
提炼范围：读了 107 个文档文件约 1.3M，只读文档，不读代码，不运行仓库代码。
最终能力 128 条，分 6 个方向。每条能力配一条原文引用，引用为原文逐字连续子串，不超过 50 字。

## 能力索引

- 代码成片导演：am.01 至 am.24，共 24 条
- 代码成片建造技术：am.25 至 am.38，共 14 条
- 多流水线制片治理：am.39 至 am.60，共 22 条
- 分镜配方卡与卡点剪辑：am.61 至 am.84，共 24 条
- 视频逆向拆解与复刻：am.85 至 am.108，共 24 条
- 商业宣传片作曲与声音：am.109 至 am.128，共 20 条

## 代码成片导演

### am.01 默认规格

来源：lemo-opuscar/DIRECTOR.md 第 14 行
能力：默认按 30 秒到 60 秒、1920×1080、24fps 出片，响度约负 14 LUFS，竖版用 1080×1920，别的尺寸用渲染工具的尺寸参数指定。
引用：“1920×1080 at 24 fps by default”

### am.02 先找基准作品

来源：lemo-opuscar/DIRECTOR.md 第 29 行
能力：动笔前先挑一到两个基准作品，可以是电影、片头、游戏或广告，定下本片在该风格与该题材下的标杆，不要借演示片的基准。
引用：“pick one or two reference works”

### am.03 基准提质胜过一切规则

来源：lemo-opuscar/DIRECTOR.md 第 34 行
能力：基准对成片质量的提升超过下面任何一条规则，写清从基准学什么、不学什么，再开始写方案。
引用：“The benchmark lifts quality more than any rule below”

### am.04 一主体一目标一转折

来源：lemo-opuscar/DIRECTOR.md 第 38 行
能力：一个角色或一个物件、产品、想法，想要一样东西，中间发生改变，结尾与开头不同，一句话讲清这条线再展开。
引用：“One subject, one goal, one turn”

### am.05 前 3 秒钩子

来源：lemo-opuscar/DIRECTOR.md 第 39 行
能力：前 3 秒就要有钩子，不要在任何事发生之前先放慢速的 logo 揭示。
引用：“Hook in the first 3 seconds”

### am.06 一个本土动作放情感峰值

来源：lemo-opuscar/DIRECTOR.md 第 41 行
能力：挑一个只有该媒介能做的动作，如折页变成转场、墨晕扩散成下一场、字格收进 logo，放在情感峰值处，风格文件里有该媒介的本土动作清单。
引用：“One native move”

### am.07 先写方案再动笔

来源：lemo-opuscar/DIRECTOR.md 第 46 行
能力：画任何东西之前先写 TREATMENT.md，写完方案再看演示片的说明与演示代码，纪录片与剪辑风格先收材料再写方案。
引用：“Write `TREATMENT.md` before drawing anything”

### am.08 分镜表写清为什么这样拍

来源：lemo-opuscar/DIRECTOR.md 第 51 行
能力：分镜表里每个镜头都要写景别、角度、运镜、时长，以及为什么这样拍，运镜可选推、拉、摇、跟、升、变焦。
引用：“for every shot, the framing”

### am.09 先写 cue 图再动画

来源：lemo-opuscar/DIRECTOR.md 第 78 行
能力：先写 cue 图再开始做动画，画面锁到音乐网格上，脚本会核对每一个 cue 是否落点正确。
引用：“Write the cue map before animating”

### am.10 cue 图的内容

来源：lemo-opuscar/DIRECTOR.md 第 53 行
能力：cue 图里写速度、小节网格、每段配器，以及每个切点、关键动作与字幕落在哪个拍子上。
引用：“tempo, bar grid, instrumentation per section”

### am.11 字幕至少 hold 1.8 秒

来源：lemo-opuscar/DIRECTOR.md 第 82 行
能力：每句字幕至少停留 1.8 秒，并且不短于 spoken line 加 0.6 秒，短句也不能一闪而过。
引用：“Hold every subtitle at least 1.8 s”

### am.12 文字动画完的 hold 公式

来源：lemo-opuscar/DIRECTOR.md 第 83 行
能力：文字动画完成后按公式停留，英文约字母数除以 15 加 1.5 秒，中文约字符数除以 4.5 加 1.5 秒，有检查脚本代为核对。
引用：“(characters ÷ 4.5 + 1.5) s in Chinese”

### am.13 至少两次真实静默

来源：lemo-opuscar/DIRECTOR.md 第 72 行
能力：全片至少有两次真实静默或近静默，放在转折或情感峰值之前，静默后第一个声音要是全片最重要的声音之一。
引用：“At least two real silences”

### am.14 至少两次用声音做转场

来源：lemo-opuscar/DIRECTOR.md 第 73 行
能力：至少两次用声音做转场，下个场景的声音提前进来做 J-cut，或上个场景的声音拖过切点做 L-cut。
引用：“Use sound as a transition”

### am.15 至少四种运镜加真实景别变化

来源：lemo-opuscar/DIRECTOR.md 第 90 行
能力：全片至少用四种不同运镜，并且景别要有真实变化，二维片也有相机，可以推、拉、视差、变焦、画中画。
引用：“four different camera moves”

### am.16 一个招牌镜头

来源：lemo-opuscar/DIRECTOR.md 第 91 行
能力：全片要有一个让人记住的招牌镜头，如一个长镜头、一个尺度揭示、一个用媒介本身做的转场。
引用：“One signature shot”

### am.17 转场用媒介内部设计

来源：lemo-opuscar/DIRECTOR.md 第 92 行
能力：转场要在媒介内部设计，如翻页、刻线生长、墨晕扩散，形成一套统一语法，不用默认淡入淡出与硬切。
引用：“Design transitions inside the medium”

### am.18 表演三段加表情变化

来源：lemo-opuscar/DIRECTOR.md 第 97 行
能力：每个有意义的动作都要有预备、动作、跟进三段，角色要有表情变化，不要只在画面上滑动。
引用：“Anticipation, action, follow-through”

### am.19 姿势用关键帧加缓动混合

来源：lemo-opuscar/DIRECTOR.md 第 99 行
能力：姿势变化用关键帧加缓动混合，绝不在 if 里直接切换姿势，唯一的例外是有意的一帧漫画 pop。
引用：“never switch poses inside an `if`”

### am.20 关键动作按 0.2 秒间隔放大检查

来源：lemo-opuscar/DIRECTOR.md 第 102 行
能力：关键动作按 0.2 秒间隔逐步放大检查，逐帧看姿势与衔接有没有穿帮。
引用：“Step through key actions at 0.2 s intervals, enlarged”

### am.21 评审循环

来源：lemo-opuscar/DIRECTOR.md 第 116 行
能力：交付前跑评审循环：联络表、关键动作 0.2 秒条带、全速带声看一遍，发现的问题集中在一轮里修完再复查。
引用：“Run the review loop”

### am.22 不是演示片重拍

来源：lemo-opuscar/DIRECTOR.md 第 118 行
能力：结构、开场、招牌镜头、运镜路径、配乐形状、结尾六项里至少四项要与演示片不同，相同的要重新想，交付前把联络表与演示片海报并排放做最后一查。
引用：“At least four of the six must differ”

### am.23 改风格每轮最多五处

来源：lemo-opuscar/MY-STYLES.md 第 82 行
能力：改一个现成风格时每轮最多改五处，改多了不好判断，影片语言强迫的改动，如原风格没有中文字体，不计入五处。
引用：“Up to five changes”

### am.24 改库风格要左右并排对照

来源：lemo-opuscar/MY-STYLES.md 第 103 行
能力：改现成风格时用原版设置重渲同一帧，原版在左、新版在右并排对照，只让改动处不同，风格帧要拿给用户看并等确认。
引用：“put the two side by side, base on the left”

## 代码成片建造技术

### am.25 时间线是唯一事实源

来源：lemo-opuscar/TECHNIQUE.md 第 6 行
能力：一份时间线驱动画面、配乐、混音、字幕与检查，时间线就是唯一事实源，别的产物都从它派生。
引用：“timeline (single source of truth)”

### am.26 画面是时间的函数

来源：lemo-opuscar/TECHNIQUE.md 第 41 行
能力：用 window.render(t) 确定性绘制第 t 秒的帧，禁 Date.now、无种子随机与跨帧状态，同一时间永远渲出同一帧。
引用：“draw the frame at time t, deterministic”

### am.27 一份 timeline.js 管全部

来源：lemo-opuscar/TECHNIQUE.md 第 88 行
能力：段落、速度、节拍与 hit 点都放在一份 timeline.js 里，导出 JSON 后配乐、混音、字幕与检查都读同一组数字。
引用：“Keep sections, tempo, beats and hit points in one file”

### am.28 Canvas 2D 为主，三维与后期另有分工

来源：lemo-opuscar/TECHNIQUE.md 第 68 行
能力：多数二维风格用 Canvas 2D，三维用 three.js，后期用 WebGL2 着色器做胶片损伤、CRT、墨水重绘等效果。
引用：“Canvas 2D for most 2D styles”

### am.29 隔帧动画加平滑相机

来源：lemo-opuscar/TECHNIQUE.md 第 69 行
能力：风格要求时按 12fps 步进做隔帧动画，如定格、像素、赛璐璐质感，但相机与光要每帧平滑，步进的相机会读作卡顿。
引用：“Animate on twos where the style wants it”

### am.30 配音默认双引擎

来源：lemo-opuscar/TECHNIQUE.md 第 24 行
能力：英文配音默认离线 Kokoro，中文配音默认在线 edge-tts，配音核对用 faster-whisper，三者是同一套配音依赖。
引用：“Kokoro + model (English, offline), edge-tts (Chinese, online)”

### am.31 中文配音用微软神经声音

来源：lemo-opuscar/TECHNIQUE.md 第 101 行
能力：中文配音用 edge-tts 的微软神经声音，如 zh-CN-XiaoxiaoNeural 与 zh-CN-YunxiNeural，每句出一个 WAV 加时长文件并去掉首尾静音。
引用：“zh-CN-XiaoxiaoNeural”

### am.32 每句配音都要回听核对

来源：lemo-opuscar/TECHNIQUE.md 第 103 行
能力：每句配音用 faster-whisper 转写后与脚本逐字比对，数字按值比对，其余逐字比对，不过就重生成，直到检查退出 0。
引用：“transcribes each WAV with faster-whisper”

### am.33 配乐用真实乐器采样

来源：lemo-opuscar/TECHNIQUE.md 第 110 行
能力：配乐用 sampler.py 演奏免费采样库里的真实乐器，如 VSCO 2 CE、VCSL、FreePats、Karoryfer、Salamander，写成时间、乐器、音高、时长、力度、声像的事件。
引用：“plays real instruments from free libraries”

### am.34 拨弦用物理建模

来源：lemo-opuscar/TECHNIQUE.md 第 111 行
能力：古筝、琵琶、三味线、班卓等拨弦与民乐弦乐用 pluck.py 做物理建模，支持弯音与颤音，不用采样凑数。
引用：“physical modelling (Karplus–Strong) with bends and vibrato”

### am.35 拟音程序化合成由 EV 驱动

来源：lemo-opuscar/TECHNIQUE.md 第 117 行
能力：拟音用 sfx.py 程序化合成，如点击、呼啸、闷响、叮声、纸声、噪声床，由 window.EV 驱动，让每个声音精确落在自己的帧上。
引用：“Drive it from `window.EV`”

### am.36 混音两遍 loudnorm 到负 14 LUFS

来源：lemo-opuscar/TECHNIQUE.md 第 118 行
能力：混音用 mux.sh 跑两遍 loudnorm 到负 14 LUFS 并做真峰值限制，ffmpeg 加颗粒，测到的响度会打印出来，任何一步失败就非零退出。
引用：“runs a two-pass loudnorm to”

### am.37 三维用 three.js r170 加两倍渲染下采样

来源：lemo-opuscar/TECHNIQUE.md 第 135 行
能力：三维用 three.js r170 走 WebGL2 在 GPU 上离线渲染，物理景深与 GTAO 走后期脚本，2 倍渲染再下采样保锐度。
引用：“rendered at 2× and downsampled”

### am.38 只用 CC0、CC BY、OFL 素材并写进 CREDITS

来源：lemo-opuscar/TECHNIQUE.md 第 147 行
能力：只用 CC0、CC BY 或 OFL 的第三方素材，每项都列进影片的 CREDITS，写清来源与协议，生成器出的图也要写清工具、模型与提示词存放处。
引用：“Only CC0, CC BY or OFL material”

## 多流水线制片治理

### am.39 agent 优先，Python 只做工具与持久化

来源：OpenMontage/AGENT_GUIDE.md 第 80 行
能力：agent 读流水线清单与阶段导演 skill 后调工具、自查、评审、写 checkpoint，Python 只做工具与持久化，不放编排、评审与检查点逻辑。
引用：“Python = tools + persistence”

### am.40 七段标准流程

来源：OpenMontage/AGENT_GUIDE.md 第 185 行
能力：每条流水线都走调研、提案、编剧、场景规划、资产、剪辑、合成七段，顺序固定，不跳段。
引用：“research -> proposal -> script -> scene_plan -> assets -> edit -> compose”

### am.41 每阶段产出规范 JSON 产物

来源：OpenMontage/AGENT_GUIDE.md 第 209 行
能力：每阶段产出一个规范产物，如调研简报、剧本、场景规划、资产清单、剪辑决定、渲染报告，产物按 JSON Schema 校验，存在项目目录的 artifacts 下。
引用：“JSON artifacts from each stage”

### am.42 禁写临时脚本直调工具

来源：OpenMontage/AGENT_GUIDE.md 第 62 行
能力：所有制片请求必须走流水线，禁止写临时 Python 脚本直接调用工具，禁止跳过流水线直接调 API。
引用：“Write ad-hoc Python scripts to call tools directly”

### am.43 禁绕过预检、检查点与评审

来源：OpenMontage/AGENT_GUIDE.md 第 66 行
能力：禁止绕过预检、检查点或评审，禁止不读阶段导演 skill 就生成资产，禁止不查工具 skill 就用工具。
引用：“Bypass preflight, checkpoints, or review”

### am.44 预检先跑 provider_menu_summary

来源：OpenMontage/AGENT_GUIDE.md 第 267 行
能力：开工前先跑预检，用 provider_menu_summary 先看能力汇总，不要把 support_envelope 的原始大 JSON 贴进对话，那会把用户埋掉。
引用：“Use `provider_menu_summary()` first”

### am.45 预检结果要以能力菜单呈现

来源：OpenMontage/AGENT_GUIDE.md 第 311 行
能力：预检结果要以能力菜单呈现给用户，按能力家族写清已配置几项、能解锁什么，不是平铺的工具清单。
引用：“present it to the user as a capability menu”

### am.46 决策日志只追加不改旧条

来源：OpenMontage/AGENT_GUIDE.md 第 119 行
能力：decision_log 是只追加的历史，不是草稿纸，决定改了就追加一条新记录，绝不静默改旧条。
引用：“append-only history, not a scratchpad”

### am.47 改决定要把被取代的选项写进记录

来源：OpenMontage/AGENT_GUIDE.md 第 119 行
能力：决定改了要复用同一 category 与同一 subject 追加新条，把被取代的选项放进 options_considered，并写清被否原因。
引用：“with the superseded option moved into `options_considered`”

### am.48 双运行时可用时必须双摆给用户

来源：OpenMontage/AGENT_GUIDE.md 第 125 行
能力：Remotion 与 HyperFrames 同时可用时，提案阶段必须把两个都摆给用户，各写一句本简报下最擅长什么、一句诚实取舍、再给推荐，等明确批准后才锁定。
引用：“MUST present both options to the user”

### am.49 只一个运行时可用时要明说

来源：OpenMontage/AGENT_GUIDE.md 第 135 行
能力：只一个合成运行时可用时要明确告诉用户，不可用的那个仍要记进决策记录，写清不可用的原因。
引用：“MUST say so explicitly”

### am.50 模板化与手作是独立决定

来源：OpenMontage/AGENT_GUIDE.md 第 141 行
能力：模板化与手作是与运行时正交的独立决定，要单独提案并记进决策日志，hero 作品默认手作，只复用引擎知识、不复用创意组件。
引用：“authoring mode”

### am.51 批准按门计

来源：OpenMontage/AGENT_GUIDE.md 第 600 行
能力：批准按门计，早期的放行不覆盖后面的门，显式全程预授权必须记为决策日志里的 approval_policy 条目才算数。
引用：“Approval is per-gate”

### am.52 全程预授权必须记进决策日志

来源：OpenMontage/AGENT_GUIDE.md 第 600 行
能力：用户说全程不用再问时，要把这句话记为 decision_log 里 category 为 approval_policy 的条目，否则不算授权。
引用：“must be recorded as a `decision_log` entry”

### am.53 典型设门阶段

来源：OpenMontage/AGENT_GUIDE.md 第 598 行
能力：典型设门的阶段是提案、剧本、场景规划、资产与发布，资产门要在合成锁定前逐场景看 Backlot 板的 filmstrip 再锁。
引用：“Typical gated stages”

### am.54 音乐计划强制在提案时做

来源：OpenMontage/AGENT_GUIDE.md 第 543 行
能力：音乐计划强制在提案时做，先查用户音乐库，再查免版税搜索，再查音乐生成 API，再说可自带，无音乐来源要明说，不留到资产阶段才爆。
引用：“inspect `music_library/`”

### am.55 用户音乐库在 music_library 目录

来源：OpenMontage/AGENT_GUIDE.md 第 233 行
能力：用户可以把免版税音乐放进 music_library 目录，资产导演先查这个目录，再回落到 API 生成音乐。
引用：“Users can place royalty-free music tracks in `music_library/`”

### am.56 渲染运行时三选一，提案锁定

来源：OpenMontage/AGENT_GUIDE.md 第 378 行
能力：合成运行时三选一：Remotion、HyperFrames、FFmpeg，三者平行不分高下，选择在提案时定并锁定在剪辑决定里，之后不再换。
引用：“three render engines / runtimes”

### am.57 静默换运行时被禁

来源：OpenMontage/AGENT_GUIDE.md 第 414 行
能力：锁定的运行时不可用时禁止静默换成另一个，要按阻塞上报结构呈报，等用户批准并记决策后再走。
引用：“Silent runtime swap is forbidden”

### am.58 零密钥路径也能出片

来源：OpenMontage/PROMPT_GALLERY.md 第 129 行
能力：零 API 密钥也能做片，走免费现成素材纪录片、数据解说等路线，用免费 TTS、现成素材与 Remotion 合成，成本约 0 美元。
引用：“zero-key, ~$0”

### am.59 提示词先优化再套命名视觉风格

来源：OpenMontage/.agents/skills/create-video/references/visual-styles.md 第 3 行
能力：视频 agent 提示词先经 prompt-optimizer 优化，再套 20 种命名视觉风格之一，每种风格都有设计师参照、配色、字体、运动与转场。
引用：“20 named visual styles for Video Agent prompts”

### am.60 命名风格五件套格式

来源：OpenMontage/.agents/skills/create-video/references/visual-styles.md 第 14 行
能力：命名风格的写法固定为命名风格加设计师参照加配色加字体加运动规则加转场，先按情绪选再按内容选，也可组合自创。
引用：“named style + designer reference + color palette + typography + motion rules + transitions”

## 分镜配方卡与卡点剪辑

### am.61 模板路线不进流水线

来源：video-shotcraft/references/pipeline.md 第 21 行
能力：直接用 Ink Press 模板时不进入自由创作流水线，按模板说明的原有结构替换产品截图、文案与品牌即可。
引用：“直接使用 Ink Press 模板不进入本流水线”

### am.62 共同创作不要从头重跑

来源：video-shotcraft/references/pipeline.md 第 24 行
能力：共同创作从引导文件进入流水线时不要从头重跑，已确认的简报、需求、视觉方向与镜头映射直接沿用，从阶段 4 继续。
引用：“共同创作从 `guided-free-creation.md` 进入本文件时，不要从头重跑”

### am.63 PageCam 是真实页面镜头的地基

来源：video-shotcraft/references/pipeline.md 第 220 行
能力：真实页面镜头以 PageCam 为地基，整页纹理加关键帧 2.5D 相机加页面元素抠图，复刻既有页面必须用真实截图。
引用：“PageCam 是一切”

### am.64 确定性渲染铁律

来源：video-shotcraft/references/pipeline.md 第 232 行
能力：确定性渲染铁律禁 Date.now、Math.random 与无参 new Date，一切伪随机用固定种子，保证同一时间线每次渲出同一帧。
引用：“确定性渲染铁律”

### am.65 伪随机用固定种子

来源：video-shotcraft/references/pipeline.md 第 233 行
能力：一切伪随机用固定种子，如 mulberry32 或哈希函数，种子从索引派生，不用无参随机。
引用：“一切伪随机用固定种子”

### am.66 素材采集复制 capture-template

来源：video-shotcraft/references/pipeline.md 第 177 行
能力：最终素材采集时起本地开发服务器，复制 capture-template.mjs 进项目，改基础地址与选择器，产出全页 2 倍截图、逐元素抠图与坐标表三件套。
引用：“复制 `assets/scripts/capture-template.mjs` 进项目”

### am.67 音乐网格用最小二乘拟合

来源：video-shotcraft/references/music-beat-sync.md 第 39 行
能力：不要用 beat_track 的 tempo 标量，对 beat 序列做最小二乘等距网格拟合，求真实 BPM 与相位，再写时间线。
引用：“对 beat 序列做最小二乘等距网格拟合”

### am.68 网格验收残差不超正负 15 毫秒

来源：video-shotcraft/references/music-beat-sync.md 第 50 行
能力：网格拟合验收残差不超正负 15 毫秒，半帧内，说明曲子是机器鼓点、网格可信，否则不能拿它卡分镜。
引用：“验收标准：残差 ≤ ±15ms”

### am.69 半倍双倍歧义必查

来源：video-shotcraft/references/music-beat-sync.md 第 53 行
能力：beat 检测常在 2 倍与 0.5 倍之间跳，70 BPM 可能报成 140，必须查半倍双倍歧义，以 kick 落在整数拍为准。
引用：“半倍/双倍歧义必查”

### am.70 时间线用拍号写不用帧号写

来源：video-shotcraft/references/music-beat-sync.md 第 143 行
能力：Remotion 项目里把网格常量化，一切镜头边界与动效关键帧用 beatF 表达，镜头时长以拍为单位，换曲只改网格常量。
引用：“一切镜头边界/动效关键帧用 `beatF()` 表达”

### am.71 关键信息落定后必须呼吸

来源：video-shotcraft/references/aesthetic-rules.md 第 23 行
能力：关键信息落定后必须呼吸，品牌字标 hold 满 1 秒，开头结尾两处字标各 hold 满 1 秒。
引用：“关键信息落定后必须呼吸”

### am.72 排时间线先预留 hold 帧预算

来源：video-shotcraft/references/aesthetic-rules.md 第 34 行
能力：开场主体动作一条完整弧线至少 3 秒，排时间线时先预留 hold 与 rest 帧预算，第一版几乎总是偏快，默认放慢一档。
引用：“排时间线时预留 hold/rest 帧预算”

### am.73 音画偏移统一公式

来源：video-shotcraft/references/aesthetic-rules.md 第 148 行
能力：输出音轨相对视频有固定滞后，根因在输出编码链路，不逐条改帧号，统一公式为目标峰值帧减峰值滞后减输出偏移，按渲染管线实测记档。
引用：“统一公式 `from = 目标峰值帧”

### am.74 单主角立传要一条完整动作弧

来源：video-shotcraft/references/promo-energy-arc.md 第 19 行
能力：单主角立传段一个主角加一条完整动作弧至少 3 秒，立出产品的原子单位，是全片质感最高、节奏最慢的一段。
引用：“一条完整动作弧”

### am.75 一种手法全片只当一次主角

来源：video-shotcraft/references/promo-energy-arc.md 第 20 行
能力：功能爬升段每镜绑一个独特功能，一种动画手法全片只当一次主角，重复镜头与信息一律删。
引用：“一种手法只当一次主角”

### am.76 crash-zoom-punch 一拍急推

来源：video-shotcraft/references/shots/camera/crash-zoom-punch.md 第 3 行
能力：crash-zoom-punch 镜头卡是全景一拍急推到目标特写，约 6 帧，落位二选一为过冲回弹或撞停震屏。
引用：“全景一拍急推到目标特写（6f）”

### am.77 crash-zoom 前后 hold 要足

来源：video-shotcraft/references/shots/camera/crash-zoom-punch.md 第 5 行
能力：急推动作 6 到 11 帧，前 hold 至少 30 帧建立全景，后 hold 至少 45 帧读特写，hold 不足冲击感出不来。
引用：“前 hold ≥30f 建立全景、后 hold ≥45f 读特写”

### am.78 急推前先退后冲

来源：video-shotcraft/references/shots/camera/crash-zoom-punch.md 第 25 行
能力：急推前 6 到 8 帧先预备回拉约 3 到 4 个百分点，先退后冲，全景 hold 段给约 2 到 3 个百分点的极缓 creep。
引用：“先退后冲”

### am.79 音效直接从 Freesound 获取

来源：video-shotcraft/references/sfx-sourcing.md 第 3 行
能力：新制作与换音直接从 Freesound 获取音效，不再用共享本地音效库，搜索下载脚本独立实现，不用 Freesound API key。
引用：“新制作与换音直接从 [Freesound](https://freesound.org) 获取 SFX”

### am.80 商用不接受 BY-NC 与未知许可

来源：video-shotcraft/references/sfx-sourcing.md 第 34 行
能力：音效许可默认 CC0，允许 CC BY，商用产品片不接受 BY-NC、Sampling 加或未知许可。
引用：“商用产品片不接受 BY-NC、Sampling+ 或未知许可”

### am.81 每个音效配 audio-manifest

来源：video-shotcraft/references/sfx-sourcing.md 第 52 行
能力：每个音效文件配 audio-manifest.json，写清来源、作者、素材页、许可地址与版本、预览标记、下载时间、SHA-256、修改记录与实际音频分析。
引用：“SHA-256、修改记录与实际音频分析”

### am.82 下载的是 MP3 预览不是原始无损

来源：video-shotcraft/references/sfx-sourcing.md 第 50 行
能力：fs 加编号的 mp3 文件是 Freesound 的高质量有损 MP3 预览，不是上传者的原始 WAV，原音质有明确要求时走素材页登录下载流程取原文件。
引用：“有损 MP3 预览”

### am.83 终检逐项打勾并给帧号证据

来源：video-shotcraft/references/final-review.md 第 113 行
能力：终检按产品目标、功能完整性、视觉方向、镜头卡、分镜一致性、数据安全、音频节奏、视觉技术质量逐项检查，每项给结论与帧号证据。
引用：“产品定位和核心卖点清楚”

### am.84 终检核对镜头卡是否实际出现

来源：video-shotcraft/references/final-review.md 第 53 行
能力：终检要核对功能映射里的镜头卡是否实际出现在对应镜头，用户点名卡名加样式名时要核对 style-key、准确 demo 与 Gallery 参考样片。
引用：“功能映射中的镜头卡是否实际出现在对应镜头”

## 视频逆向拆解与复刻

### am.85 切镜用 HSV 直方图加像素差分

来源：rea-video/docs/decompose.md 第 26 行
能力：切镜检测用 HSV 直方图距离加像素差分，加局部自适应阈值，变化面积要足够大才算切镜。
引用：“HSV 直方图距离与像素差分，加局部自适应阈值”

### am.86 元素弹出不算切镜

来源：rea-video/docs/decompose.md 第 26 行
能力：元素弹出不算切镜，跳剪与推近切看同机位一帧内的跳变，一两帧内亮了又恢复的闪光与火光不算切镜。
引用：“元素弹出不算切镜”

### am.87 静图推拉用 LK 光流拟合相似变换

来源：rea-video/docs/decompose.md 第 28 行
能力：判断一张图在推拉时用 LK 光流拟合相似变换并做 RANSAC，内点率高、残差小、无局部运动，且运动补偿后几乎没有残余。
引用：“LK 光流拟合相似变换（RANSAC）”

### am.88 原始帧率看重复帧规律

来源：rea-video/docs/decompose.md 第 31 行
能力：原始帧率看重复帧规律，24 转 30 时约 20 个百分点，周期 4 到 6 帧，插帧导致的清晰度周期起伏也是证据。
引用：“重复帧规律（24→30 时约 20%，周期 4–6）”

### am.89 生成模型输出 24 或 25fps，手机常拍 60fps

来源：rea-video/docs/decompose.md 第 31 行
能力：生成模型输出 24 或 25fps，手机常拍 60fps，帧率本身只能做中高可信度的旁证，不能单独定性。
引用：“生成模型输出 24/25fps，手机常拍 60fps”

### am.90 元数据看 AIGC 隐式标识与 C2PA

来源：rea-video/docs/decompose.md 第 33 行
能力：元数据看拍摄设备 make 与 model、GB 45438 的 AIGC 隐式标识、C2PA，以及编辑器与渲染器签名，出现时证据很强，但常被平台清除。
引用：“GB 45438 AIGC 隐式标识”

### am.91 十一类制作方式分类

来源：rea-video/skills/rea-video/references/taxonomy.md 第 11 行
能力：每个镜头按制作方式分十一类：实拍、AI 生成视频、数字人口播、3D 渲染、2D 动画、定格动画、影视片段、代码渲染、录屏、静图推拉、静帧定格，叠加层另列。
引用：“code_render | 代码/模板渲染”

### am.92 代码渲染的证据

来源：rea-video/skills/rea-video/references/taxonomy.md 第 11 行
能力：代码渲染的证据是平坦块超 20 个百分点、用色少于 70 色、横竖直边多，背景逐像素冻结、只有局部元素在动，没有材质纹理。
引用：“背景逐像素冻结、只有局部元素在动”

### am.93 静图推拉的证据

来源：rea-video/skills/rea-video/references/taxonomy.md 第 13 行
能力：静图推拉的证据是刚体变换内点率超 95 个百分点、残差小于 0.3 像素、补偿后无残余、无 24fps 帧率痕迹。
引用：“刚体变换内点率 >95%、残差 <0.3px”

### am.94 静帧的证据

来源：rea-video/skills/rea-video/references/taxonomy.md 第 14 行
能力：静帧的证据是 85 个百分点以上的帧逐像素重复，复刻时只要一张图。
引用：“85% 以上帧逐像素重复”

### am.95 定格动画工具测不出只能看图

来源：rea-video/skills/rea-video/references/taxonomy.md 第 16 行
能力：定格动画工具测不出，只能看图：真实材质如黏土、毛毡、纸，动作一顿一顿，帧间轻微闪烁，同一实物光照不变。
引用：“工具测不出，只能看图”

### am.96 剪自影视剧的画面一律是 film_footage

来源：rea-video/skills/rea-video/references/taxonomy.md 第 21 行
能力：剪自已有电影、电视剧、短剧的画面一律是 film_footage，哪怕拍得再像实拍，live_action 只用于视频作者或客户自己拍的画面。
引用：“剪自已有电影、电视剧、短剧的画面一律是 `film_footage`”

### am.97 判 AI 又无标识时标待确认，置信度封顶 0.7

来源：rea-video/docs/decompose.md 第 75 行
能力：判成 AI 视频、又没有 AIGC 标识、看图一方认为是实拍时，标 AI 还是 24p 相机实拍待确认，置信度封顶 0.7。
引用：“置信度封顶 0.7”

### am.98 无明确 AI 破绽不要给高置信度

来源：rea-video/skills/rea-video/references/review.md 第 24 行
能力：只有一个连续镜头、没有 AIGC 标识、也没有 24 转 30 重复帧的写实或手作质感视频，看图后找不到明确 AI 破绽时不要给高置信度，写成待确认并列出正反两方证据。
引用：“不要给高置信度”

### am.99 VIDEO.md 卡片几百 token

来源：rea-video/docs/videomd.md 第 12 行
能力：VIDEO.md 卡片只几百 token，写这条视频讲什么、怎么做的、有多确定，概览与地图约 1 到 2k token，时间线一行一个镜头。
引用：“几百 token”

### am.100 时间线一行一个镜头，带波浪号的键是推断

来源：rea-video/docs/videomd.md 第 14 行
能力：video/timeline.md 一行一个镜头，键名带波浪号的是推断，不带的是画面里看得到或测得的。
引用：“一行一个镜头”

### am.101 卡片带制作方式占比与可信度

来源：rea-video/docs/videomd.md 第 23 行
能力：VIDEO.md 卡片带 made_mix 按时长算的制作方式占比、confidence、readers 与 source.sha256，正文写结论、叙事线、复刻概要与不确定点。
引用：“按时长的制作方式占比”

### am.102 字幕时间轴每秒 2 帧 OCR

来源：rea-video/docs/what-it-detects.md 第 47 行
能力：字幕时间轴每秒 2 帧 OCR，同一位置的文字逐句跟踪，再用每秒 10 帧的灰度帧把起止对齐到约 0.1 秒，双行字幕合成一句，导出 srt。
引用：“每秒 2 帧 OCR”

### am.103 多镜头模型一次生成一段连着的镜头

来源：rea-video/docs/replicate.md 第 26 行
能力：支持多镜头或参考视频的模型，如 Seedance 2.5、MiniMax H3、Kling 3.0，会把同一段连着的镜头放进同一个生成单元一次生成，再按原片切点拆回各镜头。
引用：“把同一段连着的镜头放进同一个生成单元一次生成”

### am.104 动作驱动切成 10 秒左右短段

来源：rea-video/docs/replicate.md 第 32 行
能力：舞蹈打斗健身类镜头走动作驱动，先擦掉字幕和贴纸，在动作停顿、靠近拍点的地方切成 10 秒左右的短段，每段一个驱动视频。
引用：“切成 10 秒左右的短段，每段一个驱动视频”

### am.105 Q 版动物卡通用骨骼视频

来源：rea-video/docs/replicate.md 第 38 行
能力：新角色是 Q 版、动物、卡通，体型差很多时用骨骼视频，即 DWPose 加 Wan VACE，神态是看点时留在直接参考原片。
引用：“用骨骼视频（DWPose + Wan VACE）”

### am.106 单人全身一镜到底用 Kling 动作控制

来源：rea-video/docs/replicate.md 第 34 行
能力：单人、全身、一镜到底用 Kling 动作控制，多人、有运镜或中间有剪辑用 Seedance 2.5 全能参考，想本地跑用 Wan Animate。
引用：“单人、全身、一镜到底用 Kling 动作控制”

### am.107 多数情况直接拿驱动视频当参考

来源：rea-video/docs/replicate.md 第 34 行
能力：多数情况直接拿驱动视频当参考就行，不用转深度或做白模，原背景杂乱或新场景差很多才转深度视频再喂。
引用：“多数情况直接拿驱动视频当参考就行”

### am.108 工具离线准确率有实测数

来源：rea-video/eval/RESULTS.md 第 9 行
能力：工具离线免费在原片上通常够用，调优集 15 条 98.3 个百分点，留出集 99.6 个百分点，重编码微信视频 88.6 个百分点，加视觉模型后重编码 99.6 个百分点。
引用：“98.3%”

## 商业宣传片作曲与声音

### am.109 钩子在 3 秒内

来源：huashu-motion/skills/huashu-motion/references/rhythm.md 第 33 行
能力：钩子在 3 秒内，一个清晰的 onset 或第一切落在 3 秒内，实测 21 部发布片里 14 部做到了这一点。
引用：“Hook within 3 s”

### am.110 hero 时刻放在最强音乐点

来源：huashu-motion/skills/huashu-motion/references/rhythm.md 第 40 行
能力：hero 时刻放在最强音乐点上，通常是爆发之后，如 drop 或 build 后的第一拍，不要把高潮放在结尾。
引用：“The hero moment on the strongest musical point”

### am.111 停顿时近静默再砸回

来源：huashu-motion/skills/huashu-motion/references/rhythm.md 第 42 行
能力：该停顿时停 0.5 到 1.6 秒近静默，再同帧把画面与声音砸回来，停顿要有赚到的位置，不是没东西放。
引用：“Near silence for 0.5”

### am.112 每段边界至少换两项，drop 处全换

来源：huashu-motion/skills/huashu-motion/references/rhythm.md 第 74 行
能力：每段边界至少换两项，如镜头尺度、速度、缓动族、相机、密度、颜色与地面、音乐质感，drop 处全部换掉。
引用：“Change at least two of these at every section boundary”

### am.113 计划外死时间就是 bug

来源：huashu-motion/skills/huashu-motion/references/rhythm.md 第 70 行
能力：om qa 会报死时间，计划好的 stop 之外任何被标出的空档都算 bug，约两小节无新事就是一段有问题。
引用：“treat any gap it flags outside the stop as a bug”

### am.114 高峰密度每拍或每八分音符一个事件

来源：huashu-motion/skills/huashu-motion/references/rhythm.md 第 62 行
能力：密度按小节计事件，钩子每小节 2 到 4 个，高峰与蒙太奇每小节 4 到 8 个，即每拍或每八分音符一个镜头。
引用：“peak / montage | 4–8 (one per beat or eighth)”

### am.115 音乐无清晰脉冲时用段落不用节拍

来源：huashu-motion/skills/huashu-motion/references/sound.md 第 25 行
能力：音乐置信度低于 0.3 说明无清晰脉冲，如环境音或自由节奏，这时用段落与 drop，不承诺切点卡在节拍上。
引用：“Confidence below 0.3 means no clear pulse”

### am.116 场景标用 OM.beat 与 OM.drop

来源：huashu-motion/skills/huashu-motion/references/sound.md 第 18 行
能力：场景标用 OM.beat、OM.downbeat、OM.drop 与 OM.section，OM.beat(n) 是第 n 拍，OM.section(i) 是第 i 个响度段，hero 放在 OM.drop 上。
引用：“OM.beat(n) is beat n”

### am.117 切点离节拍超 80 毫秒会被列出

来源：huashu-motion/skills/huashu-motion/references/sound.md 第 22 行
能力：先选曲再剪，节拍图就是网格，场景标与 hero 时刻落在 OM.downbeat 与 OM.drop 上，om sound 与 om check 会列出离节拍超 80 毫秒的切点。
引用：“more than 80 ms from the nearest beat”

### am.118 OM.sfx 的 at 是落点

来源：huashu-motion/skills/huashu-motion/references/sound.md 第 172 行
能力：OM.sfx 的 at 参数是落点，riser 与 reverse 是 swell 的终点，落点在动作实际落帧，不在 tween 起点。
引用：“`at` is the impact”

### am.119 作曲用 ABC 记谱，标记落在场景标签上

来源：huashu-motion/skills/huashu-motion/references/contract.md 第 77 行
能力：作曲模式用 ABC 记谱写 om-score，分声部写，装饰标记用感叹号加名字加感叹号，标记落在同名 scene 标签上。
引用：“its `!mark:name!`s landing on `scene:name`”

### am.120 可编辑值声明在 html 标签上

来源：huashu-motion/skills/huashu-motion/references/contract.md 第 16 行
能力：可编辑值是 composition variables，声明在 html 标签的 data-composition-variables 属性上，类型有 string、number、color、boolean、enum。
引用：“data-composition-variables”

### am.121 data-om-id 标一切人可能指的东西

来源：huashu-motion/skills/huashu-motion/references/contract.md 第 25 行
能力：data-om-id 标一切人可能指着改的东西，id 在文字变时保持稳定，canvas 与 WebGL 上的东西用 OM.region 注册。
引用：“names what people can point at”

### am.122 场景就是时间线标签

来源：huashu-motion/skills/huashu-motion/references/contract.md 第 33 行
能力：场景是时间线标签 tl.addLabel 加 scene 加冒号加编号，标签时间就是场景开始时间。
引用：“Timeline labels `scene:<id>` are the scenes”

### am.123 4 秒以上影片结尾 1.2 秒放小署名

来源：huashu-motion/skills/huashu-motion/references/contract.md 第 43 行
能力：每部 4 秒以上的影片结尾 1.2 秒在空角落放小署名 Made with huashu-motion，用影片自己的字体与颜色，用户要求或受托给客户的成片可关。
引用：“Every film of 4 s or more ends with a small”

### am.124 结尾帧要留一个角落空着

来源：huashu-motion/skills/huashu-motion/references/contract.md 第 46 行
能力：结尾帧留一个角落空着放署名，om check 在没角落空着时报 signature-covers 警告。
引用：“signature-covers”

### am.125 变量填语法模板

来源：huashu-motion/skills/huashu-motion/references/grammars.md 第 24 行
能力：变量填进语法模板，双花括号加标题会被替换成变量值，双花括号加 series 加竖线加 json 会解析 JSON 字符串变量，插值失败时帧上显示红字提示。
引用：“"{{title}}" becomes the variable”

### am.126 包装元素提前 0.25 秒入场

来源：huashu-motion/skills/huashu-motion/references/talking-head.md 第 58 行
能力：口播包装元素 lead 默认 0.25 秒，提前入场以便在词说出时落定，数字卡数到 cue 后 0.35 秒。
引用：“lead` (default 0.25 s) starts the entrance early”

### am.127 口播脚本按口语写法，Whisper 只负责定位词

来源：huashu-motion/skills/huashu-motion/references/talking-head.md 第 30 行
能力：给脚本时按口语写法，如写二十几款而不是 20 加款，Whisper 单独听会听错人名与术语，有脚本时 Whisper 只负责定位词，词就是对的。
引用：“Whisper alone mishears names and jargon”

### am.128 om qa 每秒运动量看片子平不平

来源：huashu-motion/skills/huashu-motion/references/punch-up.md 第 21 行
能力：用 om qa 看每秒运动量，健康发布片在 4 到 15 之间且有一处计划好的低谷，多数秒低于 1 就是平片。
引用：“a healthy launch film sits at 4–15 with one planned dip”
