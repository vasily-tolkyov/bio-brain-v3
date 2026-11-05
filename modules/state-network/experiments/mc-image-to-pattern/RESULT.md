---
status: candidate
mechanismValidated: false
scope: runnable-image-to-pattern-candidate
---

# 【候选】06c：图像到 S-SPACE 空间图案的闭环结果

【候选】完整方案见 [S-SPACE-06c](../../S-SPACE-06c-image-to-pattern.md)。本实验实际读取一张 P2 图，输出深度 unknown 的稀疏观测、A 场的 225 个空间探针与 25 点剖面；B 在 A 外给条件计量或 unknown。**7 个场景、43 项检查通过**，`mechanismValidated: false`。

【候选】实现与复现入口如下，使用 Python 3.13.5 标准库，无第三方依赖或网络服务；两条命令仅更新新实验目录的产物及独立复核记录。

```bash
python3 -B modules/state-network/experiments/mc-image-to-pattern/run.py
python3 -B modules/state-network/experiments/mc-image-to-pattern/verify.py
```

| 标记 | 文件 | 作用 |
| --- | --- | --- |
| 【候选】 | [pipeline.py](pipeline.py) | P2 解码、相机绑定、稀疏化、单路 ray、固定承载、B、图案导出与真实 CLI。 |
| 【候选】 | [fixtures.py](fixtures.py) | 明示 K 和配置，离线合成图像；生成用深度不传入 pipeline。 |
| 【候选】 | [run.py](run.py) | 生成夹具，运行正例／unknown／拒收与实际命令行检查。 |
| 【候选】 | [verify.py](verify.py) | 独立前向投影、中点积分、SVG 结构核对及 72 份产物重算。 |
| 【候选】 | [camera-lock.json](artifacts/camera-lock.json)、[settings.json](artifacts/settings.json) | 可审阅、可复算的相机与处理默认；不是省略配置时的兜底。 |
| 【候选】 | [summary.json](artifacts/summary.json)、[checks.json](artifacts/checks.json)、[validation.json](validation.json) | 实际数字、43 项断言及独立核验。 |
| 【候选】 | [scope-check.json](scope-check.json) | 既有架构／输入／状态文件的修改范围核对，不是承载账本。 |

## 1. 【候选】默认与数值来源

【候选】锁定 K 为 `fx=fy=48 px、cx=32 px、cy=24 px`，尺寸 64×48，来源是 06 的明示合成相机，数值在本目录 `fixtures.py` 重述。对称针孔几何推导 FOV 为水平 `67.38013505195957°`、垂直 `53.13010235415598°`；没有读取或假定真实 MC 菜单的 FOV。

【候选】输入为整数像素中心的单幅标量亮度图，先取 8×8 块均值绝对对比、每块最多两个非零值，再由 K 赋 ray。并列按像素索引；零对比用整数算式判断，平坦图不产生数值伪亮点。全帧保留样本进入同一 A 规则，强度不是深度概率。

【候选】`b=1`，显式 `meters_per_block=1.0` 作为模型标尺；Ω 块坐标为 `[-7,7]×[-5,5]×[0.5,12.5]`，h=0.5 块，Q=intensity。只读复用旧 `carrier.py`，其 SHA-256 为 `427bdee64c76d61bca2dcb3b08355c2932467943005eb084e73cdef1dc6254dc`；版本变化会硬失败，未修改旧核或采用新的沿深度选点规则。

【候选】A 按需算固定 RF 单元活动，输出有限探针和剖面，不建立稠密三维网格账本。当前帧输入及请求点可以占用内存；本实验不宣称全部计算的内存为常数或已通过实时容量测试。

## 2. 【候选】逐图结果

| 标记 | 图像／产物 | 稀疏样本数 | B 结果 |
| --- | --- | --- | --- |
| 【候选】 | [grid-six 原图](artifacts/fixtures/grid-six/image.pgm)／[空间图案](artifacts/results/grid-six/pattern.svg)／[B](artifacts/results/grid-six/B.json) | 20 | 分界列 16、24、32、40、48；N=4，跨度 32 px，条件 Z=6 块。 |
| 【候选】 | [grid-twelve 原图](artifacts/fixtures/grid-twelve/image.pgm)／[空间图案](artifacts/results/grid-twelve/pattern.svg)／[B](artifacts/results/grid-twelve/B.json) | 12 | 分界列 24、28、32、36、40；N=4，跨度 16 px，条件 Z=12 块。 |
| 【候选】 | [missing-seam](artifacts/results/missing-seam/B.json) | 16 | unknown：间距不一致，不自动补漏缝。 |
| 【候选】 | [two-lines](artifacts/results/two-lines/B.json) | 8 | unknown：不足三条分界，不默认 N=1。 |
| 【候选】 | [skewed](artifacts/results/skewed/B.json) | 20 | unknown：不同图像行的分界列不一致。 |
| 【候选】 | [unclassified-image](artifacts/results/unclassified-image/B.json) | 20 | unknown：同一正例画面但不提供适用类别依据；A 活动数值保持相同。 |
| 【候选】 | [blank](artifacts/results/blank/B.json) | 0 | unknown；A 的有限读出为已算得的空和，不推断世界为空。 |

