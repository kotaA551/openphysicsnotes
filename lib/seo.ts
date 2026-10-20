import type { Metadata } from 'next';
import { localePath, locales, type Locale } from './i18n';
import { loadArticle, translatedArticleLocales, type ArticleKind } from './articles';

export const siteUrl = 'https://www.openphysicsnotes.com';
export const socialImage = '/images/eyecatch.png';

// Open Graph uses language_TERRITORY, independently of our language-only URLs.
export const openGraphLocales: Record<Locale, string> = {
  en: 'en_US', fr: 'fr_FR', de: 'de_DE', it: 'it_IT', es: 'es_ES',
  'pt-BR': 'pt_BR', 'zh-CN': 'zh_CN', 'zh-TW': 'zh_TW', ja: 'ja_JP', ko: 'ko_KR',
};

export function absoluteUrl(path: string) {
  const url = new URL(path, siteUrl);
  // Match Next's metadata serialization of the site root in sitemap and HTML.
  return url.pathname === '/' && !url.search && !url.hash ? url.origin : url.href;
}

// Share the same reciprocal cluster between HTML metadata and the sitemap.
export function languageAlternates(path: string, availableLocales: readonly Locale[] = locales) {
  return Object.fromEntries([
    ...availableLocales.map(locale => [locale, absoluteUrl(localePath(locale, path))]),
    ['x-default', absoluteUrl(path)],
  ]);
}

type PageMetadataOptions = { availableLocales?: readonly Locale[]; type?: 'website' | 'article' };

export function pageMetadata(title: string, description: string, path: string, locale: Locale, options: PageMetadataOptions = {}): Metadata {
  const availableLocales = options.availableLocales ?? locales;
  const translated = availableLocales.includes(locale);
  const contentLocale = translated ? locale : 'en';
  const canonical = absoluteUrl(localePath(contentLocale, path));
  return {
    title: title === 'Open Physics Notes' ? { absolute: title } : title,
    description,
    alternates: { canonical, ...(translated ? { languages: languageAlternates(path, availableLocales) } : {}) },
    // Keep fallback pages crawlable so crawlers can read this directive and canonical.
    ...(translated ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title, description, url: canonical, siteName: 'Open Physics Notes',
      type: options.type ?? 'website', locale: openGraphLocales[contentLocale],
      alternateLocale: availableLocales.filter(language => language !== contentLocale).map(language => openGraphLocales[language]),
      images: [{ url: absoluteUrl(socialImage), alt: 'Open Physics Notes' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [{ url: absoluteUrl(socialImage), alt: 'Open Physics Notes' }] },
  };
}

export function articleMetadata(kind: ArticleKind, slug: string, locale: Locale): Metadata | null {
  const article = loadArticle(kind, slug, locale);
  if (!article) return null;
  return pageMetadata(article.contentTitle, article.description, `/${kind}/${slug}`, locale, {
    availableLocales: translatedArticleLocales(kind, slug), type: 'article',
  });
}

export function articleStructuredData(kind: ArticleKind, slug: string, article: NonNullable<ReturnType<typeof loadArticle>>) {
  // An untranslated duplicate does not represent a separate learning resource.
  if (!article.translated) return null;
  const url = absoluteUrl(localePath(article.contentLocale, `/${kind}/${slug}`));
  return {
    '@context': 'https://schema.org', '@type': 'LearningResource', '@id': `${url}#learning-resource`,
    name: article.contentTitle, description: article.description, inLanguage: article.contentLocale, url,
    isAccessibleForFree: true, learningResourceType: 'Lecture notes',
    isPartOf: { '@type': 'WebSite', name: 'Open Physics Notes', url: absoluteUrl('/') },
    publisher: { '@type': 'Organization', name: 'Open Physics Notes' },
  };
}
