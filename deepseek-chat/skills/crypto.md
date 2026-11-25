# 币圈策略与欧易自动下单技能包

来源库：freqtrade/freqtrade（57,192 星，GPL-3.0）、ccxt/ccxt（44,971 星，MIT）、hummingbot/hummingbot（21,372 星，Apache-2.0）、jesse-ai/jesse（8,829 星，MIT）、Drakkar-Software/OctoBot（6,977 星，GPL-3.0），查时 2026-11-24。
提炼范围：只读文档，不读代码，不克隆，不运行仓库代码，不对真实交易所发请求。围绕币圈算策略、自动下单、接欧易提炼方法论、决策框架与清单，不抄功能列表凑数。freqtrade 与 OctoBot 为 GPL-3.0，只提炼方法、转述写法，不大段抄原文。
最终能力 139 条，分 10 个方向。每条能力配一条原文引用，引用为原文逐字连续子串，不超过 50 字。

## 能力索引

- 策略写法与信号：ok.01 至 ok.11，共 11 条
- 做市网格与库存管理：ok.12 至 ok.25，共 14 条
- 套利定投与信号接入：ok.26 至 ok.40，共 15 条
- 回测与参数优化：ok.41 至 ok.58，共 18 条
- 风控与仓位管理：ok.59 至 ok.76，共 18 条
- 自动下单执行与订单管理：ok.77 至 ok.96，共 20 条
- 统一 API 与 OKX 接入：ok.97 至 ok.116，共 20 条
- 密钥安全实盘演练与容错：ok.117 至 ok.133，共 17 条
- 半导体杠杆 ETF 测算与输出：ok.134 至 ok.136，共 3 条
- 强制执行流程与防瞎编：ok.137 至 ok.139，共 3 条

## 策略写法与信号

### ok.01 策略是定义买卖逻辑的类

来源：https://www.freqtrade.io/en/2025.1/strategy-101/
能力：策略写成一个 Python 类，在类里定义买卖逻辑；新策略用 new-strategy 从模板生成，放在 user_data/strategies 目录下，启动时用 strategy 参数点名。
引用：“defines the logic for buying and selling”

### ok.02 指标入场出场三段式

来源：https://www.freqtrade.io/en/2025.1/strategy-101/
能力：populate_indicators 负责算指标并写成数据列，populate_entry_trend 负责给入场信号，populate_exit_trend 负责给出场信号；入场用 enter_long 列写 1，出场用 exit_long 列写 1，做空对应 enter_short 与 exit_short。
引用：“defines conditions for an entry signal”

### ok.03 只算用到的指标

来源：https://www.freqtrade.io/en/2023.9/strategy-customization/
能力：只把入场、出场或别的指标会用到的指标放进 populate_indicators，多余指标会拖慢运行；换周期前先确认同一套信号在新周期上是否还成立。
引用：“otherwise performance may suffer”

### ok.04 同根 K 线信号冲突不下单

来源：https://www.freqtrade.io/en/2025.1/strategy-101/
能力：同一根 K 线上同时出现入场与出场信号时，两者算冲突，不下单；多空信号同时出现也一样处理，先排冲突再谈成交。
引用：“no order will be raised”

### ok.05 做空先开 can_short

来源：freqtrade/docs/leverage.md 第 34 行
能力：期货做空要在策略类里设 can_short 为 True，现货模式下做空不可用；做空信号走 enter_short 与 exit_short，与做多信号分开写。
引用：“set the class variable `can_short = True`”

### ok.06 单文件脚本先做最小验证

来源：https://github.com/hummingbot/hummingbot/blob/HEAD/README.md 第 151 行至第 152 行
能力：新想法先写成单文件脚本验证，例如 simple_pmm 只做围绕中间价挂买卖单并定时刷新，跑通后再升级成控制器，脚本阶段只验证逻辑与成交，不要直接把脚本当长期实盘用。
引用：“Single-file Python strategies”

### ok.07 入场决策只返回布尔值

来源：https://docs.jesse.trade/docs/strategies/entering-and-exiting
能力：策略入场只做是否开仓的二选一判断，用 should_long 与 should_short 两个方法返回布尔值，两个方法不能同时返回真，入场判断只在没有持仓且没有活动订单时每根新 K 线触发一次。
引用：“must return a boolean at all times”

### ok.08 均线交叉类信号写法

来源：https://github.com/jesse-ai/jesse README 渲染第 255 行
能力：信号用指标直接比较来表达，例如短期均线在长期均线之上就做多，指标调用只传 K 线数组与周期，先写信号逻辑再写下单逻辑，信号与执行分开。
引用：“go long when the EMA 8 is above the EMA 21”

### ok.09 多周期多标的同时回测

来源：https://github.com/jesse-ai/jesse README 渲染第 200 行
能力：一个策略可同时跑多个周期与多个标的，框架按时间顺序推进，不用未来 K 线做当前决策，多周期信号要靠已收完的 K 线计算，避免用还在走的 K 线触发入场。
引用：“without look-ahead bias”

### ok.10 指标库写法先查现成函数再自己算

来源：https://github.com/jesse-ai/jesse README 渲染第 196 行
能力：写信号先查框架自带的指标库，300 多个技术指标直接调，传 K 线数组与周期就能用，不要自己重写均线与 RSI 这类常用指标，自定义信号线可用 signal_line 对序列再做一次均线。
引用：“a complete library of technical indicators”

### ok.11 交易模式管下单评估器管何时下单

来源：https://www.octobot.cloud/en/guides/octobot-trading-modes/trading-modes 第 11 行
能力：策略分两层，交易模式决定下什么单、每单多少钱与什么价、如何止盈止损与何时撤单，评估器负责分析新 K 线、价格或社媒数据并在该下单时发出做多或做空信号；统计型模式两层都要配，只配模式不配评估器跑不起来。
引用：“What type of order to create”

## 做市网格与库存管理

### ok.12 双边限价挂单赚价差

来源：https://hummingbot.org/strategies/v1-strategies/pure-market-making/ 第 16 行
能力：只做一个交易对时，同时挂限价买单与限价卖单，让两边成交价差覆盖手续费与滑点，先确认该交易对流动性足够支撑双边成交，再定单量。
引用：“places limit buy (bid) and limit sell (ask) orders”

### ok.13 围绕中间价定买卖价差

来源：https://hummingbot.org/strategies/v1-strategies/pure-market-making/ 第 16 行
能力：以中间价为基准，买单放在中间价下方 bid_spread 处，卖单放在中间价上方 ask_spread 处，价差太窄会被手续费吃掉，价差太宽则成交变少，先按手续费加风险溢价定下限再调。
引用：“at prices relative to the mid-price with spreads”

### ok.14 对称网格多层挂单

来源：https://hummingbot.org/blog/dashboard-tutorial-pmm-simple-v2/ 第 112 行
能力：不用只挂一层买卖单，按买价差列表与卖价差列表在中间价两侧铺多层限价单，总资金按每层权重分配，越靠近中间价的层权重越高，远离的层只用来接极端波动。
引用：“grid of limit orders around the mid-price”

### ok.15 每层价差与数量逐层递增

来源：https://hummingbot.org/strategies/v1-strategies/pure-market-making/ 第 62 行
能力：定 order_levels 时同时定 order_level_spread 与 order_level_amount，层数越多覆盖价位越宽，但资金越分散，先定一层能稳定成交的量，再按固定步长向外加层，不要一开始就铺满全价位。
引用：“How many orders do you want to place on both sides”

