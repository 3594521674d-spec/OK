# 足球比分预测技能包

来源库：ProphitBet-Soccer-Bets-Predictor 604 星 MIT、FBP 440 星许可证未声明、Football_Prediction_Project 321 星 MIT、Bet-on-Sibyl 288 星 GPL、sports-skills 273 星 MIT，查时 2026-11-24。
提炼范围：只读文档，不读代码，不运行仓库代码，不对真实比赛下注；FBP 的 README 只有一句话，方法细节取自其 Advantages 文件；GoogleCloudPlatform 的 ipython-soccer-predictions 虽有 486 星，但已归档停更，是 2014 世界杯演示笔记本，不是比分预测与投注系统，本次不取，改取 sports-skills（273 星，含足球数据与预测市场）。
最终能力 84 条，分 8 个方向。每条能力配一条原文引用，引用为原文逐字连续子串，不超过 50 字。
注意：比分概率一节用的泊松分布与 Dixon-Coles 修正是领域标准方法，是 sports-skills 的 get_match_forecast 这类胜平负加比分预测背后的统计模型；五库的 README 里没有逐行写出泊松公式，这里按标准方法转述。FBP 自称准确率 80% 左右，是作者自述，未经独立验证。所有预测只做分析参考，不构成投注建议；按 sports-skills 的约定，默认只读不下单。

## 能力索引

- 数据与特征：fb.01 至 fb.10，共 10 条
- 球队实力评估：fb.11 至 fb.20，共 10 条
- 预期进球 xG 建模：fb.21 至 fb.30，共 10 条
- 比分概率与泊松模型：fb.31 至 fb.40，共 10 条
- 赔率与市场解读：fb.41 至 fb.52，共 12 条
- 状态、伤病、主场与战意：fb.53 至 fb.62，共 10 条
- 比分策略与投注决策：fb.63 至 fb.74，共 12 条
- 回测、评估与风控：fb.75 至 fb.84，共 10 条

## 数据与特征

### fb.01 数据源用 API 每日刷新

来源：Football_Prediction_Project README.md 第 166 行
能力：不要用网上找来的静态数据库，用 API 每天拉最新比赛数据与赛程，模型始终在最新数据上重训。API 同时给历史比赛与未来赛程，没有未来赛程就做不了预测。
引用：“can be made daily, refreshing the database”

### fb.02 特征取近 10 场均值

来源：Football_Prediction_Project README.md 第 182 行
能力：为了一场未赛的比赛做预测，把每支球队过去 10 场比赛的数据取平均，既用了足够多的历史，又不至于被太久以前的阵容拖累。场次数太少噪声大，太多则状态过时。
引用：“averaged over the previous 10 games”

### fb.03 差值特征是核心做法

来源：Football_Prediction_Project README.md 第 183 行
能力：不要直接用两队各自的绝对数值，把主队平均数据减去客队平均数据，做成差值特征，例如射门数差值为 2 表示主队近 10 场平均每场比客队多射 2 次。差值直接刻画两队相对强弱，模型更容易学。
引用：“to produce a difference metric”

### fb.04 比率特征看相对强弱

来源：Bet-on-Sibyl README.md 第 193 行
能力：比率型指标（场均得分、传球成功率这类）用主队数值除以客队数值，比值大于 1 表示主队在这项上更强，小于 1 表示更弱。整数型指标（连胜场次这类）用差值不用比值。两种做法按指标类型分开，不要混用。
引用：“the ratio or the difference between”

### fb.05 七类差值特征清单

来源：Football_Prediction_Project README.md 第 187 行
能力：预测一场胜平负，至少备齐七类差值特征：净胜球差、射门差、禁区内射门差、控球率差、传球成功率差、角球差、犯规差。单支球队七个特征，一场比赛两队就是十四个特征。先把这七类取齐，再考虑加别的。
引用：“Shots Inside The Box Difference”

### fb.06 犯规差基本没用

来源：Football_Prediction_Project README.md 第 202 行
能力：七类差值特征里，犯规差与比赛结果几乎没有相关性，留着它只会给模型加噪声。做特征筛选时先看每类特征与结果的相关性，不相关的直接去掉，不要舍不得。
引用：“little correlation with the target result”

### fb.07 数据先验完整性再进模型

