import katex from 'katex';
// Only KaTeX-generated HTML is admitted. Raw MDX/user HTML is never compacted.
// trust:false blocks HTML extensions and unsafe URLs in authored TeX.
export default function remarkCompactMath() {
  return tree => {
    function visit(node) {
      if (node.type === 'math' || node.type === 'inlineMath') {
        const displayMode = node.type === 'math';
        const html = katex.renderToString(node.value, { displayMode, output:'html', trust:false, throwOnError:false, strict:'warn' });
        node.type = displayMode ? 'mdxJsxFlowElement' : 'mdxJsxTextElement';
        node.name = 'span';
        node.attributes = [{
          type:'mdxJsxAttribute', name:'dangerouslySetInnerHTML',
          value:{type:'mdxJsxAttributeValueExpression',value:`${JSON.stringify({__html:html})}`, data:{estree:{
            type:'Program',sourceType:'module',body:[{type:'ExpressionStatement',expression:{
              type:'ObjectExpression',properties:[{type:'Property',kind:'init',method:false,shorthand:false,computed:false,key:{type:'Identifier',name:'__html'},value:{type:'Literal',value:html}}]
            }}]
          }}}
        }];
        node.children=[];
        delete node.value;
        delete node.data;
      }
      for (const child of node.children||[]) visit(child);
    }
    visit(tree);
  };
}
