import fs from 'node:fs';
import {typescriptLoader} from '../seo/load-typescript.mjs';
const load=typescriptLoader(),{locales}=load('lib/i18n.ts'),{articleList,loadArticle}=load('lib/articles.ts');
const byLocale={},missing=[];let actual=0,total=0;
for(const locale of locales){
  byLocale[locale]={chapters:0,curiosities:0};
  for(const kind of ['chapters','curiosities'])for(const {slug} of articleList(kind)){
    total++;const article=loadArticle(kind,slug,locale);
    if(article?.translated&&article.contentLocale===locale){actual++;byLocale[locale][kind]++;}
    else missing.push({locale,kind,slug});
  }
}
const result={checkedAt:new Date().toISOString(),locales,total,actual,fallbacks:missing.length,byLocale,missing};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(process.argv.includes('--require-complete')&&missing.length)process.exitCode=1;
