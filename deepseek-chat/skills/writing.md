# 网文写作技能包

来源：GitHub 大扫方向 3，网文写作方法论，5 个库蒸馏。
方法：仓颉蒸馏法 v2.5.0，RIA-TV++ 七阶段流水线，只读文档不读代码。
范围：只蒸小说写作方法论，不含去AI味内容，不含具体小说内容，不含工程实现细节。
用法：写小说前按方向查对应能力，能力编号连续，共 322 条。引用均为原文逐字连续子串，引用最长 50 字。

## 方向总览

- A 立项与前置规划：ww.01 到 ww.19，共 19 条
- B 大纲与长线结构：ww.20 到 ww.44，共 25 条
- C 开头与钩子：ww.45 到 ww.70，共 26 条
- D 人物与对话：ww.71 到 ww.92，共 22 条
- E 章节写作与节奏：ww.93 到 ww.119，共 27 条
- F 章末与伏笔：ww.120 到 ww.133，共 14 条
- G 审查与连载管理：ww.134 到 ww.153，共 20 条
- H 拆文与扫榜方法：ww.154 到 ww.172，共 19 条
- I 计谋与阴谋叙事：ww.173 到 ww.322，共 150 条

## A 立项与前置规划

- ww.01 故事核一句话
  能力：立项先把故事核压成一句话：设定加冲突加核心行动，写不出一句话说明故事核还没立住。
  引用：设定+冲突+核心行动合为一句
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-analyze/references/stage2-3-structure-emotion.md
- ww.02 先收集再生成
  能力：动笔前先收齐信息再生成，未过充分性闸门不执行初始化。
  引用：先收集，再生成
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/SKILL.md
- ww.03 分波次提问
  能力：按缺失程度分波次提问，每轮只问当前缺失且会阻塞下一步的信息。
  引用：用户已明确的不重复问，冲突让用户裁决
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/SKILL.md
- ww.04 参考书只拆结构
  能力：拆参考书只返回结构化结果，用户确认前不得写入任何正典文件。
  引用：参考书拆解只返回结构化结果
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/SKILL.md
- ww.05 不要默认拆书
  能力：参考书不是必填项，没有文本或摘录时先问能否提供，拿不到就只当方向线索。
  引用：不要默认拆书，也不要把参考作品当作必填项
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/SKILL.md
- ww.06 禁止原样写入参考书事实
  能力：参考书的角色设定组织地点金手指剧情事实一律不得原样写入生成项目文件。
  引用：禁止把参考书角色、设定、组织、地点、金手指、剧情事实原样写入生成项目文件
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/SKILL.md
- ww.07 核心卖点等于唯一理由
  能力：核心卖点就是读者选择这本书的唯一理由，一句话说不清等于卖点没立住。
  引用：核心卖点 = 读者选择这本书的唯一理由
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/creativity/selling-points.md
- ww.08 开篇承诺等于全文兑现
  能力：开篇承诺什么，全文就要兑现什么，开篇承诺的爽点前三章就要有体现。
  引用：开篇承诺 = 全文兑现
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/creativity/selling-points.md
- ww.09 创意包结构
  能力：每套创意包固定含一句话卖点、反套路规则一条、硬约束两到三条、主角缺陷驱动、反派镜像、开篇钩子。
  引用：每套含：一句话卖点、反套路规则 1 条、硬约束 2-3 条
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/SKILL.md
- ww.10 三轴混搭
  能力：主角轴世界轴系统轴三轴混搭，每轴提供三到四个选项组合，至少三分之二的轴必须选非默认选项。
  引用：资源稀缺、金手指有代价、反爽/苟道
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/creativity/creativity-constraints.md
- ww.11 先产出钩子再定大纲
  能力：开篇钩子优先，先产出钩子再定大纲，钩子立不住大纲不用急着写。
  引用：先产出钩子，再定大纲
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/creativity/creativity-constraints.md
- ww.12 硬约束逼出独特解法
  能力：定义两到三条硬约束，逼出独特剧情解法，硬约束越具体，剧情越不容易落入模板。
  引用：定义 2-3 条硬约束，逼出独特剧情解法
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/creativity/creativity-constraints.md
- ww.13 三问筛选
  能力：三问筛选：为什么这题材必须这么写，换常规主角会不会塌，卖点能否一句话讲清且不撞模板。
  引用：为什么这题材必须这么写
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/SKILL.md
- ww.14 镜像对抗设计
  能力：反派按小中大分层，每层都要有一句镜像对抗：反派与主角共享同一欲望或缺陷，但走相反的路。
  引用：反派分层（小/中/大）与镜像对抗一句话
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/SKILL.md
- ww.15 金手指呈现形式
  能力：系统流金手指常用属性面板加技能树加任务系统加商城抽奖呈现，呈现形式要让读者直观感受到变强。
  引用：属性面板 + 技能树 + 任务系统 + 商城/抽奖
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/power-systems.md
- ww.16 世界规模与力量体系
  能力：世界观先定规模与力量体系类型，再定势力格局与社会阶层资源分配。
  引用：世界规模（单城/多域/大陆/多界）
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/SKILL.md
- ww.17 充分性闸门
  能力：充分性闸门六条全过才算立项完成，书名题材、主角反派、金手指代价、世界观、创意约束缺一不可。
  引用：创意约束已确定：反套路规则 1 条 + 硬约束至少 2 条
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/SKILL.md
- ww.18 书级定位承诺硬约束先定
  能力：先定书级定位承诺和硬约束，再进入世界与角色，约定是世界搭建和角色生成的坐标系。
  引用：先确定创作约定，再进入世界与角色
  来源：ExplosiveCoderflome/AI-Novel-Writing-Assistant/mintlify-docs/creation-flow.mdx
- ww.19 创作三条规律
  能力：创作链三条规律：先定约定再进世界角色，稳定资料前置动态信息随章更新，每章完成后回流状态。
  引用：稳定资料前置，动态信息随章更新
  来源：ExplosiveCoderflome/AI-Novel-Writing-Assistant/mintlify-docs/creation-flow.mdx

## B 大纲与长线结构

- ww.20 黄金三章打法
  能力：黄金三章的章末钩子必须百分之百带上，日更章节章末带钩不低于百分之七十。
  引用：黄金三章 100%
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/references/flow-outline.md
- ww.21 六类爽点
  能力：每章先定爽点再倒推剧情，六类爽点是能力碾压、目标达成、收获盘点、态度转变、掉马甲、情感圆满。
  引用：先定本章爽点，再倒推需要谁来轻视或阻拦
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/references/flow-outline.md
- ww.22 卷纲三层级
  能力：卷纲分三级：立项定设定、出卷纲、排细纲；某卷一旦有正文，已写区间剧情段锁定不改，只允许卷尾追加新段。
  引用：某卷一旦有正文，已写区间剧情段锁定不改
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/references/flow-opening-plan.md
- ww.23 新增物三级
  能力：新增物分三级处置，判断标准只有一个：下章需不需要知道它存在过。
  引用：只看下章需不需要知道它存在过
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/SKILL.md
- ww.24 直接写清单
  能力：微连接、路人、器物、地名细部、一次性对话、现场细节属于直接写一级，不用申报。
  引用：微连接、路人、器物、地名细部、一次性对话、现场细节
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/SKILL.md
- ww.25 大纲三层
  能力：大纲分三层：骨架大纲管全书起承转合，分卷大纲管阶段目标，章节大纲只排未来十到二十章。
  引用：骨架大纲（全书）+ 分卷大纲（全书）
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/references/outlining/outline-structure.md
- ww.26 每卷一个小目标
  能力：每卷一个小目标，如第一卷新手村成长，第二卷宗门试炼，卷目标不明整卷就会散。
  引用：每卷一个小目标
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/references/outlining/outline-structure.md
- ww.27 卷纲骨架四要素
  能力：卷纲骨架必须填中段反转，危机链至少三次递增，卷末新钩子必须能落到最后一章的章末未闭合问题。
  引用：危机链至少 3 次递增
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/SKILL.md
- ww.28 卷末新钩子落点
  能力：卷末新钩子不是空悬念，必须能落到最后一章的章末未闭合问题上。
  引用：卷末新钩子必须能落到最后一章的章末未闭合问题
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/SKILL.md
- ww.29 时间体系与跨度
  能力：每卷必须明确时间体系与本卷时间跨度，有倒计时事件要列出并标记剩余天数。
  引用：必须明确时间体系与本卷时间跨度
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/SKILL.md
- ww.30 上一卷伏笔进新卷
  能力：上一卷未回收的伏笔必须出现在新卷伏笔规划里，继续推进或标记回收，二选一。
  引用：上一卷未回收的伏笔必须出现在新卷伏笔规划中
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/SKILL.md
- ww.31 主角能力承接
  能力：主角能力境界必须承接上卷，不回退也不跳级，除非有剧情解释。
  引用：主角能力 / 境界必须承接，不回退也不跳级（除非有剧情解释）
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/SKILL.md
- ww.32 批量拆章与失败重做
  能力：拆章默认十章一批，失败只重做失败批次，不覆盖整卷文件；最后一个批次无效时只删除并重写该批次。
  引用：只重做失败批次，不覆盖整卷文件
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/SKILL.md
- ww.33 结构化节点
  能力：每章固定一个章首节点、两到四个章中节点、一个章末节点，相邻章的章末节点到下一章章首节点必须逻辑承接。
  引用：写作执行骨架，不追求严格语法 SVO
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/SKILL.md
- ww.34 时间线硬约束
  能力：时间线是硬约束，所有章纲必须带时间字段，时间回跳未标注闪回即阻断。
  引用：时间线是硬约束，所有章纲必须带时间字段
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/SKILL.md
- ww.35 增量补齐不重写
  能力：规划只做增量补齐，不重写整份总纲或设定集，发现总纲与设定冲突先阻断，等用户裁决。
  引用：只做增量补齐，不重写整份总纲或设定集
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/SKILL.md
- ww.36 概念规划六问
  能力：概念规划先答六问：题材和消费点、卖点和异常局面、主角眼前的麻烦、故事引擎、目标长度、最小产物。
  引用：好点子不只要能开头，还要能往下跑
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/concept_planning/tutorial.md
- ww.37 卷纲三层级
  能力：卷纲分三级：黄金三章负责成交，分卷负责阶段目标，章纲负责把卷目标拆成可更新的章节推进。
  引用：分卷和章纲不是给作者看的备忘录，而是故事引擎的施工图
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/volume_outline/tutorial.md
- ww.38 冲突设计三层次
  能力：冲突分三层次：外部对抗、内心挣扎、世界观碰撞；没有冲突就没有故事，冲突是剧情的引擎。
  引用：没有冲突就没有故事
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/references/outlining/conflict-design.md
- ww.39 冲突升级公式
  能力：冲突按小中大分级升级，每十章至少一个 B 级以上冲突，升级靠压抑加反击加再压抑加碾压循环。
  引用：每10章至少有1个B级或以上冲突
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/references/outlining/conflict-design.md
- ww.40 剧情框架四种
  能力：常用剧情框架四种：打脸爽文、废材逆袭、扮猪吃虎、英雄之旅简化三幕，按题材选框架不硬套。
  引用：被嘲讽 → 隐忍 → 爆发 → 打脸 → 循环
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/references/outlining/plot-frameworks.md
- ww.41 换地图控数值
  能力：数值膨胀的控制阀是换地图：在新手村称霸后进入大地图，发现自己只是底层，等级体系随之重置。
  引用：在新手村称霸后，进入大地图发现自己只是底层
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/power-systems.md
- ww.42 力量体系越级原则
  能力：力量体系要定明确等级与显著实力差距，主角必须能越级但不能无限越，最大跨度一个大境界。
  引用：主角必须能越级，但不能无限越
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/power-systems.md
- ww.43 势力金字塔
  能力：势力按金字塔分层，顶层掌握世界规则的制定权，势力之间靠历史积怨、资源争夺、理念分歧结仇。
  引用：掌握世界规则的制定权
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/faction-systems.md
- ww.44 设定自洽
  能力：设定可以天马行空但逻辑必须自洽，世界基本规则一旦确立就不能随意打破，等级压制与战力对比必须前后一致。
  引用：世界的基本规则一旦确立，就不能随意打破
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/setting-consistency.md

## C 开头与钩子

