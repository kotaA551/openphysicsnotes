// Import a tested local Space Map source; generated public files are versioned.
import path from 'node:path';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),source=path.resolve(process.argv[2]||'../space-map');
const require=createRequire(path.join(source,'package.json'));
const {build}=await import(pathToFileURL(require.resolve('vite')).href);
const bridge=`let embedVisible=parent===window;addEventListener('keydown',e=>{if(e.key==='Escape'&&parent!==window)parent.postMessage({type:'space-map-escape'},location.origin);});addEventListener('message',e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='space-map-visibility')embedVisible=Boolean(e.data.visible);});`;
const errors=`<script>addEventListener('error',e=>{if(e instanceof ErrorEvent&&parent!==window)parent.postMessage({type:'space-map-error'},location.origin)});addEventListener('unhandledrejection',()=>{if(parent!==window)parent.postMessage({type:'space-map-error'},location.origin)});</script>`;
await build({root:source,configFile:false,base:'/space-map/',plugins:[{name:'opn-embed',transform(code,id){
 if(!id.endsWith('/solar-app.js'))return;
 let result=code.replace("loader.load('/textures/'","loader.load('/space-map/textures/'").replace('function animate(ts){',bridge+"function animate(ts){if(!embedVisible||document.hidden){last=ts;requestAnimationFrame(animate);return;}");
 if(!result.match(/requestAnimationFrame\(animate\);\s*$/))throw Error('Space Map initialization changed; review readiness bridge');
 return result.replace(/requestAnimationFrame\(animate\);\s*$/,"requestAnimationFrame(animate);if(parent!==window)parent.postMessage({type:'space-map-ready'},location.origin);");
 },transformIndexHtml(html){return html.replaceAll('href="/stars.html"','href="/space-map/stars.html"').replaceAll('href="/credits.html"','href="/space-map/credits.html"').replace('</head>',errors+'</head>');}}],build:{outDir:path.join(root,'public/space-map'),emptyOutDir:false,rollupOptions:{input:{main:path.join(source,'index.html'),stars:path.join(source,'stars.html')}}}});
await fs.copyFile(path.join(source,'SOURCES.md'),path.join(root,'public/space-map/SOURCES.md'));
console.log('Imported Space Map into public/space-map; no publication performed.');
