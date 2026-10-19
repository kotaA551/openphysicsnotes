import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const base='80aa0989cddcdd37a0a29d702f415fde18e62f26';
const mapping=JSON.parse(fs.readFileSync('tests/translations/math-annotations.json','utf8'));
const corrections=JSON.parse(fs.readFileSync('tests/translations/reviewed-corrections.json','utf8'));
const files=execFileSync('git',['ls-tree','-r','--name-only',base],{encoding:'utf8'}).trim().split('\n').filter(file=>file.startsWith('content/')&&file.endsWith('.mdx')||file.startsWith('public/images/'));
const raw=execFileSync('git',['cat-file','--batch'],{input:files.map(file=>`${base}:${file}`).join('\n')+'\n',maxBuffer:64*1024*1024});
const normalized=value=>value.replace(/\r\n/g,'\n');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const reports=[];let cursor=0;
for(const file of files){
 const lineEnd=raw.indexOf(10,cursor), header=raw.subarray(cursor,lineEnd).toString();
 assert.match(header,/^[a-f0-9]+ blob \d+$/);
 const size=Number(header.split(' ')[2]), before=raw.subarray(lineEnd+1,lineEnd+1+size);cursor=lineEnd+1+size+1;
 const after=fs.readFileSync(file);
 if(file.startsWith('public/images/')) {
  if(file.endsWith('.svg'))assert.equal(normalized(after.toString('utf8')),normalized(before.toString('utf8')),`${file}: original SVG changed (ignoring Git checkout line endings)`);
  else assert.equal(hash(after),hash(before),`${file}: original image changed`);
 }
 else {
  let expected=normalized(before.toString('utf8'));const locale=file.startsWith('content/translations/')?file.split('/')[2]:'en';
  for(const [from,to]of Object.entries(mapping[locale]||{}))expected=expected.split(`\\text{${from}}`).join(`\\text{${to}}`);
  if(file==='content/translations/zh-CN/chapters/5-Relativity.mdx')expected=expected.replace('![The moving time axis is x equals beta ct and its spatial axis is ct equals beta x. Light rays remain at forty five degrees.]','![运动坐标系的时间轴满足 x＝βct，空间轴满足 ct＝βx。光线始终与坐标轴成45度角。]');
  if(file==='content/translations/zh-CN/chapters/8-Quantum-field-theory.mdx')expected=expected.replace('![The minima of a complex scalar potential form a circle in field space. Radial and angular perturbations are distinct; the angular direction is flat for the global symmetry.]','![复标量势的极小值在场空间中构成一个圆。径向扰动与角向扰动不同；对于全局对称性，角向方向是平坦的。]');
  for(const {from,to} of corrections.filter(item=>item.file===file)) {
   assert.equal(expected.split(from).length,2,`${file}: baseline correction must be unique`);
   expected=expected.replace(from,to);
  }
  assert.equal(normalized(after.toString('utf8')),expected,`${file}: change outside the explicit reviewed corrections`);
 }
 reports.push({file,beforeSHA256:hash(before),afterSHA256:hash(after),status:'pass'});
}
const result={base,checkedAt:new Date().toISOString(),articles:reports.filter(x=>x.file.endsWith('.mdx')).length,images:reports.filter(x=>x.file.startsWith('public/images/')).length,reports};
fs.writeFileSync(process.argv[2]||'../evidence/existing-preservation.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,reports:undefined}));
