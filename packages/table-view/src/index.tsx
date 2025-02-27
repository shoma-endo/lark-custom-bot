import React from 'react';
import ReactDOM from 'react-dom/client';
import TableView from './components/TableView';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <TableView />
  </React.StrictMode>
); 