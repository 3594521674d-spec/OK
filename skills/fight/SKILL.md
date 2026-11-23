# 打斗提示词技能包

一套，5 个库，91 条来源能力去重合并后 48 条。覆盖动作编排与招式、分镜与时间结构、镜头与运镜、撞击与特效、防穿模与多主体、动力学与反应、模型分流与平台、音效、场景与环境、暴力分级与安全 10 个方向。

来源：GitHub 上 5 个打斗提示词库的仓颉蒸馏成果：beshuaxian/higgsfield-seedance2-jineng（1062 星）、OSideMedia/higgsfield-ai-prompt-skill（955 星，已归档）、Dream2046-Light/duel-fight-prompt（3 星）、Yunwuxin-666/Wuxin-Film-Skill（23 星，无许可证）、pornthepp/ai-video-acting-skill（0 星）。目标是给 AI 视频模型写打得明白、打得稳、不穿模的打斗提示词，面向即梦和豆包的 Seedance、可灵、海螺、MiniMax，单段 4 秒到 15 秒，30 秒成片按段拼。

用法：按任务意图在索引里命中一条能力，先读触发条件，再按做法写，最后过检查清单。边界写明不做的事与判停点，遇到就停下问用户，不硬套方法。

每条能力结构固定：触发条件、做法、检查清单、来源库。能力里凡写数字的，均转述自来源库的已验证规则，未验证的口径已排除，见 needs-review.md。引用均不超过 50 字，引用原文只作写法例证，完整提示词去来源库看。

## 能力索引

## 动作编排与招式（8 条）

- bd.01 具体动作优先于笼统描述
- bd.02 四拍动作语法
- bd.03 招式库与流派选型
- bd.04 动作组合与连续性衔接
- bd.05 多人打斗编排
- bd.06 节奏词映射
- bd.07 三十秒九段节奏曲线
- bd.08 仙侠法术与机甲巨兽

## 分镜与时间结构（8 条）

- jg.01 二秒钩子
- jg.02 三层架构与四段骨架
- jg.03 生成段重组与可切点
- jg.04 三镜与四镜协议
- jg.05 单镜时长上限
- jg.06 一镜一主动作
- jg.07 大型提示词结构
- jg.08 校验与降级机制

## 镜头与运镜（5 条）

- jt.01 打斗镜头与五档运镜库
- jt.02 镜头焦段与冲击
- jt.03 动态镜头能量
- jt.04 身份块与动作块分离
- jt.05 参考视频优先与动作迁移

## 撞击与特效（5 条）

- tx.01 冲击效果百科
- tx.02 三级碰撞配方
- tx.03 触发源特效体系
- tx.04 环境特效遮蔽撞击点
- tx.05 动作特效预设调用

## 防穿模与多主体（6 条）

- fx.01 零缠斗法则
- fx.02 单主体分镜隔离
- fx.03 接触与后果分离
- fx.04 状态转换提示词
- fx.05 五轴基准评估
- fx.06 负面提示词库

## 动力学与反应（4 条）

- dx.01 动力链与重心转移
- dx.02 受击反应延迟与身体层次
- dx.03 物理语言代替情绪词
- dx.04 动作向量化

## 模型分流与平台（6 条）

- mx.01 动作场景模型分流
- mx.02 Seedance 2.5 打斗策略
- mx.03 Kling 打斗策略
- mx.04 MiniMax 与 Hailuo 打斗策略
- mx.05 Runway 与 Sora 与 Luma 打斗策略
- mx.06 平台优化与输出流程

## 音效（2 条）

- yx.01 打斗音效设计
- yx.02 音频模式三选一

## 场景与环境（2 条）

- cj.01 环境竞技场指南
- cj.02 场景与反馈强度匹配

## 暴力分级与安全（2 条）

- aq.01 暴力分级与风控黑白名单
- aq.02 枪战受限写法

## 动作编排与招式

### bd.01 具体动作优先于笼统描述

来源库：beshuaxian/higgsfield-seedance2-jineng、OSideMedia/higgsfield-ai-prompt-skill、pornthepp/ai-video-acting-skill、Yunwuxin-666/Wuxin-Film-Skill。来源文件：hx skills/05-fight-scenes/SKILL.md，os skills/higgsfield-prompt/SKILL.md，pt references/action_shot_decomposition.md，wx fight-choreo/SKILL.md。

触发条件：提示词里写了激烈打斗、精彩对决、动作很帅这类笼统词，生成结果含糊缠斗，看不清谁打谁。

做法：把笼统词换成可执行的身体动作序列，例如后退三步格挡再转身肘击。每一步写清脚步落点、身体转向角度、手臂防御位置和反击目标。把抽象打斗词换成可观察的运动学描述，例如先落脚，再转肩，再单次挥臂，再后退一步。不要写有力的一拳这类无法测量的词，改写拳头命中、汗水飞溅、对手头部后仰这类可观察的物理后果。

检查清单：每镜只有一个主导身体动作加一个可读反应；动作序列能由特技演员照着复现；没有只剩情绪词的句子。

原文例证：“Specificity creates visual clarity”

### bd.02 四拍动作语法

来源库：Yunwuxin-666/Wuxin-Film-Skill、OSideMedia/higgsfield-ai-prompt-skill、Dream2046-Light/duel-fight-prompt。来源文件：wx fight-choreo/SKILL.md，os skills/higgsfield-prompt/SKILL.md，dl references/00-skeleton.md。

触发条件：动作链写出来前后脱节，观众看不出谁先动手、谁被打中、谁收势。

做法：每条动作链保留起势、发力、反应、收势四拍。起势写视线、站位、支撑脚、距离与威胁方向。发力写拳踢抓摔闪避或武器线路与命中。反应写对手头部、肩部、髋部、脚步与物品移动及空间结果。收势写主角平衡、护手、落地、武器位置与向下一拍的过渡。每个提示词只放一条清晰可见的动作链，时长控制在 4 到 8 秒，复杂场景拆成多条提示词。动作提示词走蓄势、爆发、余波三段，结尾必须写清物理后果。

检查清单：四拍齐全；每拍都有可见身体动作；收势能接下一拍。

原文例证：“Never output only 激烈打斗”

### bd.03 招式库与流派选型

来源库：beshuaxian/higgsfield-seedance2-jineng、Dream2046-Light/duel-fight-prompt、Yunwuxin-666/Wuxin-Film-Skill。来源文件：hx skills/05-fight-scenes/SKILL.md，dl references/05-move-library.md，wx fight-choreo/references/action-types-50.md。

触发条件：要写一场有门派味道的打斗，或者招式写出来像乱挥，不知道该用什么动作。

做法：先选定流派再写动作，不要把不同流派的步法和发力方式混在同一段打斗里。徒手可选功夫、空手道、泰拳、卡波耶拉、综合格斗、跆拳道、柔道。兵器可选剑术、双刀、长枪、棍术、双枪、鞭链。冷兵器攻段有斜撩、横削、直刺、逆斩、回旋斩与五连斩七连斩九连斩，防段有剑格挡、交叉格挡、横剑格挡、侧闪与后仰避过，反段有斩钢闪、借力侧身、反手一撩、肘击反制与剑柄击肋。拳脚攻段有直拳连段、摆拳、上勾拳、肘击、侧踹、扫踢、腾空飞膝、舍身飞踢与拳腿连段。近身打击十类、腿法下盘八类、冷兵器与道具十类见来源库五十类动作表，按类取用。提示词里直接写招式名就能调用对应的身体运动模式。

检查清单：流派与招式一致；攻防反收四段齐全；招式名与动作描述对应。

原文例证：“斜撩→横削→直刺→逆斩→回旋斩”

### bd.04 动作组合与连续性衔接

来源库：Yunwuxin-666/Wuxin-Film-Skill、OSideMedia/higgsfield-ai-prompt-skill、Dream2046-Light/duel-fight-prompt。来源文件：wx fight-choreo/references/action-types-50.md，os skills/higgsfield-seedance/FAILURE-MODES.md，dl references/07-timeline-rules.md。

触发条件：多招打斗按招式拆成独立片段生成，接缝处停顿，整体像幻灯片。

做法：组合只在因果清晰时用，前一招的失衡或武器位置要成为后一招的起点，中间要有反作用、武器交缠、跌落线路、身体转动、物品传递、撞击反弹或落地滑移等可见衔接。推荐组合包括刀线闪避加腕部控制、走廊一对多加肩撞、跑酷追逐接触加低身滑躲踢、地面护挡缠斗加骑乘逃脱桥滚、武侠轻功加剑刃交锋。修复顺序是先做帧链，让上一条最后一帧成为下一条第一帧，并且动作要跨过切点而不是停在招式完成处。多轮续拍时，上一段最后一段的尾帧描述作为本段第一段的首帧描述。未完结动作必须在本段前两镜内接续完毕。

检查清单：每处衔接都有可见因果；动作跨过切点；续拍首尾帧对得上。

原文例证：“with the action crossing the cut mid-move”

### bd.05 多人打斗编排

