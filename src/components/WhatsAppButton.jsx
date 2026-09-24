import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { buildWhatsAppLink } from '../data/site'
import WhatsAppIcon from './icons/WhatsAppIcon'

// Abaixo desse scroll, o botão fica escondido: no Hero da Home (a única
// seção alta o bastante pra chegar perto dele em telas pequenas) já existe
// um CTA de WhatsApp próprio ("Quero vender meu imóvel"), e o botão
// flutuante sobrepunha esse botão em telas estreitas. Em outras páginas
// (sem hero tão alto) ele aparece quase de imediato ao rolar.
const SHOW_AFTER_SCROLL_PX = 480

/** Botão flutuante fixo no canto inferior direito, visível em todas as páginas. */
export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false)
  const reduceMotion = useReducedMotion()
  const href = buildWhatsAppLink(
    'Olá! Vim pelo site da Schay Corretora e gostaria de falar sobre um imóvel.',
  )

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_PX)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-card transition-transform duration-200 hover:scale-105 focus-visible:scale-105 sm:right-7 sm:bottom-7"
        >
          <WhatsAppIcon className="relative h-7 w-7" />
          <span className="sr-only">Conversar no WhatsApp</span>
        </motion.a>
      ) : null}
    </AnimatePresence>
  )
}
