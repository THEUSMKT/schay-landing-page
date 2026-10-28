import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, Lock } from "lucide-react";
import Cta from "../components/Cta";
import PropertyGrid from "../components/PropertyGrid";
import WhatsAppIcon from "../components/icons/WhatsAppIcon";
import { PROPERTIES } from "../data/properties";
import { SITE, buildWhatsAppLink } from "../data/site";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { trackEvent } from "../lib/analytics";
import { getAttribution } from "../lib/attribution";
import {
  QUESTIONS,
  buildLeadMessage,
  buildLeadPayload,
  formatPhone,
  isHighBudget,
  isValidPhone,
  matchProperties,
  scoreLead,
  sendLead,
} from "../lib/lead";

// Pausa entre tocar numa resposta e passar pra próxima pergunta: tempo de
// ver a opção marcada.
const ADVANCE_DELAY_MS = 220;
const CONTACT_STEP = QUESTIONS.length;

const fieldClass =
  "mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-4 py-3 text-base text-navy-950 aria-[invalid=true]:border-red-600";

/**
 * Questionário em etapas para quem chega pelo botão "Quero receber imóveis
 * no meu perfil" (Hero e barra fixa no celular). Seis perguntas, uma por
 * tela, e os dados de contato; no fim o lead vai para a planilha da Schay
 * (com a temperatura, que o visitante não vê) e a pessoa recebe o
 * resultado com o botão do WhatsApp — ver src/lib/lead.js.
 */
