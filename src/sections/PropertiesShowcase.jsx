import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import CategoryBanner from '../components/CategoryBanner'
import { CATEGORY_LIST } from '../data/properties'

export default function PropertiesShowcase() {
  return (
    <section id="imoveis" className="scroll-mt-24 bg-paper-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <SectionEyebrow tone="dark">Vitrine de imóveis</SectionEyebrow>
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="mt-4 max-w-lg font-display text-4xl font-semibold text-navy-950 sm:text-5xl"
            >
              Imagine sua vida
              <br />
              <em className="font-medium text-accent-600 italic">no próximo endereço.</em>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="max-w-xs text-sm text-navy-600 sm:text-right">
            Casas, apartamentos e terrenos para diferentes planos de vida.
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_LIST.map((category, index) => (
            <Reveal key={category.slug} delay={index * 0.1}>
              <CategoryBanner category={category} className="h-full" />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 text-center font-display text-sm text-navy-500 italic">
            Fotos representativas de cada categoria — consulte os imóveis disponíveis com a
            Schay.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
