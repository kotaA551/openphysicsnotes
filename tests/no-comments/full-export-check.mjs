import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {typescriptLoader} from '../seo/load-typescript.mjs';
const [dist='.next',out='.next-full-export',report='../results/full-export-validation.json']=process.argv.slice(2);
const load=typescriptLoader(),sitemap=load('app/sitemap.ts').default;
const {locales}=load('lib/i18n.ts');
const hash=b=>createHash('sha256').update(b).digest('hex');
const routes=sitemap().map(x=>new URL(x.url).pathname);
assert.equal(routes.length,230);
assert.equal(new Set(routes).size,230);
const result={canonicalPages:routes.length,articlePages:0,locales:locales.length,htmlBytes:0,navigationPayloadBytes:0,mathExpressions:0,commentReferences:0,searchIndices:0,allExportFilesMatchInternalBuild:true};
for(const route of routes){
  const rel=route==='/'?'index':route.slice(1);
  const html=fs.readFileSync(path.join(out,rel+'.html'));
  assert.equal(hash(html),hash(fs.readFileSync(path.join(dist,'server/app',rel+'.html'))),route);
  const text=html.toString();
  assert.doesNotMatch(text,/\/api\/discussions|data-discussion-section|section-discussion/,route);
  assert.doesNotMatch(text,/class="[^"]*\bkatex-error\b/,route);
  const payload=fs.readFileSync(path.join(out,rel+'.txt'));
  assert.equal(hash(payload),hash(fs.readFileSync(path.join(dist,'server/app',rel+'.rsc'))),route);
  result.htmlBytes+=html.length;result.navigationPayloadBytes+=payload.length;
  result.mathExpressions+=(text.match(/class="katex"/g)||[]).length;
  if(/\/(chapters|curiosities)\//.test(route))result.articlePages++;
}
for(const locale of locales){
  assert.equal(hash(fs.readFileSync(path.join(out,'search',locale))),hash(fs.readFileSync(path.join(dist,'server/app/search',locale+'.body'))),locale);
  result.searchIndices++;
}
const manifest=JSON.parse(fs.readFileSync(path.join(dist,'server/app-paths-manifest.json')));
assert(!Object.keys(manifest).some(x=>x.startsWith('/api/')));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);
const assets=walk(path.join(out,'_next/static'));
result.staticAssetFiles=assets.length;
result.staticAssetBytes=assets.reduce((s,p)=>s+fs.statSync(p).size,0);
for(const file of assets.filter(x=>/\.(js|css)$/.test(x)))assert.doesNotMatch(fs.readFileSync(file,'utf8'),/\/api\/discussions|data-discussion-section|\.section-discussion/,file);
for(const name of ['sitemap.xml','robots.txt'])assert(fs.existsSync(path.join(out,name)));
result.runtimeApiRoutes=0;result.status='passed';
fs.writeFileSync(report,JSON.stringify(result,null,2));console.log(result);