来源库：beshuaxian/higgsfield-seedance2-jineng、Yunwuxin-666/Wuxin-Film-Skill、Dream2046-Light/duel-fight-prompt。来源文件：hx skills/05-fight-scenes/SKILL.md，wx fight-choreo/references/action-types-50.md，dl SKILL.md。

触发条件：群战写出来无主次，几个人同时乱打，画面挤成一团。

做法：多人打斗先定一个主焦点人物，其余攻击者按左右前后分占位置。二打一按轮换进攻组织，一人进攻时另一人从反角度切入，防守方要在牺牲角度或做高难度闪避之间选择。三人以上要分区写前景主战和背景副战，或按波次推进，每波增加人数和压迫感。群战不堆人数，先写进入顺序再写逐个反应，例如第一人被肘击逼退，第二人被推撞墙，第三人刚进入画面。同框主体超过 2 个强制拆段。空间群战要先写空间限制与人数进入顺序，再写主角利用墙面、门框、扶手、车门或人群缝隙的移动路径。

检查清单：主焦点唯一；敌人逐个进入威胁区；每镜人数不超过 2 个主动作主体。

原文例证：“Two mercenaries attack the lone Swordmaster”

### bd.06 节奏词映射

来源库：Yunwuxin-666/Wuxin-Film-Skill、beshuaxian/higgsfield-seedance2-jineng。来源文件：wx fight-choreo/references/rhythm-camera-prompts.md，hx skills/05-fight-scenes/SKILL.md。

触发条件：提示词里写了节奏词，例如短狠、压迫、高手感，但生成结果没打出那个味道。

做法：节奏词先映射到身体动作再写进提示词。短狠突然对应肘膝肩撞与推墙，狼狈危险真实对应地面缠斗与护挡翻滚，压迫窒息对应走廊拥挤与贴墙碰撞。展示实力对应干净反击与夺械摔投，高手感优雅对应武器弧线与转体落点，逃脱追逐对应翻越滑行与穿缝，喜剧对应道具格挡与停顿反应。游戏感动捕感对应可读连招与硬定格，复仇压抑爆发对应克制起手与突然近身重击，惊险险胜对应擦身而过与踉跄反击。每场打斗按蓄势、冲击、恢复、再加速的循环组织，冲击段只保留两到三秒的最高强度动作，随后安排短暂重整，下一轮在上一轮基础上提高速度和风险。

检查清单：每个节奏词都有对应的身体动作；冲击段不超过三秒；有恢复段。

原文例证：“短、狠、突然”

### bd.07 三十秒九段节奏曲线

来源库：Dream2046-Light/duel-fight-prompt。来源文件：dl references/07-timeline-rules.md，dl references/00-skeleton.md。

触发条件：要写一整场 30 秒打斗，不知道每段放什么、放多久、哪里是高潮。

做法：默认 30 秒对应 15 到 17 镜，九段为起手、试探、连招升级、第一次重击、对手反击、主角被压制、大招蓄力、终极对撞与收尾。连招升级占比最高，约 27%，第一次重击与终极对撞是节奏支点，主角被压制一节不可删除。巨兽题材把连招升级改为远距离投掷加命中，把被压制改为被巨爪拍飞，仙侠题材可把大招蓄力与终极对撞扩展为双大招，总镜数到 18。章节层负责一场完整打斗，总时长 23.5 到 30 秒，面向人阅读与审片。

检查清单：九段齐全；被压制一节在；两处支点落在重击与对撞。

原文例证：“主角必须至少被压制一次”

### bd.08 仙侠法术与机甲巨兽

来源库：Dream2046-Light/duel-fight-prompt。来源文件：dl references/05-move-library.md，dl references/02-character-bible.md。

触发条件：要写法术对轰、机甲格斗或打巨兽，写出来只剩光效，没有打击感。

做法：仙侠法术有万剑归宗、墨染山河、狂风绝息斩、墨龙缠身、千风归一与法阵虚影。万剑归宗、墨染山河与狂风绝息斩标为大招，墨龙缠身与千风归一为大招蓄力，法阵虚影为无碰撞。法术写法要与三级碰撞的大招配方绑定，蓄力节拍必须先用时间流速骤降做前摇。机甲打击感来自吨位、液压、推进器、金属形变与火花，全程无血液，受击统一写为装甲损伤。巨兽设定先写体型皮肤甲壳四肢头部眼睛与口器，再写周身妖气与渗出物，并与对手特效色形成强烈对立。受击时按鳞甲碎裂、痛吼后退与动作迟缓三类写，给主角留出窗口期。

检查清单：法术绑定碰撞等级；机甲无血液描写；巨兽受击有三类反应之一。

原文例证：“飞剑凝聚成阵，万剑齐发”

## 分镜与时间结构

### jg.01 二秒钩子

来源库：beshuaxian/higgsfield-seedance2-jineng、OSideMedia/higgsfield-ai-prompt-skill。来源文件：hx skills/05-fight-scenes/SKILL.md，hx skills/08-anime-action/SKILL.md，os skills/higgsfield-recipes/SKILL.md。

触发条件：打斗开场平淡，前两秒抓不住人，观众直接划走。

做法：开场两秒必须交代冲突强度和打击质感。写实钩子十式包括定格在打击顶点、兵器相撞迸出火花、直冲镜头、慢动作拳面接触，每种钩子规定时长和视觉落点，例如定格约 0.5 秒，慢动作约 0.25 倍速。动漫钩子十二式包括眼睛特写加光反射、速度线爆发、变身闪光和气场爆炸，每种钩子绑定一种动漫视觉符号，例如十字形冲击高光、樱花风、汗滴和网点色调切换。动作追逐按建立、追赶、障碍、高潮四段推进，中间只放一个明确障碍加一个明确应对，例如铁门落下后从下方滑过。

检查清单：前两秒有钩子；钩子有时长和落点；只放一个障碍加一个应对。

原文例证：“Weapon Clash with Spark Explosion”

### jg.02 三层架构与四段骨架

来源库：Dream2046-Light/duel-fight-prompt。来源文件：dl references/00-skeleton.md，dl assets/templates/variant-auto.md。

触发条件：长打斗写出来结构散，生成段之间接不上，不知道按什么层级组织。

做法：三层架构分章节层、生成段层、分镜镜层。章节层负责一场完整打斗，总时长 23.5 到 30 秒。生成段层是真正投喂视频模型的单元，每段 4 到 15 秒，向上取整到整数秒。分镜镜层是导演语言，每镜 1.0 到 3.0 秒，保留四段骨架，再由重组规则合并成生成段。每个分镜镜按固定顺序写四段，分别是复合运镜、极速动势与拆招、锚定特效与碰撞、环境反馈。受击反馈为可选段，只在反派有实质反击时补充。标题区另有画质风格头、场景设定、人物详细设定与音频声明，共同构成章节头部。分镜结构有三型，分别为累计时间轴、单片时长与内联紧凑。有台词对白选累计时间轴，纯动作高频拆招选单片时长并作为默认推荐，要求压缩篇幅选内联紧凑。

检查清单：三层齐全；每镜四段齐全；结构选型有一句话理由。

原文例证：“真正投喂视频模型的单元”

### jg.03 生成段重组与可切点

来源库：Dream2046-Light/duel-fight-prompt、OSideMedia/higgsfield-ai-prompt-skill。来源文件：dl references/07-timeline-rules.md，os skills/higgsfield-seedance/FAILURE-MODES.md，os skills/higgsfield-motion/SKILL.md。

触发条件：分镜写好了，但不知道怎么合并成能投喂模型的生成段，切点选错导致动作断在半路。

做法：重组输入为分镜镜列表，输出为生成段列表，每段由 2 到 4 个相邻分镜镜合并而成，时长向上取整到模型支持的整数秒。可切点包括重碰撞或大招爆发的命中帧、全屏定格、收招、场景切换与能量爆发峰值，轻碰撞不是可切点。切段规则为段内镜数到 4 强制切，遇到可切点且累计时长达到模型下限就切，累计时长达到模型上限必须切，段数不足 2 镜时与后段合并并报警告。节拍密度也要守：模型在每 5 秒内只能稳定处理一到两个清晰动作节拍，3 到 5 秒放一到两个，5 到 8 秒放两到三个，8 到 12 秒放三到五个，超过密度就拆成多镜或延长时长。

检查清单：每段 2 到 4 镜；切点只落在可切点；节拍密度不超标。

原文例证：“2-4 个相邻分镜镜 → 1 个生成段”

### jg.04 三镜与四镜协议

来源库：pornthepp/ai-video-acting-skill。来源文件：pt README.md，pt SKILL.md。

触发条件：要写一段 5 秒到 8 秒的短打斗，不知道拆几镜、每镜放什么。

