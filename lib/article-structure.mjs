// Run after rehype-slug: keep all existing heading IDs and HTML untouched.
export function articleSectionsWithBody(tree) {
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

// Read only visible heading text; KaTeX's duplicated accessibility tree is not a label.
function headingText(node) {
  if (node.properties?.className?.includes('katex')) return '';
  return node.type === 'text' ? node.value : (node.children || []).map(headingText).join('');
}

export function articleGroups(tree) {
  const headings = tree.children.flatMap((node, start) => node.type === 'element' && /^h[1-6]$/.test(node.tagName)
    ? [{ id: String(node.properties?.id || ''), label: headingText(node).trim(), depth: Number(node.tagName[1]), start }] : []);
  const legacy = articleSectionsWithBody(tree);
  if (!legacy.length) return [];
  // The existing articles use h2 for the reader's major content sections:
  // X.Y in numbered chapters / Differential Geometry, and 1., 2., ... in
  // Chapter 1 and the shorter curiosities. X.Y.Z and all worked steps stay inside.
  const numbered = headings.filter(h => h.depth <= 3).map(h => ({ ...h,
    number: h.label.match(/^(\d+(?:\.\d+)*)(?:[.．、]?\s|[：:])/)?.[1],
  })).filter(h => h.number);
  const major = numbered.filter(h => h.depth === 2 && h.number.split('.').length <= 2);
  let boundaries;
  if (major.length) {
    boundaries = major.map((heading, index) => ({ ...heading,
      // Larger h1 divisions introduce the following h2 section (not the preceding one).
      start: index === 0 ? 0 : headings.find(h => h.depth === 1 && h.start > major[index - 1].start && h.start < heading.start)?.start ?? heading.start,
    }));
  } else {
    const depth = headings.some(h => h.depth === 2) ? 2 : Math.min(...headings.map(h => h.depth));
    boundaries = headings.filter(h => h.depth === depth);
    if (boundaries.length) boundaries[0] = { ...boundaries[0], start: 0 };
  }
  return boundaries.map((heading, index) => {
    const end = boundaries[index + 1]?.start ?? tree.children.length;
    const members = legacy.filter(s => s.start >= heading.start && s.start < end);
    const choices = [...new Set([heading.id, ...members.map(s => s.id)])].map(id => ({
      id, label: headings.find(h => h.id === id)?.label || id,
    }));
    return { id: heading.id, start: heading.start, end, choices, hasBody: members.length > 0 };
  }).filter(group => group.id && group.hasBody);
}

