import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
const [before='../variant-b/.next-b-final',after='.next-no-comments',out='../results/no-comments-validation.json']=process.argv.slice(2);
const hash=x=>createHash('sha256').update(x).digest('hex');
const routes=['chapters/1-Newton-mechanics','chapters/10-Condensed-matter-physics','ja/chapters/10-Condensed-matter-physics'];
function snapshot(dir,route){
  const w=new JSDOM(fs.readFileSync(path.join(dir,'server/app',route+'.html'),'utf8')).window,d=w.document;
  const panels=d.querySelectorAll('.section-discussion').length;
  d.querySelectorAll('.section-discussion').forEach(n=>n.remove());
  const a=d.querySelector('article');
  const result={panels,text:a.textContent.replace(/\s+/g,' ').trim(),headings:[...a.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(n=>[n.id,n.textContent]),math:[...a.querySelectorAll('.katex-html')].map(n=>n.outerHTML),images:[...a.querySelectorAll('img')].map(n=>[n.getAttribute('src'),n.getAttribute('alt')]),captions:[...a.querySelectorAll('figcaption')].map(n=>n.textContent),meta:[...d.querySelectorAll('head title,head meta,head link[rel="canonical"],head link[rel="alternate"],script[type="application/ld+json"]')].map(n=>n.outerHTML)};
  w.close();return result;
}
const result={routes:[]};
for(const route of routes){const a=snapshot(before,route),b=snapshot(after,route);assert.equal(b.panels,0);assert(a.panels>0);for(const key of ['text','headings','math','images','captions','meta'])assert.deepEqual(b[key],a[key],`${route}: ${key}`);result.routes.push({route,removedPanels:a.panels,math:b.math.length,headings:b.headings.length,images:b.images.length,articleAndSEO:'unchanged'});}
const searches=fs.readdirSync(path.join(before,'server/app/search')).filter(f=>f.endsWith('.body'));
for(const f of searches)assert.equal(hash(fs.readFileSync(path.join(before,'server/app/search',f))),hash(fs.readFileSync(path.join(after,'server/app/search',f))),f);
result.unchangedSearchLocales=searches.length;
for(const f of ['robots.txt.body','sitemap.xml.body'])assert.equal(hash(fs.readFileSync(path.join(before,'server/app',f))),hash(fs.readFileSync(path.join(after,'server/app',f))),f);
const appPaths=JSON.parse(fs.readFileSync(path.join(after,'server/app-paths-manifest.json'),'utf8'));
assert(!Object.keys(appPaths).some(x=>x.includes('/api/discussions')));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);
for(const file of walk(path.join(after,'static')).filter(x=>/\.(js|css)$/.test(x)))assert.doesNotMatch(fs.readFileSync(file,'utf8'),/\/api\/discussions|data-discussion-section|\.section-discussion/);
result.clientBundleDiscussionReferences=0;result.commentApiRoute=false;
fs.writeFileSync(out,JSON.stringify(result,null,2));console.log(result);
