# Codex follow-up: align S-SPACE-01 with architecture-workbench 1.1.0

mechanismValidated: false

现已提供：
- data/architecture.json（工作台 1.1.0）
- modules/state-network/refs/s-space-from-architecture-1.1.0.json
- sources/state_concept_calibration_astra_max_v2_zh.md
- sources/latest-user-decisions.md

请修订 modules/state-network/ 下已有三文件（S-SPACE-01*.md、interface-notes.md、及第三人文件若有），只改与 1.1.0 冲突或「仍缺结构数据」段落：

已确认可引用（status=confirmed 的节点/端口，仍非实验验证）：
- S-SPACE：一物可多峰；先局部活动再归组；深度/参照/自运动歧义保留
- P-SPACE-IN（observation）、P-SPACE-OUT（spatial）
- 输入侧接线候选：L-SPACE from P-IN-FEAT → P-SPACE-IN（status=candidate）

仍为 unresolved/candidate、不得写成确定机制：
- L-GROUP（P-SPACE-OUT → P-INSTANCE-IN）unresolved
- L-HAVE 从 P-SPACE-OUT 出发 candidate
- P-INSTANCE-CALL / P-INSTANCE-RETURN candidate
- 三因子完整方程、局部驱动+邻近支持抑制等未批准机理

边界：状态网络提供校准依据；本模块文不写死三因子公式。小框是职责，≠五套独立物理网络。

输出：覆盖写三文件；stdout 打印路径 + 需用户确认的前 5 个拍板点（更新后）。