- ww.45 开头不是铺垫区而是成交区
  能力：网文开头不是铺垫区而是成交区，前几百字还在正常生活正常回忆正常说明，通常就是慢。
  引用：网文开头不是铺垫区，而是成交区
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/opening/tutorial.md
- ww.46 前 300 到 500 字给抓手
  能力：开头硬指标：前三百到五百字给抓手，前一千五到三千字给卖点，前六千字让读者知道主角是谁、遇到什么、卖点是什么、接下来想看什么。
  引用：前 300-500 字给抓手
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/SKILL.md
- ww.47 前 1500 到 3000 字给卖点
  能力：卖点要在前一千五到三千字亮出来，读者还没关心主角就先被塞一屏背景说明，是最常见的慢开头。
  引用：前 1500-3000 字给卖点
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/SKILL.md
- ww.48 前 6000 字四件事
  能力：前六千字必须交代四件事：主角是谁、遇到什么、卖点是什么、接下来想看什么，缺一件读者就可能走。
  引用：前 6000 字让读者知道主角是谁、遇到什么、卖点是什么、接下来想看什么
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/SKILL.md
- ww.49 开头四种成交方式
  能力：开头四种成交方式：危机压身、身份反差、信息外挂、关系炸点，第一章先立异常再展开。
  引用：第一章立异常
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/opening/tutorial.md
- ww.50 抓手不是卖点
  能力：抓手不是卖点：抓手是让读者停下来的一句话或一个画面，卖点是让读者留下来追更的理由。
  引用：抓手不是卖点
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/opening/tutorial.md
- ww.51 好开头主角已被卷进故事
  能力：好开头里的主角不是站在一边介绍故事，而是已经被卷进故事，旁观式开场留不住人。
  引用：好开头里的主角不是站在一边介绍故事，而是已经被卷进故事
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/opening/tutorial.md
- ww.52 开头五种硬伤
  能力：开头五种硬伤：慢铺垫、背景直灌、主角旁观、抓手错位、卖点迟到，先起床洗漱吃饭看天气就是典型慢开场。
  引用：读者还没关心主角，就先被塞了一屏背景说明
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/opening/tutorial.md
- ww.53 十种强力开头
  能力：十种强力开头：行动中开场、反常情境、震撼对话、倒计时、重大发现、危机时刻、谜团浮现、背叛开场、重大选择、结局预告，首选直接从冲突或动作的高潮点开始。
  引用：直接从冲突或动作的高潮点开始
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.54 震撼对话开场
  能力：震撼对话开场是用一句惊人的对话开场，对话本身要带冲突或信息量，不能是寒暄。
  引用：用一句惊人的对话开场
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.55 倒计时与重大发现
  能力：倒计时开场从时间压力开始，重大发现开场从发现关键线索或真相开始，两者都靠紧迫感抓人。
  引用：从时间压力开始
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.56 背叛与结局预告
  能力：背叛开场从背叛或信任崩塌开始，结局预告开场从未来的某个关键时刻开始然后倒叙。
  引用：从背叛或信任崩塌开始
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.57 网络短篇总铁律
  能力：网络短篇是情绪与爽感消费品，不是传统纸媒散文或慢热文艺短篇，开篇百字抛炸弹，中后段连环打脸，结尾明账彻底清算。
  引用：网络短篇是情绪与爽感消费品
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-write/SKILL.md
- ww.58 短篇导语冷开场
  能力：短篇导语冷开场前三句零纯景物天气背景，直入冲突、反常、对话或危机四式之一。
  引用：零纯景物/天气/背景
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-write/SKILL.md
- ww.59 短篇第 1 节与高频打脸
  能力：短篇第 1 节写足一千三到一千六百字立住人设与冲突，从百分之四十起高频打脸，不拖到百分之八十。
  引用：40% 起高频打脸
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-write/SKILL.md
- ww.60 叙述者在场直给情绪
  能力：短篇默认第一人称，叙述者在场直给情绪、主观吐槽审判、提前剧透火葬场或底牌。
  引用：直给情绪、主观吐槽审判、提前剧透火葬场或底牌
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-write/SKILL.md
- ww.61 番茄七猫严禁慢热开局
  能力：番茄七猫长篇严禁慢热开局，只有目标平台明确为起点晋江慢热向且作者指定时，才允许第一章缓铺处境。
  引用：番茄/七猫长篇严禁慢热开局
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/references/flow-outline.md
- ww.62 首章 300 字见对话 400 字入冲突
  能力：番茄七猫长篇首章三百字内见对话、四百字内入冲突并亮核心卖点或金手指，手机短段中位约二十二到二十六字。
  引用：首章 ≤300 字见对话、≤400 字入冲突并亮核心卖点/金手指
  来源：zenstory-ai/oh-story-claudecode/skills/story-review/SKILL.md
- ww.63 短篇 12 流派包
  能力：短篇十二流派包按读者爽点与核心人设标签选包，每包固定含导语冷开场公式、节奏骨架与付费卡点，如脑洞设定流靠一句话高概念奇设加第一人称钝感吐槽。
  引用：一句话高概念奇设
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-write/references/genre-styles/脑洞设定流.md
- ww.64 长篇 16 流派包
  能力：长篇十六流派包按定位、核心梗、金手指公式与卷级升级轴选包，男频以剧情爽感与实力地位资源升级为主轴，感情线辅助。
  引用：男频以剧情爽感与实力/地位/资源升级为主轴，感情线辅助
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/SKILL.md
- ww.65 追读力三钩
  能力：追读力分三类钩子：情绪钩靠强烈情绪反应驱动，选择钩靠两难抉择驱动，渴望钩靠可期待的奖励驱动。
  引用：通过触发读者的强烈情绪反应（愤怒/心疼/共情/不公/羞耻/心动）来驱动阅读
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/references/reading-power-taxonomy.md
- ww.66 微兑现
  能力：每章都要给读者小收获让读者感觉这章没白看，过渡章可降低要求，但优先保留至少一个微兑现。
  引用：过渡章可降低要求，优先保留至少 1 个微兑现
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/references/reading-power-taxonomy.md
- ww.67 悬念钩子之信息揭示
  能力：悬念钩子十三式之一是在章节结尾突然揭示一个改变一切的信息，信息一出局势理解立刻改写。
  引用：在章节结尾突然揭示一个改变一切的信息
  来源：PenglongHuang/chinese-novelist-skill/references/guides/hook-techniques.md
- ww.68 悬念钩子之危险与选择
  能力：危险迫近钩子让角色面临迫在眉睫的危险，下一章必须立即应对；艰难选择钩子让角色必须做出艰难选择，但章节在决定前结束。
  引用：角色面临迫在眉睫的危险，下一章必须立即应对
  来源：PenglongHuang/chinese-novelist-skill/references/guides/hook-techniques.md
- ww.69 章首引子
  能力：章首引子出现在章节标题和正文之间，是五十到一百五十字的短文段，目的是在读者还没开始读正文之前就勾起好奇心、紧迫感或情感冲击。
  引用：章首引子出现在章节标题和正文之间，是 50-150 字的短文段
  来源：PenglongHuang/chinese-novelist-skill/references/guides/hook-techniques.md
- ww.70 钩子从章节开头就开始铺垫
  能力：好的钩子从章节开头就开始铺垫，不是写到结尾才临时加上去的，章末钩子要靠章中埋点才立得住。
  引用：好的钩子从章节开头就开始铺垫，不是写到结尾才临时加上去的
  来源：PenglongHuang/chinese-novelist-skill/references/guides/hook-techniques.md

## D 人物与对话

- ww.71 D-F-W-N-C 五维模型
  能力：人物设计用五维模型：欲望、缺陷、恐惧、需求、矛盾，先答他最想要什么，再答什么会害他付代价。
  引用：他最想要什么
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/character-design.md
- ww.72 主角缺陷致命化
  能力：主角必须有缺陷，缺陷要在关键时刻导致失败，缺陷不是点缀而是剧情的发动机。
  引用：主角必须有缺陷，缺陷在关键时刻导致失败
  来源：PenglongHuang/chinese-novelist-skill/references/guides/character-building.md
- ww.73 废柴流人设
  能力：废柴流人设起点低被嘲讽后期打脸，适合小白文爽感强，关键是嘲讽要具体、打脸要当众。
  引用：起点低，被嘲讽，后期打脸
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/character-design.md
- ww.74 反派 C/B/A 分级
  能力：反派分三级：C 级脸谱怪纯粹为了送经验和嘲讽而存在，B 级有动机有手段，A 级是主角的黑暗镜像。
  引用：纯粹为了送经验和嘲讽而存在
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/character-design.md
- ww.75 反派不要为坏而坏
  能力：反派不要为了坏而坏，给他一个理由，如为了复活爱人而毁灭世界，理由越具体反派越立得住。
  引用：给他一个理由
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/character-design.md
- ww.76 反派是主角黑暗镜像
  能力：最好的反派是主角的黑暗镜像，如果主角走了另一条路就会变成他，两人共享同一欲望但走相反的路。
  引用：如果主角走了另一条路，就会变成他
  来源：PenglongHuang/chinese-novelist-skill/references/guides/character-building.md
- ww.77 黄金配角组合
  能力：黄金配角组合是死党跟班负责捧哏收集情报替主角吹牛，青梅竹马温柔陪伴白月光，师父长辈负责传功与托底。
  引用：负责捧哏、收集情报、替主角吹牛
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/character-design.md
- ww.78 女主避免花瓶
  能力：女主必须有自己的高光时刻和剧情作用，如她是唯一能开启秘境的人，或者她替主角挡了一刀。
  引用：她是唯一能开启秘境的人
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-init/references/worldbuilding/character-design.md
- ww.79 人物矛盾创造深度
  能力：真实的人是复杂的充满矛盾，矛盾是人物成长的发动机，写人物先写他的内在矛盾。
  引用：真实的人是复杂的，充满矛盾
  来源：PenglongHuang/chinese-novelist-skill/references/guides/character-building.md
- ww.80 侧面揭示三技法
  能力：不要直接陈述性格，通过行为展示，人物在压力下的选择比任何描述都有说服力。
  引用：不要直接陈述性格，通过行为展示
  来源：PenglongHuang/chinese-novelist-skill/references/guides/character-building.md
- ww.81 小习惯暴露人物
  能力：反复出现的小习惯是人物的无意识自我暴露，即使只有几句台词的龙套也要给他一个记忆点。
  引用：反复出现的小习惯是人物的无意识自我暴露
  来源：PenglongHuang/chinese-novelist-skill/references/guides/character-building.md
- ww.82 角色一致性五维度
  能力：写人物前先填最小状态卡，盯五维度：目标、情绪、关系、身体、声音，情绪可以变化但要有触发物和过渡。
  引用：情绪可以变化，但要有触发物和过渡
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/character_consistency/tutorial.md
- ww.83 剧情逻辑五环节
  能力：剧情逻辑五环节是动机、触发、决策、后果、兑现，人物做出的选择要和他的处境性格目标匹配，选择之后局面必须变。
  引用：人物做出的选择要和他的处境、性格、目标匹配
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/plot_logic/tutorial.md
- ww.84 对话必须有目的
  能力：对白必须有目的，没有目的的对白通常就是闲聊，每句对白至少要完成施压、放信息、改关系、立人中的一项。
  引用：没有目的的对白，通常就是闲聊
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/dialogue/tutorial.md
- ww.85 对白四功能
  能力：对白四功能是施压、放信息、改关系、立人，好的对白不是聊天记录也不是情绪宣泄，对白要让场上的压力变得可听见。
  引用：对白要让场上的压力变得可听见
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/dialogue/tutorial.md
- ww.86 信息嵌在对抗里
  能力：信息最好嵌在对抗里出来，而不是靠人物轮流做讲解员，一句话说完双方位置最好发生一点偏移。
  引用：信息最好嵌在对抗里出来，而不是靠人物轮流做讲解员
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/dialogue/tutorial.md
- ww.87 对话是权力角力场
  能力：对话是权力的角力场，动作与对话一致或矛盾都有戏剧效果，对话不仅是内容节奏本身就是表达。
  引用：对话是权力的角力场
  来源：PenglongHuang/chinese-novelist-skill/references/guides/dialogue-writing.md
- ww.88 人物声音各异
  能力：同一个人说话习惯出手方式忍耐阈值要相对稳定，如果谁说都一样说明人物声音没立住。
  引用：如果谁说都一样，说明人物声音没立住
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/dialogue/tutorial.md
- ww.89 对话场景四种
  能力：对话四种常见场景要避坑：信息倾倒就是角色互相说已知信息，此外还有闲聊注水、独白过长、众人同声。
  引用：角色互相说已知信息
  来源：PenglongHuang/chinese-novelist-skill/references/guides/dialogue-writing.md
- ww.90 高压场面短句更有刀
  能力：高压场面里短句常常更有刀，长辈富二代学生保姆上位者全都一个语气，是对话没分人设的信号。
  引用：高压场面里，短句常常更有刀
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/dialogue/tutorial.md
- ww.91 对话目的与潜台词
  能力：人们说话不写论文，对话要简洁，表达方式取决于人物与处境，对话中最有力量的是没说的内容。
  引用：人们说话不写论文
  来源：PenglongHuang/chinese-novelist-skill/references/guides/dialogue-writing.md
- ww.92 沉默的戏剧力量
  能力：沉默有戏剧力量，用刻意的沉默收尾能让没回答的问题自己发酵，比解释更有张力。
  引用：用刻意的沉默收尾
  来源：PenglongHuang/chinese-novelist-skill/references/guides/hook-techniques.md

## E 章节写作与节奏

- ww.93 标准章节结构
  能力：标准章节结构是开头钩子占前百分之二十，发展占百分之五十到六十，高潮占后百分之十五到二十，结尾钩子占最后百分之五到十。
  引用：每一章都应该是一个完整的叙事单元，同时推动整体故事向前发展
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.94 每章一个不可删除的核心事件
  能力：每章至少包含一个不可删除的核心事件，删掉它整章就塌，删不掉的事件才是章节的骨架。
  引用：每章至少包含一个不可删除的核心事件
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.95 章节开头钩子
  能力：章节开头应尽早给读者继续读的理由，开头钩子放在前百分之二十，越早越好。
  引用：开头应尽早给读者继续读的理由
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.96 长短句与段落呼吸
  能力：节奏靠长短句交替与段落呼吸控制，句子长度决定阅读速度，短句快长句慢，段落是读者的呼吸节奏。
  引用：句子长度决定阅读速度。短句快，长句慢
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.97 信息密度波浪
  能力：信息密度等于单位字数里传达的新信息量，每章安排两到三个密度波浪，连续三段以上高密度等于读者疲劳。
  引用：信息密度 = 单位字数里传达的新信息量
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.98 章节长度表
  能力：章节长度按章型定：短章两千到三千字，标准章三千到五千字，长章五千到七千字，大高潮章节可以写到五千到六千字。
  引用：可以写到5000-6000字
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/references/outlining/chapter-planning.md
- ww.99 写前必读三步
  能力：写前必读三步：读上一章结尾、读基准段落、读本章章纲，动笔前最后读到的必须是正文语态文字。
  引用：动笔前最后读到的必须是正文语态文字
  来源：PenglongHuang/chinese-novelist-skill/references/flows/chapter-checklist.md
- ww.100 设定与事实词典
  能力：设定与事实词典是写作的唯一事实源，首现名词带类别加可感知特征，正文中要写而表中没有的先登记再写，禁止现场编造。
  引用：正文中要写而表中没有的，先登记再写，禁止现场编造
  来源：PenglongHuang/chinese-novelist-skill/references/flows/chapter-checklist.md
- ww.101 章节摘要
  能力：章节摘要约三百到五百字，只写关键事件及其造成的变化，不流水账复述场景，不用空泛总结。
  引用：只写关键事件及其造成的变化，不流水账复述场景
  来源：PenglongHuang/chinese-novelist-skill/references/flows/chapter-checklist.md
- ww.102 区分已知尚未知与误以为
  能力：摘要要区分已知、尚未知与误以为，区分公开表态、真实打算与已完成行动，不要用后章信息倒推人物当时已知。
  引用：不能用后章信息倒推人物当时已知
  来源：PenglongHuang/chinese-novelist-skill/references/flows/chapter-checklist.md
