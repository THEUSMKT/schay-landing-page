import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import PageTransition from './components/PageTransition'
import ScrollManager from './components/ScrollManager'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import NotFound from './pages/NotFound'

function App() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-navy-900">
      <ScrollManager />
      <Header />

      <AnimatePresence mode="wait" initial={false}>
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
    </div>
  )
}

export default App
