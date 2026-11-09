import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';

const require = createRequire(import.meta.url);
const source = fs.readFileSync('components/RootDocument.tsx', 'utf8');
const compiled = ts.transpileModule(source, { fileName: 'RootDocument.tsx', compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
function render(id) {
  const module = { exports: {} };
  new Function('require', 'module', 'exports', 'process', compiled)(specifier => {
    if (specifier.endsWith('.css')) return {};
    if (specifier === '@/lib/seo') return { siteUrl: 'https://openphysicsnotes.com' };
    if (specifier === '@/lib/theme') return { themeInitScript: '' };
    if (specifier === '@/components/SiteShell') return { __esModule: true, default: 'site-shell' };
    if (specifier === 'next/script') return { __esModule: true, default: 'script' };
    return require(specifier);
  }, module, module.exports, { env: { NEXT_PUBLIC_GA_ID: id } });
  const scripts = [];
  function visit(node) {
    React.Children.forEach(node, child => {
      if (!React.isValidElement(child)) return;
      if (child.type === 'script') scripts.push(child.props);
      visit(child.props.children);
    });
  }
  visit(module.exports.default({ children: null, locale: 'ja' }));
  return scripts;
}

test('no measurement ID means no Google script or initialization', () => {
  for (const id of [undefined, '']) {
    const scripts = render(id);
    assert.equal(scripts.filter(script => script.src || script.id === 'ga4-init').length, 0);
    assert.equal(scripts.filter(script => script.id === 'opn-theme-init').length, 1);
  }
});

test('one loader and one default config preserve GA4 automatic initial/history tracking', () => {
  const id = 'G-K197CS7ZBG';
  const scripts = render(id);
  assert.deepEqual(scripts.filter(script => script.src).map(script => [script.src, script.strategy]), [[`https://www.googletagmanager.com/gtag/js?id=${id}`, 'afterInteractive']]);
  const init = scripts.filter(script => script.id === 'ga4-init');
  assert.equal(init.length, 1);
  assert.equal(init[0].strategy, 'afterInteractive');
  const context = vm.createContext({});
  context.window = context;
  vm.runInContext(init[0].children, context);
  const commands = Array.from(context.dataLayer, args => Array.from(args));
  assert.equal(commands.length, 2);
  assert.equal(commands[0][0], 'js');
  assert.deepEqual(commands[1], ['config', id]);
  assert.equal(fs.existsSync('components/Analytics.tsx'), false, 'manual route tracker is removed');
  assert.doesNotMatch(source, /usePathname|useSearchParams|<Analytics|page_path|send_page_view/);
});