### ok.16 定时撤单重挂跟住行情

来源：https://hummingbot.org/strategies/v1-strategies/pure-market-making/ 第 17 行
能力：用 order_refresh_time 设定撤单重挂周期，周期到了就撤掉旧单按新中间价重挂，行情快时缩短周期防报价脱节，行情稳时拉长周期省手续费与减少撤单次数。
引用：“replaces existing orders with new orders”

### ok.17 价差跌破下限立即撤单

来源：https://hummingbot.org/strategy-configs/minimum-spread/ 第 8 行
能力：设 minimum_spread 为可接受的最低价差，任一在途订单价差跌破该值就立即撤单，不等下一个刷新周期，默认值负 100 表示关闭该功能，启用时下限要高于手续费加滑点。
引用：“spread of any active order falls below”

### ok.18 库存偏斜开关防单边吃货

来源：https://hummingbot.org/strategies/v1-strategies/pure-market-making/ 第 68 行
能力：打开 inventory_skew_enabled 后，库存偏离目标时自动调整买卖报价偏移，单边行情下不再对称挂单，先确认目标库存比例与容忍范围，再开偏斜，避免一侧反复成交把库存推到极限。
引用：“Would you like to enable inventory skew”

### ok.19 先定目标库存比例再开策略

来源：https://hummingbot.org/strategies/v1-strategies/pure-market-making/ 第 70 行
能力：用 inventory_target_base_pct 定基础资产目标占比，默认 50 表示基础资产与报价资产各半，库存高于目标就压低买价并压低卖价促卖，低于目标则反向调整，开策略前先按可承受的最大偏离定目标。
引用：“What is your target base asset percentage”

### ok.20 价格上下限只挂单边

来源：https://hummingbot.org/strategies/v1-strategies/pure-market-making/ 第 56 行
能力：设 price_ceiling 与 price_floor 后，价格高于上限只挂卖单，低于下限只挂买单，配合 moving_price_band_enabled 让上下限跟随现价定期重置，防止趋势行情中逆势接货。
引用：“Above this price, only sell orders will be placed”

### ok.21 Avellaneda 保留价思路调报价中心

来源：https://hummingbot.org/strategies/v1-strategies/ 第 33 行
能力：不用中间价当报价中心，改用保留价当中心，保留价按库存偏离，波动率，风险厌恶与剩余时间向库存反方向偏移，库存多就整体下移报价促卖，库存少就整体上移报价促买，价差宽度另按波动率与成交强度定。
引用：“based on the classic Avellaneda-Stoikov paper”

### ok.22 网格只赚震荡市的波动钱

来源：https://www.octobot.cloud/en/guides/octobot-trading-modes/grid-trading-mode 第 0 行
能力：网格不预测方向，靠在固定间隔上同时挂买单和卖单，价格来回穿过格子时每完成一买一卖就赚一格差价；只适合横盘市，单边大涨大跌会跑出格子，要先判断市况再决定用不用网格。
引用：“profit from sideway markets”

### ok.23 简化网格按单量定格逐对独立配

来源：https://www.octobot.cloud/en/guides/octobot-trading-modes/grid-trading-mode 第 11 行
能力：简化版网格按想维持的单子数量定格，每对交易对单独配置，用固定值配价差与步长，限定投入资金与每单金额，新入账资金可自动派进网格，适合先从简单配置上手。
引用：“Be configured for each trading pair independently”

### ok.24 交错单按价格区间定格自动算单数

来源：https://www.octobot.cloud/en/guides/octobot-trading-modes/staggered-orders-trading-mode 第 7 行
能力：进阶版网格不按单数定，按想覆盖的价格上下界加价差与步长定，系统自动算出需要多少买单卖单并用满可用资金；要设交易所同时挂单上限，超出的单标为虚拟单，只在需要时才真正挂出。
引用：“focuses on the price range you want to cover”

### ok.25 网格越界跟随与反向单延迟

来源：https://www.octobot.cloud/en/guides/octobot-trading-modes/grid-trading-mode 第 15 行
能力：价格跑出网格时网格上下跟随，不用手动重建；一单成交后对面单可设延迟再挂，避免刚成交就立刻反向挂单被来回打；网格只做现货市场，合约不要用这套配置。
引用：“Trail up and down to follow the market”

## 套利定投与信号接入

### ok.26 跨所套利双边同时下单

来源：https://hummingbot.org/strategies/v2-strategies/executors/arbitrage-executor/ 第 5 行至第 7 行
能力：同一资产在两家交易所出现价差时，在便宜的一边买入同时在贵的一边卖出，两腿必须同时执行，只做一腿会变成裸露方向仓位，下单前先确认两边余额，交易对可互换，数量与精度都合规。
引用：“buy and sell orders on two distinct markets”

### ok.27 套利先扣手续费再算盈利

来源：https://hummingbot.org/strategies/v2-strategies/executors/arbitrage-executor/ 第 13 行
能力：算套利盈利时先扣两边手续费，滑点与资金成本，只有扣完仍高于 min_profitability 才下单，价差刚好等于手续费时不动手，阈值要按两边实际费率分别核对，不要用名义价差当利润。
引用：“ensure profitable trades post-fees”

### ok.28 现货永续价差开仓对冲

来源：https://hummingbot.org/strategies/v1-strategies/spot-perpetual-arbitrage/ 第 17 行至第 18 行
能力：现货价与永续价差超过 min_divergence 时开仓，一边在现货买入或卖出，另一边在永续开反向多空仓，杠杆默认 1，先定开仓价差阈值与每单数量，再定滑点缓冲，两边数量要对得上。
引用：“creating a buy/sell order on the spot connector”

### ok.29 现货永续价差收敛再平仓

来源：https://hummingbot.org/strategies/v1-strategies/spot-perpetual-arbitrage/ 第 20 行至第 21 行
能力：开仓后持续盯两边价差，价差回落到 min_convergence 以下就同时平掉现货与永续两腿，不要只平一腿留方向敞口，平仓后按 next_arbitrage_cycle_delay 冷却一段时间再找下一轮机会。
引用：“price spread between them reaches a value below”

### ok.30 现货库存用永续对冲

来源：https://hummingbot.org/strategies/v1-strategies/ 第 37 行
能力：现货库存因做市成交越积越多时，在永续开反向仓对冲库存风险，对冲比例按现货库存量定，不要满仓对冲后又反向裸露，定期核对现货持仓与永续持仓是否仍互相抵消。
引用：“inventory risk using perpetual swaps”

### ok.31 跨所比较资金费率再选方向

来源：https://hummingbot.org/release-notes/1.27.0/ 第 89 行至第 90 行
能力：对同一代币，先比较各永续交易所当前资金费率，选费率差最大的组合做多低费率一边做空高费率一边，目标是收资金费差，不是赌价格方向，下单前确认两边都支持该代币永续。
引用：“differences in funding rates across different”

### ok.32 资金费率盈利阈值进场

来源：https://hummingbot.org/release-notes/1.27.0/ 第 92 行至第 93 行
能力：按资金费率差算进场盈利，再与配置里的盈利阈值比较，差值高于阈值才进场，低于阈值继续等，同时设止盈与资金费率差止损，费率差反向收窄到止损线就离场，不要只看费率正负就下单。
引用：“profitability threshold set in the configuration”

