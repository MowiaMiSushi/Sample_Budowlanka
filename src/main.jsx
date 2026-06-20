import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { seedDemoStore } from '@/lib/dataService';

seedDemoStore();

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);