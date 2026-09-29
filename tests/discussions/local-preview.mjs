// Local-only integration fixture. Never connects to a real Supabase project.
import { PGlite } from '@electric-sql/pglite';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
const db = new PGlite();
await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
await db.exec(await fs.readFile('supabase/migrations/202609290001_discussions.sql', 'utf8'));
const manifest = JSON.parse(await fs.readFile('lib/discussions/manifest.json', 'utf8'));
const section = manifest['curiosities/dark-matter/en'][0];
await db.query("insert into public.discussion_comments(article_kind,article_slug,content_locale,section_id,content) values ('curiosities','dark-matter','en',$1,$2)", [section, 'How does this observation distinguish dark matter from ordinary matter?']);
await db.query("insert into public.discussion_comments(article_kind,article_slug,content_locale,section_id,parent_id,display_name,content) values ('curiosities','dark-matter','en',$1,1,'Reader',$2)", [section, 'The independent observations help constrain the possibilities.']);
const parameters = {
  discussion_read_gate: ['p_token'], discussion_counts: ['p_kind','p_slug','p_locale'],
  discussion_list: ['p_kind','p_slug','p_locale','p_section','p_parent','p_after'],
  discussion_post: ['p_kind','p_slug','p_locale','p_section','p_parent','p_name','p_content','p_token','p_fingerprint','p_request'],
};
const server = createServer(async (req, res) => {
  const name = req.url?.split('/').at(-1);
  res.setHeader('Content-Type','application/json');
  if (req.headers.apikey !== 'local-fixture-secret' || !Object.hasOwn(parameters, name)) { res.writeHead(403); res.end('{}'); return; }
  try {
    let raw = ''; for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw);
    const args = parameters[name].map(key => body[key]);
    const result = await db.query(`select public.${name}(${args.map((_, i) => '$' + (i + 1)).join(',')}) as result`, args);
    res.end(JSON.stringify(result.rows[0].result));
  } catch (error) { res.writeHead(400); res.end(JSON.stringify({ message: error.message, code: error.code })); }
});
await new Promise(resolve => server.listen(3457, '127.0.0.1', resolve));
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port','3012'], {
  stdio: 'inherit', env: { ...process.env, NEXT_BUILD_DIR: '.next-discussion-dev', SUPABASE_URL: 'http://127.0.0.1:3457',
    SUPABASE_SECRET_KEY: 'local-fixture-secret', DISCUSSION_IP_SALT: 'local-only-fixture-key-not-for-production-0123456789',
    DISCUSSION_ALLOWED_ORIGINS: 'http://127.0.0.1:3012', VERCEL: '' },
});
console.log(`Local discussion fixture: http://127.0.0.1:3012/curiosities/dark-matter (Next PID ${child.pid})`);
async function stop() { child.kill(); server.close(); await db.close(); process.exit(); }
process.on('SIGINT', stop); process.on('SIGTERM', stop);
