import { ArrowLeft } from 'lucide-react'
import Cta from '../components/Cta'
import Reveal from '../components/Reveal'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Página não encontrada | Schay Corretora')

  return (
    <section className="flex min-h-[70vh] items-center bg-navy-950">
      <div className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8">
        <Reveal mode="mount">
          <p className="font-display text-6xl text-accent-400">404</p>
          <h1 className="mt-4 font-display text-3xl font-semibold text-white">
            Essa página não existe.
          </h1>
          <p className="mt-3 text-white/60">
            O endereço que você tentou acessar não foi encontrado. Que tal voltar para a
            página inicial?
          </p>
          <Cta to="/" icon={ArrowLeft} className="mt-8" showIcon>
            Voltar para a página inicial
          </Cta>
        </Reveal>
      </div>
    </section>
  )
}
