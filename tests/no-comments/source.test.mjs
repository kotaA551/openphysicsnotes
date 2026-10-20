import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import {articleGroups} from '../../lib/article-structure.mjs';
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(path.join(dir,x.name)):[path.join(dir,x.name)]);
test('runtime has no discussion UI, endpoint, client requests or secret dependency',()=>{
  for(const file of ['app','components','lib'].flatMap(files)){
    if(!/\.(tsx?|mjs|css)$/.test(file))continue;
    const code=fs.readFileSync(file,'utf8');
    assert.doesNotMatch(code,/\/api\/discussions|DiscussionProvider|SectionDiscussion|DiscussionPanel|SUPABASE_SECRET_KEY|DISCUSSION_IP_SALT/,file);
  }
  assert(!fs.existsSync('app/api/discussions/route.ts'));
  const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
  assert(!pkg.scripts.prebuild);assert(!pkg.scripts.predev);
  assert(!pkg.devDependencies['@electric-sql/pglite']);
  const lock=JSON.parse(fs.readFileSync('package-lock.json','utf8'));
  assert(!lock.packages['node_modules/@electric-sql/pglite']);
});
test('article grouping retains major sections and nested authored anchors',async()=>{
  const processor=unified().use(remarkParse).use(remarkRehype).use(rehypeSlug);
  const tree=await processor.run(processor.parse('## 10.1 One\n\nBody\n\n### 10.1.1 Child\n\nBody\n\n## Proof\n\nProof\n\n## 10.2 Two\n\nBody'));
  const groups=articleGroups(tree);
  assert.deepEqual(groups.map(x=>x.id),['101-one','102-two']);
  assert.deepEqual(groups[0].choices.map(x=>x.id),['101-one','1011-child','proof']);
});
