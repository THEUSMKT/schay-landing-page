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
    <section className="bg-paper-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <SectionEyebrow tone="dark">Nosso compromisso</SectionEyebrow>
            </Reveal>
            <Reveal
              as="h2"
              delay={0.08}
              className="mt-4 font-display text-4xl font-semibold text-balance text-navy-950 sm:text-5xl"
            >
              O cuidado por trás de{' '}
              <em className="font-medium text-accent-600 italic">cada conquista.</em>
            </Reveal>
            <Reveal delay={0.16} className="mt-5 max-w-md text-sm text-navy-600 sm:text-base">
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
                className="flex items-start gap-4 rounded-2xl border border-navy-950/10 bg-paper-50 px-5 py-5 shadow-soft"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600/10 text-accent-600">
                  <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <p className="text-sm text-navy-700 sm:text-base">{item}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
