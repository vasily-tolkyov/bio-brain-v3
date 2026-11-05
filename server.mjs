import http from 'node:http';
import {readFile,writeFile,mkdir,rename,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash,randomBytes} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {validateArchitecture,nextVersion} from './shared/validate.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||4317);
const dataFile=process.env.ARCHITECTURE_FILE?path.resolve(process.env.ARCHITECTURE_FILE):path.join(root,'data/architecture.json');
const token=randomBytes(32).toString('hex');
const run=promisify(execFile);
let gitCache=null,gitCacheAt=0;
async function gitMetadata(){
  if(gitCache&&Date.now()-gitCacheAt<1000)return gitCache;
  const wslRoot=process.platform==='win32'?root.match(/^\\\\(?:wsl\.localhost|wsl\$)\\([^\\]+)\\(.+)$/i):null;
  const linuxRoot=wslRoot?'/'+wslRoot[2].replaceAll('\\','/'):null;
  const git=async args=>(await run(wslRoot?'wsl.exe':'git',wslRoot?['-d',wslRoot[1],'--exec','git','-C',linuxRoot,...args]:args,{cwd:wslRoot?path.dirname(process.execPath):root,timeout:4000,maxBuffer:256*1024,windowsHide:true})).stdout.trim();
  try{
    const top=await git(['rev-parse','--show-toplevel']);
    if(wslRoot?top!==linuxRoot:path.resolve(top)!==root)throw new Error('项目目录尚未建立独立 Git 仓库');
    const results=await Promise.allSettled([git(['symbolic-ref','--short','HEAD']),git(['rev-parse','--short=10','HEAD']),git(['status','--porcelain']),git(['ls-files','--error-unmatch','--',path.relative(root,dataFile).split(path.sep).join('/')])]);
    const value=i=>results[i].status==='fulfilled'?results[i].value:null;
    gitCache={initialized:true,branch:value(0)||'(detached)',commit:value(1),dirty:!!value(2),changedFiles:value(2)?value(2).split('\n').length:0,tracked:results[3].status==='fulfilled'};
  }catch(e){gitCache={initialized:false,branch:null,commit:null,dirty:null,tracked:false};}
  gitCacheAt=Date.now();return gitCache;
}
let current=null,revision=null,fileFingerprint=null,sourceError=null,writing=false;
const digest=x=>createHash('sha256').update(x).digest('hex');
async function refresh(){
  try {
    const raw=await readFile(dataFile,'utf8'),hash=digest(raw);
    if(hash===fileFingerprint)return;
    fileFingerprint=hash;
    if(hash===revision){sourceError=null;return;}
    const candidate=JSON.parse(raw),check=validateArchitecture(candidate,current,{external:true});
    if(!check.valid)throw new Error(check.errors.join('\n'));
    current=candidate;revision=hash;sourceError=null;
  }catch(e){sourceError=`源文件未应用：${e.message}`;}
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml'};
function json(res,status,value){res.writeHead(status,{'Content-Type':mime['.json'],'Cache-Control':'no-store'});res.end(JSON.stringify(value));}
async function body(req){let bytes=0,parts=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>4*1024*1024)throw new Error('JSON 超过 4 MB 限制');parts.push(chunk);}return JSON.parse(Buffer.concat(parts).toString('utf8'));}
function trusted(req){const host=req.headers.host;return host===`127.0.0.1:${port}`||host===`localhost:${port}`||host===`[::1]:${port}`;}
function writable(req){if(!trusted(req))return false;const origin=req.headers.origin;if(origin&&origin!==`http://${req.headers.host}`)return false;return req.headers['x-workbench-token']===token;}
const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'");
  if(!trusted(req))return json(res,403,{error:'仅允许本机工作台 Host'});
  if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`)return json(res,403,{error:'跨来源请求被拒绝'});
  let url;try{url=new URL(req.url,`http://${req.headers.host}`);}catch{return json(res,400,{error:'URL 无效'});}
  try {
    if(req.method==='GET'&&url.pathname==='/api/architecture'){
      await refresh();return json(res,current?200:503,{data:current,revision,sourceError,token,sourcePath:path.relative(root,dataFile),git:await gitMetadata()});
    }
    if(req.method==='POST'&&url.pathname==='/api/validate'){
      if(!writable(req))return json(res,403,{error:'本机写入凭证无效'});
      const payload=await body(req);return json(res,200,validateArchitecture(payload.data,current));
    }
    if(req.method==='PUT'&&url.pathname==='/api/architecture'){
      if(!writable(req))return json(res,403,{error:'本机写入凭证无效'});
      const payload=await body(req);
      if(writing)return json(res,409,{error:'另一个保存正在进行，请重试'});
      writing=true;
      try{
        await refresh();
        if(sourceError)return json(res,409,{error:'源文件存在错误，先修复或恢复文件后保存',sourceError});
        if(payload.baseRevision!==revision)return json(res,409,{error:'架构已被外部更新，请刷新后重新编辑'});
        const check=validateArchitecture(payload.data,current);if(!check.valid)return json(res,422,{error:'架构校验失败',errors:check.errors});
        const next=structuredClone(payload.data);
        next.version=nextVersion(current.version);next.updatedAt=new Date().toISOString();
        next.changelog.push({version:next.version,date:next.updatedAt,summary:typeof payload.summary==='string'?payload.summary.slice(0,500):'本地工作台更新',ids:Array.isArray(payload.ids)?payload.ids.filter(x=>typeof x==='string'):[]});
        const finalCheck=validateArchitecture(next,current);if(!finalCheck.valid)return json(res,422,{error:'保存版本校验失败',errors:finalCheck.errors});
        const raw=JSON.stringify(next,null,2)+'\n';
        const history=path.join(path.dirname(dataFile),'history');await mkdir(history,{recursive:true});
        await writeFile(path.join(history,`${current.version}-${Date.now()}.json`),JSON.stringify(current,null,2)+'\n',{flag:'wx'});
        // Re-read immediately before replacing to avoid overwriting an external edit.
        if(digest(await readFile(dataFile,'utf8'))!==revision)return json(res,409,{error:'保存期间源文件已更改，请刷新后重试'});
        const temp=`${dataFile}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`;
        await writeFile(temp,raw,{flag:'wx'});await rename(temp,dataFile);
        current=next;revision=digest(raw);fileFingerprint=revision;sourceError=null;
        return json(res,200,{data:current,revision,sourceError:null});
      }finally{writing=false;}
    }
    if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'不支持的方法'});
    let relative=decodeURIComponent(url.pathname),base=path.join(root,'public');
    if(relative.startsWith('/vendor/three/')){base=path.join(root,'node_modules/three');relative=relative.slice('/vendor/three'.length);}
    else if(relative.startsWith('/shared/')){base=path.join(root,'shared');relative=relative.slice('/shared'.length);}
    else if(relative.startsWith('/sources/')){base=path.join(root,'sources');relative=relative.slice('/sources'.length);}
    else if(relative.startsWith('/modules/')){base=path.join(root,'modules');relative=relative.slice('/modules'.length);}
    else if(relative.startsWith('/prompts/')){base=path.join(root,'prompts');relative=relative.slice('/prompts'.length);}
    if(relative==='/README.md')base=root;
    if(relative==='/')relative='/index.html';
    const target=path.resolve(base,'.'+relative);
    if(target!==base&&!target.startsWith(base+path.sep))return json(res,403,{error:'路径不允许'});
    const info=await stat(target);if(!info.isFile())return json(res,404,{error:'文件不存在'});
    res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(req.method==='HEAD'?undefined:await readFile(target));
  }catch(e){json(res,e.code==='ENOENT'?404:400,{error:e.message});}
});
await refresh();
server.listen(port,'127.0.0.1',()=>console.log(`Architecture workbench: http://127.0.0.1:${port}\nData: ${dataFile}`));
const timer=setInterval(()=>{if(!writing)refresh();},1000);timer.unref();
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{clearInterval(timer);server.close(()=>process.exit(0));});
