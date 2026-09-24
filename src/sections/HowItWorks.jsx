import { UserRound, ListChecks, CalendarCheck, Handshake } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'

const STEPS = [
  {
    icon: UserRound,
    title: 'Entender o seu perfil',
    description:
      'Conversamos sobre o seu momento, sua rotina e o que não pode faltar no próximo imóvel.',
  },
  {
    icon: ListChecks,
    title: 'Selecionar opções reais',
    description: 'Você recebe só imóveis já conferidos pela Schay, dentro do que combina com você.',
  },
  {
    icon: CalendarCheck,
    title: 'Organizar as visitas',
    description: 'Agendamos as visitas nos imóveis de interesse, no horário que funcionar pra você.',
  },
  {
    icon: Handshake,
    title: 'Acompanhar a negociação',
    description: 'Caminhamos juntos da proposta à assinatura — e a Schay segue disponível depois dela.',
  },
]

/**
 * Substitui as antigas seções Pillars + CareSection (que repetiam a mesma
 * mensagem de "cuidado/proximidade" de duas formas diferentes) por um único
 * passo a passo concreto do atendimento.
 */
export default function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-24 bg-paper-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="flex justify-center">
          <SectionEyebrow tone="dark">Como funciona</SectionEyebrow>
        </Reveal>
        <Reveal
          as="h2"
          delay={0.08}
          className="mt-4 text-center font-display text-4xl font-semibold text-navy-950 sm:text-5xl"
        >
          Do primeiro contato <em className="font-medium text-accent-600 italic">à entrega das chaves.</em>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal
              key={step.title}
              delay={0.1 + index * 0.1}
              className="relative flex flex-col items-start gap-3 rounded-2xl border border-navy-950/10 bg-white px-5 py-7 shadow-soft"
            >
              <span
                aria-hidden="true"
                className="absolute top-5 right-5 font-display text-2xl font-semibold text-navy-950/10"
              >
                0{index + 1}
              </span>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy-950/5 text-accent-600 ring-1 ring-navy-950/10">
                <step.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="font-display text-lg font-semibold text-navy-950">{step.title}</h3>
              <p className="text-sm text-navy-600">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
