import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Double check: is it App.jsx or app.jsx?
import './index.css'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("The root element was not found. Check your index.html for <div id='root'></div>");
}