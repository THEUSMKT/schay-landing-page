import { useId, useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import Cta from '../components/Cta'
import { SITE, buildWhatsAppLink } from '../data/site'

// "Alugar um imóvel" fica de fora até esse serviço ser confirmado — ver
// lista de pontos a confirmar entregue junto com esta revisão. Não incluir
// serviços não confirmados aqui, mesmo como opção de interesse.
const INTEREST_OPTIONS = ['Comprar um imóvel', 'Vender um imóvel', 'Ainda estou pesquisando']

const INITIAL_FORM = { nome: '', interesse: '', mensagem: '' }

const inputClass =
  'w-full rounded-xl border border-navy-950/15 bg-paper-100 px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 outline-none transition-colors duration-200 focus:border-accent-600 focus:bg-paper-50'

/**
 * Monta a mensagem de WhatsApp com os dados do formulário — mesma lógica
 * usada no botão "Saiba mais" dos imóveis (buildWhatsAppLink), só que aqui
 * juntando todos os campos preenchidos em vez de bairro/preço.
 */
function buildContactWhatsAppMessage(form) {
  const lines = [
    `Olá! Meu nome é ${form.nome}.`,
    `Interesse: ${form.interesse}`,
    form.mensagem ? `Mensagem: ${form.mensagem}` : null,
  ].filter(Boolean)

  return lines.join('\n')
}

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [popupBlocked, setPopupBlocked] = useState(false)
  const [lastWhatsAppHref, setLastWhatsAppHref] = useState('')

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {}
    if (!form.nome.trim()) nextErrors.nome = 'Conte seu nome para a gente te chamar certo.'
    if (!form.interesse) nextErrors.interesse = 'Selecione uma opção.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const whatsappHref = buildWhatsAppLink(buildContactWhatsAppMessage(form))
    // Aberto de forma síncrona, direto no clique, pra não ser bloqueado
    // pelo navegador como pop-up (mesmo comportamento do "Saiba mais"). Se
    // mesmo assim o navegador bloquear, `win` volta null/undefined — nesse
    // caso a tela de confirmação troca o texto pra deixar claro que a
    // pessoa precisa clicar no botão manualmente.
    const win = window.open(whatsappHref, '_blank', 'noopener,noreferrer')
    setPopupBlocked(!win)
    setLastWhatsAppHref(whatsappHref)
    setSent(true)
    setForm(INITIAL_FORM)
  }

  return (
    <section id="contato" className="scroll-mt-24 bg-paper-100 py-20 sm:py-28">
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
            <div
              role="status"
              className="rounded-xl border border-accent-600/25 bg-accent-600/10 px-5 py-8 text-center"
            >
              <p className="font-display text-lg text-navy-950">
                {popupBlocked
                  ? 'Quase lá — falta só abrir o WhatsApp'
                  : 'Você será direcionado ao WhatsApp da Schay!'}
              </p>
              <p className="mt-2 text-sm text-navy-600">
                {popupBlocked
                  ? 'Seu navegador bloqueou a abertura automática da nova aba. Sua mensagem já está pronta — use o botão abaixo para abrir o WhatsApp e enviá-la.'
                  : 'Abrimos uma nova aba com sua mensagem pronta — nada foi enviado ainda: é só conferir e enviar por lá para continuar o atendimento.'}
              </p>
              <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Cta href={lastWhatsAppHref} target="_blank" rel="noopener noreferrer" variant="amber">
                  Abrir WhatsApp
                </Cta>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-sm font-medium text-accent-600 underline underline-offset-4"
                >
                  Preencher novamente
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Field id="contato-nome" label="Nome" error={errors.nome}>
                {(fieldProps) => (
                  <input
                    type="text"
                    value={form.nome}
                    onChange={update('nome')}
                    placeholder="Como podemos chamar você?"
                    autoComplete="name"
                    className={inputClass}
                    {...fieldProps}
                  />
                )}
              </Field>

              <Field id="contato-interesse" label="Interesse" error={errors.interesse}>
                {(fieldProps) => (
                  <div className="relative">
                    <select
                      value={form.interesse}
                      onChange={update('interesse')}
                      className={`${inputClass} appearance-none pr-10`}
                      {...fieldProps}
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
                )}
              </Field>

              <Field
                id="contato-mensagem"
                label="Sua mensagem"
                hint="(opcional)"
                className="sm:col-span-2"
              >
                {(fieldProps) => (
                  <textarea
                    value={form.mensagem}
                    onChange={update('mensagem')}
                    placeholder="Conte um pouco sobre o que você procura"
                    rows={4}
                    className={`${inputClass} resize-y`}
                    {...fieldProps}
                  />
                )}
              </Field>

              <div className="sm:col-span-2">
                <Cta type="submit" variant="amber" className="w-full py-3.5 text-base">
                  Solicitar atendimento
                </Cta>
                <p className="mt-3 text-xs text-navy-500">
                  Este formulário não envia nem registra sua mensagem diretamente — ao continuar,
                  vamos abrir o WhatsApp em uma nova aba com o texto pronto, e o envio acontece
                  por lá.
                </p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/**
 * `children` é uma função (fieldProps) => elemento, pra garantir que
 * id/aria-invalid/aria-describedby caiam sempre no controle de formulário
 * de verdade (input/select/textarea) — mesmo quando ele vem envolvido por
 * um wrapper extra, como o <select> do campo "Interesse".
 */
function Field({ id, label, hint, error, children, className = '' }) {
  const reactId = useId()
  const fieldId = id || reactId
  const errorId = `${fieldId}-error`

  return (
    <div className={`flex flex-col gap-2 text-sm ${className}`}>
      <label htmlFor={fieldId} className="font-medium text-navy-800">
        {label} {hint ? <span className="font-normal text-navy-500">{hint}</span> : null}
      </label>
      {children({
        id: fieldId,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      {error ? (
        <span id={errorId} role="alert" className="text-xs text-amber-700">
          {error}
        </span>
      ) : null}
    </div>
  )
}
