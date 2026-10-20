// Read-only comparison of completed builds. No server, network or database access.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parseFragment } from 'parse5';
import { typescriptLoader } from '../seo/load-typescript.mjs';
const [before,after='.next',output='../evidence/generated-content-check.json']=process.argv.slice(2);
assert.ok(before,'Pass the completed production-baseline build directory');
const load=typescriptLoader(),{locales,localePath}=load('lib/i18n.ts'),{articleList}=load('lib/articles.ts');
const labels=JSON.parse(fs.readFileSync('tests/translations/math-annotations.json','utf8'));
const sourceCorrections=JSON.parse(fs.readFileSync('tests/translations/source-math-corrections.json','utf8'));
const texts=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(texts).join('');
const decode=value=>texts(parseFragment(value));
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([,name,value])=>[name,decode(value)]));
const matches=(text,re)=>[...text.matchAll(re)];
const read=(dir,route)=>fs.readFileSync(path.join(dir,'server/app',route==='/'?'index.html':`${route.slice(1)}.html`),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const body=html=>html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
const headings=html=>matches(html,/<h[1-6]\b[^>]*>/g).map(([tag])=>attrs(tag).id).filter(Boolean);
const formulas=html=>matches(html,/<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g).map(([,tex])=>decode(tex));
const localize=(value,locale)=>{for(const[from,to]of Object.entries(labels[locale]||{}))value=value.split(`\\text{${from}}`).join(`\\text{${to}}`);return value;};
const errors=[],reports=[],pages=new Map();
const manifest=JSON.parse(fs.readFileSync(path.join(after,'prerender-manifest.json'),'utf8'));
for(const route of Object.keys(manifest.routes)){
 const file=path.join(after,'server/app',route==='/'?'index.html':`${route.slice(1)}.html`);
 if(!fs.existsSync(file))continue;
 const html=read(after,route);pages.set(route,{html,ids:new Set(matches(html,/\sid="([^"]*)"/g).map(([,id])=>decode(id)))});
}
for(const locale of locales)for(const kind of ['chapters','curiosities'])for(const {slug}of articleList(kind)){
 const route=localePath(locale,`/${kind}/${slug}`);
 try{
  const oldBody=body(read(before,route)),newBody=body(pages.get(route)?.html||'');assert.ok(oldBody&&newBody,`${route}: rendered body`);
  assert.equal(matches(newBody,/<hr\b[^>]*data-article-separator/g).length,0,'removed article separators must remain absent');
  assert.ok(!/class="[^"]*\bkatex-error\b/.test(newBody),'no KaTeX errors');
  assert.deepEqual(headings(newBody),headings(oldBody),'all published heading fragments and their order must remain stable');
  const expectedFormulas=formulas(oldBody).map(value=>{
   value=localize(value,locale);
   if(`${kind}/${slug}`===sourceCorrections.article)for(const {from,to}of sourceCorrections.corrections)value=value.split(from).join(to);
   return value;
  });
  assert.deepEqual(formulas(newBody).sort(),expectedFormulas.sort(),'rendered mathematics preserved except approved descriptive labels and three independently verified source corrections');
  const oldImages=matches(oldBody,/<img\b[^>]*>/g).map(([tag])=>attrs(tag).src);
  const newImages=matches(newBody,/<img\b[^>]*>/g).map(([tag])=>attrs(tag));
  assert.deepEqual(newImages.map(img=>img.src),oldImages,'original artwork and image order');
  for(const img of newImages){assert.ok(img.alt?.trim(),'descriptive image alternative');if(img.src.startsWith('/images/'))assert.ok(fs.existsSync(path.join('public',decodeURIComponent(img.src))),'image asset exists');}
  const ids=matches(pages.get(route).html,/\sid="([^"]*)"/g).map(([,id])=>decode(id));assert.equal(ids.length,new Set(ids).size,'unique DOM identifiers');
  let internalLinks=0;
  for(const [tag]of matches(newBody,/<a\b[^>]*>/g)){
   const href=attrs(tag).href;if(!href||/^(?:mailto:|tel:)/.test(href))continue;
   const url=new URL(href,`https://www.openphysicsnotes.com${route}`);if(url.origin!=='https://www.openphysicsnotes.com')continue;
   const target=pages.get(decodeURIComponent(url.pathname));
   if(target){if(url.hash)assert.ok(target.ids.has(decodeURIComponent(url.hash.slice(1))),`missing fragment ${href}`);internalLinks++;}
   else assert.ok(fs.existsSync(path.join('public',decodeURIComponent(url.pathname))),`missing internal target ${href}`);
  }
  const panels=matches(newBody,/<details\b[^>]*data-discussion-section="([^"]*)"[^>]*>/g).map(([,id])=>decode(id));
  const oldPanels=matches(oldBody,/<details\b[^>]*data-discussion-section="([^"]*)"[^>]*>/g).map(([,id])=>decode(id));
  assert.deepEqual(panels,oldPanels,'persistent discussion section IDs');
  reports.push({route,headings:headings(newBody).length,formulas:formulas(newBody).length,images:newImages.length,internalLinks,discussionSections:panels.length,status:'pass'});
 }catch(error){errors.push({route,error:error.message});}
}
const result={checkedAt:new Date().toISOString(),before:path.resolve(before),after:path.resolve(after),expected:200,passed:reports.length,status:errors.length?'fail':'pass',errors,reports};
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,reports:undefined,errors:errors.slice(0,5).map(x=>({...x,error:x.error.slice(0,500)}))}));process.exitCode=errors.length||reports.length!==200?1:0;
