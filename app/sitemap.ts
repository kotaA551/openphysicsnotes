import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
import { locales, localePath } from '@/lib/i18n';
import { articleList, translatedArticleLocales } from '@/lib/articles';
import { absoluteUrl, languageAlternates } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
 const entries: MetadataRoute.Sitemap = locales.flatMap(locale => ['/', '/about', '/privacy'].map(path => ({ url: absoluteUrl(localePath(locale, path)), alternates: { languages: languageAlternates(path) } })));
 for (const kind of ['chapters', 'curiosities'] as const) for (const article of articleList(kind)) {
  const availableLocales = translatedArticleLocales(kind, article.slug);
  const path = `/${kind}/${article.slug}`;
  for (const locale of availableLocales) entries.push({ url: absoluteUrl(localePath(locale, path)), alternates: { languages: languageAlternates(path, availableLocales) } });
 }
 return entries;
}
