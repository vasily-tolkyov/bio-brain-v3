const fs=require('node:fs');
const message=fs.readFileSync(process.argv[2],'utf8');
const missing=['Reason','IDs','Validation'].filter(key=>!new RegExp('^'+key+':\\s*\\S','m').test(message));
if(missing.length){console.error('提交须记录 '+missing.join(', ')+'（原因、影响ID、验收）。');process.exitCode=1;}
