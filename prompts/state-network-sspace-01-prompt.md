# Codex brief — 状态网络 / S-SPACE v0（稀疏特征 → 空间峰）

你在共享电脑上，只做设计文档，不改 bio-brain / bio-brain-v2 源码，不 git commit/push。

## 必须写出的文件（覆盖写）
1. `/workspace/architecture-workbench/modules/state-network/README.md`
2. `/workspace/architecture-workbench/modules/state-network/S-SPACE-01-sparse-feature-to-spatial-peak.md`
3. `/workspace/architecture-workbench/modules/state-network/interface-notes.md`

全部中文。每个具体断言必须标注其一：
- 【用户已确认】
- 【候选方案】
- 【仅工作台展示】— 展示工具/动画已实现但未验证机制；`mechanismValidated: false`
- 【开放/未决】
- 【历史参考·非本模块确认】— newnet / light-line / 旧叙事等

硬禁止：
- 把用户未批准的候选机理写成确定结构（尤其「局部驱动+邻近支持抑制」）
- 把 S-SPACE / S-INSTANCE / S-SOURCE / S-HAVE / S-WANT 写成已批准的五套独立物理网络（它们是职责小框）
- 越权拍板输入侧稀疏算子细节、概念吸引子学习公式、动作规划动力学
- 预装 Minecraft 对象编号、世界地图、隐藏属性或配方

## 已确认方向（仅这些可标【用户已确认】）
- 状态侧路径：保留位置的稀疏输入 → S-SPACE 分布式活动峰 → 相互作用形成整体
- 状态网络承载现实输入、具体空间状态与实例活动；为概念最底层提供校准依据（端口归属可讨论）
- 小框是职责，不等于已批准五套独立物理网络
- mechanismValidated: false；动画成功 ≠ 逻辑验证
- 深度不确定时三维活动如何表达仍是开放题；原生基本三维能力仍是要求
- 跨模块接口变更先在「原型设计」群对齐

## 本轮范围（只做第一块）
S-SPACE：稀疏特征 → 空间峰。可顺带列出后续题（二维到三维、归组、同类多实例、回映、移动与遮挡续接）为开放清单，但不要假装本轮已设计完。

## 只读对照
- `/workspace/state-network-research/CONTEXT.md`
- `/workspace/architecture-workbench/prompts/input-module-v0-prompt.md`（输入侧交接面口径）
- `/workspace/newnet/spec.md`（历史草图）
- `/workspace/bio-brain-video/light-line-mechanism-design.md`（概念侧；勿写成状态侧已确认）
- 若 `modules/input/` 已有 interface-contract.md，只读其对 S-SPACE ingest 的假设，保持可对接，不要改输入模块文件

## README.md
- 模块职责一句话；范围内/外
- 状态图例
- 本目录文件清单
- 与输入 / 概念 / 动作交接一览（L-GROUP、L-CALL、L-RETURN、L-HAVE、L-HAVE-QUERY、L-ACTION-TRACE、L-EXPERIENCE、L-BODY — 端口归属标可讨论）

## S-SPACE-01-…md 必须含
1. 范围与非目标
2. 已确认前提
3. 候选机制（1–2 个可对照方案，明确【候选】，不要选定）
4. 与输入模块的接口契约（保留位置稀疏特征如何注入活动峰；不假定输入算子已验证）
5. 「空间峰」工作定义（可核验的活动形态描述，标候选）
6. 开放问题（含二维→三维、遮挡续接等后续题指针）
7. 下一步可核验项（不依赖动画成功）
8. 仍缺 architecture.json / 工作台 1.1.0 结构数据才能定稿的项

## interface-notes.md
- 对外 ingest / 对外读出假设
- 禁止项
- 与概念校准边界一句话（状态提供校准依据；不在此文写死三因子公式）
- 变更流程

写完后 stdout 打印三文件路径 + 需用户确认的前 5 个拍板点。
