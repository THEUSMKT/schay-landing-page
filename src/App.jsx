import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import LeadStickyBar from './components/LeadStickyBar'
import PageTransition from './components/PageTransition'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import LeadQuiz from './pages/LeadQuiz'
import NotFound from './pages/NotFound'

function App() {
  const location = useLocation()

  return (
    // Folga no fim da página do tamanho da barra fixa do celular, enquanto
    // ela está na tela (ver LeadStickyBar).
    <div className="flex min-h-screen flex-col bg-navy-900 max-sm:pb-(--lead-bar-offset)">
      <ScrollManager />
      <Header />

      {/* Sem `initial={false}`: precisamos que a animação de entrada rode
          também no primeiro carregamento, porque os componentes <Reveal>
          (scroll-reveal) em toda a página dependem do ciclo initial→animate
          do Framer Motion propagando corretamente pela árvore — com
          `initial={false}` aqui, esse estado inicial "escondido" nunca era
          aplicado e as seções apareciam todas já visíveis, sem a animação
          ao rolar a página. */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/apartamentos"
            element={
              <PageTransition>
                <CategoryPage categorySlug="apartamentos" />
              </PageTransition>
            }
          />
          <Route
            path="/casas"
            element={
              <PageTransition>
                <CategoryPage categorySlug="casas" />
              </PageTransition>
            }
          />
          <Route
            path="/terrenos-e-oportunidades"
            element={
              <PageTransition>
                <CategoryPage categorySlug="terrenos" />
              </PageTransition>
            }
          />
          <Route
            path="/minha-busca"
            element={
              <PageTransition>
                <LeadQuiz />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>

      <Footer />
      <WhatsAppButton />
      <LeadStickyBar />
    </div>
  )
}

export default App
