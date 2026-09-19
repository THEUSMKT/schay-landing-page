import { MapPin, Ruler, BedDouble } from 'lucide-react'
import PropertyMedia from './PropertyMedia'
import Cta from './Cta'
import { CATEGORIES } from '../data/properties'
import { buildWhatsAppLink } from '../data/site'

/**
 * Card de imóvel usado nas páginas de categoria (/apartamentos, /casas,
 * /terrenos-e-oportunidades): 1 foto de capa, título, localização,
 * metragem/quartos e um botão "Saiba mais" que abre o WhatsApp já com uma
 * mensagem mencionando o imóvel de interesse.
 */
export default function PropertyCard({ property, className = '' }) {
  const category = CATEGORIES[property.category]
  // Usa bairro (+ metragem, quando existir) em vez do título: o título é só
  // um nome comercial e pode se repetir entre imóveis, enquanto bairro (e
  // metragem, no caso de mais de um imóvel no mesmo bairro) é o que
  // realmente ajuda a corretora a identificar qual imóvel é.
  const areaSuffix = property.areaM2 ? ` de ${property.areaM2} m²` : ''
  const whatsappHref = buildWhatsAppLink(
    `Olá! Gostaria de saber mais informações sobre ${category.messageLabel}${areaSuffix} no bairro ${property.neighborhood}.`,
  )

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-navy-950/10 bg-paper-50 shadow-soft ${className}`}
    >
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

      <div className="flex flex-1 flex-col px-5 pt-7 pb-5">
        <h3 className="font-display text-xl font-semibold text-navy-950">{property.title}</h3>

        {property.priceLabel ? (
          <p className="mt-1 font-display text-lg font-semibold text-accent-600">
            {property.priceLabel}
          </p>
        ) : null}

        <div className="mt-3 flex items-start gap-2 text-sm text-navy-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
          <span>
            {property.neighborhood}
            <br />
            {property.city}
          </span>
        </div>

        <div className="my-4 h-px bg-navy-950/10" />

        <div className="flex items-center gap-5 text-sm text-navy-700">
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-accent-600" aria-hidden="true" />
            {property.areaM2 ? `${property.areaM2} m²` : 'Metragem a informar'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-accent-600" aria-hidden="true" />
            {property.bedroomsLabel}
          </span>
        </div>

        <Cta
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="amber"
          className="mt-6 w-full"
        >
          Saiba mais
        </Cta>
      </div>
    </article>
  )
}
