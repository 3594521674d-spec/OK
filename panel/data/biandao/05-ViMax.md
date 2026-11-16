# 编导技能·开源对照·ViMax

- 星数：12,939（GitHub API 核实，2026-11-17）
- 地址：https://github.com/HKUDS/ViMax
- 协议：MIT

## 它是干什么的

Agentic Video Generation（导演 + 编剧 + 制片 + 视频生成一体），香港大学出品，论文 arXiv 2606.07649。三条工作流：Idea2Video（一个点子 → 成片）、Script2Video（现成剧本 → 成片）、Novel2Video（小说 → 成片）。14 个 agent 分工：screenwriter（编剧）、script_planner（剧本规划）、storyboard_artist（分镜）、character_extractor（角色提取）、best_image_selector（最佳图选择）、reference_image_selector（参考图选择）、camera_image_generator（镜头图生成）、global_information_planner（全局信息规划）、novel_compressor（小说压缩）、event_extractor（事件提取）、scene_extractor（场景提取）、script_enhancer（剧本增强）、character_portraits_generator（角色肖像生成）。关键帧双候选并行生成 + 视觉模型选优；Agent Loop + TUI + Web UI。

## 编导环节具体怎么写

来源文件：`prompts/workflow.md`、`agents/screenwriter.py`、`agents/storyboard_artist.py`、`agents/best_image_selector.py`、`agents/reference_image_selector.py`。

### 三条工作流（workflow.md）
- Idea2Video：input_idea → project_brief → characters → script → storyboard → shot_decomposition → camera_tree → frame_prompts → keyframes → video_clips → final_video。
- Script2Video：input_script → characters → storyboard → shot_decomposition → camera_tree → frame_prompts → keyframes → video_clips → final_video。
- Novel2Video：novel_text → compressed_novel → events → relevant_chunks → scenes → global_characters → scene_scripts。
- **工作流确认关口**：调用任何规划工具之前，用户必须明确确认跑哪条工作流（idea2video / script2video / novel2video 三选一）。含糊的“做个短片”不算确认，要先问一句再动手。script2video 必须有明确的剧本原文，novel2video 必须有明确的小说原文，不许凭空推断。
- **默认规模克制**：idea2video 默认只规划 1 个场景、3–5 个镜头；用户没明确要求更长、更多场景或更多镜头时，不把一个含糊点子扩成很多场景很多镜头。
- 文本规划走完后，如果用户没明确要求端到端生成或渲染，就停下汇报“文本规划已完成”，问要不要修改或进入渲染，不自动往下跑。
- 产物权威：`.working_dir/<session_id>/` 是产物权威，`.vimax/sessions.json` 只是会话索引，`.vimax/memory.md` 只存用户偏好。

### 编剧（screenwriter.py）
- 两个角色提示词：故事生成专家（按点子 + 要求生成完整故事：三幕结构、人物弧、场景节奏、受众适配、剧本化思维）和剧本改编助手（把故事按时间地点连续性切成场景单元，每场是一段连续戏剧动作）。
- 强调：改编时可以适当加戏剧元素增强吸引力，但要忠于原故事。

### 分镜（storyboard_artist.py）
- 角色：专业分镜师，技能是剧本分析、可视化、电影语言（景别、角度、运镜、转场）、叙事连续性。
- 任务：按单场剧本设计完整分镜文本，每镜写清视觉元素和叙事流。
- 另有一个视觉文本分析角色：把一段镜头描述严格拆成三部分——**首帧静态画面、尾帧静态画面、连接两者的动态过程**。写动态时不能直接用角色名字指代角色，要用外貌特征（尤其是衣服特征）指代。

### 最佳图选择（best_image_selector.py）
- 角色：专业视觉评估专家。按参考图、目标图文字描述、若干候选图，评哪张候选图最好，三条标准：
  - **角色一致性**：性别、种族、年龄、面部特征、体型、外貌、发型和参考图对不对得上。
  - **空间一致性**：人物相对位置（A 在左、B 在右）、场景布局、透视和参考图对不对得上。
  - **描述准确性**：候选图是不是准确反映了文字描述（文字描述的是想要的目标图，不是编辑指令）。
- 做法：关键帧**双候选并行生成**，再用视觉模型选优，不是生成一张就认一张。

### 参考图选择（reference_image_selector.py）
- 角色：多模态图像分析助手。按目标帧的文字描述，从参考图库（多张角色参考图 + 之前帧的已有场景图）里智能挑最合适的参考图，保证三条一致性：角色一致性（外貌、服装、表情、姿态高度匹配参考图）、环境一致性（背景、光线、氛围、布局和之前帧连贯）、风格一致性（写实、卡通、电影感、色调和参考图协调）。

## 咱们缺什么

1. **生成后要有人挑**：咱们的资产图是生成一张、验一张，不合格重出；ViMax 是关键帧一次生成两个候选、视觉模型挑一个。思路可以学，但咱们不烧双倍算力，改成人眼挑：关键资产一次出两张候选再定。
2. **首帧 / 尾帧 / 动态三拆**：咱们的 SHOT 表有起点、动作、终点，但没有把它写成“首帧静态画面 + 尾帧静态画面 + 连接两者的动态过程”这种三分法；分镜师 agent 的拆法更干净，动态过程单独成段，不容易把动作写进首帧里。
3. **工作流确认关口**：咱们是小pa直接开工，用户没说不做就默认做；ViMax 是先问清跑哪条工作流再动手。咱们不需要那么重，但“剧本还是点子还是小说”这个入口要先问清，不能拿点子当剧本直接拍。
4. **默认规模克制**：咱们写东西容易一次铺太大；ViMax 默认 1 场 3–5 镜，用户要更多再加。这条适合咱们 1 分钟短片的体量。

## 采纳建议

- P1 轻量采纳：关键资产（定调图、三视图）一次出两张候选，人眼挑一张；普通资产不用。
- P2 直接采纳：SHOT 表的起点/动作/终点改成首帧/动态/尾帧三分法写，动态过程不写进首帧。
- P3、P4 写进开工规则一句话：先确认入口（点子/剧本/小说）和规模，再动手。
- 不采纳：14 agent loop、双候选并行生成（烧算力）、TUI/Web UI、Agent Loop 自动跑全流程。
