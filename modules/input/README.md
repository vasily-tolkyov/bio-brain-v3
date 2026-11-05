---
status: reset-2d-toy
mechanismValidated: false
stage: 2D toy model（3D 为后续升级）
---

# STATUS · 2026-11-04

【用户已确认】当前主线是 **2D 世界 toy model**，再规划升 3D。

【用户已确认】2D 输入讨论口径已收束：画面 → 分块局部对比 topK 稀疏 → S-SPACE；点带原画面位置，可带光强＋颜色（非对象标签，色可参与加权）；块大小／k／权重等状态设计完再调。详见 [design-draft-v3-2d-toy.md](design-draft-v3-2d-toy.md)。

【候选／开放/未决】交接形状仅为候选；具体 schema 字段、颜色编码、强度尺度与接收口联合签认，等状态最小承载草稿后再对。

【3D 归档·非当前默认】MC 单路／双路／三维可行性旧稿**不再作为现行默认**；仅作归档与对照。确认前不由本模块改 `architecture.json`。

【未验证/开放】`mechanismValidated: false`。

## 当前阅读顺序

1. 【用户已确认／候选】[2D toy 短稿 v3](design-draft-v3-2d-toy.md) — 现行方向与候选交接入口。
2. 【历史草案·已作废／冲突】[旧 MC 单路 v2](design-draft-v2-mc-monocular.md)、[旧通俗／契约等](scheme-plain-zh.md) — 不作现行。
3. 【历史草案】[双路归档](archive/2026-11-dual-view/README.md)。

## 与状态／项目管理

- 观测口：适配器真实稀疏测量；补全／回映不进观测口（群内既有边界）。
- 参数调优：等状态网络 2D 最小承载设计后再调。
- 落台：已收进工作台 v1.2.1 的 `D-INPUT-2D-V3`／`D-INPUT-2D-V3-HANDOFF` 与[登记纪要](../../sources/pm-status-2026-11-04-input-2d-v3.md)；仅登记方向与候选交接，端口／接线未定稿。
