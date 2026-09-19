/**
 * Ilustração do banner "Casas" — casa térrea simples, de padrão
 * médio/popular, com uma pequena família em frente. Ilustração vetorial
 * original (ver nota em HeroScene.jsx sobre a limitação de acesso a fotos).
 */
export default function HouseScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 800 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Ilustração de uma casa térrea simples com uma família em frente"
    >
      <defs>
        <linearGradient id="houseSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fa8cc" />
          <stop offset="100%" stopColor="#d7e6f0" />
        </linearGradient>
      </defs>

      <rect width="800" height="900" fill="url(#houseSky)" />
      <circle cx="620" cy="150" r="60" fill="#fff6df" opacity="0.9" />

      <path d="M0,560 Q220,520 400,545 T800,530 L800,900 L0,900 Z" fill="#8fb573" />
      <path d="M0,620 Q260,590 500,605 T800,595 L800,900 L0,900 Z" fill="#6f9c57" />

      {/* árvore */}
      <g>
        <rect x="86" y="470" width="16" height="110" fill="#6b4a30" />
        <circle cx="94" cy="430" r="56" fill="#4d7d3f" />
        <circle cx="52" cy="458" r="38" fill="#588a49" />
        <circle cx="136" cy="458" r="38" fill="#588a49" />
      </g>

      {/* casa térrea — corpo branco/azul claro, distinta da amarela do hero */}
      <g>
        <polygon points="220,430 400,330 580,430" fill="#5f7c93" />
        <rect x="240" y="430" width="320" height="210" fill="#f4f2ea" />
        <rect x="240" y="430" width="320" height="14" fill="#e3ded0" />

        <rect x="270" y="480" width="70" height="70" rx="3" fill="#a9d4ea" />
        <rect x="300" y="480" width="8" height="70" fill="#ffffff" />
        <rect x="270" y="510" width="70" height="8" fill="#ffffff" />

        <rect x="460" y="480" width="70" height="70" rx="3" fill="#a9d4ea" />
        <rect x="490" y="480" width="8" height="70" fill="#ffffff" />
        <rect x="460" y="510" width="70" height="8" fill="#ffffff" />

        <rect x="368" y="540" width="64" height="100" rx="2" fill="#7c5a3a" />
        <circle cx="416" cy="592" r="3.5" fill="#eecf8f" />

        <rect x="230" y="638" width="340" height="12" fill="#c7b48a" />
      </g>

      {/* família */}
      <g fill="#2c3a52">
        <circle cx="330" cy="672" r="18" />
        <path d="M304,696 q26,-18 52,0 l-5,72 q-21,13 -42,0 z" />

        <circle cx="378" cy="694" r="12" />
        <path d="M363,712 q15,-11 30,0 l-4,46 q-11,8 -22,0 z" />

        <circle cx="422" cy="670" r="18" />
        <path d="M396,694 q26,-18 52,0 l-5,74 q-21,13 -42,0 z" />
      </g>
    </svg>
  )
}
