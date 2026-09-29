# Questions & Discussion：導入・運用ガイド

## 実装した構成

Next.js 15.5.26 / App Router / Vercel を維持しています。既存DB・APIはありませんでした。記事は `content/chapters` と `content/curiosities` のMDX、翻訳は `content/translations/<locale>/...` にあり、`components/ArticlePage.tsx` が共通描画しています。

`rehype-slug` と既存アンカーを保持し、その後に共通プラグインでDiscussionを挿入します。記事MDXの手動編集は不要です。本文を持つ見出し（h1〜h6）から次の見出し直前までを1区画とします。直後に子見出しだけが続く見出し、引用・リスト内の見出しには追加せず、二重の投稿欄を避けます。記事末尾の区画にも追加します。

識別子は `article_kind + article_slug + content_locale + section_id` です。`section_id` は既存の見出しIDそのもの。翻訳の議論は言語別、未翻訳ページの英語本文は英語版の議論を共有します。見出し名を変更すると既存アンカー同様にIDも変わるため、既存コメントを引き継ぐ場合はDBの該当IDも変更してください。同名見出しの追加で後続IDが変わる点も同様です。

初期HTMLは記事本文と閉じた見出し行だけ。1記事につき件数を1回取得し、開いた区画のみコメントとフォームを読み込みます。親投稿20件、各親の返信5件が初回上限。続きはカーソルで追加取得します。カウントには返信も含みます。返信への返信も同じ親の下に表示し、ネストは1段階です。

9言語のラベル、匿名名、エラー、プライバシー説明に対応。既存CSSの色変数を使い、独立したテーマ切替は追加していません。既存サイトに別のダークテーマはなかったため、その外観や設定は変更していません。

## ファイル

変更：
- `components/ArticlePage.tsx`：Providerと自動挿入プラグインの接続。
- `components/StaticPages.tsx`：Discussionのプライバシー説明。
- `app/(english)/privacy/page.tsx`：作業ツリーから欠けていた英語Privacyルートを復元。新しい投稿フォームのリンク先として使用。
- `package.json` / `package-lock.json`：MDX解析依存を明示、manifest生成・テストコマンド追加。PGliteは開発テスト専用。
- `next.config.mjs`：`NEXT_BUILD_DIR`による検証用出力先分離。
- `.gitignore`：検証出力を除外し、`.env.example`を追跡。

追加：
- `components/discussions/DiscussionProvider.tsx`：記事単位の件数取得。
- `components/discussions/SectionDiscussion.tsx`：折りたたみと遅延読み込み。
- `components/discussions/DiscussionPanel.tsx`：一覧、投稿、返信、追加取得。
- `components/discussions/discussions.css`：控えめなレスポンシブUI。
- `lib/discussions/sections.mjs`：自動挿入。
- `lib/discussions/manifest.json`：有効な記事・言語・見出しIDの生成済み許可リスト。
- `lib/discussions/messages.ts`：9言語のUIとプライバシー文。
- `lib/discussions/validation.mjs` / `server.ts`：入力検証、サーバー専用Supabase接続、IPハッシュ。
- `app/api/discussions/route.ts`：GET件数・一覧、POST投稿。
- `scripts/discussion-manifest.mjs`：開発起動・ビルド前に許可リストを再生成。
- `supabase/migrations/202609290001_discussions.sql`：テーブル・RPC・権限。
- `supabase/setup-cleanup.sql`：対策用データの定期削除。
- `tests/discussions/*`：入力、描画、PostgreSQL、ローカルHTTP検証。
- `.env.example` / このガイド。

## Supabaseプロジェクト作成

Gitリポジトリとは別に、Supabaseの**Project**を1つ作ります。既存のサイト用Gitリポジトリをそのまま使えます。Auth・メール認証・ログイン画面の設定は不要です。

1. Supabase Dashboardで新規Projectを作成し、DBパスワードを安全な場所へ保存。
2. SQL Editorで `supabase/migrations/202609290001_discussions.sql` 全文を一度だけ実行。
3. 続けて `supabase/setup-cleanup.sql` を実行。Cron拡張が有効になり、毎時17分に期限切れデータを削除します。初回導入の必須手順です。ジョブが動いていることも同ファイル末尾の確認SQLでチェック。
4. Project URLと、Settings → API Keysのサーバー専用Secret keyを取得。ブラウザー向けPublishable/anon keyは使いません。
5. 下記環境変数を設定し、再ビルド・再デプロイ。

