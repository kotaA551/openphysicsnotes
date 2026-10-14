import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { typescriptLoader } from '../seo/load-typescript.mjs';
import { articleSections } from '../../lib/search/build.mjs';

const dist = process.env.NEXT_BUILD_DIR || '.next';
const load = typescriptLoader();
const { locales } = load('lib/i18n.ts');
const { articleMetadata, siteUrl } = load('lib/seo.ts');
const { loadArticle } = load('lib/articles.ts');
const slugs = ['black-hole-information-paradox','dark-energy','dark-matter','loop-quantum-gravity','string-theory'];
const legacy = JSON.parse(fs.readFileSync('tests/curiosities/legacy-sections.json','utf8'));
const manifest = JSON.parse(fs.readFileSync('lib/discussions/manifest.json','utf8'));
const errors = [], reports = [];
let preservedIds = 0;
const check = (name,run) => {try{run();}catch(error){errors.push(`${name}: ${error.message}`);}};
for(const locale of locales) {
  const search = JSON.parse(fs.readFileSync(path.join(dist,'server/app/search',`${locale}.body`),'utf8'));
  for(const slug of [...slugs,'differential-geometry','navier-stokes-equation']) {
    const route = `${locale==='en'?'':`/${locale}`}/curiosities/${slug}`;
    const expectedSearchSections = slugs.includes(slug) ? await articleSections(loadArticle('curiosities',slug,locale).content) : null;
    check(route,()=>{
      const dom = new JSDOM(fs.readFileSync(path.join(dist,'server/app',route.slice(1)+'.html'),'utf8'));
      try {
      const document = dom.window.document;
      const article = document.querySelector('article');
      assert.ok(article);
      assert.equal(article.querySelectorAll('.differential-geometry-body').length,slug==='differential-geometry'?1:0,'style scope must follow article slug in every locale');
      const title = article.querySelector(':scope > h1');
      assert.equal(title.textContent,loadArticle('curiosities',slug,locale).title);
      assert.equal(title.closest('.differential-geometry-body'),null,'actual title remains outside scope');
      const key = `curiosities/${slug}/${loadArticle('curiosities',slug,locale).contentLocale}`;
      for(const id of legacy[key]?.ids || []) { assert.ok(document.getElementById(id),`old anchor missing: ${id}`); preservedIds++; }
      for(const id of manifest[key] || []) assert.ok(document.getElementById(id),`discussion manifest points to missing heading: ${id}`);
      if(slug==='differential-geometry') {
        const headings = article.querySelectorAll('.differential-geometry-body h1');
        assert.equal(headings.length,7,'all seven major section headings scoped');
        for(const heading of headings) assert.equal(heading.querySelector('a')?.getAttribute('href'),'#'+heading.id,'major-section permalink preserved');
      }
      if(slugs.includes(slug)) {
        assert.equal(article.querySelector(':scope > div[lang]')?.lang,locale,'body must be fully localized');
        assert.equal(article.querySelector('.translation-notice'),null);
        assert.ok(article.querySelector('.katex-display math'),'accessible rendered mathematics');
        assert.equal(article.querySelectorAll('.katex-error').length,0);
        assert.equal(document.querySelector('link[rel=canonical]').href,siteUrl+route);
        assert.deepEqual(Object.fromEntries([...document.querySelectorAll('link[rel=alternate][hreflang]')].map(a=>[a.hreflang,a.href])),articleMetadata('curiosities',slug,locale).alternates.languages);
        assert.equal(document.querySelectorAll('link[rel=alternate][hreflang]').length,11,'ten-language cluster plus x-default');
        const entry = search.articles.find(a=>a.href===route);
        assert.ok(entry); assert.equal(entry.contentLocale,locale);
        const articleIndex = search.articles.indexOf(entry);
        assert.deepEqual(search.sections.filter(section=>section.article===articleIndex).map(({article: _article,...section})=>section),expectedSearchSections,'generated search must include the current expanded headings and prose exactly');
        assert.ok(article.querySelectorAll('img').length >= 2,'explanatory illustrations present');
        for(const image of article.querySelectorAll('img')) assert.ok(image.alt.trim());
      }
      reports.push({route,contentLocale:loadArticle('curiosities',slug,locale).contentLocale,result:'pass'});
      } finally {
        // KaTeX-heavy existing articles contain large DOMs. Release each window
        // before inspecting the next route, including after assertion failures.
        dom.window.close();
      }
    });
  }
}
check('generated CSS scope and typography',()=>{
  const files = fs.readdirSync(path.join(dist,'static/css'),{recursive:true}).filter(f=>String(f).endsWith('.css'));
  const css = files.map(f=>fs.readFileSync(path.join(dist,'static/css',f),'utf8')).join('\n');
  // Differential Geometry now shares the explicitly annotated reading layout
  // with the main chapters. The legacy wrapper remains for scope compatibility.
  assert.match(css,/\.prose\s+\.article-reading\s*>\s*\[data-article-heading=["']?division["']?\][^{]*\{[^}]*font-size:25px/);
  assert.match(css,/\.prose\s+\.article-reading\s*>\s*\[data-article-heading\]\s*\{[^}]*color:var\(--tw-prose-headings\)/);
  assert.match(css,/\.prose\s+\.article-reading\s*>\s*\[data-article-heading\]\s*>\s*a\s*\{[^}]*text-decoration:none/);
  assert.match(css,/a:focus-visible[^}]*outline/,'global focus indicator retained');
});
console.log(JSON.stringify({result:errors.length?'fail':'pass',pages:reports.length,preservedLegacyAnchors:preservedIds,visualBrowser:'not assessed by this static-output check',reports,errors},null,2));
process.exitCode=errors.length?1:0;
