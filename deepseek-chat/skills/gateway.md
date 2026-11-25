# 中转站API网关技能包

来源库：cheaper-inference/OmniRoute（提交 5ffa68e835442a12ed1204a2eebf4076c298aecb，MIT 协议，89816 星）、BerriAI/litellm（提交 3578be429b5af5f04cb73f9f8fd55d6682764e4b，开源部分 MIT，企业目录另有商业许可，63772 星）、router-for-me/CLIProxyAPI（提交 85225381d89915595598ed13766cd79890c03a84，MIT 协议，59314 星）、QuantumNous/new-api（提交 cb074d31e296b53ce252d402a7063079cbf7f990，AGPL-3.0 协议，52410 星）、Wei-Shaw/sub2api（提交 328db26f450edbdf9f8d4344a3ea903ac6396842，LGPL-3.0 协议，46513 星），星数查时 2026-11-24。litellm 另读官方文档库 BerriAI/litellm-docs 的代理、路由、缓存、自动路由与护栏文档。
提炼范围：读了 5 个库的 README 与重点文档共约 9000 行。只读文档，不读代码，不运行仓库代码。
最终能力 138 条，分 7 个方向。每条能力配一条原文引用，引用为原文逐字连续子串，不超过 50 字。

## 能力索引

- 路由与负载均衡：gw.01 至 gw.20，共 20 条
- 容错、熔断与健康检查：gw.21 至 gw.35，共 15 条
- 密钥、预算与计费：gw.36 至 gw.58，共 23 条
- 缓存与成本优化：gw.59 至 gw.76，共 18 条
- 安全、鉴权与护栏：gw.77 至 gw.99，共 23 条
- 管理面、面板与可观测性：gw.100 至 gw.116，共 17 条
- 订阅转中转与协议转换：gw.117 至 gw.138，共 22 条

## 路由与负载均衡

### gw.01 自动模型零配置

来源：OmniRoute/README.md
能力：不用建组合，直接把模型写成 auto，网关按已接供应商实时拼一个虚拟组合来路由，默认走上次成功的供应商。
引用：“Set your model to `auto`”

### gw.02 自动模型九个变体

来源：OmniRoute/README.md
能力：auto 后面加变体定优化目标，coding 重质量，fast 重延迟，cheap 重便宜，subscription 只走已付费订阅，thrifty 先走订阅再逐级降，offline 重剩余额度，smart 重质量加一成探索，lkgp 显式钉住上次成功，chaos 并行发给一组模型取一个答案。
引用：“auto/coding”

### gw.03 优先级策略

来源：OmniRoute/README.md
能力：按目标顺序排队，先把第一个目标的额度用完再走下一个，适合主备分明的组合。
引用：“First-target ordered list”

### gw.04 填满优先策略

来源：OmniRoute/README.md
能力：把每个目标的额度彻底填满再换下一个，适合想把免费额度吃干榨净的组合。
引用：“fully before moving on”

### gw.05 加权随机策略

来源：OmniRoute/README.md
能力：按每个目标的权重做加权随机，权重大的分得多，适合按比例分流。
引用：“Weighted random by per-target weight”

### gw.06 轮询与随机策略

来源：OmniRoute/README.md
能力：round-robin 按顺序循环，random 均匀随机且去重，strict-random 随机且不去重，适合多账号均摊。
引用：“Cycle through targets in order”

### gw.07 二选一与最闲策略

来源：OmniRoute/README.md
能力：p2c 随机抽两个取较闲的那个做负载均衡，least-used 直接挑当前负载最低的目标，高并发时用最闲的最稳。
引用：“Power-of-two-choices random load balancing”

### gw.08 成本最优策略

来源：OmniRoute/README.md
能力：按实时目录价算每请求的美元成本，挑最便宜的目标，适合只认钱的批量任务。
引用：“Minimize $ per request from live catalog pricing”

### gw.09 余量优先与余量加权策略

来源：OmniRoute/README.md
能力：headroom 挑剩余额度最多的目标，quota-weighted 先跳过用完的账号，再按剩余配额除以在途负载的比例抽取，已有会话保持钉住不漂移。
引用：“Pick the target with the most remaining quota”

### gw.10 时间窗策略

来源：OmniRoute/README.md
能力：reset-window 优先挑额度窗口最快重置的目标，reset-aware 按重置时间排序、短窗口优先，expiry-first 先花最快过期不用的那个账号的额度，适合日重置额度。
引用：“quota window resets soonest”

### gw.11 上下文接力与上下文最优策略

来源：OmniRoute/README.md
能力：context-relay 把长对话的上下文跨目标交接，context-optimized 按当前上下文大小挑最合适的目标，长会话换模型不断档。
引用：“context across targets”

### gw.12 缓存最优策略

来源：OmniRoute/README.md
能力：把可复用的提示词前缀钉在同一个账号上，让提示词缓存命中率最大化，重复前缀的请求省钱最多。
引用：“reusable prompt prefix to the same account”

