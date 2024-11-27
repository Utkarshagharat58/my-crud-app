import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Optional CSS import
import App from './App';  // Ensure this is the correct path for App.tsx

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Make sure the root element exists in your HTML
);
