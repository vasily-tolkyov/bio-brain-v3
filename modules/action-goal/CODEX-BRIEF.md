# Codex brief — 动作与目标 v1 接口契约草稿

你在共享电脑上，只做设计文档，不改 bio-brain-v2 源码，不 git commit/push。

## 产出路径（必须写到）
`/workspace/architecture-workbench/modules/action-goal/v1-interface-contract.md`

## 权威参考（只读）
1. `/workspace/bio-brain-video/light-line-mechanism-design.md` §4（目标规划／动作反查，设计已锁、现码未对齐）
2. `/workspace/bio-brain-v2/docs/multilayer-architecture-narrative.md` §11（预测→行为【定】）、§11.7 预演、§11.8
3. `/workspace/bio-brain-v2/out/light-line/design/CONTEXT-USE-DECISIONS.md`（情景不写可执行子目标；动作叶边界）
4. `/workspace/bio-brain-v2/out/light-line/design/DECISIONS.md`（第一版无教师程序；binary presence/absence）

## 本模块职责（用户已分配）
目标如何输入并与当前状态对齐；未知时探索动作；多候选竞争；子目标保持与中断；动作终止；执行反馈进经历；L-GOAL / L-BODY / L-ACTION-TRACE；同一概念网络做目标反查（无外置规划器）。动作可通过适配器调接口，选择与方法学习由网络承担。

第一版能力（必须覆盖，动力学多为开放题）：多步条件反查、子目标、内部预演（预演不触发学习）、现实输入到来时的中断、耐心随投入消耗。

不要塞进第一版：完整长期资源安排、语言声音、成熟合成。

## 跨模块接线（只写契约边界，不发明状态侧物理）
- 与状态网络：L-ACTION-TRACE、L-BODY、L-EXPERIENCE；S-WANT / S-HAVE 职责框是职责名，不等于已批准五套独立物理网。
- 与概念网络：目标反查复用同一补全+差集，不另开规划器；出手门设计挂差集强度而非 W（现码仍挂 W——标为设计已锁/现码未对齐）。
- 与输入：身体信号与自身动作经历进入路径；动作适配器外置。

## 文档必须严格分区
每个断言标注其一：【已确认】【候选】【未验证/开放】【设计已锁·现码未对齐】【历史冲突·以较新锁为准】

历史冲突提示：
- 叙事 §11.6 两阶段教师 vs DECISIONS「第一版 L0–L8 无教师」→ 以 DECISIONS 为准标【历史冲突】。
- CONTEXT-USE 早期「第一阶段只开直接动作边」vs 第一版要多步条件反查 → 多步列入第一版目标，但标【开放】动力学与父子取消归属。

## 文档结构（中文）
1. 范围与非目标
2. 已确认原则（从权威参考摘录，带出处路径+小节）
3. L-GOAL / L-BODY / L-ACTION-TRACE 职责与接口契约（信号方向、不得写入项、与 STDP/过去片隔离）
4. 第一版闭环：目标注入 → 认出 → 反查 → 候选竞争 → 预演/执行门 → 终止/中断 → 反馈进经历
5. 案例（红按钮开灯 / 蓝按钮开门 或斧头砍树——说明用例≠定义）
6. 开放问题清单（耐心消耗、多候选动力学、多步父子取消等）
7. 下一步可核验项（不写实现代码）

篇幅紧凑，可核验，禁止把候选写成已确认。
