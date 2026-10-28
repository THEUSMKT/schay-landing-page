import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const LEAD_PATH = "/minha-busca";
export const LEAD_LABEL = "Encontrar imóveis ideais para meu perfil";

/** Botão dourado que leva ao questionário (/minha-busca). */
export default function LeadCta({ placement, className = "", ...rest }) {
  return (
    <Link
      to={LEAD_PATH}
      data-placement={placement}
      className={`lead-cta inline-flex items-center justify-center rounded-full text-center font-semibold text-balance ${className}`}
      {...rest}
    >
      {LEAD_LABEL}
      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </Link>
  );
}
