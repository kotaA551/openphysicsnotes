import anchors from './article-anchor-ids.mjs';

// These editions originally served the English article. Keep its published
// fragments when their visible headings are translated. Existing editions keep
// their own anchors, including all permanent discussion section identifiers.
const migratedLocales = new Set(['fr', 'it', 'es', 'zh-TW', 'ko']);
export function articleHeadingIds(kind, slug, locale) {
  return migratedLocales.has(locale) ? anchors[`${kind}/${slug}`] || [] : [];
}

export default function rehypeArticleAnchors({ ids = [] } = {}) {
  return tree => {
    if (!ids.length) return;
    const headings = [];
    const visit = node => {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) headings.push(node);
      for (const child of node.children || []) visit(child);
    };
    visit(tree);
    if (headings.length !== ids.length) throw new Error(`Translated heading count ${headings.length} differs from the ${ids.length} published anchors`);
    headings.forEach((heading, index) => { heading.properties.id = ids[index]; });
  };
}
