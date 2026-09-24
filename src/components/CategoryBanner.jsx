import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { SCENE_BY_KIND } from './illustrations'

/**
 * Banner de categoria da Vitrine (Home): imagem em destaque + selo da
 * categoria + título + CTA. O card inteiro é clicável e leva para a página
 * da categoria (/apartamentos, /casas, /terrenos-e-oportunidades) — não
 * representa mais um imóvel específico (sem m², quartos, bairro etc.).
 */
export default function CategoryBanner({ category, className = '' }) {
  const Scene = SCENE_BY_KIND[category.kind]

  return (
    <Link
      to={category.path}
      aria-label={`${category.ctaLabel} — ver imóveis desta categoria`}
      className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-navy-950/10 shadow-card transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        {category.bannerImage ? (
          // alt="" de propósito: o <h3> logo abaixo já mostra o mesmo texto
          // de bannerTitle visivelmente — repetir na alt duplicaria a
          // informação pra quem usa leitor de tela.
          <img
            src={category.bannerImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : Scene ? (
          <Scene className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        ) : null}
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/30 to-transparent" />

      <span className="absolute top-4 left-4 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-navy-950 shadow-soft">
        {category.tag}
      </span>

      <div className="relative flex flex-col gap-4 p-6">
        <h3 className="text-balance font-display text-2xl font-semibold text-white">
          {category.bannerTitle}
        </h3>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors duration-200 group-hover:bg-amber-400">
          {category.ctaLabel}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
