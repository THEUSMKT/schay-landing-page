import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

/**
 * Botão de call-to-action reutilizado no site inteiro (hero, cards, formulário).
 * Renderiza <Link> (rota interna via `to`), <a> (link externo/âncora via `href`)
 * ou <button> (ação via `onClick`/`type="submit"`), sempre com o mesmo visual.
 */
const VARIANTS = {
  amber:
    'bg-amber-500 text-navy-950 hover:bg-amber-400 shadow-soft',
  blue: 'bg-accent-400 text-navy-950 hover:bg-accent-300 shadow-soft',
  outline: 'border border-white/25 text-white hover:bg-white/10',
  ghost: 'text-accent-300 hover:text-accent-200',
}

export default function Cta({
  to,
  href,
  variant = 'amber',
  icon: Icon = ArrowUpRight,
  showIcon = true,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${VARIANTS[variant] || VARIANTS.amber} ${className}`

  const iconEl = showIcon && Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> : null

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
        {iconEl}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
        {iconEl}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
      {iconEl}
    </button>
  )
}
