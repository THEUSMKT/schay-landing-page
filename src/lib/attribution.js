/**
 * De onde veio o visitante (anúncio do Google, outro site, direto), pra
 * coluna "Origem" da planilha de leads. Lido uma vez ao abrir o site
 * (main.jsx) e guardado na sessão do navegador: a pessoa chega pelo
 * anúncio na Home e só depois abre o questionário, quando a URL já não
 * tem mais o gclid/utm.
 */
const STORAGE_KEY = "schay-attribution";

export function readAttribution({ search = "", referrer = "", host = "", pathname = "/" }) {
  const params = new URLSearchParams(search);
  const source = params.get("utm_source") || "";
  const medium = params.get("utm_medium") || "";
  let referrerHost = "";
  try {
    referrerHost = referrer ? new URL(referrer).hostname : "";
  } catch {
    referrerHost = "";
  }
  const origem = params.get("gclid") || params.get("gbraid") || params.get("wbraid")
    ? "Google Ads"
    : source
      ? [source, medium].filter(Boolean).join(" / ")
      : referrerHost && referrerHost !== host
        ? referrerHost.replace(/^www\./, "")
        : "";
  return {
    origem,
    campanha: params.get("utm_campaign") || "",
    pagina: pathname,
  };
}

/**
 * Guarda a origem da primeira página da sessão — a não ser que uma visita
 * posterior traga uma origem nova (outro clique no anúncio, por exemplo).
 * Navegação interna (sem origem) nunca apaga a que já estava guardada.
 */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const current = readAttribution({
    search: window.location.search,
    referrer: document.referrer,
    host: window.location.hostname,
    pathname: window.location.pathname,
  });
  try {
    if (current.origem || !sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  } catch {
    // Sessão indisponível (modo privado restrito): segue sem origem.
  }
}

export function getAttribution() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}
