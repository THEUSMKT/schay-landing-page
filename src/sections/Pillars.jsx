import { Headphones, Compass, KeyRound } from 'lucide-react'
import Reveal from '../components/Reveal'

const PILLARS = [
  {
    icon: Headphones,
    title: 'Escuta de verdade',
    description: 'Entendemos seu momento e o que realmente importa antes de indicar opções.',
  },
  {
    icon: Compass,
    title: 'Escolha com clareza',
    description: 'Orientação direta sobre cada imóvel, valores e etapas — sem letras miúdas.',
  },
  {
    icon: KeyRound,
    title: 'Até a entrega das chaves',
    description: 'Acompanhamento próximo do primeiro contato à assinatura, e depois dela também.',
  },
]

export default function Pillars() {
  return (
    <section id="como-funciona" className="border-y border-navy-950/10 bg-paper-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-3 md:gap-0 md:divide-x md:divide-navy-950/10">
        {PILLARS.map((pillar, index) => (
          <Reveal
            key={pillar.title}
            delay={index * 0.12}
            className="flex flex-col items-start gap-3 px-0 md:px-8 md:first:pl-0 md:last:pr-0"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-950/5 text-accent-600 ring-1 ring-navy-950/10">
              <pillar.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="font-display text-lg font-semibold text-navy-950">{pillar.title}</h3>
            <p className="text-sm text-navy-600">{pillar.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
