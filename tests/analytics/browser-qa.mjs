// Isolated headless Chrome. Default: mock Google loader and inspect app commands.
// GA_QA_REAL=1: real gtag, intercepted collection. GA_QA_LIVE=1: four real pageviews.
// Set GA_QA_URL for a deployed site, or GA_QA_OUT for a static export.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import http from 'node:http';
const live = process.env.GA_QA_LIVE === '1';
const real = live || process.env.GA_QA_REAL === '1';
const hits = [];
const collectResponses = [];
const networkFailures = [];
const root = path.resolve(process.env.GA_QA_OUT || 'out');
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file + '.html')) file += '.html';
  else if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  const ext = path.extname(file);
  res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/x-component' })[ext] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = process.env.GA_QA_URL || 'http://127.0.0.1:' + server.address().port;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'opn-ga4-qa-'));
const chrome = spawn(process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--remote-debugging-port=9341', '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile, '--no-first-run', '--no-default-browser-check', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let targets;
  for (let n = 0; n < 100; n++) { try { targets = await (await fetch('http://127.0.0.1:9341/json')).json(); if (targets.length) break; } catch {} await pause(200); }
  assert.ok(targets?.length);
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0; let googleLoads = 0; const pending = new Map();
  const record = request => {
    if (!/\/g\/collect(?:\?|$)/.test(request.url)) return;
    const common = new URL(request.url).searchParams;
    for (const line of (request.postData || '').split('\n')) {
      const body = new URLSearchParams(line);
      const get = key => body.get(key) || common.get(key);
      if (get('en') === 'page_view') hits.push({ event: get('en'), id: get('tid'), location: get('dl') });
    }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params })); });
  socket.onmessage = ({ data }) => {
    const m = JSON.parse(data);
    if (m.id) { const p = pending.get(m.id); pending.delete(m.id); if (m.error) p.reject(new Error(JSON.stringify(m.error))); else p.resolve(m.result); }
    else if (m.method === 'Network.requestWillBeSent' && live) record(m.params.request);
    else if (m.method === 'Network.responseReceived' && /\/g\/collect(?:\?|$)/.test(m.params.response.url)) collectResponses.push(m.params.response.status);
    else if (m.method === 'Network.loadingFailed') networkFailures.push(m.params.errorText);
    else if (m.method === 'Fetch.requestPaused') {
      if (real) record(m.params.request);
      if (m.params.request.url.includes('googletagmanager.com/gtag/js')) {
        googleLoads++;
        assert.equal(new URL(m.params.request.url).searchParams.get('id'), 'G-K197CS7ZBG');
      }
      void send('Fetch.fulfillRequest', { requestId: m.params.requestId, responseCode: real ? 204 : 200, responseHeaders: [{ name: 'Content-Type', value: 'application/javascript' }], body: '' });
    }
  };
  const evaluate = async expression => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
  const waitFor = async expression => { for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await pause(100); } console.log('Timeout diagnostics:', await evaluate('JSON.stringify({url:location.href, title:document.title, dataLayer:window.dataLayer && Array.from(window.dataLayer,args=>Array.from(args)), scripts:Array.from(document.scripts,s=>({src:s.src,id:s.id})),body:document.body.innerText.slice(0,300)})'), networkFailures); throw new Error('Timed out: ' + expression); };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Network.enable');
  if (!live) await send('Fetch.enable', { patterns: real ? [{ urlPattern: '*google-analytics.com/g/collect*' }, { urlPattern: '*analytics.google.com/g/collect*' }] : [{ urlPattern: '*googletagmanager.com*' }, { urlPattern: '*google-analytics.com*' }] });
  const checkHits = async (count, phase) => {
    if (!real) return;
    for (let i = 0; i < 100 && hits.length < count; i++) await pause(100);
    await pause(2000);
    console.log(JSON.stringify({ phase, count: hits.length, hits, collectResponses, networkFailures }));
    assert.equal(hits.length, count, phase + ': exactly one pageview per navigation');
    assert.ok(hits.every(hit => hit.id === 'G-K197CS7ZBG'));
  };
  await send('Page.navigate', { url: base + '/ja?analytics_qa=initial' });
  await waitFor('window.dataLayer?.some(args => args[0] === "config") && !!document.querySelector(".theme-menu")');
  await pause(1000);
  const commands = () => evaluate('window.dataLayer.filter(args => args[0] === "config" || args[0] === "event").map(args => Array.from(args))');
  assert.deepEqual(await commands(), [['config', 'G-K197CS7ZBG']]);
  await checkHits(1, 'initial');
  await evaluate('window.__gaQaDocument = 1; document.querySelector(\'a[href="/ja/about"]\').click()');
  await waitFor('location.pathname === "/ja/about"'); await pause(1000);
  assert.equal(await evaluate('window.__gaQaDocument'), 1, 'navigation stays in same document');
  assert.deepEqual(await commands(), [['config', 'G-K197CS7ZBG']]);
  await checkHits(2, 'internal link');
  if (real) {
    await evaluate('history.back()'); await waitFor('location.pathname === "/ja"'); await checkHits(3, 'back');
    await evaluate('history.forward()'); await waitFor('location.pathname === "/ja/about"'); await checkHits(4, 'forward');
    if (live) { assert.ok(collectResponses.length > 0, 'at least one successful collection response'); assert.ok(collectResponses.every(status => status >= 200 && status < 300)); }
    console.log('PASS: real gtag, four single pageviews: initial/link/back/forward. Collection ' + (live ? 'sent to GA4.' : 'intercepted; no hits sent to GA4.'));
  } else {
  await evaluate('history.pushState(null, "", "?analytics_qa=query")'); await pause(250);
  await evaluate('history.replaceState(null, "", "?analytics_qa=replaced")'); await pause(250);
  await evaluate('history.back()'); await waitFor('location.search === ""');
  await evaluate('history.back()'); await waitFor('location.pathname === "/ja"');
  await evaluate('history.forward()'); await waitFor('location.pathname === "/ja/about"');
  await pause(500);
  assert.deepEqual(await commands(), [['config', 'G-K197CS7ZBG']]);
  assert.equal(googleLoads, 1, 'one gtag loader across initial/link/query/back/forward navigation');
  console.log('PASS: isolated Chromium static export; one correct-ID loader/config; no manual pageview commands on link, query push/replace, back or forward. Google requests intercepted; real GA receipt not tested.');
  }
} finally { socket?.close(); chrome.kill(); server.closeAllConnections(); server.close(); }
