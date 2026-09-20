import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import fotoHistoria from '../assets/images/schay-historia.webp'

/**
 * Seção "História da corretora". Na foto usada aqui, a Schay está
 * posicionada à direita do quadro, com bastante fundo vazio à esquerda —
 * por isso o texto fica à esquerda em telas grandes (lg+), sobre esse
 * espaço vazio, sem cobrir o rosto/corpo dela.
 *
 * Em telas menores a foto vira um bloco próprio acima do texto (em vez de
 * espremer a mesma imagem larga atrás de um texto empilhado), evitando
 * cortar a Schay para caber num recorte muito mais alto que largo.
 */
export default function BrokerStory() {
  return (
    <section id="historia-da-corretora" className="relative overflow-hidden bg-navy-950">
      {/* < lg: foto como bloco próprio, enquadrada nela */}
      <div className="relative aspect-[4/5] w-full lg:hidden">
        <img
          src={fotoHistoria}
          alt="Schay, corretora da Schay Corretora"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '68% center' }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/10 to-transparent" />
      </div>

      {/* lg+: foto de fundo em toda a seção, com texto sobre a área vazia à esquerda */}
      <div className="absolute inset-0 hidden lg:block">
        <img
          src={fotoHistoria}
          alt="Schay, corretora da Schay Corretora"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center 0%' }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-navy-950/85 to-navy-950/10" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 lg:py-36">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-md lg:text-left">
          <Reveal className="flex justify-center lg:justify-start">
            <SectionEyebrow>Nossa história</SectionEyebrow>
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
      </div>
    </section>
  )
}
