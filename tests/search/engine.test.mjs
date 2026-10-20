import { test } from 'node:test';
import assert from 'node:assert/strict';
import { typescriptLoader } from '../seo/load-typescript.mjs';
const { normalize, queryTerms, prepareIndex, search, MAX_RESULTS } = typescriptLoader()('lib/search/engine.ts');

const index = prepareIndex({ version: 1, articles: [{ title: 'Fluid mechanics', contentTitle: 'Fluid mechanics', href: '/chapters/fluids', contentLocale: 'en' }], sections: [
  { article: 0, id: 'existing-id', heading: 'Viscosity', text: 'Dynamic viscosity describes the internal resistance to flow.' },
  { article: 0, id: 'repeated-1', heading: 'Conservation', text: 'The viscosity is important. '.repeat(20) + 'Special body keyword: vorticity.' },
  { article: 0, id: 'unicode-力', heading: 'Vorticity', text: 'The curl of the velocity field.' },
] });

test('headings outrank body matches; body-only queries retain exact anchors and contextual snippets', () => {
  const result = search(index, 'vorticity');
  assert.equal(result[0].heading, 'Vorticity');
  assert.equal(result[0].href, '/chapters/fluids#unicode-%E5%8A%9B');
  assert.equal(result[1].href, '/chapters/fluids#repeated-1');
  assert.match(result[1].snippet, /vorticity/);
  assert.ok(result[1].snippet.length <= 172);
  assert.equal(search(index, 'internal resistance')[0].href, '/chapters/fluids#existing-id');
  assert.equal(search(index, 'unmatched').length, 0);
  assert.equal(search(index, 'internal nonexistent').length, 0);
  assert.equal(search(index, 'fluid viscosity')[0].heading, 'Viscosity');
});

test('Unicode normalization keeps CJK syllables and voices distinct, supports accents/full width/whitespace', () => {
  assert.equal(normalize(' ＮＥＷＴＯＮ  Mécanica  '), 'newton mecanica');
  assert.equal(normalize('振動 ガス'), '振動 ガス');
  assert.notEqual(normalize('ガス'), normalize('カス'));
  assert.equal(normalize('한글'), '한글');
  assert.deepEqual(queryTerms('   -- 💡 '), []);
  for (const word of ['振動', '量子', '한글', 'Mécanica']) {
    const localized = prepareIndex({ articles: [{ title: 'Book', contentTitle: 'Book', href: '/ja/book', contentLocale: 'ja' }], sections: [{ article: 0, id: 'actual-id', heading: 'Section', text: `前文 ${word} 後文` }] });
    assert.equal(search(localized, normalize(word))[0].href, '/ja/book#actual-id');
  }
});

test('results and input work are bounded, queries are deterministic and reusable', () => {
  const rows = Array.from({ length: 100 }, (_, i) => ({ ...index[0], section: { ...index[0].section, id: `id-${i}` } }));
  assert.equal(search(rows, 'viscosity').length, MAX_RESULTS);
  assert.deepEqual(search(rows, 'viscosity'), search(rows, 'viscosity'));
  assert.deepEqual(search(rows, ''), []);
  assert.equal(queryTerms('a '.repeat(1000)).length, 1);
  assert.equal(queryTerms(Array.from({ length: 30 }, (_, i) => `word${i}`).join(' ')).length, 12);
});

test('an exact localized article title survives competing section matches and the result limit', () => {
  const localized = prepareIndex({ version: 1, articles: [
    { title: 'Física da matéria condensada', contentTitle: 'Física da matéria condensada', href: '/pt-BR/condensed', contentLocale: 'pt-BR' },
    { title: 'Mecânica quântica', contentTitle: '7. Mecânica quântica', href: '/pt-BR/quantum', contentLocale: 'pt-BR' },
  ], sections: [
    ...Array.from({ length: MAX_RESULTS + 2 }, (_, i) => ({ article: 0, id: `related-${i}`, heading: 'Mecânica quântica', text: 'Aplicações da mecânica quântica em materiais.' })),
    { article: 1, id: 'introduction', heading: 'Introdução', text: 'Estados e observáveis descrevem o sistema.' },
  ] });
  assert.equal(search(localized, 'MECANICA QUANTICA')[0].href, '/pt-BR/quantum#introduction');
  assert.equal(search(localized, '7. Mecânica quântica')[0].href, '/pt-BR/quantum#introduction');
  assert.equal(search(localized, 'materiais')[0].href, '/pt-BR/condensed#related-0');
});
