import { buildWhatsAppLink } from '../data/site'
import WhatsAppIcon from './icons/WhatsAppIcon'

/** Botão flutuante fixo no canto inferior direito, visível em todas as páginas. */
export default function WhatsAppButton() {
  const href = buildWhatsAppLink(
    'Olá! Vim pelo site da Schay Corretora e gostaria de falar sobre um imóvel.',
  )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-card transition-transform duration-200 hover:scale-105 sm:right-7 sm:bottom-7"
    >
      <span
        aria-hidden="true"
        className="animate-pulse-ring absolute inset-0 rounded-full bg-whatsapp"
      />
      <WhatsAppIcon className="relative h-7 w-7" />
      <span className="sr-only">Conversar no WhatsApp</span>
    </a>
  )
}