### ok.33 定时买与信号买两种 DCA 触发

来源：https://www.octobot.cloud/en/guides/octobot-trading-modes/dca-trading-mode 第 8 行
能力：DCA 有两种触发，定时触发按固定周期定期买入，评估器触发在技术指标、Telegram 信号或 ChatGPT 给出满分买入信号时才买；只看满分信号，其他分值忽略，两种触发不要混着配。
引用：“Buy on a regular basis”

### ok.34 Smart DCA 选互补币小止盈快周转

来源：https://www.octobot.cloud/en/blog/smart-dca-making-of 第 34 行
能力：Smart DCA 是短周期版 DCA，挑不同叙事走势不同步的互补币分散做，止盈目标贴着币种日常波动设，例如头部币 0.8% 左右，让多数出场单几小时到几天内成交并快速释放资金；策略从不亏本卖，下跌市里卖单可能长期不成交锁住资金，所以下跌市不用。
引用：“It never sells at a loss”

### ok.35 ChatGPT 只做信号评估器不直接下单

来源：https://oss.octobot.online/guides/octobot-trading-modes/chatgpt-trading 第 8 行
能力：ChatGPT 在 OctoBot 里是个评估器，只输出看涨或看跌信号，不直接创建订单；DCA 与 Daily 两种交易模式都能接它，可以只按 ChatGPT 信号交易，也可以把它和其他评估器合并加权后再交易。
引用：“used as a trading indicator”

### ok.36 AI 评估三步先给数据再问涨跌加置信度

来源：https://oss.octobot.online/guides/octobot-trading-modes/chatgpt-trading 第 25 行
能力：ChatGPT 评估分三步，先按配置把市场数据加工后发给模型，再问模型近期更可能涨还是跌以及置信度百分比，最后按涨跌方向定信号正负，按置信度定信号权重；发给模型前可先做预处理，例如发原始 K 线或均线。
引用：“more likely to go UP or DOWN in the near future”

### ok.37 AI 成本设日上限回测不用现问

来源：https://oss.octobot.online/guides/octobot-trading-modes/chatgpt-trading 第 53 行
能力：给 OpenAI 花费设每日 token 上限，关掉高频重评估防止烧钱；回测要上千次预测，现问既慢又贵，所以开源版回测 ChatGPT 不现实，只能用云端已有的历史预测信号跑回测。
引用：“OpenAI token limit”

### ok.38 一个提醒对应一个自动建单或撤单动作

来源：https://oss.octobot.online/investing/tradingview-trading-tutorial 第 67 行
能力：TradingView 策略在 OctoBot 里由自动化单元承接，一个自动化就是收到指定提醒后自动执行的一个动作，例如建单或撤单；一个机器人可挂任意多个自动化与交易对，每个提醒要先对应好自己的自动化。
引用：“creating or cancelling orders”

### ok.39 Webhook 接线三步先模拟盘后实盘

来源：https://oss.octobot.online/investing/tradingview-trading-tutorial 第 143 行
能力：接线分三步，先在自动化连接面板复制 Webhook 地址与自动化标识，再到 TradingView 提醒里选 Webhook 通知并粘贴地址，消息字段填自动化标识；创建机器人时先选模拟盘，跑顺了再切实盘；TradingView 侧用 Webhook 要付费套餐。
引用：“Paste your webhook URL”

### ok.40 提醒触发源分价格指标与 Pine 策略三类

来源：https://oss.octobot.online/investing/tradingview-trading-tutorial 第 209 行
能力：TradingView 提醒可来自三类触发，价格穿越、指标信号、完整 Pine Script 策略；Pine 策略要在每次进出场调用里带上自动化标识，一个策略的多个信号各建一个自动化对应；收到的每条提醒都会存下来并能看到执行结果。
引用：“to trade from full TradingView strategies”

## 回测与参数优化

### ok.41 回测先备历史数据

来源：https://www.freqtrade.io/en/2021.7/backtesting/ 第 4 行
能力：回测要先有历史数据，默认从 user_data/data 加交易所名目录下读 OHLCV；没有数据时先跑 download-data，再按 timerange 限定回测区间。
引用：“Backtesting requires historic data to be available”

### ok.42 读懂回测报告四张表

来源：https://www.freqtrade.io/en/2021.7/backtesting/ 第 180 行
能力：回测报告看四张表：分币种交易表、出场原因表、未平仓表、汇总指标表；重点看胜率、平均持仓时长、最大回撤、最佳与最差交易，再看哪种出场原因亏得多就改哪一块。
引用：“better odds of making a profit than a loss”

### ok.43 回测的乐观假设要打折

来源：https://www.freqtrade.io/en/2021.7/backtesting/ 第 659 行
能力：回测默认所有订单按要价成交且无滑点，入场按开盘价，出场信号按下根 K 线开盘价，止损精确按止损价成交；这些假设会让回测比实盘好看，结果要打折看。
引用：“All orders are filled at the requested price”

### ok.44 超参优化先随机后贝叶斯

来源：freqtrade/docs/hyperopt.md 第 15 行
能力：超参优化先随机试几个参数组合，再用贝叶斯搜索加机器学习回归器找让损失函数最小的组合；每换一组参数就重跑一次回测，优化对象分入场、出场、ROI、止损、追踪止损等空间。
引用：“Hyperopt requires historic data to be available”

### ok.45 守门条件与触发信号分开

来源：freqtrade/docs/hyperopt.md 第 169 行
能力：入场条件分守门与触发两类，守门是常驻过滤，例如 ADX 低于 10 不进场，触发是当下动作，例如均线金叉或收盘价碰到布林下轨；信号粘住多根 K 线会晚进场，成功率比信号刚出现时低。
引用：“Triggers are ones that actually trigger entry”

### ok.46 前视偏差与递归偏差两道检查

来源：https://www.freqtrade.io/en/2025.11.2/lookahead-analysis/ 与 https://www.freqtrade.io/en/stable/recursive-analysis/
能力：回测会把整段数据一次交给指标函数，指标偷看未来 K 线会让回测失真；跑 lookahead-analysis 切片重跑比对指标值，再跑 recursive-analysis 换启动 K 线数比对末行指标值，两道检查都过再信回测。
引用：“Lookahead bias is the bane of any strategy”

### ok.47 回测先看净盈亏回撤与夏普

来源：https://hummingbot.org/blog/dashboard-tutorial-pmm-simple-v2/ 第 137 行
能力：回测时先定起止日期，分辨率与预期交易成本，再运行回测，重点看净盈亏，最大回撤，夏普比率，盈亏比与成交次数，任一指标异常都先调参数再重测，不要只看总盈利就上线。
引用：“simulate strategy performance over historical data”

### ok.48 回测先验无前视偏差再看指标

来源：https://github.com/jesse-ai/jesse README 渲染第 279 行
能力：回测的价值先看有没有前视偏差，再看绩效指标，跑回测时配调试日志与带指标的交互图表，逐笔核对信号发生在哪个位置，再用完整的绩效指标体系评判策略。
引用：“to validate your strategies thoroughly”

### ok.49 热身 K 线先喂饱指标再开仓

