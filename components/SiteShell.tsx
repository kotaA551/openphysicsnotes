'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { chapters } from '@/lib/chapters';
import { curiosities } from '@/lib/curiosities';
import { sidebarLabels, deviceLocale, isLocale, languageNames, localePath, locales, messages, pathLocale, stripLocale, topicTitle } from '@/lib/i18n';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathLocale(pathname);
  const t = messages(locale);
  const [preference, setPreference] = useState('device');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const languageMenu = useRef<HTMLDetailsElement>(null);
  const languageButton = useRef<HTMLElement>(null);
  useEffect(() => {
    document.documentElement.lang = locale;
    let saved: string | null = null;
    try { saved = localStorage.getItem('opn-language'); } catch {}
    setPreference(saved && isLocale(saved) ? saved : 'device');
  }, [locale]);
  useEffect(() => {
    // Explicit locale URLs remain shareable; only the English entry point follows preferences.
    if (pathname !== '/') return;
    let saved: string | null = null;
    try { saved = localStorage.getItem('opn-language'); } catch {}
    const target = saved && isLocale(saved) ? saved : deviceLocale(navigator.languages);
    if (target !== 'en') router.replace(localePath(target));
  }, [pathname, router]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => { if (!languageMenu.current?.contains(event.target as Node)) languageMenu.current?.removeAttribute('open'); };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);
  const navigation = (desktop = false) => <>{(['chapters', 'curiosities'] as const).map(kind => <section className="nav-section" key={kind}>
    <h2 hidden={desktop && kind === 'chapters'}>{t[kind]}</h2><nav aria-label={t[kind]}>{(kind === 'chapters' ? chapters : curiosities).map((item, index) => {
      const href = localePath(locale, `/${kind}/${item.slug}`);
      return <Link key={item.slug} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={() => dialog.current?.close()}><span className="nav-number">{String(index + 1).padStart(2, '0')}</span><span>{topicTitle(locale, kind, index)}</span></Link>;
    })}</nav></section>)}</>;
  function choose(value: string) {
    setPreference(value);
    try { if (value === 'device') localStorage.removeItem('opn-language'); else localStorage.setItem('opn-language', value); } catch {}
    const next = isLocale(value) ? value : deviceLocale(navigator.languages);
    languageMenu.current?.removeAttribute('open');
    languageButton.current?.focus();
    router.push(localePath(next, stripLocale(pathname)) + window.location.hash);
  }
  return <div className="site-shell">
    <a className="skip-link" href="#main-content">{t.skip}</a>
    <header className="site-header">
      <button className="icon-button mobile-toggle" onClick={() => dialog.current?.showModal()} aria-label={t.menu} aria-controls="mobile-navigation">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
      <Link className="brand" href={localePath(locale)} aria-label={`Open Physics Notes · ${t.home}`}>
        <Image src="/opn-logo-mark-512.png" alt="" width={30} height={30}/>
        <span translate="no">Open Physics Notes</span>
      </Link>
      <details ref={languageMenu} className="language-menu" onKeyDown={event => { if (event.key === 'Escape') { languageMenu.current?.removeAttribute('open'); languageButton.current?.focus(); } }}>
        <summary ref={languageButton} className="icon-button" aria-label={t.language} title={t.language}>
          <span aria-hidden="true">A<span className="language-divider">/</span>文</span>
        </summary>
        <div className="language-options">
          <p>{t.language}</p>
          {[{code: 'device', label: 'Same as device'}, ...locales.map(code => ({code, label: languageNames[code]}))].map(option => 
          <button key={option.code} lang={option.code === 'device' ? 'en' : option.code} type="button" aria-pressed={preference === option.code} onClick={() => choose(option.code)}>
            <span>{option.label}</span>
            <span aria-hidden="true">{preference === option.code ? '✓' : ''}</span>
          </button>)}
        </div>
      </details>
    </header>
    <div className="site-body">
      <aside className={`desktop-sidebar ${sidebarOpen ? '' : 'is-collapsed'}`}>
        <div className="sidebar-heading">
          <h2 hidden={!sidebarOpen}>{t.chapters}</h2>
          <button type="button" className="sidebar-toggle" aria-expanded={sidebarOpen} aria-controls="desktop-navigation" aria-label={sidebarOpen ? sidebarLabels[locale].collapse : sidebarLabels[locale].expand} title={sidebarOpen ? sidebarLabels[locale].collapse : sidebarLabels[locale].expand} onClick={() => setSidebarOpen(value => !value)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={sidebarOpen ? '' : 'points-right'}><path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div id="desktop-navigation" hidden={!sidebarOpen}>{navigation(true)}</div>
      </aside>
      <main id="main-content" tabIndex={-1} className="main-content">{children}</main>
    </div>
    <footer className="site-footer">
      <span translate="no">
        Open Physics Notes
      </span>
      <nav className="flex gap-4 md:gap-6 items-center" aria-label={t.menu}>
        <Link href="https://comiiic.com/?utm_source=open_physics_notes&utm_medium=referral&utm_campaign=footer&utm_content=comiiic_logo" 
              title="Comiiic" target="_blank" rel="noopener noreferrer">
          <Image src="/comiiic-180x180.png" alt="Comiiic" width={30} height={30} />
        </Link>
        <Link href={localePath(locale, '/about')}>{t.about}</Link>
      </nav>
    </footer>
    <dialog id="mobile-navigation" ref={dialog} className="mobile-drawer" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onClose={() => { document.body.style.overflow = ''; }} onToggle={event => { document.body.style.overflow = (event.currentTarget as HTMLDialogElement).open ? 'hidden' : ''; }}>
      <div className="drawer-heading">
        <span>{t.menu}</span>
        <button className="icon-button" onClick={() => dialog.current?.close()} aria-label={t.close}>×</button>
      </div>
      {navigation()}
    </dialog>
  </div>;
}