【候选】两个正例是分别运行的单幅画面，不是双目或输入配对。B 只从保留二维位置数分界，`N=k−1`，没有接收 N 或深度答案。深度仅在评分端用 6／12 核对；`pipeline()` 参数中没有世界、地图、对象 ID 或评分真值。

【候选】B 的适用文件声明正对相机和连续单位块缝，来源限于公开的合成目标类别，不含该帧 N／深度。它不是从一般 MC 图片自动认证出的事实；几何外观相似并不能证明条纹就是块缝。普通图片没有这种依据时，程序给 unknown，仍能完成图像→A 图案。

【候选】每个结果目录都有 `observation.json`、`B.json`、`pattern.json`、`bundle.json`、`probes.csv`、`profile.csv` 和 `pattern.svg`。SVG 只画已求值探针，圆面积使用固定比例；没有伪彩色、真假标签、真值峰标记或逐图归一化。CSV／JSON 保留原始数值，未采样位置不补零。

## 3. 【候选】数值与职责检查

| 标记 | 检查 | 实际结果 |
| --- | --- | --- |
| 【候选】 | 整帧预算 | grid-six 的 ΣQ 和全 RF 单元活动和均为 `13.176470588235293`；本次浮点差为 0。 |
| 【候选】 | B 不污染 A | 同一图像有／无 B，观测摘录和 A 探针／剖面完全相同；ray.depth 始终 unknown。 |
| 【候选】 | 单位比例改变 | 模型米／块比例从 1 改为 2，同一块坐标活动最大差 0；B 仍为 6 块，模型米从 6 到 12。 |
| 【候选】 | 图像亮度减半 | 活动同比减半，最大线性残差 0；B 仍计 N=4、条件 Z=6 块。 |
| 【候选】 | 图像结构变化 | 两个正例的固定探针最大活动差 `0.078190813362382`，说明保留下来的图像变化进入空间图案。 |
| 【候选】 | 复算与 stub | 相同输入重算一致，不叠加历史；成熟辅助明确未连接且没有深度输出。 |
| 【候选】 | 实际 CLI | 从磁盘图像到 bundle 结果与函数运行一致；错配请求非零退出，不创建失败请求输出目录。 |

【候选】硬失败检查覆盖相机／帧摘要错配、K 与 FOV 不符、K 缺项、零焦距、未支持裁剪、图像尺寸错配、少像素、未支持编码、单位缺项／非法、未实现网络请求、超读出预算、域外／非格点查询，以及 B 的图像绑定错误、明确几何不符和预装 N 答案字段。错误没有被转换成成功空帧、默认深度或部分读出。

【候选】独立复核不是再次调用同一局部积分公式：由观测 ray 和显式域计算区间，以每 ray 8,192 个均匀中点直接积分帐篷基；7 个去重探针只由输入 ray 在固定 z=2、5、10 的格点附近产生，不由真值挑点。

| 标记 | 独立复核 | 实际结果 |
| --- | --- | --- |
| 【候选】 | 直接 X/Z、Y/Z 重投影 | 最大误差 `3.552713678800501e-15 px`。 |
| 【候选】 | 独立中点积分 | 最大差 `9.344790370680034e-8`，预设容差 `2e-6`。 |
| 【候选】 | 临时目录重算 | 43 项检查重跑通过；72 份产物文件集合与字节内容全部一致。 |
| 【候选】 | SVG 可读性结构 | 全部 SVG 通过 XML 结构解析；这是工程探针示意，不作完整三维图像验收。 |
| 【候选】 | 仓库既有检查 | `node scripts/check.mjs` 的 7 项契约检查通过；`npm test` 的 1 个测试文件通过。 |

## 4. 【开放】证据边界

【开放】本轮没有运行真实 MC，也没有通用的“像素外观→真实单位块缝”识别器、成熟深度网、测量误差模型或实时性能结果。真实相机导出和几何认证仍需执行；绑定摘要本身不能认证 K 或条件声明的真实性。

【候选】当前完成目标是可运行的输入图像→S-SPACE 空间活动图案。B 条件计量是独立解释，不是相机深度测量；没有把缺依据补成 N=1，没有把未知、错误或未求值补零，没有改写 `ray.depth`。完整方案、当前默认及可复现实验共同构成本轮交付。

【候选】修改范围只包括新 06c 方案和本实验目录；`data/architecture.json` 与 `modules/input/` 的摘要核对见 [scope-check.json](scope-check.json)。`mechanismValidated: false`。

DONE-MC-MONO-06C
