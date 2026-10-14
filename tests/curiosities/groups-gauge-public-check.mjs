// Read-only public checks. Never calls discussion APIs or submits comments.
// Run with node --use-system-ca ... EXACT_COMMIT after Vercel reports success.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { JSDOM } from 'jsdom';
import { typescriptLoader } from '../seo/load-typescript.mjs';
const commit=process.argv[2];assert.match(commit||'',/^[a-f0-9]{40}$/);
const load=typescriptLoader(),{locales,localePath}=load('lib/i18n.ts');
const {prepareIndex,search}=load('lib/search/engine.ts');
const slug='groups-lie-algebras-gauge-theory',base='https://www.openphysicsnotes.com';
const dist=process.env.NEXT_BUILD_DIR||'.next',reports=[],errors=[],assets=new Set();
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
async function get(url){const response=await fetch(url,{signal:AbortSignal.timeout(60000),cache:'no-store',headers:{'User-Agent':'OpenPhysicsNotes-release-verification'}});assert.equal(response.status,200,url);return {response,bytes:Buffer.from(await response.arrayBuffer())};}
async function read(route){return get(`${base}${route}?verifiedRelease=${commit}`);}
const status=JSON.parse((await get(`https://api.github.com/repos/kotaA551/openphysicsnotes/commits/${commit}/status`)).bytes);
assert.equal(status.sha,commit);const deployment=status.statuses.find(s=>s.context==='Vercel');assert.equal(deployment?.state,'success','exact-commit Vercel deployment succeeded');
const deployments=JSON.parse((await get(`https://api.github.com/repos/kotaA551/openphysicsnotes/deployments?sha=${commit}&per_page=10`)).bytes);
const production=deployments.find(d=>d.sha===commit&&d.environment==='Production');assert.ok(production,'exact-commit Production deployment exists');
const productionStatuses=JSON.parse((await get(production.statuses_url)).bytes);assert.equal(productionStatuses[0]?.state,'success','Production deployment completed');
const parse=html=>new JSDOM(html.replace(/<script\b(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/gi,''));
const inspect=doc=>({
  title:doc.title,
  description:doc.querySelector('meta[name="description"]')?.content,
  canonical:doc.querySelector('link[rel="canonical"]')?.href,
  alternates:[...doc.querySelectorAll('link[rel="alternate"][hreflang]')].map(n=>[n.hreflang,n.href]),
  lang:doc.documentElement.lang,bodyLang:doc.querySelector('article.prose div[lang]')?.lang,
  headings:[...doc.querySelectorAll('article [id]')].map(n=>n.id),
  panels:[...doc.querySelectorAll('.section-discussion')].map(n=>n.dataset.discussionSection),
  images:[...doc.querySelectorAll('article img')].map(n=>({src:n.getAttribute('src'),alt:n.alt})),
  schemas:[...doc.querySelectorAll('script[type="application/ld+json"]')].map(n=>JSON.parse(n.textContent)),
});
for(const locale of locales)try{
  const route=localePath(locale,`/curiosities/${slug}`),actual=await read(route);
  const current=parse(actual.bytes.toString()),expected=parse(fs.readFileSync(`${dist}/server/app${route}.html`,'utf8'));
  const doc=current.window.document,result=inspect(doc);
  assert.deepEqual(result,inspect(expected.window.document),'public content structure, localized captions and SEO match tested build');
  assert.equal(result.lang,locale);assert.equal(result.bodyLang,locale);assert.equal(result.alternates.length,11);
  assert.equal(doc.querySelectorAll('.translation-notice,.katex-error').length,0);
  const content=doc.querySelector('article').textContent,expectedContent=expected.window.document.querySelector('article').textContent;
  assert.equal(hash(content),hash(expectedContent),'complete displayed article matches tested build');
  for(const item of result.images)assets.add(item.src);
  const searchResponse=await read(`/search/${locale}`),index=JSON.parse(searchResponse.bytes);
  assert.deepEqual(index,JSON.parse(fs.readFileSync(`${dist}/server/app/search/${locale}.body`,'utf8')),'public search index matches build');
  const article=index.articles.find(a=>a.href===route);assert.equal(article?.contentLocale,locale);
  const found=search(prepareIndex(index),article.title).filter(r=>r.href.startsWith(route+'#'));assert.ok(found.length);
  for(const entry of found)assert.ok(doc.getElementById(decodeURIComponent(entry.href.split('#')[1])));
  reports.push({locale,route,status:actual.response.status,panels:result.panels.length,headings:result.headings.length,images:result.images.length,bodySha256:hash(content),search:'passed',seo:'passed',vercelId:actual.response.headers.get('x-vercel-id')});
  current.window.close();expected.window.close();
}catch(error){errors.push({locale,error:error.stack});}
for(const asset of assets)try{assert.equal(hash((await read(asset)).bytes),hash(fs.readFileSync('public'+asset)),asset);}catch(error){errors.push({asset,error:error.message});}
try{const sitemap=(await read('/sitemap.xml')).bytes.toString();for(const locale of locales)assert.ok(sitemap.includes(`<loc>${base}${localePath(locale,`/curiosities/${slug}`)}</loc>`));await read('/robots.txt');}catch(error){errors.push({route:'sitemap/robots',error:error.message});}
console.log(JSON.stringify({result:errors.length?'failed':'passed',commit,checkedAt:new Date().toISOString(),deployment:deployment?.target_url,production:{id:production.id,environment:production.environment,state:productionStatuses[0]?.state,url:productionStatuses[0]?.environment_url},pages:reports.length,svgAssets:assets.size,reports,errors},null,2));
if(errors.length)process.exitCode=1;
