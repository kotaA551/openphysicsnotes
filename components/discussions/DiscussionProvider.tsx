'use client';
import { createContext, useContext, useEffect, useCallback, useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import { discussionMessages } from '@/lib/discussions/messages';
export type DiscussionScope = { articleKind: string; articleSlug: string; contentLocale: string };
type Context = { scope: DiscussionScope; locale: Locale; t: ReturnType<typeof discussionMessages>; counts: Record<string, number>; anchor: string; refresh: () => Promise<void> };
const DiscussionContext = createContext<Context | null>(null);
export function useDiscussion() { const value = useContext(DiscussionContext); if (!value) throw new Error('Missing discussion provider'); return value; }
export function DiscussionProvider({ articleKind, articleSlug, contentLocale, locale, children }: DiscussionScope & { locale: Locale; children: ReactNode }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [anchor, setAnchor] = useState('');
  useEffect(() => {
    const read = () => { try { setAnchor(decodeURIComponent(location.hash.slice(1))); } catch { setAnchor(''); } };
    read(); window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/discussions?' + new URLSearchParams({ articleKind, articleSlug, contentLocale, mode: 'counts' }), { cache: 'no-store' });
      if (response.ok) setCounts((await response.json()).counts);
    } catch { /* The article remains readable when discussions are offline. */ }
  }, [articleKind, articleSlug, contentLocale]);
  useEffect(() => { const timer = setTimeout(() => { void refresh(); }, 300); return () => clearTimeout(timer); }, [refresh]);
  return <DiscussionContext.Provider value={{ scope: { articleKind, articleSlug, contentLocale }, locale, t: discussionMessages(locale), counts, anchor, refresh }}>{children}</DiscussionContext.Provider>;
}
