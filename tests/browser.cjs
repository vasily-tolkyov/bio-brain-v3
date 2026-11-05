/* Real browser interactions; run against an isolated ARCHITECTURE_FILE copy. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.env.WORKBENCH_ROOT||path.resolve(__dirname,'..');
const url=process.env.WORKBENCH_URL||'http://127.0.0.1:4318';
const fixture=path.join(root,'.test-work','architecture.json');
const output=path.join(root,'evidence');
const checks=[],errors=[];
let browser,page;
async function check(name,fn){await fn();checks.push({name,passed:true});console.log('PASS',name);}
async function search(id){await page.locator('#search').fill(id);await page.locator(`[data-result-id="${id}"]`).click();await page.waitForFunction(id=>window.__workbench.selectedId===id,id);}
async function clearSearch(){await page.locator('#search').fill('');await page.locator('#search').blur();}
const snapshot=()=>page.evaluate(()=>({camera:window.__workbench.camera,version:window.__workbench.version,selectedId:window.__workbench.selectedId}));
const waitScene=()=>page.waitForTimeout(450);
(async()=>{
 await fs.mkdir(output,{recursive:true});
 browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{}),args:['--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:1600,height:1000}});
 await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:url});
 page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForFunction(()=>window.__workbench?.data);await waitScene();
 const start=await page.evaluate(()=>window.__workbench.data);
 await check('WebGL scene loads with canonical data',async()=>{assert.equal(await page.locator('#loading').isHidden(),true);assert.equal(start.architectureId,'concept-state-network');assert.equal(start.nodes.length,43);});
 await page.screenshot({path:path.join(output,'01-overview.png')});
 await check('mouse rotates, wheel zooms, right-drag pans',async()=>{
  const b=await page.locator('#viewport').boundingBox();const x=b.x+100,y=b.y+b.height*.68;
  const a=await snapshot();await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+130,y-40,{steps:12});await page.mouse.up();await waitScene();const rotated=await snapshot();assert.notDeepEqual(a.camera.position,rotated.camera.position);
  await page.mouse.wheel(0,-300);await waitScene();const zoomed=await snapshot();assert.notDeepEqual(rotated.camera.position,zoomed.camera.position);
  await page.mouse.move(x,y);await page.mouse.down({button:'right'});await page.mouse.move(x+60,y+20,{steps:8});await page.mouse.up({button:'right'});await waitScene();assert.notDeepEqual(zoomed.camera.target,(await snapshot()).camera.target);
  await page.locator('#reset').click();
 });
 await check('real canvas click selects directed edge',async()=>{
  await waitScene();const p=await page.evaluate(()=>window.__workbench.project('L-EXECUTE'));assert.ok(p.visible);await page.mouse.click(p.x,p.y);await page.waitForFunction(()=>window.__workbench.selectedId==='L-EXECUTE');
 });
 await check('search calibration edge highlights real internal endpoints and copies reference',async()=>{
  await search('L-CAL0');const endpoints=await page.evaluate(()=>window.__workbench.endpoints('L-CAL0'));assert.equal(endpoints.toOwner,'S-C0-SYN');assert.equal(endpoints.fromOwner,'S-SOURCE');
  const visible=await page.evaluate(()=>window.__workbench.visibleIds);assert.ok(visible.includes('P-C0-CAL')&&visible.includes('P-STATE-CAL'));
  assert.match(await page.locator('#inspection').innerText(),/P-C0-CAL/);
  await page.getByRole('button',{name:'复制引用',exact:true}).click();const clip=await page.evaluate(()=>navigator.clipboard.readText());assert.match(clip,/L-CAL0/);assert.match(clip,/P-STATE-CAL/);assert.match(clip,/P-C0-CAL/);
 });
 await clearSearch();await waitScene();await page.screenshot({path:path.join(output,'02-internal-calibration.png')});
 await check('drill into C0 and attractor then return; repeated three times',async()=>{
  for(let i=0;i<3;i++){
   await search('C0');await page.getByRole('button',{name:'进入内部 ↗',exact:true}).click();await page.waitForFunction(()=>window.__workbench.scopeId==='C0');
   await search('S-C0-ATTR');await page.getByRole('button',{name:'进入内部 ↗',exact:true}).click();await page.waitForFunction(()=>window.__workbench.scopeId==='S-C0-ATTR');
   assert.ok((await page.evaluate(()=>window.__workbench.visibleIds)).includes('S-C0-N1'));
   if(i===0){await clearSearch();await waitScene();await page.screenshot({path:path.join(output,'03-attractor-interior.png')});}
   await page.locator('#breadcrumbs').getByRole('button',{name:'整体架构',exact:true}).click();await page.waitForFunction(()=>window.__workbench.scopeId===null);
  }
 });
 await check('functional routes share same concept nodes',async()=>{
  await clearSearch();await page.locator('[data-view-id="V-CAL"]').click();const ids=await page.evaluate(()=>window.__workbench.visibleIds);assert.ok(ids.includes('L-CAL0')&&ids.includes('L-CAL1')&&ids.includes('L-CAL2'));assert.ok(!ids.includes('L-SENSE'));
  await page.locator('[data-view-id="V-GOAL"]').click();assert.ok((await page.evaluate(()=>window.__workbench.visibleIds)).includes('M-CONCEPT'));
 });
 await check('case steps distinguish unresolved credit assignment and disable animation',async()=>{
  await search('CASE-LAMP-CREDIT');await page.locator('#demo').check();
  await page.locator('#inspection [data-step-id="STEP-LAMP-3"]').click();
  assert.equal(await page.locator('#demo').isChecked(),false);assert.match(await page.locator('#inspection').innerText(),/未定|未解决/);
  assert.ok((await page.evaluate(()=>window.__workbench.visibleIds)).includes('L-CAL0'));
 });
 await clearSearch();await waitScene();await page.screenshot({path:path.join(output,'04-unresolved-credit-case.png')});
 await check('local edit changes label and status while keeping ID',async()=>{
  await search('M-IN');await page.getByRole('button',{name:'编辑',exact:true}).click();await page.locator('[name="label"]').fill('感觉入口 · 测试变更');await page.locator('[name="status"]').selectOption('candidate');
  await page.getByRole('button',{name:'保存新版本',exact:true}).click();await page.waitForFunction(()=>window.__workbench.data.nodes.find(n=>n.id==='M-IN').label==='感觉入口 · 测试变更');
  assert.equal(await page.evaluate(()=>window.__workbench.data.nodes.find(n=>n.id==='M-IN').status),'candidate');
 });
 await check('export JSON roundtrip validates and imports a changed wire without ID loss',async()=>{
  const dlPromise=page.waitForEvent('download');await page.locator('#export').click();const dl=await dlPromise;const dest=path.join(root,'.test-work','roundtrip.json');await dl.saveAs(dest);
  const d=JSON.parse(await fs.readFile(dest,'utf8'));assert.equal(d.nodes.find(n=>n.id==='M-IN').label,'感觉入口 · 测试变更');
  d.edges.find(e=>e.id==='L-RETURN').label='返回通路 · 导入验证';await fs.writeFile(dest,JSON.stringify(d));
  await page.locator('#import-file').setInputFiles(dest);await page.locator('#import-dialog').waitFor({state:'visible'});assert.equal(await page.locator('#apply-import').isEnabled(),true);await page.locator('#apply-import').click();
  await page.waitForFunction(()=>window.__workbench.data.edges.find(e=>e.id==='L-RETURN').label==='返回通路 · 导入验证');
  assert.deepEqual((await page.evaluate(()=>window.__workbench.data.edges.map(e=>e.id))).sort(),start.edges.map(e=>e.id).sort());
 });
 await check('invalid import is rejected without mutating active data',async()=>{
  const version=await page.evaluate(()=>window.__workbench.version);const d=await page.evaluate(()=>window.__workbench.data);d.edges[0].to='DANGLING';
  const dest=path.join(root,'.test-work','invalid.json');await fs.writeFile(dest,JSON.stringify(d));await page.locator('#import-file').setInputFiles(dest);await page.locator('#import-dialog').waitFor({state:'visible'});assert.equal(await page.locator('#apply-import').isDisabled(),true);assert.match(await page.locator('#import-validation').innerText(),/不存在/);await page.locator('#cancel-import').click();assert.equal(await page.evaluate(()=>window.__workbench.version),version);
 });
 await check('external file change refreshes scene with the same module ID',async()=>{
  const d=JSON.parse(await fs.readFile(fixture,'utf8'));d.nodes.find(n=>n.id==='M-IN').label='感觉入口 · 文件刷新';const v=d.version.split('.').map(Number);v[2]++;d.version=v.join('.');d.updatedAt=new Date().toISOString();d.changelog.push({version:d.version,date:d.updatedAt,summary:'隔离数据的文件刷新测试',ids:['M-IN']});await fs.writeFile(fixture,JSON.stringify(d,null,2));
  await page.waitForFunction(()=>window.__workbench.data.nodes.find(n=>n.id==='M-IN').label==='感觉入口 · 文件刷新');assert.equal(await page.evaluate(()=>window.__workbench.version),d.version);
 });
 await check('malformed external file preserves last valid scene and recovers',async()=>{
  const good=await fs.readFile(fixture,'utf8'),version=await page.evaluate(()=>window.__workbench.version);await fs.writeFile(fixture,'{bad json');await page.waitForFunction(()=>!document.getElementById('banner').hidden);assert.equal(await page.evaluate(()=>window.__workbench.version),version);
  await fs.writeFile(fixture,good);await page.waitForFunction(()=>document.getElementById('banner').hidden);
 });
 await check('write token, Origin and concurrent revision protections',async()=>{
  const initial=await(await fetch(url+'/api/architecture')).json();const payload={data:initial.data,baseRevision:initial.revision};
  assert.equal((await fetch(url+'/api/architecture',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})).status,403);
  assert.equal((await fetch(url+'/api/architecture',{method:'PUT',headers:{'Content-Type':'application/json','X-Workbench-Token':initial.token,Origin:'https://example.invalid'},body:JSON.stringify(payload)})).status,403);
  assert.equal((await fetch(url+'/api/architecture',{method:'PUT',headers:{'Content-Type':'application/json','X-Workbench-Token':initial.token},body:JSON.stringify({...payload,baseRevision:'stale'})})).status,409);
 });
 await check('deprecated modules hide descendants and wires until explicitly enabled',async()=>{
  const a=await(await fetch(url+'/api/architecture')).json();a.data.nodes.find(n=>n.id==='M-IN').status='deprecated';
  const saved=await fetch(url+'/api/architecture',{method:'PUT',headers:{'Content-Type':'application/json','X-Workbench-Token':a.token},body:JSON.stringify({data:a.data,baseRevision:a.revision,summary:'隔离测试退役显示',ids:['M-IN']})});assert.equal(saved.status,200);
  await page.waitForFunction(()=>window.__workbench.data.nodes.find(n=>n.id==='M-IN').status==='deprecated');await clearSearch();await page.locator('#routes > button').first().click();
  const hidden=await page.evaluate(()=>window.__workbench.visibleIds);assert.ok(!hidden.includes('M-IN')&&!hidden.includes('S-IN-SPARSE')&&!hidden.includes('L-SENSE'));
  await page.locator('#show-deprecated').check();assert.ok((await page.evaluate(()=>window.__workbench.visibleIds)).includes('M-IN'));await page.locator('#show-deprecated').uncheck();
 });
 await check('no JavaScript runtime errors during repeated interactions',async()=>assert.deepEqual(errors,[]));
 const report={time:new Date().toISOString(),browser:await browser.version(),viewport:{width:1600,height:1000},url,scope:'UI + schema contracts; not neural simulation',checks,errors};
 await fs.writeFile(path.join(output,'browser-results.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({passed:checks.length,errors:errors.length}));
})().catch(async e=>{console.error(e);if(page)await page.screenshot({path:path.join(output,'failure.png')});await fs.writeFile(path.join(output,'browser-failure.json'),JSON.stringify({checks,errors,error:e.stack},null,2));process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();});
