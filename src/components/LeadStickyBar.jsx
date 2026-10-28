import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buildWhatsAppLink } from "../data/site";
import { LEAD_PATH } from "./LeadCta";
import WhatsAppIcon from "./icons/WhatsAppIcon";

// Na Home, só depois de rolar até aqui (e com o botão do Hero fora da tela).
const SHOW_AFTER_SCROLL_PX = 120;
// Espera a troca de página (ver PageTransition) antes de procurar o botão
// do Hero na página nova.
const ROUTE_SETTLE_MS = 400;

/**
 * Barra fixa no rodapé da tela, só no celular: o botão do questionário
 * sempre à mão (+ WhatsApp) enquanto o botão do Hero ([data-lead-cta]) não
 * está visível. Não aparece no próprio questionário. Enquanto está na tela,
 * marca o <html> com data-lead-bar — o botão flutuante do WhatsApp sai de
 * cena (o da barra substitui) — e define --lead-bar-offset com a altura da
 * barra, que vira folga no fim da página (App.jsx) pra barra nunca cobrir
 * o rodapé.
 */
export default function LeadStickyBar() {
  const { pathname } = useLocation();
  const onQuiz = pathname === LEAD_PATH;
  const [wanted, setWanted] = useState(false);
  const barRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const visible = wanted && !onQuiz;

  useEffect(() => {
    if (onQuiz) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const heroCta = document.querySelector("[data-lead-cta]");
      const rect = heroCta?.getBoundingClientRect();
      const heroCtaOnScreen =
        rect !== undefined && rect.bottom > 0 && rect.top < window.innerHeight;
      setWanted(window.scrollY > SHOW_AFTER_SCROLL_PX && !heroCtaOnScreen);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    const settle = setTimeout(schedule, ROUTE_SETTLE_MS);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [onQuiz, pathname]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!visible) return undefined;
    root.dataset.leadBar = "";
    root.style.setProperty("--lead-bar-offset", `${barRef.current.offsetHeight}px`);
    return () => {
      delete root.dataset.leadBar;
      root.style.removeProperty("--lead-bar-offset");
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          ref={barRef}
          initial={{ y: reduceMotion ? 0 : "100%", opacity: reduceMotion ? 0 : 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduceMotion ? 0 : "100%", opacity: reduceMotion ? 0 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-white/10 bg-navy-950/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden"
        >
          <Link
            to={LEAD_PATH}
            data-placement="sticky_bar"
            className="lead-cta flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-center text-sm font-semibold"
          >
            Encontrar imóveis ideais
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
          <a
            href={buildWhatsAppLink(
              "Olá! Vim pelo site da Schay Corretora e gostaria de falar sobre um imóvel.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="sticky_bar"
            aria-label="Falar com a Schay no WhatsApp"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-whatsapp text-white"
          >
            <WhatsAppIcon className="h-6 w-6" />
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