- ww.103 自报数字必须实地数一遍
  能力：自报数字必须实地数一遍，引文几字数几字，列了几物数几物，数字错了读者立刻出戏。
  引用：引文几字数几字，列了几物数几物
  来源：PenglongHuang/chinese-novelist-skill/references/flows/chapter-checklist.md
- ww.104 动笔前看语感锚点
  能力：动笔前必看语感锚点，开写前扫一眼对标文风或本书流派包的一百五十到二百五十字原文切片。
  引用：动笔前必看语感锚点
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/references/flow-drafting.md
- ww.105 原文语感切片
  能力：语感切片取两到三段二百到三百字连续原文，保留原始换行标点与对话，不重叠不改写。
  引用：保留原始换行、标点与对话，不重叠不改写
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-analyze/references/stage1-golden-chapters.md
- ww.106 只学语感严禁照抄
  能力：对齐断行密度口语感节奏快慢与标点力度，只学语感，严禁照抄人名物件台词或桥段。
  引用：只学语感，严禁照抄人名、物件、台词或桥段
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/references/flow-drafting.md
- ww.107 第三人称贴身限知
  能力：长篇默认第三人称贴身限知，仅当用户或流派明确指定才用第一人称，镜头贴着主角走。
  引用：默认第三人称贴身限知
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/references/flow-drafting.md
- ww.108 镜头贴着主角走
  能力：镜头贴着主角走，心里盘算吐槽利害算账直接用角色口吻写出，不跳出来当说教旁白。
  引用：镜头贴着主角走，心里盘算、吐槽、利害算账直接用角色口吻写出
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/references/flow-drafting.md
- ww.109 竖屏排版
  能力：竖屏阅读基准是段长中位约二十到三十字，五十字以内短段与单句成段为主，八十字以上长段尽量归零。
  引用：单句成段为主
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/references/flow-drafting.md
- ww.110 对话占比与直球交锋
  能力：对话占比参考百分之十八到三十八，靠直球交锋筹码施压和话语权反转推进，不强求每句对话藏潜台词。
  引用：靠直球交锋、筹码施压和话语权反转推进
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-write/references/flow-drafting.md
- ww.111 感官描写主导感官
  能力：感官描写先确定主导感官一到两种，视觉加触觉出临场感，感官描写服务于情感表达。
  引用：确定主导感官（1-2种）
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-write/references/writing/desire-description.md
- ww.112 章节规划黄金结构
  能力：每一章都是一个小故事，有开头发展高潮结尾，读者看完后应该有爽了或想看下一章的感觉。
  引用：每一章都是一个小故事，有开头、发展、高潮、结尾
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/references/outlining/chapter-planning.md
- ww.113 爽点章过渡章刀子章
  能力：章节按功能分三类：爽点章占百分之七十，目的是让读者爽提升订阅；过渡章占百分之二十承上启下铺垫伏笔；刀子章占百分之十制造虐点引发情绪波动。
  引用：让读者爽，提升订阅
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/references/outlining/chapter-planning.md
- ww.114 章节标题四公式
  能力：章节标题四公式：冲突型、悬念型、爽点型、反差型，如第 1 章退婚之辱、第 50 章一剑斩金丹全场震惊。
  引用：第1章：退婚之辱
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/references/outlining/chapter-planning.md
- ww.115 衔接三方式
  能力：章节衔接三方式：悬念衔接、场景衔接、情绪衔接，如第 49 章结尾林天深吸一口气一剑斩出，下一章直接接出剑的结果。
  引用：林天深吸一口气，一剑斩出
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-plan/references/outlining/chapter-planning.md
- ww.116 内容扩充六技巧
  能力：内容扩充六技巧是场景肌理充实、关键时刻放慢、内心世界展开、对话层次丰富、次要情节穿插、感官维度叠加，扩充应展开已有因果，不为凑字数临时制造新事件。
  引用：扩充应展开已有因果，不为凑字数临时制造新事件
  来源：PenglongHuang/chinese-novelist-skill/references/guides/content-expansion.md
- ww.117 转场方法
  能力：转场的本质是作者对时间和空间的把控，新手五种转场是时间、空间、物件桥接、空镜、对话引导，进阶十类再加心理情绪、视角切换、回忆梦境、摄像机接力、平行剪辑、蒙太奇。
  引用：转场的本质，是作者对时间和空间的把控
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/transition/tutorial.md
- ww.118 中文文学技法五种
  能力：中文文学技法五种：白描、留白、意象营造、草蛇灰线、蒙太奇剪辑，白描是用最少的笔墨精确捕捉本质，留白是不说的部分比说的部分更有力量。
  引用：用最少的笔墨精确捕捉本质
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.119 打破读者预期四技术
  能力：打破读者预期四技术：预期反转、信息差利用、复杂动机、节外生枝，预期反转是建立读者对 A 走向的预期然后转向 B。
  引用：建立读者对 A 走向的预期，然后转向 B
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md

## F 章末与伏笔

- ww.120 章末目标留下后劲
  能力：章末的目标不是收束完整，而是留下后劲，章末要让下一章有自然来处。
  引用：章末的目标不是“收束完整”，而是“留下后劲”
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/chapter_ending/tutorial.md
- ww.121 章末四种有效落点
  能力：章末四种有效落点：余韵型、反打一刀型、判决型、轻喜回钩型，反打一刀是最后一句或最后一个动作改写前文局势理解。
  引用：最后一句或最后一个动作，改写前文局势理解
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/chapter_ending/tutorial.md
- ww.122 余韵型落点
  能力：余韵型落点不是硬悬念，而是让前面累积的情绪在最后一拍落下去，靠情绪收尾不靠信息爆炸。
  引用：不是硬悬念，而是让前面累积的情绪在最后一拍落下去
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/chapter_ending/tutorial.md
- ww.123 判决型落点
  能力：判决型落点是主角或他人做出一个会直接推动下一章的决定，不大吵但一句话直接改局面。
  引用：主角或他人做出一个会直接推动下一章的决定
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/chapter_ending/tutorial.md
- ww.124 轻喜回钩型
  能力：轻喜回钩型是轻喜文也要有拉力，常靠一句回钩、一个歪刀、一个关系偏移来收。
  引用：轻喜文也要有拉力，常靠一句回钩、一个歪刀、一个关系偏移来收
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/chapter_ending/tutorial.md
- ww.125 章末失手识别
  能力：章末四失手：解释过度、高潮拖尾、钩子错位、变化全无，解释最容易把张力解释没，变化都没发生就收容易空。
  引用：解释最容易把张力解释没
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/chapter_ending/tutorial.md
- ww.126 长篇多条悬念弧
  能力：长篇小说需要同时运行多条不同长度的悬念弧，让读者始终有事在期待，悬念强度按长中短分级编排。
  引用：长篇小说需要同时运行多条不同长度的悬念弧
  来源：PenglongHuang/chinese-novelist-skill/references/guides/hook-techniques.md
- ww.127 每章回应旧悬念并提新悬念
  能力：连贯性保证是每章至少回应一个旧悬念，哪怕是部分回应，并提出一个新悬念或升级现有悬念。
  引用：每章至少回应一个旧悬念（哪怕是部分回应）
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.128 伏笔账本
  能力：伏笔要有账本，新埋下的伏笔会在后续规划中被标记为待回收，已回收的伏笔从待办状态移出，避免重复兑现。
  引用：新埋下的伏笔会在后续规划中被标记为待回收
  来源：ExplosiveCoderflome/AI-Novel-Writing-Assistant/mintlify-docs/creation-flow.mdx
- ww.129 已回收伏笔移出待办
  能力：已回收的伏笔会从待办状态移出，避免重复兑现，伏笔账本读写与同步是每章完成后的固定动作。
  引用：已回收的伏笔会从待办状态移出，避免重复兑现
  来源：ExplosiveCoderflome/AI-Novel-Writing-Assistant/mintlify-docs/creation-flow.mdx
- ww.130 状态回流
  能力：每章完成后回流状态，角色关系能力目标的变化会被后续章节继承，世界规则被破坏或补充也会成为后续基础。
  引用：角色关系、能力和目标的变化会被后续章节继承
  来源：ExplosiveCoderflome/AI-Novel-Writing-Assistant/mintlify-docs/creation-flow.mdx
- ww.131 兑现方式四种
  能力：前面种下的东西，后面要以冲突、反转、代价、收益中的某一种方式兑现，埋了不收等于读者期待落空。
  引用：前面种下的东西，后面要以冲突、反转、代价、收益中的某一种方式兑现
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/modules/plot_logic/tutorial.md
- ww.132 悬念强度分级
  能力：悬念强度分级编排，悬念是读者知道该问什么，困惑是读者连这个词是什么都不知道，后者不是留白是阅读噪音。
  引用：悬念是读者知道该问什么
  来源：PenglongHuang/chinese-novelist-skill/references/guides/chapter-guide.md
- ww.133 短篇明账清算收尾
  能力：短篇收尾要明账清算，除悬疑留白外，反派付具体代价，主角高位收口，禁哲理空尾。
  引用：反派付具体代价（破产/入狱/社死/内讧/追悔被拒）
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-write/SKILL.md

## G 审查与连载管理

- ww.134 审查只管挑毛病
  能力：审查只管挑毛病，不为原稿背书，审查报告只列问题与证据，不替原稿辩护。
  引用：审查只管挑毛病，不为原稿背书
  来源：zenstory-ai/oh-story-claudecode/skills/story-review/SKILL.md
- ww.135 通用 rubric 与平台 rubric
  能力：审查分通用 rubric 与平台 rubric，核心卖点检查是是否围绕明确卖点推进，看不出卖点至少 S2。
  引用：是否围绕明确卖点推进
  来源：zenstory-ai/oh-story-claudecode/skills/story-review/SKILL.md
- ww.136 S1 到 S4 严重度
  能力：严重度分四级：S1 破主线动机世界规则读者信任必改，S2 明显损留存节奏效果可信度必改，S3 建议改，S4 可忽略。
  引用：破主线/动机/世界规则/读者信任，必改
  来源：zenstory-ai/oh-story-claudecode/skills/story-review/SKILL.md
- ww.137 Findings Schema
  能力：每条 finding 必须带原文证据才出，只报告不落改，证据不足的发现不进报告。
  引用：有原文证据才出 finding，只报告不落改
  来源：zenstory-ai/oh-story-claudecode/skills/story-review/SKILL.md
- ww.138 冲突推进检查
  能力：冲突推进检查看有无阻碍、选择、代价、信息或关系推进，只解释闲聊总结至少 S2。
  引用：有无阻碍、选择、代价、信息或关系推进
  来源：zenstory-ai/oh-story-claudecode/skills/story-review/SKILL.md
- ww.139 角色动机检查
  能力：角色动机检查看行为是否符合目标性格处境和关系压力，为剧情失真判 S1 或 S2。
  引用：行为是否符合目标、性格、处境和关系压力
  来源：zenstory-ai/oh-story-claudecode/skills/story-review/SKILL.md
- ww.140 设定一致性检查
  能力：设定一致性检查看不违背既有规则时间线角色属性，明确事实冲突通常 S1。
  引用：不违背既有规则、时间线、角色属性
  来源：zenstory-ai/oh-story-claudecode/skills/story-review/SKILL.md
- ww.141 三道 write-gate
  能力：写作三道门：写前门、提交前门、提交后门，禁止并步跳步伪造审查，起草只根据任务书。
  引用：禁止并步、跳步、伪造审查
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-write/SKILL.md
- ww.142 审查只跑一轮
  能力：审查只跑一轮，阻塞问题定点修复或经用户裁决后才进润色与提交，不反复审查。
  引用：审查只跑一轮；blocking issue 定点修复或经用户裁决后才进 Step 4/5
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-write/SKILL.md
- ww.143 失败只补跑失败步骤
  能力：失败只补跑失败步骤，不回退，备份必须以解析后的项目根目录为准。
  引用：失败只补跑失败步骤，不回退
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-write/SKILL.md
- ww.144 禁止伪造审查结论
  能力：审查必须通过审查子代理调用，禁止主流程伪造结论或口头总结代替子代理输出。
  引用：禁止主流程伪造结论或口头总结代替 subagent 输出
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-review/SKILL.md
- ww.145 阻塞交用户裁决
  能力：阻塞问题三选一：立即修复输出返工清单仅在用户明确授权下做最小修改，跳过并记录，或重写相关章节。
  引用：立即修复：输出返工清单，仅在用户明确授权下做最小修改
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-review/SKILL.md
- ww.146 逐章清单 A 到 D
  能力：逐章清单分四段：写前分析六步、撰写、撰写后优化、收尾四步，完成一章后立即读取计划认领下一章，不要向用户确认，不要停下来。
  引用：完成一章后，立即读取 JSON 认领下一章，不要向用户确认，不要停下来
  来源：PenglongHuang/chinese-novelist-skill/references/flows/phase3-writing.md
- ww.147 第四阶段校验
  能力：第四阶段校验四类问题：状态未定、章节失败、字数不足、读取错误，全书最多三轮修复，三轮后未通过标待关注。
  引用：全书最多三轮
  来源：PenglongHuang/chinese-novelist-skill/references/flows/phase4-validation.md
- ww.148 三大黄金法则
  能力：三大黄金法则：展示而非讲述、冲突驱动剧情、悬念承上启下，展示是用动作和对话表现不要直接陈述，每章必须有冲突或转折，每章结尾必须留下钩子。
  引用：用动作和对话表现，不要直接陈述
  来源：PenglongHuang/chinese-novelist-skill/SKILL.md
- ww.149 写作模式三选
  能力：写作模式三选：逐章串行、子 Agent 并行每批三到五章、Agent Teams，批次内串行写作，批次间并行执行。
  引用：批次内串行写作，批次间并行执行
  来源：PenglongHuang/chinese-novelist-skill/references/flows/phase3-writing.md
- ww.150 只改表达不改事实
  能力：润色只改表达不改事实，阻塞问题在不改剧情不破设定的前提下定点修复后直接进提交。
  引用：只改表达不改事实
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-write/SKILL.md
- ww.151 项目记忆沉淀成功模式
  能力：写完一章把验证过的写法沉淀进项目记忆，归类为钩子节奏对话兑现情绪格式或其他，只追加不删除，完全相同的才跳过。
  引用：提取可复用的写作模式（钩子/节奏/对话/微兑现等）
  来源：lingfengQAQ/webnovel-writer/webnovel-writer/skills/webnovel-learn/SKILL.md