CLI利用時は `supabase link --project-ref <ref>` → `supabase db push` でmigrationを適用できます。Cron設定は別途実行してください。SQL Editor方式との二重適用はしないでください。

この作業で実Supabaseプロジェクトは作成していません。SecretをチャットやGitに貼る必要はありません。

## 環境変数

| 名前 | 設定内容 |
| --- | --- |
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `SUPABASE_SECRET_KEY` | `sb_secret_...`。旧service_role JWTも対応 |
| `DISCUSSION_IP_SALT` | 32文字以上のランダム秘密値。下記コマンドで生成 |
| `DISCUSSION_ALLOWED_ORIGINS` | 許可するサイトのorigin。カンマ区切り、末尾`/`なし |

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

全てサーバー専用です。`NEXT_PUBLIC_`を付けないでください。URL以外の秘密値はAPIレスポンスにもログにも出しません。

ローカルでは既存の `.env.local` を上書きせず `.env.example` の項目を追記します。例：

```dotenv
DISCUSSION_ALLOWED_ORIGINS=http://localhost:3000
```

3008番を使うなら `http://localhost:3008` に変更。`127.0.0.1`で開く場合は、そのoriginも別途追加します。

```bash
npm install
npm run dev
```

VercelではProject → Settings → Environment Variablesに4項目を設定。Productionのoriginは実際に使用するドメイン、たとえば `https://www.openphysicsnotes.com` にします。wwwなしでもページを配信する場合のみ追加します。Previewは別のSupabaseテストProjectと秘密値を使い、実際のPreview URLを許可リストに登録するか、変数を設定せず投稿を無効にしてください。任意の `*.vercel.app` を一括許可しません。

Build Commandは通常の `npm run build` にします。`prebuild`が見出し許可リストを更新します。記事編集後、開発サーバー起動中に新見出しを追加した場合は `node scripts/discussion-manifest.mjs` を実行するか再起動してください。

未設定・DB停止時はAPIが503を返し、欄を開くと利用不可と再試行を表示します。記事・metadata・JSON-LD・canonical・sitemapは影響を受けません。Supabaseの無料Projectは低活動が続くと一時停止する場合があります。

## スキーマ・安全性

`public.discussion_comments`：

| 列 | 型・用途 |
| --- | --- |
| `id` | bigint identity。APIでは精度を失わない文字列 |
| `article_kind`, `article_slug` | 記事カテゴリとslug |
| `content_locale`, `section_id` | 本文言語と既存アンカーID |
| `parent_id` | 親ID、ルートはNULL。同じ区画への外部キー、1段階制約 |
| `display_name` | 任意、空ならUIでAnonymous相当を表示。最大60文字 |
| `content` | 必須、最大3,000文字 |
| `created_at` | サーバー日時 |
| `status` | published / hidden。将来のモデレーションに拡張可能 |

`discussion_private.limits` と `receipts` は、日替わりIPハッシュ、回数、投稿のハッシュ、再試行ID、期限などを短期保存します。生のIP・メール・アカウント情報は保存しません。IPv6は/64にまとめ、アドレス末尾の変更による回避を抑えます。レコードは48時間で失効し、毎時削除するため実際の保持は最大約49時間です。Cronが失敗した場合は削除が遅れるので実行履歴を監視してください。

- 全テーブルでRLS有効。anon/authenticated/PUBLICへのテーブル権限とRPC実行権限なし。
- サーバーのSecret key（service_role権限）だけが読み書き。RPCは`security invoker`と空の`search_path`を使用。
- SQL側の行ロックで、複数Vercelインスタンスからの同時投稿も同じ制限に集約。
- 投稿間隔15秒以上、10分窓5件まで、UTC日付ごと30件まで。読み込みは1分120件まで。同じ回線の利用者は上限を共有します。
- 10分以内の同内容を拒否。通信エラー後の同じリクエストIDでの再試行は既存投稿を返し、二重投稿しません。
- honeypot、空白・不可視文字だけの投稿拒否、文字数制限、20KBのリクエスト上限、origin照合、JSON限定。
- 内容はReactのテキストノードとして表示。HTML/Markdownは解釈せず、URLも自動リンク化しません。
- コメント本文を初期HTML・構造化データに含めず、APIはno-store/noindex、Discussion領域はdata-nosnippet。
- DB障害時にメモリー上の制限へフォールバックせず、投稿を停止します。

