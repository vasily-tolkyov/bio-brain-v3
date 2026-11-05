import {readFile} from 'node:fs/promises';
const d=JSON.parse(await readFile(new URL('../data/architecture.json',import.meta.url),'utf8'));
const index=['nodes','ports','edges','rules','cases','tombstones'].flatMap(kind=>(d[kind]||[]).map(x=>({id:x.id,kind,label:x.label||x.reason,status:x.status||'deprecated',...(x.from?{from:x.from,to:x.to}:{}),...(x.nodeId?{owner:x.nodeId}:{}),sources:x.sourceIds})));
console.log(JSON.stringify({architectureId:d.architectureId,version:d.version,index},null,2));