- ww.152 分段授权先小后大
  能力：分段授权先小后大，不要一上来就提交第 1 至 10 章，先写第 1 至 3 章验证，再扩大到第 4 至 10 章，全自动不会擅自写超出授权范围的内容。
  引用：不要一上来就提交第 1 至 10 章。先选一个小范围，观察正文质量和调用节奏
  来源：ExplosiveCoderflome/AI-Novel-Writing-Assistant/mintlify-docs/first-ten-chapters.mdx
- ww.153 暂停恢复回导演台
  能力：暂停原因分五种：范围完成、单章用量上限默认二十万 Tokens、模型不可用、需要确认、需要重新规划，所有恢复操作都要回到本书导演台完成，不要靠重复点击生成代替恢复。
  引用：所有恢复操作都要回到本书导演台完成
  来源：ExplosiveCoderflome/AI-Novel-Writing-Assistant/mintlify-docs/first-ten-chapters.mdx

## H 拆文与扫榜方法

- ww.154 长篇拆文 Stage 0 到 6
  能力：长篇拆文分七阶段：机械索引、黄金三章体检、逐批提取、剧情与节奏、角色与设定、主报告、文风，只据可读原文与已有资料下结论，缺失写未知或文本未明确，不虚构事实。
  引用：只据可读原文与已有资料下结论
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-analyze/SKILL.md
- ww.155 机械索引建后复用
  能力：机械索引建后复用，每原文块只读一次，同次产出逐章事实与跨章观察，聚合阶段只读已落盘结果不重扫全书。
  引用：聚合阶段只读已落盘结果，不重扫全书
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-analyze/SKILL.md
- ww.156 只迁移抽象机制
  能力：拆文只迁移抽象机制，不复刻专有设定事件链场面或原句，禁把原书专名事件顺序标志台词写成模板。
  引用：只迁移抽象机制，不复刻专有设定、事件链、场面或原句
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-analyze/SKILL.md
- ww.157 剧情点合并四要素
  能力：剧情点合并时每条须具备可衡量核心目标、具体冲突阻力、相对独立角色群与完整弧线，四要素缺一不可。
  引用：每条须具备可衡量核心目标、具体冲突/阻力、相对独立角色群与完整弧线
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-analyze/references/stage3-plot-rhythm.md
- ww.158 先定读者需求与模块卡再套新书
  能力：拆文产出要先定读者需求与模块卡再套新书人设，不从原书桥段倒抄，读者想看什么、情绪链、戏剧单元、可替换项、不可照搬为下游必读字段。
  引用：先定读者需求与模块卡再套新书人设，不从原书桥段倒抄
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-analyze/references/stage3-plot-rhythm.md
- ww.159 短篇拆文五段功能划分
  能力：短篇拆文先按五段功能划分源文：导语冷开场、免费建压、付费强卡点、连环反击反转、明账清算收尾，再判断它接近哪种高频爆款结构。
  引用：导语冷开场/免费建压/付费强卡点/连环反击反转/明账清算收尾
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-analyze/SKILL.md
- ww.160 付费断点
  能力：付费断点是商业转化的核心位置，短篇付费断点在百分之三十到四十处，卡在巴掌将落、底牌刚掀、真相念半截。
  引用：付费断点是商业转化的核心位置
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-analyze/references/analysis-short-hooks.md
- ww.161 量化网感体检表 9 项
  能力：短篇拆文要做量化网感体检，基于原文实测九项客观指标：总字数、节数、段长中位、单句成段率、对话占比、叙述人称、首冲突字位、非末节节尾卡点率、收尾类型。
  引用：基于原文实测 9 项客观指标
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-analyze/references/stage4-6-reversal-summary.md
- ww.162 反转类型六种
  能力：短篇反转分六种：视角反转、身份反转、动机反转、时间线反转、信息反转、认知反转，连续多节只压迫不给反击或暗牌，报告为纯虐空转。
  引用：视角反转/身份反转/动机反转/时间线反转/信息反转/认知反转
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-analyze/references/stage4-6-reversal-summary.md
- ww.163 情绪弧线取点
  能力：情绪弧线只在情绪立场、期待或压力实际变化处取点，首尾各取一点，记录起始、走向、极值、方向差、翻转次数。
  引用：只在情绪立场、期待或压力实际变化处取点（首尾各一点）
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-analyze/references/stage2-3-structure-emotion.md
- ww.164 扫榜看新书榜与多榜重合
  能力：扫榜看新书榜与多榜重合，单本排名只提供线索，近期多榜单多作品的重复模式才支持趋势判断。
  引用：单本排名只提供线索，近期多榜单、多作品的重复模式才支持趋势判断
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-scan/SKILL.md
- ww.165 头部老书不代表新方向
  能力：头部老书字数几百万连载多年，代表这个题材的存量读者，不代表现在开新书能起来，判断新方向以新书榜书库新书为主。
  引用：代表这个题材的存量读者，不代表现在开新书能起来
  来源：zenstory-ai/oh-story-claudecode/skills/story-long-scan/SKILL.md
- ww.166 短篇扫榜六种写作情绪
  能力：短篇扫榜按六种写作情绪归类：意难平、反转震撼、爽感释放、治愈温暖、细思极恐、共鸣感动，优先根据简介判断读者读完的感受，只归一类。
  引用：优先根据简介判断读者读完的感受，只归一类
  来源：zenstory-ai/oh-story-claudecode/skills/story-short-scan/SKILL.md
- ww.167 导入逆向工程
  能力：导入逆向工程是把作者已有的书整理成可续写的写作工程：设定、大纲、正文与所需追踪，已有摘要永不覆盖，绝不把拆文库或项目设定复制进对标。
  引用：设定、大纲、正文与所需追踪
  来源：zenstory-ai/oh-story-claudecode/skills/story-import/SKILL.md
- ww.168 标题创作五技巧
  能力：标题创作五技巧：核心冲突提炼、主角命名、意象隐喻、反差、悬念留白，核心冲突提炼是从故事核心冲突中提炼关键词组合成标题，字数二到八字为主流。
  引用：从故事核心冲突中提炼关键词，组合成标题
  来源：PenglongHuang/chinese-novelist-skill/references/guides/title-guide.md
- ww.169 写法引擎
  能力：写法引擎是写法资产中枢，拆书模块负责发现写法，写法引擎负责沉淀并执行写法，把文风与技法转换为可执行写法资产，描述层与执行层分离。
  引用：把文风与技法转换为可执行写法资产
  来源：ExplosiveCoderflome/AI-Novel-Writing-Assistant/docs/design/style-engine-v1.md
- ww.170 世界到故事接口
  能力：世界到故事接口回答四个问题：裁剪本书相关部分、把静态设定转成叙事可用信息、提供可直接生成故事引擎的输入、限制后续生成范围。
  引用：把静态设定转成“叙事可用信息”
  来源：ExplosiveCoderflome/AI-Novel-Writing-Assistant/docs/design/world-story-interface-v1.md
- ww.171 滚动窗口只补缺
  能力：滚动窗口只补缺，不是作者要求的整卷重生成，生成结果不能改变已保存的卷属性、章序、章节编号、任务单、场景和节奏。
  引用：滚动窗口只补缺，不是作者要求的整卷重生成
  来源：ExplosiveCoderflome/AI-Novel-Writing-Assistant/server/src/services/novel/volume/routeWindow/README.md
- ww.172 模仿检索只仿结构
  能力：模仿检索先判断模仿什么结构，找两到四个相似例子，总结共同结构再写新内容，允许模仿结构节奏信息投放章末截断，不仿具体情节与原句。
  引用：允许模仿结构、节奏、信息投放、章末截断
  来源：Tomsawyerhu/Chinese-WebNovel-Skill/references/webnovel_corpus_guide.md

## I 计谋与阴谋叙事

九本书的叙事能力合集：三十六计、阴谋论、孙子兵法、鬼谷子、厚黑学、君主论、乌合之众、影响力、1984。写小说时按书查对应能力，计谋当剧情套路，阴谋当故事钩子，群体与说服当场面与对话的路子。

### 三十六计叙事

- ww.173 总说数中有术（三十六计 sj.01）
  能力：全书总纲是数中有术，术中有数，意思是计谋不在招数本身，而在数，也就是时机，分寸，火候。写小说用计先看时机是否到了，时机不到计再妙也落空，时机到了平常举动也能成计。思维模式是先问现在是什么时机，再问这招合不合时机，不合时机就收住不用。
  引用：六六三十六，数中有术，术中有数
  来源：三十六计技能包 sj.01
- ww.174 六套分组总纲（三十六计 sj.02）
  能力：三十六计每六计成一套，前三套胜战计，敌战计，攻战计是处于优势时用的计，后三套混战计，并战计，败战计是处于劣势时用的计。写小说先定主角此刻是强是弱，再去对应套里挑计，强者用胜战计容易写飘，弱者用败战计容易写惨，都要让计跟着处境走。思维模式是先判强弱，再选套，最后才落到某一计。
  引用：前三套是处于优势所用之计，后三套是处于劣势所用之计
  来源：三十六计技能包 sj.02
- ww.175 瞒天过海（三十六计 sj.03）
  能力：计义是秘计藏在公开事物里，防备越周全越容易松懈，见惯了就不疑。小说用法是让主角把真实行动藏进每天重复的公开举动里，反派看惯了便不再设防，主角突然行动时反转才成立。按语战例是贺若弼以江防调防为幌子，屡次大张旗鼓，陈国看惯后松懈，隋军渡江一举拔南徐州。思维模式是找一个对方已经看惯的东西，把真意图藏进它的重复里。
  引用：备周则意怠，常见则不疑
  来源：三十六计技能包 sj.03
- ww.176 围魏救赵（三十六计 sj.04）
  能力：计义是强敌兵力集中时不硬碰，攻其必救的薄弱后方，迫使强敌分兵回救。小说用法是主角救人或解围时不直奔被围处，而是去打反派的老巢或命脉，反派回防，主角以逸待劳。按语战例是孙膑不救邯郸而直插大梁，庞涓回救，齐军大败魏军。思维模式是问敌人的后方哪里非救不可，打那里比打正面省力。
  引用：共敌不如分敌，敌阳不如敌阴
  来源：三十六计技能包 sj.04
- ww.177 借刀杀人（三十六计 sj.05）
  能力：计义是敌已明而友未定，借第三方的手杀敌，自己不损实力。小说用法是让主角挑动两个敌对势力互斗，或利用反派内部矛盾使其自相残杀，主角只递消息，不动刀。按语战例是郑桓公把郐国良臣姓名写成盟书埋于郭门，郐君以为内难尽杀其良臣，桓公袭郐遂取之。思维模式是先找谁能替你动手，再想怎么让那把刀自己动起来。
  引用：敌已明，友未定，引友杀敌
  来源：三十六计技能包 sj.05
- ww.178 以逸待劳（三十六计 sj.06）
  能力：计义是困敌之势不以战，先占有利地形养精蓄锐，等敌远来疲惫再打。小说用法是让主角故意示弱退让，把战场拖到自己熟悉的地形，等反派人困马乏再反攻。按语战例是陆逊退避刘备锋芒，相持半年后火烧蜀军七百里连营。思维模式是算谁更累，累的那一方先输，先让对手把力气耗在路上。
  引用：困敌之势，不以战
  来源：三十六计技能包 sj.06
- ww.179 趁火打劫（三十六计 sj.07）
  能力：计义是敌遭大害时就势取利，敌害在内劫其地，在外劫其民，内外俱害劫其国。小说用法是反派刚遭内乱，天灾或败仗，主角立刻趁乱取其地盘，情报或人心，晚一步火就灭了。按语战例是越王乘吴国国内空虚，吴北会诸侯于黄池之际捣其国，大获全胜。思维模式是盯住对方出事的窗口，窗口一开就动手，窗口一合就收手。
  引用：敌之害大，就势取利
  来源：三十六计技能包 sj.07
- ww.180 声东击西（三十六计 sj.08）
  能力：计义是造出东边的声势，让敌人志乱而不能自主，真正动手在西边。小说用法是主角先放出假消息或假攻势调动反派，再从反派顾不上的方向下手。按语战例是朱儁鸣鼓攻宛城西南，黄巾悉众赴之，朱儁自将精兵掩其东北，乘虚而入。思维模式是先看敌人志乱不乱，志不乱此计险，志乱了再声东击西。
  引用：敌志乱萃，不虞
  来源：三十六计技能包 sj.08
- ww.181 无中生有（三十六计 sj.09）
  能力：计义是诳也，非诳也，实其所诳也，用大大小小的假象掩护真象，由虚而实。小说用法是主角先造一个假象骗过对手，等对手把假象当真并按假象行动，真杀招就从假象背后出来。按语战例是张巡缚草人为千余夜缒城下，令狐潮兵争射得箭数十万，后复夜缒人，潮兵笑而不备，张巡以死士五百砍潮营。思维模式是假象不能一假到底，要让假象长出真后果，对手才会信。
  引用：诳也，非诳也，实其所诳也
  来源：三十六计技能包 sj.09
- ww.182 暗渡陈仓（三十六计 sj.10）
  能力：计义是明修栈道示之以动，暗渡陈仓取其静而有主，奇出于正，无正不能出奇。小说用法是主角在明处大张旗鼓做一件事，把所有目光吸过去，真正的人马从另一条路悄悄到位。按语说不明修栈道则不能暗渡陈仓，姜维不善用此计而邓艾察知其谋。思维模式是明动作要够真，真到对手愿意盯着它，暗动作才能走通。
  引用：示之以动，利其静而有主
  来源：三十六计技能包 sj.10
- ww.183 隔岸观火（三十六计 sj.11）
  能力：计义是敌方内部秩序乱了，暗中静观其变，等其自相残杀，时机到了坐收其利。小说用法是两个反派内斗时，主角不急于下场，先让他们互相消耗，等一方露出败相再出手收局。按语战例是曹操不急征辽东，缓之则袁尚袁熙相图，公孙康斩尚熙首来献。思维模式是问对方乱不乱，逼则受击，退则远之，乱自起，不必替他们动手。
  引用：阳乖序乱，阴以待逆
  来源：三十六计技能包 sj.11