做法：三镜总时长约 4.2 秒。第一镜 1.5 秒站姿对峙，重心落在后脚，双手保持高位防守。第二镜 1.2 秒爆发前冲，用肩部或打击动作撞向对手，撞击点同时爆出环境特效。第三镜 1.5 秒收尾，对手后退踉跄，攻击者半步后撤并保持防守呼吸。四镜总时长约 5 秒到 8 秒。第一镜 1.5 秒建立紧张感，第二镜 1.0 秒闪避加反击，第三镜 1.2 秒撞击加坠落反应，第四镜 2.0 秒恢复对峙。每镜只放一个主动作，镜头从静止漂移切到快速甩镜再切到低角度撞击，最后回到透过尘雾的中近景。

检查清单：每镜一个主动作；撞击镜有环境特效；收尾镜回到对峙。

原文例证：“SHOT 1 - TENSION/STANCE - 1.5s”

### jg.05 单镜时长上限

来源库：pornthepp/ai-video-acting-skill、OSideMedia/higgsfield-ai-prompt-skill。来源文件：pt SKILL.md，os templates/01-cinematic-action-chase.md，os skills/higgsfield-motion/SKILL.md。

触发条件：单镜写得太长，生成出来人物漂浮滑步、肢体变形。

做法：任何单次连续打斗镜头不得超过 2.0 秒，超过就会出现漂浮滑步和肢体变形。用户要 5 秒或 8 秒打斗时，必须自动拆成 3 到 4 个短镜，每镜 1.0 秒到 1.8 秒。剪辑点本身就是卖力量的手段，不是单纯切分时长。每条片段只安排一个主动作，最多再加一到两个次动作，复杂序列要拆成多条片段再剪接。快速动作若反复变形，可先用慢动作生成再在后期加速，物理会更干净。

检查清单：单镜不超过 2.0 秒；长打斗已拆成短镜；每镜主动作唯一。

原文例证：“NEVER output single continuous action takes”

### jg.06 一镜一主动作

来源库：OSideMedia/higgsfield-ai-prompt-skill、pornthepp/ai-video-acting-skill、beshuaxian/higgsfield-seedance2-jineng。来源文件：os templates/01-cinematic-action-chase.md，pt references/action_shot_decomposition.md，hx skills/05-fight-scenes/SKILL.md。

触发条件：同一镜里塞了出拳、闪避、抓握、反击和摔投，生成出来全乱套。

做法：每镜等于一个主导身体动作加一个可读反应加一个简单镜头运动加一个物理后果。不要把出拳、闪避、抓握、反击和摔投塞进同一镜。追逐加打斗加爆炸放在同一条片段里会互相挤占，模型难以同时保真。大型制作提示词按场景氛围、双人设定、开场钩子、多轮交手、升级、高潮和收尾组织，每段都要填具体动作、镜头和效果。

检查清单：一镜一主动作；有可读反应；有物理后果。

原文例证：“one dominant body action”

### jg.07 大型提示词结构

来源库：beshuaxian/higgsfield-seedance2-jineng、Yunwuxin-666/Wuxin-Film-Skill、OSideMedia/higgsfield-ai-prompt-skill。来源文件：hx skills/05-fight-scenes/SKILL.md，hx skills/05-fight-scenes/zh-CN/SKILL.md，wx fight-choreo/references/rhythm-camera-prompts.md，os skills/higgsfield-prompt/SKILL.md。

触发条件：要写一条能直接提交生成的大型打斗提示词，不知道按什么顺序组织。

做法：每个视频提示词都要填满模型、镜头、主体、观感、动作这五层，缺一层就等于少给模型一个决策依据。主体与动作要放在提示词前 20 到 30 字内，因为早期词权重更高，镜头与观感随后补齐。成片提示词按八步顺序写，先写稳定主体与连续性细节，再写地点时间与空间锚点，接着写一条可见的动作链，包含起势发力反应与收势。然后写镜头景别、镜头质感、角度、支撑与运镜，再写灯光色彩材质质感与氛围，接着写声音提示，最后写风格与安全限制并附负面提示词。输出结构固定为动作场景判断、动作链设计、镜头冲击力、视频提示词、负面提示词与可选剪辑建议，超过 8 秒的场景要拆成 4 到 8 秒的镜头并写明转场衔接方式。中文版另有六层架构，从战斗类型、打击力学、对手反应、武器细节、镜头视角和音频节奏逐层细化，适合按层拼装中文提示词。打斗版主模板按场景氛围、双人设定、开场钩子、多轮交手、升级、高潮和收尾组织，每段都要填具体动作、镜头和效果。

检查清单：五层齐全；主体动作在前 30 字内；八步顺序不乱；超 8 秒已拆段。

原文例证：“Model, Camera, Subject, Look, Action”

### jg.08 校验与降级机制

来源库：Dream2046-Light/duel-fight-prompt、Yunwuxin-666/Wuxin-Film-Skill。来源文件：dl SKILL.md，dl references/09-negative-prompts.md，wx fight-choreo/references/rhythm-camera-prompts.md。

触发条件：提示词写完了直接投喂，结果出问题不知道哪错，也不知道怎么降级保底。

做法：输出前要过自检清单，包括四段齐全、编号连续整数、单镜时长、生成段时长、总时长、触发源、碰撞配方精确匹配、禁用词、符号规范、有来有回、零站桩与音频声明一致。降级三原则为不静默拒绝、不静默降级、不静默截断，任何降级都要同时写状态为已降级，写明警告原因并给出替代方案。常见降级包括连续翻转减到 2 次、同框主体超过 2 个强制拆段、双长兵对绞简化为碰撞加分开、超长一镜到底拆段加尾帧接首帧。质量检查要求动作能由训练过的特技演员或动捕演员完成，对手反应要让攻击可信，镜头不能遮住关键身体力学，场景要有清晰运动轴线。攻击来源、攻击目标、发力方向、反作用方向与落点收势点在多镜头之间不能颠倒，冲击要用接触、形变、滑移、踉跄、衣料拉扯、武器交缠、地面痕迹、环境反应或定格收势来证明，不能只靠光效。

检查清单：自检清单全过；降级写明状态、原因与替代方案；冲击有可见证明。

原文例证：“不静默拒绝、不静默降级、不静默截断”

## 镜头与运镜

### jt.01 打斗镜头与五档运镜库

来源库：beshuaxian/higgsfield-seedance2-jineng、Dream2046-Light/duel-fight-prompt。来源文件：hx skills/05-fight-scenes/SKILL.md，hx skills/08-anime-action/SKILL.md，dl references/04-camera-library.md。

触发条件：打斗镜头写来写去只有推近拉远，不知道该用什么运镜。

做法：打斗镜头二十式分成动态移动、静态机位、焦点曝光和转场四类。动态类包括前推、后拉、横移跟拍、环绕、甩镜和急推，静态类包括荷兰角、低机位、高机位和冲击特写。使用原则是进攻时推近，防守时拉远或横移，僵持时环绕，混战时用甩镜制造混乱感。运镜按功能分五档，分别是交代、压迫、加速、暴击与收束，每镜从起幅档到运动档再到落幅档各取一个词组合成 2 到 3 段运镜。交代档用于开场与空间关系，压迫档用于对峙张力与体积差，加速档用于动作推进，暴击档与三级碰撞绑定，收束档用于招式收势与情绪落地。另有时间类与遮挡类特殊技法，例如时间流速骤降、前景水花遮挡、穿墨幕与视线盲区欺骗。动漫版强调有限动画加关键冲击帧，动作不是全程平滑，而是关键帧之间留出停顿，让观众读清动作。

检查清单：每镜运镜不超过 3 段；进攻防守僵持的运镜方向对得上；暴击镜绑定碰撞等级。

原文例证：“大远景 CRANE 升降拉升”

### jt.02 镜头焦段与冲击

来源库：Yunwuxin-666/Wuxin-Film-Skill、OSideMedia/higgsfield-ai-prompt-skill。来源文件：wx fight-choreo/references/rhythm-camera-prompts.md，os skills/higgsfield-camera/SKILL.md。

触发条件：镜头写了推近拉远，但冲击感出不来，或者特写切错了焦段。

做法：镜头先定在动作线路上，侧面、四分之三正面、过肩、低角度或贴地角度中选一个，再按焦段分工，空间与移动用 24 毫米，人体动作用 35 毫米，近身打击与缠抱用 50 毫米。手部抓握、刀线、剑刃交锋、脚步落点与物品碎裂用 85 到 100 毫米特写，冲击不靠乱晃镜头，而靠可读的身体力学加命中瞬间的短暂强调。打斗与追逐必须点名平台能识别的镜头预设，而不是写镜头跟得很戏剧化这类空话。常用组合是 Action Run 低跟拍、FPV Drone 穿梭、Crash Zoom In 冲击、Bullet Time 定格高潮、Whip Pan 快速横摇。每个片段只用一个主运镜，需要多个运镜就拆成多条片段再衔接。Cinema Studio 3.0 的单镜头只写一个主运镜，堆叠推拉加摇移加俯仰是抖动与失败的首要原因。

检查清单：焦段与拍摄对象对应；每片段一个主运镜；预设名称写全写准。

原文例证：“Use 35mm for most human action”

### jt.03 动态镜头能量

