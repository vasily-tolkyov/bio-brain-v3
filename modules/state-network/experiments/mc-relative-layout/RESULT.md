---
mechanismValidated: false
---

# 【候选】MC 相对布局计算复核

【候选】在范围与几何依据满足方程的输入中，累计核对 28 对物体的左右、近远和条件相对坐标。检验直接比较真值与计算数值；未产生坐标的输入不计作空间恢复。`mechanismValidated: false`。

【候选】run.py 共 165 项检查，165 通过，0 失败。verify.py 的独立重算、隔离 CLI 和读取审计结果保存在 [validation.json](validation.json)。

| 标记 | 输入内容（编号仅定位文件） | 条件坐标组数 | 近远关系对数 | 数值及字段检查 |
| --- | --- | --- | --- | --- |
| 【候选】 | [输入 001](artifacts/inputs/001.json)：给出四个完整正对面，宽度均为 2 块 | 4 | 6 | 通过 |
| 【候选】 | [输入 002](artifacts/inputs/002.json)：只给范围相等关系，计算以共同 S 为单位的坐标 | 4 | 6 | 通过 |
| 【候选】 | [输入 003](artifacts/inputs/003.json)：范围相等，只给第一物体的 2 块宽度 | 4 | 6 | 通过 |
| 【候选】 | [输入 004](artifacts/inputs/004.json)：保持同一观测，撤去范围相等关系 | 0 | 0 | 通过 |
| 【候选】 | [输入 005](artifacts/inputs/005.json)：分别给出 1、2、3、1 块的实际范围 | 4 | 6 | 通过 |
| 【候选】 | [输入 006](artifacts/inputs/006.json)：已给互不相等的块数，又要求同一个 S | 0 | 0 | 通过 |
| 【候选】 | [输入 007](artifacts/inputs/007.json)：保留投影并置换深度，给出的范围变为 1、4、1、4 块，不能满足共同 S | 0 | 0 | 通过 |
| 【候选】 | [输入 008](artifacts/inputs/008.json)：前两个面的真实 Z 均为 16 | 3 | 3 | 通过 |
| 【候选】 | [输入 009](artifacts/inputs/009.json)：u 从 110 增至 140，而 X 从 6 减至 4 | 2 | 1 | 通过 |
| 【候选】 | [输入 010](artifacts/inputs/010.json)：保留矩形像素外观，但没有正对且完整的几何依据 | 0 | 0 | 通过 |
| 【候选】 | [输入 011](artifacts/inputs/011.json)：只给第一物体宽度，不给相等关系；只算该物体坐标 | 1 | 0 | 通过 |
| 【候选】 | [输入 012](artifacts/inputs/012.json)：边上一个像素不可见，未提供完整端点依据 | 0 | 0 | 通过 |
| 【候选】 | [输入 013](artifacts/inputs/013.json)：同一射线仅有一个像素，没有可代入的范围 | 0 | 0 | 通过 |

【候选】有已知 S 时输出块单位条件坐标；只有相等关系时输出以共同 S 为单位的数值。只给一物范围时，只计算该物体，不给其他物体补值，也不生成物间深度关系。

【候选】撤去尺度关系、缺少完整几何依据，以及等范围要求无法同时满足已给块数时，该项条件坐标计算没有产生；相关近远、Z 比和三维坐标差字段不出现。没有另加判定词或布尔结论。

【候选】深度置换保持同一图像，却需要把四物体范围改为 1、4、1、4 块。这些数值不能代入同一个 S，因此该请求没有产生条件布局数值；射线左右仍来自本帧像素。

【候选】同一观测更换范围依据后，A 与活动查询数值逐值相同。所有 ray.depth 仍为 `{"status":"unknown"}`，它只记录相机没有测量深度。

| 标记 | 对输入所做的修改 | 捕获异常且输入未改写 |
| --- | --- | --- |
| 【候选】 | [输入 014](artifacts/inputs/014.json)：只把 fx 改为 121，保留原 FOV | 通过 |
| 【候选】 | [输入 015](artifacts/inputs/015.json)：只把垂直 FOV 改为 70 度 | 通过 |
| 【候选】 | [输入 016](artifacts/inputs/016.json)：同时改 K 和 FOV，离开固定采集配置 | 通过 |
| 【候选】 | [输入 017](artifacts/inputs/017.json)：同时改 K、FOV 和摘要，仍不能改变锁定配置 | 通过 |
| 【候选】 | [输入 018](artifacts/inputs/018.json)：替换捕获的投影摘要 | 通过 |
| 【候选】 | [输入 019](artifacts/inputs/019.json)：删除 fx | 通过 |
| 【候选】 | [输入 020](artifacts/inputs/020.json)：图像变换改成裁剪 | 通过 |
| 【候选】 | [输入 021](artifacts/inputs/021.json)：像素位置索引与原坐标不符 | 通过 |
| 【候选】 | [输入 022](artifacts/inputs/022.json)：删除像素坐标 | 通过 |
| 【候选】 | [输入 023](artifacts/inputs/023.json)：把原射线改成不符该像素的方向 | 通过 |
| 【候选】 | [输入 024](artifacts/inputs/024.json)：移动射线光心 | 通过 |
| 【候选】 | [输入 025](artifacts/inputs/025.json)：把深度测量值塞入 ray.depth | 通过 |
| 【候选】 | [输入 026](artifacts/inputs/026.json)：在未测深的 ray.depth 中夹带数值 | 通过 |
| 【候选】 | [输入 027](artifacts/inputs/027.json)：删除一个图像像素 | 通过 |
| 【候选】 | [输入 028](artifacts/inputs/028.json)：删除一个应保留的稀疏像素 | 通过 |
| 【候选】 | [输入 029](artifacts/inputs/029.json)：修改图像而保留原捕获摘要 | 通过 |
| 【候选】 | [输入 030](artifacts/inputs/030.json)：删除捕获绑定 | 通过 |
| 【候选】 | [输入 031](artifacts/inputs/031.json)：在请求中夹带真值 Z | 通过 |
| 【候选】 | [输入 032](artifacts/inputs/032.json)：范围依据绑定到另一帧 | 通过 |
| 【候选】 | [输入 033](artifacts/inputs/033.json)：已知范围指向不存在的像素组 | 通过 |
| 【候选】 | [输入 034](artifacts/inputs/034.json)：给出零块数 | 通过 |
| 【候选】 | [输入 035](artifacts/inputs/035.json)：边已缺损却声明完整几何端点 | 通过 |

【候选】上述输入请求必须硬失败，不修射线、不改 K、不补像素。独立验证还要求 CLI 非零退出且不创建输出文件；异常字符串或任何布局标签都不作为通过条件。

【候选】运行时只读取图像、锁定 K、捕获绑定、射线及额外几何／范围依据。真值只进入生成器和离线评分；隔离 CLI 没有真值文件可读，也不能访问仓库其他路径。

【候选】原有 598 份文件哈希不变，其中 modules/input 为 6 份，06／06b／06c 为 3 份；旧实验未修改。architecture.json SHA-256 仍为 `1daf69c998bfded08a077fc8844d0354d45c606e959fde75b2ec644624adc5bb`。

【开放】实验采用精确像素端点和显式范围依据。实际 MC 的采集认证、几何边识别与测量误差仍需单独验证。没有取得必要依据时不作深度声称。

【候选】在仓库根目录复算：

```bash
python3 -B modules/state-network/experiments/mc-relative-layout/run.py
python3 -B modules/state-network/experiments/mc-relative-layout/verify.py
```

DONE-MC-RELATIVE-LAYOUT-NOLABEL