### gw.13 上次成功钉住策略

来源：OmniRoute/README.md
能力：LKGP 钉住上次成功的供应商，只有它不行了才按规则回落，适合供应商质量参差不齐时少折腾。
引用：“Last-Known-Good Path”

### gw.14 融合策略

来源：OmniRoute/README.md
能力：并行发给一组模型，再由一个裁判模型合成一个最终答案，适合对答案质量要求高于成本的场景。
引用：“a judge model synthesizes one final answer”

### gw.15 流水线策略

来源：OmniRoute/README.md
能力：把多个目标串成链，每一步的输出喂给下一步，适合分步加工的任务。
引用：“Chain steps”

### gw.16 Jev 策略

来源：OmniRoute/README.md
能力：按自己排好的名单走，TypeSafe Jev 按需决定每请求实际跑名单里的哪几项，跑不通再按原顺序回落，需显式开启。
引用：“TypeSafe Jev picks which entries run per request”

### gw.17 十六因子自动打分

来源：OmniRoute/README.md
能力：自动组合按健康度、额度、成本、延迟、任务适配、质量、会话可用性等 16 个因子实时打分选目标，不用手写规则。
引用：“16-factor live scoring across every connection”

### gw.18 四层级联回落

来源：OmniRoute/README.md
能力：请求按订阅、API 密钥、便宜、免费四层依次回落，只要还有合规健康的下一层就不断流，订阅层先吃，免费层兜底。
引用：“4-tier auto-fallback”

### gw.19 订阅阶梯只走已付费

来源：OmniRoute/README.md
能力：auto/subscription 只用已经付费的订阅额度，失败就直接失败，绝不悄悄落到要花钱的层；auto/thrifty 先走订阅额度，重置后自动回到订阅层。
引用：“fails closed, never a billable fallback”

### gw.20 免费池去重与条款风险标记

来源：OmniRoute/README.md
能力：免费额度按共享池去重计算，每个共享池只算一次，不把首月赠金和无上限免费混进月度数字；条款风险标为 avoid 的供应商默认不进自动路由，连接账号也不能覆盖。
引用：“each shared pool counted once”

## 容错、熔断与健康检查

### gw.21 三层韧性分工

来源：OmniRoute/AGENTS.md
能力：韧性分三层各管各的失败：提供商熔断管整个提供商，连接冷却管单个密钥账号，模型锁定管单个模型，层与层之间不越权。
引用：“3 independent self-healing layers”

### gw.22 熔断四态

来源：OmniRoute/AGENTS.md
能力：提供商熔断有 CLOSED、DEGRADED、OPEN、HALF_OPEN 四态，OPEN 过期后进 HALF_OPEN 做探测，不用后台定时器，靠下次查询懒恢复。
引用：“CLOSED/DEGRADED/OPEN/HALF_OPEN”

### gw.23 仅特定状态码触发熔断

来源：OmniRoute/AGENTS.md
能力：只有 408、500、502、503、504 这类提供商级状态码会跳闸熔断，多数 401、403、429 归连接冷却或模型锁定管，不会误伤整个提供商。
引用：“408/500/502/503/504”

### gw.24 连接冷却指数退避

来源：OmniRoute/README.md
能力：单个连接出问题后冷却，OAuth 基础 5 秒、API 密钥基础 3 秒，指数翻倍退避并带防惊群保护，冷却的密钥跳过，同账号其他密钥继续服务。
引用：“anti-thundering-herd guard”

### gw.25 限流遵从 Retry-After

来源：OmniRoute/README.md
能力：收到 429 时按上游返回的 Retry-After 等，不自己瞎猜重试间隔，成功一次就清掉全部错误状态。
引用：“429 honors Retry-After”

### gw.26 成功清零错误状态

来源：OmniRoute/README.md
能力：一次成功就把该连接的全部错误状态清零，冷却计数不留尾巴，避免好连接长期被冷落。
引用：“success clears all error state”

### gw.27 模型锁定

来源：OmniRoute/AGENTS.md
能力：单个模型报 429、本地 404 或模式拒绝时只锁这一个模型，绝不禁用整个连接，其他模型照常用。
引用：“One bad model never disables the whole connection”

### gw.28 终端状态不进冷却

来源：OmniRoute/README.md
能力：账号被封、过期、额度耗尽这类终端状态不进冷却，直接交给管理员处理，不浪费时间反复重试。
引用：“are for the operator, not cooldowns”

### gw.29 懒恢复无后台定时器

来源：OmniRoute/AGENTS.md
能力：熔断恢复不用后台定时器轮询，下次查询时顺手刷新过期的 OPEN 状态，省资源也少出错。
引用：“no background timer”

### gw.30 冷却期间兄弟密钥继续服务

来源：OmniRoute/README.md
能力：一个密钥在冷却时直接跳过它，同提供商的其他密钥继续接请求，单密钥故障不拖垮整个提供商。
引用：“sibling keys keep serving”

### gw.31 三类回落

