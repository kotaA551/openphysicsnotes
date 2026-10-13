import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

test('grouped panel: lazy bounded requests, old threads/replies, paging, new target, errors and locale', async () => {
  const dom = new JSDOM('<div id="app"></div>', { url: 'http://localhost/' });
  const previous = new Map();
  for (const [key,value] of Object.entries({ window:dom.window,document:dom.window.document,location:dom.window.location,HTMLElement:dom.window.HTMLElement,Node:dom.window.Node,IS_REACT_ACT_ENVIRONMENT:true })) {
    previous.set(key,Object.getOwnPropertyDescriptor(globalThis,key)); Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
  }
  dom.window.HTMLElement.prototype.scrollIntoView = function() {};
  const React=await import('react'), {createRoot}=await import('react-dom/client');
  const nativeRequire=createRequire(import.meta.url), cache=new Map();
  function load(relative) {
    let filename=path.resolve(relative);
    if(!path.extname(filename)) filename += fs.existsSync(filename+'.tsx')?'.tsx':'.ts';
    if(cache.has(filename)) return cache.get(filename).exports;
    const module={exports:{}}; cache.set(filename,module);
    const source=ts.transpileModule(fs.readFileSync(filename,'utf8'),{fileName:filename,compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    new Function('require','module','exports',source)(specifier=>{
      if(specifier==='next/dynamic')return ()=>load('components/discussions/DiscussionPanel.tsx').default;
      if(specifier==='next/link')return props=>React.createElement('a',props);
      if(specifier.startsWith('@/'))return specifier.endsWith('.mjs')?nativeRequire(path.resolve(specifier.slice(2))):load(specifier.slice(2));
      if(specifier.startsWith('.')&&!specifier.endsWith('.mjs'))return load(path.resolve(path.dirname(filename),specifier));
      return specifier.startsWith('@/')?nativeRequire(path.resolve(specifier.slice(2))):nativeRequire(specifier);
    },module,module.exports);return module.exports;
  }
  // validation is native ESM with no top-level async code; use Node's synchronous ESM support.
  const {DiscussionProvider}=load('components/discussions/DiscussionProvider.tsx');
  const Section=load('components/discussions/SectionDiscussion.tsx').default;
  const choices=[{id:'23-parent',label:'2.3 Parent'},{id:'legacy-a',label:'Old explanation'},{id:'legacy-empty',label:'Old example'}];
  const app=createRoot(document.getElementById('app')), act=React.act;
  const calls=[], savedFetch=globalThis.fetch;
  let fail=false, hold=false, held, postedRoot=false;
  const comment=(id,parentId=null)=>({id:String(id),parentId,displayName:'Reader',content:`Comment ${id}`,createdAt:new Date().toISOString()});
  const roots=Array.from({length:21},(_,i)=>({...comment(i+1),replyCount:i?0:6,replies:i?[]:Array.from({length:5},(_,n)=>comment(100+n,'1'))}));
  globalThis.fetch=async(url,options={})=>{
    const input=options.method==='POST'?JSON.parse(options.body):Object.fromEntries(new URL(url,'http://localhost').searchParams);
    calls.push({input,options});
    if(input.mode==='counts')return {ok:true,json:async()=>({counts:{'legacy-a':27,...(postedRoot?{'23-parent':1}:{})}})};
    if(options.method==='POST') {
      if(!input.parentId)postedRoot=true;
      return {ok:true,json:async()=>({comment:comment(input.parentId?106:500,input.parentId)})};
    }
    const response=()=>({ok:!fail,json:async()=>fail?{error:'unavailable'}:input.parentId?{items:[comment(105,'1')],hasMore:false}:input.sectionId==='legacy-a'?{items:input.after?[roots[19],roots[20]]:roots.slice(0,20),hasMore:!input.after}:{items:postedRoot&&input.sectionId==='23-parent'?[{...comment(500),replies:[],replyCount:0}]:[],hasMore:false}});
    if(hold)return new Promise(resolve=>{held=()=>resolve(response());});
    return response();
  };
  const render=locale=>act(async()=>app.render(React.createElement(React.StrictMode,null,React.createElement(DiscussionProvider,{key:locale,articleKind:'chapters',articleSlug:'2-Oscillations-and-waves',contentLocale:locale,locale},React.createElement(Section,{sectionId:choices[0].id,choicesJSON:JSON.stringify(choices)})))));
  const wait=()=>act(async()=>{await new Promise(r=>setTimeout(r,340));});
  const click=element=>act(async()=>element.click());
  const select=value=>act(async()=>{const field=document.querySelector('select');field.value=value;field.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
  const submit=async(form,text)=>{
    await act(async()=>{const field=form.querySelector('textarea');Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype,'value').set.call(field,text);field.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
    await act(async()=>form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true})));
  };
  const listCalls=()=>calls.filter(c=>c.input.mode!=='counts'&&c.options.method!=='POST');
  try {
    await render('en'); await wait();
    assert.equal(calls.length,1,'one article-wide count request, even in StrictMode');
    assert.equal(listCalls().length,0,'closed groups never load old panels');
    assert.match(document.querySelector('summary').textContent,/\(27\)/);
    await act(async()=>{const d=document.querySelector('details');d.open=true;d.dispatchEvent(new dom.window.Event('toggle'));});
    assert.equal(listCalls().length,1,'opening group fetches one selected legacy scope');
    assert.equal(listCalls()[0].input.sectionId,'legacy-a');
    assert.equal(document.querySelectorAll('.discussion-comments>li').length,20);
    assert.equal(document.querySelectorAll('.discussion-replies>li').length,5);
    await click([...document.querySelectorAll('button')].find(b=>b.textContent.includes('Load more')&&b.textContent.includes('Replies')));
    assert.equal(listCalls().at(-1).input.parentId,'1'); assert.equal(listCalls().at(-1).input.after,'104');
    assert.equal(document.querySelectorAll('.discussion-replies>li').length,6);
    await click([...document.querySelectorAll('.discussion-panel>button')].find(b=>b.textContent==='Load more'));
    assert.equal(listCalls().at(-1).input.after,'20');
    assert.equal(document.querySelectorAll('.discussion-comments>li').length,21,'duplicate root is not repeated');
    await click(document.querySelector('.discussion-reply-button'));
    await submit(document.querySelector('.discussion-comments .discussion-form'),'A reply');
    const reply=calls.find(c=>c.options.method==='POST');
    assert.equal(reply.input.sectionId,'legacy-a');assert.equal(reply.input.parentId,'1');
    await submit(document.querySelector('.discussion-panel>.discussion-form'),'A new question');
    const root=calls.filter(c=>c.options.method==='POST').at(-1);
    assert.equal(root.input.sectionId,'23-parent');assert.equal(root.input.parentId,null);
    assert.equal(document.querySelector('select').value,'23-parent');
    assert.ok([...document.querySelectorAll('[role="status"]')].some(n=>n.textContent==='Posted.'),'confirmation survives changing the selected legacy location');
    assert.equal(document.querySelectorAll('.discussion-comments>li').length,1);
    await select('legacy-empty'); assert.match(document.querySelector('.discussion-panel').textContent,/No questions yet/);
    fail=true; await select('legacy-a'); assert.ok(document.querySelector('[role="alert"]'));
    fail=false; await click(document.querySelector('[role="alert"] button'));assert.equal(document.querySelectorAll('.discussion-comments>li').length,20);
    hold=true; await select('legacy-empty'); assert.equal(document.querySelector('.discussion-panel').getAttribute('aria-busy'),'true');
    hold=false; await act(async()=>held());assert.equal(document.querySelector('.discussion-panel').getAttribute('aria-busy'),'false');
    for(const locale of ['ja','fr','de','it','es','pt-BR','zh-CN','zh-TW','ko']) {await render(locale);await wait();assert.equal(calls.at(-1).input.contentLocale,locale);assert.equal(document.querySelector('details').lang,locale);assert.equal(document.querySelector('.discussion-panel'),null);}
    await act(async()=>{location.hash='#discussion-legacy-a';window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));});
    assert.equal(document.querySelector('details').open,true);assert.equal(document.querySelector('select').value,'legacy-a');
    assert.equal(listCalls().at(-1).input.contentLocale,'ko');
    // An arriving deep link must win even before the article counts response.
    await act(async()=>{location.hash='#discussion-legacy-empty';});
    await render('en'); await wait();
    assert.equal(document.querySelector('details').open,true);
    assert.equal(document.querySelector('select').value,'legacy-empty');
  } finally {await act(async()=>app.unmount());globalThis.fetch=savedFetch;dom.window.close();for(const[key,d]of previous){if(d)Object.defineProperty(globalThis,key,d);else delete globalThis[key];}}
});
