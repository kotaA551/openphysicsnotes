import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { JSDOM } from 'jsdom';
import { typescriptLoader } from '../seo/load-typescript.mjs';

test('real React combobox: debounce, keyboard, IME, cancellation, retry, repeat and language reset', async () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="app"></div><button id="outside">Outside</button></body></html>', { url: 'http://localhost/' });
  const previous = new Map();
  for (const [key, value] of Object.entries({ window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, IS_REACT_ACT_ENVIRONMENT: true })) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
  dom.window.HTMLElement.prototype.scrollIntoView = function () {};
  dom.window.getComputedStyle = () => ({ display: 'none' });
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const nativeRequire = createRequire(import.meta.url);
  const load = typescriptLoader();
  let pathname = '/';
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('components/HeaderSearch.tsx', 'utf8'), { fileName: 'HeaderSearch.tsx', compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  new Function('require', 'module', 'exports', source)(specifier => {
    if (specifier.endsWith('.css')) return {};
    if (specifier === 'next/navigation') return { usePathname: () => pathname };
    if (specifier.startsWith('@/')) return load(specifier.slice(2));
    return nativeRequire(specifier);
  }, module, module.exports);
  const HeaderSearch = module.exports.default;
  const app = createRoot(document.getElementById('app'));
  const calls = [];
  let failure = false, delayed = false;
  const savedFetch = globalThis.fetch;
  const fixture = { version: 1, articles: [{ title: 'Mechanics', contentTitle: 'Mechanics', href: '/chapters/1-Newton-mechanics', contentLocale: 'en' }], sections: Array.from({ length: 20 }, (_, n) => ({ article: 0, id: `exact-heading-${n}`, heading: `Gravity ${n}`, text: 'Body keyword acceleration. 振動 量子 한글' })) };
  globalThis.fetch = (url, options) => {
    const call = { url, options };
    calls.push(call);
    const result = () => ({ ok: !failure, text: async () => JSON.stringify(fixture) });
    if (delayed) return new Promise(resolve => { call.resolve = () => resolve(result()); });
    return Promise.resolve(result());
  };
  let navigated;
  document.addEventListener('click', event => {
    const option = event.target.closest?.('[role="option"]');
    if (option) { event.preventDefault(); navigated = option.getAttribute('href'); }
  });
  const act = React.act;
  const field = () => document.querySelector('[role="combobox"]');
  const options = () => [...document.querySelectorAll('[role="option"]')];
  const wait = async () => act(async () => { await new Promise(resolve => setTimeout(resolve, 190)); });
  const render = async locale => act(async () => app.render(React.createElement(HeaderSearch, { locale, key: locale })));
  const type = async value => act(async () => {
    field().click();
    field().focus();
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set.call(field(), value);
    field().dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  });
  const key = async (key, properties = {}) => act(async () => field().dispatchEvent(new dom.window.KeyboardEvent('keydown', { key, bubbles: true, ...properties })));
  const click = async element => act(async () => element.click());
  try {
    await render('en');
    assert.equal(calls.length, 0);
    await type('gravity');
    assert.match(document.querySelector('[role="status"]').textContent, /Searching/);
    assert.equal(calls.length, 0, 'debounce prevents immediate network load');
    await wait();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, '/search/en');
    assert.equal(calls[0].options.credentials, 'omit');
    assert.equal(options().length, 8);
    await key('ArrowUp');
    assert.equal(options().at(-1).getAttribute('aria-selected'), 'true');
    await key('ArrowDown');
    assert.equal(options()[0].id, field().getAttribute('aria-activedescendant'));
    await key('ArrowDown');
    await key('Enter');
    assert.equal(navigated, '/chapters/1-Newton-mechanics#exact-heading-1');
    assert.equal(field().value, '');
    assert.equal(field().getAttribute('aria-expanded'), 'false');

    await type('acceleration'); await wait();
    assert.equal(calls.length, 1, 'reuse one prepared locale index');
    await key('Escape');
    assert.equal(field().getAttribute('aria-expanded'), 'false');
    assert.equal(document.activeElement, field());
    await key('ArrowUp'); await wait();
    assert.equal(options().length, 8);
    assert.equal(field().getAttribute('aria-activedescendant'), options().at(-1).id, 'reopening cached results preserves keyboard selection after debounce');
    await key('Enter');
    assert.equal(navigated, '/chapters/1-Newton-mechanics#exact-heading-7');
    await type('acceleration'); await wait();
    await click(document.querySelector('[aria-label="Clear search"]'));
    assert.equal(field().value, '');
    assert.equal(options().length, 0);
    await type('doesnotexist'); await wait();
    assert.match(document.querySelector('[role="status"]').textContent, /No matching/);
    await act(async () => document.getElementById('outside').dispatchEvent(new dom.window.Event('pointerdown', { bubbles: true })));
    assert.equal(field().getAttribute('aria-expanded'), 'false');

    // React uses composition event normalization. These events exercise the same
    // handlers used by JA/ZH/KO IMEs; this is not a claim of OS-level IME testing.
    for (const [locale, text] of [['ja', '振動'], ['zh-CN', '量子'], ['ko', '한글']]) {
      await render(locale);
      const before = calls.length;
      navigated = undefined;
      await act(async () => field().dispatchEvent(new dom.window.CompositionEvent('compositionstart', { bubbles: true })));
      await type(text); await wait();
      await key('Enter', { isComposing: true, keyCode: 229 });
      assert.equal(navigated, undefined);
      assert.equal(calls.length, before, 'no index fetch while composing');
      await act(async () => field().dispatchEvent(new dom.window.CompositionEvent('compositionend', { bubbles: true, data: text })));
      await key('Enter');
      assert.equal(navigated, undefined, 'composition confirmation must not navigate');
      await wait();
      assert.equal(calls.at(-1).url, `/search/${locale}`);
      assert.equal(options().length, 8);
      await key('Enter');
      assert.equal(navigated, '/chapters/1-Newton-mechanics#exact-heading-0');
    }

    delayed = true;
    await render('de'); await type('gravity'); await wait();
    const interrupted = calls.at(-1);
    await type('doesnotexist');
    assert.ok(interrupted.options.signal.aborted);
    await act(async () => interrupted.resolve());
    assert.equal(options().length, 0, 'old response cannot restore old results');
    await wait();
    const languageInterrupted = calls.at(-1);
    await render('fr');
    assert.ok(languageInterrupted.options.signal.aborted);
    await act(async () => languageInterrupted.resolve());
    assert.equal(field().value, '');
    assert.equal(options().length, 0);

    await type('gravity'); await wait();
    const closedRequest = calls.at(-1);
    await key('Escape');
    assert.ok(closedRequest.options.signal.aborted);
    await act(async () => closedRequest.resolve());
    assert.equal(field().getAttribute('aria-expanded'), 'false', 'late response cannot reopen a dismissed search');

    delayed = false; failure = true;
    await type('gravity'); await wait();
    assert.match(document.querySelector('[role="status"]').textContent, /Impossible/);
    failure = false;
    await click(document.querySelector('.search-retry')); await wait();
    assert.equal(options().length, 8);
    assert.ok(document.querySelector('.search-fallback'));
    pathname = '/fr/chapters/1-Newton-mechanics';
    await render('fr');
    assert.equal(field().value, '');
    assert.equal(field().getAttribute('aria-expanded'), 'false');
    await type('gravity'); await wait();
    await act(async () => document.getElementById('outside').focus());
    assert.equal(field().getAttribute('aria-expanded'), 'false', 'tabbing away dismisses results');
    dom.window.getComputedStyle = () => ({ display: 'inline-flex' });
    // jsdom has no layout; model a browser refusing to focus display:none input.
    const focusVisibleInput = field().focus.bind(field());
    field().focus = () => { if (document.querySelector('.header-search').classList.contains('is-open')) focusVisibleInput(); };
    await click(document.querySelector('.search-trigger'));
    assert.equal(document.activeElement, field(), 'compact trigger focuses expanded input');
    assert.equal(document.querySelector('.search-trigger').tabIndex, -1);
    await click(document.querySelector('.search-close'));
    assert.equal(document.activeElement, document.querySelector('.search-trigger'));
    assert.equal(field().getAttribute('aria-expanded'), 'false');
  } finally {
    await act(async () => app.unmount());
    globalThis.fetch = savedFetch;
    dom.window.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
