export const STATUSES = ['confirmed','candidate','unresolved','deprecated'];
export function validateArchitecture(data, previous = null, options = {}) {
  const errors = [];
  const fail = (path,message) => errors.push(`${path}: ${message}`);
  const object = x => x && typeof x === 'object' && !Array.isArray(x);
  if (!object(data)) return {valid:false,errors:['根对象必须是 JSON 对象']};
  if (data.schemaVersion !== 1) fail('schemaVersion','仅支持版本 1');
  for(const k of ['architectureId','version','updatedAt','title','notice']) if(typeof data[k] !== 'string' || !data[k].trim()) fail(k,'需要非空字符串');
  if(typeof data.version === 'string' && !/^\d+\.\d+\.\d+$/.test(data.version)) fail('version','使用 x.y.z 格式');
  if(!Number.isFinite(Date.parse(data.updatedAt))) fail('updatedAt','需要 ISO 日期');
  const collections=['sources','decisions','nodes','ports','edges','views','changelog','tombstones',...['rules','cases'].filter(k=>data[k]!==undefined)];
  for(const k of collections) if(!Array.isArray(data[k])) fail(k,'需要数组');
  if(errors.length) return {valid:false,errors};
  const byId=new Map(), typed={};
  const requiredText={sources:['title','locator','summary'],decisions:['title','description'],nodes:['label','description'],ports:['label','description','signal'],edges:['label','description','signal'],views:['label','description'],tombstones:['kind','reason'],rules:['label','description'],cases:['label','description']};
  for(const k of collections.filter(k=>k!=='changelog')) {
    typed[k]=new Map();
    for(const [i,item] of data[k].entries()) {
      const p=`${k}[${i}]`;
      if(!object(item)) {fail(p,'需要对象');continue;}
      if(typeof item.id!=='string'||!item.id.trim()||item.id.length>160) {fail(p+'.id','需要 1–160 字符 ID');continue;}
      if(byId.has(item.id)) fail(p+'.id',`重复 ID ${item.id}`);
      byId.set(item.id,item);typed[k].set(item.id,item);
      for(const field of requiredText[k]||[])if(typeof item[field]!=='string'||(['title','label','signal','kind'].includes(field)&&!item[field].trim()))fail(p+'.'+field,'需要字符串'+(['title','label','signal','kind'].includes(field)?'且不能为空':''));
      for(const field of ['tags','notes','legacyRefs']) if(item[field]!==undefined&&(!Array.isArray(item[field])||item[field].some(x=>typeof x!=='string')))fail(p+'.'+field,'需要字符串数组');
      for(const field of ['label','title','description','summary','reason','locator','signal']) if(item[field]!==undefined && typeof item[field]!=='string') fail(p+'.'+field,'必须是字符串');
    }
  }
  const refs=(item,field,map,p,required=true)=>{
    if(!Array.isArray(item[field])) {if(required) fail(p+'.'+field,'需要数组');return;}
    for(const id of item[field]) if(typeof id!=='string'||!map.has(id)) fail(p+'.'+field,`引用不存在 ${id}`);
  };
  const vector=(v,p,positive=false)=>{if(!Array.isArray(v)||v.length!==3||v.some(n=>typeof n!=='number'||!Number.isFinite(n)||(positive&&n<=0)||Math.abs(n)>100000)) fail(p,'需要三个有限数值'+(positive?'且均大于零':''));};
  for(const k of ['decisions','nodes','ports','edges','rules','cases']) for(const item of data[k]||[]) {
    if(!object(item))continue;
    const p=`${k}.${item.id}`;
    if(!STATUSES.includes(item.status)) fail(p+'.status','未知状态');
    refs(item,'sourceIds',typed.sources,p);
    if(k!=='decisions') refs(item,'decisionIds',typed.decisions,p);
  }
  for(const item of data.sources) if(object(item)&&!['user','library','page','design'].includes(item.kind))fail(`sources.${item.id}.kind`,'未知来源类型');
  for(const n of data.nodes) {
    if(!object(n))continue;
    const p=`nodes.${n.id}`;
    if(!['module','structure','placeholder'].includes(n.kind)) fail(p+'.kind','未知节点类型');
    if(n.parentId!==null&&!typed.nodes.has(n.parentId))fail(p+'.parentId','父节点不存在');
    vector(n.position,p+'.position');vector(n.size,p+'.size',true);
    if(typeof n.color!=='string'||!/^#[\da-f]{6}$/i.test(n.color)) fail(p+'.color','需要 #RRGGBB 颜色');
    const seen=new Set([n.id]);let parent=n.parentId;
    while(parent&&typed.nodes.has(parent)) {if(seen.has(parent)){fail(p+'.parentId','父层级存在循环');break;}seen.add(parent);parent=typed.nodes.get(parent).parentId;}
  }
  for(const p of data.ports) {
    if(!object(p))continue;
    if(!typed.nodes.has(p.nodeId)) fail(`ports.${p.id}.nodeId`,'所属节点不存在');
    if(!['in','out','bidirectional'].includes(p.direction))fail(`ports.${p.id}.direction`,'未知方向');
    vector(p.position,`ports.${p.id}.position`);
  }
  for(const e of data.edges) {
    if(!object(e))continue;
    const a=typed.ports.get(e.from),b=typed.ports.get(e.to);
    if(!a)fail(`edges.${e.id}.from`,'起点端口不存在');else if(a.direction==='in')fail(`edges.${e.id}.from`,'起点不能是输入端口');
    if(!b)fail(`edges.${e.id}.to`,'终点端口不存在');else if(b.direction==='out')fail(`edges.${e.id}.to`,'终点不能是输出端口');
    if(e.path!==undefined) {if(!Array.isArray(e.path))fail(`edges.${e.id}.path`,'需要控制点数组');else e.path.forEach((p,i)=>vector(p,`edges.${e.id}.path[${i}]`));}
  }
  for(const v of data.views) if(object(v)){refs(v,'nodeIds',typed.nodes,`views.${v.id}`);refs(v,'edgeIds',typed.edges,`views.${v.id}`);}
  for(const rule of data.rules||[])if(object(rule)){
    const p=`rules.${rule.id}`;
    if(!Array.isArray(rule.checks)){fail(p+'.checks','需要数组');continue;}
    for(const check of rule.checks){
      if(!object(check)){fail(p+'.checks','需要对象');continue;}
      if(!['edge-target','edge-decision'].includes(check.type))fail(p+'.checks.type','未知规则类型');
      if(!typed.edges.has(check.edgeId))fail(p+'.checks.edgeId',`路径不存在 ${check.edgeId}`);
      if(check.type==='edge-target'&&!typed.nodes.has(check.nodeId))fail(p+'.checks.nodeId',`结构不存在 ${check.nodeId}`);
      if(check.type==='edge-decision'&&!typed.decisions.has(check.decisionId))fail(p+'.checks.decisionId',`决策不存在 ${check.decisionId}`);
    }
  }
  const steps=new Map();
  for(const c of data.cases||[])if(object(c)){
    const p=`cases.${c.id}`;if(!Array.isArray(c.steps)){fail(p+'.steps','需要数组');continue;}
    for(const step of c.steps){if(!object(step)){fail(p+'.steps','需要对象');continue;}
      if(typeof step.id!=='string'||!step.id.trim()||byId.has(step.id))fail(p+'.steps.id',`步骤 ID 无效或重复 ${step.id}`);
      else{byId.set(step.id,step);steps.set(step.id,step);}
      if(typeof step.label!=='string'||!step.label.trim()||typeof step.note!=='string')fail(p+'.steps','需要 label 和 note 字符串');
      if(!['defined','unresolved'].includes(step.result))fail(p+'.steps.result','仅允许 defined 或 unresolved');
      refs(step,'edgeIds',typed.edges,p+'.'+step.id);refs(step,'ruleIds',typed.rules||new Map(),p+'.'+step.id);
    }
  }
  for(const t of data.tombstones) if(object(t)){refs(t,'sourceIds',typed.sources,`tombstones.${t.id}`);refs(t,'replacedBy',byId,`tombstones.${t.id}`);}
  for(const [i,c] of data.changelog.entries()) {
    const p=`changelog[${i}]`;if(!object(c)){fail(p,'需要对象');continue;}
    if(typeof c.version!=='string'||!/^\d+\.\d+\.\d+$/.test(c.version))fail(p+'.version','需要 x.y.z 格式');
    if(typeof c.date!=='string'||!Number.isFinite(Date.parse(c.date)))fail(p+'.date','需要有效日期');
    if(typeof c.summary!=='string'||!c.summary.trim())fail(p+'.summary','需要非空说明');
    refs(c,'ids',byId,p);
  }
  if(!data.changelog.some(c=>c?.version===data.version))fail('changelog','缺少当前版本的变更记录');
  if(previous) {
    if(data.architectureId!==previous.architectureId)fail('architectureId','不能替换架构身份');
    for(const k of ['sources','decisions','nodes','ports','edges','views','rules','cases'])for(const old of previous[k]||[]){
      if(!typed[k]?.has(old.id)&&!typed.tombstones.has(old.id))fail(k,`现有 ID ${old.id} 不可删除；请标记 deprecated 或保留 tombstone`);
      if(byId.has(old.id)&&!typed[k]?.has(old.id)&&!typed.tombstones.has(old.id))fail(k,`ID ${old.id} 不可改为其他实体类型`);
    }
    for(const c of previous.cases||[])for(const step of c.steps||[])if(!steps.has(step.id)&&!typed.tombstones.has(step.id))fail('cases',`步骤 ID ${step.id} 不可删除`);
    for(const old of previous.tombstones||[])if(!typed.tombstones.has(old.id))fail('tombstones',`历史 ID ${old.id} 必须保留，不可删除或复用`);
    for(const [i,old]of (previous.changelog||[]).entries())if(JSON.stringify(data.changelog[i])!==JSON.stringify(old))fail('changelog',`历史变更记录 ${old.version} 不可删除或改写`);
    if(options.external){
      const compare=(a,b)=>{const x=a.split('.').map(Number),y=b.split('.').map(Number);for(let i=0;i<3;i++){if(x[i]!==y[i])return x[i]-y[i];}return 0;};
      if(compare(data.version,previous.version)<=0)fail('version','外部修改必须显式增加版本');
      if(data.changelog.length<previous.changelog.length+1)fail('changelog','外部修改必须追加变更记录');
    }
  }
  return {valid:errors.length===0,errors};
}
export function nextVersion(version){const p=version.split('.').map(Number);p[2]++;return p.join('.');}
