// No tags or identifiers are invented. Connect this event stream to a consent-aware GTM container.
export function trackEvent(event, context = {}) {
  if (typeof window === "undefined" || window.schayAnalyticsConsent !== true)
    return;
  const allowed = [
    "placement",
    "property_id",
    "category",
    "intent",
    "result_count",
    "price_band",
  ];
  const data = Object.fromEntries(
    Object.entries(context).filter(([key]) => allowed.includes(key)),
  );
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    ...data,
  });
}

export function installWhatsAppTracking() {
  const listener = (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link || new URL(link.href, window.location.href).hostname !== "wa.me")
      return;
    trackEvent("whatsapp_click", {
      placement:
        link.dataset.placement ||
        link.closest("section")?.id ||
        link.closest("header,footer")?.tagName.toLowerCase() ||
        "general",
      property_id: link.dataset.propertyId || "",
      category: link.dataset.category || "",
      intent: link.dataset.intent || "buy",
    });
  };
  document.addEventListener("click", listener);
  return () => document.removeEventListener("click", listener);
}