- ww.184 笑里藏刀（三十六计 sj.12）
  能力：计义是信而安之，阴以图之，先让对方信而不疑，再暗中图谋，备而后动。小说用法是让反派对主角笑脸相迎，言语温和，实则已布好杀局，主角识破的关键是看对方辞卑而备益增。按语战例是曹玮对客弈棋言笑如平时，西夏人以为袭己尽杀叛夸，勾践事夫差意使其久而安之。思维模式是听到巧言令色先问对方在备什么，笑越和气，备越要查。
  引用：信而安之，阴以图之
  来源：三十六计技能包 sj.12
- ww.185 李代桃僵（三十六计 sj.13）
  能力：计义是势必有损，损阴以益阳，以局部牺牲换全局胜利。小说用法是主角主动舍一员小将，一处地盘或一个名声，换来主力脱身或全盘翻转，牺牲要写得疼，换来的东西要写得值。按语战例是田忌赛马以下驷敌上驷，以上驷敌中驷，以中驷敌下驷，以短胜长。思维模式是先算全局账，再定局部舍什么，不肯舍小的，保不住大的。
  引用：势必有损，损阴以益阳
  来源：三十六计技能包 sj.13
- ww.186 顺手牵羊（三十六计 sj.14）
  能力：计义是微隙在所必乘，微利在所必得，大军动处其隙甚多，乘间取利不必以胜。小说用法是主角在大战间隙顺手拿走情报，俘虏，物资或人心，小得利积成大优势，败中也能捞一笔。按语说胜固可用，败亦可用。思维模式是行军打仗总有缝，盯住缝，不贪大，先把眼前的小利拿到手。
  引用：微隙在所必乘，微利在所必得
  来源：三十六计技能包 sj.14
- ww.187 打草惊蛇（三十六计 sj.15）
  能力：计义是疑以叩实，察而后动，发现疑点就敲打试探，看清虚实再动手。小说用法是主角不确定暗处有没有埋伏，先放一个小动静引蛇出洞，根据对方反应再定真攻还是真退。按语说敌力不露，阴谋深沉，未可轻进，应遍探其锋，军旁有险阻必谨复索之。思维模式是疑点出现先验证，不验证就冲，等于替对方探路。
  引用：疑以叩实，察而后动
  来源：三十六计技能包 sj.15
- ww.188 借尸还魂（三十六计 sj.16）
  能力：计义是有用者不可借，不能用者求借，借不能用者而用之，让旧名头复活为新力量。小说用法是主角接过一个已败的帮派，旧旗号或旧制度，换上自己的人，借它的名望收编人心。按语说换代之际纷立亡国之后者，固借尸还魂之意也。思维模式是问什么旧东西名还在人散了，借它的名，装自己的魂。
  引用：有用者，不可借；不能用者，求借
  来源：三十六计技能包 sj.16
- ww.189 调虎离山（三十六计 sj.17）
  能力：计义是待天以困之，用人以诱之，用假象诱敌离开有利地形，使其由主变被动。小说用法是反派守着险地不出来，主角放出诱饵引其出山，再断其归路。按语战例是虞诩宣言上书请兵须到乃发，羌分抄旁县，虞诩日夜兼行增灶惑敌，大破之。思维模式是问对方守着什么地利，再造一个让他非出来不可的理由。
  引用：待天以困之，用人以诱之
  来源：三十六计技能包 sj.17
- ww.190 欲擒故纵（三十六计 sj.18）
  能力：计义是逼则反兵，走则减势，紧随勿迫，累其气力，消其斗志，散而后擒，兵不血刃。小说用法是主角故意放走反派一路跟随，等其力竭志消再收网，放是手段，擒是目的。按语战例是诸葛亮七纵七擒孟获，纵而随之，意在拓地借孟获以服诸蛮。思维模式是放之前先想好跟得住，收网的时机在对方散了之后，不在刚放之时。
  引用：逼则反兵，走则减势
  来源：三十六计技能包 sj.18
- ww.191 抛砖引玉（三十六计 sj.19）
  能力：计义是类以诱之，以类似的东西诱敌上钩，最妙不在疑似之间而在类同。小说用法是主角先抛出一份真假掺半的诱饵，诱饵要像真的，反派贪利追来，正好撞进埋伏。按语战例是屈瑕勿捍采樵者以诱绞人，绞人争出而楚伏兵大败之，孙膑减灶诱杀庞涓。思维模式是诱饵要类同不要疑似，越像对方想要的，越容易上钩。
  引用：类以诱之，击蒙也
  来源：三十六计技能包 sj.19
- ww.192 擒贼擒王（三十六计 sj.20）
  能力：计义是摧其坚，夺其魁，以解其体，打掉首领全军自解。小说用法是主角不与敌军纠缠，直取敌酋，敌酋一倒，余众自散。按语战例是张巡直冲敌营至尹子奇麾下，霁云射中其左目，子奇收军退还。思维模式是先认阵中首动是谁，擒王之前不图旌旗，擒王之后不恋小胜。
  引用：摧其坚，夺其魁，以解其体
  来源：三十六计技能包 sj.20
- ww.193 釜底抽薪（三十六计 sj.21）
  能力：计义是不敌其力，而消其势，力不可当而势犹可消，夺气之法则在攻心。小说用法是主角打不过反派的硬实力，就去断其粮道，散其军心或夺其名义，势一消力自散。按语战例是吴汉坚卧不动，军中闻汉不动有顷乃定，乃选精兵反击大破之，薛长儒单身入叛营以福祸语乱卒，独主谋十三人散去。思维模式是问对方的势靠什么烧着，抽掉柴火比往锅里加水管用。
  引用：不敌其力，而消其势
  来源：三十六计技能包 sj.21
- ww.194 混水摸鱼（三十六计 sj.22）
  能力：计义是乘其阴乱，利其弱而无主，敌内部混乱时我随而取之。小说用法是多方混战，局势不明时，主角不站队先浑水，趁乱取地，取人或取宝，等水清了已成定局。按语战例是刘备之得荆州取西川皆此计也。思维模式是乱中先找谁无主，无主的东西先下手为强，水清之后再谈道理。
  引用：乘其阴乱，利其弱而无主
  来源：三十六计技能包 sj.22
- ww.195 金蝉脱壳（三十六计 sj.23）
  能力：计义是存其形，完其势，友不疑，敌不动，大军转动而旌旗金鼓俨然原阵，使敌不敢动。小说用法是主角要抽身去打另一处，留下一支疑兵守着原阵，旗鼓照旧，对方半天才发觉人已走了。按语战例是诸葛亮卒于军，姜维令杨仪反旗鸣鼓若向司马懿，懿退，仪结营而去，檀道济被围命军士悉甲，身自白服乘舆徐出外围，魏惧有伏不敢逼。思维模式是脱身先留形，形在势在，对方不敢轻动，人才能走干净。
  引用：存其形，完其势
  来源：三十六计技能包 sj.23
- ww.196 关门捉贼（三十六计 sj.24）
  能力：计义是小敌困之，对小股敌人要及时围困消灭，断其去路则成擒，追贼则贼必死斗。小说用法是主角放一支敌军小队进来再关门打狗，关门是关键，门不关贼就跑了还可能引来援兵。按语引吴子曰，死贼伏于旷野，千人追之莫不枭视狼顾，恐其暴起而害己也。思维模式是先看能不能困住，能困再放进来，不能困就放它走，别追。
  引用：小敌困之
  来源：三十六计技能包 sj.24
- ww.197 远交近攻（三十六计 sj.25）
  能力：计义是形禁势格，利从近取，害以远隔，远者结之，近者攻之，各自取利。小说用法是主角与远方势力结盟，集中力量先打近邻，近邻一倒再图远方。按语说范雎之谋为地理之定则，其理甚明。思维模式是按远近排先后，近的先打，远的先交，打一个交一个，别两面树敌。
  引用：利从近取，害以远隔
  来源：三十六计技能包 sj.25
- ww.198 假道伐虢（三十六计 sj.26）
  能力：计义是两大之间，敌胁以从，我假以势，借道之名行灭国之实，借的是势，得的是全势。小说用法是主角以借路为名进驻中间小国，小国迫于两大夹击不得不从，主角得势后连小国一起收了。按语战例是晋侯假道于虞以伐虢，灭虢后师还袭虞灭之。思维模式是问中间那家怕谁多一点，怕谁就借谁的势，借到了就不要再还。
  引用：两大之间，敌胁以从，我假以势
  来源：三十六计技能包 sj.26
- ww.199 偷梁换柱（三十六计 sj.27）
  能力：计义是频更其阵，抽其劲旅，待其自败，而后乘之，共战他敌时暗中抽换盟友精兵。小说用法是主角与盟友联军，借调防换阵的名义把盟友精锐换成自己人，盟友阵塌，兵权易手。按语说阵有纵横，天衡为梁，地轴为柱，梁柱以精兵为之，势成阵塌遂兼其兵。思维模式是盯住盟友的梁柱，换梁柱不要换门面，换完了对方才发现塌了。
  引用：频更其阵，抽其劲旅
  来源：三十六计技能包 sj.27
- ww.200 指桑骂槐（三十六计 sj.28）
  能力：计义是大凌小者，警以诱之，强者治不服的部下不直斥其人，而是指着别人警戒他。小说用法是主角要敲打一个刺头，不点名骂他，只当众罚另一个犯小错的人，刺头自己听懂了。按语战例是穰苴斩庄贾以严军纪。思维模式是敲打要借题，借了题对方才服气，直斥反而启疑。
  引用：大凌小者，警以诱之
  来源：三十六计技能包 sj.28
- ww.201 假痴不癫（三十六计 sj.29）
  能力：计义是宁伪作不知不为，不伪作假知妄为，静不露机，机未发时静屯似痴。小说用法是主角装糊涂藏锋芒，让对手轻敌，等时机一到突然发难。按语战例是司马懿假病昏以诛曹爽，狄青佯祝掷钱皆钱面以壮军心，反面是姜维九伐中原明知不可为而妄为之，则似痴矣所以破灭。思维模式是装不知可以，装假知不行，痴是藏机，癫是露机，分清再装。
  引用：宁伪作不知不为，不伪作假知妄为
  来源：三十六计技能包 sj.29
- ww.202 上屋抽梯（三十六计 sj.30）
  能力：计义是假之以便，唆之使前，断其援应，陷之死地，先置梯或示之梯，再抽梯。小说用法是主角先给反派一个方便上楼，引他越走越深，再断其后路，反派想回头已经没梯子。按语战例是慕容垂姚萇怂恿苻坚侵晋，以乘机自起。思维模式是抽梯之前先置梯，没有梯子对方不会上楼，梯子一抽才算计成。
  引用：假之以便，唆之使前，断其援应
  来源：三十六计技能包 sj.30
- ww.203 树上开花（三十六计 sj.31）
  能力：计义是借局布势，力小势大，弱小部队凭借局面改换外部形态，显得兵强马壮。小说用法是主角兵少，就借友军旗号，地形或声势把阵势撑大，对手看不出虚实不敢轻进。按语说此树本无花而树则可以有花，剪彩贴之，不细察者不易发，使花与树交相辉映而成玲珑全局。思维模式是力小就借局，借来的势要贴得牢，贴不住一细看就穿帮。
  引用：借局布势，力小势大
  来源：三十六计技能包 sj.31
- ww.204 反客为主（三十六计 sj.32）
  能力：计义是乘隙插足，扼其主机，渐之进也，客久而能主事则渐握机要。小说用法是主角先以客人身份进入对方地盘，争客位，乘隙，插足，握机，一步一步反成主人。按语说反客为主之局分五步，争客位，乘隙，插足，握机，为主，刘邦卑事项羽使其见信，而渐以侵其势，至垓下一举亡之。思维模式是先站稳客位再图主位，跳过客位直接夺主，对方立刻翻脸。
  引用：乘隙插足，扼其主机
  来源：三十六计技能包 sj.32
- ww.205 美人计（三十六计 sj.33）
  能力：计义是兵强者攻其将，将智者伐其情，将弱兵颓其势自萎，事以美人以佚其志，以弱其体，以增其下之怨。小说用法是主角打不过智将，就用情，色或享乐乱其心志，将一垮兵自散。按语战例是勾践以西施重宝取悦夫差，乃可转败为胜。思维模式是问对方将领的情关在哪里，攻将先攻情，情乱了将就不是将了。
  引用：兵强者，攻其将；将智者，伐其情
  来源：三十六计技能包 sj.33
- ww.206 空城计（三十六计 sj.34）
  能力：计义是虚者虚之，疑中生疑，空虚就让它空虚，使敌在疑惑中更加疑惑。小说用法是主角兵力空虚时反而不设防，城门大开，抚琴置酒，对方疑有埋伏不敢进。按语战例是张守圭于城上置酒作乐以会将士，敌疑城中有备不敢攻而退，祖鋌静座街巷禁断行人鸡犬，贼无所见闻不测所以而走散。思维模式是虚要虚到底，半虚半实最容易露馅，虚中再布一层疑才吓得住人。
  引用：虚者虚之，疑中生疑
  来源：三十六计技能包 sj.34
- ww.207 反间计（三十六计 sj.35）
  能力：计义是疑中之疑，在疑阵中再布疑阵，因敌之间而间之，使敌自相疑忌。小说用法是主角收买或利用对方派来的间谍，反手放假消息离间对方君臣将帅。按语战例是田单纵反间曰乐毅欲连兵王齐，惠王使骑劫代将，乐毅奔赵，周瑜利用曹操间谍以间其将，陈平以金纵反间于楚军间范增，楚王疑而去之。思维模式是敌间一到先别杀，问他能替你传什么话回去，传回去的话要能挑起对方内疑。
  引用：疑中之疑
  来源：三十六计技能包 sj.35
- ww.208 苦肉计（三十六计 sj.36）
  能力：计义是人不自害，受害必真，以假作真以真作假，离间计就可实行。小说用法是主角派自己人假装受刑挨打，骗取对方信任打入内部，伤要真，疼要真，假在目的。按语说凡遣与己有隙者以诱敌人，约为了共力者，皆苦肉计之类也。思维模式是问对方凭什么信你，信的凭据是没人会自害，那就把自害做真，做到对方信为止。
  引用：人不自害，受害必真
  来源：三十六计技能包 sj.36
