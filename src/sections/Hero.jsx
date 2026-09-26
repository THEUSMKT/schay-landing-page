import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import Cta from '../components/Cta'
import ScrollCue from '../components/ScrollCue'
import { SITE, buildWhatsAppLink } from '../data/site'
import { isPrerendered } from '../lib/prerender'
import fotoHero from '../assets/images/hero-casa-familia.webp'
import fotoHero480 from '../assets/images/hero-casa-familia-480.webp'
import fotoHero960 from '../assets/images/hero-casa-familia-960.webp'
import fotoRetrato from '../assets/images/schay-hero-retrato.webp'

export default function Hero() {
  // Numa página pré-renderizada, fundo e foto já chegam visíveis no HTML
  // puro — começar com bgReady=true (e sem o `initial` de entrada, abaixo)
  // evita que o primeiro mount do React esconda os dois de novo só pra
  // reanimar o que o visitante já está vendo (isso empurrava o LCP pra
  // muito depois; ver src/lib/prerender.js e scripts/prerender.mjs).
  const [prerendered] = useState(isPrerendered)
  const [bgReady, setBgReady] = useState(prerendered)
  const reduceMotion = useReducedMotion()
  const heroRef = useRef(null)
  // Com movimento reduzido, a foto da corretora não espera o fundo carregar.
  const photoVisible = bgReady || reduceMotion

  useEffect(() => {
    // Salvaguarda: numa rede lenta (ou se a imagem falhar), libera o
    // conteúdo mesmo assim depois de um tempo — o hero nunca fica preso
    // esperando a imagem de fundo indefinidamente.
    const timeout = setTimeout(() => setBgReady(true), 2500)
    return () => clearTimeout(timeout)
  }, [])

  // data-cue-*: marcam o que o indicador de rolagem (ScrollCue) não pode
  // cobrir e o respiro entre os botões e a foto, onde ele fica no celular.
  return (
    <section ref={heroRef} className="relative overflow-hidden bg-navy-950">
      <div className="absolute inset-0">
        {/* alt="" de propósito: fundo decorativo atrás do texto do hero, que já
            transmite a mensagem sozinho — uma descrição aqui só duplicaria
            informação pra quem usa leitor de tela. */}
        <motion.img
          src={fotoHero}
          srcSet={`${fotoHero480} 480w, ${fotoHero960} 960w, ${fotoHero} 1456w`}
          sizes="100vw"
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
          onLoad={() => setBgReady(true)}
          onError={() => setBgReady(true)}
          initial={prerendered ? false : { opacity: 0 }}
          animate={{ opacity: bgReady ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-navy-950/80 to-navy-950/35" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/10 to-navy-950/25" />
      </div>

      {/* No celular a primeira dobra é mais compacta (título menor, menos
          respiro no topo) pra que os botões, o indicador de rolagem e o
          começo da foto apareçam juntos — sinal de que a página continua. */}
      <div
        data-cue-grid
        className="relative mx-auto grid max-w-6xl gap-[4.5rem] px-5 pt-6 pb-10 sm:px-8 sm:pt-14 sm:pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12 lg:pt-20 lg:pb-20"
      >
        <div>
          <Reveal mode="mount" data-cue-avoid="text">
            <SectionEyebrow>Corretora de imóveis</SectionEyebrow>
          </Reveal>

          <Reveal mode="mount" delay={0.08} data-cue-avoid="text">
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-white/80 uppercase backdrop-blur-sm sm:mt-5">
              <MapPin className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
              {SITE.region}
            </span>
          </Reveal>

          <Reveal
            as="h1"
            mode="mount"
            delay={0.16}
            data-cue-avoid="text"
            className="mt-4 font-display text-[2.25rem] leading-[1.1] font-semibold text-balance text-white sm:mt-6 sm:text-6xl sm:leading-[1.08] lg:text-[4rem]"
          >
            Encontre seu imóvel em {SITE.region}
            <br />
            <em className="font-medium text-accent-400 italic">com quem acompanha cada etapa.</em>
          </Reveal>

          <Reveal mode="mount" delay={0.26} data-cue-avoid="text">
            <p className="mt-4 max-w-md text-base text-white/70 sm:mt-6 sm:text-lg">
              Casas, apartamentos e terrenos com curadoria da Schay — atendimento direto, do
              primeiro contato à entrega das chaves.
            </p>
          </Reveal>

          <Reveal
            mode="mount"
            delay={0.34}
            data-cue-gap-top
            className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row"
          >
            <Cta to="/#imoveis" variant="amber" className="px-7 py-3 text-base sm:py-3.5" data-cue-avoid="box">
              Ver imóveis disponíveis
            </Cta>
            <Cta
              href={buildWhatsAppLink(
                'Olá! Tenho um imóvel e gostaria de saber mais sobre como vendê-lo com a Schay.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              showIcon={false}
              className="px-7 py-3 text-base sm:py-3.5"
              data-cue-avoid="box"
            >
              Quero vender meu imóvel
            </Cta>
          </Reveal>
        </div>

        <motion.div
          data-cue-gap-bottom
          initial={prerendered ? false : { opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={photoVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 16 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm sm:max-w-md lg:ml-auto"
        >
          {/* Sem card/caixa: foto com cantos suaves + sombra, integrada
              direto na cena do hero, com um leve esmaecimento na base pra
              transicionar pro nome/CRECI abaixo. A entrada dela (e do
              fundo, acima) só dispara quando a imagem de fundo termina de
              carregar (bgReady), pra nunca aparecer "antes" do fundo — exceto
              com movimento reduzido, em que ela aparece direto. */}
          <div
            data-cue-avoid="box"
            className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] shadow-card"
          >
            <img
              src={fotoRetrato}
              alt="Foto de Schay, corretora da Schay Corretora"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-navy-950/85 to-transparent" />
          </div>
          <div className="mt-4" data-cue-avoid="text">
            <p className="font-display text-lg text-white">{SITE.name}</p>
            <p className="text-sm font-medium text-accent-400">CRECI {SITE.creci}</p>
          </div>
        </motion.div>
      </div>

      <ScrollCue heroRef={heroRef} nextSectionId="busca" />
    </section>
  )
}
