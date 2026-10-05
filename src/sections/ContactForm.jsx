import { useEffect, useState } from "react";
import Cta from "../components/Cta";
import { SITE, buildWhatsAppLink } from "../data/site";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");
  useEffect(() => {
    const update = () => setSummary(window.schaySearchSummary || "");
    update();
    window.addEventListener("schay-search-change", update);
    return () => window.removeEventListener("schay-search-change", update);
  }, []);
  const text = [
    name.trim()
      ? `Olá, Schay! Meu nome é ${name.trim()}.`
      : "Olá, Schay! Gostaria de ajuda para encontrar um imóvel.",
    summary ? `Minha busca: ${summary}.` : "",
    message.trim(),
  ]
    .filter(Boolean)
    .join("\n");
  return (
    <section
      id="contato"
      className="scroll-mt-24 bg-paper-100 px-5 py-12 sm:px-8 sm:py-16"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
            Vamos conversar
          </p>
          <h2 className="mt-3 text-3xl text-navy-950 sm:text-4xl">
            Conte o que você procura e fale com a Schay
          </h2>
          <p className="mt-4 leading-relaxed text-navy-600">
            Do primeiro contato à negociação, converse diretamente com quem vai
            acompanhar sua busca em São Leopoldo e região.
          </p>
          <p className="mt-5 font-semibold">
            {SITE.name} · CRECI {SITE.creci}
          </p>
          <Cta
            className="mt-6"
            href={buildWhatsAppLink(
              summary
                ? `Olá, Schay! Minha busca: ${summary}. Pode me ajudar?`
                : "Olá, Schay! Gostaria de conversar sobre um imóvel.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="contact_direct"
          >
            Conversar com a Schay no WhatsApp
          </Cta>
          <div className="mt-8 border-t border-navy-950/15 pt-5">
            <h3 className="text-xl">Quer vender seu imóvel?</h3>
            <p className="mt-2 text-sm text-navy-600">
              Converse com a Schay sobre o seu imóvel e os próximos passos.
            </p>
            <a
              className="mt-3 inline-block py-2 font-semibold text-navy-950 underline underline-offset-4"
              href={buildWhatsAppLink(
                "Olá, Schay! Quero saber como vender meu imóvel com seu acompanhamento.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              data-intent="sell"
              data-placement="seller"
            >
              Falar sobre a venda do meu imóvel
            </a>
          </div>
        </div>
        <div className="rounded-3xl border border-navy-950/10 bg-white p-6 sm:p-8">
          <h3 className="text-2xl text-navy-950">
            Quer adiantar suas preferências?
          </h3>
          <p className="mt-2 text-sm text-navy-600">
            Preencher é opcional. Você também pode usar o botão de contato
            direto.
          </p>
          {summary && (
            <p className="mt-4 rounded-xl bg-paper-100 p-3 text-sm">
              Sua busca: {summary}
            </p>
          )}
          <label
            className="mt-5 block text-sm font-medium"
            htmlFor="contato-nome"
          >
            Nome (opcional)
          </label>
          <input
            id="contato-nome"
            autoComplete="name"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-navy-950/20 px-4 py-3"
          />
          <label
            className="mt-5 block text-sm font-medium"
            htmlFor="contato-mensagem"
          >
            O que procura? (opcional)
          </label>
          <textarea
            id="contato-mensagem"
            rows={3}
            maxLength={1500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Bairro, valor e o que não pode faltar no seu imóvel"
            className="mt-2 w-full rounded-xl border border-navy-950/20 px-4 py-3"
          />
          <Cta
            className="mt-5 w-full"
            href={buildWhatsAppLink(text)}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="contact_preferences"
          >
            Continuar no WhatsApp
          </Cta>
          <p className="mt-3 text-sm text-navy-600">
            Você poderá revisar e enviar a mensagem no WhatsApp. Os campos não
            são enviados ao site.
          </p>
        </div>
      </div>
    </section>
  );
}
