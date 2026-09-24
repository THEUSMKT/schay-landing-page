import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import PropertyCard from '../components/PropertyCard'
import EmptyCategoryState from '../components/EmptyCategoryState'
import { CATEGORIES, CATEGORY_LIST, PROPERTIES } from '../data/properties'
import { buildWhatsAppLink } from '../data/site'

const PRICE_BANDS = [
  { value: '', label: 'Qualquer faixa de preço', min: 0, max: Infinity },
  { value: 'ate-300', label: 'Até R$ 300 mil', min: 0, max: 300000 },
  { value: '300-600', label: 'R$ 300 mil a R$ 600 mil', min: 300000, max: 600000 },
  { value: 'acima-600', label: 'Acima de R$ 600 mil', min: 600000, max: Infinity },
]

const REAL_PROPERTIES = PROPERTIES.filter((property) => !property.isExample)

const selectClass =
  'w-full appearance-none rounded-xl border border-navy-950/15 bg-paper-50 px-4 py-3 pr-10 text-sm text-navy-900 outline-none transition-colors duration-200 focus:border-accent-600'

/**
 * Busca orientada por tipo + localização + faixa de preço (opcional), sem
 * cadastro. Filtra só entre imóveis reais (PROPERTIES já vem sem
 * fictícios — ver política de dados em src/data/properties.js). Antes de
 * qualquer filtro ser tocado, não mostra resultado nenhum (essa seção é uma
 * ferramenta de busca, não mais uma vitrine — a vitrine geral vem logo
 * abaixo). Sem resultado real pro filtro escolhido, oferece atendimento
 * pelo WhatsApp já com as preferências preenchidas na mensagem.
 */
export default function PropertySearch() {
  const [type, setType] = useState('')
  const [location, setLocation] = useState('')
  const [priceBand, setPriceBand] = useState('')
  const [touched, setTouched] = useState(false)

  const band = PRICE_BANDS.find((option) => option.value === priceBand) || PRICE_BANDS[0]

  const results = useMemo(() => {
    if (!touched) return null
    const locationQuery = location.trim().toLowerCase()

    return REAL_PROPERTIES.filter((property) => {
      if (type && property.category !== type) return false
      if (locationQuery) {
        const haystack = `${property.neighborhood} ${property.city}`.toLowerCase()
        if (!haystack.includes(locationQuery)) return false
      }
      if (property.price != null && (property.price < band.min || property.price > band.max)) {
        return false
      }
      return true
    })
  }, [type, location, band, touched])

  const whatsappHref = buildWhatsAppLink(
    [
      'Olá! Estou procurando um imóvel com este perfil:',
      `Tipo: ${type ? CATEGORIES[type].navLabel : 'qualquer tipo'}`,
      location.trim() ? `Localização: ${location.trim()}` : null,
      priceBand ? `Faixa de preço: ${band.label}` : null,
      'Pode me ajudar a encontrar algo assim?',
    ]
      .filter(Boolean)
      .join('\n'),
  )

  return (
    <section className="bg-paper-50 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="flex justify-center">
          <SectionEyebrow tone="dark">Encontre seu próximo endereço</SectionEyebrow>
        </Reveal>
        <Reveal
          as="h2"
          delay={0.08}
          className="mt-4 text-center font-display text-3xl font-semibold text-navy-950 sm:text-4xl"
        >
          O que você está buscando?
        </Reveal>

        <Reveal
          delay={0.16}
          className="mt-10 rounded-3xl border border-navy-950/10 bg-white p-5 shadow-card sm:p-7"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-navy-800">Tipo de imóvel</span>
              <div className="relative">
                <select
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value)
                    setTouched(true)
                  }}
                  className={selectClass}
                >
                  <option value="">Qualquer tipo</option>
                  {CATEGORY_LIST.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.navLabel}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-navy-400"
                  aria-hidden="true"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-navy-800">Cidade ou bairro</span>
              <input
                type="text"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value)
                  setTouched(true)
                }}
                placeholder="Ex: São Leopoldo, Campestre..."
                className="w-full rounded-xl border border-navy-950/15 bg-paper-50 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 outline-none transition-colors duration-200 focus:border-accent-600"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-navy-800">Faixa de preço (opcional)</span>
              <div className="relative">
                <select
                  value={priceBand}
                  onChange={(event) => {
                    setPriceBand(event.target.value)
                    setTouched(true)
                  }}
                  className={selectClass}
                >
                  {PRICE_BANDS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-navy-400"
                  aria-hidden="true"
                />
              </div>
            </label>
          </div>

          {results === null ? (
            <p className="mt-6 text-center text-sm text-navy-500">
              Ajuste os filtros acima para ver imóveis reais disponíveis com esse perfil.
            </p>
          ) : results.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
              {results.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="mt-8" aria-live="polite">
              <EmptyCategoryState
                category={{ navLabel: type ? CATEGORIES[type].navLabel : 'imóveis' }}
                whatsappHrefOverride={whatsappHref}
              />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
