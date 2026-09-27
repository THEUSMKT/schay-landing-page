import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BASE_URL é "/" no domínio próprio (schaycorretora.com.br) e em
        Netlify/Vercel, e vira "/schay-landing-page/" só quando o GitHub
        Pages serve o site em theusmkt.github.io/schay-landing-page/ (ver
        .github/workflows/deploy-pages.yml), então o app funciona nos
        dois formatos sem nenhuma outra alteração. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
