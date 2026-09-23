import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import fotoHistoria from '../assets/images/schay-historia.webp'

/**
 * Seção "História da corretora": texto à esquerda, foto à direita em
 * telas grandes (lg+), empilhados em telas menores. A foto não tem
 * card/caixa nem sombra — as bordas se dissolvem num glow em gradiente
 * atrás dela (.broker-photo-glow + .broker-photo-mask, em index.css),
 * então ela parece emergir do fundo escuro da seção. O aspect-[3/4] casa
 * exatamente com a proporção da foto enviada (952×1269), então não há
 * corte nenhum em nenhum tamanho de tela.
 */
export default function BrokerStory() {
  return (
    <section id="historia-da-corretora" className="relative overflow-hidden bg-navy-950">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-28">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <Reveal className="flex justify-center lg:justify-start">
            <SectionEyebrow>Minha história</SectionEyebrow>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.08}
            className="mt-5 font-display text-3xl font-semibold text-white sm:text-4xl"
          >
            Schay
          </Reveal>

          <Reveal delay={0.16} className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg">
            Meu interesse por esse mercado nasceu de um sonho antigo: o de ajudar famílias a
            encontrarem um lugar para chamar de lar. Estudei, me dediquei, prestei a prova e me
            tornei corretora — e a cada imóvel que ajudo a realizar, essa escolha se confirma.
            Hoje, atuo na Imobiliária Innovar, fazendo o que amo, e é essa realização que me move
            a trabalhar com excelência todos os dias.
          </Reveal>

          <Reveal delay={0.26} className="mt-14 sm:mt-16">
            <p className="font-display text-2xl text-balance text-accent-300 italic sm:text-3xl">
              "Não vendo apenas imóveis. Ajudo pessoas a escreverem novos capítulos."
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative mx-auto mt-12 max-w-sm lg:mx-0 lg:mt-0 lg:max-w-none">
          <div aria-hidden="true" className="broker-photo-glow absolute -inset-12 -z-10 blur-2xl" />
          <div className="broker-photo-mask relative aspect-[3/4] w-full">
            <img
              src={fotoHistoria}
              alt="Schay, corretora da Schay Corretora"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
