import { Navigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import PropertyCard from '../components/PropertyCard'
import EmptyCategoryState from '../components/EmptyCategoryState'
import SectionFade from '../components/SectionFade'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { CATEGORIES, getPropertiesByCategory } from '../data/properties'

/**
 * Página de listagem de uma categoria (/apartamentos, /casas,
 * /terrenos-e-oportunidades). Gera tudo a partir de src/data/properties.js —
 * nenhum imóvel fica "hardcoded" direto no JSX. Categoria sem nenhum imóvel
 * real mostra EmptyCategoryState em vez de cards fictícios.
 */
export default function CategoryPage({ categorySlug }) {
  const category = CATEGORIES[categorySlug]
  const properties = getPropertiesByCategory(categorySlug)

  useDocumentTitle(
    category ? `${category.pageTitle} | Schay Corretora` : 'Schay Corretora',
  )

  if (!category) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <section className="bg-linear-to-b from-paper-200 from-55% to-paper-100 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal mode="mount">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-navy-600 transition-colors duration-200 hover:text-accent-600"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar para a página inicial
            </Link>
          </Reveal>

          <Reveal mode="mount" delay={0.08} className="mt-6">
            <SectionEyebrow tone="dark">{category.heroKicker}</SectionEyebrow>
          </Reveal>

          <Reveal
            as="h1"
            mode="mount"
            delay={0.14}
            className="mt-4 max-w-2xl font-display text-4xl font-semibold text-balance text-navy-950 sm:text-5xl"
          >
            {category.pageTitle}
          </Reveal>

          <Reveal mode="mount" delay={0.2} className="mt-4 max-w-xl text-navy-600">
            {category.pageIntro}
          </Reveal>
        </div>
      </section>

      <section className="bg-paper-100 pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {properties.length > 0 ? (
            <>
              {/* h2 entre o h1 da página e os h3 dos cards — sem isso a
                  hierarquia de headings pulava de h1 direto pra h3. */}
              <Reveal mode="mount" as="h2" className="font-display text-2xl font-semibold text-navy-950">
                Imóveis confirmados
              </Reveal>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((property, index) => (
                  // Atraso relativo à posição na linha (3 colunas no desktop):
                  // no celular cada card entra sozinho, sem esperar pelos
                  // anteriores da lista.
                  <Reveal key={property.id} delay={(index % 3) * 0.08}>
                    <PropertyCard property={property} className="h-full" />
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <Reveal mode="mount">
              <EmptyCategoryState category={category} />
            </Reveal>
          )}
        </div>
      </section>

      <SectionFade variant="paper-to-navy" className="h-20 sm:h-28 lg:h-32" />
    </>
  )
}