来源库：pornthepp/ai-video-acting-skill、OSideMedia/higgsfield-ai-prompt-skill。来源文件：pt SKILL.md，os skills/higgsfield-camera/SKILL.md。

触发条件：打斗拍出来像慢动作演练，没有速度感和暴力感。

做法：用快速甩镜、撞击式推近、45 度快门角观感和跟随动量来传递高速暴力感。镜头只在撞击瞬间抖动一次，随后立刻稳定，让观众能读清反作用。不要在同一镜内同时叠加环绕、甩镜、抖动和变焦。镜头运动要跟着焦点人物的情绪走，而不是只求好看，愤怒与紧张用呼吸感手持加细碎抖动，冷静与自信用平稳呼吸感手持。震惊用静止加极慢推近，动作段落用每秒 60 帧加 180 度快门保证运动清晰。情绪在单镜内变化时，镜头也要分段写清开场、过渡与收尾的运动变化。

检查清单：撞击瞬间只抖一次；单镜不叠加多种运镜；镜头情绪与人物情绪一致。

原文例证：“fast whip-pans, crash zooms”

### jt.04 身份块与动作块分离

来源库：OSideMedia/higgsfield-ai-prompt-skill、Dream2046-Light/duel-fight-prompt。来源文件：os skills/higgsfield-prompt/SKILL.md，dl references/02-character-bible.md。

触发条件：同一角色跨镜头长相漂移，或者换了动作就换了脸。

做法：使用 Soul ID 或多镜头同角色时，必须把提示词拆成身份块与动作块两部分，身份块只写长相、体型、服装与配色。动作块只写动作编排、速度、环境运动与镜头，绝不重复外貌描写。混写会导致身份在运动中漂移，分离后角色一致性更容易保住。角色设定先写外观体型服装，再写武器，最后写周身特效的色系形态与触发源清单。武器设定必须写尺寸材质外观细节与使用痕迹，例如划痕与旧化质感，避免模型给出崭新发亮的武器。

检查清单：身份块与动作块分离；外貌描写只出现一次；武器有使用痕迹。

原文例证：“Identity Block + Motion Block”

### jt.05 参考视频优先与动作迁移

来源库：OSideMedia/higgsfield-ai-prompt-skill。来源文件：os skills/higgsfield-motion/SKILL.md，os model-guide.md。

触发条件：文字怎么调动作都不对，模型理解不了想要的编排和重量感。

做法：打斗与追逐最可靠的做法是先上传参考视频，让模型直接读取其中的动作编排与物理重量，而不是只靠文字逐帧描述。提示词只写一到三句高层动作，再加程度副词与物理后果，例如尘土扬起、火花飞散。动作参考与镜头参考可以来自不同视频，但要在提示词里分别写清各自的任务。已有真人打斗参考时可用 Kling 3.0 Motion Control，把参考视频里的全身动作迁移到角色图上，提示词只写周围世界而不重写动作。参考时长为 3 到 30 秒，必须是单人连续镜头，不能有剪切，速度过快会迁移失败。Genjutsu 是另一条迁移通道，把参考视频的动作转到参考图主体上，分辨率为 480p 到 1080p。

检查清单：参考视频单人连续无剪切；提示词只写高层动作；动作与镜头参考分开写任务。

原文例证：“Reference @Video1 for movement choreography”

## 撞击与特效

### tx.01 冲击效果百科

来源库：beshuaxian/higgsfield-seedance2-jineng、pornthepp/ai-video-acting-skill。来源文件：hx skills/05-fight-scenes/SKILL.md，pt references/combat_kinematics_fx.md。

触发条件：撞击写出来没动静，观众感觉不到力量落在哪。

做法：冲击效果按尘土微粒、光与火花、身体反应、冲击波和环境破坏分层列出。尘土来自脚步和落地，火花来自兵器相撞，衣物和头发随打击气流飘动，汗水随转身飞溅。高级层还包括能量拖尾、接触瞬间减速、短暂去色和残影，使用时每段只选一种主效果，避免全部堆叠。按撞击类型选特效：雨中拳击用水花，脚掌着地用水洼或尘土，撞墙用墙灰，刀盾相击用火花加木屑，车辆擦碰用轮胎烟加碎片，破门用木屑加尘土。特效措辞要短而定向，例如短暂定向火花爆发，碎片先散开细尘后悬浮，玻璃从接触点呈蛛网放射再向外碎裂。特效只在撞击窗口出现一次，不要全程弥漫。

检查清单：每段一种主效果；特效有明确来源和方向；只在撞击窗口出现。

原文例证：“Metal Spark Burst: Weapon-to-weapon contact”

### tx.02 三级碰撞配方

来源库：Dream2046-Light/duel-fight-prompt。来源文件：dl references/03-collision-system.md，dl references/06-environment.md。

触发条件：轻招和重招写出来一个样，大招没有大招的样子。

做法：先按触发条件定级，再查表复制配方，轻碰撞用于连招格挡与擦身，重碰撞用于全力劈砍被硬接与击飞破防，大招爆发用于必杀技与全屏能量对轰。配方字符串必须精确匹配，数值与层数都不许改写，只允许在末尾追加角色种族或属性特效。次数必须与拆招段里的实际接触次数一致，无碰撞的镜头要写无碰撞，不许硬凑。环境反馈按水域、岩石、植被、大气与光影五类取用，强度必须与碰撞等级匹配，轻碰撞只给局部反应，重碰撞给大范围反应，大招做全环境重构。

检查清单：碰撞等级与招式匹配；配方精确匹配；环境反馈强度与等级匹配。

原文例证：“水墨黑白冲击帧+0.05s抽帧+局部负片+镜头轴向微甩+属性粒子飞溅”

### tx.03 触发源特效体系

来源库：Dream2046-Light/duel-fight-prompt。来源文件：dl references/02-character-bible.md。

触发条件：特效飘在画面里，不知道从哪来，两种特效糊在一起分不清谁是谁的。

做法：所有特效都必须有物理触发源，写法要同时写清贴附位置、跳跃爬行缠绕的动态动词，以及从主触发源向外扩散的起点。常见触发源来自武器、身体与服饰，例如剑格、剑脊、指节、衣摆、护腕与肩甲。双角色特效必须色系对立与形态对立，否则画面容易糊在一起，巨兽则另有甲壳缝隙、口器与尾部的专属特效写法。特效色系有墨金、青白、红白、蓝色水墨、暗紫妖气、灰白与赤金，各自对应不同的角色气质。

检查清单：每个特效都有触发源；双角色色系与形态对立；特效色与角色气质对应。

原文例证：“死死贴附在剑身、剑格、指节、衣摆边缘上跳跃、爬行、缠绕”

### tx.04 环境特效遮蔽撞击点

来源库：pornthepp/ai-video-acting-skill。来源文件：pt SKILL.md，pt references/action_shot_decomposition.md。

触发条件：肢体接触帧总穿模变形，拳头贴脸那一帧没法看。

做法：每次撞击必须在接触点触发环境爆发，用沙尘、雨水飞溅、玻璃碎裂、火花或墙灰掩盖肢体接触的瑕疵，同时放大动能感。特效要有明确来源和方向，例如水从被击中的衣服向外喷，尘从脚下地面向上踢起。特效是撞击代理，不是全场装饰。不要让模型直接生成最难的接触帧，改为生成撞击前状态和撞击后状态，再用剪辑、动态模糊、前景遮挡或特效完成撞击。结构是接近加蓄力，然后切到撞击遮蔽，再切到后果恢复。撞击前关键帧保留 10 厘米到 20 厘米可见间隙，撞击后关键帧身体已经分离。

检查清单：撞击点有环境爆发；撞击前后帧分离；特效有来源和方向。

原文例证：“sand/dust cloud, rain spray burst”

### tx.05 动作特效预设调用

来源库：OSideMedia/higgsfield-ai-prompt-skill、beshuaxian/higgsfield-seedance2-jineng。来源文件：os skills/higgsfield-motion/SKILL.md，hx skills/05-fight-scenes/SKILL.md。

触发条件：在 Higgsfield 这类带预设的平台上做打斗，不知道该套哪个预设。

做法：平台提供上百个具名动作特效预设，写法是在场景描述后写明在哪个时刻套用哪个预设名称。打斗常用的是 Explosion、Plasma Explosion、Bullet Time Scene、Flame Transition 与 Air Bending 等，名称必须写全写准。严肃电影制作里社区实测很少用预设，更多用自由提示词写镜头，预设更适合短视频与社交传播类打斗。冲击效果百科里每段只选一种主效果，预设同样一次只套一个。

检查清单：预设名称写全写准；写清套用时刻；一次只套一个。

原文例证：“Apply Plasma Explosion preset”

## 防穿模与多主体

### fx.01 零缠斗法则

来源库：pornthepp/ai-video-acting-skill、Yunwuxin-666/Wuxin-Film-Skill。来源文件：pt SKILL.md，pt references/action_shot_decomposition.md，wx fight-choreo/references/action-types-50.md。

触发条件：写了缠斗、锁技、过肩摔，生成出来手臂扭转 360 度、身体融合成团。

