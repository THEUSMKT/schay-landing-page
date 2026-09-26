import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CategoryBanner from './CategoryBanner'
import useDragScroll from '../hooks/useDragScroll'

// Soltou arrastando rápido (px/ms): vai pro card seguinte na direção do
// gesto mesmo sem ter passado da metade do caminho.
const FLICK_VELOCITY = 0.35
const SNAP_TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
// Amortecimento acima do crítico: suaviza escala/opacidade sem "quique" e
// sem atraso perceptível em relação ao arraste (~60ms).
const DEPTH_SPRING = { stiffness: 700, damping: 50, mass: 0.5 }

const clampIndex = (i, count) => Math.max(0, Math.min(count - 1, i))

function Slide({ index, count, label, position, reduceMotion, onKeyboardFocus, children }) {
  // 0 = card no centro; 1 = um card (ou mais) para o lado.
  const distance = useTransform(position, (p) => Math.min(Math.abs(index - p), 1))
  const depth = useSpring(distance, DEPTH_SPRING)
  const scale = useTransform(depth, [0, 1], [1, 0.94])
  const opacity = useTransform(depth, [0, 1], [1, 0.78])
  const shadowOpacity = useTransform(depth, [0, 1], [1, 0.2])

  return (
    <div
      data-slide
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} de ${count}: ${label}`}
      onFocus={(event) => {
        if (event.target.matches(':focus-visible')) onKeyboardFocus(index)
      }}
      className="w-(--card-w) shrink-0 snap-center snap-always"
    >
      <motion.div
        style={reduceMotion ? undefined : { scale, opacity }}
        className="relative will-change-transform"
      >
        {/* Sombra forte numa camada de composição própria (will-change:
            opacity): animar só a opacidade dela não obriga o navegador a
            repintar a foto nem o desfoque da sombra a cada quadro. Marcada no
            card central, quase some nos laterais. Alcance de 40px pra baixo —
            cabe inteira no pb-12 da faixa, que corta (overflow) o resto. */}
        <motion.div
          aria-hidden="true"
          style={reduceMotion ? undefined : { opacity: shadowOpacity }}
          className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_22px_36px_-18px_rgb(4_10_22/0.6)] will-change-[opacity]"
        />
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Carrossel horizontal das categorias da Vitrine. A rolagem é a nativa do
 * navegador com scroll-snap (toque/trackpad fluidos, sem reimplementar
 * física); por cima disso: arraste com o mouse 1:1 que encaixa com easing
 * ao soltar, profundidade (escala/opacidade/sombra) calculada a cada quadro
 * pela posição de rolagem, dots e setas clicáveis e setas do teclado.
 */
export default function CategoryCarousel({ categories }) {
  const count = categories.length
  const reduceMotion = useReducedMotion()
  const trackRef = useRef(null)
  const stepRef = useRef(0)
  const activeRef = useRef(0)
  const targetRef = useRef(0)
  const animationRef = useRef(null)
  const [active, setActive] = useState(0)

  // scrollLeft direto num MotionValue (em vez de useScroll, que a cada
  // evento também mede tamanho do contêiner/conteúdo): menos trabalho por
  // quadro durante o arraste em celular mais fraco.
  const scrollX = useMotionValue(0)
  const step = useMotionValue(1)
  // Posição contínua em "unidades de card": 0 = primeiro card no centro,
  // 1.5 = no meio do caminho entre o segundo e o terceiro...
  const position = useTransform([scrollX, step], ([x, s]) => x / s)

  useMotionValueEvent(position, 'change', (p) => {
    const i = clampIndex(Math.round(p), count)
    if (i !== activeRef.current) {
      activeRef.current = i
      setActive(i)
    }
  })

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
      const target = clampIndex(index, count)
      if (animationRef.current && targetRef.current === target) return
      targetRef.current = target
      animationRef.current?.stop()
      const to = target * stepPx

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
        ...SNAP_TRANSITION,
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

  // Distância entre os centros de dois cards (muda por breakpoint) e
  // recentraliza o card ativo quando a largura muda.
  useLayoutEffect(() => {
    const el = trackRef.current
    const measure = () => {
      const slides = el.querySelectorAll('[data-slide]')
      if (slides.length < 2) return
      // getBoundingClientRect (fracionário), não offsetLeft (inteiro): com
      // larguras em % o passo real é tipo 784,32px, e arredondar faria o
      // último card parar 1px antes do ponto de encaixe do navegador.
      const stepPx = slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left
      if (stepPx <= 0) return
      stepRef.current = stepPx
      step.set(stepPx)
      if (!animationRef.current && !isDragging()) el.scrollLeft = activeRef.current * stepPx
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [step, isDragging])

  // Posição de rolagem -> MotionValue; e qualquer interação direta (toque,
  // roda, trackpad) interrompe uma animação de navegação em andamento — a
  // pessoa sempre tem o controle.
  useEffect(() => {
    const el = trackRef.current
    const onScroll = () => scrollX.set(el.scrollLeft)
    const interrupt = () => {
      if (animationRef.current) stopAnimation()
    }
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('touchstart', interrupt, { passive: true })
    el.addEventListener('wheel', interrupt, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('touchstart', interrupt)
      el.removeEventListener('wheel', interrupt)
    }
  }, [scrollX, stopAnimation])

  const currentIndex = () => (animationRef.current ? targetRef.current : activeRef.current)

  // --- Teclado -------------------------------------------------------------
  const onKeyDown = (event) => {
    const moves = { ArrowRight: 1, ArrowLeft: -1 }
    let target
    if (event.key in moves) target = currentIndex() + moves[event.key]
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = count - 1
    else return
    event.preventDefault()
    target = clampIndex(target, count)
    scrollToIndex(target)
    // Se o foco estava num card, ele acompanha o card que veio pro centro.
    if (event.target !== trackRef.current) {
      trackRef.current.querySelectorAll('[data-slide] a')[target]?.focus({ preventScroll: true })
    }
  }

  const arrowClass = (enabled) =>
    `absolute top-[calc(50%_-_18px)] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy-950 shadow-soft ring-1 ring-navy-950/10 transition-opacity duration-200 hover:bg-white lg:flex ${
      enabled ? 'opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100' : 'pointer-events-none opacity-0'
    }`

  // Grupo nomeado (group/carousel): o card usa `group` sem nome pros
  // próprios efeitos de hover, e um grupo sem nome aqui faria o hover em
  // qualquer ponto do carrossel acender todos os cards de uma vez.
  // As variáveis de tamanho ficam no contêiner (e não na faixa) porque o
  // anel de foco, irmão da faixa, também usa a largura do card.
  return (
    <div className="group/carousel relative mx-auto max-w-6xl [--card-w:80%] [--gap:12px] sm:[--card-w:62%] sm:[--gap:20px] lg:[--card-w:66%] lg:[--gap:24px]">
      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Categorias de imóveis — use as setas para navegar"
        data-dragging={dragging}
        {...dragHandlers}
        onKeyDown={onKeyDown}
        className="peer/track relative flex snap-x snap-mandatory gap-(--gap) overflow-x-auto overscroll-x-contain pt-3 pb-12 select-none [scrollbar-width:none] focus-visible:outline-none pointer-fine:cursor-grab data-[dragging=true]:cursor-grabbing lg:[mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] [&::-webkit-scrollbar]:hidden"
      >
        {/* Espaçadores: permitem centralizar também o primeiro e o último card. */}
        <div aria-hidden="true" className="w-[calc((100%_-_var(--card-w))_/_2_-_var(--gap))] shrink-0" />
        {categories.map((category, index) => (
          <Slide
            key={category.slug}
            index={index}
            count={count}
            label={category.navLabel}
            position={position}
            reduceMotion={reduceMotion}
            onKeyboardFocus={scrollToIndex}
          >
            <CategoryBanner
              category={category}
              className="relative aspect-4/5 shadow-soft sm:aspect-4/3 lg:aspect-3/2"
            />
          </Slide>
        ))}
        <div aria-hidden="true" className="w-[calc((100%_-_var(--card-w))_/_2_-_var(--gap))] shrink-0" />
      </div>

      {/* Anel de foco do teclado. O contorno da própria faixa sumia no
          desktop — a máscara do degradê das bordas recorta tudo o que fica
          fora da caixa dela —, então ele é desenhado aqui fora, em volta do
          card central, no mesmo estilo do foco do resto do site. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-3 mx-auto hidden aspect-4/5 w-(--card-w) rounded-2xl outline-2 outline-offset-3 outline-accent-400 peer-focus-visible/track:block sm:aspect-4/3 lg:aspect-3/2"
      />

      <button
        type="button"
        aria-label="Categoria anterior"
        aria-disabled={active === 0}
        tabIndex={active === 0 ? -1 : 0}
        onClick={() => scrollToIndex(currentIndex() - 1)}
        className={`left-6 ${arrowClass(active > 0)}`}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Próxima categoria"
        aria-disabled={active === count - 1}
        tabIndex={active === count - 1 ? -1 : 0}
        onClick={() => scrollToIndex(currentIndex() + 1)}
        className={`right-6 ${arrowClass(active < count - 1)}`}
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* A linha dos dots fica sobre o rodapé da faixa: só os botões recebem
          o ponteiro, o resto deixa o arraste começar ali também. */}
      <div className="pointer-events-none relative -mt-8 flex justify-center gap-1">
        {categories.map((category, index) => (
          <button
            key={category.slug}
            type="button"
            aria-label={`Ver ${category.navLabel}`}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => scrollToIndex(index)}
            className="group/dot pointer-events-auto flex h-8 w-8 items-center justify-center"
          >
            <span
              className={`block h-2.5 rounded-full transition-all duration-300 ${
                index === active
                  ? 'w-7 bg-accent-600'
                  : 'w-2.5 border-[1.5px] border-navy-950/30 group-hover/dot:border-navy-950/60'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
