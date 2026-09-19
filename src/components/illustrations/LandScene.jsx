/**
 * Ilustração do banner "Terrenos e oportunidades" — lote vazio em fase
 * inicial, com casas vizinhas ao fundo para dar contexto de bairro
 * residencial simples. Ilustração vetorial original (ver nota em
 * HeroScene.jsx).
 */
export default function LandScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 800 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Ilustração de um terreno vazio em um bairro residencial simples"
    >
      <defs>
        <linearGradient id="landSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#89b0d6" />
          <stop offset="100%" stopColor="#eaf1e4" />
        </linearGradient>
      </defs>

      <rect width="800" height="900" fill="url(#landSky)" />
      <circle cx="640" cy="150" r="54" fill="#fff6df" opacity="0.85" />

      {/* casas vizinhas ao fundo, silhuetas simples */}
      <g fill="#a9c2a0">
        <polygon points="30,470 110,410 190,470" />
        <rect x="40" y="470" width="140" height="90" />
      </g>
      <g fill="#b7ab8e">
        <polygon points="600,450 690,385 780,450" />
        <rect x="612" y="450" width="156" height="100" />
      </g>

      {/* terreno gramado */}
      <path d="M0,600 Q260,565 400,585 T800,570 L800,900 L0,900 Z" fill="#93bb78" />
      <path d="M0,660 Q300,630 500,645 T800,635 L800,900 L0,900 Z" fill="#79a862" />

      {/* estacas e corda demarcando o lote */}
      <g stroke="#8a6a3f" strokeWidth="6" fill="#8a6a3f">
        <rect x="120" y="600" width="10" height="60" />
        <rect x="380" y="580" width="10" height="60" />
        <rect x="650" y="605" width="10" height="60" />
        <path d="M125,610 Q380,585 655,614" fill="none" strokeDasharray="10 8" />
      </g>

      {/* pequena pilha de tijolos/entulho — obra em fase inicial */}
      <g>
        <rect x="470" y="700" width="46" height="20" fill="#b5654a" />
        <rect x="490" y="682" width="46" height="20" fill="#c17958" />
        <rect x="465" y="664" width="46" height="20" fill="#b5654a" />
      </g>

      {/* placa de "vende-se", sem texto (evita conflito com o título do card por cima) */}
      <g>
        <rect x="240" y="700" width="10" height="90" fill="#7c5a3a" />
        <rect
          x="190"
          y="640"
          width="130"
          height="66"
          rx="4"
          fill="#f4efe0"
          stroke="#c9c0a6"
          strokeWidth="3"
        />
        <rect x="210" y="660" width="90" height="10" rx="3" fill="#c9c0a6" />
        <rect x="210" y="680" width="60" height="10" rx="3" fill="#c9c0a6" />
      </g>
    </svg>
  )
}