来源：Bet-on-Sibyl README.md 第 219 行
能力：原始数据入库前先检查完整性与合法性，剔掉 CSV 解析错误与错误数值，脏数据不进库。数据质量问题在入口处拦住，不要留到模型结果里才发现。
引用：“completeness and validity of all the data files”

### fb.08 缺失值与冗余特征要报警

来源：ProphitBet README.md 第 632 行
能力：数据集概览要自动报警：缺失值、高度相关或冗余的特征都要标出来。缺失值多的比赛在训练时会被剔掉，高度相关的两个特征只留一个。先看报警再训模型，不要直接拿原始表开训。
引用：“highly correlated or redundant features”

### fb.09 特征选择用方差与 Boruta

来源：ProphitBet README.md 第 658 行
能力：特征选择用标准化方差与 Boruta 排序两套方法，挑出真正有信息量的特征，删掉无关特征。特征少了模型更准也更快，特征筛选是训练前的必做步骤，不是可选项。
引用：“normalized variance and Boruta rankings”

### fb.10 特征重要性要可解释

来源：ProphitBet README.md 第 668 行
能力：用线性模型系数与基尼重要性评估每个特征对赛果预测的贡献，画出来看哪些足球统计量影响最大。知道哪个特征在起作用，才能判断模型是不是在学真规律，还是在学噪声。
引用：“Gini-based feature importance”

## 球队实力评估

### fb.11 Elo 评分是实力标尺

来源：sports-skills skills/football-data/SKILL.md 第 156 行
能力：用 ClubElo 这类 Elo 评分衡量球队当前实力，两队 Elo 差直接对应胜负概率。Elo 按比赛结果每周更新，赢强队加分多，输弱队扣分多。做赛前分析先取两队 Elo 与排名，再看别的。
引用：“ClubElo, falling back to local Elo”

### fb.12 Elo 断了用本地 Elo 回落

来源：sports-skills skills/football-data/SKILL.md 第 182 行
能力：ClubElo 停服或休赛期查不到球队时，回落到本地算的 Elo，但本地 Elo 是联赛内部尺度，出了本联赛就不能横向比，跨联赛比较要拒绝。回落时先看 source 字段是不是 local-elo，再决定数字能不能用。
引用：“falls back to locally computed Elo”

### fb.13 Elo 只是第二意见

来源：sports-skills skills/football-data/SKILL.md 第 192 行
能力：Elo 模型的预测准确率不如收盘赔率，Elo 的价值是发现它与赔率不一致的地方，而不是替代赔率。先以赔率为基线，再用 Elo 找分歧，分歧处才值得深挖。
引用：“Treat odds as the stronger baseline”

### fb.14 联赛排名与场均分补实力上下文

来源：Football_Prediction_Project README.md 第 266 行
能力：只看近 10 场状态的模型缺上下文，要补俱乐部规模与质量特征：场均得分、当前联赛排名、过去几个赛季的联赛排名。状态是短期的，排名与场均分是长期的，两者结合才完整。
引用：“average points per game, current league position”

### fb.15 球队表现画时间线

来源：ProphitBet README.md 第 688 行
能力：把球队历史表现画成时间线：赛季趋势、累计统计、实际结果与预期结果的对比。单看一场的数据看不出趋势，时间线能看出球队是在上升、平稳还是下滑，以及模型对这支球队准不准。
引用：“seasonal trends, cumulative statistics”

### fb.16 主客分开算实力

来源：Bet-on-Sibyl README.md 第 186 行
能力：两队用主队与客队身份表示，不用热门与冷门表示。主场与客场的表现要分开算，同一支球队主场与客场的实力可以差很多。主客不分开，实力评估会把主场优势平均掉。
引用：“represented by visitor team and home team”

### fb.17 交锋历史只看同联赛

来源：sports-skills skills/football-data/SKILL.md 第 195 行
能力：交锋历史只统计两队在同一联赛里的碰面，杯赛与跨级别交手不计入。查之前先确认两队在数据库里都解析成功了，解析失败时零场交锋表示查不到，不表示从没交过手。
引用：“H2H is same-division only”

### fb.18 交锋历史要配基本面复核

