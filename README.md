# Lark Bitable カスタムアプリケーション

## 目次

- [プロジェクト概要](#プロジェクト概要)
- [機能概要](#機能概要)
- [技術スタック](#技術スタック)
- [プロジェクト構成](#プロジェクト構成)
- [開発環境セットアップ](#開発環境セットアップ)
- [コーディング規約](#コーディング規約)
- [デプロイ方法](#デプロイ方法)
- [トラブルシューティング](#トラブルシューティング)

## プロジェクト概要

このプロジェクトは、Lark（飛書）プラットフォーム上でBitable（多維表格）と連携するカスタムアプリケーションを開発するためのテンプレートです。Bitableのデータを取得・表示したり、カスタムビューを実装したりするための機能を提供します。

## 機能概要

- テーブルデータの取得と表示
- カスタムビューの実装
- レコード詳細表示
- セル値のカスタムレンダリング
- 各種フィールドタイプのサポート
- 自動化アクションの登録と実行

## 技術スタック

### フロントエンド
- React 18
- TypeScript
- Semi UI（@douyinfe/semi-ui）
- Lark Bitable API（@lark-opdev/block-bitable-api）

### ビルドツール
- Webpack
- esbuild-loader
- ESLint
- Prettier

## プロジェクト構成

```
.
├── config/                  # webpack設定ファイルディレクトリ
│   └── webpack.config.js    # webpack設定ファイル
├── public/                  # 静的ファイルディレクトリ
│   └── index.html           # HTMLテンプレート
├── src/                     # ソースコードディレクトリ
│   ├── components/          # Reactコンポーネント
│   ├── App.tsx              # メインコンポーネント
│   ├── index.tsx            # エントリーポイント
│   ├── render_helper.tsx    # セル値のレンダリング関数
│   └── utils.ts             # ユーティリティ関数
├── block.json               # アプリケーションのメタ情報
├── package.json             # プロジェクト依存関係と設定
├── tsconfig.json            # TypeScript設定
├── .eslintrc.js             # ESLint設定
├── .prettierrc.js           # Prettier設定
└── README.md                # プロジェクトドキュメント
```

## 開発環境セットアップ

### 前提条件
- Node.js 14.0.0 以上
- npm、yarn、または pnpm

### インストール手順

1. リポジトリをクローン
```bash
git clone [repository-url]
cd [project-directory]
```

2. 依存パッケージをインストール
```bash
npm install
# または
yarn install
# または
pnpm install
```

3. 開発サーバーを起動
```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

## コーディング規約

### 命名規則
- コンポーネントファイル: PascalCase（例: `TableView.tsx`）
- ユーティリティファイル: camelCase（例: `utils.ts`）
- 定数: UPPER_SNAKE_CASE（例: `MAX_ITEMS`）
- 変数・関数: camelCase（例: `getUserData`）

### TypeScript
- `any` 型の使用を避け、明示的な型定義を使用する
- インターフェースには `I` プレフィックスを付ける（例: `ITableData`）
- 型のみのインポートには `import type` を使用する

### React コンポーネント
- 関数コンポーネントとアロー関数を使用する
- コンポーネントには JSDoc コメントを付ける
- Props には明示的なインターフェースを定義する

### スタイリング
- Semi UI コンポーネントを優先して使用する
- スタイルはコンポーネント内でインラインで定義する
- 複雑なスタイルはスタイルオブジェクトとして分離する

## デプロイ方法

1. プロダクションビルドを作成
```bash
npm run build
# または
yarn build
# または
pnpm build
```

2. Larkプラットフォームにアップロード
```bash
npm run upload
# または
yarn upload
# または
pnpm upload
```

## トラブルシューティング

### よくある問題と解決方法

1. Bitableへの接続エラー
   - Lark開発者アカウントの権限を確認
   - アプリIDとシークレットが正しいか確認

2. ビルドエラー
   - Node.jsのバージョンが互換性があるか確認（v14以上推奨）
   - 依存関係が正しくインストールされているか確認

3. レンダリングの問題
   - ブラウザのコンソールでエラーを確認
   - Reactのdev toolsを使用してコンポーネント階層を確認

4. APIの制限
   - Bitableに対するAPI呼び出しの頻度を制限する
   - 大規模なデータセットを処理する場合はページネーションを使用する

## ライセンス

このプロジェクトは [MITライセンス](LICENSE) のもとで公開されています。
