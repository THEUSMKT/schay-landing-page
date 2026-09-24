import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import Cta from '../components/Cta'
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

  useEffect(() => {
    // Salvaguarda: numa rede lenta (ou se a imagem falhar), libera o
    // conteúdo mesmo assim depois de um tempo — o hero nunca fica preso
    // esperando a imagem de fundo indefinidamente.
    const timeout = setTimeout(() => setBgReady(true), 2500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section className="relative overflow-hidden bg-navy-950">
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

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:pt-28 lg:pb-24">
        <div>
          <Reveal mode="mount">
            <SectionEyebrow>Corretora de imóveis</SectionEyebrow>
          </Reveal>

          <Reveal mode="mount" delay={0.08}>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-white/80 uppercase backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5 text-accent-400" aria-hidden="true" />
              {SITE.region}
            </span>
          </Reveal>

          <Reveal
            as="h1"
            mode="mount"
            delay={0.16}
            className="mt-6 font-display text-5xl leading-[1.08] font-semibold text-balance text-white sm:text-6xl lg:text-[4rem]"
          >
            Encontre seu imóvel em {SITE.region}
            <br />
            <em className="font-medium text-accent-400 italic">com quem acompanha cada etapa.</em>
          </Reveal>

          <Reveal mode="mount" delay={0.26}>
            <p className="mt-6 max-w-md text-base text-white/70 sm:text-lg">
              Casas, apartamentos e terrenos com curadoria da Schay — atendimento direto, do
              primeiro contato à entrega das chaves.
            </p>
          </Reveal>

          <Reveal mode="mount" delay={0.34} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Cta to="/#imoveis" variant="amber" className="px-7 py-3.5 text-base">
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
              className="px-7 py-3.5 text-base"
            >
              Quero vender meu imóvel
            </Cta>
          </Reveal>
        </div>

        <motion.div
          initial={prerendered ? false : { opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={bgReady ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 16 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm sm:max-w-md lg:ml-auto"
        >
          {/* Sem card/caixa: foto com cantos suaves + sombra, integrada
              direto na cena do hero, com um leve esmaecimento na base pra
              transicionar pro nome/CRECI abaixo. A entrada dela (e do
              fundo, acima) só dispara quando a imagem de fundo termina de
              carregar (bgReady), pra nunca aparecer "antes" do fundo. */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] shadow-card">
            <img
              src={fotoRetrato}
              alt="Foto de Schay, corretora da Schay Corretora"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-navy-950/85 to-transparent" />
          </div>
          <div className="mt-4">
            <p className="font-display text-lg text-white">{SITE.name}</p>
            <p className="text-sm font-medium text-accent-400">CRECI {SITE.creci}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
