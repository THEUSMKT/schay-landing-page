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
  // ID do formulário no Formspree (formspree.io), usado pelo formulário de
  // contato do site para enviar os leads direto pro e-mail acima, sem
  // depender de app de e-mail no aparelho do visitante. Pra gerar o seu:
  //   1. Crie uma conta grátis em https://formspree.io
  //   2. Crie um novo formulário com destino schaycardoso29@gmail.com
  //   3. Confirme o e-mail de verificação que o Formspree manda pra essa
  //      caixa (sem isso o formulário fica bloqueado)
  //   4. Copie o ID mostrado no painel (a parte final da URL do tipo
  //      https://formspree.io/f/xxxxyyyy — o ID é "xxxxyyyy") e troque o
  //      valor abaixo por ele.
  // Enquanto o valor abaixo não for trocado, o formulário mostra
  // automaticamente a mensagem de erro com alternativa por WhatsApp.
  formspreeFormId: 'TROQUE_PELO_SEU_FORM_ID',
}

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
