'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import { MAX_INDEX_BYTES, MAX_QUERY_LENGTH, prepareIndex, queryTerms, search, type SearchIndex, type SearchResult } from '@/lib/search/engine';
import { searchMessages } from '@/lib/search/messages';
import './header-search.css';

function SearchIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.7"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
}

// SiteShell keys this component by locale, disposing old requests and cached text.
export default function HeaderSearch({ locale }: { locale: Locale }) {
  const t = searchMessages[locale];
  const pathname = usePathname();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const prepared = useRef<ReturnType<typeof prepareIndex> | null>(null);
  const composingRef = useRef(false);
  const compositionEnded = useRef(0);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [composing, setComposing] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [active, setActive] = useState(-1);
  const [response, setResponse] = useState<{ query: string; results: SearchResult[]; error?: boolean } | null>(null);
  const meaningful = queryTerms(query).length > 0;
  const ready = response?.query === query && !composing;
  const results = ready ? response.results : [];
  const loading = meaningful && (!ready || composing);

  useEffect(() => { setOpen(false); setQuery(''); setResponse(null); setActive(-1); }, [pathname]);
  useEffect(() => {
    // Wait for the compact field to become visible. Touch browsers do not always
    // focus the trigger button when it is tapped.
    if (open) input.current?.focus();
  }, [open]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  useEffect(() => {
    if (!open || !meaningful || composing || response?.query === query) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        if (!prepared.current) {
          const fetched = await fetch(`/search/${locale}`, { signal: controller.signal, credentials: 'omit' });
          if (!fetched.ok) throw new Error('Search unavailable');
          const raw = await fetched.text();
          if (new TextEncoder().encode(raw).length > MAX_INDEX_BYTES) throw new Error('Search index too large');
          const data: SearchIndex = JSON.parse(raw);
          if (data.version !== 1 || !Array.isArray(data.articles) || !Array.isArray(data.sections)) throw new Error('Invalid search index');
          if (controller.signal.aborted) return;
          prepared.current = prepareIndex(data);
        }
        if (!controller.signal.aborted) {
          setResponse({ query, results: search(prepared.current, query) });
          setActive(-1);
        }
      } catch {
        if (!controller.signal.aborted) setResponse({ query, results: [], error: true });
      }
    }, 160);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query, locale, open, composing, meaningful, attempt, response]);

  useEffect(() => {
    if (active >= 0) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [active, id]);

  function close() {
    setOpen(false); setActive(-1); composingRef.current = false; setComposing(false);
    if (trigger.current && window.getComputedStyle(trigger.current).display !== 'none') trigger.current.focus();
    else input.current?.focus();
  }
  function clear() { setQuery(''); setResponse(null); setActive(-1); composingRef.current = false; setComposing(false); input.current?.focus(); }
  function select() { setOpen(false); setQuery(''); setResponse(null); setActive(-1); }

  return <div ref={root} className={`header-search ${open ? 'is-open' : ''}`} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) { setOpen(false); setActive(-1); composingRef.current = false; setComposing(false); }
  }}>
    <button ref={trigger} type="button" className="icon-button search-trigger" tabIndex={open ? -1 : 0} aria-label={t.label} aria-expanded={open} aria-controls={`${id}-field`} onClick={() => { setOpen(true); input.current?.focus(); }}><SearchIcon/></button>
    <div id={`${id}-field`} className="search-field">
      <span className="search-icon"><SearchIcon/></span>
      <input ref={input} type="text" role="combobox" aria-label={t.label} placeholder={t.placeholder} value={query} maxLength={MAX_QUERY_LENGTH}
        aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-results`} aria-describedby={open ? `${id}-status` : undefined}
        aria-activedescendant={open && active >= 0 && results[active] ? `${id}-option-${active}` : undefined}
        autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false}
        onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setActive(-1); if (document.activeElement === input.current) setOpen(true); }}
        onCompositionStart={() => { composingRef.current = true; setComposing(true); setActive(-1); }}
        onCompositionEnd={event => { composingRef.current = false; compositionEnded.current = Date.now(); setComposing(false); setQuery(event.currentTarget.value); }}
        onKeyDown={event => {
          if (composingRef.current || event.nativeEvent.isComposing || event.keyCode === 229 || (event.key === 'Enter' && Date.now() - compositionEnded.current < 100)) return;
          if (event.key === 'Escape') { event.preventDefault(); close(); }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault(); setOpen(true);
            if (results.length) setActive(value => event.key === 'ArrowDown' ? (value + 1) % results.length : (value <= 0 ? results.length - 1 : value - 1));
          }
          if (event.key === 'Enter' && open && results.length) {
            event.preventDefault();
            document.getElementById(`${id}-option-${active < 0 ? 0 : active}`)?.click();
          }
        }}/>
      {query && <button type="button" className="search-clear" aria-label={t.clear} onMouseDown={event => event.preventDefault()} onClick={clear}>×</button>}
      <button type="button" className="search-close" aria-label={t.close} onClick={close}>×</button>
    </div>
    {open && <div className="search-panel">
      <p id={`${id}-status`} className="search-status" role="status" aria-live="polite">
        {!meaningful ? t.hint : loading ? t.loading : response?.error ? t.error : results.length ? `${t.results} · ${results.length}` : t.empty}
      </p>
      {ready && response?.error && <button type="button" className="search-retry" onClick={() => { setResponse(null); setAttempt(value => value + 1); input.current?.focus(); }}>{t.retry}</button>}
      <ul id={`${id}-results`} role="listbox" aria-label={t.results} aria-busy={loading}>
        {results.map((result, index) => <li key={result.href} role="presentation">
          <a id={`${id}-option-${index}`} role="option" aria-selected={active === index} tabIndex={-1} href={result.href}
            onMouseDown={event => event.preventDefault()} onPointerMove={event => { if (event.pointerType === 'mouse') setActive(index); }} onClick={select}>
            <span className="search-article">{result.title}</span>
            {result.contentLocale !== locale && <span className="search-fallback">{t.fallback}</span>}
            <strong lang={result.contentLocale}>{result.heading || result.contentTitle}</strong>
            {result.snippet && <span className="search-snippet" lang={result.contentLocale}>{result.snippet}</span>}
          </a>
        </li>)}
      </ul>
    </div>}
  </div>;
}
