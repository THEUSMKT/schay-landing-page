/**
 * Dados institucionais e de contato — fonte única usada no Header, Footer,
 * Hero, formulário e botão flutuante do WhatsApp.
 */
export const SITE = {
  name: 'Schay Corretora',
  creci: '83.933F',
  city: 'São Leopoldo',
  state: 'RS',
  region: 'São Leopoldo e região',
  whatsappDisplay: '(51) 99278-9076',
  // Formato internacional sem símbolos, para uso em links wa.me
  whatsappNumber: '5551992789076',
  email: 'schaycardoso29@gmail.com',
}

// Página da política de privacidade (rodapé, questionário, aviso de cookies).
export const PRIVACY_PATH = '/politica-de-privacidade'

export const NAV_LINKS = [
  { label: 'Como funciona', href: '/#como-funciona' },
  { label: 'Imóveis', href: '/#imoveis' },
  { label: 'Histórias reais', href: '/#historias-reais' },
  { label: 'Contato', href: '/#contato' },
]

export function buildWhatsAppLink(message) {
  const base = `https://wa.me/${SITE.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
