import { Link } from "react-router-dom";
import LeadCta from "../components/LeadCta";
import WhatsAppIcon from "../components/icons/WhatsAppIcon";
import { SITE, buildWhatsAppLink } from "../data/site";
import fotoHero from "../assets/images/hero-casa-familia.webp";
import fotoHero480 from "../assets/images/hero-casa-familia-480.webp";
import fotoHero960 from "../assets/images/hero-casa-familia-960.webp";
import fotoRetrato from "../assets/images/schay-hero-retrato.webp";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-navy-950">
      <img
        src={fotoHero}
        srcSet={`${fotoHero480} 480w, ${fotoHero960} 960w, ${fotoHero} 1456w`}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-9 sm:px-8 sm:py-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-12">
        <div>
          <p className="text-sm font-semibold text-amber-300">
            {SITE.name} · CRECI {SITE.creci}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Encontre seu imóvel em São Leopoldo{" "}
            <span className="text-amber-300">com a ajuda da Schay.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Conte o bairro, o tipo de imóvel e quanto pretende investir. A
            Schay encontra as opções que combinam com a sua busca.
          </p>
          <div className="mt-7 flex flex-col items-stretch sm:items-start">
            {/* Principal (anúncios do Google): o questionário qualifica quem
                está mesmo procurando. data-lead-cta: enquanto este botão
                está na tela, a barra fixa do celular (LeadStickyBar) fica
                escondida. */}
            <LeadCta
              placement="hero"
              data-lead-cta
              className="min-h-14 py-4 text-base sm:text-lg"
            />
            <p className="mt-3 max-w-md text-sm text-white/80">
              Responda 6 perguntas rápidas e a Schay separa as opções certas
              para você.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:flex">
              <a
                href={buildWhatsAppLink(
                  "Olá, Schay! Estou procurando um imóvel em São Leopoldo. Pode me ajudar a encontrar opções?",
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-placement="hero"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 sm:px-6"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                Falar no WhatsApp
              </a>
              <Link
                to="/#imoveis"
                className="rounded-full border border-white/30 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 sm:px-6"
              >
                Ver imóveis
              </Link>
            </div>
          </div>
          <a
            href={buildWhatsAppLink(
              "Olá, Schay! Quero conversar sobre a venda do meu imóvel.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="hero_seller"
            data-intent="sell"
            className="mt-5 inline-block py-2 text-sm text-white/80 underline underline-offset-4"
          >
            Quer vender seu imóvel? Fale com a Schay.
          </a>
        </div>
        <div className="mx-auto flex w-full max-w-sm items-center gap-4 lg:block">
          <img
            src={fotoRetrato}
            alt="Schay, corretora de imóveis"
            width="600"
            height="800"
            className="h-32 w-24 rounded-2xl object-cover sm:h-44 sm:w-32 lg:aspect-[3/4] lg:h-auto lg:w-full"
          />
          <div className="lg:mt-4">
            <p className="font-display text-xl text-white">Schay Corretora</p>
            <p className="mt-1 text-sm text-amber-300">São Leopoldo e região</p>
          </div>
        </div>
      </div>
    </section>
  );
}
