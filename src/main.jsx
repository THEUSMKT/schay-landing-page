import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BASE_URL é "/" em produção normal (Netlify/Vercel) e vira
        "/schay-landing-page/" só no build do GitHub Pages (ver
        .github/workflows/deploy-pages.yml), então o app funciona nos
        dois formatos de hospedagem sem nenhuma outra alteração. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
