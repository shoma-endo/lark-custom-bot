import React from 'react';
import ReactDOM from 'react-dom/client';
import RecordView from './components/RecordView';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RecordView />
  </React.StrictMode>
); 