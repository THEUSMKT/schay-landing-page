import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const LEAD_PATH = "/minha-busca";
export const LEAD_LABEL = "Quero receber imóveis no meu perfil";

/** Botão dourado brilhante que leva ao questionário (/minha-busca). */
export default function LeadCta({ placement, className = "", ...rest }) {
  return (
    <Link
      to={LEAD_PATH}
      data-placement={placement}
      className={`neon-cta inline-flex items-center justify-center gap-2 rounded-full px-6 text-center font-bold text-balance ${className}`}
      {...rest}
    >
      {LEAD_LABEL}
      <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
    </Link>
  );
}
