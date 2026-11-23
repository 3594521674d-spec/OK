# AI 视频特效提示词库

- 这个 skill 收的是五个现成的 AI 视频特效提示词库，不是模型库，也不是代码库。
- 五个库都是 2026 年 11 月 19 日当天核实过的，链接能打开，星数和条数以当天看到的为准。
- 提炼的意思是把五个库里好的写法抽出来，告诉你一条特效提示词应该怎么写，再把每个库最值得学的提示词原样贴出来，注明出处。
- 这个 skill 里没有自己编的提示词，贴出来的都是从库里原样抄的，长的只节选开头并写明是节选。
- 用户做 AI 短剧和 AI 电影，平时用即梦和豆包的 Seedance、可灵、海螺图生视频，一条 5 秒，所以先看 Seedance 和中文的库。

## 五个库是什么

- 打开 ai-boost/awesome-image-video-prompts，它在 GitHub 上有 3508 星，免费，英文为主，视频提示词文件有 1177 个，覆盖 Kling、Seedance、Sora、Veo、Wan 和 MiniMax H3，每条都附了原帖和成片，地址是 https://github.com/ai-boost/awesome-image-video-prompts
- 打开 LearnPrompt/awesome-seedance，它在 GitHub 上有 2594 星，免费，有英文、中文和日文三个版本，收了 1059 条 Seedance 2.5 和 2.0 的案例，每条都核对过原帖，还做了 494 次跨模型复测，另有 27 个分类模板，地址是 https://github.com/LearnPrompt/awesome-seedance
- 打开 UnderleveledBuilder/awesome-short-drama-skills，它在 GitHub 上有 2575 星，免费，中文为主，收了 117 个短剧和漫剧 skill 加 16 个相关平台，里面有给 Seedance、MiniMax、可灵写视频提示词的 skill，还做过盲测排名，地址是 https://github.com/UnderleveledBuilder/awesome-short-drama-skills
- 打开 UlazAI 的提示词目录，地址是 https://ulazai.com/directory/?category=architecture ，免费浏览，英文为主，收了 1945 条以上提示词，覆盖 Seedance 2、Veo 3.1、Sora 2、可灵 3.0、Grok、Wan 和海螺，分 46 类，生成视频要另外花积分。
- 打开提示词吧的 Seedance 归档，地址是 https://tishici8.com/seedance-collection/ ，免费浏览分类和标题，收了 964 条中文 Seedance 提示词，分 9 组，其中动作特效与科幻有 201 条，看完整提示词每条要 3 积分，注册送 30 积分。

## 好的特效提示词长什么样

- 先写主体，再写动作，再写特效名，最后写镜头、时长和画幅，特效名要写具体，比如紫色能量剑气，不要写特效很好看这种空话。
- 把一条片子按时间切开写，每段写清几秒到几秒、一个动作和一个机位，LearnPrompt 的逐秒时间轴模板和 MiniMax 的两秒一拍都是这个写法。
- 每镜写死机位和物理反馈，比如木屑和尘土飞起来，模型才知道冲击力落在哪。
- 用参考图锁人锁物，写清继承什么，再单独写不许继承什么，LearnPrompt 的参考图身份锁定模板就是这么写的。
- 特效词要写进提示词最前面，换词比加词管用，出不来就换一个特效名再跑一次。
- 即梦和豆包先用中文，可灵和海螺中英文都行，Veo 和 Sora 先用英文。

## 常见特效类型

