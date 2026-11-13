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

テストや lint のスクリプトはなく、個別テストを実行するコマンドもありません。ドキュメントや設定の変更を検証するには `npm run docs:build` を実行してください。GitHub Pages の CI も Node.js 24 で同じビルドコマンドを実行します。

## アーキテクチャ

- このリポジトリは VitePress のドキュメントサイトです。ルート直下の Markdown ファイルがページのソースで、ファイル名がルートになります（例: `api-examples.md` は `/api-examples`）。
- `.vitepress/config.mts` がサイト設定の中心です。GitHub Pages 用の base path（`/my-tech-docs/`）を設定し、デフォルトテーマのナビゲーション、サイドバー、外部リンクを管理します。
- `index.md` は VitePress のホームページ用 frontmatter でトップページを構成します。その他の Markdown ページでは通常の VitePress frontmatter を使い、`api-examples.md` のように Vue の `<script setup>` を含めることもできます。
- `.github/workflows/deploy.yml` は `main` への push ごとにデプロイします。`package-lock.json` に基づいて依存関係をインストールし、`.vitepress/dist` にビルドして、そのディレクトリを GitHub Pages に公開します。`.vitepress/dist` と `.vitepress/cache` は生成物として Git 管理対象外です。

## コンテンツと設定の規約

- ドキュメントページを追加、改名、削除するときは、`.vitepress/config.mts` の `nav` と `sidebar`、および `index.md` のトップページ内リンクをページのルートに合わせて更新してください。
- `/markdown-examples` のような VitePress のルート相対リンクを使ってください。ビルド時に設定済みの GitHub Pages base path が適用されます。
- ページ単位の VitePress オプションには YAML frontmatter を維持してください。`layout: home` はトップページだけに使い、通常のページでは必要に応じて `outline: deep` などを指定してください。
- VitePress の設定は TypeScript（`.vitepress/config.mts`）で記述し、既存のダブルクォートのスタイルに合わせてください。Markdown の例では、ページに必要な場合に Vue/VitePress の実行時コードを直接埋め込めます。
