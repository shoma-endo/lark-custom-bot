/**
 * アプリケーションのエントリーポイント
 * Reactアプリケーションをルート要素にマウントする
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from './App';

// ルート要素を取得してReactアプリケーションをマウント
// StrictModeを有効化して開発時の潜在的な問題を検出
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
