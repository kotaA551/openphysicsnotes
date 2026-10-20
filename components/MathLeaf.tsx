import katex from 'katex';
// Server-only leaf: authored HTML is never accepted, only TeX.
export default function MathLeaf({latex, display}: {latex: string; display: string}) {
  return <span dangerouslySetInnerHTML={{__html:katex.renderToString(latex,{
    displayMode:display === 'true',output:'html',trust:false,throwOnError:false,strict:'warn'
  })}}/>;
}