export default function LeadQuiz() {
  useDocumentTitle("Imóveis no seu perfil | Schay Corretora");
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const headingRef = useRef(null);
  const advanceTimer = useRef(0);
  const firstRender = useRef(true);

  useEffect(() => {
    trackEvent("lead_form_start", { placement: "minha_busca" });
    return () => clearTimeout(advanceTimer.current);
  }, []);

  // A cada etapa nova, o foco vai pro título dela (leitor de tela anuncia a
  // pergunta; no teclado, o Tab segue dali).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    const top = headingRef.current?.closest("[data-quiz-card]")?.getBoundingClientRect().top;
    if (top !== undefined && top < 72) {
      window.scrollBy({ top: top - 88, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, [step, submitted, reduceMotion]);

  const goTo = (next) => {
    clearTimeout(advanceTimer.current);
    setStep(next);
    trackEvent("lead_form_step", { step: next + 1 });
  };

  const choose = (question, value) => {
    setAnswers((current) => ({ ...current, [question.key]: value }));
    if (question.withNeighborhood) return;
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => goTo(step + 1), ADVANCE_DELAY_MS);
  };

  const submit = (contact) => {
    const final = { ...answers, ...contact };
    setAnswers(final);
    sendLead(buildLeadPayload(final, getAttribution()));
    const { temperatura } = scoreLead(final);
    trackEvent("lead_submit", {
      placement: "minha_busca",
      lead_temperature: temperatura.toLowerCase(),
      price_band: final.orcamento,
    });
    setSubmitted(true);
  };

  const question = QUESTIONS[step];
  const progress = submitted ? 1 : step / (CONTACT_STEP + 1);
  const transition = { duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] };

  return (
    <section className="min-h-[80vh] bg-navy-950 pt-8 pb-16 sm:pt-12 sm:pb-20">
      <div className="mx-auto max-w-xl px-5 sm:px-8">
        {!submitted ? (
          <>
            <p className="text-sm font-semibold text-amber-300">
              {SITE.name} · CRECI {SITE.creci}
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Vamos encontrar o imóvel certo para você
            </h1>
            <p className="mt-3 text-white/75">
              Responda 6 perguntas rápidas. Leva menos de 1 minuto.
            </p>
          </>
        ) : null}

        <div
          data-quiz-card
          className="mt-7 rounded-3xl bg-white p-6 text-navy-950 shadow-card sm:p-8"
        >
          {!submitted ? (
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-navy-600">
                <span>
                  {step < CONTACT_STEP
                    ? `Pergunta ${step + 1} de ${CONTACT_STEP}`
                    : "Último passo"}
                </span>
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    className="inline-flex items-center gap-1 rounded-lg py-1 font-medium text-navy-600 hover:text-accent-700"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Voltar
                  </button>
                ) : null}
              </div>
              <div
                role="progressbar"
                aria-label="Progresso do questionário"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                className="mt-3 h-2 overflow-hidden rounded-full bg-paper-200"
              >
                <div
                  className="h-full rounded-full bg-amber-500 transition-[width] duration-300"
                  style={{ width: `${Math.max(progress, 0.04) * 100}%` }}
                />
              </div>
            </div>
          ) : null}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={submitted ? "resultado" : step}
              initial={{ opacity: 0, x: reduceMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : -24 }}
              transition={transition}
            >
              {submitted ? (
                <LeadResult answers={answers} headingRef={headingRef} />
              ) : step < CONTACT_STEP ? (
                <QuestionStep
                  question={question}
                  answers={answers}
                  headingRef={headingRef}
                  onChoose={choose}
                  onNeighborhood={(bairro) =>
                    setAnswers((current) => ({ ...current, bairro }))
                  }
                  onContinue={() => goTo(step + 1)}
                />
              ) : (
                <ContactStep
                  answers={answers}
                  headingRef={headingRef}
                  onSubmit={submit}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function QuestionStep({ question, answers, headingRef, onChoose, onNeighborhood, onContinue }) {
  const selected = answers[question.key];
  return (
    <div>
      <h2
        id="quiz-pergunta"
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl leading-snug text-navy-950 outline-none sm:text-3xl"
      >
        {question.title}
      </h2>
      <div role="group" aria-labelledby="quiz-pergunta" className="mt-5 grid gap-3">
        {question.options.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChoose(question, option.value)}
              className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 px-5 py-3 text-left text-base font-semibold transition-colors duration-150 ${
                active
                  ? "border-amber-500 bg-amber-300/25 text-navy-950"
                  : "border-navy-950/12 bg-paper-100 text-navy-800 hover:border-amber-400 hover:bg-amber-300/10"
              }`}
            >
              {option.label}
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  active ? "border-amber-500 bg-amber-500 text-navy-950" : "border-navy-950/20"
                }`}
              >
                {active ? <Check className="h-4 w-4" strokeWidth={3} /> : null}
              </span>
            </button>
          );
        })}
      </div>
      {question.withNeighborhood ? (
        <>
          <label htmlFor="quiz-bairro" className="mt-5 block text-sm font-medium">
            Tem um bairro em mente? (opcional)
          </label>
          <input
            id="quiz-bairro"
            maxLength={80}
            autoComplete="off"
            value={answers.bairro || ""}
            onChange={(event) => onNeighborhood(event.target.value)}
            placeholder="Ex.: Centro, Campestre, Scharlau"
            className={fieldClass}
          />
          <Cta
            onClick={onContinue}
            disabled={!selected}
            showIcon={false}
            className="mt-5 w-full py-4 text-base disabled:pointer-events-none disabled:opacity-40"
          >
            Continuar
          </Cta>
        </>
      ) : null}
    </div>
  );
}

