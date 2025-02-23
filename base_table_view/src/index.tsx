import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

/**
 * アプリケーションのエントリーポイント
 * Reactアプリケーションをルート要素にマウントします
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // Strict Modeを有効化して、潜在的な問題を検出
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
