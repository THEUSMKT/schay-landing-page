/**
 * Faixa de transição entre duas seções de fundos muito diferentes: troca o
 * corte seco por um gradiente suavizado (classes .fade-* em index.css).
 * Puramente decorativa e sempre ENTRE as seções — nunca por cima de título,
 * foto ou botão. A altura vem por className, pra cada passagem ter a
 * intensidade que o contraste do par de cores pede.
 */
export default function SectionFade({ variant, className = '' }) {
  return <div aria-hidden="true" className={`fade-${variant} ${className}`} />
}