来源：FBP Advantages 第 38 行
能力：程序给出预测的同时，人也要结合基本面分析，尤其是历史交锋，再把两者对比。程序与人的结论不一致时，先查原因，不要直接信任何一边。交锋历史是人工复核的第一材料。
引用：“especially the historical confrontation”

### fb.19 俱乐部规模是实力的一部分

来源：Football_Prediction_Project README.md 第 266 行
能力：球队实力不只看最近几场的数据，还要看俱乐部规模与质量：阵容身价、联赛排名、历史成绩。大俱乐部打小俱乐部，纸面实力差本身就是一个特征，不要只盯状态。
引用：“past season(s) league positions”

### fb.20 实力评估多源交叉

来源：sports-skills skills/football-data/SKILL.md 第 163 行
能力：赛前分析把多个来源拼起来用：ESPN 给赛程与比分，Understat 给 xG，ClubElo 给实力评分，football-data.co.uk 给交锋历史。哪个来源覆盖不到就跳过那块，不要因为一块缺了就整个分析不做。
引用：“add depth only in their coverage zone”

## 预期进球 xG 建模

### fb.21 xG 是每次射门的进球概率

来源：sports-skills skills/football-data/SKILL.md 第 6 行
能力：预期进球 xG 是每次射门按位置、角度、射门方式等特征算出的进球概率，一次必进球机会 xG 接近 1，一次远射 xG 接近 0。一场比赛的 xG 是全队所有射门 xG 的和，它衡量的是创造机会的质量，不是实际进了几个。
引用：“match stats, xG, transfers, player profiles”

### fb.22 xG 看趋势不看单场

来源：sports-skills skills/football-data/SKILL.md 第 334 行
能力：单场 xG 噪声很大，要看连续几场的 xG 趋势。xG 持续高于对手说明进攻体系在创造机会，xG 持续走低说明进攻出了问题。做球队深挖时，把最近几场的 xG 排成趋势再读。
引用：“xG trend across matches”

### fb.23 xG 与实际进球的差是信号

来源：ProphitBet README.md 第 688 行
能力：把实际进球与预期进球并排对比：实际进球持续高于 xG，可能是射手状态火热，也可能是运气，迟早回归；实际进球持续低于 xG，可能是运气差，也可能是终结能力弱。差值的方向与持续时间决定它是信号还是噪声。
引用：“actual and expected match outcomes”

### fb.24 xG 只覆盖五大联赛

来源：sports-skills skills/football-data/SKILL.md 第 146 行
能力：Understat 的 xG 数据只覆盖英超、西甲、德甲、意甲、法甲五大联赛，欧冠与其它联赛没有。做欧冠比赛分析时，没有 xG 就用射门数与禁区内射门数代替，不要硬找不存在的 xG。
引用：“EPL, La Liga, Bundesliga, Serie A, Ligue 1”

### fb.25 xG 数据滞后一到两天

来源：sports-skills skills/football-data/SKILL.md 第 463 行
能力：Understat 的 xG 数据在比赛结束后 24 到 48 小时才更新，刚踢完的比赛查不到 xG 是正常的，不是数据坏了。做赛前分析时，用上上场及更早的 xG，不要等最新一场。
引用：“Understat data may lag 24-48 hours”

### fb.26 射门质量比射门数重要

来源：Football_Prediction_Project README.md 第 189 行
能力：射门数要分档：总射门数与禁区内射门数是两个特征，禁区内射门更接近进球。只看总射门数会把远射多的球队高估，禁区内射门才是进攻质量的核心。
引用：“Shot Difference”

### fb.27 点球在时间线里单独记

来源：sports-skills skills/football-data/SKILL.md 第 175 行
能力：点球进球在时间线里单独记为 penalty_goal，对账比分时要把进球、点球进球、乌龙球三类加起来。点球是独立的高概率得分手段，建模与复盘时不要把它混进运动战进球里。
引用：“Count `goal` + `penalty_goal` + `own_goal`”

### fb.28 xG 差值转胜负信号

来源：Football_Prediction_Project README.md 第 183 行
能力：把两队近期 xG 取差值，主队 xG 减客队 xG，差值越大主队进攻优势越大。xG 差值与净胜球差、射门差一样，都是差值特征家族的一员，进模型前先算差值，不要直接喂绝对值。
引用：“number of shots difference”

### fb.29 xG 结合射门位置与角度

