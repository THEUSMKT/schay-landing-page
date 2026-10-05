import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const descriptions = {
  "/": "Encontre imóveis em São Leopoldo e região com a Schay Corretora. Consulte casas, apartamentos e terrenos e fale diretamente pelo WhatsApp. CRECI 83.933F.",
  "/casas":
    "Consulte casas à venda em São Leopoldo e região. Veja fotos, preços e bairros e combine uma visita com a Schay pelo WhatsApp.",
  "/apartamentos":
    "Apartamentos à venda em São Leopoldo e região: consulte fotos, preços e características e fale diretamente com a Schay pelo WhatsApp.",
  "/terrenos-e-oportunidades":
    "Terrenos, sítios e oportunidades em São Leopoldo e região. Consulte as ofertas e tire suas dúvidas com a Schay pelo WhatsApp.",
};
export default function useDocumentTitle(title) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = title;
    const normalized = pathname.replace(/\/$/, "") || "/";
    const canonical = `https://schaycorretora.com.br${normalized}`;
    const description =
      descriptions[normalized] || "Schay Corretora — São Leopoldo e região.";
    const setMeta = (attribute, name, content) => {
      let node = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(attribute, name);
        document.head.append(node);
      }
      node.content = content;
    };
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.append(link);
    }
    link.href = canonical;
  }, [title, pathname]);
}
