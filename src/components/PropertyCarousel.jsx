import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react'
import PropertyCard from './PropertyCard'
import Reveal from './Reveal'
import useDragScroll from '../hooks/useDragScroll'

// Soltou arrastando rápido (px/ms): vai pro card seguinte na direção do
// gesto mesmo sem ter passado da metade do caminho.
const FLICK_VELOCITY = 0.35
const SCROLL_TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] }

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const pad2 = (n) => String(n).padStart(2, '0')

// Quantos cards cabem inteiros por tela (ver as larguras na faixa, abaixo):
// 1 no celular, 2 do sm ao md, 3 do lg em diante. Com isso dá pra saber só
// com CSS — já certo no HTML pré-renderizado, sem esperar o JS medir nada —
// em quais telas a lista transborda e precisa de setas/contador/instrução
// (com 1 imóvel só, eles nem são renderizados).
function hideWhenAllFit(count) {
  if (count >= 4) return ''
  if (count === 3) return 'lg:hidden'
  return 'sm:hidden'
}

function ArrowButton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      data-fab-avoid
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy-950 ring-1 ring-navy-950/10 transition-[background-color,color,opacity,box-shadow] duration-200 ${
        disabled ? 'cursor-not-allowed opacity-40' : 'shadow-soft hover:bg-navy-950 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

/**
 * Listagem de imóveis das páginas de categoria como carrossel horizontal:
 * uma fileira só, com a rolagem nativa do navegador e scroll-snap (cada
 * card encaixa alinhado à esquerda). No celular, 1 card por vez (90% da
 * largura útil) com a ponta do próximo aparecendo; do sm ao md, 2 cards e
 * a ponta do terceiro; do lg em diante, 3 cards inteiros.
 *
 * Por cima da rolagem nativa: setas (mouse/trackpad), arraste com o mouse
 * que não abre o imóvel por engano, ←/→ do teclado com foco em qualquer
 * ponto do carrossel e o contador do primeiro card visível ("01 de 06").
 * Sem avanço automático e sem repetição infinita.
 */
export default function PropertyCarousel({ properties, heading, headingId }) {
  const count = properties.length
  const reduceMotion = useReducedMotion()
  const trackRef = useRef(null)
  const stepRef = useRef(0)
  const targetRef = useRef(0)
  const animationRef = useRef(null)
  const [status, setStatus] = useState({ index: 0, atStart: true, atEnd: count <= 1 })

  // Primeiro card visível + se a faixa está no começo/fim. Ao fim da
  // rolagem, com o último card já inteiro na tela, o "primeiro visível" é o
  // da esquerda dele (no desktop, "04 de 06" mostra 4, 5 e 6).
  const readStatus = useCallback(() => {
    const el = trackRef.current
    const max = el.scrollWidth - el.clientWidth
    const index = stepRef.current ? clamp(Math.round(el.scrollLeft / stepRef.current), 0, count - 1) : 0
    return { index, atStart: el.scrollLeft <= 1, atEnd: el.scrollLeft >= max - 1 }
  }, [count])

  const syncStatus = useCallback(() => {
    const next = readStatus()
    setStatus((prev) =>
      prev.index === next.index && prev.atStart === next.atStart && prev.atEnd === next.atEnd ? prev : next,
    )
  }, [readStatus])

  const stopAnimation = useCallback(() => {
    animationRef.current?.stop()
    animationRef.current = null
    if (trackRef.current) trackRef.current.style.scrollSnapType = ''
  }, [])

  const scrollToIndex = useCallback(
    (index) => {
      const el = trackRef.current
      const stepPx = stepRef.current
      if (!el || !stepPx) return
      const target = clamp(index, 0, count - 1)
      // Perto do fim o encaixe de um card pode estar além do limite da
      // rolagem: aí o destino é o próprio fim (último card inteiro na tela).
      const to = clamp(target * stepPx, 0, el.scrollWidth - el.clientWidth)
      if (animationRef.current && targetRef.current === target) return
      targetRef.current = target
      animationRef.current?.stop()

      if (reduceMotion || Math.abs(el.scrollLeft - to) < 1) {
        animationRef.current = null
        el.style.scrollSnapType = ''
        el.scrollLeft = to
        return
      }
      // Snap desligado durante a animação: senão o navegador "puxa" pro
      // ponto de encaixe mais próximo no meio do caminho.
      el.style.scrollSnapType = 'none'
      animationRef.current = animate(el.scrollLeft, to, {
        ...SCROLL_TRANSITION,
        onUpdate: (value) => {
          el.scrollLeft = value
        },
        onComplete: () => {
          animationRef.current = null
          el.style.scrollSnapType = ''
        },
      })
    },
    [count, reduceMotion],
  )

  // Índice de onde partir numa navegação: durante uma animação, o destino
  // dela (dois cliques rápidos em "próximo" avançam dois cards).
  const currentIndex = () => (animationRef.current ? targetRef.current : readStatus().index)

  // --- Arraste com mouse (toque e caneta usam a rolagem nativa) -----------
  const { dragging, isDragging, dragHandlers } = useDragScroll(trackRef, {
    onPress: stopAnimation,
    onRelease: ({ velocity }) => {
      const p = trackRef.current.scrollLeft / stepRef.current
      let target = Math.round(p)
      if (velocity < -FLICK_VELOCITY) target = Math.ceil(p)
      else if (velocity > FLICK_VELOCITY) target = Math.floor(p)
      scrollToIndex(target)
    },
  })

  // Distância entre o início de dois cards (muda por breakpoint).
  useLayoutEffect(() => {
    const el = trackRef.current
    const measure = () => {
      const slides = el.querySelectorAll('[data-slide]')
      if (slides.length >= 2) {
        // getBoundingClientRect (fracionário), não offsetLeft (inteiro): com
        // larguras em % arredondar faria o card parar 1px fora do encaixe.
        const stepPx = slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left
        if (stepPx > 0) stepRef.current = stepPx
      }
      if (!animationRef.current && !isDragging()) syncStatus()
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [isDragging, syncStatus])

  // Posição de rolagem -> contador/setas; qualquer interação direta (toque,
  // roda, trackpad) interrompe uma animação de navegação em andamento. Na
  // primeira rolagem, as fotos dos cards que ainda estão fora da tela
  // começam a carregar — nem todo navegador antecipa imagens "lazy" dentro
  // de uma faixa horizontal, e o card chegaria sem foto.
  useEffect(() => {
    const el = trackRef.current
    let frame = 0
    let warmed = false
    const onScroll = () => {
      if (!warmed) {
        warmed = true
        el.querySelectorAll('img[loading="lazy"]').forEach((img) => {
          img.loading = 'eager'
        })
      }
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0
          syncStatus()
        })
      }
    }
    const interrupt = () => {
      if (animationRef.current) stopAnimation()
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('touchstart', interrupt, { passive: true })
    el.addEventListener('wheel', interrupt, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('touchstart', interrupt)
      el.removeEventListener('wheel', interrupt)
    }
  }, [syncStatus, stopAnimation])

  // Lista diferente (ex.: um filtro no futuro) sempre recomeça do primeiro
  // imóvel — o evento de rolagem atualiza contador e setas, e uma
  // quantidade diferente de imóveis refaz a medição (efeito acima).
  const listKey = properties.map((property) => property.id).join('|')
  useEffect(() => {
    stopAnimation()
    trackRef.current.scrollLeft = 0
  }, [listKey, stopAnimation])

  // Deixa o card `index` inteiro na tela: se está à esquerda, ele vira o
  // primeiro visível; se está à direita, o último.
  const revealSlide = (index) => {
    const el = trackRef.current
    const slide = el.querySelectorAll('[data-slide]')[index]
    if (!slide || !stepRef.current) return
    const gutter = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0
    const view = el.getBoundingClientRect()
    const rect = slide.getBoundingClientRect()
    if (rect.left < view.left + gutter - 1) {
      scrollToIndex(index)
    } else if (rect.right > view.right - gutter + 1) {
      // Cards inteiros que cabem entre as margens (o gap é o passo menos a
      // largura do card).
      const gap = stepRef.current - rect.width
      const perView = Math.max(1, Math.floor((view.width - 2 * gutter + gap) / stepRef.current + 0.01))
      scrollToIndex(index - perView + 1)
    }
  }

  // --- Teclado -------------------------------------------------------------
  // Com o foco num card, ←/→ levam o foco pro card vizinho (e a faixa
  // acompanha); com o foco nas setas, ←/→ só rolam um card.
  const onKeyDown = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const delta = event.key === 'ArrowRight' ? 1 : -1
    event.preventDefault()
    const slide = event.target.closest('[data-slide]')
    if (!slide) {
      scrollToIndex(currentIndex() + delta)
      return
    }
    const index = Number(slide.dataset.index) + delta
    if (index < 0 || index >= count) return
    trackRef.current.querySelectorAll('[data-slide]')[index].querySelector('a, button')?.focus({ preventScroll: true })
    revealSlide(index)
  }

  const showControls = count > 1
  const hideWhenFits = hideWhenAllFit(count)
  const { index, atStart, atEnd } = status

  return (
    <div role="region" aria-roledescription="carrossel" aria-labelledby={headingId} onKeyDown={onKeyDown}>
      <div className="flex items-center justify-between gap-4">
        {heading}
        {showControls ? (
          <div className={`flex shrink-0 items-center gap-3 sm:gap-4 ${hideWhenFits}`}>
            <p
              aria-live="polite"
              aria-atomic="true"
              data-fab-avoid
              className="text-sm font-medium text-navy-500 tabular-nums"
            >
              <span className="text-navy-950">{pad2(index + 1)}</span> de {pad2(count)}
            </p>
            <div className="hidden items-center gap-2 pointer-fine:flex">
              <ArrowButton
                label="Imóvel anterior"
                disabled={atStart}
                onClick={() => scrollToIndex(currentIndex() - 1)}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </ArrowButton>
              <ArrowButton
                label="Próximo imóvel"
                disabled={atEnd}
                onClick={() => scrollToIndex(currentIndex() + 1)}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </ArrowButton>
            </div>
          </div>
        ) : null}
      </div>

      <Reveal delay={0.08}>
        {showControls ? (
          <p className={`mt-2 flex items-center gap-2 text-[13px] text-navy-500 sm:text-sm ${hideWhenFits}`}>
            <MoveHorizontal className="h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
            <span className="pointer-fine:hidden">Deslize para o lado e descubra mais imóveis</span>
            <span className="hidden pointer-fine:inline">Explore os imóveis pelas setas</span>
          </p>
        ) : null}

        {/* Faixa: de borda a borda da tela até o md (a ponta do próximo card
            chega até a beira); no lg, 24px além do contêiner de cada lado —
            espaço pra sombra/elevação do hover não ser cortada, sem mostrar
            pedaço do card seguinte. Os espaçadores das pontas + o gap
            formam a margem lateral (--gutter), e o scroll-padding faz o
            encaixe respeitar essa margem; pt-3/pb-12 são a folga vertical
            pra elevação e sombra dos cards. */}
        <div
          ref={trackRef}
          data-dragging={dragging}
          data-fab-clip
          {...dragHandlers}
          className="-mx-5 mt-3 flex snap-x snap-mandatory scroll-px-(--gutter) gap-(--gap) overflow-x-auto overscroll-x-contain pt-3 pb-12 [--card-w:calc((100%_-_40px)_*_0.9)] [--edge:8px] [--gap:12px] [--gutter:20px] [scrollbar-width:none] pointer-fine:cursor-grab data-[dragging=true]:cursor-grabbing data-[dragging=true]:select-none sm:-mx-8 sm:[--card-w:calc((100%_-_80px)_/_2_-_20px)] sm:[--edge:16px] sm:[--gap:16px] sm:[--gutter:32px] lg:-mx-6 lg:[--card-w:calc((100%_-_96px)_/_3)] lg:[--edge:0px] lg:[--gap:24px] lg:[--gutter:24px] [&::-webkit-scrollbar]:hidden"
        >
          <div aria-hidden="true" className="w-(--edge) shrink-0" />
          {properties.map((property, i) => (
            <div
              key={property.id}
              data-slide
              data-index={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${count}: ${property.title}`}
              onFocus={(event) => {
                if (event.target.matches(':focus-visible')) revealSlide(i)
              }}
              className="flex w-(--card-w) shrink-0 snap-start snap-always sm:snap-normal"
            >
              <PropertyCard property={property} className="w-full" />
            </div>
          ))}
          <div aria-hidden="true" className="w-(--edge) shrink-0" />
        </div>
      </Reveal>
    </div>
  )
}
