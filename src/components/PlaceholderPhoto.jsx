import { useId } from 'react'

/**
 * Ilustração usada no lugar de uma foto real (hero, retrato da corretora,
 * cards de imóveis, fotos de "vendas realizadas"). É assumidamente uma
 * arte de placeholder — nunca finge ser uma fotografia real — para que dê
 * pra trocar por fotos de verdade depois sem nenhuma ambiguidade.
 *
 * Visual: gradiente na paleta do site + textura de linhas diagonais + um
 * ícone de contorno grande e discreto.
 */
export default function PlaceholderPhoto({
  icon: Icon,
  className = '',
  iconClassName = 'h-28 w-28',
  gradientClassName = 'from-navy-700 via-navy-800 to-navy-950',
  label = 'Foto ilustrativa',
  showLabel = true,
}) {
  const uid = useId()

  return (
    <div
      className={`relative overflow-hidden bg-linear-to-br ${gradientClassName} ${className}`}
    >
      <svg className="absolute inset-0 h-full w-full opacity-10" aria-hidden="true">
        <defs>
          <pattern
            id={`hatch-${uid}`}
            width="16"
            height="16"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="16" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#hatch-${uid})`} />
      </svg>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 15% 15%, rgba(255,255,255,0.10), transparent 55%)',
        }}
      />

      {Icon ? (
        <Icon
          aria-hidden="true"
          strokeWidth={0.9}
          className={`absolute -bottom-4 -right-4 text-white/15 ${iconClassName}`}
        />
      ) : null}

      {showLabel ? (
        <span className="absolute bottom-3 left-3 rounded-full bg-navy-950/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/75 backdrop-blur-sm">
          {label}
        </span>
      ) : null}
    </div>
  )
}
