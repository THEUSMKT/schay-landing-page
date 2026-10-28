import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import CategoryCarousel from '../components/CategoryCarousel'
import { CATEGORY_LIST } from '../data/properties'

export default function PropertiesShowcase() {
  return (
    <section
      id="imoveis"
      className="scroll-mt-24 bg-linear-to-b from-paper-100 from-70% to-paper-50 py-20 sm:py-28"
    >
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
      </div>

      {/* Fora do contêiner com padding: no celular e no tablet a faixa vai
          de borda a borda da tela, pra "espiada" do próximo card chegar até
          a beira. Ordem: Apartamentos → Casas → Terrenos e oportunidades. */}
      <Reveal delay={0.12} className="mt-8 sm:mt-10">
        <CategoryCarousel categories={CATEGORY_LIST} />
      </Reveal>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal delay={0.2}>
          <p className="mt-6 text-center font-display text-sm text-navy-500 italic">
            Fotos representativas de cada categoria — consulte os imóveis disponíveis com a
            Schay.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
