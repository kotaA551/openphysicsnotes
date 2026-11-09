import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import { JSDOM } from 'jsdom';
import { typescriptLoader } from '../seo/load-typescript.mjs';
const load = typescriptLoader();
const { parseThemePreference, themeInitScript, themeStorageKey } = load('lib/theme.ts');

test('pre-paint initialization validates saved choices and tolerates unavailable storage', () => {
  for (const [saved, expected] of [[null, 'system'], ['system', 'system'], ['light', 'light'], ['dark', 'dark'], ['invalid', 'system']]) {
    assert.equal(parseThemePreference(saved), expected);
    const document = { documentElement: { dataset: {} } };
    vm.runInNewContext(themeInitScript, { document, localStorage: { getItem: key => { assert.equal(key, themeStorageKey); return saved; } } });
    assert.equal(document.documentElement.dataset.theme, expected);
  }
  const document = { documentElement: { dataset: {} } };
  assert.doesNotThrow(() => vm.runInNewContext(themeInitScript, { document, get localStorage() { throw new Error('blocked'); } }));
  assert.equal(document.documentElement.dataset.theme, undefined);
  const root = fs.readFileSync('components/RootDocument.tsx', 'utf8');
  assert.ok(root.indexOf('id="opn-theme-init"') < root.indexOf('<body>'));
  assert.match(root, /<html lang={locale} suppressHydrationWarning>/);
});

test('all dark styles compile for explicit Dark and OS Dark, excluding explicit Light', async () => {
  for (const file of ['app/globals.css', 'components/header-search.css', 'components/article-reading.css']) {
    const result = await postcss([tailwind({ optimize: true })]).process(fs.readFileSync(file, 'utf8'), { from: path.resolve(file) });
    assert.match(result.css, /data-theme=dark/);
    assert.match(result.css, /prefers-color-scheme:dark/);
    assert.ok(result.css.includes(':root:not([data-theme=light])'));
    for (const marker of ['@reference', '@custom-variant', '@variant']) assert.ok(!result.css.includes(marker));
  }
});

test('real theme menu: persisted selection, close/focus, repeated use, storage failure and locale/navigation changes', async () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="app"></div><button id="outside">Outside</button></body></html>', { url: 'http://localhost/ja' });
  const previous = new Map();
  for (const [key, value] of Object.entries({ window: dom.window, document: dom.window.document, localStorage: dom.window.localStorage, Node: dom.window.Node, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true })) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
  }
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const nativeRequire = createRequire(import.meta.url);
  let pathname = '/ja';
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('components/ThemeMenu.tsx', 'utf8'), { fileName: 'ThemeMenu.tsx', compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  new Function('require', 'module', 'exports', source)(specifier => {
    if (specifier === 'next/navigation') return { usePathname: () => pathname };
    if (specifier.startsWith('@/')) return load(specifier.slice(2));
    return nativeRequire(specifier);
  }, module, module.exports);
  const ThemeMenu = module.exports.default;
  const app = createRoot(document.getElementById('app'));
  const act = React.act;
  const menu = () => document.querySelector('details');
  const summary = () => document.querySelector('summary');
  const buttons = () => [...document.querySelectorAll('.theme-options button')];
  const click = async index => { menu().open = true; await act(() => buttons()[index].click()); };
  try {
    localStorage.setItem(themeStorageKey, 'dark');
    await act(() => app.render(React.createElement(ThemeMenu, { locale: 'ja' })));
    assert.equal(summary().getAttribute('aria-label'), 'テーマを選択');
    assert.deepEqual(buttons().map(b => b.firstElementChild.textContent), ['system', 'Light', 'Dark']);
    assert.equal(buttons()[2].getAttribute('aria-pressed'), 'true');
    assert.equal(document.documentElement.dataset.theme, 'dark');
    await click(1);
    assert.equal(localStorage.getItem(themeStorageKey), 'light');
    assert.equal(document.documentElement.dataset.theme, 'light');
    assert.equal(menu().open, false);
    assert.equal(document.activeElement, summary());
    await click(0);
    assert.equal(localStorage.getItem(themeStorageKey), null);
    assert.equal(document.documentElement.dataset.theme, 'system');
    await click(2); await click(1); await click(2);
    assert.equal(buttons().filter(b => b.getAttribute('aria-pressed') === 'true').length, 1);
    menu().open = true;
    await act(() => menu().dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    assert.equal(menu().open, false);
    assert.equal(document.activeElement, summary());
    menu().open = true;
    await act(() => document.getElementById('outside').dispatchEvent(new window.Event('pointerdown', { bubbles: true })));
    assert.equal(menu().open, false);
    menu().open = true; buttons()[0].focus();
    await act(() => document.getElementById('outside').focus());
    assert.equal(menu().open, false);
    await act(() => window.dispatchEvent(new window.StorageEvent('storage', { key: themeStorageKey, newValue: 'light' })));
    assert.equal(document.documentElement.dataset.theme, 'light');
    await act(() => window.dispatchEvent(new window.StorageEvent('storage', { key: themeStorageKey, newValue: 'invalid' })));
    assert.equal(document.documentElement.dataset.theme, 'system');
    await act(() => window.dispatchEvent(new window.StorageEvent('storage', { key: null })));
    assert.equal(buttons()[0].getAttribute('aria-pressed'), 'true');
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('blocked'); } });
    await click(2);
    assert.equal(document.documentElement.dataset.theme, 'dark');
    menu().open = true; pathname = '/fr/about';
    await act(() => app.render(React.createElement(ThemeMenu, { locale: 'fr' })));
    assert.equal(menu().open, false);
    assert.equal(document.documentElement.dataset.theme, 'dark');
    assert.equal(summary().getAttribute('aria-label'), 'Choisir le thème');
    const shell = fs.readFileSync('components/SiteShell.tsx', 'utf8');
    assert.ok(shell.indexOf('<ThemeMenu') < shell.indexOf('<details ref={languageMenu}'));
    assert.match(shell, /name="header-preferences"/);
  } finally {
    await act(() => app.unmount()); dom.window.close();
    for (const [key, descriptor] of previous) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
  }
});
