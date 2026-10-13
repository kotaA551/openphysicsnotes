// Read-only production validation. Never calls the discussion API or posts comments.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { typescriptLoader } from '../seo/load-typescript.mjs';
const commit=process.argv[2];if(!/^[a-f0-9]{40}$/.test(commit||''))throw Error('Pass exact release SHA');
const base='https://www.openphysicsnotes.com',load=typescriptLoader(),{locales}=load('lib/i18n.ts'),{articleList}=load('lib/articles.ts');
const routes=locales.flatMap(locale=>['chapters','curiosities'].flatMap(kind=>articleList(kind).map(a=>`${locale==='en'?'':`/${locale}`}/${kind}/${a.slug}`)));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const sections=html=>[...html.matchAll(/data-discussion-section="([^"]+)"/g)].map(m=>m[1]);
const headings=html=>[...html.matchAll(/<h[1-6]\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
const metadata=html=>[...html.slice(0,html.indexOf('</head>')).matchAll(/<(?:link|meta)\b[^>]*(?:rel="(?:canonical|alternate)"|name="(?:robots|description)"|property="og:url")[^>]*>/g)].map(m=>m[0]);
async function read(route){const response=await fetch(`${base}${route}?verifiedRelease=${commit}`,{signal:AbortSignal.timeout(45000),cache:'no-store'});assert.equal(response.status,200,route);return Buffer.from(await response.arrayBuffer());}
const reports=[],errors=[];let next=0;
await Promise.all(Array.from({length:4},async()=>{while(next<routes.length){const route=routes[next++];try{
  const expected=fs.readFileSync(`.next/server/app${route}.html`,'utf8'),actual=(await read(route)).toString('utf8');
  assert.deepEqual(sections(actual),sections(expected),`${route}: panel scopes`);
  assert.deepEqual(headings(actual),headings(expected),`${route}: heading anchors`);
  assert.deepEqual(metadata(actual),metadata(expected),`${route}: SEO`);
  if(route.endsWith('/2-Oscillations-and-waves')) {
    for(const file of ['pendulum-circular-comparison.svg','pendulum-cycloidal-cheeks.svg'])assert.ok(actual.includes(`/images/diagrams/${file}`));
    const alts=html=>[...html.matchAll(/<img\b[^>]*>/g)].filter(m=>m[0].includes('pendulum-c')).map(m=>m[0].match(/alt="([^"]*)"/)?.[1]);
    assert.deepEqual(alts(actual),alts(expected),`${route}: localized image alt`);
  }
  assert.ok(!actual.includes('class="katex-error"'),route);
  reports.push({route,status:200,panels:sections(actual).length,anchors:headings(actual).length});
}catch(error){errors.push({route,error:error.message});}}}));
for(const file of ['pendulum-circular-comparison.svg','pendulum-cycloidal-cheeks.svg'])try{
  assert.equal(hash(await read(`/images/diagrams/${file}`)),hash(fs.readFileSync(`public/images/diagrams/${file}`)),file);
}catch(error){errors.push({route:file,error:error.message});}
for(const locale of locales)try{
  assert.deepEqual(JSON.parse((await read(`/search/${locale}`)).toString('utf8')),JSON.parse(fs.readFileSync(`.next/server/app/search/${locale}.body`,'utf8')),`search ${locale}`);
}catch(error){errors.push({route:`/search/${locale}`,error:error.message});}
for(const route of ['/sitemap.xml','/robots.txt'])try{await read(route);}catch(error){errors.push({route,error:error.message});}
console.log(JSON.stringify({commit,checkedAt:new Date().toISOString(),result:errors.length?'failed':'passed',pages:reports.length,svgAssets:2,searchLocales:locales.length,reports:reports.sort((a,b)=>a.route.localeCompare(b.route)),errors},null,2));
if(errors.length)process.exitCode=1;