来源：sports-skills skills/football-data/SKILL.md 第 270 行
能力：xG 模型的核心输入是每次射门的位置与角度：离球门越近、角度越正，xG 越高；远射与小角度射门 xG 很低。没有逐次射门数据时，用禁区内射门数与总射门数的比例粗估机会质量。
引用：“xG data (top 5 leagues only)”

### fb.30 球员级 xG 看终结者

来源：sports-skills skills/football-data/SKILL.md 第 272 行
能力：除了球队 xG，还要看球员级 xG：哪个球员在持续获得高 xG 机会，哪个球员实际进球远超或远低于自己的 xG。射手状态与缺阵直接影响球队的预期进球，赛前要查核心射手的 xG 与伤病。
引用：“Player-level match stats with optional xG”

## 比分概率与泊松模型

### fb.31 泊松分布算比分概率

来源：领域标准方法；sports-skills skills/football-data/SKILL.md 第 268 行
能力：把主客两队的预期进球当作泊松分布的均值，主队预期进球 1.8 表示主队进球数服从均值 1.8 的泊松分布，客队同理。两个分布相乘得到每种比分的概率，拼成一张比分概率矩阵。这是把 xG 转成比分的标准方法。
引用：“ClubElo win/draw/loss + scoreline forecast”

### fb.32 Dixon-Coles 修正低比分

来源：领域标准方法；ProphitBet README.md 第 840 行
能力：纯泊松模型会低估 0 比 0、1 比 0、0 比 1、1 比 1 这类低比分的出现概率，Dixon-Coles 修正专门调高这四个格子的概率。做比分矩阵时先算泊松，再做 Dixon-Coles 修正，不修正的矩阵会系统性低估小比分。
引用：“under or over 2.5”

### fb.33 预期进球是泊松的均值

来源：领域标准方法；sports-skills skills/football-data/SKILL.md 第 207 行
能力：主队预期进球与客队预期进球分别作为两个泊松分布的均值，两个分布独立相乘。预期进球估计得越准，比分矩阵越准；预期进球估错了，后面全错。所以建模的精力要放在预期进球上，不是比分本身。
引用：“win/draw/loss + scoreline forecast”

### fb.34 比分矩阵取概率最高的格子

来源：sports-skills skills/football-data/SKILL.md 第 380 行
能力：比分矩阵算出来后，按概率从高到低排，最可能比分就是概率最高的那个格子，通常是 1 比 0、2 比 1、1 比 1、2 比 0 这类。不要只报一个比分，报概率最高的三个，附上各自的概率。
引用：“form/record + power balance + model odds”

### fb.35 胜平负概率由比分矩阵加总

来源：ProphitBet README.md 第 838 行
能力：主胜概率等于所有主队进球多于客队的比分格子概率之和，平局与客胜同理。胜平负不是直接猜的，是比分矩阵加总出来的。加总时要把矩阵里所有格子都算进去，不要只加前几名。
引用：“the home team wins, the match ends in a draw”

### fb.36 双选概率由胜平负加总

来源：ProphitBet README.md 第 844 行
能力：双选 1X 的概率等于主胜概率加平局概率，12 等于主胜加客胜，X2 等于平局加客胜。双选是把两个结果打包，概率更高但赔率更低，适合想降低风险的时候用。
引用：“P(1X) = P(1) + P(X)”

### fb.37 大小球 2.5 是总进球目标

来源：ProphitBet README.md 第 840 行
能力：除了猜胜平负，还可以猜总进球数大于或小于 2.5。大小球的概率同样由比分矩阵加总：总进球 3 个及以上的格子概率之和就是大球概率。比分难猜时，大小球是另一条路。
引用：“total number of goals will be under or over 2.5”

### fb.38 主场优势加进球期望

来源：Bet-on-Sibyl README.md 第 191 行
能力：主场球队的预期进球要加主场优势，客队预期进球要扣一点。主场优势来自球迷、场地熟悉与旅途疲劳，同一支球队主场与客场的预期进球可以差 0.3 到 0.5 个。算比分矩阵前先把主场优势加进预期进球里。
引用：“positive when the home team scores more points”

### fb.39 平局最难预测

