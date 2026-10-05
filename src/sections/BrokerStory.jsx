import Reveal from "../components/Reveal";
import SectionEyebrow from "../components/SectionEyebrow";
import fotoHistoria from "../assets/images/schay-historia.webp";

/**
 * Seção "História da corretora": texto à esquerda, foto à direita em
 * telas grandes (lg+), empilhados em telas menores. A foto já vem sem
 * fundo de escritório (recorte da silhueta) e com um gradiente azul claro
 * + fade para transparente embutidos no próprio arquivo — por isso é só
 * um <img>, sem card/caixa/máscara em CSS. O canvas (1086×1638) tem uma
 * faixa extra de espaço abaixo dos pés dela (que na foto original tocavam
 * a borda inferior, sem nenhuma margem pro gradiente esmaecer ali) — o
 * aspect-[1086/1638] casa exatamente com esse canvas, então não há corte
 * em nenhum tamanho de tela.
 */
export default function BrokerStory() {
  return (
    <section
      id="historia-da-corretora"
      className="relative scroll-mt-24 overflow-hidden bg-navy-950"
    >
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-14">
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

          <Reveal
            delay={0.16}
            className="mt-6 text-base leading-relaxed text-white/80 sm:text-lg"
          >
            Meu trabalho começa por entender o que você procura. A partir daí,
            ajudo a selecionar opções, organizar visitas e acompanhar a
            negociação. Sou Schay, corretora de imóveis, CRECI 83.933F, e atuo
            em São Leopoldo e região.
          </Reveal>

          <Reveal delay={0.26} className="mt-6">
            <p className="font-display text-2xl text-balance text-accent-300 italic sm:text-3xl">
              "Não vendo apenas imóveis. Ajudo pessoas a escreverem novos
              capítulos."
            </p>
          </Reveal>
        </div>

        <Reveal
          delay={0.2}
          className="mx-auto mt-12 max-w-[220px] lg:mx-auto lg:mt-0 lg:max-w-xs"
        >
          <div className="relative aspect-[1086/1638] w-full">
            <img
              src={fotoHistoria}
              loading="lazy"
              decoding="async"
              width="1086"
              height="1638"
              alt="Schay, corretora da Schay Corretora"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