- ww.209 连环计（三十六计 sj.37）
  能力：计义是将多兵众不可以敌，使其自累，以杀其势，一计累敌，一计攻敌，两计扣用。小说用法是主角一计接一计，前计让敌人自己把自己绑住，后计顺势攻其要害。按语战例是庞统使曹操战舰勾连而后纵火焚之，使不得脱，毕再遇以香料煮黑豆布地上，敌马闻香就食鞭之不前，遇率师反攻大胜。思维模式是单计不够就连环，前计只管累敌，后计只管攻敌，两计扣在一起才算一计。
  引用：将多兵众，不可以敌，使其自累
  来源：三十六计技能包 sj.37
- ww.210 走为上（三十六计 sj.38）
  能力：计义是全师避敌，敌势全胜我不能战，则必降必和必走，降则全败，和则半败，走则未败，未败者胜之转机也。小说用法是主角打不赢时不硬撑，全军退走留得青山，退时还要留疑兵断后，让对方追不上。按语战例是毕再遇与金人对垒度金兵至者日众，一夕拔营去，留旗帜于营，悬生羊击鼓有声，金人不觉为空营，相持数日乃觉，欲追则已远矣。思维模式是先算降和走三条路的代价，走是唯一不败的路，走了不是输，是留转机。
  引用：全师避敌
  来源：三十六计技能包 sj.38
- ww.211 连环组合（三十六计 sj.39）
  能力：单计只能解一时之困，大局要靠多计扣用，前计累敌，后计攻敌，计与计之间要互相咬合。写小说时先排计链，每一计的收尾就是下一计的起手，中间不断线，读者回头才看得出全盘都是局。思维模式是排计链之前先想敌人会被哪一计累住，再想哪一计能顺势攻进去，扣不上的两计别硬凑。
  引用：一计累敌，一计攻敌，两计扣用
  来源：三十六计技能包 sj.39
- ww.212 选计与人情（三十六计 sj.40）
  能力：选计不看计厉不厉害，看合不合事理人情，事出不经则诡异立见，机谋泄矣。写小说选计时先看人物性格，处境，关系三样合不合，合了计才像人物自己想出来的，不合就成了作者硬塞的。思维模式是先想这个人会不会用这招，再想这招在此时此地合不合理，两样都合才下笔。
  引用：诡谋权术，原在事理之中，人情之内
  来源：三十六计技能包 sj.40

### 阴谋论叙事

- ww.213 未解之问开场（阴谋论 ym.01）
  能力：故事从一个官方答案没有堵住的疑问开局，先立一个悬而未决的问题，再让非常规答案登场，疑问越具体，读者越容易跟进。
  引用：unanswered questions such as
  来源：阴谋论叙事技能包 ym.01
- ww.214 表面之下（阴谋论 ym.02）
  能力：先给一个看似合理的表层解释，再翻转成表层只是假象，真相反藏在下面，翻转一次就够，多次翻转会让读者脱钩。
  引用：nothing is as it seems
  来源：阴谋论叙事技能包 ym.02
- ww.215 万物皆有主使（阴谋论 ym.03）
  能力：故事世界里不留巧合与意外，每件事背后都有人安排，事件之间全部连线，读者一旦接受这个前提，任何新线索都能并进主线。
  引用：everything is connected
  来源：阴谋论叙事技能包 ym.03
- ww.216 凡事皆有因（阴谋论 ym.04）
  能力：拒绝偶然解释，任何小事都必须有一个对应的原因，原因链越完整，故事越显得自洽，哪怕原因链是事后拼出来的。
  引用：nothing happens by accident
  来源：阴谋论叙事技能包 ym.04
- ww.217 体量对等（阴谋论 ym.05）
  能力：大事件必须配大原因，小原因解释不了大灾难，主角与读者都觉得平庸解释配不上事件分量，于是主动寻找更大的黑手。
  引用：the cause must be as horrific as the event
  来源：阴谋论叙事技能包 ym.05
- ww.218 善恶二元模板（阴谋论 ym.06）
  能力：把复杂局面压成正邪对决，英雄与恶势力各占一边，读者不用理解全貌，只需选边站，模板越熟悉，故事越容易被接受。
  引用：a good-versus-evil tale
  来源：阴谋论叙事技能包 ym.06
- ww.219 弱者揭密者（阴谋论 ym.07）
  能力：主角设定为势单力薄的普通人，对抗远比自己强大的邪恶势力，弱者身份本身就是可信度来源，读者天然同情下位者。
  引用：underdog fighting to uncover the truth
  来源：阴谋论叙事技能包 ym.07
- ww.220 幕后黑手（阴谋论 ym.08）
  能力：反派不露面，只通过代理人行事，读者看不见他，只能看见他的手笔，缺席反而放大了他的权力感。
  引用：a small group of usually powerful people
  来源：阴谋论叙事技能包 ym.08
- ww.221 秘密行事（阴谋论 ym.09）
  能力：黑手的行动一律在暗处进行，秘密本身就是剧情燃料，越是见不得光，越显得图谋越大。
  引用：working in secret for their own benefit
  来源：阴谋论叙事技能包 ym.09
- ww.222 秘密会社（阴谋论 ym.10）
  能力：给黑手一个有名字的组织，有入会仪式，有等级，有暗号，组织一旦有了名字，就能反复出场，替每一件坏事背锅。
  引用：puppet masters of world events
  来源：阴谋论叙事技能包 ym.10
- ww.223 掩盖情节（阴谋论 ym.11）
  能力：官方掩盖是第二层剧情，掩盖行为本身成了黑手存在的证据，越是否认，越像坐实，写掩盖时要给出具体的掩盖动作，不要只喊口号。
  引用：covered this up in order to invade
  来源：阴谋论叙事技能包 ym.11
- ww.224 异常猎手（阴谋论 ym.12）
  能力：主角靠搜集反常细节推进剧情，一个时间对不上，一个数字改过，一张照片多了一个人，每处反常都是一块拼图。
  引用：anomaly hunting
  来源：阴谋论叙事技能包 ym.12
- ww.225 证据链拼图（阴谋论 ym.13）
  能力：把散落的线索拼成一张全图，拼图完成的一刻就是高潮，拼图结构要让读者先看到碎片，再看到整幅画，顺序不能乱。
  引用：all facets of human history are interconnected
  来源：阴谋论叙事技能包 ym.13
- ww.226 旧神新衣（阴谋论 ym.14）
  能力：老母题换上新事件就能再讲一遍，换一个名词，换一个动词，故事立刻翻新，读者觉得新鲜，骨架其实没变。
  引用：change one noun or change a verb
  来源：阴谋论叙事技能包 ym.14
- ww.227 替罪羊（阴谋论 ym.15）
  能力：灾难之后人群需要一个可指认的靶子，把无解的恐惧变成有形的敌人，靶子一旦立住，剧情就有了发泄口，写这段要写出寻找靶子的过程，不要只写结果。
  引用：sought a scapegoat
  来源：阴谋论叙事技能包 ym.15
- ww.228 吹哨人与双面人（阴谋论 ym.16）
  能力：安排一个从内部出来的人泄密，或者一个表面效忠暗地反抗的双面人，内线角色是剧情可信度的支点，他的身份反转本身就是一次高潮。
  引用：double agents
  来源：阴谋论叙事技能包 ym.16
- ww.229 揭秘时刻（阴谋论 ym.17）
  能力：全剧压向一次真相大白，揭秘前要先把所有线索收束到同一点，揭秘后主角的世界观彻底翻转，揭秘不能只靠一句台词，要靠前面埋好的证据链。
  引用：the Great Awakening
  来源：阴谋论叙事技能包 ym.17
- ww.230 兔子洞下沉（阴谋论 ym.18）
  能力：每解开一层，下面还有更深一层，读者跟着主角一路下沉，下沉的动力是好奇心，写的时候每层都要给一个新发现，不能只重复上一层。
  引用：how deep the rabbit hole goes
  来源：阴谋论叙事技能包 ym.18
- ww.231 红药丸选择（阴谋论 ym.19）
  能力：给主角一个二选一的觉醒时刻，吃下真相就回不了头，拒绝就继续活在假象里，选择本身比答案更抓人，写选择时要写出代价。
  引用：You take the red pill
  来源：阴谋论叙事技能包 ym.19
- ww.232 反证免疫（阴谋论 ym.20）
  能力：让故事里的信念体自带免疫机制，任何反驳都被解释成敌人放出的烟雾，故事因此打不死，写这种角色要写出他消化反证的具体话术，不要只写他固执。
  引用：every new piece of evidence can end up
  来源：阴谋论叙事技能包 ym.20

### 孙子兵法叙事

- ww.233 不战而胜（孙子兵法 sz.01）
  能力：最高明的胜利是不开打就让对方服软，写谋士角色先让他拆对方的算盘和联盟，而不是先安排一场硬仗。
  引用：不戰而屈人之兵，善之善者也
  来源：孙子兵法技能包 sz.01
- ww.234 诡道示形（孙子兵法 sz.02）
  能力：让角色故意露出假样子，有本事装没本事，要用装不用，离得近装远，离得远装近，假象本身就是武器。
  引用：兵者，詭道也。故能而示之不能
  来源：孙子兵法技能包 sz.02
- ww.235 利诱与离间（孙子兵法 sz.03）
  能力：用好处把对方引出来，用离间拆散对方内部亲近的关系，乱中取胜，角色动手前先让对方阵脚自乱。
  引用：利而誘之，亂而取之
  来源：孙子兵法技能包 sz.03
- ww.236 攻其无备出其不意（孙子兵法 sz.04）
  能力：打对方完全没有防备的地方，在对方完全想不到的时候动手，情节转折要落在对方的盲点上。
  引用：攻其無備，出其不意
  来源：孙子兵法技能包 sz.04
- ww.237 四级手段（孙子兵法 sz.05）
  能力：争胜手段分四级，从高到低是伐谋、伐交、伐兵、攻城，攻城是不得已的下策，写主角要让他先用上三级。
  引用：上兵伐謀，其次伐交，其次伐兵，其下攻城
  来源：孙子兵法技能包 sz.05
- ww.238 先为不可胜（孙子兵法 sz.06）
  能力：善战的角色先把自己立在打不败的位置，再等对方露出可胜之机，不可胜在自己，可胜在对方。
  引用：先為不可勝，以待敵之可勝
  来源：孙子兵法技能包 sz.06
- ww.239 胜兵先胜而后求战（孙子兵法 sz.07）
  能力：打胜仗的角色是先算好能赢才开打，打败仗的角色是先开打再指望能赢，胜负在开打之前就已经分了。
  引用：勝兵先勝而後求戰，敗兵先戰而後求勝
  来源：孙子兵法技能包 sz.07
- ww.240 以正合以奇胜（孙子兵法 sz.08）
  能力：正面交锋用常规打法拖住对方，真正取胜靠出奇的变招，奇正互相生发，变化没有穷尽。
  引用：凡戰者，以正合，以奇勝
  来源：孙子兵法技能包 sz.08
- ww.241 避实击虚（孙子兵法 sz.09）
  能力：像水避开高处流向低处，角色要避开对方坚实处，打对方空虚处，水的形态随地势而变，打法随对手而变。
  引用：兵之形避實而擊虛
  来源：孙子兵法技能包 sz.09
- ww.242 致人而不致于人（孙子兵法 sz.10）
  能力：高手让对方按自己的节奏来，而不是自己被对方牵着走，用利引对方自来，用害让对方来不了。
  引用：善戰者，致人而不致於人
  来源：孙子兵法技能包 sz.10
- ww.243 以迂为直（孙子兵法 sz.11）
  能力：走弯路反而先到，绕远路加一点利诱，后发而先至，写赶路争先的情节可用绕路反超的写法。
  引用：以迂為直，以患為利
  来源：孙子兵法技能包 sz.11
- ww.244 五间并用（孙子兵法 sz.12）
  能力：间谍分五种，因间、内间、反间、死间、生间，五种一起用就没人摸得清路数，反间是最关键的一环。
  引用：五間俱起，莫知其道，是謂神紀
  来源：孙子兵法技能包 sz.12
- ww.245 死地求生与处女脱兔（孙子兵法 sz.13）
  能力：把人逼到无路可走的绝境反而能激出死战之力，写主角先要像处女一样安静示弱，等对方露出破绽再像脱兔一样快攻。
  引用：投之亡地然後存，陷之死地然後生
  来源：孙子兵法技能包 sz.13

### 鬼谷子叙事

- ww.246 捭阖开合（鬼谷子 gg.01）
  能力：把对话写成一开一合的节奏，开是放话引对方说，合是收口逼对方定，开合交替才能推进谈判与说服场面，单向独白写不出张力。
  引用：捭之者，开也，言也，阳也；阖之者，闭也，默也，阴也
  来源：鬼谷子技能包 gg.01
- ww.247 口是心的门户（鬼谷子 gg.02）
  能力：写人物先写他的口，口开合之间志意喜欲思虑智谋都会漏出来，说客型主角靠管住自己的口与打开别人的口立身。
  引用：口者，心之门户也。心者，神之主也
  来源：鬼谷子技能包 gg.02
- ww.248 阳言始阴言终（鬼谷子 gg.03）
  能力：劝人时分两路话术，谈长生安乐富贵尊荣是阳言，用来开启一件事；谈死亡忧患贫贱苦辱是阴言，用来收束一桩谋划，两种话术不可混用。
  引用：诸言法阳之类者，皆曰始，言善以始其事
  来源：鬼谷子技能包 gg.03
- ww.249 反应钓语（鬼谷子 gg.04）
  能力：主角想探对方底牌时不直接问，而是先抛一句带象带比的话，等对方应声，言有不合就反过来再求一次，对方的真话会在回应里自己出来。
  引用：言有不合者，反而求之，其应必出
  来源：鬼谷子技能包 gg.04
- ww.250 反默引声（鬼谷子 gg.05）
  能力：写试探场面用反向动作，想听对方说话就自己先沉默，想张扬就先收敛，想取就先给，四组反向动作各是一次情节转折。
  引用：欲闻其声，反默；欲张，反睑；欲高，反下；欲取，反与
  来源：鬼谷子技能包 gg.05
- ww.251 内揵结盟（鬼谷子 gg.06）
  能力：写结盟先写结盟的纽带，道德党友财货采色四种纽带各成一种关系，纽带不同则进退亲疏的写法不同，结盟靠纽带不靠空话。
  引用：事皆有内揵，素结本始。或结以道德，或结以党友，或结以财货
  来源：鬼谷子技能包 gg.06