做法：严禁腕锁、臂锁、旋转杠杆、连续过肩摔、画面外伸入的无主手臂，以及地面长时间缠斗。这些动作要求模型同时维持多关节拓扑和身体遮挡，最容易导致手臂扭转 360 度和身体融合成团。被禁动作一律改成闪避加打击，再用分镜表现结果。复杂武术、快节奏互殴、缠斗、腕锁、过肩摔和连续旋转踢都属于高熵描述，会让模型自行发明多条轨迹。替换方法是拆成单动作加单反应，例如一次低踢或一次直拳接一次后退，或先拍拉离平衡再切到已经侧向倒地。

检查清单：禁用的缠斗动作一个没有；高熵描述已拆成单动作加单反应；无主手臂不出现。

原文例证：“Wrist locks, armbars, rotational leverages”

### fx.02 单主体分镜隔离

来源库：pornthepp/ai-video-acting-skill、OSideMedia/higgsfield-ai-prompt-skill、Dream2046-Light/duel-fight-prompt。来源文件：pt SKILL.md，os skills/higgsfield-seedance/FAILURE-MODES.md，dl SKILL.md。

触发条件：两个身体在同一镜内持续纠缠，生成出来分不清谁的手是谁的。

做法：每一切只让一个主体做主动作，另一主体只做反应，不让两个身体在同一镜内持续纠缠。攻击镜只拍攻击者侧步加肘击或掌击打向空处或镜头。受击镜单独拍受击者撞向地面、岩石或墙面，用单人物理反应代替双人接触计算。每个招式都要同时写明动作与落点方向，例如翻滚后对方头朝窗户、脸朝自己，否则每次生成落点都会不同。两人并行或多人出拳时还要锁人数、左右顺序与每只手的归属，避免多出无主的手臂。

检查清单：每镜一个主动作主体；落点方向写清；人数与左右顺序锁定。

原文例证：“Cut A (Attacker Focus)”

### fx.03 接触与后果分离

来源库：pornthepp/ai-video-acting-skill。来源文件：pt references/action_shot_decomposition.md，pt references/combat_prompt_engineering.md。

触发条件：直接写拳头打中脸，接触帧总崩。

做法：不要让模型直接生成最难的接触帧，改为生成撞击前状态和撞击后状态，再用剪辑、动态模糊、前景遮挡或特效完成撞击。结构是接近加蓄力，然后切到撞击遮蔽，再切到后果恢复。撞击前关键帧保留 10 厘米到 20 厘米可见间隙，撞击后关键帧身体已经分离。双关键帧流程是先做一张撞击前关键帧，再在同一图基础上只改姿态反应和特效，得到撞击后关键帧，不要两张图分开重新生成。撞击前关键帧要求双人剪影清晰分离，攻击臂离对手仍有可见间隙。撞击后关键帧要求攻击臂已越过中线开始收回，受击者躯干已转开并后退，雨水或尘雾悬在两人之间。

检查清单：接触帧被遮蔽或跳过；前后关键帧同一图改姿态；撞击前后身体分离。

原文例证：“Hide the Contact, Show the Consequence”

### fx.04 状态转换提示词

来源库：pornthepp/ai-video-acting-skill、OSideMedia/higgsfield-ai-prompt-skill。来源文件：pt references/combat_prompt_engineering.md，os skills/higgsfield-seedance/FAILURE-MODES.md。

触发条件：用编舞提示词命令模型设计整套打斗，模型自由发挥后动作全乱。

做法：不用编舞提示词命令模型设计整套打斗，改用状态转换提示词命令它连接撞击前状态到撞击后状态。每个短镜只写一个力、一个事件和一个结果，例如落脚、转胯、出直拳，雨水在接触点爆开，对手躯干后仰并后退一步。角色称呼全程固定，例如红夹克斗士在左、黑战术守卫在右，避免代词混淆执行者。每个招式都要同时写明动作与落点方向，截断动作也要写清完成态并让它停留片刻，例如盖子合严并保持不动，再切下一镜。

检查清单：每镜一个力一个事件一个结果；角色称呼固定；截断动作有完成态。

原文例证：“one readable kinetic transition”

### fx.05 五轴基准评估

来源库：pornthepp/ai-video-acting-skill、Yunwuxin-666/Wuxin-Film-Skill。来源文件：pt references/combat_prompt_engineering.md，wx fight-choreo/references/rhythm-camera-prompts.md。

触发条件：生成了几版打斗，不知道哪版能用，凭感觉挑。

做法：比较模型或随机种子时不只看是否帅，要看五项。身份连续性要求 A 不变成 B，拓扑完整性要求手臂仍属原主且无人多肢，执行者绑定要求攻击者出招而受击者后退，动量连续性要求撞后方向与撞前一致，可剪辑性要求有干净的撞击前和撞击后帧。五项全部通过才算可用打斗素材。通用负面提示词要禁动作断裂、人物漂浮、无重力飞行、肢体变形、手指错误、关节扭曲、武器穿模、武器突然消失、衣服突然变化、场景跳变、人物位置混乱、多人同时乱打、随机镜头旋转、过度运动模糊、看不清关键动作、血腥特写、内脏或断肢、过度慢动作、廉价游戏特效、夸张火花与无原因爆炸。

检查清单：五轴逐项打勾；负面提示词已追加；五项全过才算可用。

原文例证：“Identity continuity”

### fx.06 负面提示词库

来源库：Dream2046-Light/duel-fight-prompt、Yunwuxin-666/Wuxin-Film-Skill。来源文件：dl references/09-negative-prompts.md，wx fight-choreo/references/rhythm-camera-prompts.md。

触发条件：生成结果总出畸形肢体、多余手指、武器穿模、场景闪烁。

做法：全局固定负面词强制追加，不可关闭，只关动态部分，全局部分永远保留。中文全局负面词覆盖畸形肢体、多余手指、关节反折、身体穿模、武器穿模、面部崩坏、动作卡顿、帧间跳变、人物瞬移、场景闪烁、文字字幕水印与现代建筑服装等。动态负面词按题材、暴力分级与运动强度追加，总数建议不超过 28 条，超限时从后往前砍，MiniMax H3 没有独立负面词字段，要写在描述里用避免句式表达。不要写长串否定提示词，改写成正面可读状态，例如双手保持清晰分离，不要写禁止变形手指。

检查清单：全局负面词已追加；动态负面词不超过 28 条；MiniMax 写成避免句式。

原文例证：“畸形肢体，多余手指，关节反折”

## 动力学与反应

### dx.01 动力链与重心转移

来源库：pornthepp/ai-video-acting-skill、Yunwuxin-666/Wuxin-Film-Skill。来源文件：pt references/combat_kinematics_fx.md，wx fight-choreo/SKILL.md。

触发条件：出拳写出来轻飘飘，看不出力量从哪来。

做法：力量顺序是脚掌固定，然后骨盆移动旋转，躯干传力，肩部打开，手臂加速，最后到达目标。攻击前重心位于双脚之间或靠近稳定支撑，攻击时重心前移但不整个人飘起，攻击后有跟随动作和减速再收回。提示词要写清哪只脚承重，哪侧胯旋转，力量向哪个方向走。即使是武侠、奇幻、超级英雄或动漫风格打斗，也要保留可见发力来源，明确行进方向、命中或受压点、对手反应与落地收势，不能让特效代替身体力学。

检查清单：动力链顺序完整；承重脚与旋转胯写清；攻击后有跟随与收回。

原文例证：“He plants his lead foot”

### dx.02 受击反应延迟与身体层次

来源库：pornthepp/ai-video-acting-skill、OSideMedia/higgsfield-ai-prompt-skill。来源文件：pt references/combat_kinematics_fx.md，os skills/higgsfield-prompt/SKILL.md，os skills/higgsfield-facs/SKILL.md。

触发条件：被打的人像硬块一样瞬间飞出，观众觉得假。

做法：观众判断力量主要看撞击之后，不是看拳头是否贴脸。正确顺序是头部先侧转或侧摆，颈部跟随，肩胸随后旋转，髋部延迟半拍，最后重心出界才用恢复步找平衡。躯干受击时肩微内收，胸腹顺力后缩，膝盖弯曲。不要写整个人像硬块一样瞬间飞出。打斗中的愤怒、恐惧或震惊不能只写一个情绪词，要拆成眉毛、眼睛、呼吸、嘴唇与皮肤的具体变化，例如眉毛抬起、嘴唇微张、鼻孔缓慢吸气。分层情绪也要分主次写，主情绪放在脸上，次情绪放在呼吸、姿态与手部状态里。

检查清单：受击顺序头颈肩髋依次延迟；躯干反应有内收后缩；情绪拆成肌肉动作。

原文例证：“His head snaps sideways at impact”

### dx.03 物理语言代替情绪词

来源库：OSideMedia/higgsfield-ai-prompt-skill。来源文件：os skills/higgsfield-prompt/SKILL.md，os skills/higgsfield-facs/SKILL.md。

