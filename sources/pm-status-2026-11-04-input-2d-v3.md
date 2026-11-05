---
status: registered
mechanismValidated: false
---

# 项目管理纪要 · 2026-11-04 · 输入 2D toy v3 登记

依据[本轮简报](../prompts/pm-workbench-register-input-2d-v3.md)、[输入短稿 v3](../modules/input/design-draft-v3-2d-toy.md)与[README STATUS](../modules/input/README.md)，在 [2D 重置纪要](pm-status-2026-11-04-2d-reset.md)的 **1.2.0** 基础上登记至 **1.2.1**。用户决定已[追加记录](latest-user-decisions.md)；本轮未另行读取群聊。登记只确认源稿明确的方向，不批准候选机制或输入拓扑。

## 确认范围

| 分类 | 本轮口径 |
| --- | --- |
| 【用户已确认】方向 | **2D 画面 → 分块局部对比 topK 稀疏 → S-SPACE**；每块最多留 k 个突出位置，不够少留、不凑数。 |
| 【用户已确认】观测 | 点带原画面位置，可带光强＋颜色；颜色是观测通道，非对象标签／ID，topK 可以色加权。不预装游戏对象编号或世界地图，入口只交适配器真实稀疏测量。 |
| 【用户已确认】调参时序 | 块大小、k、对比与颜色权重等参数，等状态网络设计完再调；本轮不锁数值默认。 |
| 【候选】交接形状 | 一帧一次交出带位置索引、强度、可选颜色、来源／时间等最小元数据的稀疏集合，整帧检查后交给 S-SPACE；未列位置不表示「空」，不补伪零观测。 |
| 【开放/未决】字段与接收 | schema 字段名、颜色编码、强度尺度与 `P-SPACE-IN`／等价接收口联合签认，等状态最小承载草稿后再对；块是否重叠、噪声门槛、并列次序等也待状态设计后再调。身体信号与动作经历入口本轮不扩展。 |
| 【3D 归档】旧主线 | 旧 MC 单路／双路／三维可行性与 S-SPACE-01～07 非现行默认；旧 P1–P5／Q2/Q3／VisionSparseEvent 随旧线归档。升 3D 路径仅为候选占位，不将内参、射线或多路配对写成 2D 默认。 |

## 工作台登记

- 来源：`SRC-INPUT-2D-V3`、`SRC-U-INPUT-2D-V3-20261104`、`SRC-PM-INPUT-2D-V3-20261104`、`SRC-PM-STATUS-INPUT-2D-V3-20261104`；更新 `SRC-INPUT-INDEX` 指向的 README STATUS 摘要。
- 决定：`D-INPUT-2D-V3` 为已确认方向；`D-INPUT-2D-V3-HANDOFF` 为候选交接；`D-INPUT-OPEN`、`D-INPUT-2D-STAGE`、`D-STATE-RESEARCH-OPEN` 更新为输入短稿已登记、状态最小承载与联合对齐仍开放。
- `architecture.json` 只更新 version、updatedAt、sources、decisions 与追加 changelog。nodes、ports、edges、views、rules、cases、tombstones 保持与 1.2.0 一致；不新增或改定稿输入 ports／wires／topology。
- 概念／动作边界保留：三因子只校 C0 内部连接，上层由下一层非三因子校准，返回无强度，补全／回映不是新观测；真实输入触发的直接和补全活动可学习，内部预演不学习，缺测照常小幅削弱。L-GOAL【设计已锁·现码未对齐】等不回退；未改 bio-brain／newnet。
- 来源清单记录本轮短稿、简报、纪要及更新文档的字节数和 SHA-256；同时刷新 1.2.0 重置后遗留的状态 README 校验值，状态文档本身未改。

## 下一步

【开放/未决】等待状态 2D 最小承载草稿，再联合对齐输入 schema 与接收口；块大小／k／权重等参数等状态网络设计完再调。用户确认与联合签认后，才进入后续版本的接口／拓扑登记。工作台检查不构成机制验收，`mechanismValidated: false`。

## 本轮验证与提交

- 本次执行进程已核实为 `codex exec`，模型 `gpt-6-astra`、思考强度 `max`，直接按 brief 落盘。
- `node scripts/check.mjs`：通过（version=1.2.1；valid=true；rules.passed=true；checked=7；mechanismValidated=false）。
- `npm test`：通过（16/16）。本轮无前端或交互改动，未运行浏览器测试。
- 相对 1.2.0 的外部更新校验、拓扑及概念／动作决定保留核对、历史只追加核对、来源清单字节数与 SHA-256 复核均通过。
- 分支：`candidate/pm-register-input-2d-v3`；提交包含 `Reason:`、`IDs:`、`Validation:`，**不 push**。仅纳入本轮文档与登记数据；工作区已有的其他未跟踪实验、日志和证据文件保留原状。
