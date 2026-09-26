import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { buildWhatsAppLink } from '../data/site'
import WhatsAppIcon from './icons/WhatsAppIcon'

// Abaixo desse scroll, o botão fica escondido: no Hero da Home (a única
// seção alta o bastante pra chegar perto dele em telas pequenas) já existe
// um CTA de WhatsApp próprio ("Quero vender meu imóvel"), e o botão
// flutuante sobrepunha esse botão em telas estreitas. Em outras páginas
// (sem hero tão alto) ele aparece quase de imediato ao rolar.
const SHOW_AFTER_SCROLL_PX = 480

// Controles que o botão nunca encobre — setas e contador do carrossel de
// imóveis, "Saiba mais" dos cards (que já abrem o WhatsApp do imóvel):
// enquanto algum deles passa por baixo do botão, ele sai de cena e volta
// assim que o canto fica livre. Dentro de uma faixa com rolagem lateral
// ([data-fab-clip]) só conta a parte visível do elemento.
const AVOID_SELECTOR = '[data-fab-avoid]'
const AVOID_MARGIN_PX = 8

const POSITION = 'fixed right-5 bottom-5 h-14 w-14 sm:right-7 sm:bottom-7'

function visibleRect(el) {
  const rect = el.getBoundingClientRect()
  if (!rect.width || !rect.height) return null
  const clip = el.closest('[data-fab-clip]')?.getBoundingClientRect()
  if (!clip) return rect
  const left = Math.max(rect.left, clip.left)
  const right = Math.min(rect.right, clip.right)
  const top = Math.max(rect.top, clip.top)
  const bottom = Math.min(rect.bottom, clip.bottom)
  return right > left && bottom > top ? { left, right, top, bottom } : null
}

function overlaps(a, b, margin) {
  return (
    a.left < b.right + margin &&
    a.right > b.left - margin &&
    a.top < b.bottom + margin &&
    a.bottom > b.top - margin
  )
}

/** Botão flutuante fixo no canto inferior direito, visível em todas as páginas. */
export default function WhatsAppButton() {
  const [scrolledPast, setScrolledPast] = useState(false)
  const [covering, setCovering] = useState(false)
  const zoneRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const href = buildWhatsAppLink(
    'Olá! Vim pelo site da Schay Corretora e gostaria de falar sobre um imóvel.',
  )

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setScrolledPast(window.scrollY > SHOW_AFTER_SCROLL_PX)
      const zone = zoneRef.current.getBoundingClientRect()
      const hit = [...document.querySelectorAll(AVOID_SELECTOR)].some((el) => {
        const rect = visibleRect(el)
        return rect !== null && overlaps(rect, zone, AVOID_MARGIN_PX)
      })
      setCovering(hit)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    // capture: pega também a rolagem lateral dos carrosséis — rolagem de
    // elemento não borbulha até a janela.
    document.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('scroll', schedule, { capture: true })
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <>
      {/* Onde o botão fica (mesmo lugar e tamanho), sempre montado: dá pra
          medir se algo passa por baixo mesmo com o botão escondido. */}
      <div ref={zoneRef} aria-hidden="true" className={`pointer-events-none invisible ${POSITION}`} />
      <AnimatePresence>
        {scrolledPast && !covering ? (
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`z-50 flex items-center justify-center rounded-full bg-whatsapp text-white shadow-card transition-transform duration-200 hover:scale-105 focus-visible:scale-105 ${POSITION}`}
          >
            <WhatsAppIcon className="relative h-7 w-7" />
            <span className="sr-only">Conversar no WhatsApp</span>
          </motion.a>
        ) : null}
      </AnimatePresence>
    </>
  )
}
