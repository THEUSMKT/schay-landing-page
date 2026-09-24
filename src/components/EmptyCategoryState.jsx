import { SearchX } from 'lucide-react'
import Cta from './Cta'
import { buildWhatsAppLink } from '../data/site'

/**
 * Estado vazio de uma página de categoria (quando `getPropertiesByCategory`
 * não retorna nenhum imóvel real). Em vez de preencher a vitrine com cards
 * fictícios, explica a situação com transparência e oferece atendimento
 * personalizado — ver política de dados em src/data/properties.js.
 */
export default function EmptyCategoryState({ category, whatsappHrefOverride }) {
  const label = category.navLabel.toLowerCase()
  const whatsappHref =
    whatsappHrefOverride ||
    buildWhatsAppLink(
      `Olá! Vi no site que não há ${label} confirmados na vitrine no momento. Pode me ajudar a encontrar uma opção com esse perfil?`,
    )

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-navy-950/10 bg-paper-50 px-6 py-14 text-center shadow-soft sm:px-10">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy-950/5 text-accent-600 ring-1 ring-navy-950/10">
        <SearchX className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="mt-6 font-display text-2xl font-semibold text-navy-950">
        Ainda não há {label} confirmados na vitrine
      </h2>
      <p className="mt-3 max-w-sm text-sm text-navy-600 sm:text-base">
        Para não te mostrar anúncios sem certeza da disponibilidade, só publicamos aqui imóveis
        já conferidos pela Schay. Conte o que você procura e ela busca opções reais de{' '}
        {label} que combinem com o seu perfil.
      </p>
      <Cta href={whatsappHref} target="_blank" rel="noopener noreferrer" variant="amber" className="mt-7">
        Buscar com a Schay pelo WhatsApp
      </Cta>
    </div>
  )
}
