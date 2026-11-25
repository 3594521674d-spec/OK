# 短剧短视频提示词技能包

来源库：liangdabiao/Seedance2-Storyboard-Generator，提交 d8eb796c，许可未声明，2948 星，查时 2026-11-24；jnMetaCode/ai-shortfilm-prompts，提交 e14893a6，MIT 协议，564 星；rediumvex/ai-video-generator-claude，提交 ffdad7d5，MIT 协议，496 星；BeatAPI/awesome-minimax-h3-prompts，提交 6041e8c7，文档 CC BY 4.0，222 星；CyberJ0605/cinematic-video-prompt-engineer-skill，提交 135663a5，MIT 协议，154 星。
提炼范围：精读 41 个文档文件共 51992 行，其中库4 的 3 个分类文件和替补库的 2 个参考文件只读前部，其余全读。只读文档，不读代码，不运行仓库代码。
最终能力 120 条，分 5 个方向。每条能力配一条原文引用，引用为原文逐字连续子串，不超过 50 字。
说明：原定第 5 库 Rylaispirit/cinematic-video-prompt-skill 细读后发现已蒸进导演编剧技能包，按规则改用备选 CyberJ0605/cinematic-video-prompt-engineer-skill，替补原因见 dedup-log.md。

## 能力索引

- Seedance 分镜与多集串联：dp.01 至 dp.22，共 22 条
- 五段式电影感提示词：dp.23 至 dp.50，共 28 条
- 病毒短视频与商业视频：dp.51 至 dp.80，共 30 条
- MiniMax H3 提示词结构：dp.81 至 dp.96，共 16 条
- 梗概转电影感提示词：dp.97 至 dp.120，共 24 条

## Seedance 分镜与多集串联

### dp.01 文资视剪四阶段

来源：Seedance2-Storyboard-Generator/.claude/skills/seedance-storyboard-generator/SKILL.md 第 3 行
能力：按文、资、视、剪四阶段走，先写剧本，再建资产库，再生成视频，最后剪辑修补，顺序不能乱。
引用：“文-资-视-剪”

### dp.02 开工先定五参数

来源：Seedance2-Storyboard-Generator/.claude/skills/seedance-storyboard-generator/SKILL.md 第 45 行
能力：开工先定视觉风格、时长、目标平台、基调、核心梗，短剧按 5 集乘 15 秒约 75 秒排片，长剧按 20 集乘 15 秒约 5 分钟排片。
引用：“短剧5集×15秒≈75秒”

### dp.03 每集情绪基调先定

来源：Seedance2-Storyboard-Generator/docs/剧本和分镜.md 第 33 行
能力：全剧先定四幕情绪走向，再给每集定一个明确的情绪基调，后面写分镜的音效和色调都有据可依。
引用：“每集都有明确的情绪基调”

### dp.04 素材编号三分法

来源：Seedance2-Storyboard-Generator/docs/剧本和分镜.md 第 293 行
能力：全部视觉资产按角色、场景、道具编号，角色用 C01 起，场景用 S01 起，道具用 P01 起，分镜里只写编号引用。
引用：“角色(C01-C99)、场景(S01-S99)、道具(P01-P99)”

### dp.05 统一风格前缀

来源：Seedance2-Storyboard-Generator/docs/剧本和分镜.md 第 59 行
能力：全部资产提示词开头加同一句风格前缀，例如水墨加动漫渲染，风格不统一的图混进成片会穿帮。
引用：“所有 prompt 加统一的风格前缀”

### dp.06 角色靠配色与视觉标记区分

来源：Seedance2-Storyboard-Generator/docs/剧本和分镜.md 第 67 行
能力：每个角色定一套专属配色加视觉标记，例如黑高马尾加青白长袍加背剑，换场景也能一眼认出。
引用：“角色辨识度靠颜色和视觉标记来区分”

### dp.07 同角色多角度多状态

来源：Seedance2-Storyboard-Generator/docs/剧本和分镜.md 第 57 行
能力：同一角色按需要出多张图，正面全身、侧面动态、背影、受伤态、少年态各一张，分集按剧情状态挑图引用。
引用：“同一个角色可能有多张图”

### dp.08 场景三角度

来源：Seedance2-Storyboard-Generator/.claude/skills/seedance-storyboard-generator/SKILL.md 第 240 行
能力：每个重要场景至少出三张图，正打、反打、侧面全景各一张，正反打按角色站位和对话方向设计。
引用：“每个重要场景至少生成三条提示词”

### dp.09 人物资产全身正面纯白背景

来源：Seedance2-Storyboard-Generator/.claude/skills/seedance-storyboard-generator/SKILL.md 第 213 行
能力：人物资产图必须是全身正面纯白背景，从头到脚完整入镜，含鞋子描述，表情中性，双手自然垂落。
引用：“必须是全身正面、纯白背景”

### dp.10 道具纯白背景单独展示

