import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const SHOW_DELAY_MS = 900
const DISMISS_SCROLL_PX = 4
// Distância mínima da borda inferior da tela e folga mínima em volta de
// qualquer texto, botão ou foto protegido no hero.
const VIEWPORT_EDGE = 20
const CLEARANCE = 14

/**
 * Retângulos que o indicador não pode cobrir: elementos marcados com
 * data-cue-avoid dentro do hero. "text" mede linha a linha (o espaço à
 * direita de uma linha curta conta como livre); "box" usa a caixa inteira
 * (botões, foto).
 */
function protectedRects(hero) {
  const rects = []
  hero.querySelectorAll('[data-cue-avoid]').forEach((el) => {
    if (el.dataset.cueAvoid === 'text') {
      const range = document.createRange()
      range.selectNodeContents(el)
      rects.push(...range.getClientRects())
    } else {
      rects.push(el.getBoundingClientRect())
    }
  })
  return rects.filter((r) => r.width > 0 && r.height > 0)
}

// Posição horizontal livre mais próxima do centro para uma faixa vertical
// [top, bottom], ou null se nada coberto couber ali.
function freeLeft(rects, top, bottom, minX, maxX, width) {
  const blocked = rects
    .filter((r) => r.bottom + CLEARANCE > top && r.top - CLEARANCE < bottom)
    .map((r) => [r.left - CLEARANCE, r.right + CLEARANCE])
    .sort((a, b) => a[0] - b[0])

  const free = []
  let cursor = minX
  for (const [start, end] of blocked) {
    if (start > cursor) free.push([cursor, Math.min(start, maxX)])
    cursor = Math.max(cursor, end)
  }
  if (cursor < maxX) free.push([cursor, maxX])

  const center = (minX + maxX) / 2
  let best = null
  for (const [start, end] of free) {
    if (end - start < width) continue
    const x = Math.min(Math.max(center, start + width / 2), end - width / 2)
    if (best === null || Math.abs(x - center) < Math.abs(best - center)) best = x
  }
  return best === null ? null : best - width / 2
}

function computePlacement(hero, cue) {
  const vh = window.innerHeight
  const { width, height } = cue.getBoundingClientRect()
  const heroRect = hero.getBoundingClientRect()
  const grid = hero.querySelector('[data-cue-grid]') ?? hero
  const gridRect = grid.getBoundingClientRect()
  const gridStyle = window.getComputedStyle(grid)
  const minX = gridRect.left + parseFloat(gridStyle.paddingLeft)
  const maxX = gridRect.right - parseFloat(gridStyle.paddingRight)
  const rects = protectedRects(hero)

  const candidates = []

  // Layout empilhado (celular/tablet): no respiro entre os botões e a foto,
  // centralizado — nunca por cima dela. Aqui o topo da foto já é o limite
  // de baixo na maioria dos aparelhos, então a margem da borda da tela
  // pode ser menor que a do caso geral.
  const gapTop = hero.querySelector('[data-cue-gap-top]')?.getBoundingClientRect()
  const gapBottom = hero.querySelector('[data-cue-gap-bottom]')?.getBoundingClientRect()
  if (gapTop && gapBottom && gapBottom.top >= gapTop.bottom) {
    const regionBottom = Math.min(gapBottom.top, vh - 8)
    const space = regionBottom - gapTop.bottom
    if (space >= height + 2 * CLEARANCE) candidates.push(gapTop.bottom + (space - height) / 2)
  }

  // Perto da borda inferior da primeira tela, sem descer além do hero (a
  // faixa de transição logo abaixo já clareia e prejudicaria o contraste).
  candidates.push(Math.min(vh - VIEWPORT_EDGE, heroRect.bottom - VIEWPORT_EDGE) - height)

  for (const top of candidates) {
    if (top < heroRect.top || top + height > vh) continue
    const left = freeLeft(rects, top, top + height, minX, maxX, width)
    if (left !== null) return { top, left }
  }
  return null
}

/**
 * Indicação pequena de que há conteúdo abaixo da primeira tela. Aparece só
 * com a página no topo e a próxima seção ainda fora da tela, numa posição
 * medida pra não cobrir CTAs, a foto da corretora nem texto; some com um
 * fade-out no primeiro scroll (ou quando a próxima seção aparece) e não
 * volta mais nesta visita. Não é clicável e não mexe na rolagem.
 */
export default function ScrollCue({ heroRef, nextSectionId }) {
  const reduceMotion = useReducedMotion()
  const cueRef = useRef(null)
  const [phase, setPhase] = useState('waiting') // waiting → measuring → shown → gone
  const [position, setPosition] = useState(null)

  useEffect(() => {
    const dismiss = () => setPhase('gone')
    if (window.scrollY > DISMISS_SCROLL_PX) {
      dismiss()
      return undefined
    }

    const onScroll = () => {
      if (window.scrollY > DISMISS_SCROLL_PX) dismiss()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const next = document.getElementById(nextSectionId)
    const observer =
      next && 'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) dismiss()
          })
        : null
    observer?.observe(next)

    // Espera o hero assentar (fontes carregadas, entradas animadas) antes
    // de medir onde há espaço livre.
    let cancelled = false
    const timer = setTimeout(() => {
      Promise.resolve(document.fonts?.ready).finally(() => {
        if (!cancelled) setPhase((current) => (current === 'waiting' ? 'measuring' : current))
      })
    }, SHOW_DELAY_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [nextSectionId])

  useLayoutEffect(() => {
    if (phase !== 'measuring') return
    const placement =
      heroRef.current && cueRef.current ? computePlacement(heroRef.current, cueRef.current) : null
    if (placement) {
      setPosition(placement)
      setPhase('shown')
    } else {
      setPhase('gone')
    }
  }, [phase, heroRef])

  useEffect(() => {
    if (phase !== 'shown') return undefined
    const onResize = () => {
      const placement =
        heroRef.current && cueRef.current ? computePlacement(heroRef.current, cueRef.current) : null
      if (placement) setPosition(placement)
      else setPhase('gone')
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [phase, heroRef])

  if (phase === 'waiting') return null

  return createPortal(
    <AnimatePresence>
      {phase === 'measuring' || phase === 'shown' ? (
        <motion.div
          key="scroll-cue"
          ref={cueRef}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'shown' ? 1 : 0 }}
          exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' } }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            top: position?.top ?? 0,
            left: position?.left ?? 0,
            visibility: phase === 'shown' ? 'visible' : 'hidden',
          }}
          className="pointer-events-none fixed z-30 flex flex-col items-center gap-1 text-white/75 select-none"
        >
          <span className="text-xs font-medium tracking-wide whitespace-nowrap [text-shadow:0_1px_10px_rgb(7_13_26/0.8)]">
            <span className="pointer-coarse:hidden">Role para descobrir</span>
            <span className="hidden pointer-coarse:inline">Deslize para cima para explorar</span>
          </span>
          <svg
            className="scroll-cue-arrow h-4 w-2.5 text-accent-300"
            viewBox="0 0 12 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 1v17" />
            <path d="M1.5 13.5 6 18l4.5-4.5" />
          </svg>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
