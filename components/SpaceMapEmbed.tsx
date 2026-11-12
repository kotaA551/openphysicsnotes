'use client';
import { useEffect, useRef, useState } from 'react';
import './space-map-embed.css';
export default function SpaceMapEmbed({ locale }: { locale: string }) {
 const ja = locale === 'ja';
 const [loaded,setLoaded]=useState(false), [ready,setReady]=useState(false), [failed,setFailed]=useState(false), [attempt,setAttempt]=useState(0);
 const [expanded,setExpanded]=useState(false), [native,setNative]=useState(false);
 const box=useRef<HTMLDivElement>(null), frame=useRef<HTMLIFrameElement>(null), fullscreenButton=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  box.current?.setAttribute('data-ready','true');
  if(!box.current)return;
  if(!('IntersectionObserver' in window)){setLoaded(true);return;}
  const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setLoaded(true);observer.disconnect();}},{rootMargin:'400px 0px'});
  observer.observe(box.current);return()=>observer.disconnect();
 },[]);
 useEffect(()=>{const change=()=>setNative(document.fullscreenElement===box.current);document.addEventListener('fullscreenchange',change);return()=>document.removeEventListener('fullscreenchange',change);},[]);
 useEffect(()=>{
  const message=(e:MessageEvent)=>{
   if(e.origin!==location.origin||e.source!==frame.current?.contentWindow)return;
   if(e.data?.type==='space-map-ready'){setReady(true);setFailed(false);}
   if(e.data?.type==='space-map-error'){setFailed(true);}
   if(e.data?.type==='space-map-escape'){setExpanded(false);fullscreenButton.current?.focus();}
  };
  addEventListener('message',message);return()=>removeEventListener('message',message);
 },[]);
 useEffect(()=>{if(!loaded||ready)return;const timer=setTimeout(()=>setFailed(true),30000);return()=>clearTimeout(timer);},[loaded,ready,attempt]);
 useEffect(()=>{if(!expanded)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setExpanded(false);fullscreenButton.current?.focus();}};document.addEventListener('keydown',key);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',key);};},[expanded]);
 useEffect(()=>{
  if(!loaded||!box.current)return;
  let intersecting=false;
  const send=()=>frame.current?.contentWindow?.postMessage({type:'space-map-visibility',visible:!document.hidden&&(intersecting||expanded||native)},location.origin);
  const observer='IntersectionObserver' in window?new IntersectionObserver(([entry])=>{intersecting=entry.isIntersecting;send();}):null;
  if(observer)observer.observe(box.current);else intersecting=true;document.addEventListener('visibilitychange',send);send();
  return()=>{observer?.disconnect();document.removeEventListener('visibilitychange',send);};
 },[loaded,ready,expanded,native,attempt]);
 async function fullscreen(){if(native){await document.exitFullscreen();return;}if(expanded){setExpanded(false);return;}if(box.current?.requestFullscreen){try{await box.current.requestFullscreen();return;}catch{}}setExpanded(true);}
 function retry(){setReady(false);setFailed(false);setAttempt(n=>n+1);}
 return <section className="space-map-section" aria-labelledby="space-map-title"><h2 id="space-map-title">Space Map</h2><div ref={box} className={`space-map-window${expanded?' is-expanded':''}`}>
 <div className="space-map-toolbar"><span>Space Map</span>{loaded&&<button className="space-map-fullscreen" ref={fullscreenButton} onClick={fullscreen} aria-label={native||expanded?(ja?'全画面を終了':'Exit full screen'):(ja?'全画面表示':'Full screen')} title={native||expanded?(ja?'全画面を終了':'Exit full screen'):(ja?'全画面表示':'Full screen')}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={native||expanded?'M9 3v6H3m12-6v6h6M3 15h6v6m12-6h-6v6':'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5'}/></svg></button>}</div>
 <div className="space-map-stage">
 {loaded&&<iframe key={attempt} ref={frame} src="/space-map/index.html" title="Space Map — interactive solar system" allow="fullscreen" allowFullScreen onError={()=>setFailed(true)}/>}
 {(!ready||failed)&&<div className="space-map-loading" role={failed?'alert':'status'}>{failed?<><p>{ja?'読み込みが完了しませんでした。再試行してください。':'Space Map could not finish loading. Please try again.'}</p><button onClick={retry}>{ja?'再試行':'Retry'}</button></>:<span>{ja?'Space Mapを読み込み中…':'Loading Space Map…'}</span>}</div>}
 </div></div></section>;
}