- 剑气刀光在三个库里都有，aivp 的 katana 标签下有几十条，LearnPrompt 的案例里有女剑士破框和雷电战士变身。
- 雷电在 aivp 的紫色闪电对决和 LearnPrompt 的雷电战士变身里都有写法，特点是先写电光缠刀，再写落雷和地面裂开。
- 冲击波在 aivp 的巨人被劈开和 LearnPrompt 的破框效果里都有写法，特点是写清冲击波从哪炸开、向哪扩散。
- 变身换装在 LearnPrompt 里有 15 条案例，在提示词吧的动作特效组里有凤凰法相变身的分镜。
- 时间定格在 aivp 里有一条 1950 年代餐厅时间冻结再倒放的提示词，特点是先把场景写死，再写冻结和倒放。
- 破框出画在 LearnPrompt 的蓝夹克女剑士案例里有完整写法，特点是写清人物和剑越过黑边向观众伸出来。

## 每个库最值得学的提示词

### ai-boost/awesome-image-video-prompts

- 下面三条都出自这个库的 pages/en/video-action.md，原样摘，注明出处。
- 第一条是夜院拔刀六镜，出处是该库收录的 @higgsfield_ai 的帖子，2473 个赞，模型是 Kling 3.0，文生视频，全文如下。

```
Shot 1: An extreme close-up of a young woman's mouth, her teeth clenched on a wooden toothpick, creating a tense and gritty atmosphere.
Shot 2: A medium shot of the woman in a traditional Japanese-style courtyard at night, illuminated by soft lanterns. She is dressed in a white tank top and dark trousers, holding a katana in a defensive stance with a determined look on her face.
Shot 3: A dynamic, low-angle action shot of the woman jumping high into the air, raising her katana to strike a wooden training dummy that resembles a samurai in armor.
Shot 4: A close-up, high-speed impact shot showing the woman's katana slicing through the wooden dummy, sending wood splinters and dust flying into the air.
Shot 5: A fast-paced tracking shot of the woman landing gracefully and immediately striking another wooden structure, demonstrating her speed and precision.
Shot 6: A final medium close-up of the woman's face as she finishes her move. She is slightly breathless, her hair disheveled, with a sharp, focused gaze directed off-camera.
```

- 第二条是女武士斗巨人，节选第 10 到 14 秒，出处是该库收录的 @soundofdragon 的帖子，345 个赞，模型是 MiniMax H3，参考图转视频，全文 14 秒按两秒一拍写，节选如下。

```
Extreme close-up. Soul grips the katana with both hands, eyes blazing purple. She charges forward at maximum speed, blade becoming engulfed in concentrated purple energy.

FINAL STRIKE. Soul leaps above the giant and performs one massive vertical katana slash through its body. A brilliant purple energy cut tears downward. The giant splits apart in a colossal shockwave. Camera rapidly pulls back as debris, dust and purple energy engulf the desert.
```

- 第三条是火焰剑客对紫色恶魔，节选第 11 到 17 秒，出处是该库收录的 @ZaraIrahh 的帖子，192 个赞，模型是 Wan 3.0，文生视频，节选如下。

```
The demonic swordsman sweeps his weapon outward, unleashing a rotating barrage of crescent-shaped violet energy blades. The flame warrior counters with a powerful spinning technique, creating a spiraling vortex of fire. The two supernatural attacks collide, filling the clearing with swirling embers, electrical arcs, and burning fragments of bamboo.

Time slows as both fighters launch from opposite sides of the clearing. Orange flames wrap around one katana while jagged purple lightning crawls along the other. Their capes, robes, and hair whip in the storm. They meet at the center of the frame, blades crashing together in a blinding flash.
```

### LearnPrompt/awesome-seedance

- 下面两条都出自这个库的 data/cases.json，原样摘开头，完整版在库里。
- 第一条是蓝夹克双辫女剑士破框而出，模型是 Seedance 2.5，热度 94，节选如下。

```
Use @[char ref] as the exact character and style reference. Preserve her black hair and braids, oversized blue hooded jacket with cream graphics and orange trim, white cropped top, layered cream-and-orange pants, orange ribbons and white sneakers with black stripes and orange panels. Preserve her single sword with its black wrapped handle, gold guard and red tassel. Keep the same angular painterly anime rendering and blue background. MAIN VISUAL GOAL: An unmistakable OUT-OF-FRAME, POP-OUT effect. The character repeatedly projects beyond the central picture window, with her sword, hands, sneakers, hair and loose clothing visibly moving OVER the black letterbox bars toward the viewer.
```