来源：Football_Prediction_Project README.md 第 231 行
能力：平局约占全部比赛的五分之一，但模型预测平局最差，随机森林在近 300 场比赛里只猜中 5 场平局，支持向量机与最近邻猜平局时错的比对的多。平局的分布看起来接近随机，实力接近的两队也不一定平局。比分策略里不要把平局当主推。
引用：“more incorrect that correct when predicting a draw”

### fb.40 概率要校准

来源：Football_Prediction_Project README.md 第 245 行
能力：模型输出的概率要校准：说 60% 的时候，历史上这类预测应该有 60% 是对的。校准方法是把预测按概率分档，画每档里猜对与猜错的直方图。概率不准的模型，就算准确率高也不能直接拿来下注。
引用：“60% probability should be correct 60% of the time”

## 赔率与市场解读

### fb.41 赔率转隐含概率

来源：ProphitBet README.md 第 826 行
能力：赔率的倒数就是隐含概率，赔率 2.0 对应隐含概率 50%。多家赔率取平均隐含概率，叫平均隐含概率。把模型概率与隐含概率放一起比，才能看出有没有价值。
引用：“Mean Implied Probabilities (MIP) for each odd”

### fb.42 模型概率要对标庄家赔率

来源：ProphitBet README.md 第 826 行；Football_Prediction_Project README.md 第 159 行
能力：模型跑完要拿去跟庄家赔率对标，看模型是不是比庄家准。目标之一是模型输出的概率要与热门投注网站的赔率处在同一量级，差得太远说明模型有问题。跑赢庄家是模型的硬指标。
引用：“against the odd compilers”

### fb.43 庄家选择是赔率最低的那队

来源：Bet-on-Sibyl README.md 第 280 行
能力：庄家看好哪队，直接看赔率最低的那队。把庄家选择与模型选择并排写，标出两者一致还是分歧。分歧是分析的起点，一致则没有信息量。
引用：“the team with the lowest odd”

### fb.44 分歧信号是核心

来源：Bet-on-Sibyl README.md 第 282 行
能力：模型选择与庄家选择不一致时记为分歧，有分歧才值得下注，没有分歧不下注。分歧要分方向：模型看好主队而庄家看好客队，与反过来，是两种不同的信号。
引用：“a divergence or no between Sibyl and the bookmaker”

### fb.45 分歧策略定下注名单

来源：Bet-on-Sibyl README.md 第 306 行
能力：按分歧策略筛出本月最值得下注的球队与最不值得下注的球队，做成一张名单。名单每月更新，只列分歧处，不列模型与庄家一致的比赛。没有分歧的月份，名单就是空的。
引用：“based on the divergence stategy”

### fb.46 历史赔率组合迭代修正

来源：FBP Advantages 第 12 行
能力：预测模型是对历史赔率组合不断迭代修正的过程，符合机器学习反向传播的思想：用大数据里的赔率组合情况做预测，错了就修正规则。模型要持续用新数据更新，历史数据越多，准确率越稳。
引用：“correction of historical odds combination”

### fb.47 无视盘口变化

来源：FBP Advantages 第 9 行
能力：做预测时无视盘口的变化，不受操盘手影响。盘口变化可能是诱盘，也可能是真实信息，但 FBP 的做法是只看历史赔率组合的模型输出，不跟盘口走。跟盘口走等于把决策权交给庄家。
引用：“ignore the change of the plate”

### fb.48 赔率是更强基线

来源：sports-skills skills/football-data/SKILL.md 第 192 行
能力：收盘赔率是比任何模型都强的基线，模型要先赢过赔率才有价值。在 1492 场墨西哥联赛的滚动测试里，本地 Elo 猜中 50.8%，收盘赔率猜中 51.7%。不要拿模型直接当结论，先问它比赔率强在哪。
引用：“50.8% of results vs 51.7% for closing odds”

### fb.49 赔率区间过滤

来源：ProphitBet README.md 第 946 行
能力：评估模型时按赔率区间过滤，例如只看主胜赔率 1.0 到 1.30 的比赛，看模型在低赔与高赔区间的表现是不是一样。模型可能在低赔区间很准、高赔区间很差，分区间看才能知道它适合猜哪种比赛。
引用：“odd 1 from 1.0 to 1.30”

### fb.50 预测市场价格是另一路赔率