来源：litellm-docs/docs/proxy/reliability.md
能力：litellm 回落分三类：通用回落接剩余错误，内容策略回落接内容违规，上下文超限回落接超长上下文，各类错误映射到对应回落链。
引用：“content_policy_fallbacks”

### gw.32 回落按顺序执行

来源：litellm-docs/docs/proxy/reliability.md
能力：回落链按配置顺序依次尝试，先配的先跑，跑通就停；默认回落兜底处理配错或坏掉的模型组。
引用：“Fallbacks are done in-order”

### gw.33 后台健康检查主动探活

来源：litellm-docs/docs/proxy/health_check_routing.md
能力：后台循环按配置间隔逐个探活部署，探活失败的部署立刻移出路由池，不用等真实用户请求先撞一次失败才发现。
引用：“background_health_checks: true”

### gw.34 容错阈值策略

来源：litellm-docs/docs/proxy/health_check_routing.md
能力：用 allowed_fails_policy 按错误类型设阈值，比如认证错 2 次才冷却、超时 4 次才冷却，避免一次瞬时抖动就踢掉健康部署。
引用：“AuthenticationErrorAllowedFails: 1”

### gw.35 上游错误分级处理

来源：sub2api/README.md
能力：401 临时摘掉凭证失效的账号，403 按权限或权益失败处理不进刷新死循环，429 按 Retry-After 或短冷却临时摘掉账号，分级处理不混为一谈。
引用：“temporarily remove accounts”

## 密钥、预算与计费

### gw.36 主密钥与虚拟密钥

来源：litellm-docs/docs/proxy/virtual_keys.md
能力：主密钥是网关管理员密钥，用它发虚拟密钥给调用方，调用方只拿虚拟密钥，看不到上游密钥和主密钥。
引用：“Proxy Admin key”

### gw.37 密钥继承归属人权限

来源：litellm-docs/docs/proxy/virtual_keys.md
能力：密钥的权限从归属用户继承，模型访问和 MCP 访问按密钥自身算，管理接口访问按归属用户的角色算，归属管理员的密钥能管密钥用户和团队。
引用：“What a key inherits from its owner”

### gw.38 模型别名

来源：litellm-docs/docs/proxy/virtual_keys.md
能力：给真实模型起公开别名，客户端只看到别名，后台映射到真实部署，换部署不用改客户端。
引用：“Model Aliases”

### gw.39 密钥轮换

来源：litellm-docs/docs/proxy/virtual_keys.md
能力：密钥支持轮换与定时轮换，旧密钥按计划退役，轮换不断服务，泄露的密钥能及时换掉。
引用：“Key Rotations”

### gw.40 临时提额

来源：litellm-docs/docs/proxy/virtual_keys.md
能力：给密钥临时加预算额度，用完自动回到原额度，适合临时大任务不改长期配置。
引用：“Temporary Budget Increase”

### gw.41 密钥归属人自改预算

来源：litellm-docs/docs/proxy/virtual_keys.md
能力：允许密钥的归属人自己改自己密钥的预算，管理员不用每次都插手，改动仍在审计范围内。
引用：“Let key owners edit their own key budgets”

### gw.42 团队预算

来源：litellm-docs/docs/proxy/team_budgets.md
能力：按团队设月度预算，团队下所有密钥共享一个预算池，超了整个团队一起停，适合按项目或客户分账。
引用：“Setting Team Budgets”

### gw.43 每模型预算

来源：litellm-docs/docs/proxy/budget_fallbacks.md
能力：给密钥按模型设预算上限，比如某模型每天最多 5 美元，超了就拦住或回落，不让一个模型吃掉全部预算。
引用：“model_max_budget”

### gw.44 预算回落

来源：litellm-docs/docs/proxy/budget_fallbacks.md
能力：某模型预算用完时不直接报错，静默切到同密钥上还有预算的备用模型，调用方无感，花费记到备用模型头上。
引用：“budget_fallbacks”

### gw.45 预算回落链式降级

来源：litellm-docs/docs/proxy/budget_fallbacks.md
能力：预算回落链可以逐级降价，先走贵的再走便宜的，每一级都有自己的日预算，全部用完才真正报预算超限。
引用：“then rolls to”

### gw.46 成本价目表驱动计费

来源：litellm-docs/docs/proxy/cost_tracking.md
能力：每个模型的单价存在一张价目表里，花费按实际用量乘单价算，不靠模型名猜价格，新模型只要加进价目表就能计费。
引用：“The cost per model is stored”

### gw.47 花费分键分用户分团队

来源：litellm-docs/docs/proxy/cost_tracking.md
能力：花费按密钥、用户、团队三个维度分别记账，查哪一层都能看到自己的花销，分账对账不靠猜。
引用：“Get spend per”

### gw.48 自定义标签计费

来源：litellm-docs/docs/proxy/cost_tracking.md
能力：给请求打自定义标签，花费按标签汇总，适合按业务线、按客户、按项目切分账单。
引用：“Custom Tags”

