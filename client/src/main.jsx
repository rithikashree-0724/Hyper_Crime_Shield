import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'

console.log("HYPERSHIELD_BOOT: Grid Initialized. Mounting Application...");

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
  );

  // Clear diagnostic fallback UI
  const fallback = document.getElementById('fallback-ui');
  if (fallback) {
    fallback.style.display = 'none';
  }
}
