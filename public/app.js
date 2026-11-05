import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {validateArchitecture} from '/shared/validate.mjs';

const $=id=>document.getElementById(id);
const S={data:null,revision:null,token:null,selectedId:null,scopeId:null,routeId:null,stepId:null,expanded:false,deprecated:false,demo:false,editing:false,editRevision:null,importData:null,importRevision:null};
const statusNames={confirmed:'已确认',candidate:'候选',unresolved:'未解决',deprecated:'已弃用'};
const statusColors={confirmed:0x63d8c1,candidate:0xf0b86b,unresolved:0xf08288,deprecated:0x708197};
const kindNames={nodes:'结构',ports:'端口',edges:'信号路径',tombstones:'历史引用',sources:'来源',decisions:'决策',views:'功能路径',rules:'结构规则',cases:'纸上案例',steps:'案例步骤'};
let index=new Map(),nodes=new Map(),ports=new Map(),world=new Map();
let renderer,scene,camera,controls,rootGroup,pickables=[],labels=[],particles=[],edgeCurves=new Map(),visibleIds=new Set();
const viewport=$('viewport');
function el(tag,className,text){const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;}
function button(text,fn,className=''){const b=el('button',className,text);b.addEventListener('click',fn);return b;}
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,4200);}
function banner(message){$('banner').textContent=message||'';$('banner').hidden=!message;}
function setup(){
  scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x0b1320,.007);
  camera=new THREE.PerspectiveCamera(43,1,.05,1000);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x0b1320,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-label','三维架构画布');renderer.domElement.setAttribute('role','img');viewport.prepend(renderer.domElement);
  controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=2;controls.maxDistance=140;controls.maxPolarAngle=Math.PI*.95;
  scene.add(new THREE.AmbientLight(0xa8c6e6,1.7));const key=new THREE.DirectionalLight(0xd4efff,3);key.position.set(10,20,25);scene.add(key);
  const grid=new THREE.GridHelper(100,50,0x294356,0x152638);grid.position.y=-11;grid.material.transparent=true;grid.material.opacity=.42;scene.add(grid);
  const starGeo=new THREE.BufferGeometry(),p=[];for(let i=0;i<180;i++){const a=(i*2.399963);p.push(Math.cos(a)*(26+i%23),-5+(i%31),Math.sin(a)*(26+i%23));}starGeo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0x7198b3,size:.045,transparent:true,opacity:.3}));scene.add(stars);
  new ResizeObserver(resize).observe(viewport);resize();
  let pointerDown=null;
  renderer.domElement.addEventListener('pointerdown',e=>pointerDown={x:e.clientX,y:e.clientY});
  renderer.domElement.addEventListener('click',e=>{if(pointerDown&&Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)>5)return;const id=hit(e);if(id)select(id);else{S.selectedId=null;S.editing=false;buildScene();renderInspector();renderTree();}});
  renderer.domElement.addEventListener('dblclick',e=>{const id=hit(e);if(id){const item=index.get(id);const n=item?.collection==='nodes'?item:item?.collection==='ports'?nodes.get(item.nodeId):null;if(n)enter(n.id);}});
  renderer.domElement.addEventListener('pointermove',e=>renderer.domElement.style.cursor=hit(e)?'pointer':'grab');
  animate();
}
function resize(){if(!renderer)return;const {width,height}=viewport.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}
function hit(e){const b=renderer.domElement.getBoundingClientRect(),mouse=new THREE.Vector2((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(mouse,camera);ray.params.Line.threshold=.15;const hits=ray.intersectObjects(pickables,false);return (hits.find(h=>!h.object.userData.shell)||hits[0])?.object.userData.id||null;}
function indexData(){
  index=new Map();for(const k of ['nodes','ports','edges','sources','decisions','tombstones','views','rules','cases'])for(const item of S.data[k]||[])index.set(item.id,{...item,collection:k});
  for(const c of S.data.cases||[])for(const step of c.steps)index.set(step.id,{...step,caseId:c.id,collection:'steps'});
  nodes=new Map([...index].filter(([,x])=>x.collection==='nodes'));ports=new Map([...index].filter(([,x])=>x.collection==='ports'));world=new Map();
  for(const n of nodes.values())nodePosition(n.id);
}
function nodePosition(id){if(world.has(id))return world.get(id);const n=nodes.get(id);if(!n)return new THREE.Vector3();const p=new THREE.Vector3(...n.position);if(n.parentId)p.add(nodePosition(n.parentId));world.set(id,p);return p;}
function portPosition(id){const p=ports.get(id);return p?nodePosition(p.nodeId).clone().add(new THREE.Vector3(...p.position)):new THREE.Vector3();}
function ancestors(id){const result=[];let n=nodes.get(id);while(n){result.push(n.id);n=nodes.get(n.parentId);}return result;}
function within(id,parent){return !parent||ancestors(id).includes(parent);}
function depth(id){return ancestors(id).length-1;}
function allowed(item){if(S.deprecated)return true;if(item.status==='deprecated')return false;const owner=item.nodeId||(nodes.has(item.id)?item.id:null);return !owner||ancestors(owner).every(id=>nodes.get(id)?.status!=='deprecated');}
function route(){return S.data.views.find(v=>v.id===S.routeId);}
function clearScene(){if(rootGroup){rootGroup.traverse(o=>{o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();});scene.remove(rootGroup);}rootGroup=new THREE.Group();scene.add(rootGroup);pickables=[];labels=[];particles=[];edgeCurves=new Map();visibleIds=new Set();$('labels').replaceChildren();}
function label(id,text,p,{kind='',priority=1,selected=false}={}){const n=el('button',`object-label ${kind}${selected?' selected':''}`);n.append(el('span','',text),el('span','id',id));n.dataset.objectId=id;n.setAttribute('aria-label',`${text} ${id}`);n.addEventListener('click',e=>{e.stopPropagation();select(id);});n.addEventListener('dblclick',e=>{e.stopPropagation();const item=index.get(id);if(item?.collection==='nodes')enter(id);});$('labels').append(n);labels.push({id,element:n,position:p,priority});}
function addNode(n,{context=false,force=false}={}){
  if(visibleIds.has(n.id))return;visibleIds.add(n.id);
  const pos=nodePosition(n.id),children=S.data.nodes.some(c=>c.parentId===n.id),selected=S.selectedId===n.id,edge=index.get(S.selectedId),endpoint=edge?.collection==='edges'&&[ports.get(edge.from)?.nodeId,ports.get(edge.to)?.nodeId].includes(n.id),color=selected||endpoint?0xffdf91:new THREE.Color(n.color);
  const shell=children&&(S.expanded||!S.scopeId||n.id===S.scopeId||force);
  const geom=new THREE.BoxGeometry(...n.size),mat=new THREE.MeshPhysicalMaterial({color,transparent:true,opacity:context?.035:shell?.055:.20,roughness:.35,metalness:.15,depthWrite:false,side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(geom,mat);mesh.position.copy(pos);mesh.userData.id=n.id;mesh.userData.shell=shell;rootGroup.add(mesh);pickables.push(mesh);
  const edgesGeom=new THREE.EdgesGeometry(geom),edgeMat=new THREE.LineBasicMaterial({color,transparent:true,opacity:context?.18:selected||endpoint?.95:shell?.34:.62});
  const outline=new THREE.LineSegments(edgesGeom,edgeMat);outline.position.copy(pos);rootGroup.add(outline);
  if(n.status==='unresolved'){outline.material.dispose();outline.material=new THREE.LineDashedMaterial({color:0xf08288,dashSize:.13,gapSize:.1,transparent:true,opacity:.7});outline.computeLineDistances();}
  const top=pos.clone().add(new THREE.Vector3(0,n.size[1]/2+.3,0));
  label(n.id,n.label,top,{kind:context?'context':shell?'shell':'',priority:selected?100:shell?7:5,selected});
  if(selected||endpoint){const glow=new THREE.Mesh(new THREE.BoxGeometry(...n.size.map(x=>x+.10)),new THREE.MeshBasicMaterial({color:0xffdf91,transparent:true,opacity:.055,depthWrite:false}));glow.position.copy(pos);rootGroup.add(glow);}
}
function addPort(p,{labelled=false,selected=false}={}){
  selected=selected||S.selectedId===p.id;
  if(visibleIds.has(p.id))return;visibleIds.add(p.id);
  const pos=portPosition(p.id),color=selected?0xffdf91:statusColors[p.status];
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(selected?.12:.085,12,10),new THREE.MeshBasicMaterial({color,transparent:true,opacity:selected?1:.8}));mesh.position.copy(pos);mesh.userData.id=p.id;rootGroup.add(mesh);pickables.push(mesh);
  const hitSphere=new THREE.Mesh(new THREE.SphereGeometry(.24,8,6),new THREE.MeshBasicMaterial({visible:false}));hitSphere.position.copy(pos);hitSphere.userData.id=p.id;rootGroup.add(hitSphere);pickables.push(hitSphere);
  if(labelled||selected)label(p.id,p.label,pos.clone().add(new THREE.Vector3(0,.32,0)),{kind:'port',priority:selected?99:8,selected});
}
function edgeVisible(e){if(!allowed(e)||!allowed(ports.get(e.from))||!allowed(ports.get(e.to)))return false;const step=index.get(S.stepId);if(step&&!step.edgeIds.includes(e.id)&&S.selectedId!==e.id)return false;const r=route();if(r?.edgeIds.length&&!r.edgeIds.includes(e.id)&&S.selectedId!==e.id)return false;if(!S.scopeId)return true;return within(ports.get(e.from).nodeId,S.scopeId)||within(ports.get(e.to).nodeId,S.scopeId)||S.selectedId===e.id;}
function addEdge(e,i){
  const a=portPosition(e.from),b=portPosition(e.to),selected=S.selectedId===e.id||index.get(S.stepId)?.edgeIds.includes(e.id),color=selected?0xffdf91:statusColors[e.status];
  let points;if(e.path?.length)points=[a,...e.path.map(p=>new THREE.Vector3(...p)),b];else{const delta=b.clone().sub(a),distance=delta.length(),lift=Math.min(distance*.18,1.8);const offset=new THREE.Vector3(0,lift,1.1+(i%4)*.45);points=[a,a.clone().addScaledVector(delta,.28).add(offset),a.clone().addScaledVector(delta,.72).add(offset),b];}
  const curve=new THREE.CatmullRomCurve3(points);edgeCurves.set(e.id,curve);visibleIds.add(e.id);
  if(e.status==='unresolved'||e.status==='deprecated'){
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(90)),new THREE.LineDashedMaterial({color,dashSize:.22,gapSize:.13,transparent:true,opacity:selected?1:.6}));line.computeLineDistances();rootGroup.add(line);
  }else{rootGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve,70,selected?.045:.022,6,false),new THREE.MeshBasicMaterial({color,transparent:true,opacity:selected?1:.57})));}
  const hitTube=new THREE.Mesh(new THREE.TubeGeometry(curve,50,.13,5,false),new THREE.MeshBasicMaterial({visible:false}));hitTube.userData.id=e.id;rootGroup.add(hitTube);pickables.push(hitTube);
  const arrowPoint=curve.getPoint(.82),tangent=curve.getTangent(.82).normalize(),arrow=new THREE.Mesh(new THREE.ConeGeometry(selected?.14:.10,selected?.4:.30,9),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9}));arrow.position.copy(arrowPoint);arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),tangent);rootGroup.add(arrow);
  const critical=/三因子|three.?factor/i.test(`${e.signal} ${e.label}`);
  for(const [portId,isTarget] of [[e.from,false],[e.to,true]]){const p=ports.get(portId);if(selected||(critical&&isTarget)){addNode(nodes.get(p.nodeId),{context:!within(p.nodeId,S.scopeId),force:true});}else if(S.scopeId&&!within(p.nodeId,S.scopeId)){const chain=ancestors(p.nodeId);addNode(nodes.get(chain.at(-1)),{context:true});}addPort(p,{labelled:selected||(critical&&isTarget),selected});}
  if(selected)label(e.id,e.label,curve.getPoint(.5).add(new THREE.Vector3(0,.4,0)),{kind:'edge',priority:101,selected:true});
  if(S.demo){const dot=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),new THREE.MeshBasicMaterial({color:0xdbfff5}));rootGroup.add(dot);particles.push({mesh:dot,curve,offset:i*.19});}
}
function buildScene(){
  if(!S.data||!renderer)return;clearScene();
  const r=route(),routeNodes=r?.edgeIds.length&&r?.nodeIds.length?new Set(r.nodeIds.flatMap(id=>ancestors(id))):null;
  for(const n of S.data.nodes){if(!allowed(n))continue;const d=depth(n.id),scopeDepth=S.scopeId?depth(S.scopeId):0;const show=S.scopeId?within(n.id,S.scopeId)&&(S.expanded||d<=scopeDepth+1):(S.expanded||d<=1);if(show&&(!routeNodes||routeNodes.has(n.id)||n.id===S.scopeId))addNode(n);}
  S.data.edges.filter(edgeVisible).sort((a,b)=>Number(b.id===S.selectedId)-Number(a.id===S.selectedId)).forEach(addEdge);
  const selected=index.get(S.selectedId);
  if(selected?.collection==='ports'){addNode(nodes.get(selected.nodeId),{force:true});addPort(selected,{selected:true});}
  if(selected?.collection==='nodes')addNode(selected,{force:true});
  // A focused module exposes its ports even when no route currently uses them.
  if(S.scopeId)for(const p of S.data.ports)if(allowed(p)&&visibleIds.has(p.nodeId)&&within(p.nodeId,S.scopeId))addPort(p,{labelled:S.expanded||p.nodeId===S.scopeId});
  renderBreadcrumbs();$('expand').textContent=S.expanded?'收起层级':'展开全部';
}
function frame({id=null}={}){
  let box=new THREE.Box3();const focus=id?nodes.get(id):S.scopeId?nodes.get(S.scopeId):null;
  if(focus)box.setFromCenterAndSize(nodePosition(focus.id),new THREE.Vector3(...focus.size).multiplyScalar(1.6));
  else for(const n of S.data.nodes.filter(n=>!n.parentId&&allowed(n)))box.union(new THREE.Box3().setFromCenterAndSize(nodePosition(n.id),new THREE.Vector3(...n.size)));
  const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),height=Math.max(size.y,size.x/camera.aspect,size.z),distance=height/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.30;
  camera.position.copy(center).add(new THREE.Vector3(.28,.17,1).normalize().multiplyScalar(Math.max(distance,8)));controls.target.copy(center);controls.update();
}
function frameEdge(id){const e=index.get(id);if(e?.collection!=='edges')return;const box=new THREE.Box3().setFromPoints([portPosition(e.from),portPosition(e.to),...(e.path||[]).map(p=>new THREE.Vector3(...p))]).expandByScalar(2),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),height=Math.max(size.y,size.x/camera.aspect,size.z),distance=height/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.35;camera.position.copy(center).add(new THREE.Vector3(.28,.17,1).normalize().multiplyScalar(Math.max(distance,8)));controls.target.copy(center);controls.update();}
function animate(time=0){requestAnimationFrame(animate);if(!renderer)return;controls.update();for(const p of particles)p.mesh.position.copy(p.curve.getPoint((time*.00013+p.offset)%1));renderer.render(scene,camera);const rect=viewport.getBoundingClientRect(),occupied=[];
  for(const l of [...labels].sort((a,b)=>b.priority-a.priority)){
    const p=l.position.clone().project(camera),x=(p.x*.5+.5)*rect.width,y=(-p.y*.5+.5)*rect.height;
    const inView=p.z<1&&p.z>-1&&x>5&&x<rect.width-5&&y>65&&y<rect.height-55;
    if(!inView){l.element.style.display='none';continue;}
    l.element.style.display='block';const w=l.element.offsetWidth,h=l.element.offsetHeight;let chosen=null;
    for(const dy of [0,-h-5,h+5,-2*(h+5),2*(h+5)]){const b={x:x-w/2,y:y+dy-h/2,w,h};if(b.y<62||b.y+h>rect.height-48)continue;if(!occupied.some(a=>b.x<a.x+a.w+4&&b.x+b.w+4>a.x&&b.y<a.y+a.h+3&&b.y+b.h+3>a.y)){chosen=b;break;}}
    if(!chosen){if(l.priority<90){l.element.style.display='none';continue;}chosen={x:x-w/2,y:y-h/2,w,h};}
    occupied.push(chosen);l.element.style.left=`${x}px`;l.element.style.top=`${chosen.y+h/2}px`;
  }
}
function select(id,{locate=false}={}){
  if(!index.has(id))return;S.selectedId=id;S.editing=false;const item=index.get(id);
  if(item.collection==='steps'){activateStep(item);return;}
  if(!['edges','ports','nodes'].includes(item.collection))S.stepId=null;
  if(locate){let owner=item.collection==='nodes'?item.id:item.collection==='ports'?item.nodeId:item.collection==='edges'?ports.get(item.to)?.nodeId:null;if(owner){const n=nodes.get(owner);S.scopeId=n.parentId;S.routeId=null;S.expanded=depth(owner)>1;buildScene();if(item.collection==='edges')frameEdge(item.id);else frame({id:n.parentId||owner});}}
  buildScene();renderInspector();renderTree();renderRoutes();
}
function enter(id){if(!nodes.has(id))return;S.scopeId=id;S.routeId=null;S.stepId=null;S.selectedId=id;S.expanded=false;S.editing=false;buildScene();frame();renderInspector();renderTree();renderRoutes();}
function renderBreadcrumbs(){const holder=$('breadcrumbs');holder.replaceChildren(button('整体架构',()=>{S.scopeId=null;S.expanded=false;buildScene();frame();renderInspector();}));if(S.scopeId)for(const id of ancestors(S.scopeId).reverse()){holder.append(el('span','','/'),button(nodes.get(id).label,()=>enter(id)));}}
function renderTree(){const holder=$('tree');holder.replaceChildren();function walk(parent,level){for(const n of S.data.nodes.filter(n=>n.parentId===parent&&allowed(n))){const row=el('div','tree-row');row.style.paddingLeft=`${level*11}px`;const dot=el('i',`status-dot ${n.status}`),b=button(n.label,()=>select(n.id,{locate:depth(n.id)>1}),S.selectedId===n.id?'selected':'');b.append(el('span','tree-id',n.id));b.addEventListener('dblclick',()=>enter(n.id));row.append(dot,b);holder.append(row);if(level<1||S.expanded||ancestors(S.selectedId).includes(n.id)||S.scopeId===n.id)walk(n.id,level+1);}}walk(null,0);}
function renderRoutes(){const holder=$('routes');holder.replaceChildren(button('完整架构',()=>{S.routeId=null;S.stepId=null;S.scopeId=null;S.selectedId=null;S.editing=false;buildScene();frame();renderRoutes();renderInspector();},!S.routeId&&!S.stepId?'active':''));for(const view of S.data.views){const b=button(view.label,()=>{S.routeId=view.id;S.stepId=null;S.scopeId=null;S.selectedId=null;S.editing=false;buildScene();frame();renderRoutes();renderInspector();},S.routeId===view.id?'active':'');b.dataset.viewId=view.id;holder.append(b);}renderContracts();}
function renderContracts(){let holder=$('contracts');if(!holder){holder=el('div');holder.id='contracts';$('routes').after(holder);}const open=new Set([...holder.querySelectorAll('details[open]')].map(d=>d.dataset.kind));holder.replaceChildren();for(const [key,title]of [['rules','结构规则'],['cases','纸上案例']]){if(!S.data[key]?.length)continue;const body=el('div','contract-list');for(const item of S.data[key]){const b=button(item.label,()=>select(item.id));b.dataset.contractId=item.id;body.append(b);}const d=detail(`${title} · ${S.data[key].length}`,body);d.dataset.kind=key;d.open=open.has(key);holder.append(d);}}
function activateStep(step){S.stepId=step.id;S.selectedId=step.caseId||S.data.cases.find(c=>c.steps.some(s=>s.id===step.id))?.id;S.routeId=null;S.scopeId=null;S.demo=false;$('demo').checked=false;S.editing=false;buildScene();frame();renderInspector();renderRoutes();}
function renderSearch(){const q=$('search').value.trim().toLowerCase(),holder=$('search-results');holder.replaceChildren();holder.hidden=!q;$('navigation').hidden=!!q;if(!q)return;const matches=[...index.values()].filter(x=>['nodes','ports','edges','tombstones','rules','cases','steps'].includes(x.collection)).filter(x=>[x.id,x.label,x.reason,...x.legacyRefs||[]].some(v=>String(v||'').toLowerCase().includes(q))).sort((a,b)=>(a.id.toLowerCase()===q?-1:0)-(b.id.toLowerCase()===q?-1:0)).slice(0,60);for(const item of matches){const b=button(item.label||item.id,()=>{select(item.id,{locate:true});$('search').blur();},'search-result');b.append(el('small','',`${item.id} · ${kindNames[item.collection]}`));b.dataset.resultId=item.id;holder.append(b);}if(!matches.length)holder.append(el('p','muted','无匹配结构或历史引用'));}
function detail(title,content){const d=el('details');d.append(el('summary','',title),content);return d;}
function safeLink(label,url){let u;try{u=new URL(url,location.origin);}catch{return el('span','',label);}if(!['https:','http:'].includes(u.protocol))return el('span','',label);const a=el('a','',label);a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';return a;}
function renderInspector(){
  const holder=$('inspection');holder.replaceChildren();const item=index.get(S.selectedId);
  if(!item){const overview=el('div','overview');overview.append(el('div','inspect-eyebrow','SYSTEM OVERVIEW'),el('div','empty-icon','◇'),el('h1','',route()?.label||S.data.title),el('p','',route()?.description||'把结构、信号与尚未解决的设计放在同一张空间图里。选择模块或路径，查看其引用与定义。'));const stats=el('div','stats');for(const [value,name] of [[S.data.nodes.filter(n=>n.kind==='module').length,'模块 / 层级'],[S.data.edges.length,'有向信号路径'],[S.data.ports.length,'具名端口'],[S.data.decisions.filter(d=>d.status==='unresolved').length,'待定义决策']]){const s=el('div','stat');s.append(el('b','',String(value)),el('span','',name));stats.append(s);}overview.append(stats,el('p','hint','三因子反馈的落点是 C0 吸引子内部连接。选择对应路径可高亮真正的起点与终点。'),el('p','muted','双击模块进入内部。功能路径复用同一个概念核心；动画仅用于阅读信号方向。'));holder.append(overview);return;}
  holder.append(el('div','inspect-eyebrow',`${kindNames[item.collection]} / INSPECTOR`),el('h1','',item.label||item.title||item.id),el('code','entity-id',item.id));
  const tags=el('div');if(item.status){const t=el('span','tag');t.append(el('i',`status-dot ${item.status}`),document.createTextNode(statusNames[item.status]));tags.append(t);}if(item.kind)tags.append(el('span','tag',item.kind));holder.append(tags);
  if(item.collection==='tombstones'){holder.append(el('p','',item.reason));for(const id of item.replacedBy||[])holder.append(button(`替代 → ${id}`,()=>select(id,{locate:true})));appendReferences(holder,item);return;}
  if(item.collection==='rules'){
    holder.append(el('p','',item.description),el('p','muted','结构契约检查；不计算神经机制，不代表纸上逻辑已完整跑通。'));
    for(const check of item.checks){const edge=index.get(check.edgeId);const good=check.type==='edge-target'?ports.get(edge.to)?.nodeId===check.nodeId:edge.decisionIds.includes(check.decisionId);const row=el('div','reference');row.append(el('strong',good?'':'bad',`${good?'✓':'!'} ${check.type==='edge-target'?'终点结构':'关联决定'} · ${good?'契约匹配':'契约不匹配'}`),button(check.edgeId,()=>select(check.edgeId,{locate:true})),el('code','',check.nodeId||check.decisionId));holder.append(row);}appendReferences(holder,item);return;
  }
  if(item.collection==='cases'){
    holder.append(el('p','',item.description),el('p','muted','逐步核对设计接线。点击仅高亮引用路径；不执行学习、推理或机制计算。'));
    for(const step of item.steps){const row=el('div',`case-step${S.stepId===step.id?' active':''}`),b=button(step.label,()=>activateStep({...step,caseId:item.id}));b.dataset.stepId=step.id;row.append(b,el('span',step.result==='unresolved'?'step-result unresolved-text':'step-result',step.result==='defined'?'已定接线':'机制未定'),el('code','',step.id),el('p','',step.note));for(const id of step.edgeIds)row.append(button(id,()=>{S.selectedId=id;buildScene();renderInspector();}));for(const id of step.ruleIds)row.append(button(id,()=>select(id)));holder.append(row);}appendReferences(holder,item);return;
  }
  if(S.editing){renderEditor(holder,item);return;}
  const actions=el('div','inspect-actions');
  if(item.collection==='nodes')actions.append(button('进入内部 ↗',()=>enter(item.id)));
  if(item.collection==='ports')actions.append(button('定位所属结构',()=>select(item.nodeId,{locate:true})));
  actions.append(button('复制引用',()=>copyReference(item)));if(['nodes','ports','edges'].includes(item.collection))actions.append(button('编辑',()=>{S.editing=true;S.editRevision=S.revision;renderInspector();}));holder.append(actions);
  if(item.collection==='edges'){
    for(const [title,portId] of [['起点 / FROM',item.from],['终点 / TO',item.to]]){const p=ports.get(portId),n=nodes.get(p.nodeId),block=el('div','endpoint');block.append(el('small','',title),button(`${n.label} · ${p.label}`,()=>select(p.id,{locate:true})),el('code','',`${n.id} / ${p.id}`));holder.append(block);}
    holder.append(el('div','signal',`signal: ${item.signal}`));
    if(item.legacyRefs?.length)holder.append(el('p','muted',`旧资料追溯：${item.legacyRefs.join(' · ')}（语义以当前定义为准）`));
  }else if(item.collection==='ports'){holder.append(el('div','signal',`${item.direction} · ${item.signal}`),el('p','muted',`所属结构：${item.nodeId}`));}
  if(item.description)holder.append(el('p','',item.description));
  if(item.tags?.length)holder.append(el('p','muted',item.tags.join(' · ')));
  if(item.notes?.length)holder.append(detail('结构备注',el('p','',item.notes.join('\n'))));
  if(item.collection==='nodes'){
    const children=S.data.nodes.filter(n=>n.parentId===item.id),owned=S.data.ports.filter(p=>p.nodeId===item.id);
    if(children.length){const c=el('div','inspect-actions');for(const n of children)c.append(button(`${n.label} · ${n.id}`,()=>select(n.id,{locate:true})));holder.append(detail(`内部结构 · ${children.length}`,c));}
    if(owned.length){const c=el('div','inspect-actions');for(const p of owned)c.append(button(`${p.label} · ${p.id}`,()=>select(p.id)));holder.append(detail(`端口 · ${owned.length}`,c));}
  }
  appendReferences(holder,item);
}
function appendReferences(holder,item){
  if(item.decisionIds?.length){const contents=el('div');for(const id of item.decisionIds){const d=index.get(id),block=el('div','reference');block.append(el('strong','',d.title),el('code','',`${id} · ${statusNames[d.status]}`),el('div','',d.description));contents.append(block);}holder.append(detail(`设计决定 · ${item.decisionIds.length}`,contents));}
  if(item.sourceIds?.length){const contents=el('div');for(const id of item.sourceIds){const s=index.get(id),block=el('div','reference');block.append(el('strong','',s.title),el('code','',id));if(s.locator)block.append(el('div','', ''),safeLink(s.locator,s.locator));if(s.summary)block.append(el('div','',s.summary));contents.append(block);}holder.append(detail(`资料来源 · ${item.sourceIds.length}`,contents));}
}
async function copyReference(item){let value=`${item.label||item.id} [${item.id}]`;if(item.collection==='edges')value+=`\n${item.from} (${ports.get(item.from).nodeId}) → ${item.to} (${ports.get(item.to).nodeId})\nsignal: ${item.signal}`;if(item.collection==='ports')value+=`\nowner: ${item.nodeId}`;value+=`\narchitecture: ${S.data.architectureId}@${S.data.version}`;try{await navigator.clipboard.writeText(value);toast('已复制稳定 ID 与引用');}catch{toast('剪贴板不可用，请复制面板内 ID');}}
function renderEditor(holder,item){
  const form=el('form'),fields={};form.append(el('p','muted','ID 与结构身份固定。保存后自动增加版本并保留历史快照。'));
  for(const key of ['label','status','description',...(item.collection==='edges'?['from','to']:[])]){
    const names={label:'显示名称',status:'设计状态',description:'描述',from:'起点端口',to:'终点端口'},l=el('label','field',names[key]);let input;
    if(key==='status'){input=el('select');for(const s of Object.keys(statusNames)){const option=el('option','',statusNames[s]);option.value=s;input.append(option);}}
    else if(key==='from'||key==='to'){input=el('select');for(const p of S.data.ports.filter(p=>key==='from'?p.direction!=='in':p.direction!=='out')){const option=el('option','',`${p.id} · ${p.label}`);option.value=p.id;input.append(option);}}
    else input=el(key==='description'?'textarea':'input');input.name=key;input.value=item[key]||'';fields[key]=input;l.append(input);form.append(l);
  }
  const actions=el('div','inspect-actions'),save=el('button','primary','保存新版本');save.type='submit';actions.append(save,button('取消',()=>{S.editing=false;renderInspector();}));actions.lastChild.type='button';form.append(actions);
  form.addEventListener('submit',async e=>{e.preventDefault();save.disabled=true;const candidate=structuredClone(S.data),record=candidate[item.collection].find(x=>x.id===item.id);for(const [key,input]of Object.entries(fields))record[key]=input.value;try{await saveData(candidate,S.editRevision,`编辑 ${item.id}`,[item.id]);S.editing=false;renderInspector();toast(`已保存版本 ${S.data.version}`);}catch(error){toast(error.message);}finally{save.disabled=false;}});holder.append(form);
}
async function api(url,options={}){const response=await fetch(url,{...options,headers:{'Content-Type':'application/json','X-Workbench-Token':S.token||'',...options.headers}});const result=await response.json();if(!response.ok)throw new Error([result.error,...result.errors||[]].join('\n'));return result;}
function applyData(payload,{initial=false}={}){const keepScope=S.scopeId,keepSelected=S.selectedId;S.data=payload.data;S.revision=payload.revision;S.token=payload.token||S.token;indexData();if(!index.has(keepSelected))S.selectedId=null;if(!nodes.has(keepScope))S.scopeId=null;$('version').textContent=`v${S.data.version}`;$('notice').textContent=S.data.notice;$('count').textContent=`${S.data.nodes.length}N / ${S.data.edges.length}L`;buildScene();renderRoutes();renderTree();renderSearch();if(!S.editing)renderInspector();if(initial)frame();$('loading').hidden=true;}
function renderGit(git){if(!git)return;const label=$('git-meta');label.textContent=!git.initialized?'Git · 未建库':`${git.branch} · ${git.commit||'无提交'}${git.dirty?' · 未提交':''}`;label.title=!git.initialized?'项目目录尚未建立独立 Git 仓库':`分支：${git.branch}\n提交：${git.commit||'无'}\n${git.dirty?`${git.changedFiles} 个文件有未提交变更`:'工作区干净'}\n规范数据：${git.tracked?'已跟踪':'未跟踪'}`;label.classList.toggle('dirty',!!git.dirty);}
async function load({manual=false,initial=false}={}){try{const result=await api('/api/architecture');renderGit(result.git);banner(result.sourceError);if(result.data&&result.revision!==S.revision){const wasEditing=S.editing;applyData(result,{initial});if(wasEditing)banner('源文件已更新。当前编辑保留；保存将检查版本冲突，请取消后重新编辑。');else if(!initial)toast('源文件变更已同步');}else if(manual)toast(result.sourceError?'源文件无效，保留当前有效场景':'已读取最新源文件');}catch(e){banner(e.message);if(initial){$('loading').textContent='暂时无法载入架构。请检查源文件，工作台会自动重试。';}}}
async function saveData(data,baseRevision,summary,ids=[]){const result=await api('/api/architecture',{method:'PUT',body:JSON.stringify({data,baseRevision,summary,ids})});applyData(result);banner(null);}
async function previewImport(file){try{if(file.size>4*1024*1024)throw new Error('文件超过 4 MB');const candidate=JSON.parse(await file.text()),local=validateArchitecture(candidate,S.data);S.importData=candidate;S.importRevision=S.revision;const result=local.valid?await api('/api/validate',{method:'POST',body:JSON.stringify({data:candidate})}):local;$('import-summary').textContent=result.valid?`${file.name} · ${candidate.nodes.length} 个结构 / ${candidate.ports.length} 个端口 / ${candidate.edges.length} 条路径`:`${file.name} · 校验未通过`;$('import-validation').textContent=result.valid?`校验通过\n架构：${candidate.architectureId}\n文件版本：${candidate.version}\n保存基于：${S.data.version}\n现有 ID 与端点引用完整，尚未写入。`:result.errors.join('\n');$('apply-import').disabled=!result.valid;$('import-dialog').showModal();}catch(e){toast(`导入失败：${e.message}`);}}
function exportData(){const blob=new Blob([JSON.stringify(S.data,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${S.data.architectureId}-${S.data.version}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已导出当前有效架构');}

$('search').addEventListener('input',renderSearch);$('reset').addEventListener('click',()=>frame());$('refresh').addEventListener('click',()=>load({manual:true}));$('expand').addEventListener('click',()=>{S.expanded=!S.expanded;buildScene();renderTree();});$('show-deprecated').addEventListener('change',e=>{S.deprecated=e.target.checked;buildScene();renderTree();});$('demo').addEventListener('change',e=>{S.demo=e.target.checked;buildScene();});$('export').addEventListener('click',()=>S.data&&exportData());$('import').addEventListener('click',()=>$('import-file').click());$('import-file').addEventListener('change',e=>{if(e.target.files[0])previewImport(e.target.files[0]);e.target.value='';});
for(const id of ['close-import','cancel-import'])$(id).addEventListener('click',()=>$('import-dialog').close());
$('apply-import').addEventListener('click',async()=>{const b=$('apply-import');b.disabled=true;try{await saveData(S.importData,S.importRevision,'导入架构 JSON');$('import-dialog').close();S.editing=false;renderInspector();frame();toast(`导入完成 · v${S.data.version}`);}catch(e){$('import-validation').textContent=e.message;}finally{b.disabled=false;}});
document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;if(e.key==='/'){e.preventDefault();$('search').focus();}if(e.key==='Escape'){if(S.scopeId){S.scopeId=nodes.get(S.scopeId).parentId;S.selectedId=S.scopeId;S.expanded=false;S.editing=false;buildScene();frame();renderInspector();}else{S.selectedId=null;S.editing=false;buildScene();renderInspector();}}});
window.__workbench={get selectedId(){return S.selectedId;},get scopeId(){return S.scopeId;},get revision(){return S.revision;},get version(){return S.data?.version;},get data(){return structuredClone(S.data);},get visibleIds(){return [...visibleIds];},get camera(){return {position:camera?.position.toArray(),target:controls?.target.toArray()};},project(id){let p;const item=index.get(id);if(item?.collection==='nodes')p=nodePosition(id).clone();else if(item?.collection==='ports')p=portPosition(id);else if(item?.collection==='edges')p=edgeCurves.get(id)?.getPoint(.5);if(!p)return null;p.project(camera);const r=viewport.getBoundingClientRect();return {x:r.left+(p.x*.5+.5)*r.width,y:r.top+(-p.y*.5+.5)*r.height,visible:p.z>-1&&p.z<1};},endpoints(id){const e=index.get(id);return e?.collection==='edges'?{from:e.from,to:e.to,fromOwner:ports.get(e.from).nodeId,toOwner:ports.get(e.to).nodeId,fromPosition:portPosition(e.from).toArray(),toPosition:portPosition(e.to).toArray()}:null;}};
try{setup();await load({initial:true});setInterval(()=>load({initial:!S.data}),1000);}catch(e){$('loading').textContent=`三维渲染初始化失败：${e.message}`;banner('请使用支持 WebGL 的现代浏览器打开本地工作台。');console.error(e);}