- ww.252 抵巇裂缝（鬼谷子 gg.07）
  能力：写破局先找裂缝，裂缝初现只有细微征兆，可塞可却可息可匿可得，五种处置各是一条剧情线，裂缝是情节的发动机。
  引用：巇始有朕，可抵而塞，可抵而却，可抵而息，可抵而匿；可抵而得
  来源：鬼谷子技能包 gg.07
- ww.253 飞箝钩辞（鬼谷子 gg.08）
  能力：写说客收服人物先扬名再下钩，先以钩箝之辞把对方捧到高处，再顺其所好下钩，对方一旦就范便可引东引西而不失其度。
  引用：引钩钳之辞，飞而钳之
  来源：鬼谷子技能包 gg.08
- ww.254 忤合反复（鬼谷子 gg.09）
  能力：写合纵连横要写反复，合于彼必离于此，今日背向明日又合，伊尹五就汤五就桀是反复试探的范本，联盟破裂不是败笔而是常态。
  引用：合于彼而离于此，计谋不两忠
  来源：鬼谷子技能包 gg.09
- ww.255 揣情极喜极惧（鬼谷子 gg.10）
  能力：写揣摩人物要挑极端时刻，极喜之时往而极其欲，极惧之时往而极其恶，情欲在极端处藏不住，平时看不出的真心这时全露出来。
  引用：必以其甚喜之时，往而极其欲也
  来源：鬼谷子技能包 gg.10
- ww.256 摩以内符（鬼谷子 gg.11）
  能力：写长期渗透用摩，不用硬碰，微摩对方所欲，内符必应，摩在此符在彼，主角日日成事而旁人不知所然，这是阴着写主角的高明写法。
  引用：摩者，揣之术也。内符者，揣之主也
  来源：鬼谷子技能包 gg.11
- ww.257 因人施言（鬼谷子 gg.12）
  能力：写对话要因人换话术，与智者言依于博，与贵者言依于势，与贫者言依于利，与勇者言依于敢，同一主角见不同人物必须换一套说法。
  引用：与智者言，依于博；与拙者言，依于辩；与辩者言，依于要
  来源：鬼谷子技能包 gg.12

### 厚黑学叙事

- ww.258 厚黑二字定主角（厚黑学 hh.01）
  能力：写成败人物先定厚黑二字，面厚是脸皮厚，心黑是心子黑，两字兼全者成大事，只得一偏者割据一时，道德完人反而难成事，本包只做模式提炼，不鼓吹行厚黑。
  引用：古之為英雄豪傑者，不過面厚心黑而已
  来源：厚黑学技能包 hh.01
- ww.259 黑型主角曹操（厚黑学 hh.02）
  能力：黑型主角靠心狠成事，杀亲信杀皇后皇子都不顾忌，还敢公开说出负人之言，黑到极点反而被认作一世之雄，写这类主角要让他的黑有明言有行动，不要只写阴沉。
  引用：寧我負人，毋人負我
  来源：厚黑学技能包 hh.02
- ww.260 厚型主角刘备（厚黑学 hh.03）
  能力：厚型主角靠脸皮厚成事，屡换靠山寄人篱下都不以为耻，遇事解决不了就当众痛哭，哭完立即转败为功，写这类主角要让他的厚有具体依附史，不要只写能忍。
  引用：東竄西走，寄人籬下，恬不為恥
  来源：厚黑学技能包 hh.03
- ww.261 两项兼备的孙权（厚黑学 hh.04）
  能力：兼备型主角厚黑两项都不如单项极致者，但两项都有就能与极致者并立，写他时要突出他时而称臣时而绝交的摇摆，不要把他写成单项极致。
  引用：黑不如操，厚不如備，卻是二者兼備
  来源：厚黑学技能包 hh.04
- ww.262 集大成者司马懿（厚黑学 hh.05）
  能力：集大成者把前人的厚黑都学全了，能欺孤儿寡妇，也能受巾帼之辱，厚比刘备更甚，黑与曹操相同，这样的人物出场晚却收走天下，写他要让他前期隐忍，后期一举收网。
  引用：天下歸司馬氏矣
  来源：厚黑学技能包 hh.05
- ww.263 道德主角项羽之败（厚黑学 hh.06）
  能力：道德主角败在心不黑脸不厚，鸿门宴上不忍下手，垓下之后顾面子不肯渡江重来，把失败推给天命，写这类主角要让他的仁与勇在关键时刻恰好成为败因，不要把他写成单纯武力不敌。
  引用：婦人之仁，匹夫之勇
  来源：厚黑学技能包 hh.06
- ww.264 厚黑兼全的刘邦（厚黑学 hh.07）
  能力：刘邦是厚黑兼全的胜利者，斗智不斗力，见长者能立刻改容道谢，对父母儿女也能下手，功成后杀韩信彭越，写他要让他的厚黑贯穿始终，前后一致，不要中途给他加道德刹车。
  引用：吾寧鬥智不鬥力
  来源：厚黑学技能包 hh.07
- ww.265 偏科而败的韩信（厚黑学 hh.08）
  能力：只厚不黑者也会败，韩信能忍胯下之辱，厚不在刘邦之下，却念着刘邦解衣推食的恩惠不肯自立，最后身首异处，写这类人物要让他的败因恰是他唯一剩下的道德牵挂。
  引用：衣人之衣者，懷人之憂
  来源：厚黑学技能包 hh.08
- ww.266 偏科而败的范增（厚黑学 hh.09）
  能力：只黑不厚者也会败，范增心黑与刘邦仿佛，却受不得气，被人一离间就忿然求去，连自己的命带项羽的江山一起送掉，写这类人物要让他的败因恰是受不得气。
  引用：因小不忍，壞了大事
  来源：厚黑学技能包 hh.09
- ww.267 三步功夫成长弧（厚黑学 hh.10）
  能力：厚黑成长分三步，第一步厚如城墙黑如煤炭，虽有功夫却有形有色，容易被攻破被人嫌弃，第二步厚而硬黑而亮，攻不破还招人归服，第三步厚而无形黑而无色，外人看不出厚黑，写成长弧要让主角逐级过关，不要一步登顶。
  引用：厚如城墻，黑如煤炭
  来源：厚黑学技能包 hh.10
- ww.268 师承链与衣钵真传（厚黑学 hh.11）
  能力：厚黑有师承，圮上老人教张良脸皮厚，张良再教刘邦，刘邦有时还会出错，靠老师在旁指点才改过来，写师徒线要让传承有具体授受场景，不要只说一句得真传。
  引用：圮上受書一事，老人種種作用，無非教張良臉皮厚罷了
  来源：厚黑学技能包 hh.11
- ww.269 发明家本人未必登顶（厚黑学 hh.12）
  能力：发明一套学问的人本领未必最大，学生胜过先生，一辈胜过一辈，学问才昌明，写这类人物要让创造者本人屡屡吃学生的亏，不要把发明家写成无敌。
  引用：我的本領當然比學生小
  来源：厚黑学技能包 hh.12

### 君主论叙事

- ww.270 世袭易守，新国难守（君主论 jz.01）
  能力：写夺位故事先定政权的底子。世袭君主有习惯与旧制托底，只要不触犯旧制，随机应变就能守住。新君主没有这层托底，每一步都要自己挣。失败情形是新君主以为坐上位置就等于坐稳位置。
  引用：保持政權，比在新的國家裏困難小得多
  来源：君主论技能包 jz.01
- ww.271 换主以为变好，结果更糟（君主论 jz.02）
  能力：写民众迎新主的情节，先写他们的盼望，再写盼望落空。人们换统治者多半是想改善境遇，新主带来的军队与损害又会让境遇更差，于是迎新者转成反抗者。
  引用：人們因為希望改善自己的境遇，願意更換他們的統治者
  来源：君主论技能包 jz.02
- ww.272 旧自由的记忆不会自己消失（君主论 jz.03）
  能力：写一座习惯自由的城市被占领，不要让它很快顺服。自由的名义与古老的秩序是反抗的现成旗号，时间与施恩都洗不掉它，除非把居民打散或者把城市毁掉。代价是这种写法本身就是毁灭性的选择。
  引用：總是利用自由的名義和它的古老的秩序作為藉口
  来源：君主论技能包 jz.03
- ww.273 革新者先树敌（君主论 jz.04）
  能力：写改革者出场，先算他的敌人账。旧制度下得利的人必然反对他，新制度下可能得利的人却只是半心半意地支持，因为人对新事物要等到亲眼见效才肯信。革新者最危险的时刻就在新旧交替之间。
  引用：革新者使所有在舊制度之下順利的人們都成為敵人了
  来源：君主论技能包 jz.04
- ww.274 机会加德，缺一不可（君主论 jz.05）
  能力：写白手起家的人物，给他一个真机会，再给他配得上机会的本事。机会只提供可塑的材料，没有本事的人会白白放过机会，有本事而没有机会的人，本事也会白白浪费。两者相遇，人物才能立起来。
  引用：機會給他們提供物力，讓他們把它塑造成為他們認為最好的那種形式
  来源：君主论技能包 jz.05
- ww.275 靠幸运得位，守位最辛苦（君主论 jz.06）
  能力：写靠运气或靠别人抬举上位的人物，发迹写得轻快，守位就要写得吃力。得位时他像在飞，落脚后困难才一件件冒出来，因为他既不懂如何发号施令，也没有一支忠于自己的力量。根基不牢，一场风暴就能摧毁他。
  引用：在發跡時並不很辛苦勞瘁，但是保持其地位時就很辛苦勞瘁了
  来源：君主论技能包 jz.06
- ww.276 残酷分用得好与用得坏（君主论 jz.07）
  能力：写强硬手段要分两种写法。用得好的是一次做完，只为保全自己，之后不再动手，再用施恩慢慢争取人心。用得坏的是开头只动一点，之后越用越多，让人永远不得安宁。失败情形是君主一边行残酷一边还指望百姓信任他。
  引用：損害行為應該一下幹完，以便人民少受一些損害
  来源：君主论技能包 jz.07
- ww.277 一城两股胃口（君主论 jz.08）
  能力：写城邦内部冲突，先分清两股对立的欲望。人民只想不受压迫，贵族却想统治与压迫人民。两股胃口相撞，结局不是君主制就是自由制，要不就是无政府状态。人物站队之前，先让他属于其中一股。
  引用：人民不願意被貴族統治與壓迫，而貴族則要求統治與壓迫人民
  来源：君主论技能包 jz.08
- ww.278 靠人民比靠贵族稳（君主论 jz.09）
  能力：写君主选靠山，优先写靠人民的路线。靠贵族上位的人，身边围着一群自以为与他平等的人，指挥不动也满足不了。靠人民上位的人，身边没有这层掣肘，人民所求只是免于压迫，给得起就能稳住。
  引用：一個人依靠貴族的幫助而獲得君權，比依靠人民的幫助而獲得君權更難於繼續保持其地位
  来源：君主论技能包 jz.09
- ww.279 借来的军队靠不住（君主论 jz.10）
  能力：写军事力量要分清归属。雇佣军只认军饷，和平时掠夺你，战时抛下你。援军更危险，打败了你跟着完蛋，打赢了你变成俘虏。只有自己组建的军队才是立身的根基，借来的胜利不算真正的胜利。
  引用：僱傭軍和援軍是無益的，並且是危險的
  来源：君主论技能包 jz.10
- ww.280 爱与畏的两难（君主论 jz.11）
  能力：写统治者与百姓的关系，先承认两全很难。被人爱戴靠的是对方的意志，对方随时可以收回。被人畏惧立足于自己的意志，更稳一些。但畏惧一旦越线变成憎恨，就会反过来毁掉统治者，所以这条路的底线是不碰百姓的财产。
  引用：被人畏懼比受人愛戴是安全得多的
  来源：君主论技能包 jz.11
- ww.281 狐狸加狮子（君主论 jz.12）
  能力：写权谋人物要给他两种本事合用。狐狸认得出陷阱，狮子吓得住豺狼。只会用狮子的人看不见陷阱，只会用狐狸的人挡不住明面上的攻击。两种本事缺一种，人物迟早会在另一面栽倒。
  引用：君主必須是一頭狐狸以便認識陷阱，同時又必須是一頭獅子
  来源：君主论技能包 jz.12
- ww.282 替罪羊洗白（君主论 jz.13）
  能力：写新主收拾局面，可以写一出先借刀后弃刀的戏。先派一个冷酷机敏的代理人用重手恢复秩序，再把他公开处决，把过去的残酷都推到他的天性头上，自己则以主持公道的面目出现。代价是百姓既痛快又恐惧，信任是惊出来的，不是服出来的。
  引用：如果過去發生任何殘忍行為，那並不是由他發動的，而是來自他的大臣刻薄的天性
  来源：君主论技能包 jz.13

### 乌合之众叙事

- ww.283 群体一旦形成就是一个新人格（乌合之众 wh.01）
  能力：写群体场面先让个人消失，让全场感情与想法转到同一个方向，群体从此按一个意志行动，个人原来的性格暂时不起作用。
  引用：The sentiments and ideas of all the persons in the gathering take one and the same direction, and their conscious personality vanishes
  来源：乌合之众技能包 wh.01
- ww.284 匿名加人数等于无责任感（乌合之众 wh.02）
  能力：写人物在人群中敢做平时不敢做的事，先给两个理由，一是人多让他觉得自己有无敌的力量，二是匿名让他觉得不必负责，责任感一消失，克制就跟着消失。
  引用：a crowd being anonymous, and in consequence irresponsible, the sentiment of responsibility which always controls individuals disappears entirely
  来源：乌合之众技能包 wh.02
- ww.285 暗示与传染是群体转向的引擎（乌合之众 wh.03）
  能力：群体场面的转折不用道理推动，用暗示加传染推动，一个人的情绪与动作会传染全场，一个暗示一旦被接受，全场的感情立刻同向。
  引用：a crowd every sentiment and act is contagious
  来源：乌合之众技能包 wh.03
- ww.286 群体智力下降，感情却可以升华（乌合之众 wh.04）
  能力：写群体不要只写愚蠢与犯罪，同一群人既可能犯下暴行，也可能为信念舍命，智力上群体永远不如单个人，感情上却可能高于单个人，关键看群体接受了什么样的暗示。
  引用：the crowd is always intellectually inferior to the isolated individual
  来源：乌合之众技能包 wh.04
