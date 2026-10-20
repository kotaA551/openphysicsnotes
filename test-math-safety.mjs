import katex from 'katex';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const examples=[
  String.raw`\href{javascript:alert(1)}{x}`,
  String.raw`\htmlClass{unsafe}{x}`,
  String.raw`\frac{1}{2}`,
  String.raw`\begin{pmatrix}1&2\\3&4\end{pmatrix}`,
  String.raw`\int_0^1 x\,dx`
];
const results=examples.map(tex=>{
  const html=katex.renderToString(tex,{output:'html',trust:false,throwOnError:false,strict:'warn'});
  assert(!/href=["']javascript:/i.test(html));
  assert(!/<script/i.test(html));
  assert(!html.includes('class="unsafe"'));
  return {tex,htmlBytes:Buffer.byteLength(html),passed:true};
});
fs.writeFileSync('../results/math-safety.json',JSON.stringify(results,null,2));
console.log(results);
