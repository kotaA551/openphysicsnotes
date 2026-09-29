// Run after rehype-slug: keep all existing heading IDs and HTML untouched.
export function discussionSections(tree) {
  const sections = [];
  let heading;
  let hasBody = false;
  tree.children.forEach((node, index) => {
    if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
      if (heading && hasBody) sections.push({ ...heading, end: index });
      heading = { id: String(node.properties?.id || ''), start: index };
      hasBody = false;
    } else if (heading && node.type !== 'comment' && !(node.type === 'text' && !node.value.trim()) && node.tagName !== 'hr') {
      hasBody = true;
    }
  });
  if (heading && hasBody) sections.push({ ...heading, end: tree.children.length });
  return sections.filter(section => section.id);
}

export default function rehypeDiscussions() {
  return tree => {
    const sections = discussionSections(tree);
    for (const section of sections.reverse()) {
      tree.children.splice(section.end, 0, {
        type: 'mdxJsxFlowElement', name: 'SectionDiscussion',
        attributes: [{ type: 'mdxJsxAttribute', name: 'sectionId', value: section.id }],
        children: [],
      });
    }
  };
}