### gw.49 渠道优先级权重与亲和

来源：new-api/README.md
能力：渠道按优先级和权重排序，失败重试，同一会话优先走同一渠道，多个上游密钥轮换，分组决定密钥能用哪些渠道。
引用：“channel priorities and weights”

### gw.50 表达式定价

来源：new-api/README.md
能力：定价用表达式写，支持按用量档位分层定价，不同用量走不同单价，图片视频按张数秒数计价。
引用：“expression-based pricing for different usage tiers”

### gw.51 额度订阅与用量日志

来源：new-api/README.md
能力：用户额度、订阅、用量日志、缓存记账放一起管，订阅升降级只刷新授权缓存，不踢掉已登录设备。
引用：“Manage quotas, subscriptions, usage logs”

### gw.52 Token 级精确计费

来源：sub2api/README.md
能力：按 token 粒度记用量和算费用，每次请求的输入输出 token 都落账，不按次打包估算。
引用：“Token-level usage tracking and cost calculation”

### gw.53 简单模式跳过计费

来源：sub2api/README.md
能力：个人或小团队开简单模式，藏起 SaaS 相关功能，跳过计费流程，直接用不用算账。
引用：“skips billing process”

### gw.54 密钥窗口软上限

来源：sub2api/README.md
能力：简单模式可给每个密钥开 5 小时、日、7 日三档花销窗口，请求后才扣减的软上限，在途并发可能小幅超支，不做硬拦。
引用：“post-request soft cap”

### gw.55 内置支付系统

来源：sub2api/README.md
能力：支付直接内置，支持 EasyPay、支付宝、微信支付和 Stripe，用户自助充值不用另搭支付服务。
引用：“Built-in Payment System”

### gw.56 每键美元额度

来源：OmniRoute/README.md
能力：每个密钥可设美元花销上限，超了就停，成本遥测在每个响应头里回显，面板上按密钥看花费。
引用：“per-key USD spend quotas”

### gw.57 订阅类供应商记零美元

来源：OmniRoute/README.md
能力：订阅和编程套餐类供应商在成本分析里记 0 美元，预算、额度和路由照常估算，花钱和不花钱的账分开算。
引用：“budget, quota & routing keep estimating”

### gw.58 优先级预留容量

来源：litellm-docs/docs/proxy/dynamic_rate_limit.md
能力：按优先级给不同环境预留 TPM 和 RPM 容量，比如生产留九成、开发留一成，关键业务任何时候都有保底容量。
引用：“Reserve TPM/RPM capacity”

## 缓存与成本优化

### gw.59 精确匹配缓存

来源：litellm-docs/docs/proxy/caching.md
能力：缓存按整个请求体算哈希，完全相同的请求第二次直接命中缓存，不再调上游，适合重复率高的固定问答。
引用：“key on a hash of the whole request”

### gw.60 语义缓存

来源：litellm-docs/docs/proxy/caching.md
能力：语义缓存把提示词向量化，意思接近的请求也命中，适合单轮问答；代理类多轮流量别开，容易误命中。
引用：“above a similarity threshold”

### gw.61 多 worker 共享缓存

来源：litellm-docs/docs/proxy/caching.md
能力：内存缓存只活在单个 worker 进程里，四个 worker 就有四份缓存，命中率按 worker 数打折；多 worker 部署要用 Redis 做共享缓存。
引用：“An in-memory cache lives inside one worker process”

### gw.62 缓存命中响应头

来源：litellm-docs/docs/proxy/caching.md
能力：缓存命中的响应带缓存键响应头，拿这个键能主动删缓存，调试缓存问题先看这个头。
引用：“x-litellm-cache-key”

### gw.63 缓存感知路由

来源：litellm-docs/docs/proxy/cache_aware_routing.md
能力：同一会话的请求尽量钉在同一个推理实例上，提示词缓存前缀保持热状态，不用每次重写长前缀。
引用：“for prompt cache reuse”

### gw.64 十二引擎压缩栈

来源：OmniRoute/README.md
能力：压缩是一条十二个引擎串起来的流水线，每个引擎可单独开关、按组合搭配，从去重、归档、精简到语义剪枝层层递进。
引用：“12 composable engines”

### gw.65 RTK 工具结果过滤

来源：OmniRoute/README.md
能力：RTK 专治工具输出臃肿，按命令类型过滤、去重、截断 shell、测试、构建和 git 输出，工具多的会话省 token 最多。
引用：“Smart tool-result filtering, dedup & truncation”

### gw.66 Caveman 规则压缩

来源：OmniRoute/README.md
能力：Caveman 用规则压缩散文，输出端能压掉约六到七成，日常写代码的默认压缩档。
引用：“Rule-based prose compression”

### gw.67 LLMLingua-2 语义剪枝

来源：OmniRoute/README.md
能力：LLMLingua-2 用小模型做语义剪枝，异步跑，对代码安全，适合长上下文里挑真正相关的句子留下来。
引用：“ML semantic pruning via MobileBERT ONNX”

