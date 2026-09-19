import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Cta from './Cta'
import { NAV_LINKS, buildWhatsAppLink } from '../data/site'

const WHATSAPP_HREF = buildWhatsAppLink(
  'Olá! Vim pelo site da Schay Corretora e gostaria de solicitar atendimento.',
)

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="transition-colors duration-200 hover:text-accent-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Cta
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="px-5 py-2.5"
            showIcon={false}
          >
            Solicitar atendimento
          </Cta>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-navy-950/95 px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-sm font-medium text-white/85 transition-colors duration-200 hover:bg-white/5 hover:text-accent-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Cta
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            variant="amber"
            onClick={() => setOpen(false)}
            className="mt-4 w-full"
          >
            Solicitar atendimento
          </Cta>
        </nav>
      ) : null}
    </header>
  )
}