来源：sports-skills PyPI 项目页 https://pypi.org/project/sports-skills/ 第 81 行
能力：Kalshi 与 Polymarket 这类预测市场的价格就是另一路赔率，市场价格直接对应事件概率。把预测市场价格与庄家赔率、模型概率三路并排比，三路一致时信心高，三路分歧时要小心。
引用：“markets, prices, order books”

### fb.51 赔率要带来源与时效

来源：sports-skills README.md 第 134 行
能力：报赔率与市场价格时，必须带来源、新鲜度与流动性说明：赔率是哪家的、什么时候的、成交量大不大。过期赔率与低流动性市场的价格没有参考价值，报的时候不写来源等于没报。
引用：“freshness/liquidity caveats for market prices”

### fb.52 赔率组合要多家

来源：FBP Advantages 第 29 行；ProphitBet README.md 第 216 行
能力：不要只看一家赔率，要看多家主流公司的赔率组合。FBP 的 1.0 版本只考虑各大公司的赔率，2.0 才加联赛维度。模型输入是赔率组合，不是单家赔率，单家赔率容易被一家公司的定价偏差带偏。
引用：“integrates historical results and betting odds”

## 状态、伤病、主场与战意

### fb.53 近 10 场状态是基准

来源：Football_Prediction_Project README.md 第 182 行
能力：球队状态用近 10 场比赛的平均数据衡量，状态是短期指标，变化快。做赛前分析先看近 10 场，再看更长期的实力，两者不一致时要说明。
引用：“to predict an upcoming fixture”

### fb.54 状态分主客场看

来源：Bet-on-Sibyl README.md 第 186 行
能力：状态要分主场与客场看，同一支球队主场五连胜、客场五连败是完全可能的。主客不分开，状态会被平均成一个没有意义的数字。
引用：“visitor team and home team”

### fb.55 连胜连败是特征

来源：Bet-on-Sibyl README.md 第 201 行
能力：连胜与连败场次是整数型特征，用差值表示：主队连胜 3 场、客队连败 2 场，差值就是 5。连胜是状态的信号，但连胜越长，回归均值的压力越大，不要线性外推。
引用：“win streak”

### fb.56 伤病与缺阵名单

来源：sports-skills skills/football-data/SKILL.md 第 274 行
能力：赛前查缺阵名单：受伤与存疑的球员是谁，是不是主力。缺阵名单目前只有英超能查到，其它联赛查不到就跳过，不要硬编。核心射手与核心后卫缺阵，直接下调球队预期进球或上调对手预期进球。
引用：“Injured/doubtful players”

### fb.57 阵容与首发

来源：sports-skills skills/football-data/SKILL.md 第 169 行
能力：球队档案里自带当前阵容，含球员编号与年龄，赛前用它核对首发。比赛日的具体首发看阵容名单，阵容轮换大的球队，实力评估要打折。
引用：“data.players[] carries the current roster”

### fb.58 主场优势是真金白银

来源：Bet-on-Sibyl README.md 第 191 行
能力：主场球队得分期望更高，分差定义为主队得分减客队得分，主场赢球时分差为正。主场优势是系统性存在的，做预测时主场球队的预期进球与胜率都要上调，不能把主客场当成中立场地。
引用：“home team scores more points than the away team”

### fb.59 联赛所处阶段与战意是独立维度

来源：FBP Advantages 第 30 行
能力：联赛进行到哪个阶段是独立的预测维度：赛季初、争冠期、保级期、收官期，球队战意完全不同。FBP 的 3.0 版本专门加了阶段性数据做新规则。欧冠小组赛末轮，已出线与必须赢的球队，战意差就是比分差。
引用：“adds periodic data as a new predictive rule”

### fb.60 联赛维度不能省

来源：FBP Advantages 第 29 行
能力：不同联赛的风格与进球数不一样，预测要加联赛维度。FBP 的 2.0 版本在赔率之外加了联赛维度，预测能力明显提高。跨联赛比较球队时，先按联赛校准，再比实力。
引用：“adds dimension to the league”

### fb.61 欧冠双线要算赛程密度

来源：sports-skills skills/football-data/SKILL.md 第 213 行
能力：欧冠球队一周双赛，赛程密度影响体能与轮换。赛前看球队近期的赛程：三天前刚踢联赛硬仗的球队，欧冠可能轮换。把赛程与缺阵名单一起读，轮换幅度大的比赛，实力评估要下调。
引用：“get_team_schedule (recent results)”