### gw.68 Headroom 表格无损压缩

来源：OmniRoute/README.md
能力：Headroom 用表格编码无损压缩 JSON 数组，能省约三成，结构化数据压缩不丢信息。
引用：“Lossless tabular compaction of JSON arrays”

### gw.69 跨轮去重与归档取回

来源：OmniRoute/README.md
能力：Session-Dedup 丢掉跨轮重复的内容，CCR 把大段内容归档到取回标记后面，用时再取，代码块、链接和 JSON 结构化内容始终原样保留。
引用：“Drops content repeated across turns”

### gw.70 自适应上下文预算刻度盘

来源：OmniRoute/README.md
能力：不用一个开关定死压缩，上下文快满时才逐步加码，先用最无损最便宜的引擎，只压到刚好塞进模型窗口为止。
引用：“most-lossless engines only as far as needed”

### gw.71 压缩优先级链

来源：OmniRoute/README.md
能力：压缩方案按优先级定：单次请求头最高，其次组合覆盖，再次命名配置，再次自适应触发，最后面板默认，实际用的方案在响应头里回显。
引用：“x-omniroute-compression”

### gw.72 按复杂度自动分层

来源：litellm-docs/docs/proxy/auto_routing.md
能力：自动路由按问题复杂度分四档，简单题走便宜模型，复杂题走强模型，推理题走最强模型，默认模型兜底。
引用：“complexity_router_config”

### gw.73 自适应池汤普森采样

来源：litellm-docs/docs/proxy/auto_routing.md
能力：同一档可以配一个模型池，自适应模式用汤普森采样按实际表现动态挑，冷启动只在档内采样，不会一开始就全压到最便宜的模型上。
引用：“Thompson-sample across the pool”

### gw.74 会话亲和钉住模型

来源：litellm-docs/docs/proxy/auto_routing.md
能力：会话亲和开启后，首轮定的模型钉住整个会话，后续轮次不再重新分类，提示词缓存不失效，不同模型的对话历史也不会互相串味。
引用：“session_affinity: true”

### gw.75 路由决策日志

来源：litellm-docs/docs/proxy/auto_routing.md
能力：每次路由决策都打一个原因标记，写明是打分、字面规则、语义匹配、会话钉住还是分类器定的，排障时直接看原因。
引用：“marker per decision”

### gw.76 压缩离线评估

来源：OmniRoute/README.md
能力：压缩方案上线前先在固定语料上离线评，保真度和节省量都打分，过了才推广，不拿真实用户流量试压缩。
引用：“scores fidelity vs. savings on a pinned corpus”

## 安全、鉴权与护栏

### gw.77 短期访问令牌

来源：new-api/docs/authentication.md
能力：面板访问令牌是 15 分钟有效的 JWT，只放浏览器内存里发，不落盘不进存储，过期就靠刷新令牌换。
引用：“Access Token 是有效期 15 分钟的 JWT”

### gw.78 刷新令牌轮换

来源：new-api/docs/authentication.md
能力：刷新令牌是随机不透明值，最长 30 天，只走 HttpOnly 严格同站 Cookie，服务端只存 HMAC 摘要，每次刷新都轮换。
引用：“在每次刷新时轮换”

### gw.79 鉴权版本失效旧会话

来源：new-api/docs/authentication.md
能力：用户密码、状态、角色或安全因子一变，鉴权版本号递增，旧登录会话全部失效，改密码等于全设备下线。
引用：“auth_version 会递增并使旧登录会话失效”

### gw.80 会话签发上限

来源：new-api/docs/authentication.md
能力：单用户活跃会话默认上限 50 个，24 小时内签发上限 100 个，超了新登录直接拒绝，极端并发可能少量超额但绝不降级放行。
引用：“USER_SESSION_ACTIVE_LIMIT”

### gw.81 安全证明二次验证

来源：new-api/docs/authentication.md
能力：看渠道密钥、注册删除通行密钥、删用户、改管理员权限这类敏感操作，要带 1 分钟有效的二次验证证明，证明绑定用户、会话和具体动作，不能挪用。
引用：“X-Security-Proof”

### gw.82 个人访问令牌权限范围

来源：new-api/docs/authentication.md
能力：个人访问令牌按资源加动作划范围，比如资料读写、用量查看、钱包操作，只能授自己已有的权限，每次请求都重新读角色和权限，撤权立即生效。
引用：“resource:action”

### gw.83 令牌不能管令牌

来源：new-api/docs/authentication.md
能力：个人访问令牌不能创建、改名或撤销令牌，也不能管理登录会话，这些接口只接受浏览器登录会话，机器密钥管不了自己。
引用：“PAT 不能创建、改名或撤销 PAT”

### gw.84 可信代理三态配置

来源：new-api/docs/authentication.md
能力：可信代理分三态：不配默认只信回环和私网段，配 none 谁也不信只用直连地址，配具体地址就只信这几个反代，配错直接拒绝启动。
引用：“TRUSTED_PROXIES=none”

