import { Navigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import PropertyCard from '../components/PropertyCard'
import { CATEGORIES, getPropertiesByCategory } from '../data/properties'

/**
 * Página de listagem de uma categoria (/apartamentos, /casas,
 * /terrenos-e-oportunidades). Gera tudo a partir de src/data/properties.js —
 * nenhum imóvel fica "hardcoded" direto no JSX.
 */
export default function CategoryPage({ categorySlug }) {
  const category = CATEGORIES[categorySlug]
  const properties = getPropertiesByCategory(categorySlug)

  if (!category) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <section className="border-b border-white/10 bg-navy-900 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal mode="mount">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors duration-200 hover:text-accent-300"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar para a página inicial
            </Link>
          </Reveal>

          <Reveal mode="mount" delay={0.08} className="mt-6">
            <SectionEyebrow>{category.heroKicker}</SectionEyebrow>
          </Reveal>

          <Reveal
            as="h1"
            mode="mount"
            delay={0.14}
            className="mt-4 max-w-2xl font-display text-4xl font-semibold text-balance text-white sm:text-5xl"
          >
            {category.pageTitle}
          </Reveal>

          <Reveal mode="mount" delay={0.2} className="mt-4 max-w-xl text-white/60">
            {category.pageIntro}
          </Reveal>
        </div>
      </section>

      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, index) => (
              <Reveal key={property.id} delay={index * 0.1}>
                <PropertyCard property={property} variant="listing" className="h-full" />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-10 text-center font-display text-sm text-white/40 italic">
              Vitrine de exemplo: fotos e características ilustrativas. Consulte os imóveis
              disponíveis com a Schay.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
