/** Pequeno rótulo com traço lateral usado acima dos títulos de seção. */
export default function SectionEyebrow({ children, tone = 'light', className = '' }) {
  const toneClass = tone === 'dark' ? 'text-accent-700' : 'text-accent-400'

  return (
    <span
      className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] ${toneClass} ${className}`}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
      {children}
    </span>
  )
}