来源：Seedance2-Storyboard-Generator/.claude/skills/seedance-storyboard-generator/SKILL.md 第 265 行
能力：道具资产图纯白背景单独展示，主体清晰，材质和年代感贴合剧本设定，不带人物和环境。
引用：“道具要单独展示，主体清晰”

### dp.11 角色四视图

来源：Seedance2-Storyboard-Generator/.claude/skills/seedance-storyboard-generator/SKILL.md 第 296 行
能力：定下全身正面图后，再出三视图加一张面部特写，左边占三分之一放超大面部特写，右边放正侧背三视图。
引用：“三视图（正面、侧面、背面）+ 脸部特写”

### dp.12 分镜三件套

来源：Seedance2-Storyboard-Generator/docs/剧本和分镜.md 第 91 行
能力：每集分镜写三件套，素材上传清单、时间轴格式提示词、尾帧描述，缺一件下一集就接不上。
引用：“素材清单列出了这集需要上传的所有参考图”

### dp.13 时间轴五段

来源：Seedance2-Storyboard-Generator/README.md 第 115 行
能力：15 秒一集按 0 到 3 秒、3 到 6 秒、6 到 9 秒、9 到 12 秒、12 到 15 秒五段写，每段写清画面、运镜、动作、音效。
引用：“0-3秒画面：高空俯拍，场景建立”

### dp.14 每时段三层信息

来源：Seedance2-Storyboard-Generator/docs/剧本和分镜.md 第 138 行
能力：每个时段同时写三层，画面内容讲谁在做什么，镜头运动讲怎么拍，音效讲配什么声音。
引用：“每个时段都写了三层信息”

### dp.15 标准提示词公式

来源：Seedance2-Storyboard-Generator/docs/structured-prompt.md 第 71 行
能力：按风格、时长、画幅、氛围开头，接时间轴分段，再写声音段和参考段，十六类模板按题材换内容不换骨架。
引用：“标准提示词公式”

### dp.16 尾帧为下一集衔接

来源：Seedance2-Storyboard-Generator/docs/剧本和分镜.md 第 140 行
能力：每集写完要记尾帧描述，主体、背景、光线、构图、氛围五项写全，下一集开头照着它接。
引用：“这段描述是给下一集做衔接用的”

### dp.17 视频延长串联

来源：Seedance2-Storyboard-Generator/README.md 第 134 行
能力：从第二集起上传上一集视频当参考，提示词开头写延长指令，片头加各集形成一条延长链，首尾自动衔接。
引用：“将@视频1延长15s”

### dp.18 抽帧接力

来源：Seedance2-Storyboard-Generator/.claude/skills/seedance-storyboard-generator/SKILL.md 第 367 行
能力：把上一段视频最后一帧截图，当下一段的首帧参考图上传，比延长功能更稳，画质下降时优先用它。
引用：“作为下一个视频生成的首帧参考图上传”

### dp.19 转场写进提示词

来源：Seedance2-Storyboard-Generator/README.md 第 218 行
能力：跨天色或跨场景的衔接不要交给模型猜，直接在提示词里写转场指令，例如画面渐暗过渡后天色改变。
引用：“画面渐暗过渡，天色从夜晚转为清晨”

### dp.20 敏感词二分法排查

来源：Seedance2-Storyboard-Generator/docs/剧本和分镜.md 第 178 行
能力：平台不告诉你是哪个词触发屏蔽，把提示词砍半测试，逐步缩小范围定位到词，积累自己的敏感词库前置规避。
引用：“建议自己积累一个敏感词库”

### dp.21 动作写慢防崩

来源：Seedance2-Storyboard-Generator/.claude/skills/seedance-storyboard-generator/references/优化分镜.md 第 48 行
能力：动作描述写慢字，越慢越稳，避免夸张、高速、剧烈扭动这类词，容易让画面崩坏。
引用：“越慢越稳”

### dp.22 禁主观词

来源：Seedance2-Storyboard-Generator/.claude/skills/seedance-storyboard-generator/references/优化分镜.md 第 49 行
能力：不用漂亮、帅气、很酷这类主观词，模型无法理解抽象描述，等于没写，换成看得见的眉眼、动作、光影。
引用：“避免使用主观词”

## 五段式电影感提示词

### dp.23 五段式顺序

来源：ai-shortfilm-prompts/methodology.zh.md 第 16 行
能力：按核心主题、人物与基础设定、氛围与画质、运镜规则、分镜五段写，顺序不要乱。
引用：“顺序不要乱”

### dp.24 核心主题标签递进

来源：ai-shortfilm-prompts/methodology.zh.md 第 28 行
能力：核心主题写 3 到 6 个标签，用竖线分隔，从画面类型到题材再到美学风格层层递进，给模型一个总体审美锚点。
引用：“给 AI 一个总体审美锚点”

### dp.25 人物三行

来源：ai-shortfilm-prompts/skills/shortfilm-prompt/SKILL.zh.md 第 42 行
能力：人物与基础设定写三行，面部、服装、场景，面部锁五官和表情，服装写质地，场景写动态环境。
引用：“面部 / 服装 / 场景”

