# Bitable カスタムビューデモ

## ファイル構成

```ts
.
├── config // webpackの設定ファイルディレクトリ
│   └── webpack.config.ts // webpack設定ファイル
├── package.json
├── public
│   └── index.html
├── src
│   ├── App.tsx // メインコンポーネント
│   ├── render_helper.ts // セル値のレンダリング関数
│   ├── index.tsx // エントリーポイント
│   └── utils.ts // ユーティリティ関数
├── block.json // ブロックのメタ情報
├── README.md // ドキュメント
└── tsconfig.json // TypeScript設定
```

## 依存関係のインストール

```sh
npm install
# または
yarn install
# または
pnpm install
```

## 開発サーバーの起動

```sh
npm run dev
```

## ビルド

```sh
npm run build
```

## デプロイ

```sh
npm run upload
```

## 機能概要

このプロジェクトは、Lark Base（飛書多維表格）のカスタムビューを実装するためのデモです。
以下の機能を提供します：

- テーブルデータの取得と表示
- カスタムビューの実装
- セル値のレンダリング
- グリッドビューの表示

## 技術スタック

- React
- TypeScript
- Semi UI
- Bitable API
