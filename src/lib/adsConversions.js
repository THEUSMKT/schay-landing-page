/**
 * Conversões do Google Ads.
 *
 * A tag (gtag.js, conta AW-18481242347) é carregada no <head> do index.html.
 * Aqui ficam os RÓTULOS de conversão — cada um é criado no Google Ads
 * (Metas → Conversões → "Código do evento"): copie a parte depois da barra
 * do `send_to` (ex.: 'AW-18481242347/AbC-D_efG123' → 'AbC-D_efG123') e cole
 * entre as aspas. Rótulo vazio = essa conversão fica desligada.
 */
export const ADS_CONFIG = {
  id: "AW-18481242347",
  labels: {
    // Questionário (/minha-busca) enviado com sucesso.
    LABEL_LEAD_FORMULARIO: "",
    // Mesmo envio, quando o lead é classificado como QUENTE (src/lib/lead.js).
    LABEL_LEAD_QUENTE: "",
    // Clique em qualquer link para o WhatsApp (botões, cards, rodapé…).
    LABEL_CLIQUE_WHATSAPP: "",
  },
};

/** Dispara a conversão de `labelKey` (uma chave de ADS_CONFIG.labels). */
export function trackAdsConversion(labelKey, config = ADS_CONFIG) {
  const label = (config.labels[labelKey] || "").trim();
  if (!label || typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  window.gtag("event", "conversion", { send_to: `${config.id}/${label}` });
}

const isWhatsAppHost = (host) =>
  host === "wa.me" || host === "whatsapp.com" || host.endsWith(".whatsapp.com");

/**
 * Um único listener de clique no documento (delegado): vale para qualquer
 * link wa.me / api.whatsapp.com da página, inclusive os que aparecem depois.
 * Só observa — não impede nem atrasa a abertura do WhatsApp. Cliques
 * cancelados (ex.: o fim de um arraste nos carrosséis) não contam.
 */
export function installWhatsAppConversion(config = ADS_CONFIG) {
  const listener = (event) => {
    if (event.defaultPrevented) return;
    const link = event.target.closest?.("a[href]");
    // data-ads-counted: o clique já foi contado por quem abriu o WhatsApp
    // (ver ContactForm) — evita contar duas vezes o mesmo envio.
    if (!link || link.hasAttribute("data-ads-counted")) return;
    let host;
    try {
      host = new URL(link.href, window.location.href).hostname;
    } catch {
      return;
    }
    if (isWhatsAppHost(host)) trackAdsConversion("LABEL_CLIQUE_WHATSAPP", config);
  };
  document.addEventListener("click", listener);
  return () => document.removeEventListener("click", listener);
}
