import { articleList, loadArticle } from '@/lib/articles';
import { isLocale, locales, localePath } from '@/lib/i18n';
import { articleSections } from '@/lib/search/build.mjs';
import { MAX_INDEX_BYTES, type SearchIndex } from '@/lib/search/engine';

export const dynamic = 'force-static';
export const dynamicParams = false;
export function generateStaticParams() { return locales.map(locale => ({ locale })); }

// Public, build-time JSON, fetched only after input. No query ever leaves the browser.
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  const index: SearchIndex = { version: 1, articles: [], sections: [] };
  for (const kind of ['chapters', 'curiosities'] as const) {
    for (const { slug } of articleList(kind)) {
      const article = loadArticle(kind, slug, locale);
      if (!article) continue;
      const number = index.articles.length;
      index.articles.push({ title: article.title, contentTitle: article.contentTitle, contentLocale: article.contentLocale, href: localePath(locale, `/${kind}/${slug}`) });
      const sections = await articleSections(article.content);
      // A title-only match should still lead to the first real heading.
      if (!sections.length) sections.push({ id: '', heading: '', text: '' });
      index.sections.push(...sections.map(section => ({ ...section, article: number })));
    }
  }
  const json = JSON.stringify(index);
  if (Buffer.byteLength(json) > MAX_INDEX_BYTES) throw new Error(`Search index for ${locale} exceeds its 4 MiB budget; split the index before adding more content.`);
  return new Response(json, { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate', 'X-Robots-Tag': 'noindex' } });
}
