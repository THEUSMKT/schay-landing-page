import { useState } from "react";
import { Link } from "react-router-dom";
import { PRIVACY_PATH } from "../data/site";

const STORAGE_KEY = "schay-cookie-notice";

/**
 * Aviso de cookies: informa que o site usa a tag de anúncios do Google e
 * leva à política de privacidade. É só informativo (a tag carrega ao abrir
 * o site); "Entendi" guarda a escolha no navegador pra não mostrar de novo.
 * O prerender já o deixa fechado, pra não sair no HTML das páginas.
 */
export default function CookieNotice() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "closed";
    } catch {
      // Sem localStorage (modo privado restrito): o aviso aparece normalmente.
      return true;
    }
  });

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "closed");
    } catch {
      // Sem localStorage: o aviso só some até a próxima visita.
    }
  };

  if (!open) return null;

  // Compacto de propósito: no celular fica abaixo dos botões do topo da
  // página, e no computador vai pro canto direito (embaixo da foto), pra não
  // cobrir o botão principal enquanto o aviso estiver aberto.
  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-[60] flex items-center gap-3 rounded-2xl border border-white/10 bg-navy-900/95 p-3 text-xs leading-snug text-white/85 shadow-card backdrop-blur-md sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-sm sm:p-4 sm:text-sm"
    >
      <p>
        Usamos cookies e uma tag de anúncios do Google para medir os anúncios da
        Schay.{" "}
        <Link
          to={PRIVACY_PATH}
          className="font-medium text-amber-300 underline underline-offset-2"
        >
          Política de Privacidade
        </Link>
      </p>
      <button
        type="button"
        onClick={close}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-navy-950 transition-colors duration-200 hover:bg-amber-200"
      >
        Entendi
      </button>
    </div>
  );
}
