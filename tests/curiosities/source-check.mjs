import fs from 'node:fs';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkMath from 'remark-math';
import katex from 'katex';
import { JSDOM } from 'jsdom';
import { articleSections } from '../../lib/search/build.mjs';
import { typescriptLoader } from '../seo/load-typescript.mjs';

const load = typescriptLoader();
const { locales } = load('lib/i18n.ts');
const { loadArticle } = load('lib/articles.ts');
export const slugs = ['black-hole-information-paradox','dark-energy','dark-matter','loop-quantum-gravity','string-theory'];
const legacy = JSON.parse(fs.readFileSync('tests/curiosities/legacy-sections.json','utf8'));
const manifest = JSON.parse(fs.readFileSync('tests/fixtures/legacy-heading-ids.json','utf8'));
const errors = [];
const reports = [];
const assets = new Set();
const parser = unified().use(remarkParse).use(remarkMdx).use(remarkMath);
const walk = (node, visit) => { visit(node); for(const child of node.children || []) walk(child,visit); };
const proseText = node => node.type === 'text' ? node.value : ['math','inlineMath','code','inlineCode'].includes(node.type) ? '' : (node.children || []).map(proseText).join('');
const check = (name, run) => { try { run(); } catch(error) { errors.push(`${name}: ${error.message}`); } };
for (const [key, old] of Object.entries(legacy)) {
  check(`${key} original headings`, () => {
    const current = fs.readFileSync(old.file,'utf8').split(/\r?\n/).filter(line=>/^#{1,6} /.test(line));
    let last = -1;
    for (const heading of old.headings) { last = current.indexOf(heading,last+1); assert.ok(last >= 0,`missing/reordered ${heading}`); }
    for(const id of old.ids) assert.ok(manifest[key]?.includes(id),`lost legacy heading ID ${id}`);
  });
}
for (const slug of slugs) {
  let englishMath, englishLevels, englishLinks, englishParagraphs;
  const contents = new Set(), descriptions = new Set();
  for(const locale of locales) {
    const file = locale === 'en' ? `content/curiosities/${slug}.mdx` : `content/translations/${locale}/curiosities/${slug}.mdx`;
    try {
      const {content,data} = matter(fs.readFileSync(file,'utf8'));
      const article = loadArticle('curiosities',slug,locale);
      assert.equal(article.contentLocale,locale,'must load its own translation');
      assert.ok(data.description?.length > 40,'explicit localized metadata');
      assert.ok(!content.includes('\ufffd'),'no replacement characters');
      const tree = parser.parse(content), equations = [], displayEquations = [], levels = [], external = [], images = [], paragraphs = [];
      walk(tree,node=>{
        if(node.type === 'paragraph') {const text=proseText(node).trim();if(text.length>150 && text.split(/\s+/).length>20) paragraphs.push(text);}
        if(['math','inlineMath'].includes(node.type)) {
          katex.renderToString(node.value,{throwOnError:true,strict:'error',displayMode:node.type === 'math'});
          equations.push(node.value.replace(/\s+/g,''));
          if(node.type === 'math') displayEquations.push(node.value.replace(/\s+/g,''));
        }
        if(node.type === 'heading') levels.push(node.depth);
        if(node.type === 'image') {
          assert.ok(node.alt?.trim(),'image alternative required');
          assert.ok(node.url.startsWith('/images/'),'local image required');
          assert.ok(fs.existsSync('public'+node.url),`missing image ${node.url}`);
          assets.add(node.url); images.push(node.url);
        }
        if(node.type === 'link') {
          if(/^https:\/\//.test(node.url)) external.push(node.url);
          if(node.url.startsWith('/') && !node.url.startsWith('/images/')) {
            const expectedPrefix = locale === 'en' ? /^\/(chapters|curiosities)\// : new RegExp(`^/${locale}/(chapters|curiosities)/`);
            assert.match(node.url,expectedPrefix,'internal article link must retain locale');
            const parts = node.url.split('#')[0].split('/').filter(Boolean);
            const [kind,target] = parts.slice(-2);
            assert.ok(loadArticle(kind,target,locale),`missing target ${node.url}`);
          }
        }
      });
      const sections = await articleSections(content);
      const ids = sections.filter(section=>section.id).map(section=>section.id);
      assert.equal(new Set(ids).size,ids.length,'unique section anchors');
      assert.ok(equations.length > 8,'substantive mathematical content');
      assert.ok(external.length > 3,'inline primary references');
      // Inline identifiers may change order or repeat differently with translated
      // grammar. Compile every expression; compare complete displayed formulas.
      if(locale === 'en') { englishMath=displayEquations; englishLevels=levels; englishLinks=[...new Set(external)].sort(); englishParagraphs=new Set(paragraphs); }
      else {
        assert.ok(!paragraphs.some(text=>englishParagraphs.has(text)),'untranslated English paragraph');
        check(`${slug}/${locale} display-equation parity`,()=>assert.deepEqual(displayEquations,englishMath));
        check(`${slug}/${locale} section parity`,()=>assert.deepEqual(levels,englishLevels));
        check(`${slug}/${locale} source-link parity`,()=>assert.deepEqual([...new Set(external)].sort(),englishLinks));
      }
      contents.add(content); descriptions.add(data.description);
      reports.push({slug,locale,characters:content.length,sections:ids.length,equations:equations.length,displayEquations:displayEquations.length,images:images.length,references:new Set(external).size});
    } catch(error) { errors.push(`${file}: ${error.message}`); }
  }
  check(`${slug} distinct localization`,()=>{assert.equal(contents.size,10);assert.equal(descriptions.size,10);});
}
for(const asset of assets) {
  if(!/(bh-info-|dark-energy-deep-|dark-matter-deep-|lqg-deep-|string-deep-)/.test(asset)) continue;
  check(asset,()=>{
    const source = fs.readFileSync('public'+asset,'utf8');
    const document = new JSDOM(source,{contentType:'image/svg+xml'}).window.document;
    assert.equal(document.documentElement.localName,'svg');
    assert.ok(document.querySelector('title')?.textContent.trim());
    assert.ok(document.querySelector('desc')?.textContent.trim());
    assert.ok(document.documentElement.getAttribute('viewBox'));
    assert.equal(document.querySelectorAll('script,foreignObject').length,0);
    for(const element of document.querySelectorAll('*')) for(const attribute of element.attributes) {
      assert.ok(!/^on/i.test(attribute.name),'no script handlers');
      if(/href$/i.test(attribute.name)) assert.ok(attribute.value.startsWith('#'),'no external content');
    }
    assert.doesNotMatch(source, /<!ENTITY|@import|url\(\s*['"]?https?:/i);
  });
}
console.log(JSON.stringify({result:errors.length?'fail':'pass',editions:reports.length,legacyEditions:Object.keys(legacy).length,assets:[...assets],reports,errors},null,2));
process.exitCode = errors.length ? 1 : 0;