来源：https://docs.jesse.trade/docs/research/optimize 第 127 行
能力：回测与优化开始前先配一段热身 K 线，例如 210 根，让均线这类需要历史数据的指标先算出稳定值，热身期内的信号不计入成绩，避免指标未就绪的前几根 K 线产生假信号。
引用：“warmup bars before trading begins”

### ok.50 超参数用范围加默认值声明搜索空间

来源：https://docs.jesse.trade/docs/research/optimize 第 231 行
能力：策略里用 hyperparameters 方法声明每个可调参数的名字、类型、最小值、最大值与默认值，优化器只在这个空间里搜，策略内用 self.hp 读当前试验的参数值。
引用：“returns the search space”

### ok.51 训练集调参测试集只验泛化

来源：https://docs.jesse.trade/docs/research/optimize 第 77 行
能力：优化分训练期与测试期两段数据，训练期给优化器调参，测试期全程 withheld，调参过程看不到测试期数据，只用来量优化后的参数泛化得好不好，两个时期的夏普比率要对照着看。
引用：“never seen during the parameter search”

### ok.52 蒙特卡洛打乱交易顺序验时机依赖

来源：https://docs.jesse.trade/docs/research/monte_carlo 检索快照
能力：回测跑完后把全部交易的顺序随机打乱重建资金曲线，重复跑很多次，如果打乱后成绩还稳定，说明策略靠的是选股选时能力而非某几笔交易的运气，时机依赖强的策略要降级处理。
引用：“Tests if trade timing matters”

### ok.53 先验规则显著性再搭完整策略

来源：https://docs.jesse.trade/docs/rule-significance-testing/ 检索快照
能力：搭完整策略之前先对入场规则做显著性检验，用自举法生成随机入场也能达到的收益分布，再看真实规则的收益是否显著跑赢随机，只有规则本身有预测力才值得花时间调参和做完整回测。
引用：“whether it is just noise dressed up as a signal”

### ok.54 蒙特卡洛原结果过好要警惕过拟合

来源：https://docs.jesse.trade/docs/monte-carlo/interpreting-results 检索快照
能力：蒙特卡洛结果按原结果、最差百分之五、中位数、最好百分之五四列对照读，原结果比最好百分之五还好就是过拟合警告，原结果落在中位数附近才是稳健区间，区间越窄策略越稳定。
引用：“Better than Best 5%”

### ok.55 研究 API 与 Jupyter 做批量实验

来源：https://github.com/jesse-ai/jesse README 渲染第 383 行
能力：批量研究不用点仪表盘，用研究 API 在 Python 脚本或 Jupyter 里跑回测、优化、显著性检验、蒙特卡洛与机器学习，实验可复现、可写自定义报告、可接进现有数据分析流程。
引用：“to ordinary Python scripts and Jupyter notebooks”

### ok.56 回测四步选配置下数据跑报告看三类收益

来源：https://oss.octobot.online/guides/octobot-usage/backtesting 第 7 行
能力：回测分四步，选要测的配置，数据收集器下载历史数据，启动回测，看报告；报告看策略收益、市均收益、单币收益与起止组合；回测只用过去数据，调参别只在一个区间调到最优，要找多数区间都过得去的设置。
引用：“identify the best settings for your traded markets”

### ok.57 回测与实盘同一套执行代码但有三处不同

来源：https://oss.octobot.online/guides/octobot-usage/backtesting 第 163 行
能力：回测跑策略用的执行代码与实盘同一套，输入数据相同结果就相同；但回测只有完整 K 线，实时评估器跑法不同，非 K 线数据例如社媒热度的策略回测跑不了；成交精度可用短周期数据提高，但回测会更慢。
引用：“the same code to execute a trading strategy”

### ok.58 历史数据优先选完整历史交易所加时间范围

来源：https://oss.octobot.online/guides/octobot-usage/backtesting 第 80 行
能力：下载历史数据时优先选支持完整历史的交易所并框定时间范围，这样每个周期每根 K 线都齐；不支持的交易所只能下到最近约 500 根 K 线，短周期与长周期混下会让回测只覆盖很短时间。
引用：“Only the most recent candles will be downloaded”

## 风控与仓位管理

### ok.59 止损是含手续费的比例底线

来源：freqtrade/docs/stoploss.md 第 3 行
能力：stoploss 写成亏损比例，例如负 0.10 表示亏 10% 就卖；止损计算含手续费，负 10% 的止损就精确放在入场价下方 10% 的位置；止损值可在策略或配置里设，配置会覆盖策略。
引用：“loss as ratio that should trigger a sale”

### ok.60 追踪止损三档

来源：freqtrade/docs/stoploss.md 第 295 行
能力：基础追踪止损跟最高价走，止损位始终是最高价下方固定比例；盈利后可换更紧的正向追踪止损，用 trailing_stop_positive_offset 设启动位置，并保证该值低于最小 ROI，否则 ROI 会先触发。
引用：“of the highest observed price”

### ok.61 止损挂交易所市价优先

来源：freqtrade/docs/stoploss.md 第 106 行
能力：stoploss_on_exchange 为真时，入场单成交后立刻在交易所挂止损单，机器人断线也不丢保护；追踪止损上移时自动撤旧单挂新单；止损市价单优先于限价单，崩盘时要的是立刻出场而不是等回弹。
引用：“immediately after buy order fills”

### ok.62 保护机制四件套

来源：https://www.freqtrade.io/en/2021.9/includes/protections/
能力：保护机制有四种：StoplossGuard 在窗口内止损次数超限就停手，MaxDrawdown 在回撤超限就停手，LowProfitPairs 锁住低盈利币种，CooldownPeriod 在卖出后锁住该币种一段时间；回测与超参优化里默认不开，要加 enable-protections 才生效。
引用：“Stop trading if max-drawdown is reached”

### ok.63 杠杆配强平缓冲

来源：freqtrade/docs/leverage.md 第 193 行
能力：杠杆只在期货模式下用，策略里用 leverage 回调按币种或条件返回倍数，不写就默认 1 倍；liquidation_buffer 默认 0.05，在强平价与止损之间留安全网；10 倍杠杆下 10% 的本金风险对应 1% 的价格波动，止损要按本金风险算。
引用：“safety net to place between the liquidation price”

### ok.64 触发单

来源：https://docs.ccxt.com/docs/manual 第 6367 行
能力：价到触发价才激活成市价或限价单，用 triggerPrice 参数实现，下单前先查 features 确认该所支持，个别所还要补 triggerDirection 指明向上或向下触发。
引用：“the order is activated as”

### ok.65 止损单

来源：https://docs.ccxt.com/docs/manual 第 6506 行
能力：止损单是带方向的触发单，多单跌破止损价卖出，空单涨破止损价买回，传 stopLossPrice 后方向由库自动算，不用自己填 triggerDirection。
引用：“Stop Loss orders are activated when the price”

### ok.66 止盈单

来源：https://docs.ccxt.com/docs/manual 第 6610 行
能力：止盈单与止损单同理反方向，多单涨破止盈价卖出，空单跌破止盈价买回，传 takeProfitPrice 即可，市价或限价执行二选一。
引用：“Take Profit orders are activated when the price”

### ok.67 主单挂止损止盈

来源：https://docs.ccxt.com/docs/manual 第 6635 行
能力：开仓单可同时附 stopLoss 与 takeProfit 对象，附单数量默认与主单相同方向相反，主单没成交附单不触发；所不支持附单时，改成开仓后立刻另下一单止损止盈。
引用：“conditional on the primary order being executed”

