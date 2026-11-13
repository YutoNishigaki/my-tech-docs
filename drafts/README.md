# 下書き（Drafts）ディレクトリ

このディレクトリ（`drafts/`）は、**調査中の技術情報・メモ・Web記事のスクラップ・アイデアの殴り書き**などを記録するための作業用スペースです。

## 本番サイトへの非公開設定について

VitePress の設定（`.vitepress/config.mts`）にて `srcExclude: ["drafts/**", "**/drafts/**"]` を定義しているため、このディレクトリ以下の Markdown ファイルは **VitePress のビルド対象から完全に除外されます**。

- `npm run docs:build` で本番用 HTML（`.vitepress/dist`）が生成されることはありません。
- GitHub Pages にデプロイされる公開サイトには一切含まれません。
- Git によるバージョン管理は可能なため、マシン間の同期や調査ログの履歴管理は安全に行えます。

## ディレクトリの使い方

1. **下書きを作成する**:
   - `drafts/template.md` をコピーして、新しい調査メモを作成します（例: `drafts/docker-rootless.md`）。
   - 調べたリンク、コマンド履歴、未検証の挙動などを自由にメモします。
2. **本番ページへ昇華する**:
   - 情報が整理できたら、見返しやすさを意識した構成にリファインしてルートディレクトリ（例: `/docker-rootless.md`）に配置します。
   - Copilot CLI スキル `/promote-draft` または Copilot 指示を活用して下書きを整形できます。
   - `.vitepress/config.mts` の `sidebar` / `nav` にリンクを追加します。
3. **品質検証**:
   - `npm run docs:check` を実行して、リンク切れやビルドエラーがないか確認します。