### dp.26 杜绝美化

来源：ai-shortfilm-prompts/methodology.zh.md 第 55 行
能力：面部设定开头就写参照上传图片，五官、脸型、发型百分百还原，杜绝美化，真实感来自瑕疵。
引用：“杜绝美化”

### dp.27 服装写质地

来源：ai-shortfilm-prompts/methodology.zh.md 第 58 行
能力：服装不写颜色名就完事，写质地，例如哑光黑色皮质，比黑色皮衣信息量大三倍。
引用：“哑光黑色皮质”

### dp.28 场景写动态环境

来源：ai-shortfilm-prompts/methodology.zh.md 第 68 行
能力：场景不写静态背景，写微风、硝烟、陨石这类动态元素，静态背景出不了氛围。
引用：“微风、硝烟、陨石”

### dp.29 摄影机型号锚点

来源：ai-shortfilm-prompts/methodology.zh.md 第 86 行
能力：氛围段写真实摄影机加镜头型号，例如 IMAX 胶片机加 Panavision C 系列，等于给模型一个明确视觉锚点。
引用：“给 AI 一个具体摄影机型号”

### dp.30 四组摄影机组合

来源：ai-shortfilm-prompts/README.zh.md 第 79 行
能力：史诗大场面用 IMAX 加 Panavision C 系列 35mm f4，暗调赛博用索尼威尼斯加佳能 K-35，港片武侠用柯达 35mm 复古胶片加漂白旁路，商业人像用 Canon EF 85mm f/1.2。
引用：“IMAX 胶片摄影机 + Panavision C 系列镜头”

### dp.31 呼吸感原句

来源：ai-shortfilm-prompts/methodology.zh.md 第 111 行
能力：运镜段永远加一句手持加极其轻微如呼吸般的镜头浮动，两个限定词缺一不可，否则模型会理解成剧烈抖动。
引用：“如呼吸般的镜头浮动”

### dp.32 声音行

来源：ai-shortfilm-prompts/cheatsheet.zh.md 第 76 行
能力：氛围段永远加声音行，无配乐仅保留现场同期声，有标志性环境音要逐项列出，不要让模型猜。
引用：“声音：无配乐，仅保留现场同期声。”

### dp.33 按秒切片

来源：ai-shortfilm-prompts/methodology.zh.md 第 150 行
能力：单镜头一镜到底用按秒切片，每段写动作加镜头加特效三件套，可选加声音和表情。
引用：“动作 + 镜头 + 特效”

### dp.34 按镜头切片

来源：ai-shortfilm-prompts/methodology.zh.md 第 172 行
能力：多镜头剪辑用按镜头切片，每镜写景别加构图加运镜手法加画面内容四件套。
引用：“景别 + 构图 + 运镜手法 + 画面内容”

### dp.35 瑕疵等于真实

来源：ai-shortfilm-prompts/methodology.zh.md 第 186 行
能力：描述缺陷就是描述真实，太完美等于假，战损、掉漆、油污、面部细小瑕疵都要写进提示词。
引用：“过于完美，就假”

### dp.36 每段至少两处瑕疵

来源：ai-shortfilm-prompts/skills/shortfilm-prompt/SKILL.zh.md 第 242 行
能力：人物、装备、战衣段每段至少写两处瑕疵描述，少于两处就补。
引用：“至少 2 处瑕疵描述”

### dp.37 结尾留白

来源：ai-shortfilm-prompts/methodology.zh.md 第 196 行
能力：单镜头变身或史诗段结尾不要堆特效，不要台词、爆炸、强光，只写主角站在原地加一个环境细节。
引用：“没有台词。没有爆炸。没有光芒万丈。”

### dp.38 低质量参考图不如不垫

来源：ai-shortfilm-prompts/cheatsheet.zh.md 第 27 行
能力：参考图画质不高就别喂，模型会模仿参考图的画风而不是设计，动态镜头干脆不垫图，用纯文案发挥。
引用：“图片质量不高就别喂参考图”

### dp.39 抽卡预算

来源：ai-shortfilm-prompts/cheatsheet.zh.md 第 29 行
能力：开工前按镜头难度定重投预算，简单镜头 2 到 3 次，困难镜头 20 次以上，成片与生成量按 5 到 10 倍算成本。
引用：“每个镜头 2-3 到 20+ 次重抽很正常”

### dp.40 变身单镜头一镜到底

来源：ai-shortfilm-prompts/templates/15s-transformation.zh.md 第 48 行
能力：15 秒变身用单镜头一镜到底，不剪辑，按凝视、启动、撕裂、生长、完成五段推进，每段 3 秒。
引用：“一镜到底，无剪辑”

### dp.41 触发词避 IP 名

来源：ai-shortfilm-prompts/templates/15s-transformation.zh.md 第 135 行
能力：变身触发词不要照搬 IP 名，用低语或怒喊加自创音节，或用情绪加语种描述代替具体词。
引用：“触发词不要照搬 IP 名”

