import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parseFragment } from 'parse5';
import { execFileSync } from 'node:child_process';
import { typescriptLoader } from '../seo/load-typescript.mjs';
const load=typescriptLoader(), {locales}=load('lib/i18n.ts'), {articleList,loadArticle}=load('lib/articles.ts');
const before=JSON.parse(execFileSync('git',['show','595e369d2f2a8bc289db35fda6354155334a4f82:lib/discussions/manifest.json'],{encoding:'utf8',maxBuffer:8*1024*1024}));
const current=JSON.parse(fs.readFileSync('lib/discussions/manifest.json','utf8'));
for(const[key,ids]of Object.entries(before))for(const id of ids)assert.ok(current[key].includes(id),`${key} lost ${id}`);
const reports=[];
const attr=(node,name)=>node.attrs?.find(a=>a.name===name)?.value;
const hasClass=(node,name)=>(attr(node,'class')||'').split(/\s+/).includes(name);
const descendants=node=>[node,...(node.childNodes||[]).flatMap(descendants)];
const textContent=node=>node.nodeName==='#text'?node.value:(node.childNodes||[]).map(textContent).join('');
const elements=(html,pattern)=>[...html.matchAll(pattern)].map(m=>parseFragment(m[0]).childNodes[0]);
function inspectPage(locale,kind,item) {
  const slug=item.slug, article=loadArticle(kind,slug,locale), route=`${locale==='en'?'':`/${locale}`}/${kind}/${slug}`;
  const html=fs.readFileSync(`.next/server/app${route}.html`,'utf8');
  // Inspect server-rendered markup only, excluding serialized React payloads.
  // Parse the relevant fragments instead of allocating every MathML/SVG node;
  // full hierarchy and interaction behavior are checked by the source/React tests.
  const rendered=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
  const body=rendered.match(/<article\b[^>]*class="[^"]*\bprose\b[^"]*"[^>]*>([\s\S]*?)<\/article>/)?.[1];
  assert.ok(body,route);
  const headings=elements(body,/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/g);
  const expected=headings.filter(h=>h.tagName==='h2'&&/^\d+(?:\.\d+)?(?:[.\uFF0E\u3001]?\s|[\uFF1A:])/.test(textContent(h))).map(h=>attr(h,'id'));
  const panels=elements(body,/<details\b[^>]*>/g).filter(n=>hasClass(n,'section-discussion'));
  assert.deepEqual(panels.map(p=>attr(p,'data-discussion-section')),expected,route);
  const ids=[...rendered.matchAll(/<[a-z][a-z0-9-]*\b[^>]*\sid="([^"]*)"[^>]*>/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`${route}: duplicate DOM id`);
  assert.ok(!/class="[^"]*\bkatex-error\b/.test(body),`${route}: invalid formula`);
  const key=`${kind}/${slug}/${article.contentLocale}`;
  for(const id of (before[key] || []))assert.ok(headings.some(h=>attr(h,'id')===id),`${route}: changed old anchor ${id}`);
  if(slug==='2-Oscillations-and-waves') {
    const figures=elements(body,/<figure\b[^>]*>[\s\S]*?<\/figure>/g).filter(n=>hasClass(n,'cycloidal-pendulum-figure'));assert.equal(figures.length,1,route);
    const images=descendants(figures[0]).filter(n=>n.tagName==='img');
    assert.equal(images.length,2);
    // CJK descriptions convey the same content with fewer characters.
    assert.ok(images.every(img=>attr(img,'alt')?.trim().length>=25),`${route}: descriptive localized alt text`);
  }
  reports.push({route,contentLocale:article.contentLocale,before:(before[key] || []).length,after:panels.length,panels:panels.map(p=>attr(p,'data-discussion-section'))});
}
for(const locale of locales)for(const kind of ['chapters','curiosities'])for(const item of articleList(kind)) {
  inspectPage(locale,kind,item);
  if(reports.length%20===0)console.error(`Validated ${reports.length} article routes`);
}
console.log(JSON.stringify({result:'passed',pages:reports.length,legacyIds:Object.values(before).reduce((n,ids)=>n+ids.length,0),before:reports.reduce((n,r)=>n+r.before,0),after:reports.reduce((n,r)=>n+r.after,0),reports},null,2));
