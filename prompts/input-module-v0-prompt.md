你是架构工作台「输入」模块的文档作者。只写 Markdown 设计文档，不改 bio-brain / bio-brain-inputlayer / bio-brain-v2 源码，不 git commit/push。

## 必须写出的三个文件（覆盖写）
1. `/workspace/architecture-workbench/modules/input/README.md`
2. `/workspace/architecture-workbench/modules/input/design-draft-v0.md`
3. `/workspace/architecture-workbench/modules/input/interface-contract.md`

全部中文。每个具体断言必须标注其一：
- 【用户已确认】— 仅限下方「已确认方向」或权威材料中明确锁定且与本稿范围一致的内容
- 【候选方案】— 本稿提出、待拍板
- 【展示工具已实现但未验证机制】— 来自 light-line demo / scenes.py 等动画或示意代码；动画成功 ≠ 逻辑验证通过
- 【历史草案·可能冲突】— 旧输入层草案等，需标明差异
- 【开放/未决】— 尚无拍板

严禁：把展示机制写成已验证；引入 Minecraft 对象 ID、世界地图、隐藏属性、配方等预装语义；越权设计 S-SPACE 内部动力学、概念吸引子学习规则、L-GOAL 规划动力学（只写交接面假设）。

## 已确认方向（标【用户已确认】）
- 状态侧路径：保留位置的稀疏输入 → S-SPACE 分布式活动峰 → 相互作用形成整体。
- 范围：视觉优先的图像如何保留位置地稀疏化并进入网络；身体信号与自身动作经历如何进入；其他接口信息适配；不预装 Minecraft 对象编号、世界地图、隐藏属性或配方；原生基本三维能力仍是要求。
- 开放题：深度不确定时三维活动如何表达不确定。
- 跨模块接口变更须先对齐；本稿只写输入侧契约草案，标清与 S-SPACE / L-BODY / L-ACTION-TRACE 等的接口假设。

## 只读对照材料（摘其约束，勿抄成长文）
- `/workspace/newnet/spec.md`：输入点亮平面某处附近扎堆神经元；相似输入位置相邻有重叠；（连接/脉冲等曾撤回待重设）。
- `/workspace/bio-brain-video/light-line-mechanism-design.md`：展示/机理整理；动画≠验证。
- `/workspace/bio-brain-video/light-line-demo-v1/scenes.py` 中 `local_contrast_topk`：列内局部对比 → topK → 归一强度；再「按索引映射入网」——标【展示工具已实现但未验证机制】。
- `/workspace/bio-brain-runs/plans/input-layer-design-draft.md`：旧草案走「特征通道/传入纤维→无分组吸引子副本」取向，与「保留位置稀疏视觉」可能冲突——标【历史草案·可能冲突】并写差异表。
- `/workspace/bio-brain-v2/docs/multilayer-architecture-narrative.md`：输入层为学出吸引子层；传出副本专用线进时间展开（观察行/动作行分离）；内感受层与外感受、传出副本并列；输出层镜像；禁止把叙事里全部【定】无条件升级为本模块【用户已确认】——叙事属历史架构，仅当与「已确认方向」重合时才标已确认，其余作【候选】或参考并注明出处。
- `/workspace/bio-brain-v2/docs/m12-interoception.md` 与 amendment：身体变量适配思路（无 Minecraft 本体）；作适配原则参考。
- 同组边界：状态网络管 S-SPACE；概念网络管吸引子学习；动作管 L-GOAL / L-BODY / L-ACTION-TRACE。输入模块只定义如何把外部/身体/动作经历变成进入这些层的契约形状。

## README.md 要求
- 模块职责一句话 + 范围内/外
- 状态图例说明（已确认 / 候选 / 展示未验证 / 历史冲突 / 开放）
- 本目录文件清单与阅读顺序
- 与相邻模块交接一览（S-SPACE、L-BODY、L-ACTION-TRACE、其他接口适配器）

## design-draft-v0.md 必须含章节
1. 假设（区分已确认 vs 候选）
2. 视觉通路：保留位置稀疏化 → 进入网络的接口契约（与 S-SPACE 交接面）
   - 候选稀疏算子可参考 local_contrast_topk（展示未验证），但须说明：保留空间邻接/索引拓扑；稀疏事件携带位置索引 + 强度（及可选不确定度）
   - 明确「不」做：对象识别标签、Minecraft block/entity ID、语义特征通道预分配（对照旧草案差异）
3. 身体信号与自身动作经历如何进入（与 L-BODY / 传出副本 / L-ACTION-TRACE 交接面假设）
4. 其他接口适配原则（禁止预装 Minecraft 语义；适配器外置；只交原始可测信号或低层传感器形）
5. 三维/深度不确定的开放问题（原生基本三维能力是要求；深度不确定时活动如何表达不确定——给 2–3 个候选拍板选项）
6. 未决问题清单（每条带拍板选项 A/B/C）
7. 下一步可核验项（可跑的最小实验/对照思路，不要求本轮实现代码）

## interface-contract.md 要求
- 对外契约：字段/事件/时序假设/禁止项
- 分通道：VisionSparseEvent、BodySignalEvent、ActionEfferenceEvent（或等价命名）
- 与 S-SPACE 的 ingest 假设（位置保持的活动注入；不假定 S-SPACE 内部实现）
- 与 L-BODY / L-ACTION-TRACE 的写入边界（输入侧提供什么；谁拥有存储）
- 禁止项清单（Minecraft 语义、隐藏上帝状态、把展示 topK 当已验证算法等）
- 变更流程：跨模块接口变更须先对齐

篇幅紧凑可核验。写完三个文件后，在 stdout 打印三文件绝对路径与「需用户确认」前 5 个拍板点一行一条。
