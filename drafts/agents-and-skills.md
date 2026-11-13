# AIエージェントとスキル（調査ログ・下書き）

- **調査日**: 2025-05-10
- **ステータス**: 本番化完了
- **調査動機**: Copilot CLI や Claude Code などのエージェントツールにおいて、「Agent」と「Skill」がどう区別され、どのようにツール連携（MCP等）と組み合わせて開発を効率化するかを整理したい。

---

## 1. 概念の整理（雑メモ）

- Agent（自律エージェント）:
  - 目的（ゴール）を与えられると、自律的に思考（Reasoning）→ 計画（Planning）→ ツール実行（Execution）→ 結果検証（Reflection）をループする主体。
  - Copilot CLI では `task` や `--agent`、サブエージェント（explore, task, general-purpose 等）として実装。
  - ループを勝手に回すのでトークン消費や意図しない変更のリスクに配慮が必要。

- Skill（スキル）:
  - エージェントに特定のドメイン知識や手順、ガイドラインを注入する「手続き・ナレッジパッケージ」。
  - Copilot CLI だと `.github/skills/<name>/SKILL.md` や `~/.copilot/skills/` に置く。
  - ユーザーが明示的にスラッシュコマンドや指示で呼び出すか、モデルがコンテキストから動的に利用する。
  - 決定論的・再現性の高いワークフローを保つために有用。

- MCP（Model Context Protocol）:
  - Anthropic が策定した、LLM/エージェントと外部システム（DB、API、GitHub、ファイルシステム等）を繋ぐ標準プロトコル。
  - JSON-RPC ベースで tools, resources, prompts を公開。
  - これによりエージェントが任意のリソースに標準形式でアクセス可能になる。

## 2. 実践での疑問と気づき

- Q: Agent と Skill の使い分けは？
  - 単純な手順化できる作業（例: 下書きのレビュー、リリースノート生成、特定フォーマットへの変換）は「Skill」で十分。
  - 探索が必要で試行錯誤・エラー修正が伴う作業（例: バグ修正、リファクタリング、複数ファイルの調査）は「Agent」に任せる。
- Q: ドキュメント化のフローはどう組むべき？
  - 下書き（自由形式のメモ）→ スキルで構造化（要約、前提条件、コード例、参照元）→ 人間が確認して本番反映。
  - これにより技術メモの作成コストが激減する。

## 3. 参考リンク

- [GitHub Copilot CLI ドキュメント](https://github.com/features/copilot)
- [Anthropic Model Context Protocol](https://modelcontextprotocol.io/)
- [VitePress 公式ガイド](https://vitepress.dev/)
