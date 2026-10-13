import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';

// Match ArticlePage's pipeline through rehype-slug, including math in headings.
// IDs come from the rendered tree, never from a second slug implementation.
const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath)
  .use(remarkRehype, { passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxFlowExpression', 'mdxTextExpression', 'mdxjsEsm'] })
  .use(rehypeKatex).use(rehypeSlug);

function ignored(node) {
  return ['mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression', 'comment'].includes(node.type)
    || ['script', 'style', 'pre', 'code'].includes(node.tagName)
    || node.properties?.className?.includes('katex');
}

function plain(node) {
  if (ignored(node)) return '';
  if (node.type === 'text') return node.value;
  return (node.children || []).map(plain).join('');
}

/** @param {string} source */
export async function articleSections(source) {
  const tree = await processor.run(processor.parse(source));
  const sections = [];
  let current = { id: '', heading: '', text: '' };
  function visit(node) {
    if (ignored(node)) return;
    if (node.type === 'element' && /^h[1-6]$/.test(node.tagName) && node.properties?.id) {
      sections.push(current);
      current = { id: String(node.properties.id), heading: plain(node), text: '' };
      return;
    }
    if (node.type === 'text') current.text += node.value;
    else {
      for (const child of node.children || []) visit(child);
      if (['p', 'li', 'td', 'th', 'div', 'blockquote', 'br'].includes(node.tagName)) current.text += ' ';
    }
  }
  visit(tree);
  sections.push(current);
  return sections.map(section => ({ ...section,
    heading: section.heading.replace(/\s+/g, ' ').trim(),
    text: section.text.replace(/\s+/g, ' ').trim(),
  })).filter(section => section.id || section.text);
}
