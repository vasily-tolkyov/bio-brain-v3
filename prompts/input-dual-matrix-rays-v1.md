# Codex brief — 输入模块 v1：双路稀疏矩阵 + 射线，并更新 3D 工作台

你在共享电脑 `/workspace/architecture-workbench`。用中文产出。mechanismValidated: false。不 git commit/push。不改 bio-brain / bio-brain-v2 / Minecraft 源码。

## 本轮目标（两块都要做完）
1. 把用户已确认的「双路随时间演化稀疏输入矩阵 + 独立射线」落到 `modules/input/` 设计文档（在 v0 上演进，不要假装 v0 没写过）。
2. 更新唯一规范源 `data/architecture.json`（升到 **1.2.0**），让 3D 工作台能展示输入侧新结构与接线；跑通 `node scripts/check.mjs` 与 `npm test`。

## 【用户已确认】（仅这些可标已确认；来自本对话拍板）
- 状态侧路径仍是：保留位置的稀疏输入 → S-SPACE 分布式活动峰 → 相互作用形成整体。
- 视觉稀疏算子选 **Q1-A**：分块局部对比 topK（展示依据仍标【展示工具已实现但未验证机制】；K 与分块参数仍开放）。
- 适配器先产出**保留位置的稀疏测量**，再赋**视线/射线**；输入侧**不**把样本强制钉成确定世界三维点。
- 单眼/单视角：先只有方向（射线），深度可未知。
- **多视角**：各视角独立稀疏矩阵、独立射线；是否在 S-SPACE 交汇成 3D，由状态侧活动叠出，**不由输入侧先配对钉死**。
- 交给状态网络的是**随时间演化的两路（或多路）稀疏输入矩阵**（各带位置与视线），分别注入。
- 不预装 Minecraft 对象编号、世界地图、隐藏属性或配方；原生基本三维能力仍是要求。
- 跨模块接口变更须先在「原型设计」群对齐；本稿可更新输入侧契约与工作台展示，但不单方面把状态侧动力学写成已确认。

## 【候选 / 开放】须保持标注
- Q2 位置交接形式：在「索引+拓扑」之上现已确认附标定视线；是否再附显式传感器坐标可标候选。
- Q3：多视角交汇前，单样本深度表达仍开放（区间 / 有限假设 / 未知标记）；默认交付形状优先「视线 + 未知/可选测深」，不要假装已选死。
- Q4–Q8、身体/动作通道：可沿用 v0 候选，本轮不强迫拍板；若改字段须标候选。
- 双路矩阵的具体分辨率、同步时钟、外参标定来源、射线参数化（原点+方向 vs 像素视线）标【候选方案】并给可核验接口字段。
- 「观察 ≠ 记忆/补全」：真实采样入口不写补全结果。

## 必须更新的文件
### A. modules/input/
1. `README.md` — 反映 v1 双路矩阵+射线；阅读顺序；与 S-SPACE / L-BODY / L-ACTION-TRACE 交接一览；状态图例。
2. `design-draft-v0.md` **或** 新建 `design-draft-v1.md`（若新建，README 指到 v1，并在文首说明相对 v0 变更；保留 v0 不删）。必须含：假设、视觉通路（稀疏→射线→多路矩阵时序）、与 S-SPACE 交接、身体/动作（可缩短引用 v0）、三维开放题、未决清单（更新 Q1/Q2 已确认项）、下一步可核验项、**工作台 1.2.0 ID 对照表**。
3. `interface-contract.md` — 演进 VisionSparseEvent：支持 `view_id`／多路并存；样本含 `position_index`、`intensity`、**ray**（原点/方向或等价标定视线，坐标系声明）；`topology_ref` 每视角独立版本；明确多路分别 ingest，输入侧无 stereo 配对字段。深度证据仍可选。禁止项保留。

