import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
const base = process.env.THEME_QA_URL || 'http://127.0.0.1:3108';
const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'opn-theme-qa-'));
console.log('QA screenshots directory: ' + profile);
const chrome = spawn(chromePath, ['--headless=new', '--remote-debugging-port=9338', '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile, '--no-first-run', '--no-default-browser-check', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let targets;
  for (let n = 0; n < 100; n++) { try { targets = await (await fetch('http://127.0.0.1:9338/json')).json(); if (targets.length) break; } catch {} await pause(200); }
  assert.ok(targets?.length, 'Chrome debugging endpoint starts');
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let loadCount = 0; let id = 0; const pending = new Map(); const errors = [];
  socket.onmessage = ({ data }) => { const m = JSON.parse(data); if (m.id) { const p = pending.get(m.id); pending.delete(m.id); if (m.error) p.reject(new Error(JSON.stringify(m.error))); else p.resolve(m.result); } else if (m.method === 'Page.loadEventFired') loadCount++; else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text); else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value || a.description).join(' ')); };
  const send = (method, params = {}) => new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params })); });
  const evaluate = async expression => { const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails)); return response.result.value; };
  const waitFor = async expression => { for (let i = 0; i < 180; i++) { try { if (await evaluate(expression)) return; } catch {} await pause(500); } throw new Error('Timed out: ' + expression); };
  const navigate = async route => { await send('Page.navigate', { url: base + route }); await waitFor('document.readyState === "complete" && location.pathname === ' + JSON.stringify(route) + ' && !!document.querySelector(".theme-menu")'); await pause(1000); };
  const background = () => evaluate('getComputedStyle(document.body).backgroundColor');
  const osTheme = async value => { await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value }] }); await pause(100); };
  const choose = async index => { await evaluate('document.querySelector(".theme-menu summary").click()'); await evaluate('document.querySelectorAll(".theme-options button")[' + index + '].click()'); await pause(100); };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await osTheme('light'); await navigate('/ja');
  assert.equal(await background(), 'rgb(252, 253, 251)');
  await osTheme('dark'); assert.equal(await background(), 'rgb(21, 27, 24)');
  await choose(1); assert.equal(await background(), 'rgb(252, 253, 251)');
  assert.equal(await evaluate('document.activeElement === document.querySelector(".theme-menu summary")'), true);
  assert.equal(await evaluate('document.querySelector(".theme-menu").open'), false);
  await osTheme('light'); await choose(2); assert.equal(await background(), 'rgb(21, 27, 24)');
  const beforeReload = loadCount; await send('Page.reload'); while (loadCount <= beforeReload) await pause(100); await waitFor('document.querySelectorAll(".theme-options button")[2]?.getAttribute("aria-pressed") === "true"');
  assert.equal(await background(), 'rgb(21, 27, 24)');
  await evaluate('document.querySelector(".theme-menu summary").click()');
  const desktop = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(profile, 'desktop-dark.png'), Buffer.from(desktop.data, 'base64'));
  await evaluate('document.querySelector(".language-menu:not(.theme-menu) summary").click()');
  assert.equal(await evaluate('document.querySelector(".theme-menu").open'), false);
  await evaluate('document.querySelector(".theme-menu summary").focus()');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  assert.equal(await evaluate('document.querySelector(".theme-menu").open'), true);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  assert.equal(await evaluate('document.querySelector(".theme-menu").open'), false);
  for (const width of [320, 375, 430, 480, 600, 760, 768, 1024, 1280]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
    await evaluate('document.querySelector(".theme-menu").open = true');
    const layout = await evaluate('(() => { const panel = document.querySelector(".theme-options").getBoundingClientRect(); const theme = document.querySelector(".theme-menu summary").getBoundingClientRect(); const lang = document.querySelector(".language-menu:not(.theme-menu) summary").getBoundingClientRect(); const brand = document.querySelector(".brand").getBoundingClientRect(); const search = document.querySelector(".header-search").getBoundingClientRect(); return {panelLeft:panel.left,panelRight:panel.right,themeRight:theme.right,langLeft:lang.left,langRight:lang.right,brandRight:brand.right,searchLeft:search.left,overflow:document.documentElement.scrollWidth>innerWidth};})()');
    assert.ok(layout.panelLeft >= 0 && layout.panelRight <= width, JSON.stringify({ width, layout }));
    assert.ok(layout.themeRight <= layout.langLeft && layout.langRight <= width, JSON.stringify({ width, layout }));
    assert.ok(layout.brandRight <= layout.searchLeft + 1, JSON.stringify({ width, layout }));
    assert.equal(layout.overflow, false, 'No page overflow at width ' + width);
    if (width === 375) { const shot = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(profile, 'mobile-dark.png'), Buffer.from(shot.data, 'base64')); }
  }
  await choose(0); await osTheme('light'); assert.equal(await background(), 'rgb(252, 253, 251)');
  await osTheme('dark'); assert.equal(await background(), 'rgb(21, 27, 24)');
  await choose(1); await navigate('/fr/about'); assert.equal(await background(), 'rgb(252, 253, 251)');
  assert.equal(await evaluate('document.querySelector(".theme-menu summary").getAttribute("aria-label")'), 'Choisir le thème');
  await navigate('/ja/chapters/1-Newton-mechanics'); await choose(2); assert.equal(await background(), 'rgb(21, 27, 24)');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".prose")).color'), 'rgb(233, 229, 223)');
  await choose(0); await send('Emulation.setScriptExecutionDisabled', { value: true }); await send('Page.reload'); await pause(3000);
  assert.equal(await background(), 'rgb(21, 27, 24)');
  await osTheme('light'); assert.equal(await background(), 'rgb(252, 253, 251)');
  assert.deepEqual(errors.filter(e => !e.includes('favicon')), []);
  console.log('PASS: real Chromium theme/OS matrix, persistence, keyboard, menu exclusivity, nine viewport widths, locale/article navigation, JavaScript-disabled OS fallback, no runtime/hydration errors.');
  console.log('Screenshots: ' + profile);
  await send('Browser.close');
} finally {
  socket?.close();
  chrome.kill();
}
