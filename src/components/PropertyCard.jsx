import {
  MapPin,
  Ruler,
  BedDouble,
  DoorOpen,
  Bath,
  Car,
  MoveHorizontal,
  MoveVertical,
} from 'lucide-react'
import PropertyMedia from './PropertyMedia'
import Cta from './Cta'
import { CATEGORIES } from '../data/properties'
import { buildWhatsAppLink } from '../data/site'

/**
 * Card de imóvel usado nas páginas de categoria (/apartamentos, /casas,
 * /terrenos-e-oportunidades) e na busca da Home: 1 foto de capa, título,
 * localização, características e um botão "Saiba mais" que abre o WhatsApp
 * já com uma mensagem identificando o imóvel.
 */
// 'lot' = só a área do terreno; 'built' = área construída/privativa;
// ausente/null = tipo não confirmado no anúncio original (nunca presumir).
const AREA_TYPE_LABEL = {
  lot: 'terreno',
  built: 'construída',
}

const formatM2 = (value) => `${value.toLocaleString('pt-BR')} m²`
const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`

// Características dos imóveis que usam os campos opcionais (areas, bedrooms,
// rooms, frontM...) — só entra o que foi informado no cadastro. Metragens
// ocupam a linha inteira; contagens/medidas curtas dividem a mesma linha.
function buildSpecs(property) {
  const specs = (property.areas || []).map((area) => ({
    Icon: Ruler,
    label: `${area.label}: ${formatM2(area.m2)}`,
    fullRow: true,
  }))
  if (property.frontM != null) {
    specs.push({ Icon: MoveHorizontal, label: `Frente: ${property.frontM} m` })
  }
  if (property.backM != null) {
    specs.push({ Icon: MoveVertical, label: `Fundos: ${property.backM} m` })
  }
  if (property.bedrooms != null) {
    const suites = property.suites ? `, sendo ${plural(property.suites, 'suíte', 'suítes')}` : ''
    specs.push({ Icon: BedDouble, label: `${plural(property.bedrooms, 'quarto', 'quartos')}${suites}` })
  }
  if (property.rooms != null) {
    specs.push({ Icon: DoorOpen, label: plural(property.rooms, 'sala', 'salas') })
  }
  if (property.bathrooms != null) {
    specs.push({ Icon: Bath, label: plural(property.bathrooms, 'banheiro', 'banheiros') })
  }
  if (property.parkingSpaces != null) {
    specs.push({ Icon: Car, label: plural(property.parkingSpaces, 'vaga', 'vagas') })
  }
  return specs
}

export default function PropertyCard({ property, className = '' }) {
  const category = CATEGORIES[property.category]
  const typeLabel = property.typeLabel || category.tag
  // Tipo + bairro + cidade (+ preço, quando existir): o suficiente pra
  // corretora identificar o imóvel sem ambiguidade, com mensagem curta.
  // Por pedido da Schay, os imóveis não têm código exibido em lugar nenhum.
  const citySuffix = property.city ? `, em ${property.city}` : ''
  const priceSuffix = property.priceLabel ? `, no valor de ${property.priceLabel}` : ''
  const whatsappHref = buildWhatsAppLink(
    `Olá! Gostaria de saber mais informações sobre este imóvel: ${typeLabel} no bairro ${property.neighborhood}${citySuffix}${priceSuffix}.`,
  )
  // Cards de casas cadastrados no formato original (areaM2 + bedroomsLabel)
  // mantêm exatamente a apresentação de antes.
  const isLegacyHouse = property.bedroomsLabel !== undefined
  const areaLabel = property.areaM2
    ? `${property.areaM2} m² (${AREA_TYPE_LABEL[property.areaType] || 'tipo a confirmar'})`
    : 'Metragem a informar'

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-navy-950/10 bg-paper-50 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card ${className}`}
    >
      <div className="relative">
        <div className="relative aspect-[4/3]">
          <PropertyMedia image={property.image} className="absolute inset-0 h-full w-full" />
        </div>
        <span className="absolute -bottom-3 left-4 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-navy-950 shadow-soft">
          {typeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-7 pb-5">
        <h3 className="font-display text-xl font-semibold text-balance text-navy-950">{property.title}</h3>

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

        {isLegacyHouse ? (
          <div className="flex items-center gap-5 text-sm text-navy-700">
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="h-4 w-4 text-accent-600" aria-hidden="true" />
              {areaLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-accent-600" aria-hidden="true" />
              {property.bedroomsLabel}
            </span>
          </div>
        ) : (
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-navy-700">
            {buildSpecs(property).map(({ Icon, label, fullRow }) => (
              <li
                key={label}
                className={`inline-flex items-center gap-1.5 ${fullRow ? 'w-full' : ''}`}
              >
                <Icon className="h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
          <Cta
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="amber"
            className="w-full"
            aria-label={`Saiba mais pelo WhatsApp sobre ${property.title}`}
            data-fab-avoid
          >
            Saiba mais
          </Cta>
        </div>
      </div>
    </article>
  )
}