### dp.42 IP 名换设计语言

来源：ai-shortfilm-prompts/cases.zh.md 第 63 行
能力：提示词被判版权拦截时，去掉名字，把设计语言留成描述，或删几个字符标点而不改变含义，或换近义词。
引用：“删掉几个字符或标点而不改变含义”

### dp.43 人脸锁死防漂移

来源：ai-shortfilm-prompts/cases.zh.md 第 79 行
能力：段二把脸锁死，写清参照上传照片，五官、脸型、发型百分百保留，变身前后骨骼结构和五官完全一致。
引用：“五官、脸型、发型 100% 保留”

### dp.44 人脸审核三级修复

来源：ai-shortfilm-prompts/cases.zh.md 第 37 行
能力：参考照片被审核拦截时按强度递进修，先换照片，再转成写实彩色素描画上传，最后把角色设计成完全不露正脸。
引用：“多换几张照片试试”

### dp.45 运动方向连贯衔接

来源：ai-shortfilm-prompts/cases.zh.md 第 231 行
能力：两段接不上时不要只对齐静帧，靠运动方向连贯性衔接，设计镜头时安排好出画和入画的边。
引用：“出 / 入画的边”

### dp.46 竖屏短剧三拍

来源：ai-shortfilm-prompts/skills/shortfilm-prompt/SKILL.zh.md 第 85 行
能力：竖屏短剧按三拍写，0 到 2 秒冷开场钩子，2 到 8 秒正反打对峙，8 到 12 秒悬念切，结尾停在未解决的反应上。
引用：“2 秒钩子 + 正反打 + 悬念切”

### dp.47 情感叙事时间推进

来源：ai-shortfilm-prompts/skills/shortfilm-prompt/SKILL.zh.md 第 108 行
能力：情感片时间靠季节加光线推进，调色全片锁一档，例如窗外季节在变，屋内暖光不变，换滤镜最容易散架。
引用：“窗外季节在变，屋内暖光不变”

### dp.48 七条硬规则自检

来源：ai-shortfilm-prompts/skills/shortfilm-prompt/SKILL.zh.md 第 303 行
能力：交稿前过七条硬规则，具体名词、摄影机型号、呼吸感、声音行、两处瑕疵、留白结尾、避 IP 名，少一条就不交。
引用：“少一条就不交”

### dp.49 按类型片取模板

来源：ai-shortfilm-prompts/skills/shortfilm-prompt/SKILL.zh.md 第 58 行
能力：21 个类型模板按分支加载，变身、多分镜叙事、情感亲情、产品带货、食物 ASMR 各有骨架，先读模板再写。
引用：“按分支挑一个”

### dp.50 氛围预制件八组

来源：ai-shortfilm-prompts/templates/atmosphere-prefabs.md 第 15 行
能力：氛围段直接取八组预制件之一，暗黑特摄、好莱坞青橙、60 年代原子朋克、邵氏港风、重型机甲、商业人像、产品拍摄、三视图，多镜头全片保持同一组色调。
引用：“Dark Tokusatsu / Battle-Damaged Aesthetic”

## 病毒短视频与商业视频

### dp.51 注意力三段

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 22 行
能力：前 2 秒是门，决定一半以上观众走还是留，2 到 5 秒是钩子确认，5 到 15 秒是情绪峰值，15 秒后是留存悬崖。
引用：“If 50%+ bounce here, the video dies”

### dp.52 钩子十二式

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 31 行
能力：钩子库分四类共十二式，物理破坏、好奇缺口、多巴胺触发、原始注意力，每式都有机制和提示词模板。
引用：“12 Battle-Tested Patterns”

### dp.53 物理破坏钩子

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 37 行
能力：开场先给正常预期 0.8 秒，再打破它，物体反重力或时间倒流，镜头保持静止，把反常当日常拍。
引用：“treating impossible action as mundane”

### dp.54 藏揭示钩子

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 45 行
能力：只拍局部不拍全貌，例如只拍手部特写和制作声，2 秒时轻微拉远只暗示形状不揭示，观众必须继续看。
引用：“Camera never shows the full object”

### dp.55 反应先于动作

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 46 行
能力：先拍反应再拍原因，开场拍一张震惊的脸，眼睛睁大下巴掉落，不给任何环境信息，问题本身逼观众留下。
引用：“Show the response, hide the cause”

### dp.56 多巴胺触发

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 53 行
能力：拍极度满足的运动，例如液体完美倒入杯中或刀切开光滑表面，微距加浅景深加 0.5 倍慢放，配 ASMR 音质。
引用：“ASMR-tier visual satisfaction”

### dp.57 眼神接触钩子

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 61 行
能力：极近特写拍眼睛在阴影里，0.6 秒时眼睛睁开直视镜头，瞳孔放大，2 秒内不眨眼，配心跳低频。
引用：“lock directly into camera”

