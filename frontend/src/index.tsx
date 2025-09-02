import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Se você tiver um arquivo de CSS global
import App from './App'; // Importa o componente principal

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);