### fb.62 状态与实力要分开

来源：Football_Prediction_Project README.md 第 266 行
能力：状态是短期的，实力是长期的。只看状态的模型缺上下文，要补俱乐部规模与质量特征。状态火热的弱队打状态低迷的强队，长期实力仍偏向强队，不要被短期状态带偏。
引用：“heavily form driven model”

## 比分策略与投注决策

### fb.63 最可能比分是概率最高的格子

来源：sports-skills skills/football-data/SKILL.md 第 378 行
能力：比分矩阵里概率最高的格子就是最可能比分。报比分策略时，先报这一个，再报第二与第三可能的比分，附上各自的概率。只报一个比分等于把不确定性藏起来了。
引用：“W/D/L + likely scoreline”

### fb.64 比分策略给一组不只一个

来源：ProphitBet README.md 第 960 行
能力：预测可以覆盖任意组合的比赛，不要只盯一场。比分策略给一组候选比分，例如 2 比 1、1 比 1、2 比 0 三个，按概率排序。单比分命中率低，一组比分才有操作价值。
引用：“predict any possible combination of matches”

### fb.65 价值投注是模型概率高于隐含概率

来源：ProphitBet README.md 第 826 行；Bet-on-Sibyl README.md 第 282 行
能力：有价值的投注是模型概率高于赔率隐含概率的那一项，例如模型认为主胜 60%，赔率隐含只有 50%，这 10 个点的差就是价值。没有价值差的投注，长期必输。先算价值差，再决定下不下。
引用：“comparable to odds offered on popular betting”

### fb.66 只在分歧处下注

来源：Bet-on-Sibyl README.md 第 306 行
能力：下注只下模型与庄家分歧的地方，分歧策略筛出的球队才是下注名单。模型与庄家一致的比赛没有信息优势，下了等于给庄家送钱。没有分歧就不下注，空仓也是一种决策。
引用：“The top teams to bet on”

### fb.67 跳过是最优动作

来源：ProphitBet README.md 第 902 行
能力：下注动作里第一项就是跳过：机会不好时不下注。强化学习投注智能体有 13 个离散动作，第一号就是跳过。不会跳过的人，长期一定输给会跳过的人。
引用：“Avoid placing a bet when the agent considers”

### fb.68 单注与串关分开

来源：ProphitBet README.md 第 904 行
能力：单注是独立结算，串关是多场比赛合在一注里，必须全对才赢，赔付更高风险也更大。串关不要超过三场，场数越多，全对的概率越低。先分清单注与串关，再定投注额。
引用：“potentially higher payouts at increased risk”

### fb.69 双选降低风险

来源：ProphitBet README.md 第 844 行
能力：双选把两个结果打包：1X 是主胜或平局，12 是主胜或客胜，X2 是平局或客胜。双选概率更高，赔率更低，适合想降低风险的时候。比分策略里，双选是胜平负的保守替代。
引用：“1X (Home Win or Draw)”

### fb.70 大小球 2.5 是另一条路

来源：ProphitBet README.md 第 840 行
能力：比分难猜时，改猜总进球大于或小于 2.5。大小球只看总进球数，不看谁赢，对比分的具体分布不敏感。两队进攻都强、防守都弱的比赛，大球是更稳的选择。
引用：“Predicts whether the total number of goals”

### fb.71 概率阈值过滤

来源：ProphitBet README.md 第 948 行
能力：下注前按模型输出的概率过滤，例如只下主胜概率大于 0.3、平局概率大于 0.5 的比赛。阈值要在历史数据上定，不要凭感觉定。低于阈值的预测直接丢掉，不进入下注名单。
引用：“prob(1) > 0.3, prob(X) > 0.5”

### fb.72 赔率区间过滤

来源：ProphitBet README.md 第 594 行
能力：建联赛数据时用赔率区间过滤，只取想要的赔率范围的比赛。不同赔率区间的比赛，模型的表现不一样，先定赔率区间再训模型，不要全量混在一起。
引用：“Use the filters to select a desired odd range”

### fb.73 程序与人工分析对照