### ok.68 杠杆、保证金与持仓模式

来源：https://docs.ccxt.com/exchanges/okx 第 1702 行
能力：合约下单前先定杠杆、保证金模式与持仓模式，OKX 用 setLeverage、setMarginMode、setPositionMode，逐仓全仓在 createOrder 的 marginMode 参数里定，单向双向用 positionSide 或 hedged 参数定。
引用：“set the level of leverage for a market”

### ok.69 开仓即定出场条件

来源：https://hummingbot.org/strategies/v2-strategies/executors/positionexecutor/ 第 52 行至第 56 行
能力：每笔仓位开仓前就定好止盈，止损与持有时间三条出场线，哪条先触发就按哪条离场，开仓后不再临时改条件，条件要写进配置里随仓位一起走。
引用：“exit conditions already decided”

### ok.70 三重屏障加移动止损管单笔仓位

来源：https://hummingbot.org/strategies/v2-strategies/executors/positionexecutor/ 第 5 行至第 6 行
能力：用止损，止盈，时间上限与移动止损四项管一笔仓位，止损防大亏，止盈锁定目标，时间上限强制关闭长期不走的仓位，移动止损在盈利后跟随价格上移，开仓前四项都要有数值，不要只设止盈不设止损。
引用：“take profit, time limit, and trailing stop”

### ok.71 按单笔风险百分比算下单量

来源：https://docs.jesse.trade/docs/utils 第 326 行
能力：下单量不按固定金额算，按每笔愿意亏的资金百分比算，传资金、风险百分比、入场价与止损价给 risk_to_qty，止损越近量越大，止损越远量越小，每笔最大亏损先锁死。
引用：“based on the percentage of the capital”

### ok.72 止损价按最大允许风险百分比封顶

来源：https://docs.jesse.trade/docs/utils 第 225 行
能力：止损价不能随手放，用 limit_stop_loss 按最大允许风险百分比封顶，传进场价、止损价、方向与最大允许风险百分比，算出的止损价保证价格反向走的幅度不超过预设风险。
引用：“according to the max allowed risk percentage”

### ok.73 仓位算手续费止损亏的钱正好等于预设风险

来源：https://docs.jesse.trade/docs/utils 第 397 行（jesse（js.07 与 js.21 合并））
能力：回测与实盘的仓位计算都要传手续费率，手续费率按交易所实际费率取，例如币安现货费率是千分之一；进场与出场两次手续费都算在内，仓位会相应变小，止损越紧缩得越多；止损触发时的亏损正好等于预设的风险百分比，不传手续费率会亏超。
引用：“loses exactly the percentage you chose to risk”

### ok.74 现货合约杠杆做空都要显式声明

来源：https://github.com/jesse-ai/jesse README 渲染第 212 行
能力：策略要声明做现货还是合约、杠杆倍数与保证金模式，框架对杠杆交易与做空是一等支持，做空用 should_short 与 go_short，与做多对称写，止盈止损方向反过来。
引用：“leveraged trading and short-selling”

### ok.75 入场后自动挂止盈止损可分批出场

来源：https://www.octobot.cloud/en/guides/octobot-trading-modes/dca-trading-mode 第 14 行
能力：每笔入场成交后自动挂一笔或多笔止盈单与止损单，出场可拆成多笔不同价格，入场金额在各出场单之间平均分配；入场可用市价单或限价单，限价单按百分比价差算挂单价。
引用：“take profit orders after each entry”

### ok.76 单币持仓上限防越买越重

来源：https://www.octobot.cloud/en/guides/octobot-trading-modes/dca-trading-mode 第 54 行
能力：给每个币设持仓占组合总值的上限，例如 30%，持仓占比超过上限就不再买入该币；多币组合里用这条防止某个币越跌越买，最后占满整个组合。
引用：“Max asset holding”

## 自动下单执行与订单管理

### ok.77 订单类型分工

来源：freqtrade/docs/stoploss.md 第 196 行
能力：订单类型分工写在 order_types 里：入场与出场用限价，止损用市价，紧急出场用市价兜底；交易所只支持一种止损类型时要按交易所能力配，否则机器人启动失败。
引用：“"entry": "limit"”

### ok.78 强制出场与远程控制

来源：freqtrade/README.md Telegram 一节（GitHub 主页第 420 行）
能力：forceexit 不管最小 ROI 立刻出场，Telegram 或接口都能发；Telegram 还能 start、stop、stopentry、status、profit、balance、daily，查看持仓与盈亏；Telegram 不是必选项，WebUI 也能管机器人。
引用：“Instantly exits the given trade”

### ok.79 仓位规模三参数

来源：https://www.freqtrade.io/en/2021.9/configuration/
能力：仓位规模由三个参数定：max_open_trades 定同时开几单，stake_amount 定每单用多少，stake_currency 定用什么币；stake_amount 设为 unlimited 时按余额除以剩余空位数分，早期盈利会让后面每单变大。
引用：“Number of open trades your bot is allowed to have”

### ok.80 白名单黑名单与动态名单

来源：https://www.freqtrade.io/en/2022.2/includes/pairlists/
能力：币种名单用处理链拼：StaticPairList 用白名单，VolumePairList 按成交量取前 N 个，黑名单支持通配写法排除杠杆代币；失效市场与黑名单币种总会被去掉；名单配好先用 test-pairlist 验。
引用：“are always removed from the resulting pairlist”

### ok.81 FreqAI 自训练

来源：freqtrade/README.md 第 283 行
能力：FreqAI 是自训练预测层，策略按新到的数据自训练，让模型跟上市场变化；先把普通策略骨架跑通再叠加 FreqAI，不要一上来就靠模型替策略拿主意。
引用：“Build a smart strategy with FreqAI”

### ok.82 createOrder 六参