### gw.85 固定窗口边界双倍语义

来源：new-api/docs/authentication.md
能力：Redis 限流用原子固定窗口，窗口边界两侧各能打满一次，极短时间内通过量最高约两倍，定阈值时要把这个算进去。
引用：“窗口边界两侧可分别打满一次”

### gw.86 护栏三模式

来源：litellm-docs/docs/proxy/guardrails/quick_start.md
能力：护栏按调用时机分三档：调用前扫输入，调用中并行扫输入、等结果出来再返回，调用后扫输入加输出，可多档同开。
引用：“mode: [pre_call, post_call]”

### gw.87 仅记录模式

来源：litellm-docs/docs/proxy/guardrails/quick_start.md
能力：logging_only 模式只在后台扫日志里的输入输出，不改客户端响应也不加延迟，先上线观察再决定要不要拦。
引用：“without changing the client response”

### gw.88 PII 实体掩码

来源：litellm-docs/docs/proxy/guardrails/quick_start.md
能力：PII 护栏按实体配动作和置信度阈值，比如信用卡、邮箱、社保号命中就打码，阈值以下的不动，误杀少。
引用：“pii_entities_config”

### gw.89 流式范围控制

来源：litellm-docs/docs/proxy/guardrails/quick_start.md
能力：护栏可限定只扫流式请求或只扫非流式请求，默认两者都扫，流式和非流式走不同策略时分开配。
引用：“stream_scope: streaming”

### gw.90 提示注入护栏

来源：OmniRoute/README.md
能力：每条模型路由都过提示注入检测，配红队测试套，注入攻击在进模型前就拦住。
引用：“prompt-injection guard on every LLM route”

### gw.91 凭据掩码双向

来源：OmniRoute/README.md
能力：凭据掩码护栏双向脱敏，请求里出去的密钥和响应里回来的密钥都打码，密钥泄露不出网关。
引用：“redacts leaked API keys/secrets in both directions”

### gw.92 PII 默认关闭

来源：OmniRoute/README.md
能力：PII 脱敏和响应净化默认关闭，管理员显式开启才生效，绝不静默改用户数据。
引用：“masking itself stays opt-in”

### gw.93 密钥静态加密

来源：OmniRoute/README.md
能力：密钥落盘用 AES-256-GCM 加密，加密密钥绝不写日志，本地优先不经过别人云。
引用：“AES-256-GCM encrypted keys”

### gw.94 错误净化

来源：OmniRoute/AGENTS.md
能力：所有 HTTP、流式和执行器的错误响应都要过净化函数，原始堆栈和错误信息绝不直接回给客户端。
引用：“sanitizeErrorMessage()”

### gw.95 公共凭据集中解析

来源：OmniRoute/AGENTS.md
能力：上游公开 OAuth 凭据和 Firebase Web 密钥一律走集中解析函数，绝不在代码里写字面量，换凭据只改一处。
引用：“resolvePublicCred()”

### gw.96 本地路径守卫

来源：OmniRoute/AGENTS.md
能力：能拉起子进程的接口一律先过本地路径分类，只允许回环访问，隧道里漏出去的令牌也触发不了进程。
引用：“isLocalOnlyPath()”

### gw.97 受限管理员密钥默认

来源：sub2api/docs/admin-api-keys.md
能力：管理员密钥默认受限模式，只有权限目录明确登记的接口和操作才开放，新接口不会自动继承权限，默认安全。
引用：“只有权限目录明确登记的接口和操作才会开放”

### gw.98 全权模式显式确认

来源：sub2api/docs/admin-api-keys.md
能力：全权兼容模式要单独开启，开启前弹窗说明影响并输入确认文字，关闭后恢复原资源规则，审计里记录模式改动前后状态。
引用：“confirm_full_access: true”

### gw.99 密钥仅创建时可见

来源：sub2api/docs/admin-api-keys.md
能力：管理员密钥完整明文只在创建或轮换的当次响应里出现，关掉展示就再也读不出来，丢了只能轮换不能找回。
引用：“完整密钥仅在创建或轮换的当前响应中出现”

## 管理面、面板与可观测性

### gw.100 管理界面首次登录

来源：litellm-docs/docs/proxy/ui.md
能力：首次启动用环境变量凭据登录管理界面，建好自己的管理员账号后立刻禁用环境凭据登录，留一个应急管理员账号防单点登录故障。
引用：“disable environment credential login”

### gw.101 审计日志导出

来源：litellm-docs/docs/proxy/audit_logs.md
能力：密钥、用户、团队的每次改动都记审计日志，写明谁改的、改了哪张表、改前改后什么值，还能导出到对象存储。
引用：“Export Audit Logs to External Storage”

### gw.102 软预算告警

来源：litellm-docs/docs/proxy/alerting.md
能力：虚拟密钥预算快用完时发软预算告警，超预算前先提醒，不等到请求被拦才发现。
引用：“Soft Budget Alerts for Virtual Keys”

### gw.103 告警摘要模式