### dp.58 静默后爆音

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 63 行
能力：前 1.5 秒完全静默，黑屏或静止远景，1.5 秒时爆音加硬切，静默本身在全是噪音的平台上就很扎眼。
引用：“the absence itself is jarring”

### dp.59 快钩运镜四式

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 73 行
能力：0 到 2 秒用快钩运镜，0.3 秒急推、0.5 秒甩摇、0.4 秒下坠、0.3 秒斜角快转，制造冲击和不安。
引用：“Snap zoom from wide to tight close-up in 0.3s”

### dp.60 揭示钩子三式

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 82 行
能力：1 到 3 秒用揭示钩子，特写拉远 2 秒、环绕 180 度 3 秒、垂直上升 2 秒，每转 45 度揭示一个新环境元素。
引用：“revealing the full scene”

### dp.61 霓虹对比光

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 94 行
能力：双色霓虹从两侧打，粉青或橙蓝对撞，交界处出硬阴影，主体面部一半暖一半冷，背景压黑，饱和度拉到八成。
引用：“Dual-color neon lighting”

### dp.62 剪影好奇

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 104 行
能力：强光源放主体正后方，面部零补光，只剩黑色轮廓，观众认不出是谁就产生好奇，边缘光勾出发丝和肩线。
引用：“Viewer cannot identify subject = curiosity”

### dp.63 四层声音栈

来源：ai-video-generator-claude/README.md 第 61 行
能力：声音分四层叠，环境打底、撞击点缀、音乐 1 到 2 秒后进、人声可选，每层都对齐视觉节拍。
引用：“Sound is 50% of the hook”

### dp.64 平台钩子时限

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 143 行
能力：TikTok 钩子 1.5 秒内必须落地，Reels 放宽到 2 秒，Shorts 放宽到 2 到 3 秒，平台越急钩子越要前置。
引用：“Hook must land by 1.5s”

### dp.65 无缝循环收尾

来源：ai-video-generator-claude/skills/01-viral-hook/SKILL.md 第 147 行
能力：要循环播放时，最后一帧构图照抄开场帧，同一机位、同一光线、同一主体位置，最后 0.5 秒动作接回第一帧。
引用：“Final frame composition mirrors opening frame”

### dp.66 SaaS 三忌

来源：ai-video-generator-claude/skills/02-saas-launch/SKILL.md 第 20 行
能力：软件视频不要平铺截图，界面要做出纵深、反射、环境、运动，界面本身是主角不是解说员，声音比画面更卖货。
引用：“Never show a flat screenshot”

### dp.67 悬浮设备镜头

来源：ai-video-generator-claude/skills/02-saas-launch/SKILL.md 第 48 行
能力：产品放在悬空设备上拍，15 度倾斜浮在暗色虚空，屏幕用参考图，单主光加轮廓光，镜头 30 度环绕，屏光染亮周围空间。
引用：“floating in dark void at slight 15-degree angle”

### dp.68 透视缩放进屏

来源：ai-video-generator-claude/skills/02-saas-launch/SKILL.md 第 73 行
能力：镜头先拍桌上设备，再推进穿过屏幕边界，从物理空间进入数字空间，界面元素以视差从两侧掠过，结尾全屏铺满界面。
引用：“The UI fills the entire frame”

### dp.69 UI 音效库

来源：ai-video-generator-claude/skills/02-saas-launch/SKILL.md 第 148 行
能力：每个界面动作配一个音，点击用清脆机械声，翻页用 0.3 秒横向风声，加载用数字级联声，成功用双音上升，错了用低音短音。
引用：“Every UI interaction needs a sound”

### dp.70 权力人像光

来源：ai-video-generator-claude/skills/03-personal-brand/SKILL.md 第 34 行
能力：单主光 45 度略高于眼平线，远侧脸颊出伦勃朗三角阴影，补光压到三成亮度，强轮廓光把人从黑背景里分离，眼睛里留 catchlight。
引用：“Rembrandt triangle shadow on far cheek”

### dp.71 慢推近

来源：ai-video-generator-claude/skills/03-personal-brand/SKILL.md 第 64 行
能力：个人品牌最有力的运镜是 6 秒慢推 4 英尺，匀速不加速，背景压缩而主体比例不变，观众感觉不到移动但感觉亲近。
引用：“this person is worth getting closer to”

### dp.72 课程弧线四段

来源：ai-video-generator-claude/skills/04-course-promo/SKILL.md 第 72 行
能力：课程宣传按钩子、证据、转变、行动四段走，钩子先写镜头描述，一句话讲不清的钩子不具体。
引用：“Write the hook shot description first”

### dp.73 无脸三律

来源：ai-video-generator-claude/skills/05-faceless-channel/SKILL.md 第 35 行
能力：无脸内容三条铁律，屏幕每秒都要有运动，第一帧就是封面，没有脸时情绪靠色温、对比、阴影来表达。
引用：“Never let the screen rest”

### dp.74 奢华七原则

