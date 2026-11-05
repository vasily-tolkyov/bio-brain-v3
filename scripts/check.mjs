import {readFile} from 'node:fs/promises';
import {validateArchitecture} from '../shared/validate.mjs';
import {checkRules} from '../shared/check-rules.mjs';
const data=JSON.parse(await readFile(new URL('../data/architecture.json',import.meta.url),'utf8'));
const validation=validateArchitecture(data);
const rules=validation.valid?checkRules(data):null;
console.log(JSON.stringify({version:data.version,validation,rules},null,2));
if(!validation.valid||!rules.passed)process.exitCode=1;
