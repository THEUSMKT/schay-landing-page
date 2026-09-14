import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import PropertyCard from '../components/PropertyCard'
import { getFeaturedProperties } from '../data/properties'

export default function PropertiesShowcase() {
  const featured = getFeaturedProperties()

  return (
    <section id="imoveis" className="bg-navy-900 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <SectionEyebrow>Vitrine de imóveis</SectionEyebrow>
            </Reveal>
            <Reveal as="h2" delay={0.08} className="mt-4 max-w-lg font-display text-4xl font-semibold text-white sm:text-5xl">
              Imagine sua vida
              <br />
              <em className="font-medium text-accent-400 italic">no próximo endereço.</em>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="max-w-xs text-sm text-white/60 sm:text-right">
            Casas, apartamentos e terrenos para diferentes planos de vida.
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property, index) => (
            <Reveal key={property.id} delay={index * 0.1}>
              <PropertyCard property={property} variant="teaser" className="h-full" />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 text-center font-display text-sm text-white/40 italic">
            Vitrine de exemplo: fotos e características ilustrativas. Consulte os imóveis
            disponíveis com a Schay.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
