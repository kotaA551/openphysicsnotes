// Run after heading IDs and layout annotations have been finalized.
export const chapterTocLabels = {
  en: 'Chapter contents', fr: 'Sommaire du chapitre', de: 'Kapitelinhalt',
  it: 'Indice del capitolo', es: 'Contenido del capítulo', 'pt-BR': 'Conteúdo do capítulo',
  'zh-CN': '本章目录', 'zh-TW': '本章目錄', ja: 'この章の目次', ko: '이 장의 목차',
};
export const articleTocLabels = { en: 'Contents', fr: 'Sommaire', de: 'Inhalt', it: 'Indice', es: 'Contenido', 'pt-BR': 'Conteúdo', 'zh-CN': '目录', 'zh-TW': '目錄', ja: '目次', ko: '목차' };
function headingText(node) {
  // KaTeX duplicates visible and accessibility representations; retain TeX once.
  if (node.type === 'element' && node.tagName === 'annotation') return (node.children || []).map(headingText).join('');
  if (node.properties?.className?.includes('katex')) {
    const find = n => n.tagName === 'annotation' ? headingText(n) : (n.children || []).map(find).join('');
    return find(node);
  }
  return node.type === 'text' ? node.value : (node.children || []).map(headingText).join('');
}
const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
export default function rehypeChapterToc({ locale = 'en', kind = 'chapters' } = {}) {
  return tree => {
    const headings = tree.children.filter(n => n.type === 'element' && n.tagName === 'h2');
    const major = kind === 'curiosities' ? headings : headings.filter(n => /^(?:\d+\.\d+[A-Z]?|\d+)[.、．：:\s]/i.test(headingText(n).trim().normalize('NFKC')) && !/^\d+\.\d+\.\d/.test(headingText(n).trim().normalize('NFKC')));
    if (!major.length) return;
    const labels = kind === 'chapters' ? chapterTocLabels : articleTocLabels;
    const label = labels[locale] || labels.en;
    const links = major.filter(n => n.properties?.id).map(n => el('li', {}, [el('a', { href: '#' + n.properties.id }, [{ type: 'text', value: headingText(n).trim() }])]));
    if (!links.length) return;
    const toc = el('nav', { className: ['chapter-toc'], ariaLabel: label }, [el('p', { className: ['article-toc-label'] }, [{ type: 'text', value: label }]), el('ul', {}, links)]);
    let index = tree.children.indexOf(headings[0]);
    const hasPreface = tree.children.slice(0, index).some(n => n.type === 'element' && n.tagName === 'p');
    // A chapter with no separate preface (notably chapter 6) keeps its first
    // heading and opening paragraph early, without copying or moving source.
    if (!hasPreface) {
      const nextHeading = tree.children.findIndex((n, i) => i > index && n.type === 'element' && /^h[1-6]$/.test(n.tagName));
      const intro = tree.children.findIndex((n, i) => i > index && (nextHeading < 0 || i < nextHeading) && n.type === 'element' && n.tagName === 'p');
      if (intro >= 0) index = intro + 1;
    }
    tree.children.splice(index, 0, toc);
  };
}