- ww.287 群体场面三段式：冲动、极端、翻转（乌合之众 wh.05）
  能力：群体场面按三段写，一是被当下刺激牵着走，毫无预谋，二是感情走到极端，中间状态不存在，三是瞬间翻转，上一刻还是刽子手，下一刻就能当殉道者。
  引用：A crowd may easily enact the part of an executioner, but not less easily that of a martyr
  来源：乌合之众技能包 wh.05
- ww.288 群体轻信：第一个幻觉定调，全员跟进（乌合之众 wh.06）
  能力：写群体误判先写第一个人看错，再写全场跟着看错，群体处于期待注意的状态，第一个暗示一出现就靠传染传遍全场，连专家在群体里也会失去观察力与批判力。
  引用：the affirmation of the first witness, himself a victim of illusion, had sufficed to influence the other witnesses
  来源：乌合之众技能包 wh.06
- ww.289 群体只认极端感情：怀疑变铁证，反感变仇恨（乌合之众 wh.07）
  能力：写群体情绪不要写犹豫与中间地带，怀疑一说出口就变成确凿证据，轻微的反感立刻变成狂怒的仇恨，群体不知道怀疑与不确定为何物。
  引用：A suspicion transforms itself as soon as announced into incontrovertible evidence
  来源：乌合之众技能包 wh.07
- ww.290 群体不容异议：当众反驳者会被轰走（乌合之众 wh.08）
  能力：写有人在群体集会上讲理，先让他被嘘声与谩骂打断，再让他被赶走，群体接受或拒绝意见都是整体的、绝对的，讨论与反驳在群体里没有位置。
  引用：At public meetings the slightest contradiction on the part of an orator is immediately received with howls of fury
  来源：乌合之众技能包 wh.08
- ww.291 群体用形象思考：讲画面不讲道理（乌合之众 wh.09）
  能力：写打动群体的场面要用一幅清晰惊人的画面，不要用论证，一场大胜、一桩大罪、一个大希望，都比一百件小事更能打动群体，画面越具体，群体越容易被带动。
  引用：Crowds being only capable of thinking in images are only to be impressed by images
  来源：乌合之众技能包 wh.09
- ww.292 领袖三件套：断言、重复、传染（乌合之众 wh.10）
  能力：写领袖说服群体用三招，一是断言，不带推理与证明，越简短越有分量，二是重复，同一句话换着场合反复说，三是传染，意见一旦形成风潮就靠传染扩散，三招见效慢，但一旦生效就很持久。
  引用：Affirmation pure and simple, kept free of all reasoning and all proof, is one of the surest means of making an idea enter the mind of crowds
  来源：乌合之众技能包 wh.10
- ww.293 领袖先被信念催眠，再催眠群体（乌合之众 wh.11）
  能力：写领袖不要先写他多会算计，先写他自己先被一个信念迷住，信念占据他之后，一切相反意见在他眼里都是谬误，他的强烈信念再变成对群众的暗示力，群众天生会服从意志坚定的人。
  引用：He has himself been hypnotised by the idea, whose apostle he has since become
  来源：乌合之众技能包 wh.11
- ww.294 群体信念带宗教形态：偶像、异端、传教（乌合之众 wh.12）
  能力：写群体信仰按宗教形态写，崇拜一个被认为高高在上的存在，盲目服从它的命令，不能讨论它的教条，热衷传播它，把不接受它的人当敌人，被群体拥戴的英雄在群体眼里就是神。
  引用：The hero acclaimed by a crowd is a veritable god for that crowd
  来源：乌合之众技能包 wh.12
- ww.295 群体分类写场面：每种群体有自己的写法（乌合之众 wh.13）
  能力：写群体场面先定种类，匿名街头群体无责任感最易失控，陪审团这类不匿名群体里只要说服一两个带头人就能带走全场，选民群体只认领袖声望与口号，议会群体看似讲理，激动起来就和普通群体一样极端。
  引用：one or two energetic men suffice to carry the rest of the jury with them
  来源：乌合之众技能包 wh.13

### 影响力叙事

- ww.296 对比衬托先贵后廉（影响力 yx.01）
  能力：谈判或推销场面先亮一个贵得离谱的选项，再亮真正想卖的选项，后者立刻显得便宜合理。对比是难以察觉的影响力杠杆，写角色上当时先写他眼前晃过的第一个价，再写他心里的便宜感从何而来。
  引用：the tendency to see two things that are different from one another as being more different than they actually are
  来源：影响力技能包 yx.01
- ww.297 因为触发词（影响力 yx.02）
  能力：角色只说一个因为就让人点头，连理由本身空洞也照样通过。复印机实验里只提要求约六成人答应，加一个因为后约九成四答应，连无意义的因为也有约九成三。写说服场面时让角色先扔出因为二字，再补理由，读者会感到点头快得不自然。
  引用：click, whirr
  来源：影响力技能包 yx.02
- ww.298 先给再要（影响力 yx.03）
  能力：说客先送一份真正有用的东西再开口，收礼者心里就欠下一笔。先给要个人化，要出乎意料，餐馆服务员随账单送一颗薄荷糖就能让小费增加。写小说时让说客先帮主角一个小忙，再提真正的要求，主角的为难要写在脸上。
  引用：人会回报恩惠，所以先给出有用的东西
  来源：影响力技能包 yx.03
- ww.299 不请自来的债（影响力 yx.04）
  能力：礼物没要也照样造出亏欠感，小恩能换大报。规则有三性：力量极大，能压倒本会拒绝的要求；能强加没要过的债；能以小换大。写角色被硬塞礼物时，写他明明不想要却觉得不还就失礼的别扭。
  引用：requires that one person try to repay what another person has provided
  来源：影响力技能包 yx.04
- ww.300 先大后小（影响力 yx.05）
  能力：谈判场面先提一个注定被拒的天价要求，再退到真正想要的小要求，对方会把退让当成让步跟着让步。童子军先推销昂贵的马戏团票被拒，再推销便宜的巧克力条，西奥迪尼明明不想要也买了。反制见 yx.16。
  引用：the method of starting with an extreme request, which will be rejected and then scaled down to a more acceptable request
  来源：影响力技能包 yx.05
- ww.301 先小后大（影响力 yx.06）
  能力：先让角色答应一件微不足道的小事，再提真正的大要求，他会为了前后一致而点头。居民先答应摆一块支持安全驾驶的小牌子，后来更可能答应在家门口立一块又大又丑的广告牌。写骗局时小要求要小到不好拒绝，大要求要在他点头后才露出来。反制见 yx.17。
  引用：the tactic of starting with a little request to gain eventual compliance with related larger requests
  来源：影响力技能包 yx.06
- ww.302 承诺三性（影响力 yx.07）
  能力：承诺越主动、越公开、越费力，越能锁住角色以后的行动。写下承诺、众人面前表态、吃过苦头才入伙，都会让人为自圆其说不断加码，承诺长出自己的腿，越走越远。反制见 yx.17。
  引用：Commitments stick harder
  来源：影响力技能包 yx.07
- ww.303 变卦低价（影响力 yx.08）
  能力：先用一个极好的条件套住角色，等他点头投入后再改成差条件，他多半照单全收，因为已经替自己的决定找好了新理由。写车行或谈判骗局时，先写好条件的诱惑，再写条件被抽走后角色自己说服自己的过程。反制见 yx.17。
  引用：a technique aimed to gain compliance by making a desirable initial offer to get acceptance and then changing the terms to be less favorable
  来源：影响力技能包 yx.08
- ww.304 人人都在做（影响力 yx.09）
  能力：角色拿不定主意时就看别人怎么做，越不确定越跟风。罐头笑声能让节目显得更好笑，畅销榜和好评数都是同一招。写群戏时让主角先看一圈旁人的脸色再决定，旁人不动他也不动。
  引用：people decide what to believe or how to act in a situation by examining what others are believing or doing there
  来源：影响力技能包 yx.09
- ww.305 相似者示范（影响力 yx.10）
  能力：示范者越像目标人物，说服力越强。同龄人、同乡、同行的一句话顶得上十句广告。写角色被说服时，安排一个和他背景相近的人先做给他看，他跟上去才顺理成章。反制见 yx.18 与 yx.26。
  引用：people conform to the beliefs and actions of comparable others, especially their peers
  来源：影响力技能包 yx.10
- ww.306 五种生好感（影响力 yx.11）
  能力：说客用五种办法让人喜欢他：好看的外表带光环效应，相似的背景观点衣着，赞美，熟悉接触加共同目标，正面联想。特百惠家庭聚会就是靠朋友邻居的交情卖货。写说客出场时挑一两种写实，写他如何让主角放下戒心。反制见 yx.20。
  引用：people prefer to say yes to individuals they like
  来源：影响力技能包 yx.11
- ww.307 权威符号（影响力 yx.12）
  能力：角色不看真本事，只看头衔、制服、排场就低头。米尔格拉姆实验里普通人因权威指令而伤害他人，事后还低估了权威对自己的影响。写权威出场时先写符号再写人，让角色在符号面前不敢多问。反制见 yx.21 与 yx.22。
  引用：the power or right to give orders, make decisions, and enforce obedience
  来源：影响力技能包 yx.12
- ww.308 稀缺倒计时（影响力 yx.13）
  能力：限量与限时两招把从容思考逼成急迫行动，怕失去比想得到更有劲。写抢购场面时让角色先算东西值不值，再写倒计时如何把他的算账打断。反制见 yx.23 与 yx.24。
  引用：people assign more value to opportunities that are less available
  来源：影响力技能包 yx.13
- ww.309 自己人加速器（影响力 yx.14）
  能力：统一性不是喜欢，是把对方看成自己人，一旦认了自己人，其他原则都会更灵。同群偏袒、跟从同群、党同伐异都从这里来。血缘、地缘、共患难、一起唱歌干活都能造出自己人，请人给建议比请人给意见更容易结成同伙。反制见 yx.27。
  引用：People are inclined to say yes to someone they consider one of them
  来源：影响力技能包 yx.14

### 1984叙事

- ww.310 开场一句反常细节（1984 ow.01）
  能力：开场第一句放一个不可能的日常细节，让读者立刻知道这个世界的时间感坏掉了，再展开世界观。
  引用：the clocks were striking thirteen
  来源：一九八四技能包 ow.01
- ww.311 电幕：监视不必时时有人看（1984 ow.02）
  能力：写一个能同时收与发的监视器，关键不在它是否每时每刻有人盯着，而在被监视者永远无法知道此刻是否有人在看，于是自己管住自己。
  引用：The telescreen received and transmitted simultaneously
  来源：一九八四技能包 ow.02
- ww.312 老大哥海报与三句口号（1984 ow.03）
  能力：给极权世界一个无处不在的人脸加三句自相矛盾的口号，战争即和平，自由即奴役，无知即力量，口号越短越像真理，越矛盾越能测试服从。
  引用：BIG BROTHER IS WATCHING YOU
  来源：一九八四技能包 ow.03
- ww.313 名实颠倒的机构（1984 ow.04）
  能力：四个权力机构的名字全部与其职能相反，名字本身就是第一次服从训练，读者一读名字就明白这个世界的语言已经倒置。
  引用：The Ministry of Peace, which concerned itself with war
  来源：一九八四技能包 ow.04
- ww.314 两分钟仇恨仪式（1984 ow.05）
  能力：每天定时两分钟，让所有人对着同一个敌人画像一起喊叫，重点不是演戏，而是人在集体喊叫中会真的进入情绪，仇恨的对象可以随时切换。
  引用：Within thirty seconds any pretence was always unnecessary
  来源：一九八四技能包 ow.05
- ww.315 思想罪与蒸发（1984 ow.06）
  能力：最大的罪不是做了什么，而是想了什么，惩罚不是审判而是彻底消失，人名从登记册上抹掉，仿佛从未来过。
  引用：VAPORIZED was the usual word
  来源：一九八四技能包 ow.06
- ww.316 记忆洞与篡改记录（1984 ow.07）
  能力：主角的工作就是每天改写旧报纸与旧数字，改完把原件扔进记忆洞烧掉，过去每天都被更新到与今天一致。
  引用：the past was brought up to date
  来源：一九八四技能包 ow.07
- ww.317 凭空造一个死人（1984 ow.08）
  能力：当一个被提拔的人突然失宠，改写者不删掉他，而是发明一个从未存在过的英雄顶替他的位置，假人一旦进入档案就和真人一样真实。
  引用：you could create dead men but not living ones
  来源：一九八四技能包 ow.08
- ww.318 日记：反抗从落笔开始（1984 ow.09）
  能力：主角买一本旧纸日记，躲在电幕看不见的墙角写字，写下第一行就等于承认自己是死人，反抗的起点不是行动，而是一句写给未来的真话。
  引用：Thoughtcrime does not entail death: thoughtcrime IS death
  来源：一九八四技能包 ow.09
- ww.319 爱情与身体作为反抗（1984 ow.10）
  能力：当政权把性变成义务并消灭快感，两个人的私密结合本身就是政治行为，重点不在浪漫，而在夺回身体的自主权。
  引用：It was a blow struck against the Party
  来源：一九八四技能包 ow.10
- ww.320 旧物庇护所（1984 ow.11）
  能力：给主角一个没有电幕的旧房间与一块嵌着珊瑚的玻璃纸镇，旧物之所以珍贵，是因为它们是少数没有被改写过的过去碎片。
  引用：The paperweight was the room he was in
  来源：一九八四技能包 ow.11
- ww.321 诱捕者：先给希望再收网（1984 ow.12）
  能力：让主角最信任的同情者其实是审讯者本人，反抗组织可能是权力自己设下的诱饵，读者直到收网那一刻才知道希望从一开始就是陷阱。
  引用：We shall meet in the place where there is no darkness
  来源：一九八四技能包 ow.12
- ww.322 101号房与最后的破碎（1984 ow.13）
  能力：审讯的最后一关不是疼痛，而是每个人心中最怕的那件东西，主角为了躲开它，亲口把最爱的人推出去，出来后连爱的能力也被抽空，最后真心爱上了老大哥。
  引用：The thing that is in Room 101 is the worst thing
  来源：一九八四技能包 ow.13
