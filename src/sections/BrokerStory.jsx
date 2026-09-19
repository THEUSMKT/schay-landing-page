import { UserRound } from 'lucide-react'
import PlaceholderPhoto from '../components/PlaceholderPhoto'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'

/**
 * Seção "História da corretora" — separada das demais, com foto dela em
 * destaque (aqui ainda um espaço reservado/placeholder: ver comentário em
 * PlaceholderPhoto.jsx) + overlay escuro + texto pessoal.
 *
 * Para colocar a foto real dela: importe a imagem no topo deste arquivo e
 * troque o bloco <PlaceholderPhoto ... /> por
 * <img src={fotoSchay} alt="" className="absolute inset-0 h-full w-full object-cover" />.
 */
export default function BrokerStory() {
  return (
    <section id="historia-da-corretora" className="relative overflow-hidden bg-navy-950">
      <PlaceholderPhoto
        icon={UserRound}
        gradientClassName="from-navy-800 via-navy-900 to-navy-950"
        iconClassName="h-72 w-72 sm:h-96 sm:w-96"
        label="Foto da corretora"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-navy-950/72" />
      <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/30 to-navy-950/55" />

      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <Reveal className="flex justify-center">
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
    </section>
  )
}
