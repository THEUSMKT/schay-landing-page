/**
 * true quando esta página foi carregada a partir do HTML gerado por
 * scripts/prerender.mjs (o script marca <html data-prerendered="true">
 * antes de salvar o snapshot). Nesse caso o conteúdo já chegou visível no
 * HTML puro — Reveal.jsx e Hero.jsx usam isso pra pular a animação de
 * entrada no primeiro mount do React, em vez de esconder (opacity:0) e
 * reanimar algo que o visitante já está vendo. Ver o comentário no topo de
 * scripts/prerender.mjs pro porquê disso importar pro LCP.
 */
export function isPrerendered() {
  return typeof document !== 'undefined' && document.documentElement.hasAttribute('data-prerendered')
}
