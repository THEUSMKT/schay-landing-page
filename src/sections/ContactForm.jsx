import { useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import Cta from '../components/Cta'
import { SITE, buildWhatsAppLink } from '../data/site'

const INTEREST_OPTIONS = [
  'Comprar um imóvel',
  'Vender um imóvel',
  'Alugar um imóvel',
  'Ainda estou pesquisando',
]

const INITIAL_FORM = { nome: '', whatsapp: '', email: '', interesse: '', mensagem: '' }

const inputClass =
  'w-full rounded-xl border border-white/15 bg-navy-950/40 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-colors duration-200 focus:border-accent-400'

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {}
    if (!form.nome.trim()) nextErrors.nome = 'Conte seu nome para a gente te chamar certo.'
    if (!form.whatsapp.trim()) nextErrors.whatsapp = 'Informe um WhatsApp para retornar o contato.'
    if (!form.interesse) nextErrors.interesse = 'Selecione uma opção.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const message = [
      'Olá! Vim pelo site da Schay Corretora e gostaria de solicitar atendimento.',
      '',
      `Nome: ${form.nome}`,
      `WhatsApp: ${form.whatsapp}`,
      form.email ? `E-mail: ${form.email}` : null,
      `Interesse: ${form.interesse}`,
      form.mensagem ? `Mensagem: ${form.mensagem}` : null,
    ]
      .filter((line) => line !== null)
      .join('\n')

    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer')
    setSent(true)
    setForm(INITIAL_FORM)
  }

  return (
    <section id="contato" className="bg-navy-950 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Reveal>
            <SectionEyebrow>Vamos conversar</SectionEyebrow>
          </Reveal>
          <Reveal
            as="h2"
            delay={0.08}
            className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl"
          >
            O próximo endereço
            <br />
            <em className="font-medium text-accent-400 italic">começa com você.</em>
          </Reveal>
          <Reveal delay={0.16} className="mt-5 max-w-md text-sm text-white/65 sm:text-base">
            Conte seu momento, suas preferências e o que não pode faltar no seu imóvel. A Schay
            ajuda você a dar o próximo passo.
          </Reveal>

          <Reveal delay={0.24} className="mt-8 flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-white">{SITE.region}</p>
              <p className="text-sm text-white/55">Compra, venda e orientação imobiliária</p>
            </div>
          </Reveal>

          <Reveal delay={0.3} className="mt-8 border-t border-white/10 pt-6">
            <p className="font-display text-lg text-white">{SITE.name}</p>
            <p className="text-sm font-medium text-accent-400">CRECI {SITE.creci}</p>
          </Reveal>
        </div>

        <Reveal
          delay={0.15}
          className="rounded-3xl border border-white/10 bg-navy-900/70 p-6 shadow-card sm:p-8"
        >
          <SectionEyebrow>Atendimento personalizado</SectionEyebrow>
          <h3 className="mt-3 font-display text-2xl font-semibold text-white">
            Seu próximo passo começa aqui.
          </h3>
          <div className="my-6 h-px bg-white/10" />

          {sent ? (
            <div className="rounded-xl border border-accent-400/30 bg-accent-400/10 px-5 py-8 text-center">
              <p className="font-display text-lg text-white">Obrigado!</p>
              <p className="mt-2 text-sm text-white/70">
                Abrimos o WhatsApp com sua mensagem pronta — é só enviar para a Schay dar
                continuidade ao seu atendimento.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm font-medium text-accent-300 underline underline-offset-4"
              >
                Preencher novamente
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Field label="Nome" error={errors.nome}>
                <input
                  type="text"
                  value={form.nome}
                  onChange={update('nome')}
                  placeholder="Como podemos chamar você?"
                  autoComplete="name"
                  className={inputClass}
                />
              </Field>

              <Field label="WhatsApp" error={errors.whatsapp}>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={update('whatsapp')}
                  placeholder="(51) 99999-9999"
                  autoComplete="tel"
                  className={inputClass}
                />
              </Field>

              <Field label="E-mail">
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </Field>

              <Field label="Interesse" error={errors.interesse}>
                <div className="relative">
                  <select
                    value={form.interesse}
                    onChange={update('interesse')}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    <option value="" disabled>
                      Selecione uma opção
                    </option>
                    {INTEREST_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-white/50"
                    aria-hidden="true"
                  />
                </div>
              </Field>

              <Field label="Sua mensagem" hint="(opcional)" className="sm:col-span-2">
                <textarea
                  value={form.mensagem}
                  onChange={update('mensagem')}
                  placeholder="Conte um pouco sobre o que você procura"
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </Field>

              <div className="sm:col-span-2">
                <Cta type="submit" variant="blue" className="w-full py-3.5 text-base">
                  Solicitar atendimento
                </Cta>
                <p className="mt-3 text-xs text-white/40">
                  Seus dados serão usados somente para o atendimento imobiliário.
                </p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Field({ label, hint, error, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-2 text-sm ${className}`}>
      <span className="font-medium text-white/85">
        {label} {hint ? <span className="font-normal text-white/40">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs text-amber-400">{error}</span> : null}
    </label>
  )
}