来源：litellm-docs/docs/proxy/alerting.md
能力：预算告警支持摘要模式，把一段时间的告警合成一条发，告警风暴时不刷屏。
引用：“Digest Mode (Reducing Alert Noise)”

### gw.104 区域故障告警

来源：litellm-docs/docs/proxy/alerting.md
能力：区域级故障单独告警，某个云区域挂了能第一时间知道并切走流量。
引用：“Region-outage alerting”

### gw.105 模型管理

来源：litellm-docs/docs/proxy/ui.md
能力：管理界面里直接管模型，加模型、改模型、看模型，不用改配置文件重启。
引用：“Model Management”

### gw.106 花费报表

来源：litellm-docs/docs/proxy/cost_tracking.md
能力：花费能按日期、团队、密钥出报表，企业版可定时生成，账单对账有据可查。
引用：“Generate Spend Reports”

### gw.107 多节点共享主库

来源：new-api/README.md
能力：多节点部署必须共享同一个主数据库和同一套鉴权密钥，各节点用独立 Redis 时限流按节点独立计数，集群总额度最坏是单节点阈值乘以节点数。
引用：“must share the main database”

### gw.108 日志库分离

来源：new-api/README.md
能力：用量日志可配独立日志库，支持 ClickHouse，主库只存业务数据，日志量大了不拖垮主库。
引用：“Configure with `LOG_SQL_DSN`”

### gw.109 免费额度仪表盘

来源：OmniRoute/README.md
能力：免费额度单独有一页仪表盘，实时看每个免费池用了多少还剩多少，池子算法公开可验。
引用：“/dashboard/free-tiers”

### gw.110 成本遥测响应头

来源：OmniRoute/README.md
能力：每个响应都带成本和用量响应头，缓存命中有省钱响应头，每次调用花了多少当场就能看到。
引用：“cost/usage headers on every endpoint”

### gw.111 渠道监控默认 V1

来源：sub2api/docs/channel-monitor-v2-safe-defaults.md
能力：渠道监控默认走 V1 主动探测，V2 被动模式要显式开启，升级时已有 V2 配置不动，不强制改回 V1。
引用：“keep active probes”

### gw.112 温和回填硬门

来源：sub2api/docs/channel-monitor-v2-safe-defaults.md
能力：历史数据回填设硬门：每轮只补一个历史块，单领导者锁，单事务预算约 55 秒，块大小按深度分级，低配服务器也不被回填打垮。
引用：“Single leader lock”

### gw.113 错误去重时间界

来源：sub2api/docs/channel-monitor-v2-safe-defaults.md
能力：错误去重查询必须加时间界，只扫最近 90 分钟的记录，不全表扫描历史错误日志。
引用：“Error dedup”

### gw.114 管理接口 ETag 防丢更新

来源：CLIProxyAPI/docs/management-api-v8.md
能力：管理接口读写配置带强 ETag，并发写用 If-Match 校验，过期返回 412，处理中文件变了返回 409，读到旧配置再重试不丢更新。
引用：“Use it as `If-Match` to guard against lost updates”

### gw.115 配置热重载

来源：CLIProxyAPI/docs/sdk-usage.md
能力：配置文件和认证目录一改就自动热加载，不用重启服务，改账号改路由实时生效。
引用：“are picked up automatically”

### gw.116 使用统计外包

来源：CLIProxyAPI/README.md
能力：从 v6.10.0 起内置用量统计被拿掉，改由独立的外挂统计服务做，定期同步数据、SQLite 存档、自带仪表盘看用量。
引用：“no longer ship built-in usage statistics”

## 订阅转中转与协议转换

### gw.117 订阅转标准接口

来源：CLIProxyAPI/README.md
能力：把编程工具的订阅账号转成标准接口，OpenAI、Gemini、Claude、Codex、Grok 五种协议都能出，任何兼容客户端都能接。
引用：“compatible API interfaces for CLI”

### gw.118 多账号轮询

来源：CLIProxyAPI/README.md
能力：同一供应商挂多个订阅账号，按轮询分摊负载，Gemini、OpenAI、Claude、Grok 都支持多账号，一个账号限流了换下一个。
引用：“Multiple accounts with round-robin load balancing”

### gw.119 加权轮询与会话亲和

来源：CLIProxyAPI/docs/management-api-v8.md
能力：按凭据权重做加权轮询，权重默认 1、最大一百万，非正数排除；会话亲和开启后粘性请求也消耗加权额度，新会话优先补给被亏待的凭据。
引用：“weighted-round-robin”

### gw.120 思考后缀规范化

来源：CLIProxyAPI/AGENTS.md
能力：思考配置先规范化成统一结构再按供应商翻译，后缀优先于请求体，集中校验一次，绝不让各供应商各写一套。
引用：“ApplyThinking()”

### gw.121 刷新恢复日志

