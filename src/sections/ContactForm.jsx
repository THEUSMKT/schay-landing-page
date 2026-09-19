import { useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import Cta from '../components/Cta'
import { SITE } from '../data/site'

const INTEREST_OPTIONS = [
  'Comprar um imóvel',
  'Vender um imóvel',
  'Alugar um imóvel',
  'Ainda estou pesquisando',
]

const INITIAL_FORM = { nome: '', whatsapp: '', email: '', interesse: '', mensagem: '' }

const inputClass =
  'w-full rounded-xl border border-navy-950/15 bg-paper-100 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 outline-none transition-colors duration-200 focus:border-accent-600 focus:bg-paper-50'

/** Monta o link mailto: com os dados do formulário já preenchidos. */
function buildMailtoLink(form) {
  const subject = 'Solicitação de atendimento — site Schay Corretora'
  const body = [
    `Nome: ${form.nome}`,
    `WhatsApp: ${form.whatsapp}`,
    form.email ? `E-mail: ${form.email}` : null,
    `Interesse: ${form.interesse}`,
    form.mensagem ? `Mensagem: ${form.mensagem}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')

  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

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

    window.location.href = buildMailtoLink(form)
    setSent(true)
    setForm(INITIAL_FORM)
  }

  return (
    <section id="contato" className="bg-paper-100 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Reveal>
            <SectionEyebrow tone="dark">Vamos conversar</SectionEyebrow>
          </Reveal>
          <Reveal
            as="h2"
            delay={0.08}
            className="mt-4 font-display text-4xl font-semibold text-navy-950 sm:text-5xl"
          >
            O próximo endereço
            <br />
            <em className="font-medium text-accent-600 italic">começa com você.</em>
          </Reveal>
          <Reveal delay={0.16} className="mt-5 max-w-md text-sm text-navy-600 sm:text-base">
            Conte seu momento, suas preferências e o que não pode faltar no seu imóvel. A Schay
            ajuda você a dar o próximo passo.
          </Reveal>

          <Reveal delay={0.24} className="mt-8 flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden="true" />
            <div>
              <p className="font-medium text-navy-950">{SITE.region}</p>
              <p className="text-sm text-navy-500">Compra, venda e orientação imobiliária</p>
            </div>
          </Reveal>

          <Reveal delay={0.3} className="mt-8 border-t border-navy-950/10 pt-6">
            <p className="font-display text-lg text-navy-950">{SITE.name}</p>
            <p className="text-sm font-medium text-accent-600">CRECI {SITE.creci}</p>
          </Reveal>
        </div>

        <Reveal
          delay={0.15}
          className="rounded-3xl border border-navy-950/10 bg-paper-50 p-6 shadow-card sm:p-8"
        >
          <SectionEyebrow tone="dark">Atendimento personalizado</SectionEyebrow>
          <h3 className="mt-3 font-display text-2xl font-semibold text-navy-950">
            Seu próximo passo começa aqui.
          </h3>
          <div className="my-6 h-px bg-navy-950/10" />

          {sent ? (
            <div className="rounded-xl border border-accent-600/25 bg-accent-600/10 px-5 py-8 text-center">
              <p className="font-display text-lg text-navy-950">Obrigado!</p>
              <p className="mt-2 text-sm text-navy-600">
                Abrimos seu aplicativo de e-mail com a mensagem pronta — é só enviar para a
                Schay dar continuidade ao seu atendimento.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm font-medium text-accent-600 underline underline-offset-4"
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
                    className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-navy-400"
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
                <Cta type="submit" variant="amber" className="w-full py-3.5 text-base">
                  Solicitar atendimento
                </Cta>
                <p className="mt-3 text-xs text-navy-500">
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
      <span className="font-medium text-navy-800">
        {label} {hint ? <span className="font-normal text-navy-400">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="text-xs text-amber-600">{error}</span> : null}
    </label>
  )
}
