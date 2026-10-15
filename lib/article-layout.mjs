import { discussionGroups } from './discussions/sections.mjs';

function headingText(node) {
  if (node.properties?.className?.includes('katex')) return '';
  return node.type === 'text' ? node.value : (node.children || []).map(headingText).join('');
}

// Presentation only: annotate the MDX root, never rewrite heading tags, text,
// IDs or children. Reuse the reader's existing section boundaries so proof
// steps written as h2 do not compete visually with the numbered X.Y sections.
export default function rehypeArticleLayout() {
  return tree => {
    const sections = new Set(discussionGroups(tree).map(section => section.id));
    for (const node of tree.children) {
      if (node.type !== 'element') continue;
      if (/^h[1-6]$/.test(node.tagName)) {
        const depth = Number(node.tagName[1]);
        const numberedSubsection = /^\d+\.\d+\.\d+(?:[.\u3001]?\s|[\uFF1A:])/.test(headingText(node).trim());
        const role = depth === 1 ? 'division'
          : sections.has(String(node.properties?.id)) ? 'section'
          : depth === 3 || (depth === 2 && numberedSubsection) ? 'subsection' : 'detail';
        node.properties = { ...node.properties, 'data-article-heading': role };
      }
    }
    // These root rules previously rendered as hr[data-article-separator].
    // Omit them entirely; rules inside quotes and other nested content stay.
    tree.children = tree.children.filter(node => !(node.type === 'element' && node.tagName === 'hr'));
  };
}
