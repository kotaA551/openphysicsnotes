import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

test('phi-four figure has four undirected external scalar legs and a single vertex', () => {
  const svg = fs.readFileSync('public/images/diagrams/phi4-tree.svg', 'utf8');
  const doc = new JSDOM(svg, { contentType: 'image/svg+xml' }).window.document;
  assert.equal(doc.querySelectorAll('path[id^="scalar-p"]').length, 4);
  assert.equal(doc.querySelectorAll('circle').length, 1);
  assert.equal(doc.querySelectorAll('marker,[marker-end],[marker-start]').length, 0);
  assert.match(doc.querySelector('text[fill]').textContent, /−iλ/);
  assert.ok(doc.querySelector('desc').textContent.includes('No internal propagator or loop'));
});

test('all ten editions place an accessible localized scalar figure within section 8.3.4', () => {
  for (const locale of ['en', ...fs.readdirSync('content/translations').filter(x => fs.statSync(path.join('content/translations', x)).isDirectory())]) {
    const file = path.join('content', ...(locale === 'en' ? [] : ['translations', locale]), 'chapters/8-Quantum-field-theory.mdx');
    const source = fs.readFileSync(file, 'utf8');
    const section = source.split('### 8.3.4 ')[1].split('### 8.3.5 ')[0];
    assert.equal((source.match(/data-study-figure="phi4-tree"/g) || []).length, 1, locale);
    assert.match(section, /alt="[^"]{15,}"/, locale);
    assert.match(section, /width="720" height="440"/, locale);
    assert.match(section, /−λφ⁴\/4!/, locale);
    assert.match(section, /−iλ/, locale);
    assert.match(section, /<figcaption>[\s\S]+<\/figcaption>/, locale);
  }
});
