import { Link } from 'react-router-dom'
import { SITE } from '../data/site'

/**
 * Monograma "SC" + wordmark "SCHAY / CORRETORA", usado no Header e no Footer.
 * `tone="light"` é para uso sobre fundo escuro (padrão); `tone="onDark"` existe
 * só por clareza semântica — hoje o site é majoritariamente escuro, então os
 * dois tons usam a mesma paleta, mas o prop fica pronto caso uma seção clara
 * precise de uma variante futura.
 */
export default function Logo({ className = '', linkToHome = true }) {
  const content = (
    <span className={`group inline-flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-navy-800/80 font-display text-lg leading-none text-amber-400"
      >
        <span className="relative -mr-1.5">S</span>
        <span className="relative translate-y-1 text-sm text-accent-300">C</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-wide text-white">
          SCHAY
        </span>
        <span className="mt-1 text-[10px] font-semibold tracking-[0.3em] text-white/55">
          CORRETORA
        </span>
      </span>
    </span>
  )

  if (!linkToHome) return content

  return (
    <Link
      to="/"
      aria-label={`${SITE.name} — página inicial`}
      className="inline-flex rounded-lg opacity-100 transition-opacity duration-200 hover:opacity-80"
    >
      {content}
    </Link>
  )
}
