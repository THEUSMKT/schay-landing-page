import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import Logo from './Logo'
import Reveal from './Reveal'
import { NAV_LINKS, SITE, buildWhatsAppLink } from '../data/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    // Sem borda no topo: cada página termina numa faixa que já escurece até
    // o azul do rodapé (SectionFade), e a 404 já é azul — a linha só
    // reintroduziria o corte seco.
    <footer className="bg-navy-950">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <Reveal className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs font-display text-lg text-white/80 italic">
              Cada novo endereço começa com uma conversa. Vamos falar sobre o seu?
            </p>
          </div>

          <div>
            {/* h2 (não h4): o rodapé é seu próprio landmark e aparece
                depois de hierarquias que terminam em h1, h2 ou h3
                dependendo da página — h2 nunca "pula" nível nesses casos,
                só volta pra um nível mais raso, o que é sempre válido. */}
            <h2 className="text-xs font-semibold tracking-[0.2em] text-white/45 uppercase">
              Navegação
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="transition-colors duration-200 hover:text-accent-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold tracking-[0.2em] text-white/45 uppercase">
              Contato
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-accent-300"
                >
                  <Phone className="h-4 w-4 text-accent-400" aria-hidden="true" />
                  {SITE.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-accent-300"
                >
                  <Mail className="h-4 w-4 text-accent-400" aria-hidden="true" />
                  {SITE.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-400" aria-hidden="true" />
                {SITE.city} — {SITE.state}
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal
          delay={0.1}
          className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>
            © {year} {SITE.name}. Todos os direitos reservados.
          </p>
          <p>CRECI {SITE.creci}</p>
        </Reveal>
      </div>
    </footer>
  )
}