来源：FBP Advantages 第 38 行
能力：程序给出预测的同时，人也要做基本面分析，两者对照。两者一致时信心高，两者不一致时查原因。程序错的时候，人要能发现；人错的时候，程序要能纠正。对照是最后一道防线。
引用：“When the decision of the procedure is different”

### fb.74 不盲从程序

来源：FBP Advantages 第 36 行
能力：不要盲从程序的建议，程序预测只是参考。FBP 的作者明确说不是盲从程序，而是在程序预测的同时自己分析。程序有盲区，人有偏见，两者互相制衡才稳。
引用：“not blindly following the suggestion of procedure”

## 回测、评估与风控

### fb.75 时间顺序切分

来源：ProphitBet README.md 第 817 行
能力：时间序列数据不用随机切分，用滑动交叉验证：按时间顺序滚动训练与测试，保证评估方式与真实下注的时间顺序一致。随机切分会把未来信息漏进训练集，回测结果全是假的。
引用：“chronological training and evaluation windows”

### fb.76 嵌套交叉验证防调参偏见

来源：ProphitBet README.md 第 863 行
能力：调参要用嵌套交叉验证：内层循环调参，外层循环无偏估计。只用一层交叉验证调参，模型会对评估集产生偏见。嵌套交叉验证是最可靠的评估方法之一，只是比较慢。
引用：“one of the most reliable evaluation techniques”

### fb.77 评估指标要全套

来源：ProphitBet README.md 第 823 行
能力：评估模型不要只看准确率，要看全套指标：准确率、F1、精确率、召回率、对数损失、布里尔分数、排序概率分数、AUC。只看准确率会奖励冒大风险的做法，概率类指标是用来约束这种奖励的。
引用：“Brier Score, Ranked Probability Score (RPS)”

### fb.78 布里尔与排序概率分数是概率质量指标

来源：ProphitBet README.md 第 823 行
能力：布里尔分数与排序概率分数专门衡量概率预测的质量：预测概率与实际结果越接近，分数越好。胜平负是三分类问题，排序概率分数比布里尔分数更合适，因为它考虑了胜、平、负之间的顺序。
引用：“Accuracy, F1-Score, Precision, Recall, Log Loss”

### fb.79 对标庄家做基准

来源：ProphitBet README.md 第 826 行
能力：模型评估要对标庄家，看模型是不是比赔率制定者准。只报模型自己的准确率没有意义，报模型相对庄家的超额才有意义。跑不赢庄家的模型，没有下注价值。
引用：“benchmarks the model”

### fb.80 与庄家比资金曲线

来源：Bet-on-Sibyl README.md 第 146 行
能力：赛季结束时，把模型的资金曲线与庄家的资金曲线并排比：按模型下注一年下来赚多少，按庄家赔率下注赚多少。资金曲线比单场准确率更真实，它扣掉了赔率与成本。
引用：“bankroll comparaison stats with bookmaker”

### fb.81 准确率目标 50% 起步

来源：Football_Prediction_Project README.md 第 157 行
能力：胜平负三分类的准确率目标是大于 50%，拉伸目标 60%。随机猜只有 33%，50% 已经是有效信号。不要追求 80% 这种不切实际的目标，FBP 自称的 80% 未经独立验证。
引用：“greater than 50%, with a stretch target of 60%”

### fb.82 平局预测差是已知短板

来源：Football_Prediction_Project README.md 第 231 行
能力：模型预测平局最差是已知短板，不要指望修好它。平局占比约五分之一，分布接近随机。策略上少押平局，把精力放在胜负与大小球上。
引用：“approx. 1 in 5 matches”

### fb.83 类别不平衡要处理

来源：Football_Prediction_Project README.md 第 285 行；ProphitBet README.md 第 867 行
能力：胜、平、负三类样本不平衡，平局最少，模型会偏向多数类。要处理类别不平衡：用 SMOTE 过采样，或者调类别权重，或者数据采样。处理前先确认不平衡的程度，不要盲目上采样。
引用：“use data-sampling techniques and class weight”

### fb.84 只读不下单

来源：sports-skills README.md 第 128 行
能力：默认只读不下单，绝不替用户下注、交易或转账，除非用户明确要求某一次具体操作。预测与分析是研究，下注是用户的决定。报策略时附上来源与时效说明，不做收益承诺。
引用：“Never place bets, trades, orders, transfers”