来源：ai-video-generator-claude/skills/06-luxury-aesthetic/SKILL.md 第 42 行
能力：奢华视频七条，元素越少越好，画面四到六成留白，运镜只用 0.1 到 0.3 倍慢速，色彩低饱和近单色，材质用微距拍纹理，静默当设计，镜头 hold 得比舒服更久。
引用：“Every element earns its place”

### dp.75 前后对比五种转场

来源：ai-video-generator-claude/skills/07-before-after/SKILL.md 第 76 行
能力：转场五选一，硬切、擦除、叠化、物体匹配、延时压缩，擦除方向有含义，左到右是前进，下到上是生长。
引用：“instantaneous hard cut from [before] to [after]”

### dp.76 冷暖光色对比

来源：ai-video-generator-claude/skills/07-before-after/SKILL.md 第 114 行
能力：前后对比要一眼可辨，之前用冷平 harsh 光加去饱和，之后用暖金柔光加高饱和，光色反差本身就是论证。
引用：“flat overhead fluorescent lighting”

### dp.77 证言先给结果

来源：ai-video-generator-claude/skills/08-testimonial-story/SKILL.md 第 22 行
能力：证言视频先给结果再给情绪最后给人，开场先放数字或成果，观众先被结果钉住再听故事。
引用：“Show the result first”

### dp.78 数字冲击

来源：ai-video-generator-claude/skills/08-testimonial-story/SKILL.md 第 44 行
能力：数字钩子先黑场出指标词，停 0.5 秒，数字从下方砸进来带回弹物理，镜头微震 2 像素，配低音重击加混响尾。
引用：“Number counts up rapidly”

### dp.79 恐怖谷两条出路

来源：ai-video-generator-claude/skills/09-ai-avatar/SKILL.md 第 51 行
能力：数字人要么推满写实，皮肤次表面散射、眼角膜湿润反光、微表情、呼吸起伏全写上，要么彻底风格化，中间地带最危险。
引用：“Either push all the way to photorealism”

### dp.80 播客视觉新模型

来源：ai-video-generator-claude/skills/10-podcast-visual/SKILL.md 第 41 行
能力：播客可视化不要放波形图和静态底图，改成展示话语的感觉，抽象可视化、电影化 B Roll、分屏访谈重构、动态排版四种格式按情绪选，静音看也要成立。
引用：“Show what the words feel like”

## MiniMax H3 提示词结构

### dp.81 H3 提示词五问

来源：awesome-minimax-h3-prompts/README.zh-CN.md 第 14 行
能力：每条 H3 提示词先答五问，每个参考素材负责什么，哪些身份产品文字版式不能变，每个时间节点发生什么，镜头转场怎么动，要预防哪些具体失败。
引用：“每个参考素材负责什么”

### dp.82 H3 八段结构

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 21 行
能力：制作级 H3 提示词用八段结构，格式、参考控制、故事、镜头、环境加物理、音频、视觉、连续性，缺一段就少一层控制。
引用：“Image 1 = locked AMINA identity and wardrobe”

### dp.83 锁定写法

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 22 行
能力：参考控制段用锁定写法写清每张图钉死什么，例如图一锁定身份和服装，写清脸、发型、肤色、外套、耳机、挎包、收音机、靴子和表情。
引用：“Preserve face, close-cropped hair”

### dp.84 时间轴分段标题

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 95 行
能力：故事段按时间切，每段给一个标题加起止秒，例如 0 到 2 秒断线，2 到 4 秒桥要关了，每段写清动作、镜头、声音。
引用：“Slow push toward her face”

### dp.85 非线性交叉剪辑

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 100 行
能力：镜头段写清剪辑方式，例如精确非线性交叉剪辑加手持跟拍加空中斜拍加克制推近，配自然动态模糊和细胶片颗粒。
引用：“Precise nonlinear cross-cutting”

### dp.86 物理可信

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 110 行
能力：环境加物理段要求风真实影响灰尘、衣服、线缆、天线，全部运动和互动保持物理可信，不写不可能的机位运动。
引用：“remain physically believable”

### dp.87 禁止清单

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 122 行
能力：视觉段末尾写禁止清单，不要字幕、文字、标志、水印、政治信息、旗帜、军事徽章。
引用：“No subtitles, text, logos, watermarks”

### dp.88 连续性段

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 125 行
能力：结尾写连续性段，同一身份、服装、收音机、挎包贯穿全片，同一座桥、同一座城、同一氛围、同一黎明光线，地理和时间连续。
引用：“wardrobe, radio and satchel throughout”

### dp.89 微提示词一物一规则

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 145 行
能力：一句话微提示词只讲一个物体加一条规则，例如两朵小白云从烤面包机槽里缓缓升起，配时长和锁定机位就能跑。
引用：“fluffy white clouds rise slowly out of the slots”

### dp.90 锁定机位

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 145 行
能力：微提示词要写死机位，例如锁定在柜台高度、桌面高度、略高于水面，机位不动，变化只发生在画面里。
引用：“Camera: locked, counter height”