触发条件：提示词里情绪词很多，但每次生成出来的表情和力度都不一样。

做法：不要写有力的一拳这类无法测量的词，要写拳头命中、汗水飞溅、对手头部后仰这类可观察的物理后果。程度副词要写进动作里，例如缓慢地、猛烈地、爆发式地，让模型读到强度。风格词也要换成具体所指，例如导演名、布光方案或镜头规格，而不是只写史诗感。近景打斗与对峙可用面部动作编码系统写肌肉动作，例如 AU6 是颧肌上提，AU12 是嘴角上提，两者合起来才是真笑。只写 AU12 不写 AU6 会得到礼貌式假笑，眼睛不参与，适合表现强装镇定。每次生成最多用三到四个表情，超过后准确率会下降，代码加简短解剖说明可互相备份。

检查清单：情绪词已换成物理后果；程度副词写进动作；表情不超过四个。

原文例证：“fist connects, sweat flies off in slow motion”

### dx.04 动作向量化

来源库：OSideMedia/higgsfield-ai-prompt-skill、pornthepp/ai-video-acting-skill。来源文件：os skills/higgsfield-seedance/FAILURE-MODES.md，pt references/combat_prompt_engineering.md。

触发条件：同一招每次生成落点都不一样，或者多出无主的手臂。

做法：每个招式都要同时写明动作与落点方向，例如翻滚后对方头朝窗户、脸朝自己，否则每次生成落点都会不同。截断动作也要写清完成态并让它停留片刻，例如盖子合严并保持不动，再切下一镜。两人并行或多人出拳时还要锁人数、左右顺序与每只手的归属，避免多出无主的手臂。角色称呼全程固定，避免代词混淆执行者。

检查清单：每招有落点方向；截断动作有完成态；人数与手臂归属锁定。

原文例证：“he lands face toward her, head toward the window”

## 模型分流与平台

### mx.01 动作场景模型分流

来源库：OSideMedia/higgsfield-ai-prompt-skill、Dream2046-Light/duel-fight-prompt。来源文件：os model-guide.md，dl models/_common.md。

触发条件：不知道一场打斗该投哪个模型，凭感觉选总翻车。

做法：人物为主的追逐与打斗优先用 Kling 3.0，因为它在角色一致性、原生音频与多镜头上占优，时长为 3 到 15 秒。车辆追逐用 Veo 3.1，大场面、爆炸、人群与物理奇观用 Seedance 2.0 或 MiniMax Hailuo 2.3，流畅肢体与舞蹈武术也走 MiniMax Hailuo 2.3。默认主力为 Seedance 2.5，中文提示词可不改写直投，生成段为 4 到 30 秒，无 4K。复杂运镜、4K 与关键帧精控切到 Kling 4.0，英文提示词，最多 10 张关键帧，生成段为 3 到 30 秒，唯一支持 4K，续拍累计最长 2 分钟。英文短段与指令式编辑切到 MiniMax H3，英文提示词，生成段为 4 到 15 秒整数秒，固定 24 帧，无 4K，最高 2K，支持局部修改不重跑，不写环境音会出无声片。Sora 2 已于 2026 年 9 月 24 日停用，屋顶打斗等原 Sora 2 示例要改跑 Seedance 2.0。

检查清单：按场景类型选模型；语言与模型匹配；时长在模型支持范围。

原文例证：“Epic scale, crowds, physics”

### mx.02 Seedance 2.5 打斗策略

来源库：pornthepp/ai-video-acting-skill、Dream2046-Light/duel-fight-prompt。来源文件：pt SKILL.md，dl models/_common.md。

触发条件：用 Seedance 2.5 投打斗，提示词按别的模型写法写，总出不来。

做法：不用 Hailuo 式方括号标签，改用自然语言镜头编排加时间戳分段和多模态参考。结构是空间锚点加三段运动节拍加镜头轨迹加光线氛围。示例分段是 0 秒到 1.5 秒站姿，1.5 秒到 3.5 秒碰撞，3.5 秒到 5.0 秒回弹，每段只放一个主事件。中文提示词可不改写直投，参考上限为 30 图加 10 视频加 10 音频，生成段为 4 到 30 秒。短版提示词控制在 200 字以内，长版块状 Seedance 提示词改用结构检查代替字数上限。

检查清单：时间戳分段齐全；每段一个主事件；中文直投。

原文例证：“Timestamp-level beat structuring”

### mx.03 Kling 打斗策略

来源库：pornthepp/ai-video-acting-skill、OSideMedia/higgsfield-ai-prompt-skill。来源文件：pt SKILL.md，os model-guide.md。

触发条件：用 Kling 投打斗，角色一致性保不住，或者动作迁移失败。

做法：沿用主体加主体运动加场景加镜头加光线加氛围结构，动作描述优先于形容词。攻击者和受击者必须分离，每切只做一个动作，每切 1.0 秒到 1.5 秒。Motion Brush 只刷攻击者躯干和打击前臂等主质量轨迹，背景墙面和地面用 Static Brush 固定，文字提示必须与笔刷方向一致。已有真人打斗参考时可用 Kling 3.0 Motion Control，把参考视频里的全身动作迁移到角色图上，提示词只写周围世界而不重写动作。参考时长为 3 到 30 秒，必须是单人连续镜头，不能有剪切，速度过快会迁移失败。

检查清单：攻受分离；每切一个动作；笔刷方向与文字一致；参考视频单人连续。

原文例证：“Isolate striker from receiver”

### mx.04 MiniMax 与 Hailuo 打斗策略

来源库：pornthepp/ai-video-acting-skill、Dream2046-Light/duel-fight-prompt。来源文件：pt SKILL.md，dl models/_common.md。

触发条件：用 MiniMax 或 Hailuo 投打斗，镜头命令不起作用，或者出无声片。

做法：用官方方括号镜头命令，例如静态镜头、推近或撞击变焦，命令要少而明确。撞击段用推近加冲击抖动，抖动后立刻稳定。Hailuo 02 支持首帧和尾帧，适合做撞击前和撞击后状态锚点。需要高精度时可关闭提示词优化器。英文短段与指令式编辑切到 MiniMax H3，英文提示词，生成段为 4 到 15 秒整数秒，固定 24 帧，无 4K，最高 2K，支持局部修改不重跑，不写环境音会出无声片。MiniMax H3 没有独立负面词字段，要写在描述里用避免句式表达。

检查清单：方括号命令少而明确；首尾帧锚点已设；环境音已写。

原文例证：“[Push in]”

### mx.05 Runway 与 Sora 与 Luma 打斗策略

来源库：pornthepp/ai-video-acting-skill。来源文件：pt SKILL.md。

触发条件：用 Runway、Sora 或 Luma 投打斗，不知道各家写法差异。

做法：Runway 只用正面运动学措辞，不用否定命令，例如写双手保持清晰分离，不要写禁止变形手指。输入图已经定好主体构图光线和风格，提示词只写要动的部位、镜头、时间和速度。打斗用 45 度快门角措辞、环境特效爆发和 1.2 秒撞击切。Sora 每镜只用一个主体动作加一个镜头运动，再按节拍和步数拆解时间。先写故事板节拍，例如前进一步、出一次直拳、对手后退一步，再切下一镜。图片参考用作首帧锚点，正文只写之后要发生的事，角色措辞跨镜保持一致。Luma 把主体运动学语言和镜头语言分开写，不要混成一句。镜头命令要写完整，例如镜头向右甩镜并跟随撞击。主体只写一次位移和一次打击，受击者只写一次后退反应，撞击点仍由环境特效补足。注意时效：Runway Gen-3 已于 2026 年 7 月 8 日停用，Sora 网页和应用已于 2026 年 4 月 26 日停用，Sora 2 API 计划于 2026 年 9 月 24 日停用，两家策略只能当作可迁移方法。

检查清单：正面措辞无否定命令；每镜一个动作加一个镜头运动；时效已核对。

原文例证：“45-degree shutter angle”

### mx.06 平台优化与输出流程

来源库：beshuaxian/higgsfield-seedance2-jineng、Dream2046-Light/duel-fight-prompt、OSideMedia/higgsfield-ai-prompt-skill。来源文件：hx skills/05-fight-scenes/SKILL.md，dl references/01-spec-header.md，os skills/higgsfield-prompt/SKILL.md。

触发条件：提示词写完了，不知道按什么流程检查和提交。

做法：每条提示词 300 到 800 词，中高复杂度，分段提交，首选 1080 像素或 4K，16 比 9 画幅。帧率按电影感选 24 帧，按流畅动作选 30 帧，慢动作要指明 0.5 倍到 0.25 倍速的关键时刻。输出流程分五步，先按模板备稿，再检查具体动作和相机，再补时长画质和情绪，最后生成后加音效调色和特效。章节头部以 8K 3D CG 写实等风格词开场，涵盖超精致建模、PBR 物理材质、电影级色彩分级、UE5 路径追踪、Lumen 全局光照、Nanite 几何精度、35 毫米胶片颗粒与 Rec.2020 色彩空间。8K 与 60 帧只是风格描述词，不是输出参数，实际分辨率走参数控制，H3 固定 24 帧，最高 4K 只在 Kling 4.0。每个视频提示词都要填满模型、镜头、主体、观感、动作这五层，缺一层就等于少给模型一个决策依据。

