import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

if (typeof document !== 'undefined') {
  const rootEl = document.getElementById('root')
  if (rootEl) {
    createRoot(rootEl).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}
