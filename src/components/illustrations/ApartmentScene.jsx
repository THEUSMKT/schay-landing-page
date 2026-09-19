/**
 * Ilustração do banner "Apartamentos" — prédio simples de padrão médio,
 * sem apelo de alto padrão. Ilustração vetorial original (ver nota em
 * HeroScene.jsx).
 */
export default function ApartmentScene({ className = '' }) {
  const windowRows = [0, 1, 2, 3, 4]
  const windowCols = [0, 1, 2, 3]

  return (
    <svg
      viewBox="0 0 800 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Ilustração de um prédio de apartamentos de padrão médio"
    >
      <defs>
        <linearGradient id="aptSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7996b8" />
          <stop offset="100%" stopColor="#dbe6ee" />
        </linearGradient>
      </defs>

      <rect width="800" height="900" fill="url(#aptSky)" />
      <circle cx="180" cy="140" r="52" fill="#fff6df" opacity="0.85" />

      <path d="M0,720 L800,720 L800,900 L0,900 Z" fill="#8fb573" />
      <path d="M0,760 L800,760 L800,900 L0,900 Z" fill="#6f9c57" />

      {/* prédio vizinho, mais baixo, pra dar contexto de bairro */}
      <rect x="40" y="480" width="150" height="260" fill="#c4a37c" />
      <rect x="560" y="440" width="160" height="300" fill="#b9926b" />

      {/* prédio principal */}
      <rect x="230" y="230" width="340" height="510" fill="#d8ac6f" />
      <rect x="230" y="230" width="340" height="18" fill="#c69a5c" />

      {/* grade de janelas */}
      {windowRows.map((row) =>
        windowCols.map((col) => {
          const x = 258 + col * 76
          const y = 268 + row * 84
          const lit = (row + col) % 3 !== 0
          return (
            <rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width="52"
              height="56"
              rx="2"
              fill={lit ? '#fbe6a8' : '#4c6478'}
            />
          )
        }),
      )}

      {/* entrada */}
      <rect x="352" y="640" width="96" height="100" rx="3" fill="#5c4128" />
      <rect x="352" y="640" width="96" height="10" fill="#e9d8b0" />

      {/* marquise */}
      <rect x="330" y="622" width="140" height="12" fill="#8a6a3f" />

      {/* árvores em frente */}
      <g>
        <rect x="190" y="700" width="12" height="46" fill="#6b4a30" />
        <circle cx="196" cy="670" r="34" fill="#588a49" />
      </g>
      <g>
        <rect x="600" y="700" width="12" height="46" fill="#6b4a30" />
        <circle cx="606" cy="670" r="34" fill="#4d7d3f" />
      </g>
    </svg>
  )
}
