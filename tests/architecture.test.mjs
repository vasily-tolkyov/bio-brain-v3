import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateArchitecture, nextVersion} from '../shared/validate.mjs';
import {checkRules} from '../shared/check-rules.mjs';
const original=JSON.parse(await readFile(new URL('../data/architecture.json',import.meta.url),'utf8'));
const copy=()=>structuredClone(original);
test('canonical schema and explicit internal-connection targets',()=>{
 assert.deepEqual(validateArchitecture(original),{valid:true,errors:[]});
 const report=checkRules(original);assert.equal(report.passed,true);assert.equal(report.checked,7);
 assert.equal(report.mechanismValidated,false);assert.ok(report.unresolved.some(x=>x.caseId==='CASE-LAMP-CREDIT'));
 const e=copy().edges.find(x=>x.id==='L-CAL0');assert.equal(e.from,'P-STATE-CAL');assert.equal(e.to,'P-C0-CAL');
});
test('calibration retargeting to a valid but wrong node fails design contract',()=>{
 const d=copy();d.edges.find(e=>e.id==='L-CAL0').to='P-C1-CAL';
 assert.equal(validateArchitecture(d).valid,true);assert.equal(checkRules(d).passed,false);
});
for(const [name,mutate]of [
 ['dangling endpoint',d=>d.edges[0].to='NO-SUCH-PORT'],
 ['duplicate global ID',d=>d.ports[0].id=d.nodes[0].id],
 ['parent cycle',d=>d.nodes[0].parentId=d.nodes[0].id],
 ['invalid geometry',d=>d.nodes[0].position[0]=Infinity],
 ['wrong port direction',d=>d.edges[0].from='P-IN-RAW'],
 ['malformed optional array',d=>d.edges[0].legacyRefs={}],
 ['unknown source',d=>d.nodes[0].sourceIds=['MISSING-SOURCE']],
 ['missing required label',d=>delete d.nodes[0].label],
 ['duplicate case step',d=>d.cases[1].steps[0].id=d.cases[0].steps[0].id],
 ['dangling case rule',d=>d.cases[0].steps[0].ruleIds=['UNKNOWN']],
])test('reject '+name,()=>{const d=copy();mutate(d);assert.equal(validateArchitecture(d).valid,false);});
test('renaming or repositioning preserves stable identity',()=>{
 const d=copy();d.nodes[0].label='环境新名称';d.nodes[0].position[0]-=1;
 assert.equal(validateArchitecture(d,original).valid,true);assert.equal(d.nodes[0].id,original.nodes[0].id);
});
test('old IDs and tombstones cannot disappear or be reused',()=>{
 const d=copy();d.nodes=d.nodes.filter(x=>x.id!=='U-ETA-K');assert.equal(validateArchitecture(d,original).valid,false);
 const t=copy();t.tombstones=[];assert.equal(validateArchitecture(t,original).valid,false);
});
test('external change requires monotone version and append-only log',()=>{
 const d=copy();d.title+='测试';assert.equal(validateArchitecture(d,original,{external:true}).valid,false);
 d.version=nextVersion(original.version);d.changelog.push({version:d.version,date:new Date().toISOString(),summary:'测试外部更新',ids:['M-ENV']});
 assert.equal(validateArchitecture(d,original,{external:true}).valid,true);
 d.changelog[0].summary='改写历史';assert.equal(validateArchitecture(d,original,{external:true}).valid,false);
});
test('archive references do not masquerade as W01–W24 identities',()=>{
 assert.ok(original.edges.every(e=>!/^W\d\d$/.test(e.id)));
 assert.equal(original.tombstones[0].id,'DEPRECATED-B1');
 assert.equal(original.nodes.find(n=>n.id==='C-T0').status,'candidate');
 assert.equal(original.nodes.find(n=>n.id==='U-CREDIT').status,'unresolved');
 assert.ok(original.cases.every(c=>c.status==='unresolved'));
});