来源：https://docs.ccxt.com/docs/manual 第 6009 行
能力：下单只传六个参数，交易对、类型、方向、数量、价格、扩展参数，扩展参数放各所特有的东西，市价单的价格可不传，扩展参数跨所不通用。
引用：“createOrder (symbol, type, side, amount, price”

### ok.83 限价单

来源：https://docs.ccxt.com/docs/manual 第 6108 行
能力：限价单挂在盘口等对手来吃，只在市价触到限定价才成交，可能只成交一部分，急着成交不要用限价。
引用：“Limit orders may not be fully filled”

### ok.84 市价单与按成本买入

来源：https://docs.ccxt.com/docs/manual 第 6211 行
能力：市价单按盘口最优价立即成交，部分所的市价买单要按花多少钱来下，用 cost 或价格乘数量算总成本，OKX 可直接用 createMarketBuyOrderWithCost 与 createMarketSellOrderWithCost。
引用：“how much quote currency you want to spend”

### ok.85 滑点与多档成交

来源：https://docs.ccxt.com/docs/manual 第 6152 行
能力：市价单成交价可能偏离下单时看到的价格，大单会连续吃掉盘口多档，成交均价是多档的混合价，下单前先看盘口深度再定数量。
引用：“a slight change of the price for the traded market”

### ok.86 限价模拟市价与小额先试

来源：https://docs.ccxt.com/docs/manual 第 6343 行
能力：所不支持市价单时，用极低价限价卖或极高价限价买来模拟市价成交，波动大有风险，先拿最小量在网页端试一次，确认成交价符合预期再上自动。
引用：“ALWAYS test it with a small amount first”

### ok.87 批量下单

来源：https://docs.ccxt.com/docs/manual 第 6015 行
能力：一批单一次发 createOrders，列表里每单自带交易对、类型、方向、数量、价格与扩展参数，OKX 的 features 会标批量上限，超限先拆批。
引用：“createOrders (orders, params = {})”

### ok.88 改单撤单与死手开关

来源：https://docs.ccxt.com/exchanges/okx 第 967 行
能力：改单用 editOrder，撤单用 cancelOrder，批量撤用 cancelOrders，多交易对撤用 cancelOrdersForSymbols，OKX 还有 cancelAllOrdersAfter，设好超时自动全撤，防程序失联后订单裸奔。
引用：“cancel all orders after the given timeout”

### ok.89 订单跟踪与成交对账

来源：https://docs.ccxt.com/docs/manual 第 6004 行
能力：createOrder 返回的订单至少带 id 与原始响应 info，拿 id 查 fetchOrder；开单查 fetchOpenOrders，历史查 fetchClosedOrders 与 fetchCanceledOrders，实际成交查 fetchMyTrades 与 fetchOrderTrades。
引用：“query the status and the state of the order”

### ok.90 执行器管一单完整生命周期

来源：https://github.com/hummingbot/hummingbot/blob/HEAD/README.md 第 157 行至第 158 行
能力：把下单，持仓，撤单，平仓拆成执行器，每个执行器只管一种模式的一单完整生命周期，控制器只负责在合适时机创建执行器并传参数，出问题先看是哪个执行器停在哪一步，不要把全部逻辑塞进一个大策略。
引用：“manage order lifecycles for common patterns”

### ok.91 大单拆分执行降冲击

来源：https://github.com/hummingbot/hummingbot/blob/HEAD/README.md 第 157 行
能力：大额买卖不要一次下单，按 TWAP，网格，定投与套利等执行器分批执行，先定总数量，总时长与每批间隔，市价模式求快但冲击大，限价模式冲击小但可能成交不完，按流动性选模式并留好未成交的补单方案。
引用：“position, DCA, grid, arbitrage, XEMM, TWAP, and LP”

### ok.92 智能下单按价格关系选单型

来源：https://docs.jesse.trade/docs/strategies/entering-and-exiting 第 105 行
能力：下单不用自己指定单型，只给入场价，入场价等于现价走市价单，低于现价走限价单，高于现价走止损单，框架按价格与现价的关系自动选单。
引用：“MARKET order: if entry_price == current_price”

### ok.93 多点分批入场与分批止盈

来源：https://docs.jesse.trade/docs/strategies/entering-and-exiting 第 200 行
能力：入场与出场不必一次完成，把单个数量价格对换成数量价格对的列表，就能在多个价位分批入场或分批止盈，例如一半仓位在一个目标价止盈，另一半在更高目标价止盈。
引用：“take-profit at two points”

### ok.94 未成交入场单要设取消条件

来源：https://docs.jesse.trade/docs/strategies/entering-and-exiting 第 149 行
能力：限价单与止损单入场可能等很久才成交，用 should_cancel_entry 判断已提交未成交的入场单是否还有效，例如价格反向走了就取消旧单，按新 K 线的高点重新下单，取消只影响入场单，不动止盈止损单。
引用：“should it be canceled”

### ok.95 持仓中动态改出场点或加仓

来源：https://docs.jesse.trade/docs/strategies/entering-and-exiting 第 275 行
能力：入场时不知道出场价的趋势策略，用 update_position 在持仓期间每根 K 线更新出场点，例如做移动止盈、条件平仓，或在浮盈超过百分之五且指标超卖时加倍仓位，收盘前减仓也要在这里做。
引用：“If your strategy exits dynamically”

### ok.96 节点跑多策略浏览器不用常开

来源：https://www.octobot.cloud/en/guides/octobot 第 29 行
能力：新版默认节点模式，一台机器上可同时跑多个自动化，例如 DCA、网格、篮子与 TradingView 各跑一个，全组合在一个面板里看；节点在自己电脑上执行策略，浏览器或手机 App 只用来查看与开关，不用一直开着。
引用：“do not need to keep the browser tab”

## 统一 API 与 OKX 接入

### ok.97 OKX 配 passphrase 三件套

来源：https://www.freqtrade.io/en/2026.3/exchanges/ 第 451 行
能力：OKX 每个 API 密钥都要配 passphrase，配置里 exchange.name 写 okx，key、secret、password 三件套一起填，password 就是建密钥时设的 passphrase；配好先跑 Dry-Run 验连通。
引用：“OKX requires a passphrase for each api key”

### ok.98 OKX 与 MyOKX 别写错

来源：https://www.freqtrade.io/en/2026.3/exchanges/ 第 471 行
能力：在 my.okx.com 注册的号要用 myokx 做交易所名，写成 okx 会报 50119，提示 API 密钥不存在；两个站是分开的实体，密钥不能混用。
引用：“use `"myokx"` as the exchange name”

### ok.99 OKX 数据上限与期货注意点

来源：https://www.freqtrade.io/en/2026.3/exchanges/ 第 477 行
能力：OKX 每次调用只给 100 根 K 线，回测数据量天然偏少；期货 MARK K 线只有约 3 个月，往前回测资金费算不准会有偏差；期货持仓模式分 Buy/Sell 与多空对冲两种，推荐 Buy/Sell，中途换模式会报错下单失败。
引用：“OKX only provides 100 candles per api call”

### ok.100 换所只换一行

来源：https://github.com/ccxt/ccxt README
能力：实例化时只改交易所类名，其余调用全部不变，同一套代码可在 OKX 与其他上百家交易所之间切换，不用为每家所重写接入层。
引用：“A unified trading API with more than 100”

### ok.101 公私两层统一 API

来源：https://docs.ccxt.com/docs/manual 第 5 行
能力：所有交易所都继承同一个基类，共用同一套方法名，公开方法读行情，私有方法做交易与查账户，换所不用重学接口。
引用：“share a set of common methods”

### ok.102 统一交易对符号

来源：https://docs.ccxt.com/docs/manual 第 2068 行
能力：下单与查行情都用 BTC/USDT 这类统一符号，不用记各所不同的市场编号，符号跨所通用，适合多所比价与套利。
引用：“Symbols are common across exchanges”

### ok.103 先查 has 与 features 再调

来源：https://docs.ccxt.com/docs/manual 第 549 行
能力：动手前先读 exchange.has 与 exchange.features，看目标方法与触发价、止损价、保证金模式等子能力是否支持，不支持就换写法或换所，不要先发单再等报错。
引用：“what methods and functionalities are supported”

### ok.104 先 loadMarkets 再调用

来源：https://docs.ccxt.com/docs/manual 第 1951 行
能力：下单、格式化精度、查市场之前先调 loadMarkets 并等它返回；不调它首次调用会自动多发一次市场请求，又慢又多占限流。
引用：“load the list of markets”

### ok.105 精度与限额分开算

来源：https://docs.ccxt.com/docs/manual 第 1728 行
能力：精度管小数位数，限额管最小与最大下单量，两者互不相等，下单前分开核对，不要拿精度值当最小下单量。
引用：“Precision has nothing to do with min limits”

### ok.106 下单前六项校验

来源：https://docs.ccxt.com/docs/manual 第 1801 行
能力：数量、价格、成本各看上下限，数量精度与价格精度各看上限，六项全过才发单；有交易所不提供限额信息，缺项时先按最小量试单。
引用：“stay within all limits and precision”

### ok.107 精度格式化四方法

来源：https://docs.ccxt.com/docs/manual 第 1879 行
能力：下单前用 amountToPrecision、priceToPrecision、costToPrecision、currencyToPrecision 按该所规则格式化数值，格式化前必须先 loadMarkets，否则取不到该所的精度规则。
引用：“Make sure to load the markets with”

### ok.108 合约张数换算

来源：https://docs.ccxt.com/docs/manual 第 6082 行
能力：合约市场 amount 填的是张数不是币数，先读 market 的 contractSize，用想交易的币数除以 contractSize 得张数，再把张数传给 createOrder。
引用：“Each contract is worth a certain amount”

### ok.109 公共行情免鉴权

来源：https://docs.ccxt.com/docs/manual 第 2507 行
能力：只看行情不用注册也不用配密钥，直接调公开方法拿 ticker、盘口、成交与 K 线，私有操作才要密钥。
引用：“does not require any authentication whatsoever”

### ok.110 WebSocket 订阅行情与私有流

来源：https://docs.ccxt.com/docs/manual 第 86 行
能力：高频行情与订单回报走 CCXT Pro 的 watch 方法，OKX 支持 watchTicker、watchOrderBook、watchTrades、watchOHLCV、watchOrders、watchBalance、watchPositions、watchMyTrades，私有流要先配好密钥再订阅。
引用：“WebSocket implementations are available in CCXT”

### ok.111 标记价、资金费率与手续费

来源：https://docs.ccxt.com/exchanges/okx 第 424 行
能力：合约看标记价与资金费率不用自己算，OKX 有 fetchMarkPrice、fetchMarkPrices、fetchFundingRate、fetchFundingRates、fetchFundingRateHistory 与 watchFundingRate；手续费先查 fetchTradingFee，但手册提示费率信息是实验性的，仅供参考。
引用：“fetches mark price for the market”

### ok.112 OKX 现货与永续双连接器

来源：https://hummingbot.org/exchanges/okx/ 第 18 行至第 20 行
能力：OKX 在 Hummingbot 里分两个连接器，现货连接器编号 okx，永续连接器编号 okx_perpetual，两者都是 v2.1 且都支持 V2 策略，做现货做市用 okx，做永续做市与对冲用 okx_perpetual，不要混用编号。
引用：“okx, okx_perpetual”

### ok.113 OKX 接入要三件套密钥

来源：https://hummingbot.org/exchanges/okx/ 第 60 行至第 64 行
能力：在 OKX 账号里建 API 密钥后，在 Hummingbot 内运行 connect okx，按提示依次填 API 密钥，密钥口令与 passphrase，三项缺一不可，连接成功会提示已连接，失败先核对三项是否抄错或权限不对。
引用：“Enter your okx API key”

### ok.114 OKX 永续先切单币种保证金并查持仓再重启

来源：https://hummingbot.org/exchanges/okx/ 第 122 行
能力：接 OKX 永续前先在 OKX 账号设置里切到单币种保证金模式，多币种保证金模式可能导致连接或下单失败，每次启动都会重设持仓模式，重启前先查有无未平永续仓位，有仓位先平掉再重启。
引用：“Single-currency margin mode”

### ok.115 OKX 不在回测与实盘支持名单里

来源：https://docs.jesse.trade/docs/supported-exchanges/ 第 10 行
能力：选交易所前先查官方支持名单，Jesse 回测支持的 K 线来源与实盘支持的交易所是两张不同名单，两张名单里都没有 OKX，OKX 行情不能直接导入回测，OKX 账户也不能直连下单，要用 Jesse 只能换名单里的交易所。
引用：“importing candles and running backtests”

### ok.116 OKX 在官方支持名单里但未写现货合约明细

来源：https://github.com/Drakkar-Software/OctoBot README 第 356 行
能力：官方 README 把 OKX 列进支持交易所名单，与币安、Coinbase、Hyperliquid 等同属 15 家以上之列，交易所接入走 CCXT 库；README 没有写 OKX 是现货还是合约，也没有写 OKX 的 API 密钥权限要求，用之前要去官方交易所总表页再核一遍。
引用：“Many other such as OKX”

## 密钥安全实盘演练与容错

### ok.117 先 Dry-Run 再实盘

来源：freqtrade/README.md 第 196 行
能力：默认 dry_run 为真，先用模拟资金跑 Dry-Run，dry_run_wallet 可改模拟钱包金额；切实盘要把 dry_run 改成 false，并核对数据库地址；没跑过模拟盘不要直接上真钱。
引用：“Always start by running a trading bot in Dry-Run”

### ok.118 回测代替不了 Dry-Run

来源：freqtrade/README.md 第 198 行
能力：回测只看 K 线内发生的事，K 线内先涨后跌还是先跌后涨无法从 OHLCV 得知，所以回测代替不了 Dry-Run；回测赚钱也要先跑一段 Dry-Run，看真实成交与滑点再定。
引用：“before you understand how it works”

### ok.119 机器人独占账户与时钟准确

来源：freqtrade/docs/leverage.md 第 5 行
能力：杠杆模式下机器人默认独占账户，两个机器人共用一个账户会算错强平价；跨保证金下所有仓位共用保证金，一个仓位亏钱会拉近别的仓位的强平价；机器人所在机器的时钟要常对 NTP，否则与交易所通信会出问题。
引用：“the only user of the account”

### ok.120 沙盒切换与密钥隔离

来源：https://docs.ccxt.com/docs/manual 第 776 行
能力：建好实例后第一件事调 setSandboxMode(true)，再用沙盒站单独注册的密钥练手，沙盒里只有虚拟资产，沙盒密钥与实盘密钥绝不混用。
引用：“trade virtual money for free”

### ok.121 密钥四件套与签名

来源：https://docs.ccxt.com/docs/manual 第 5198 行
能力：交易要配 apiKey 与 secret，个别所还要 uid 与 password，库自动走生成 nonce、序列化参数、HMAC 签名、把签名放请求头或请求体的流程，不用手写签名。
引用：“Sign the serialized params using HMAC”

### ok.122 密钥保管与复用禁忌

来源：https://docs.ccxt.com/docs/manual 第 5208 行
能力：密钥只放仅本人可读的配置文件，不发给别人不贴到网上；同一套密钥不要多实例、多线程、多软件共用，nonce 冲突会报 InvalidNonce，换新密钥最省事。
引用：“DO NOT REUSE API KEYS WITH DIFFERENT SOFTWARE”

### ok.123 限流器与实例复用

来源：https://docs.ccxt.com/docs/manual 第 970 行
能力：内置限流器默认开启，按 rateLimit 毫秒数排队发请求，不要关；同一所全程复用一个实例，反复新建实例会重置限流器并反复拉市场数据，最容易被封。
引用：“leave the built-in rate limiter enabled”

### ok.124 错误两大家族与超时对账

来源：https://docs.ccxt.com/docs/manual 第 10251 行
能力：报错分两大家族，可重试的 OperationFailed 包括网络、超时、限流、维护，重试也白搭的 ExchangeError 包括参数错、权限错、余额不足；下单超时后结果未知，先查 fetchOpenOrders 与 fetchClosedOrders，再查 fetchBalance 看钱变没变，不要凭猜测重下一单。
引用：“Such exceptions are temporary”

### ok.125 V2 控制器运行中调参

来源：https://github.com/hummingbot/hummingbot/blob/HEAD/README.md 第 90 行至第 91 行
能力：实盘用 pmm_mister 这类可复用的 V2 控制器，配置可回测，可部署，运行中可调参数，调参先在小资金上验证一轮，确认成交与库存变化符合预期再放大，不要边跑边大幅改价差与仓位。
引用：“settings can be tuned live while the bot runs”

### ok.126 纸面交易先跑再实盘

来源：https://github.com/hummingbot/hummingbot/blob/HEAD/README.md 第 74 行
能力：先用纸面交易连接器对着真实行情模拟交易，不用填真实 API 密钥，例如 simple_pmm 配 binance_paper_trade 跑 BTC-USDT，验证挂单，成交与库存变化都正常后再接实盘，纸面跑通不等于实盘一定盈利。
引用：“simulates trading against live Binance market data”

### ok.127 密钥放加密密钥库

来源：https://github.com/hummingbot/hummingbot/blob/HEAD/README.md 第 71 行至第 72 行
能力：首次使用先设密钥库密码，交易所 API 密钥存在加密密钥库里，非交互运行时用环境变量或标准输入传密码，不要把密钥写进配置文件或聊天记录，密码丢失则库内密钥无法恢复。
引用：“encrypts your exchange API keys”

### ok.128 V1 策略不再维护要避坑

来源：https://hummingbot.org/strategies/v1-strategies/ 第 4 行至第 5 行
能力：基金会已把精力转到 V2 框架，V1 模板不再积极维护，新策略优先用脚本，控制器与执行器这套 V2 路线，沿用 V1 时先确认该策略仍有人维护且与当前版本兼容，不要把无人维护的 V1 策略当长期实盘主力。
引用：“actively maintaining the V1 strategy templates”

### ok.129 实盘与模拟盘走官方插件加许可证

来源：https://docs.jesse.trade/docs/livetrade.html 第 2 行
能力：回测在开源核心里免费跑，实盘与模拟盘功能走官方插件，先在官网注册生成许可证密钥，写进项目 env 文件的 LICENSE_API_TOKEN，再装插件，原生环境跑一条安装命令即可。
引用：“via an official plugin”

### ok.130 模拟盘先跑通再动真金

来源：https://docs.jesse.trade/docs/livetrade.html 第 20 行
能力：实盘前的演练顺序是回测、模拟盘、实盘，模拟盘在仪表盘 Live 页打开 Paper Trade 开关，用实时行情与模拟资金跑同一套策略，验证实时数据处理与下单逻辑，不动真金。
引用：“test-drive a strategy without risking real money”

### ok.131 真实账户余额与手续费以交易所为准

来源：https://docs.jesse.trade/docs/livetrade.html 第 14 行
能力：模拟盘的起始资金与手续费在会话设置里自己填，真实账户的余额与手续费由交易所返回，会话设置里只看杠杆、热身 K 线与路由，实盘不要用回测里的模拟资金数去对账。
引用：“those come from the exchange”

### ok.132 实盘三级演练回测模拟盘再实盘

来源：https://github.com/Drakkar-Software/OctoBot README 第 298 行
能力：上手顺序固定为三级，先回测看历史表现，再开模拟盘用虚拟资金跑实时行情，最后才接真实交易所账号自动下单；模拟盘不用交易所密钥，实盘才需要填密钥。
引用：“Live test it with paper money”

### ok.133 密钥自托管先模拟再实盘

来源：https://github.com/Drakkar-Software/OctoBot README 第 286 行与第 485 行
能力：自托管是基本盘，密钥只留在自己设备上不交给平台，资金始终留在自己的交易所账号里；官方免责要求先在模拟模式跑，搞懂机制与预期盈亏之后再动真钱，亏不起的钱不要拿来跑。
引用：“your keys never leave your devices”

## 半导体杠杆 ETF 测算与输出

### ok.134 测算必须用多日数据不只看一两天

来源：用户 2026-11-24 实盘教训，SOXS 测算只看一天数据被纠正
能力：给任何标的算买卖价之前，必须拉至少 7 天、最好 30 天的日线数据，看这段时间内的最高价、最低价、收盘价、支撑位、阻力位；只看 1 到 2 天数据就给价是错的，必须用多日数据算出区间再给价；支撑位取多日最低价附近，阻力位取多日最高价附近，止盈取最近到过的最高价，止损取最近到过的最低价下方。
引用：“只算一天的数据跟我玩来了”

### ok.135 测算前必须主动查新闻

来源：用户 2026-11-24 实盘教训，DOGE 测算没查新闻被纠正
能力：给任何标的算买卖价之前，必须主动搜最近的新闻，看有没有影响价格的大事（财报、CEO 变动、政策、市场恐慌指数、资金流向、ETF 流入流出）；只看价格不看新闻就给价是错的，必须把新闻里的支撑阻力、趋势方向、市场情绪写进测算里；新闻说趋势往下就别给做多价，新闻说极度恐惧就别给高止盈。
引用：“新闻数据好像也不是主动查”

### ok.136 半导体单必须输出委托价止盈止损

来源：用户 2026-11-24 实盘要求，只玩 SOXS 半导体
能力：给 SOXS 半导体单算价时，输出必须一次给全：委托买入价、止盈价、止损价、杠杆倍数、本金、预期盈利、预期亏损；委托买入价取 50 天均线或多日低点附近，止盈取最近到过的最高价，止损取委托价下方 4% 到 5% 处，杠杆最高 20 倍（25 倍会先爆仓再触发止损），预期盈利按（止盈减委托价）除以委托价乘杠杆乘本金算，预期亏损按（委托价减止损价）除以委托价乘杠杆乘本金算；只给一个价不给全套输出是错的，用户只玩半导体就只按这个格式出。
引用：“委托价格或者是止盈止损价格”

## 强制执行流程与防瞎编

### ok.137 强制执行流程一步都不许跳

来源：用户 2026-11-24 要求，别的软件调用技能时必须按流程执行
能力：每次调用技能算买卖价，必须按五步走，一步都不许跳：第 1 步先拉 30 天日线数据，拉不到就停下来，说算不了，不许瞎编；第 2 步再搜最近 7 天新闻加趋势新闻，不搜不许算；第 3 步用 30 天最高最低价算支撑阻力；第 4 步算止盈止损杠杆盈亏；第 5 步按固定格式输出；跳了任何一步就等于没执行。
引用：“按照这样开始执行”

### ok.138 数据必须标注来源

来源：用户 2026-11-24 要求，别的软件调用技能时必须按流程执行
能力：每个价格、每个百分比都必须写来源是哪个网站、哪天的数据；要是估计的数，必须写“估计”两个字，不许当成真数给出来。
引用：“估计”

### ok.139 禁止瞎编

来源：用户 2026-11-24 要求，别的软件调用技能时必须按流程执行
能力：拉不到数据就不许算，直接说“数据拉不到，算不了”；查不到新闻就不许编，直接说“没查到新闻”；宁可不算，也不许编个数糊弄人。
引用：“宁可不算，也不许编个数糊弄人”