检查清单：词数与画幅合规；五层齐全；五步流程走完。

原文例证：“Use clear section headers”

## 音效

### yx.01 打斗音效设计

来源库：beshuaxian/higgsfield-seedance2-jineng、Dream2046-Light/duel-fight-prompt。来源文件：hx skills/05-fight-scenes/SKILL.md，hx skills/08-anime-action/SKILL.md，dl references/01-spec-header.md。

触发条件：打斗画面有了，声音是后期另配的，不知道提示词里该怎么写声音。

做法：打斗音效分成冲击拟音、武器环境音、环境氛围、静默运用和配乐五部分，明确标注为后期制作提示。冲击音按部位区分音色，兵器出鞘和挥动各有金属声和破空声，地面冲击配尘土声或碎裂声。静默被当作工具使用，大冲击前短暂切断声音，耳鸣高音可以强化爆炸后的眩晕感。动漫版按管弦乐、日本摇滚、静默与环境音和动漫专属音效四类写声音设计，冲击帧配管弦乐重音，蓄力配升调电子音，变身配水晶般的上行音色，速度线配快速呼啸声。节奏规则是快切配快速音效切换，慢场景配长音和环境声，大场面前先静默再爆发。

检查清单：冲击音按部位区分；大冲击前有静默；音效标注为后期提示。

原文例证：“Weapon Strike Contact: Sharp metallic ring”

### yx.02 音频模式三选一

来源库：Dream2046-Light/duel-fight-prompt。来源文件：dl references/01-spec-header.md。

触发条件：不知道一段打斗该配什么声音，写多了出无声片，写少了没氛围。

做法：音频模式有三选一，分别为纯画面无声、默认无背景音乐但保留环境音与打斗音效，以及含对白。H3 必须写整体音景否则出无声片。默认模式写环境音与打斗音效，不写背景音乐。含对白模式要写清对白内容与嘴型同步。

检查清单：音频模式已选定；H3 已写整体音景；对白模式写清台词。

原文例证：“8K 3D CG 写实”

## 场景与环境

### cj.01 环境竞技场指南

来源库：beshuaxian/higgsfield-seedance2-jineng、Dream2046-Light/duel-fight-prompt、Yunwuxin-666/Wuxin-Film-Skill。来源文件：hx skills/05-fight-scenes/SKILL.md，dl references/06-environment.md，wx fight-choreo/references/action-types-50.md。

触发条件：打斗场景只写了地点名，场地没参与打斗，换个地方也能打。

做法：场景先写光线、地貌、天气、悬浮粒子与氛围。英文版列出雨中庭院、枫林、沙滩、山顶、巷子、古庙、屋顶、角斗场、竹林、燃烧建筑和冰湖等场景。每种场景都写清它如何改变打斗，例如雨水反光和打滑、沙尘随脚步扬起、竹子被冲击劈断。提示词里要把环境反应写进动作句，而不是只写地点名，让场地参与冲击而不是只做背景。空间群战要先写空间限制与人数进入顺序，再写主角利用墙面、门框、扶手、车门或人群缝隙的移动路径。场景库有巨型瀑布深潭、黄昏细雨竹林、黄昏废墟庭院、悬浮废墟、海滩、苍茫荒野、浅水河床桥面与草原共 8 个场景。

检查清单：场景有光线地貌天气粒子氛围；环境反应写进动作句；空间限制已写。

原文例证：“on a rain-slicked stone courtyard, water splashing”

### cj.02 场景与反馈强度匹配

来源库：Dream2046-Light/duel-fight-prompt、beshuaxian/higgsfield-seedance2-jineng。来源文件：dl references/06-environment.md，hx skills/05-fight-scenes/SKILL.md。

触发条件：轻招打出全屏爆炸，或者大招只溅起一点尘，轻重失衡。

做法：环境反馈按水域、岩石、植被、大气与光影五类取用，强度必须与碰撞等级匹配，轻碰撞只给局部反应，重碰撞给大范围反应，大招做全环境重构。特效色必须与场景主色对立，同批次多章节时场景要在轮换池里轮换，不许重复。

检查清单：反馈强度与碰撞等级匹配；特效色与场景主色对立；场景已轮换。

原文例证：“潭面炸起水墙、瀑布倒卷”

## 暴力分级与安全

### aq.01 暴力分级与风控黑白名单

来源库：Dream2046-Light/duel-fight-prompt。来源文件：dl references/08-banned-patterns.md。

触发条件：打斗写得太血腥被拦截，或者不知道什么能写什么不能写。

做法：暴力分级有三档，分别为无血、默认影视化轻微血迹与明确溅血，用户可上调到明确溅血档，不可突破永久禁止项。永久禁止包括未成年人打斗、虐待酷刑处刑式描写、真实可识别个人暴力、断肢内脏虐杀细节、真实恐怖主义场景与性暴力相关内容，命中即返回内容被拦截错误码，不组装提示词。黑白名单把表现受伤重、内伤、血迹多、死亡、惨烈、妖兽进食、折磨与枪战中弹等意图改写为姿态、环境反应与能量表现，组装后还要二次扫描防隐喻绕过。

检查清单：暴力分级在三档内；永久禁止项一个没有；组装后二次扫描已过。

原文例证：“风格化轻微血迹”

### aq.02 枪战受限写法

来源库：Dream2046-Light/duel-fight-prompt。来源文件：dl references/05-move-library.md。

触发条件：要写枪战，不知道怎么避开血腥与战术教学红线。

做法：枪战为受限类，不写人体中弹伤口特写，不写爆头，不写血浆喷溅，不写真实战术教学。命中反馈统一改写为护具崩裂、装备脱手或掩体碎屑，戏剧效果由战术动作与弹道表现承担。攻段有掩体间跃进、火力压制、单发快射、滑铲突进、双枪交替、近身枪斗与投掷烟雾闪光，防与反段有战术翻滚、掩体龟缩、听声辨位、弹道预知偏折、掩体反击、火力反击与近身缴械。

检查清单：四类禁写一个没有；命中反馈已改写；无战术教学。

原文例证：“护具崩裂 / 装备脱手”

## 每个库最值得学的提示词

下面 22 条都是来源库里的示例提示词原样摘录，只摘开头并注明出处，完整版去来源库看。摘录均不超过 50 字。

### beshuaxian/higgsfield-seedance2-jineng

1. 雨中武术对决，出自 skills/05-fight-scenes/SKILL.md。结构按场景、双人设定、开场钩子、两轮交手、升级、高潮和收尾组织，师徒在雨中庭院对打。开场是学员腾空飞踢加慢动作，师父接招后用掌法反击，结尾以学员后空翻脱身和双方行礼收束。摘录：“A rain-soaked stone courtyard in an ancient temple”

2. 奇幻剑斗元素魔法，出自 skills/05-fight-scenes/SKILL.md。结构按塔顶风暴场景、双人设定、带电长剑开场、两轮兵器交手、升级、高潮和收尾组织。巫师骑士用蓝色火焰剑进攻，游侠战士用翻滚和滑步闪避，最后六次快速格挡后以扫腿对峙收尾。摘录：“blade ignites in blue magical flame”

3. 追逐转街头打斗，出自 skills/05-fight-scenes/SKILL.md。结构按黄昏雨巷场景、追逐者与逃亡者设定、开场全速转弯加翻越围栏，随后是消防梯和屋顶追逐。追到死路后转入近身格斗，逃亡者用接拳加过肩摔反击，最后趁对手倒地继续跳屋顶逃离。摘录：“Fugitive rounds a tight corner at full sprint”

4. 动漫超级英雄对反派，出自 skills/05-fight-scenes/SKILL.md。结构按夜间城市场景、双人设定、能量球开场、近身与能量对轰分段组织，时长八秒。反派先放出黑色能量球炸碎大楼立面，英雄用银光冲击回击，最后以黑银能量对峙收尾。摘录：“Villain launches a massive black energy ball”

5. 历史武士决斗日落，出自 skills/05-fight-scenes/SKILL.md。结构按竹林山坡黄昏场景、老武士与年轻挑战者设定、拔刀闪光开场、三轮试探与升级组织。老武士以最省动作的劈砍试探，年轻挑战者连攻不中，最后老武士以一记斜切点到为止，挑战者鞠躬认输。摘录：“Slow zoom in on the Samurai”

6. 少年格斗高潮，出自 skills/08-anime-action/SKILL.md。结构按眼睛特写加气场爆发开场，黄昏山谷对峙，八秒内完成蓄力、突进和冲击三段。主角金色眼瞳加蓝色电光气场起势，随后以速度线和残影突进，冲击帧用白闪加十字高光定格。摘录：“extreme close-up of a male anime character”

