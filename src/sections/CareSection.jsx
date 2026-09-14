import { Check } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'

const DIFFERENTIALS = [
  'Atendimento próximo, do primeiro contato à assinatura.',
  'Orientação clara sobre documentação e cada etapa do processo.',
  'Acompanhamento até a entrega das chaves — e depois dela também.',
]

export default function CareSection() {
  return (
    <section className="bg-navy-900 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <SectionEyebrow>Nosso compromisso</SectionEyebrow>
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="mt-4 font-display text-4xl font-semibold text-balance text-white sm:text-5xl"
            >
              O cuidado por trás de{' '}
              <em className="font-medium text-accent-400 italic">cada conquista.</em>
            </Reveal>
            <Reveal delay={0.16} className="mt-5 max-w-md text-sm text-white/60 sm:text-base">
              Comprar ou vender um imóvel envolve decisões importantes. A Schay caminha ao seu
              lado em cada uma delas.
            </Reveal>
          </div>

          <ul className="flex flex-col gap-4">
            {DIFFERENTIALS.map((item, index) => (
              <Reveal
                as="li"
                key={item}
                delay={0.1 + index * 0.1}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-navy-800/60 px-5 py-5"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-400/15 text-accent-400">
                  <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <p className="text-sm text-white/80 sm:text-base">{item}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
