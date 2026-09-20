import { MapPin } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import Cta from '../components/Cta'
import { SITE, buildWhatsAppLink } from '../data/site'
import fotoHero from '../assets/images/hero-casa-familia.webp'
import fotoRetrato from '../assets/images/schay-retrato.webp'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={fotoHero}
          alt="Casa amarela com jardim e família em frente, representando o próximo endereço"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-navy-950/80 to-navy-950/35" />
        <div className="absolute inset-0 bg-linear-to-t from-navy-950 via-navy-950/10 to-navy-950/25" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:pt-28 lg:pb-24">
        <div>
          <Reveal mode="mount">
            <SectionEyebrow>Imóveis à venda</SectionEyebrow>
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
            A sua nova fase
            <br />
            <em className="font-medium text-accent-400 italic">
              pode começar agora.
            </em>
          </Reveal>

          <Reveal mode="mount" delay={0.26}>
            <p className="mt-6 max-w-md text-base text-white/70 sm:text-lg">
              Encontre seu próximo endereço com orientação próxima, do primeiro contato à
              entrega das chaves.
            </p>
          </Reveal>

          <Reveal mode="mount" delay={0.34}>
            <Cta
              href={buildWhatsAppLink(
                'Olá! Vim pelo site da Schay Corretora e gostaria de solicitar atendimento.',
              )}
              target="_blank"
              rel="noopener noreferrer"
              variant="amber"
              className="mt-8 px-7 py-3.5 text-base"
            >
              Solicitar atendimento
            </Cta>
          </Reveal>
        </div>

        <Reveal mode="mount" delay={0.3} className="lg:justify-self-end">
          <div className="w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-navy-900/60 shadow-card backdrop-blur-sm sm:max-w-sm">
            <div className="relative aspect-[4/5] w-full">
              <img
                src={fotoRetrato}
                alt="Foto de Schay, corretora da Schay Corretora"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="px-5 py-4">
              <p className="font-display text-lg text-white">{SITE.name}</p>
              <p className="text-sm font-medium text-accent-400">CRECI {SITE.creci}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