来源：CLIProxyAPI/docs/codex-refresh-recovery.md
能力：刷新令牌前先记一条领取记录，刷新结果不明时不上报成功也不重放，靠领取记录和收据恢复，删记录、重启、重导旧令牌都不算恢复。
引用：“refresh_outcome_unknown”

### gw.122 WebSocket 隧道

来源：CLIProxyAPI/docs/websocket-tunnel.md
能力：用 WebSocket 隧道把远端节点连回来，控制通道走文本帧、数据通道走二进制帧，握手鉴权、角色声明、保活和热重载都有协议。
引用：“WebSocket Tunnel Integration Guide”

### gw.123 SDK 嵌入

来源：CLIProxyAPI/docs/sdk-usage.md
能力：整个代理能以 Go SDK 嵌进自己的服务，配置加载、认证监听、后台刷新、优雅停机都由服务管，中间件和路由可自己加。
引用：“Minimal Embed”

### gw.124 复合组路由

来源：sub2api/docs/COMPOSITE_GROUPS.md
能力：复合组是管理员路由层，一把密钥按请求的模型名选具体供应商，不用每供应商各发一把密钥，适合一个套餐包多个模型。
引用：“Composite groups are an admin routing layer”

### gw.125 内置检测失败关闭

来源：sub2api/docs/COMPOSITE_GROUPS.md
能力：复合组按模型名前缀内置识别供应商，认不出的模型名直接失败关闭不猜供应商，猜错供应商比报错更糟。
引用：“Unknown or ambiguous model names fail closed”

### gw.126 路由解析顺序

来源：sub2api/docs/COMPOSITE_GROUPS.md
能力：复合组先走管理员配的显式路由再走内置识别，多个显式路由命中时精确匹配胜前缀匹配、端点专属胜通用、长前缀胜短前缀、优先级数字小的胜。
引用：“explicit route first, then built-in detection”

### gw.127 混合调度

来源：sub2api/README.md
能力：Antigravity 账号开混合调度后，通用端点也会把请求分给 Antigravity 账号；但 Anthropic 原生 Claude 和 Antigravity 的 Claude 不能混在同一个对话上下文里，要用分组隔离。
引用：“hybrid scheduling”

### gw.128 TypeSafe 原生协议

来源：sub2api/README.md
能力：TypeSafe 账号走 Jev 原生非流式 System One 协议，问题分是非题、选择题、打分题，请求和成功响应保持原生 JSON 结构，不转成对话格式。
引用：“native, non-streaming System One protocol”

### gw.129 异步图片任务

来源：sub2api/README.md
能力：耗时长的图片生成和编辑走异步接口，先提交拿任务号再轮询结果，不用一直占着连接等。
引用：“without holding a CDN connection open”

### gw.130 图片格式以实际返回为准

来源：sub2api/README.md
能力：图片接口要求什么格式，上游可能返回别的格式，存文件前先比对返回的实际格式再定扩展名和类型，成功但格式不符的响应照常计费，别自动重试再花一份钱。
引用：“verify the actual image format”

### gw.131 反代下划线请求头

来源：sub2api/README.md
能力：Nginx 反代时要在 http 块开 underscores_in_headers，不然 Nginx 默认丢掉带下划线的请求头，粘性会话路由就断了。
引用：“underscores_in_headers on;”

### gw.132 四协议转换

来源：new-api/README.md
能力：RelayKit 在 OpenAI 对话、Responses、Anthropic 消息、Gemini 四种文本协议之间做请求、响应和流式转换，一个渠道能同时服务四种客户端。
引用：“between the four text protocols”

### gw.133 任务插件扩展

来源：new-api/README.md
能力：图片、视频等异步任务接口用 JavaScript 插件扩展，插件声明自己的提交和查询路由，含任务状态和结果取回。
引用：“with JavaScript plugins”

### gw.134 插件冲突预检

来源：new-api/docs/plugin-api/v1.md
能力：插件上线前先对实时路由做预检，模型名只差大小写或同一路径同一模型协议冲突就拒绝上线，原状不动，强制开关也绕不过。
引用：“rejects the change and leaves everything as it was”

### gw.135 多协议端点

来源：litellm/README.md
能力：一个网关同时出对话、Responses、嵌入、图片、音频、批量、重排、A2A、消息等多种端点，客户端按需选协议。
引用：“All Supported Endpoints”

### gw.136 MCP 网关

来源：litellm/README.md
能力：MCP 服务器挂进网关，任何模型调用对话接口时都能用 MCP 工具，Cursor 这类编辑器直接配网关地址就能用。
引用：“MCP Gateway”

### gw.137 A2A 网关

来源：litellm/README.md
能力：智能体按 A2A 协议挂进网关，网关给每个智能体一个地址，客户端用标准 A2A 客户端调用。
引用：“A2A Agent Gateway”

### gw.138 智能体套件

来源：litellm/README.md
能力：网关自带智能体套件，能在任意模型上跑 Claude Code、Codex、OpenCode、Pi 或深度智能体，调用都走网关记账。
引用：“Claude Code, Codex, OpenCode, pi or Deep Agents”