function ContactStep({ answers, headingRef, onSubmit }) {
  const [nome, setNome] = useState(answers.nome || "");
  const [whatsapp, setWhatsapp] = useState(answers.whatsapp || "");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    if (nome.trim().length < 2) found.nome = "Digite seu nome.";
    if (!isValidPhone(whatsapp))
      found.whatsapp = "Digite um WhatsApp válido com DDD, ex.: (51) 99999-9999.";
    if (!consent) found.consent = "Marque a autorização para a Schay falar com você.";
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`quiz-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    onSubmit({ nome: nome.trim(), whatsapp });
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl leading-snug text-navy-950 outline-none sm:text-3xl"
      >
        Para onde a Schay envia as opções?
      </h2>
      <p className="mt-2 text-navy-600">
        Ela vai separar imóveis com base nas suas respostas.
      </p>

      <label htmlFor="quiz-nome" className="mt-5 block text-sm font-medium">
        Seu nome
      </label>
      <input
        id="quiz-nome"
        autoComplete="name"
        maxLength={100}
        value={nome}
        onChange={(event) => setNome(event.target.value)}
        aria-invalid={errors.nome ? true : undefined}
        aria-describedby={errors.nome ? "quiz-nome-erro" : undefined}
        className={fieldClass}
      />
      {errors.nome ? (
        <p id="quiz-nome-erro" className="mt-1.5 text-sm text-red-700">
          {errors.nome}
        </p>
      ) : null}

      <label htmlFor="quiz-whatsapp" className="mt-5 block text-sm font-medium">
        Seu WhatsApp
      </label>
      <input
        id="quiz-whatsapp"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="(51) 99999-9999"
        value={whatsapp}
        onChange={(event) => setWhatsapp(formatPhone(event.target.value))}
        aria-invalid={errors.whatsapp ? true : undefined}
        aria-describedby={errors.whatsapp ? "quiz-whatsapp-erro" : undefined}
        className={fieldClass}
      />
      {errors.whatsapp ? (
        <p id="quiz-whatsapp-erro" className="mt-1.5 text-sm text-red-700">
          {errors.whatsapp}
        </p>
      ) : null}

      <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-navy-700">
        <input
          id="quiz-consent"
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? "quiz-consent-erro" : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 accent-amber-500"
        />
        <span>
          Autorizo a {SITE.name} a falar comigo pelo WhatsApp sobre imóveis.
          Meus dados não serão compartilhados com terceiros.
        </span>
      </label>
      {errors.consent ? (
        <p id="quiz-consent-erro" className="mt-1.5 text-sm text-red-700">
          {errors.consent}
        </p>
      ) : null}

      <button
        type="submit"
        className="lead-cta mt-6 flex w-full items-center justify-center rounded-full px-6 py-4 text-base font-semibold"
      >
        Ver imóveis para o meu perfil
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-navy-600">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        Seus dados ficam só com a Schay.
      </p>
    </form>
  );
}

function LeadResult({ answers, headingRef }) {
  const high = isHighBudget(answers);
  const matches = high ? [] : matchProperties(PROPERTIES, answers);
  const firstName = (answers.nome || "").trim().split(/\s+/)[0];
  const whatsappHref = buildWhatsAppLink(buildLeadMessage(answers));

  const title = high
    ? "Há imóveis disponíveis para o seu perfil!"
    : matches.length
      ? "Encontramos imóveis no seu orçamento!"
      : "Vamos encontrar uma opção para você!";
  const text = high
    ? "Toque no botão abaixo para receber as opções direto da Schay pelo WhatsApp. Suas respostas já vão junto na mensagem."
    : matches.length
      ? "Veja abaixo alguns imóveis que cabem no que você quer investir. Para saber de outras opções, fale com a Schay pelo WhatsApp."
      : "A Schay conhece oportunidades que ainda não estão no site. Fale com ela pelo WhatsApp — suas respostas já vão junto na mensagem.";

  return (
    <div>
      <CheckCircle2 className="h-12 w-12 text-whatsapp" aria-hidden="true" />
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 text-2xl leading-snug text-navy-950 outline-none sm:text-3xl"
      >
        {firstName ? `${firstName}, ` : ""}
        {firstName ? title.charAt(0).toLowerCase() + title.slice(1) : title}
      </h2>
      <p className="mt-3 leading-relaxed text-navy-600">{text}</p>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        data-placement="lead_result"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-center text-base font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-[#095c45]"
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
        {high ? "Receber as opções no WhatsApp" : "Falar com a Schay no WhatsApp"}
      </a>
      {matches.length ? (
        <div className="-mx-2 mt-8 sm:mx-0">
          <h3 id="imoveis-no-orcamento" className="text-xl text-navy-950">
            Imóveis no seu orçamento
          </h3>
          <PropertyGrid
            properties={matches}
            headingId="imoveis-no-orcamento"
            className=""
          />
        </div>
      ) : null}
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 py-2 text-sm font-medium text-navy-600 hover:text-accent-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para o site
      </Link>
    </div>
  );
}
