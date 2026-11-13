# Copilot 向け指示

## 言語ルール

- エージェントの調査、計画、コード変更などの作業は英語で行ってください。
- ユーザーとの対話（質問、進捗報告、説明、最終回答を含む）はすべて日本語で行ってください。
- この指示書は日本語で記載し、更新時も日本語を使用してください。
- 最終成果物は日本語で作成してください。

## コマンド

- CI と同じロック済み依存関係をインストールする: `npm ci`
- VitePress の開発サーバーを起動する: `npm run docs:dev`
- 本番サイトをビルドする: `npm run docs:build`
- ビルド済みサイトをプレビューする: `npm run docs:preview`
- ドキュメントの品質・リンク・ビルドを検証する: `npm run docs:check`

ドキュメントや設定の変更、下書きから本番ページへの昇華を行った際は、必ず `npm run docs:check` を実行してリンク切れやビルドエラーがないか検証してください。Git の pre-commit フック（`.githooks/pre-commit`）でも自動実行されます。GitHub Pages の CI も Node.js 24 でビルドコマンドを実行します。

## アーキテクチャ

- このリポジトリは VitePress のドキュメントサイトです。ルート直下の Markdown ファイルがページのソースで、ファイル名がルートになります（例: `api-examples.md` は `/api-examples`）。
- `drafts/` は未公開の調査メモや下書きを置く専用ディレクトリです。`.vitepress/config.mts` の `srcExclude: ["drafts/**", "**/drafts/**"]` により、VitePress のビルドや本番公開から完全に除外されます。
- `.vitepress/config.mts` がサイト設定の中心です。GitHub Pages 用の base path（`/my-tech-docs/`）を設定し、ローカル検索（MiniSearch）、目次（outline）、デフォルトテーマのナビゲーション、サイドバー、外部リンクを管理します。
- `index.md` は VitePress のホームページ用 frontmatter でトップページを構成します。その他の Markdown ページでは通常の VitePress frontmatter を使い、`api-examples.md` のように Vue の `<script setup>` を含めることもできます。
- `.github/workflows/deploy.yml` は `main` への push ごとにデプロイします。`package-lock.json` に基づいて依存関係をインストールし、`.vitepress/dist` にビルドして、そのディレクトリを GitHub Pages に公開します。`.vitepress/dist` と `.vitepress/cache` は生成物として Git 管理対象外です。
- `.github/skills/promote-draft/SKILL.md` は、`drafts/` の下書きを本番向け技術ドキュメントへと変換・整形するための Copilot スキルです。

## コンテンツと設定の規約

- ドキュメントページを追加、改名、削除するときは、`.vitepress/config.mts` の `nav` と `sidebar`、および `index.md` のトップページ内リンクをページのルートに合わせて更新してください。
- 本番ページから `drafts/` ディレクトリ内のファイルへリンクを貼らないでください（`npm run docs:check` で検出・ブロックされます）。
- `/markdown-examples` のような VitePress のルート相対リンクを使ってください。ビルド時に設定済みの GitHub Pages base path が適用されます。
- ページ単位の VitePress オプションには YAML frontmatter を維持してください。`layout: home` はトップページだけに使い、通常の技術メモでは `outline: deep` を指定して見出し目次を右側に展開してください。
- 技術メモは「見返しやすさ」を重視し、冒頭の「::: tip 3行まとめ」、概念の比較表/図、コピペで動く最小コード例、注意点（::: warning）、一次情報リンクの構成を基本としてください。
- VitePress の設定は TypeScript（`.vitepress/config.mts`）で記述し、既存のダブルクォートのスタイルに合わせてください。Markdown の例では、ページに必要な場合に Vue/VitePress の実行時コードを直接埋め込めます。
