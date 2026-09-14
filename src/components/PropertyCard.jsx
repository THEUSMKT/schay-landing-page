import { Link } from 'react-router-dom'
import { MapPin, Ruler, BedDouble, ArrowUpRight } from 'lucide-react'
import PropertyMedia from './PropertyMedia'
import Cta from './Cta'
import { CATEGORIES } from '../data/properties'

/**
 * Card de imóvel, em duas variantes:
 *
 * - "teaser" (Home / vitrine): o card inteiro é clicável e leva para a
 *   página da categoria (/apartamentos, /casas, /terrenos-e-oportunidades).
 * - "listing" (páginas de categoria): card estático; só o botão
 *   "Solicitar atendimento" é clicável e leva ao formulário de contato.
 */
export default function PropertyCard({ property, variant = 'listing', className = '' }) {
  const category = CATEGORIES[property.category]

  const media = (
    <div className="relative">
      <div className="relative aspect-[4/3]">
        <PropertyMedia image={property.image} className="absolute inset-0 h-full w-full" />
        {property.isExample ? (
          <span className="absolute top-3 left-3 rounded-full bg-navy-950/70 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-sm">
            Imóvel de exemplo
          </span>
        ) : null}
      </div>
      <span className="absolute -bottom-3 left-4 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-navy-950 shadow-soft">
        {category.tag}
      </span>
    </div>
  )

  const body = (
    <div className="flex flex-1 flex-col px-5 pt-7 pb-5">
      <h3 className="font-display text-xl font-semibold text-white">{property.title}</h3>

      <div className="mt-3 flex items-start gap-2 text-sm text-white/60">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
        <span>
          {property.neighborhood}
          <br />
          {property.city}
        </span>
      </div>

      <div className="my-4 h-px bg-white/10" />

      <div className="flex items-center gap-5 text-sm text-white/70">
        <span className="inline-flex items-center gap-1.5">
          <Ruler className="h-4 w-4 text-accent-400" aria-hidden="true" />
          {property.areaM2} m²
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BedDouble className="h-4 w-4 text-accent-400" aria-hidden="true" />
          {property.bedroomsLabel}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-white/45">{property.priceLabel}</span>

        {variant === 'teaser' ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors duration-200 group-hover:bg-amber-400">
            {category.ctaLabel}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : (
          <Cta to="/#contato" variant="amber" className="px-5 py-2.5">
            Solicitar atendimento
          </Cta>
        )}
      </div>
    </div>
  )

  const cardClass = `flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-800/70 ${className}`

  if (variant === 'teaser') {
    return (
      <Link
        to={category.path}
        aria-label={`${category.ctaLabel} — ver imóveis desta categoria`}
        className={`group ${cardClass} transition-all duration-300 hover:-translate-y-1 hover:border-white/25`}
      >
        {media}
        {body}
      </Link>
    )
  }

  return (
    <article className={cardClass}>
      {media}
      {body}
    </article>
  )
}
