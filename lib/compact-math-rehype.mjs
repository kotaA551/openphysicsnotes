// Run after the original KaTeX/slug/anchor/discussion plugins. This preserves
// existing heading IDs and discussion grouping before changing serialization.
export default function rehypeCompactMath() {
  return tree => {
    const annotation = node => node.type === 'element' && node.tagName === 'annotation'
      ? (node.children||[]).map(x=>x.value||'').join('')
      : (node.children||[]).map(annotation).find(x=>x !== undefined);
    function visit(node) {
      const classes=node.properties?.className||[];
      if(node.type==='element' && (classes.includes('katex-display')||classes.includes('katex'))) {
        const latex=annotation(node);
        if(latex===undefined)throw new Error('Missing KaTeX TeX annotation');
        const display=classes.includes('katex-display');
        node.type='mdxJsxTextElement';
        node.name='MathLeaf';
        node.attributes=[
          {type:'mdxJsxAttribute',name:'latex',value:latex},
          {type:'mdxJsxAttribute',name:'display',value:display?'true':'false'}
        ];
        node.children=[];
        delete node.tagName;
        delete node.properties;
        delete node.data;
        return;
      }
      for(const child of node.children||[])visit(child);
    }
    visit(tree);
  };
}