### dp.91 速率即时间轴

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 808 行
能力：速率要写成时间轴，例如起初大约每秒一朵，后来每秒两朵，再后来一次几朵，头顶均匀变薄，十一秒讲完三个阶段。
引用：“roughly one per second at first”

### dp.92 双时钟

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 551 行
能力：画面速率和声音速率要对得上，例如画面里每秒出一颗弹珠，声音线里也每秒响一次，两个时钟一致模型才不容易跑偏。
引用：“Two clocks that agree”

### dp.93 一致性句

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 640 行
能力：给模型一句一致性约束，例如没有其他多米诺骨牌出现，模型最爱给主角加同伴，一句话堵死。
引用：“No others ever appear”

### dp.94 画面声音同一楼梯

来源：awesome-minimax-h3-prompts/prompts/categories/cinematic-story.md 第 931 行
能力：声音线和画面线写同一段楼梯，例如瀑布吼声随冰层爬升分段减弱，声音和画面达成一致时模型有两个理由做对。
引用：“the picture describe the same staircase”

### dp.95 验证状态分级

来源：awesome-minimax-h3-prompts/README.zh-CN.md 第 47 行
能力：案例分两级验证，来源已核验是核对过原始公开来源和作者，输出已核验是能公开输入、设置和输出证据。
引用：“已经核验原始公开来源和作者”

### dp.96 证据不是评分

来源：awesome-minimax-h3-prompts/README.zh-CN.md 第 50 行
能力：验证状态描述的是证据不是审美评分，没有可公开的输入和输出证据时，可复制模板不能包装成已实测案例。
引用：“这些状态描述的是证据，不是审美评分”

## 梗概转电影感提示词

### dp.97 剧情诊断四要素

来源：cinematic-video-prompt-engineer-skill/README.md 第 46 行
能力：先诊断再写提示词，判情绪核心、视觉核心、冲突关系、可拍摄节点，再定结构和片长。
引用：“情绪核心、视觉核心、冲突关系、可拍摄节点”

### dp.98 电影化改写外化抽象

来源：cinematic-video-prompt-engineer-skill/README.md 第 47 行
能力：把内心活动、叙述和抽象情绪外化为动作、表演、道具、声音、光影与空间变化，抽象词本身不进提示词。
引用：“外化为动作、表演、道具、声音、光影与空间变化”

### dp.99 四种输出模式

来源：cinematic-video-prompt-engineer-skill/README.md 第 48 行
能力：四种模式按需选，精简模式只给最终提示词，打磨模式默认给诊断加策略加交付物，方向确认模式只给待确认决策，连续短片模式给连续性摘要加分段提示词。
引用：“精简模式、打磨模式、方向确认模式和连续短片模式”

### dp.100 双生产路径

来源：cinematic-video-prompt-engineer-skill/README.md 第 49 行
能力：两条生产路径不要混成一条，直接视频路径自带全部锚点，参考图优先路径分五阶段，先规划资产再编译视频提示词。
引用：“参考图优先的分阶段工作流”

### dp.101 参考图编译像素为准

来源：cinematic-video-prompt-engineer-skill/README.md 第 34 行
能力：实际图片像素高于此前文字设想，视频提示词只补动态变化，不重复整段静态外观，图里没有的东西不要当成已存在。
引用：“实际图片像素高于此前文字设想”

### dp.102 时长服从内容

来源：cinematic-video-prompt-engineer-skill/README.md 第 112 行
能力：不为凑满 30 秒拖慢节奏，也不把超量剧情硬塞进单条视频，时长按真实可播放内容定。
引用：“不为凑满 30 秒拖慢节奏”

### dp.103 表演由动机驱动

来源：cinematic-video-prompt-engineer-skill/README.md 第 113 行
能力：眼神、表情、呼吸、停顿、语气和伴随动作必须服务于同一心理目的，表演信号不要各演各的。
引用：“眼神、表情、呼吸、停顿、语气和伴随动作必须服务于同一心理目的”

### dp.104 镜头必须有任务

来源：cinematic-video-prompt-engineer-skill/README.md 第 114 行
能力：景别、机位、运镜和剪辑都用于揭示信息、推进关系或放大情绪，不起作用的运镜改成静止。
引用：“用于揭示信息、推进关系或放大情绪”

### dp.105 连续性优先于装饰

来源：cinematic-video-prompt-engineer-skill/README.md 第 115 行
能力：先锁定人物、场景、道具、轴线、光源、声线和空间关系，再设计变化，装饰不能动锚点。
引用：“锁定人物、场景、道具、轴线、光源、声线和空间关系”

### dp.106 尾帧只承接可见状态

来源：cinematic-video-prompt-engineer-skill/README.md 第 30 行
能力：尾帧只承接可见状态，不默认复制构图，逐镜检查参考图覆盖、切点、空间关系和机位动机。
引用：“尾帧只承接可见状态，不默认复制构图”

### dp.107 角色卡默认直出