7. 机甲战斗奇观，出自 skills/08-anime-action/SKILL.md。结构按驾驶舱特写加机体充能开场，雨夜赛博城市战场，十秒内完成对峙、突进和撞击三段。主角机体以青色核心脉动起势，敌机举起武器迎战，最后以白闪加十字高光和能量爆炸收尾。摘录：“Bright cyan-white power core glows in center”

### OSideMedia/higgsfield-ai-prompt-skill

8. Kling 3.0 夜市追逐，出自 templates/01-cinematic-action-chase.md。先写战术夹克女子在雨夜市场疾跑穿摊，再写蒸汽与霓虹反光补足氛围，最后用 Action Run 低跟拍加铁门下滑过收束。提示词控制在 60 到 100 字，冷蓝阴影配暖黄市场光。摘录：“She slides under it without breaking stride”

9. 屋顶打斗，出自 prompt-examples.md。两个剪影在雨夜屋顶缠斗，闪电做频闪照明，FPV 无人机环绕拍每次出拳交换。人物被掷向边缘后改 Dutch Angle 拍悬挂瞬间，并在掷出时刻套用 Bullet Time。注意原为 Sora 2 撰写，Sora 2 已停用，改跑 Seedance 2.0 的效果没有在本仓库里做过实测验证。摘录：“Two silhouettes grapple on a rain-slicked rooftop”

10. 地下停车场追逐，出自 prompt-examples.md。用参考图锁死女主角身份与服装，提示词不再重写外貌，只写动态描述、静态场景、镜头与音频四块。动态段写她在车阵间疾跑、回头、跃过轿车引擎盖并继续冲向坡道，镜头低位平行跟拍。摘录：“Camera tracks low and right, matching her pace”

11. 城市追逐夜市 Kling 2.6 加强版，出自 prompt-examples.md。在模板 01 基础上加 Whip Pan 切到后方追兵，再加 Bullet Time 跳上移动货车，形成追逐加障碍加高潮的完整链条。模型为 Kling 2.6，时长 10 秒，16 比 9，冷蓝阴影配暖黄市场光。摘录：“Bullet Time as she leaps from a loading dock”

12. 剑客连斩参考视频法，出自 skills/higgsfield-motion/SKILL.md。先写参考视频负责动作编排，提示词只写剑客爆发式拔刀连斩三根竹子。结尾补物理后果，竹秆倒下、落叶飞散、刀光反光，动作意图重于逐帧时间表。摘录：“A swordsman draws his blade explosively”

### Dream2046-Light/duel-fight-prompt

13. 黄金样本 A 型，出自 examples/example-A-累计时间轴.md。样本为沈青梧对顾停云在巨型瀑布深潭的对决，全程 18 镜累计 30 秒，按累计时间轴写每镜起止时间。结构走起手、试探、五连斩七连斩九连斩升级、第一次重击、对手反击、主角被压制、大招蓄力、第一次大招爆发、终极对撞与收尾，含多处台词与墨金对青白的水墨特效。摘录：“沈青梧剑未出鞘，立于潭边苔石”

14. 黄金样本 B 型，出自 examples/example-B-单片时长.md。样本为秦照雪持六合大枪对赤獠在黄昏悬浮废墟的对决，全程 12 镜合计 28 秒，按单片时长写每镜时长。结构走走进废墟站位、拖枪奔跑加标枪投掷、侧身躲过、双指召唤大枪飞回、赤獠大招暗渊剑狱、Z 字瞬移躲避、空中对打、回马枪、裂空枪黑洞、粒子爆炸与收尾，蓝色水墨对暗红。摘录：“秦照雪左手抓枪尾，枪尖向后斜指地面”

### Yunwuxin-666/Wuxin-Film-Skill

15. 紧凑动作链范例，出自 fight-choreo/references/rhythm-camera-prompts.md。这一例先写主角后撤闪避与压腕切入，再写转胯肩撞破坏重心与对手撞墙反应，最后写主角收手护下巴与半侧身回防。它用一段连续文字同时交代脚步、手部、身体重量、对手反应与空间结果，是动作链段落的范本。摘录：“主角左脚后撤半步避开直拳，右手压住对方手腕，左肩贴近对方胸口切入内线”

16. 肘击爆发种子，出自 fight-choreo/references/action-types-50.md。这一例先写侧身让过拳线，再写右肘短促横切与对手肩膀猛缩，最后写对手撞向门框的空间结果。它把起势、发力、反应与收势压缩在三句种子里，适合直接扩写成 4 到 8 秒提示词。摘录：“主角侧身让过拳线，右肘从胸前短促横切，对手肩膀猛缩撞向门框。”

17. 走廊一对多种子，出自 fight-choreo/references/action-types-50.md。这一例按敌人逐个进入的顺序写，第一人被肘击逼退，第二人被推撞墙，第三人刚进入画面，镜头保持走廊轴线稳定。它示范了群战不堆人数，先写进入顺序再写逐个反应，是群战提示词的范本。摘录：“第一人正面冲来被肘击逼退，第二人从左侧抓肩被推撞墙，第三人刚进入画面。”

### pornthepp/ai-video-acting-skill

18. 雨巷打斗与撞墙终结，出自 examples/action_combat_recipes.md。三镜分别是 1.5 秒防守站姿、1.2 秒肩撞推墙、2.0 秒对手沿墙滑落加女主回防。撞击点用雨水飞溅遮蔽，镜头用快速甩镜加推近。摘录：“Tight medium 35mm, rainy neon alley.”

19. 战术枪斗与近身缴械，出自 examples/action_combat_recipes.md。三镜分别是 1.0 秒拔枪进门、1.0 秒左手拨开枪管加枪口闪光、1.5 秒向前开火加弹壳弹出。每镜只做一个武器动作，不写连续夺枪和摔投。摘录：“His pistol is drawn and indexed at chest level”

20. 中世纪剑击与盾牌格挡，出自 examples/action_combat_recipes.md。三镜分别是 1.5 秒重剑蓄力、1.0 秒下劈撞盾加火花木屑、1.5 秒盾击反推加骑士踉跄。接触点只在盾缘，火花和碎屑同时遮蔽刀盾交点。摘录：“raising a broadsword with both gauntleted hands”

21. 赛博朋克动能撞墙，出自 examples/action_combat_recipes.md。三镜分别是 1.2 秒全速冲刺、1.2 秒肩撞穿墙加石膏碎块爆发、2.0 秒单膝滑停加举枪警戒。墙体和尘雾本身就是转场遮罩，不直接生成人体撞墙连续过程。摘录：“boots heavily pounding the wet grating”

22. 沙漠山脊闪避与岩石撞击，出自 examples/action_combat_recipes.md。四镜分别是 1.5 秒站姿、1.0 秒侧步闪避加肘击、1.2 秒对手单独撞岩加沙尘冲击波、2.0 秒女主回防。零缠斗和单主体隔离执行最完整，是本源最适合直接复用的打斗范式。摘录：“The woman sidesteps sharply to the right”

## 先看哪个库

- 先看 Dream2046-Light/duel-fight-prompt，它是唯一百分之百打斗的库，30 秒结构、招式库、碰撞配方、负面提示词全套都有，中文直接能用。
- 再看 beshuaxian/higgsfield-seedance2-jineng，打斗 skill 加动漫动作 skill，钩子、流派、镜头、音效最全，中英文都有。
- 再看 pornthepp/ai-video-acting-skill，格斗三镜协议与防穿模方法是全网最细的，专治多身体纠缠变形。
- 再看 Yunwuxin-666/Wuxin-Film-Skill，五十类中文动作种子与四拍语法，中文武侠功夫词汇最深。
- 最后看 OSideMedia/higgsfield-ai-prompt-skill，模型分流与参考视频法最全，但已归档，模型规格冻结在 2026 年 9 月 26 日，用前要以实时界面核对。

## 诚实说明

- 五个库的星数、条数和链接都是 2026 年 11 月 22 日当天核实过的，库每天都在更新，数字以后会变。
- Wuxin-Film-Skill 没有许可证文件，根目录说明写明暂未附带开源许可证，在许可证明确之前默认保留全部权利，本包只做方法转述与短引，是否可商用或改编需确认。
- beshuaxian 仓库根目录未见许可证文件，任务所称 MIT 许可未从克隆文件中核实。
- pornthepp 仓库 README 标注 MIT 许可，但克隆文件清单中没有 LICENSE 文件，许可文本本身未在本次克隆中核实。
- OSideMedia 仓库已于 2026 年 11 月归档，模型规格冻结在 2026 年 9 月 26 日，Sora 2 已停用，Runway Gen-3 已停用，相关策略只能当作可迁移方法。
- 这个技能包里没有自己编的提示词，摘录均不超过 50 字，完整版去来源库看。
- 没收进来的备选有两个，dgroch/higgsfield-prompt-engineer 与 afirsin/video-prompt-engineer 是 beshuaxian 同一家族的库，打斗内容重复；kafanxx/awesome-seedance 是已蒸馏过的 LearnPrompt 库的分叉，内容重复，所以没进前五。
- 压力测试均为自测，未做盲测，未在真实模型上投喂验证。
