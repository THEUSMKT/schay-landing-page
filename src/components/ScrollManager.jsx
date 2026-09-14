import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// Duração aproximada da transição de saída da página (ver PageTransition) —
// espera esse tempo antes de rolar até uma âncora em uma página nova, pra
// dar tempo do elemento existir no DOM.
const EXIT_TRANSITION_MS = 320

/**
 * Centraliza o comportamento de rolagem ao navegar:
 *  - Troca de rota sem âncora → volta pro topo instantaneamente (a própria
 *    transição de fade/slide da página já cuida da suavidade visual).
 *  - Navegação para uma âncora (#imoveis, #contato...) → rolagem suave até
 *    o elemento, com uma pequena espera quando a âncora está em outra
 *    página (pra ela já estar montada no DOM).
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  const prevPathname = useRef(null)

  useEffect(() => {
    const isFirstRun = prevPathname.current === null
    const pathnameChanged = !isFirstRun && prevPathname.current !== pathname
    prevPathname.current = pathname

    if (hash) {
      const delay = pathnameChanged ? EXIT_TRANSITION_MS : 0
      const timeout = setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, delay)
      return () => clearTimeout(timeout)
    }

    if (!isFirstRun && pathnameChanged) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    return undefined
  }, [pathname, hash])

  return null
}