来源：cinematic-video-prompt-engineer-skill/README.md 第 25 行
能力：主要人物默认直接编写角色卡提示词，基础资产确认后再按需做关系图或首帧，不要一次把全部参考图类型都建了。
引用：“主要人物默认直接编写角色卡提示词”

### dp.108 局部修复锁成功项

来源：cinematic-video-prompt-engineer-skill/README.md 第 21 行
能力：生成结果出问题时锁定成功部分，只修改失败变量，改失败字段和必要联动项，不要从头重写。
引用：“锁定成功部分，只修改失败变量”

### dp.109 时长字数预算表

来源：cinematic-video-prompt-engineer-skill/cinematic-video-prompt-engineer/SKILL.md 第 161 行
能力：最终提示词按时长控字数，1 到 15 秒上限 2000 字，16 到 24 秒上限 3200 字，25 到 30 秒上限 4000 字，上限不是目标长度。
引用：“2000 Chinese characters for 1-15s prompts”

### dp.110 结尾留 1 到 2 秒呼吸

来源：cinematic-video-prompt-engineer-skill/cinematic-video-prompt-engineer/references/style_patterns.md 第 37 行
能力：不要把关键台词或高潮动作放在最后一秒才切断，结尾留 1 到 2 秒给反应、呼吸、沉默、声音尾或视觉余像。
引用：“Reserve 1-2 seconds for reaction”

### dp.111 具体性原则

来源：cinematic-video-prompt-engineer-skill/cinematic-video-prompt-engineer/references/style_patterns.md 第 47 行
能力：抽象意图要转成镜头看得见或听得见的东西，动作、物件、光源、质感、反射、声音、身体反应、定时转场，不要停在破碎记忆闪回这类标签上。
引用：“translate them into visible fragments”

### dp.112 正面描述优先

来源：cinematic-video-prompt-engineer-skill/cinematic-video-prompt-engineer/references/style_patterns.md 第 55 行
能力：先写想要的路径，例如小球直接滚进蓝色框，否定约束只作小范围兜底，防字幕、水印、面部畸变这类可能失败。
引用：“小球直接滚进蓝色框”

### dp.113 短剧钩子诊断六功能

来源：cinematic-video-prompt-engineer-skill/cinematic-video-prompt-engineer/SKILL.md 第 131 行
能力：短剧钩子按六个功能检查，异常、即时目标、规则代价、主动障碍、信息反转、未解问题，是可选功能不是必备配料。
引用：“active obstacle, information reversal”

### dp.114 知识差管控

来源：cinematic-video-prompt-engineer-skill/cinematic-video-prompt-engineer/SKILL.md 第 132 行
能力：悬疑和反转戏要分开记角色知道什么、观众知道什么，角色不能对剧本还没给他的信息做反应。
引用：“what the character already knows”

### dp.115 回溯式反转三轨

来源：cinematic-video-prompt-engineer-skill/cinematic-video-prompt-engineer/SKILL.md 第 133 行
能力：记忆、幻觉、误认类反转分三轨记，客观事实、角色感知、观众理解，用动作、构图、运动方向、接触或声音把前后两段配对。
引用：“character perception, and audience belief”

### dp.116 密集对白双轨

来源：cinematic-video-prompt-engineer-skill/README.md 第 36 行
能力：密集对白支持抢话、短暂重叠、口误、未完成句、画外音，说话者加听者双轨写，语义剪辑点按台词意思切。
引用：“说话者/听者双轨与语义剪辑点”

### dp.117 竖屏重组非裁切

来源：cinematic-video-prompt-engineer-skill/README.md 第 37 行
能力：选 9 比 16 时重新组织景别、站位和运镜，而不是简单裁切横屏构图，横屏双人镜头竖屏要重排。
引用：“而不是简单裁切横屏构图”

### dp.118 竖屏双人错层

来源：cinematic-video-prompt-engineer-skill/cinematic-video-prompt-engineer/references/vertical_9x16_adaptation.md 第 45 行
能力：竖屏默认不要小对称并排双人镜头，用错层纵深、过肩、倒影、门框分隔或交替单人，保持 180 度轴线和视线。
引用：“Avoid a small symmetrical side-by-side two-shot”

### dp.119 一镜到底情绪覆盖

来源：cinematic-video-prompt-engineer-skill/README.md 第 32 行
能力：一镜到底情绪戏要让脸部、视线、手部接触、走近过程和结尾反应都在连续镜头里有可读画面证据，区分移焦、变焦和实体机位移动。
引用：“让脸部、视线、手部接触、走近过程和结尾反应都在连续镜头中获得可读的画面证据”

### dp.120 生成结果手术修复

来源：cinematic-video-prompt-engineer-skill/cinematic-video-prompt-engineer/SKILL.md 第 73 行
能力：修生成结果先诊断结果和意图的差距，锁定成功元素，只改失败控制项，除非镜头结构本身不成立。
引用：“diagnose the result-to-intent gap”
