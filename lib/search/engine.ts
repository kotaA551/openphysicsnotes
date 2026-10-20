export type SearchArticle = { title: string; contentTitle: string; href: string; contentLocale: string };
export type SearchSection = { article: number; id: string; heading: string; text: string };
export type SearchIndex = { version: 1; articles: SearchArticle[]; sections: SearchSection[] };
export type SearchResult = SearchArticle & { heading: string; snippet: string; score: number };
export const MAX_RESULTS = 8;
export const MAX_QUERY_LENGTH = 120;
export const MAX_INDEX_BYTES = 4 * 1024 * 1024;

export function normalize(value: string) {
  // NFKC handles full-width input; remove Latin accents without changing Japanese
  // dakuten or Korean syllables. CJK matching deliberately supports substrings.
  return value.normalize('NFKC').toLowerCase().normalize('NFD')
    .replace(/([a-z])\p{M}+/gu, '$1').normalize('NFC')
    .replace(/[\p{P}\p{S}\s]+/gu, ' ').trim();
}

export function queryTerms(query: string) {
  return [...new Set(normalize(query.slice(0, MAX_QUERY_LENGTH)).split(' ').filter(Boolean))].slice(0, 12);
}

function snippet(text: string, terms: string[]) {
  // Walk sentence-sized windows in original text so normalization never corrupts
  // offsets for combining marks, accented letters, or full-width characters.
  const chars = Array.from(text);
  let bestStart = 0, bestScore = -1;
  for (let start = 0; start < chars.length; start += 70) {
    const window = normalize(chars.slice(start, start + 170).join(''));
    const score = terms.filter(term => window.includes(term)).length;
    if (score > bestScore) { bestScore = score; bestStart = start; }
    if (score === terms.length) break;
  }
  return (bestStart ? '…' : '') + chars.slice(bestStart, bestStart + 170).join('') + (chars.length > bestStart + 170 ? '…' : '');
}

export function prepareIndex(index: SearchIndex) {
  return index.sections.map(section => {
    const article = index.articles[section.article];
    const titles = [normalize(article.title), normalize(article.contentTitle)];
    return { section, article, titles, title: titles.join(' '), heading: normalize(section.heading), body: normalize(section.text) };
  });
}

export function search(index: ReturnType<typeof prepareIndex>, query: string): SearchResult[] {
  const terms = queryTerms(query);
  if (!terms.length) return [];
  const phrase = normalize(query.slice(0, MAX_QUERY_LENGTH));
  const found = [];
  for (const row of index) {
    if (!terms.every(term => row.title.includes(term) || row.heading.includes(term) || row.body.includes(term))) continue;
    const score = terms.reduce((sum, term) => sum + (row.heading.includes(term) ? 30 : 0) + (row.title.includes(term) ? 12 : 0) + (row.body.includes(term) ? 4 : 0), 0)
      // An exact article-title query must remain discoverable even when many
      // sections in other articles mention the same topic.
      + (row.titles.includes(phrase) ? 1000 : 0)
      + (row.heading === phrase ? 90 : row.heading.includes(phrase) ? 40 : 0)
      + (row.body.includes(phrase) ? 8 : 0);
    found.push({ row, score });
  }
  found.sort((a, b) => b.score - a.score);
  return found.slice(0, MAX_RESULTS).map(({ row, score }) => ({
    ...row.article, href: row.article.href + `#${row.section.id ? encodeURIComponent(row.section.id) : 'main-content'}`,
    heading: row.section.heading, snippet: snippet(row.section.text, terms), score,
  }));
}
