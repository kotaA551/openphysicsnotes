'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { themeLabels, type Locale } from '@/lib/i18n';
import { parseThemePreference, themeOptions, themeStorageKey, type ThemePreference } from '@/lib/theme';

export default function ThemeMenu({ locale }: { locale: Locale }) {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const menu = useRef<HTMLDetailsElement>(null);
  const button = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const label = themeLabels[locale];

  useEffect(() => {
    const apply = (value: string | null) => {
      const next = parseThemePreference(value);
      document.documentElement.dataset.theme = next;
      setPreference(next);
    };
    // Preserve the head script's value if browser storage is unavailable.
    try { apply(localStorage.getItem(themeStorageKey)); }
    catch { apply(document.documentElement.dataset.theme ?? null); }
    const sync = (event: StorageEvent) => {
      if (event.key === themeStorageKey) apply(event.newValue);
      else if (event.key === null) apply(null);
    };
    const dismiss = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) menu.current?.removeAttribute('open');
    };
    window.addEventListener('storage', sync);
    document.addEventListener('pointerdown', dismiss);
    return () => {
      window.removeEventListener('storage', sync);
      document.removeEventListener('pointerdown', dismiss);
    };
  }, []);

  useEffect(() => { menu.current?.removeAttribute('open'); }, [pathname]);

  function choose(value: ThemePreference) {
    setPreference(value);
    document.documentElement.dataset.theme = value;
    try {
      if (value === 'system') localStorage.removeItem(themeStorageKey);
      else localStorage.setItem(themeStorageKey, value);
    } catch { /* The choice still applies for this page when storage is blocked. */ }
    menu.current?.removeAttribute('open');
    button.current?.focus();
  }

  return <details ref={menu} name="header-preferences" className="language-menu theme-menu"
    onKeyDown={event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        menu.current?.removeAttribute('open');
        button.current?.focus();
      }
    }}
    onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) menu.current?.removeAttribute('open');
    }}>
    <summary ref={button} className="icon-button" aria-label={label} title={label}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/>
      </svg>
    </summary>
    <div className="language-options theme-options" role="group" aria-label={label}>
      <p>{label}</p>
      {themeOptions.map(value => <button key={value} type="button" lang="en" aria-pressed={preference === value} onClick={() => choose(value)}>
        <span>{value === 'system' ? 'system' : value === 'light' ? 'Light' : 'Dark'}</span>
        <span aria-hidden="true">{preference === value ? '✓' : ''}</span>
      </button>)}
    </div>
  </details>;
}