- 第二条是商场女子变身雷电战士迎战丧尸，模型是 Seedance 2.5，30 秒竖屏，热度 42，节选开头两句如下。

```
Create a 30-second ultra-realistic cinematic zombie apocalypse action video in 9:16 vertical format, set inside a modern luxury shopping mall. Feature a beautiful young Korean woman with long black hair, a consistent face, and realistic body proportions throughout the entire video.
```

### UnderleveledBuilder/awesome-short-drama-skills

- 这个库本身是清单，里面没有直接贴提示词，值得学的是它收的三个视频提示词 skill 和它自己的介绍。
- 清单里收了 LearnPrompt/awesome-seedance、AtlasCloudAI/awesome-seedance-2.5-prompts-skills 和 minimaxH3-ai-video-agent，三个都是给视频模型写提示词的 skill。
- 清单自己的介绍原样如下。

```
覆盖小说改编、集纲、钩子和付费卡点、剧本审稿、分镜、角色资产，以及给 Seedance、MiniMax、可灵等视频模型的提示词。
```

### UlazAI 提示词目录

- 这个库按模型和分类浏览，提示词免费看，生成视频要另外花积分。
- 列表页上能看到的结构化字段原样如下，完整提示词在详情页里。

```
prompt_name: "NYC City Assembly"
base_style: "cinematic, photorealistic, 4K"
aspect_ratio: "16:9"
city_description: "A vast, empty urban plaza at dawn, ground level view with …"
```

- 这个库自己的用法建议原样如下。

```
Read the full prompt before using it. Replace subject and brand details, but keep the shot structure, timing and camera instructions together.
```

### 提示词吧 Seedance 归档

- 这个库按题材分了 9 组，动作特效与科幻组有 201 条，组里的标题原样如下。

```
仙侠法相变身：凤凰法相 8 镜头分镜
《超市极速战斗》动作电影 16 镜头分镜
Seedance 2.5 抖音风机车炫酷转场竖屏短片
Seedance 2.5 一张照片让自己飞天的科幻史诗短片
```

- 一条提示词免费可见的开头原样如下，原文到此截断，完整版每条要 3 积分，注册送 30 积分。

```
Seedance 2.5 almighty prompt is below 👇 A 2000s studio-comedy film shot, 16:9, 35mm, moderate film grain, bright Americ…
```

## 先看哪个库

- 先看 LearnPrompt/awesome-seedance，它是 Seedance 的库，有中文，案例逐条核实过，还有 27 个模板，贴合即梦和豆包的用法。
- 再看 ai-boost/awesome-image-video-prompts，剑气刀光和动作类最全，还能跨模型对照。
- 再看提示词吧的 Seedance 归档，中文动作特效有 201 条，直接找仙侠和动作。
- 再看 UnderleveledBuilder/awesome-short-drama-skills，短剧从剧本到视频提示词的全流程都在里面。
- 最后看 UlazAI 的提示词目录，按模型浏览，英文为主。

## 诚实说明

- 五个库的星数、条数和链接都是 2026 年 11 月 19 日当天核实过的，库每天都在更新，数字以后会变。
- 提示词吧看完整提示词要积分，UlazAI 生成视频要积分，三个 GitHub 库免费。
- 这个 skill 里没有自己编的提示词，长的只节选开头并写明是节选，完整版去库里看。
- 没收进来的备选有两个，ZeroLu/awesome-seedance 有 2850 星，YouMind-OpenLab/awesome-seedance-2-prompts 有 2234 星，收了 2000 多条 Seedance 提示词，两个都是 Seedance 的库，和 LearnPrompt 的那个重复，所以没进前五。
