---
mechanismValidated: false
---

# 项目管理纪要 · 2026-11-04 · 2D toy model 重置

依据[本轮简报](../prompts/pm-workbench-reset-2d-toy-v1.md)与用户决定（America/Los_Angeles 2026-11-04）：旧「输入」「状态网络」Bot 已删并按 **2D 世界 toy model 优先、再升级到 3D** 重建；要求工作台同步反映阶段切换。Grok Bot 做项目管理；本轮由执行侧按简报全权更新工作台至 **1.2.0**。授权不代替用户批准 2D 机制，也不把候选升为已确认。

【未验证/开放】`mechanismValidated: false`。本轮**不**新增未研究的 2D 端口／接线定稿；**不**改 `bio-brain*` / `bio-brain-v2` / `newnet` 运行源码；**不**回退概念网络与动作的既有已确认边界。

## 重置原因与阶段

| 项 | 口径 |
| --- | --- |
| 原因 | 用户意识到应先在 2D 世界做 toy model，再升级到 3D；旧 3D／Minecraft／双路射线三维交汇主线不再适合作为当前默认。 |
| 当前阶段 | **2D toy model 优先**（输入与状态网络重开最小可运行设计）。 |
| 后续 | 2D 跑通并经用户确认后，再规划升 3D；旧 3D／MC／S-SPACE-01～07 材料作 **3D 线候选或研究归档**，非现行主线默认。 |
| 概念／动作 | 暂不重建；三因子只校 C0、返回无强度、补全／回映≠新观测、L-GOAL【设计已锁·现码未对齐】等继续有效。 |

## 各模块状态

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 概念网络 | 继续 | v0 与既有已确认／设计已锁边界保留；几何一致性／三维交汇不硬扛。入口见 [modules/concept-network/README.md](../modules/concept-network/README.md)。 |
| 动作 | 继续 | v1 契约与九项动力学仍为候选登记；L-GOAL／观测口边界不变。见 [modules/action-goal/v1-interface-contract.md](../modules/action-goal/v1-interface-contract.md)。 |
| 输入 | **重开 2D** | 旧 MC／双路／三维可行性稿【3D 归档·非当前默认】；等新 Bot 2D 最小方案上报后再落拓扑。见 [modules/input/README.md](../modules/input/README.md)。 |
| 状态网络 | **重开 2D** | S-SPACE-01～07 及合成实验【3D 归档·非当前默认】；2D 平面空间／实例最小方案待上报。见 [modules/state-network/README.md](../modules/state-network/README.md)。 |

## 旧 3D 材料归档（不删 ID）

工作台 `data/architecture.json` 中相关 `SRC-INPUT-*`、`SRC-S-SPACE-*`、`SRC-STATE-*` 来源与对应研究决定已标明【3D 归档·非当前默认】或【已作废作主线】；ID 保留，不重编号。历史确认事实留在描述中，但**不再作为当前主线默认**。

## 阻塞与下一步

1. 【未验证/开放】等待新「输入」Bot 上报 **2D toy** 最小视觉／身体／经历入口方案（字段与接线仍未定稿）。
2. 【未验证/开放】等待新「状态网络」Bot 上报 **2D** 下 S-SPACE／S-INSTANCE／S-SOURCE／S-HAVE／S-WANT 最小可运行设计。
3. 两份上报经用户确认并在「原型设计」群对齐后，再由项目管理增量落拓扑（新 version），仍禁止擅自定稿。
4. 概念／动作跨模块非几何对齐可继续；涉及空间载荷的接口暂缓，直到 2D 契约清晰。

## 本轮工作台验证

- `node scripts/check.mjs`：通过（valid=true；rules.passed=true；checked=7；mechanismValidated=false）。
- `npm test`：通过（16/16）。
- 分支：`candidate/pm-reset-2d-toy-v1`；**不 push**。
- 说明：首轮 `codex exec`（gpt-6-astra / max）只读材料后提前退出；按简报回退由执行侧依同一 brief 落盘，日志见 `logs/codex-pm-reset-2d-toy-v1.log`。

mechanismValidated: false
