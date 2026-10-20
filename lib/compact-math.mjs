// Keep blockJS enabled: only literal TeX props cross the MDX boundary.
export default function remarkCompactMath() {
  return tree => {
    function visit(node) {
      if (node.type === 'math' || node.type === 'inlineMath') {
        const display = node.type === 'math';
        const latex = node.value;
        node.type = display ? 'mdxJsxFlowElement' : 'mdxJsxTextElement';
        node.name = 'MathLeaf';
        node.attributes = [
          {type:'mdxJsxAttribute',name:'latex',value:latex},
          {type:'mdxJsxAttribute',name:'display',value:display?'true':'false'}
        ];
        node.children=[];
        delete node.value;
        delete node.data;
      }
      for (const child of node.children||[]) visit(child);
    }
    visit(tree);
  };
}