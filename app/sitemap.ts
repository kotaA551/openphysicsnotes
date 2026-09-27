import type { MetadataRoute } from 'next';
import { locales, localePath } from '@/lib/i18n';
import { articleList, hasTranslation } from '@/lib/articles';
import { siteUrl } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
 const entries: MetadataRoute.Sitemap = locales.flatMap(locale => ['/', '/about', '/privacy'].map(path => ({ url: siteUrl + localePath(locale, path), alternates: { languages: Object.fromEntries(locales.map(language => [language, siteUrl + localePath(language, path)])) } })));
 for (const kind of ['chapters', 'curiosities'] as const) for (const article of articleList(kind)) for (const locale of locales) if (hasTranslation(kind, article.slug, locale)) entries.push({ url: siteUrl + localePath(locale, `/${kind}/${article.slug}`) });
 return entries;
}