IPの取得はVercelが付与するヘッダーだけを信頼します。Vercel以外の本番ホスティングでは、信頼できるプロキシ設定を別途実装するまで503になります。ローカル開発では全利用者が1つの開発用制限枠を共有します。

## 管理者による非表示・削除

Supabase SQL Editor / Table Editorを使用します。公開の管理APIはありません。表示名は本人認証されていないので、名前だけで「管理者」と判断しないでください。

```sql
-- 内容を確認してから対象のIDを指定する
select id, article_slug, section_id, display_name, content, created_at, status
from public.discussion_comments order by id desc limit 50;

-- 非表示（可逆）。親を非表示にすると返信も公開APIから見えなくなる
update public.discussion_comments set status = 'hidden' where id = 123;
-- 復元
update public.discussion_comments set status = 'published' where id = 123;
-- 完全削除。親ならその返信も削除される
delete from public.discussion_comments where id = 123;
```

閲覧中のブラウザーに既に読み込まれた投稿はリロード等まで残ります。DBで削除・非表示にした後の新しいAPI取得には含まれません。Realtimeは初版では使用していません。

## 検証

```bash
npm run test:discussions
npm run typecheck
npm run lint
npm run build
```

既存の`lint`はESLintではなく`tsc --noEmit`です。DBテストはPGliteのPostgreSQLエンジンでmigrationを実行し、権限・ページング・返信・非表示・削除・連投・重複・清掃を確認します。

外部サービスを使わないローカルのAPI/UI検証：

```bash
# ターミナル1：使い捨てDBとNextを起動。実Supabaseには接続しない
node tests/discussions/local-preview.mjs
# ターミナル2：APIの検証
node tests/discussions/http-check.mjs
```

`http://127.0.0.1:3012/curiosities/dark-matter` で開閉、匿名投稿、返信、再試行、狭い画面を確認できます。終了するとテストDBは消えます。再実行時は新しいDBで開始してください。

本番チェックと既存の開発サーバーを併用する場合は、出力先を分離できます（PowerShell）：

```powershell
$env:NEXT_BUILD_DIR='.next-discussion-check'
npm run build
Remove-Item Env:NEXT_BUILD_DIR
```

実Supabase設定後は、ブラウザーの公開キーからテーブル/RPCを操作できないこと、投稿が再起動後も残ること、Cron成功履歴、許可外originの403を確認してください。ローカルの互換API検証は実Supabase・Vercel接続の確認を代替しません。

## 今回の検証結果

今回の検証結果（2026-09-29）：
- 本番ビルド成功、203ページを生成。記事は静的生成を維持し、Discussion APIのみ動的。
- `tsc --noEmit` / `npm run lint` 成功。
- 自動テスト5件成功（各テスト内に複数の検証を含む）。
- ローカルPostgreSQL＋Next APIでorigin拒否、入力制限、記事・区画照合、honeypot、匿名投稿、再試行、重複、連投制限を確認。
- ブラウザーで英語・日本語の投稿と返信、件数更新、キーボード開閉、空状態、HTMLが文字列として表示されることを確認。
- 1280px / 768px / 390pxで横はみ出しなし。フォームは390pxでも利用可能。
- 既存記事の数式に由来するKaTeX警告、およびローカルwebpackキャッシュ警告は出ましたが、ビルド失敗はありません。
- 実Supabase・Vercelへの接続とCron実行は、プロジェクト・環境変数が未設定のため未確認です。

## 公式資料

- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Database Functions / privileges](https://supabase.com/docs/guides/database/functions)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Cron](https://supabase.com/docs/guides/cron)
- [Vercel request headers](https://vercel.com/docs/headers/request-headers)
- [Free Project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)