### B. data/architecture.json → version **1.2.0**
硬约束（见 `shared/validate.mjs` / README）：
- 递增 `version`，更新 `updatedAt`（ISO），`changelog` 追加 1.2.0 条目且 `ids` 引用本版新增/改动的实体。
- **不得删除**旧 ID；废弃用 `deprecated` 或 `tombstones`；不得复用旧 ID。
- 新 decision / source 必须先存在再被引用；端口方向：边的 from 不能是 in，to 不能是 out。
- `mechanismValidated` 不要写成 true；说明里可写「设计展示」。

建议结构（ID 可微调但须稳定、清晰；优先扩展而非拆掉 L-SPACE）：
- 新增 source：如 `SRC-IN-V1`（kind=user 或 design），摘要本对话双路矩阵+射线决定。
- 新增 decision：如 `D-IN-SPARSE`（Q1-A）、`D-IN-RAY`（适配后射线、不钉死 3D 点）、`D-IN-MULTI`（多路独立矩阵分别注入，交汇归状态侧）。status=confirmed，挂 SRC-IN-V1 / SRC-U。
- 更新节点文案：
  - `M-IN`、`S-IN-SPARSE`：写明多路随时间演化的稀疏矩阵；S-IN-SPARSE status 可升为 confirmed（若描述与已确认一致）或保持 candidate 并写清剩余未定参数。
- 新增结构（parentId=`M-IN`），例如：
  - `S-IN-VIEW-A` / `S-IN-VIEW-B`：两路视角稀疏矩阵（示意双路；标签勿写成「已实现相机」）。
  - 或 `S-IN-RAY`：射线束职责小框（若用单框+两端口也可以，但双路矩阵在图上要能看见「两路」）。
- 端口：为每路稀疏输出提供 out 端口（如 `P-IN-FEAT-A`、`P-IN-FEAT-B`），signal=`observation`；可保留原 `P-IN-FEAT` 作汇总/兼容并更新描述，或将其改为 deprecated 并 tombstone 策略——**若有边仍引用则不可删**；推荐保留 `P-IN-FEAT` 并新增 A/B，更新 `L-SPACE` 描述为「多路稀疏+射线注入」，必要时新增 `L-SPACE-A` / `L-SPACE-B`（from 新端口 → `P-SPACE-IN`）。多条边进入同一 `P-SPACE-IN` 是允许的（分别注入）。
- 更新 `L-SPACE`（及新边）description：强调独立射线、非输入侧三角测量配对。
- 视需要把新节点加入 `V-OBS` / `V-ALL` 的 nodeIds；新边加入相关 view 的 edgeIds。
- 可选：新增 case `CASE-IN-DUAL-RAY` 若干 steps（result 对已定接线用 defined，对状态侧交汇机制用 unresolved），note 写清「交汇机制未验证」。
- 布局：新子结构放在 M-IN 内部合理位置，避免与 S-IN-BODY 重叠；颜色沿用结构蓝系 `#73b9ff` 或轻微区分。

### C. 可选但推荐
- `sources/latest-user-decisions.md` 追加一小节「输入双路矩阵+射线（2026-11-02）」——只摘已确认句，不发明。
- `modules/input/workbench-1.2.0-notes.md`：本版 ID 列表、与状态网络待对齐项（L-SPACE 多边 → P-SPACE-IN）、mechanismValidated:false。

## 禁止
- 越权写死 S-SPACE 内部峰动力学、概念学习、动作规划。
- 把动画/展示当验证。
- 预装对象 ID / 地图 / 配方。
- 输入侧输出「已匹配的 3D 点对」或 stereo disparity 作为已确认主路径。
- 静默降低 version 或删除旧 changelog。

## 验证
1. `node scripts/check.mjs`
2. `npm test`
3. stdout 打印：改动文件列表、architecture version、新增 ID 列表、仍需与状态网络对齐的 3 个接口点、mechanismValidated: false。

先只读 `modules/input/*`、`data/architecture.json`、`shared/validate.mjs`、`modules/state-network/interface-notes.md`（只读、不改状态模块除非发现悬空引用必须改边描述——默认不改状态模块文件），再写入。
