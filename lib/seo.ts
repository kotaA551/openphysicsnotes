import type { Metadata } from 'next';
import { localePath, locales, type Locale } from './i18n';
export const siteUrl = 'https://www.openphysicsnotes.com';
export function pageMetadata(title: string, description: string, path: string, locale: Locale, translated = true): Metadata {
  const url = localePath(locale, path);
  const languageAlternates = Object.fromEntries(locales.map(language => [language, localePath(language, path)]));
  return {
    title: title === 'Open Physics Notes' ? { absolute: title } : title,
    description,
    alternates: { canonical: translated ? url : path, ...(translated ? { languages: { ...languageAlternates, 'x-default': path } } : {}) },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
    openGraph: { title, description, url, siteName: 'Open Physics Notes', type: 'website', locale: locale.replace('-', '_'), images: [{ url: '/images/eyecatch.png', alt: 'Open Physics Notes' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/eyecatch.png'] },
  };
}
