import { Link } from "react-router-dom";
import Cta from "../components/Cta";
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
            Conte o bairro, o tipo de imóvel e quanto pretende investir.
            Converse diretamente com a Schay para encontrar opções que combinem
            com sua busca.
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:items-start">
            <Cta
              href={buildWhatsAppLink(
                "Olá, Schay! Estou procurando um imóvel em São Leopoldo. Pode me ajudar a encontrar opções?",
              )}
              target="_blank"
              rel="noopener noreferrer"
              data-placement="hero"
              className="py-4 text-base"
            >
              Buscar meu imóvel pelo WhatsApp
            </Cta>
            <Link
              to="/#imoveis"
              className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
            >
              Ver imóveis disponíveis
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/80">
            Atendimento direto com a Schay. Sem cadastro obrigatório.
          </p>
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
