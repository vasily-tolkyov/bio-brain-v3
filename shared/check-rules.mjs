// Architectural contracts only. This deliberately does not simulate neural dynamics.
export function checkRules(data) {
 const edges=new Map(data.edges.map(e=>[e.id,e]));
 const ports=new Map(data.ports.map(p=>[p.id,p]));
 const rules=(data.rules||[]).map(rule=>({id:rule.id,checks:rule.checks.map(check=>{
  const e=edges.get(check.edgeId);
  const passed=check.type==='edge-target'?ports.get(e?.to)?.nodeId===check.nodeId:
   check.type==='edge-decision'?!!e?.decisionIds.includes(check.decisionId):false;
  return {...check,passed};
 }),formalized:rule.checks.length>0}));
 const failed=rules.flatMap(r=>r.checks.filter(c=>!c.passed).map(c=>({ruleId:r.id,...c})));
 const unresolved=(data.cases||[]).flatMap(c=>c.steps.filter(s=>s.result==='unresolved').map(s=>({caseId:c.id,stepId:s.id,note:s.note})));
 return {scope:'architecture-contracts-only',passed:failed.length===0,checked:rules.reduce((n,r)=>n+r.checks.length,0),failed,rules,unresolved,mechanismValidated:false};
}
