# 状态网络 · 2D toy

【用户已确认】当前主线是全新 2D 架构：[S-SPACE-08](S-SPACE-08-2d-toy-model.md)，第一版只留 S-SPACE 活动图。旧 01～07 与旧实验文件不动，仅作【历史参考】保留链接。

【开放/未决】`mechanismValidated: false`；动画成功 ≠ 逻辑验证。字段与跨模块接线需「原型设计」群对齐，architecture.json 待 PM 更新；本轮不改结构数据。

## 阅读顺序

| 顺序／定位 | 文件 | 用途 |
| --- | --- | --- |
| 1 · 当前主线 | [S-SPACE-08-2d-toy-model.md](S-SPACE-08-2d-toy-model.md) | 八条【用户已确认】前提；同尺寸密强度图、整帧覆盖、候选字段与待对齐接线。 |
| 2 · 【候选方案】 | [2D 场景大纲](experiments/2d-toy-model/README.md) | 单点、双点、空帧、覆盖；尚未执行，不依赖旧实验。 |
| 3 · 输入对照 | [输入 v3](../input/design-draft-v3-2d-toy.md)、[输入 README](../input/README.md) | 当前入口方向；字段、颜色和参数按各自标签区分。 |
| 【历史参考】 | [01](S-SPACE-01-sparse-feature-to-spatial-peak.md)、[02](S-SPACE-02-multi-view-ray-3d-filter.md) | 旧稀疏成峰、多路射线与三维筛选讨论。 |
| 【历史参考】 | [03](S-SPACE-03-carrier-structure.md)、[04](S-SPACE-04-false-intersection-filter.md)、[05](S-SPACE-05-specificity-at-intersection.md) | 旧三维承载、筛选与交汇特异性研究。 |
| 【历史参考】 | [06](S-SPACE-06-mc-monocular-state.md)、[06b](S-SPACE-06b-block-scale-prior.md)、[06c](S-SPACE-06c-image-to-pattern.md)、[07](S-SPACE-07-relative-layout.md) | 旧 MC、尺度与条件近远讨论。 |
| 【历史参考】 | [nearfar](experiments/nearfar-sweep/RESULT.md)、[support-width](experiments/support-width-sweep/RESULT.md)、[specificity](experiments/specificity-at-intersection/RESULT.md) | 旧合成实验，不是 2D 默认或机制验收。 |
| 【历史参考】 | [mc-monocular](experiments/mc-monocular-state/RESULT.md)、[mc-image](experiments/mc-image-to-pattern/RESULT.md)、[mc-perspective](experiments/mc-perspective-multi/RESULT.md)、[mc-relative](experiments/mc-relative-layout/RESULT.md) | 旧 MC 实验记录，原样保留。 |
| 【历史参考】 | [旧接口备注](interface-notes.md)、[旧简报](CODEX-BRIEF.md)、[1.1.0 后续说明](CODEX-FOLLOWUP-1.1.0.md)、[1.1.0 摘录](refs/s-space-from-architecture-1.1.0.json) | 只读历史语境；旧五职责、峰和三维约束不覆盖 08。 |

## 交接一览

| 交接 | 本版边界 |
| --- | --- |
| 输入 → S-SPACE | 【用户已确认】真实 topK 稀疏点按原位置直接写强度；H×W 密网格与输入同尺寸，其余格为无活动的 0，每帧覆盖。无相机→世界映射。 |
| S-SPACE → 概念 | 【候选方案】交当前活动图与帧元数据；无峰、归组或实例输出。读取编码、`L-CALL` 与 `L-CAL0` 的承接需群对齐。 |
| 概念 → 状态 | 【开放/未决】峰等概念学习／补全读出后回传才出现；非观测落点尚未定义。补全／回映／推算不得写入观测活动格。 |
| 状态与动作／身体／目标 | 【开放/未决】本版删除 S-INSTANCE／S-SOURCE／S-HAVE／S-WANT；旧经历、已有、需要等路径需对齐，不塞入活动图，不撤销概念／动作既有边界。 |
| 旧 L-* 与结构数据 | 【开放/未决】包括 `L-GROUP`、`L-CALL`、`L-RETURN`、`L-CAL0`、`L-HAVE`、`L-HAVE-QUERY`、`L-ACTION-TRACE`、`L-EXPERIENCE`、`L-BODY`、`L-GOAL`，影响清单见 08 第 7 节；architecture.json 待 PM 更新。 |

【用户已确认】无兜底、无账本、未知不补零；未点亮格的 0 仅表示无活动。禁止预装 MC 对象 ID／地图／隐藏属性／配方。输入算子细节、概念学习公式、动作动力学由对应模块讨论。

【候选方案】标签口径：【用户已确认】用于明确决定与边界；【候选方案】用于待签认字段或方案；【开放/未决】用于缺决策或验证的项目；【历史参考】用于旧材料，不继承为当前默认。升 3D 仅见 08 第 8 节钩子表。
