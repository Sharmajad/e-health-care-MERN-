/**
 * CLIENT ENTRY POINT — main.jsx
 * ─────────────────────────────
 * Bootstraps the React application by mounting <App /> into the
 * DOM element with id="root" (defined in index.html).
 * Wrapped in <StrictMode> to catch common bugs during development.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'      // Global styles and design tokens
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)