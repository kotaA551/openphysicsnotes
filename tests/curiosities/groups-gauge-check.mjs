// Source parity and rendered-route checks for the complete, new eighth curiosity.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import katex from 'katex';
import { JSDOM } from 'jsdom';
import { articleSections } from '../../lib/search/build.mjs';
import { articleHeadingIds } from '../../lib/article-anchors.mjs';
import { typescriptLoader } from '../seo/load-typescript.mjs';

const slug='groups-lie-algebras-gauge-theory';
const load=typescriptLoader();
const {locales,localePath}=load('lib/i18n.ts');
const {articleList,loadArticle,translatedArticleLocales}=load('lib/articles.ts');
const {prepareIndex,search}=load('lib/search/engine.ts');
const args=process.argv.slice(2), englishOnly=args.includes('--english');
const chosen=args.includes('--locale')?args[args.indexOf('--locale')+1]:null;
if(chosen)assert.ok(locales.includes(chosen),'configured locale');
const partial=englishOnly||Boolean(chosen);
const dist=args.includes('--dist')?args[args.indexOf('--dist')+1]:null;
const languages=englishOnly?['en']:chosen?[...new Set(['en',chosen])]:locales;
const parser=unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath);
const walk=(n,f)=>{f(n);for(const child of n.children||[])walk(child,f);};
const words=n=>n.type==='text'?n.value:['math','inlineMath','code','inlineCode'].includes(n.type)?'':(n.children||[]).map(words).join('');
const normalized=s=>s.replace(/\s+/g,'');
const sectionsCache=new Map();
async function sections(kind,id,locale){const key=`${locale}/${kind}/${id}`;if(!sectionsCache.has(key)){const article=loadArticle(kind,id,locale);assert.ok(article,`missing article ${key}`);sectionsCache.set(key,await articleSections(article.content,articleHeadingIds(kind,id,article.contentLocale)));}return sectionsCache.get(key);}
assert.equal(articleList('curiosities')[7].slug,slug,'append after the seven existing curiosities');
if(!partial)assert.deepEqual(translatedArticleLocales('curiosities',slug),locales);
const reports=[],errors=[],assets=new Set(),descriptions=new Set(),bodies=new Set();
let reference;
for(const locale of languages)try {
  const file=locale==='en'?`content/curiosities/${slug}.mdx`:`content/translations/${locale}/curiosities/${slug}.mdx`;
  const {content,data}=matter(fs.readFileSync(file,'utf8'));
  const article=loadArticle('curiosities',slug,locale);
  assert.equal(article.contentLocale,locale);assert.equal(article.translated,true);
  assert.equal(data.order,8);assert.ok(data.description?.length>40);
  assert.ok(!content.includes('\ufffd'),'replacement character');
  descriptions.add(data.description);bodies.add(content);
  const tree=parser.parse(content),math=[],displayMath=[],headings=[],images=[],external=[],links=[],paragraphs=[],tables=[];
  walk(tree,n=>{
    if(['inlineMath','math'].includes(n.type)){
      katex.renderToString(n.value,{throwOnError:true,strict:'error',displayMode:n.type==='math'});
      math.push(normalized(n.value));if(n.type==='math')displayMath.push(normalized(n.value));
    }
    if(n.type==='heading')headings.push({depth:n.depth,text:words(n)});
    if(n.type==='image'){assert.ok(n.alt?.trim().length>15,'descriptive image alternative');assert.ok(n.url.startsWith('/images/diagrams/groups-'));assert.ok(fs.existsSync('public'+n.url));images.push(n.url);assets.add(n.url);}
    if(n.type==='link'){links.push(n.url);if(n.url.startsWith('https://'))external.push(n.url);}
    if(n.type==='paragraph')paragraphs.push(words(n).trim());
    if(n.type==='table')tables.push(n.children.map(r=>r.children.length));
  });
  const major=headings.filter(h=>h.depth===2);
  assert.ok(major.length>=16,'substantial path of major sections');
  major.forEach((h,i)=>assert.match(h.text,new RegExp(`^8\\.${i+1}\\b`),'ordered 8.X sections'));
  assert.ok(displayMath.length>=35,'worked derivations are present');
  assert.equal(images.length,7,'seven teaching figures');
  if(locale==='en')reference={math,displayMath,levels:headings.map(h=>h.depth),images,external,paragraphs,tables};
  else {
    assert.deepEqual(displayMath,reference.displayMath,'display equations must preserve the reviewed English mathematics');
    assert.deepEqual([...math].sort(),[...reference.math].sort(),'all inline and display mathematics must preserve the reviewed expressions and multiplicities');
    assert.deepEqual(headings.map(h=>h.depth),reference.levels,'complete heading hierarchy');
    assert.deepEqual(images,reference.images,'figure parity');
    assert.deepEqual(external,reference.external,'source bibliography/link parity');
    assert.deepEqual(tables,reference.tables,'all table rows and columns');
    assert.ok(paragraphs.length>=reference.paragraphs.length*.93,'no substantial prose blocks omitted');
    const copied=paragraphs.filter(p=>p.length>200&&reference.paragraphs.includes(p));
    assert.equal(copied.length,0,'untranslated English paragraphs');
  }
  const current=await sections('curiosities',slug,locale);
  const ids=current.filter(s=>s.id).map(s=>s.id);
  assert.equal(new Set(ids).size,ids.length,'unique heading anchors');
  for(const url of links) {
    if(url.startsWith('#'))assert.ok(ids.includes(decodeURIComponent(url.slice(1))),`missing in-page anchor ${url}`);
    if(url.startsWith('/')&&!url.startsWith('/images/')){
      assert.ok(locale==='en'?!/^\/(?:ja|de|fr|it|es|ko|zh-CN|zh-TW|pt-BR)\//.test(url):url.startsWith(`/${locale}/`),`locale of internal link ${url}`);
      const [pathname,hash]=url.split('#'),[kind,target]=pathname.split('/').filter(Boolean).slice(-2);
      if(['chapters','curiosities'].includes(kind)){
        const targetSections=await sections(kind,target,locale);
        if(hash)assert.ok(targetSections.some(s=>s.id===decodeURIComponent(hash)),`missing cross-article anchor ${url}`);
      }
    }
  }
  if(!partial){const manifest=JSON.parse(fs.readFileSync('lib/discussions/manifest.json','utf8'));for(const id of ids)assert.ok(manifest[`curiosities/${slug}/${locale}`].includes(id),`missing discussion scope ${id}`);}
  const report={locale,majorSections:major.length,headings:ids.length,displayEquations:displayMath.length,mathExpressions:math.length,paragraphs:paragraphs.length,figures:images.length,characters:content.length};
  if(dist){
    const route=localePath(locale,`/curiosities/${slug}`),html=fs.readFileSync(path.join(dist,'server/app',route.slice(1)+'.html'),'utf8');
    const rendered=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
    const dom=new JSDOM(rendered),doc=dom.window.document;
    assert.equal(doc.documentElement.lang,locale);assert.equal(doc.querySelector('article.prose div[lang]')?.lang,locale);
    assert.equal(doc.querySelectorAll('.translation-notice,.katex-error').length,0);
    const allIds=[...doc.querySelectorAll('[id]')].map(n=>n.id);assert.equal(new Set(allIds).size,allIds.length);
    for(const id of ids)assert.ok(doc.getElementById(id),`rendered anchor ${id}`);
    const panels=[...doc.querySelectorAll('.section-discussion')];assert.equal(panels.length,major.length);
    assert.deepEqual(panels.map(p=>p.dataset.discussionSection),[...doc.querySelectorAll('article h2[id]')].map(h=>h.id));
    const index=JSON.parse(fs.readFileSync(path.join(dist,'server/app/search',locale+'.body'),'utf8'));
    const indexArticle=index.articles.find(a=>a.href===route);assert.equal(indexArticle?.contentLocale,locale);
    const results=search(prepareIndex(index),indexArticle.title);assert.ok(results.some(r=>r.href.startsWith(route+'#')),'search title finds article');
    for(const result of results.filter(r=>r.href.startsWith(route+'#')))assert.ok(doc.getElementById(decodeURIComponent(result.href.split('#')[1])),'search result target exists');
    const meta=doc.querySelector('link[rel="canonical"]');assert.equal(meta.href,'https://www.openphysicsnotes.com'+route);
    assert.equal(doc.querySelectorAll('link[rel="alternate"][hreflang]').length,11);
    report.renderedPanels=panels.length;report.search='passed';dom.window.close();
  }
  reports.push(report);
}catch(error){errors.push({locale,error:error.stack});}
for(const asset of assets)try{
  const xml=fs.readFileSync('public'+asset,'utf8'),dom=new JSDOM(xml,{contentType:'image/svg+xml'}),svg=dom.window.document.documentElement;
  assert.equal(svg.localName,'svg');assert.ok(svg.getAttribute('viewBox'));assert.ok(svg.querySelector('title')?.textContent);assert.ok(svg.querySelector('desc')?.textContent);
  assert.ok(!svg.querySelector('script,foreignObject'));for(const node of svg.querySelectorAll('*'))for(const attribute of node.attributes){assert.ok(!/^on/i.test(attribute.name));if(/href$/.test(attribute.name))assert.ok(attribute.value.startsWith('#'));}
  dom.window.close();
}catch(error){errors.push({asset,error:error.message});}
assert.equal(descriptions.size,languages.length,'distinct localized descriptions');assert.equal(bodies.size,languages.length,'distinct full editions');
console.log(JSON.stringify({result:errors.length?'failed':'passed',slug,reports,assets:assets.size,errors},null,2));
if(errors.length)process.exitCode=1;
