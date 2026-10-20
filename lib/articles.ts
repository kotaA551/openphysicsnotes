import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { chapters } from './chapters';
import { curiosities } from './curiosities';
import { locales, topicTitle, type Locale } from './i18n';
import { englishArticleDescriptions } from './article-descriptions';
export type ArticleKind = 'chapters' | 'curiosities';
export function articleList(kind: ArticleKind) { return kind === 'chapters' ? chapters : curiosities; }
export function hasTranslation(kind: ArticleKind, slug: string, locale: Locale) {
 return locale === 'en' || fs.existsSync(path.join(process.cwd(), 'content', 'translations', locale, kind, `${slug}.mdx`));
}
export function translatedArticleLocales(kind: ArticleKind, slug: string) {
 return articleList(kind).some(article => article.slug === slug) ? locales.filter(locale => hasTranslation(kind, slug, locale)) : [];
}
export function loadArticle(kind: ArticleKind, slug: string, locale: Locale) {
 const index = articleList(kind).findIndex(item => item.slug === slug);
 if (index === -1) return null;
 const translated = hasTranslation(kind, slug, locale);
 const file = locale !== 'en' && translated ? path.join('content', 'translations', locale, kind, `${slug}.mdx`) : path.join('content', kind, `${slug}.mdx`);
 const { content, data } = matter(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
 const title = topicTitle(locale, kind, index);
 const contentLocale = translated ? locale : 'en';
 const contentTitle = topicTitle(contentLocale, kind, index);
 const summary = content.split(/\n\s*\n/).map(block => block.trim()).find(block => /^[A-Za-z\u00c0-\uffff]/.test(block) && !block.startsWith('import ') && !block.includes('= {')) || '';
 // Do not cut reviewed descriptions mid-word; search engines choose snippet length.
 const description = String(data.description || data.summary || (contentLocale === 'en' && englishArticleDescriptions[slug]) || summary.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`<>#]/g, '')).replace(/\s+/g, ' ').trim();
 return { title, contentTitle, content, description, translated, contentLocale };
}
