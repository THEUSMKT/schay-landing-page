/**
 * Ilustração de fundo do hero: casa amarela simples com árvores e uma
 * família em frente. É uma ILUSTRAÇÃO vetorial original (não uma foto) —
 * não temos acesso a bancos de imagem neste ambiente (rede bloqueada por
 * política do provedor). Composição pensada pra sobreviver ao corte de
 * "cover" tanto em telas bem largas (corta em cima/embaixo) quanto bem
 * estreitas no mobile (corta nas laterais) — por isso casa e família ficam
 * concentradas perto do centro do viewBox. Troque por uma foto real quando
 * tiver: veja o comentário em Hero.jsx.
 */
export default function HeroScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 1000 560"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Ilustração de uma casa amarela com árvores e uma família em frente"
    >
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#587fa8" />
          <stop offset="55%" stopColor="#a9c3d8" />
          <stop offset="100%" stopColor="#f3dcb2" />
        </linearGradient>
        <radialGradient id="heroSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff3d6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1000" height="560" fill="url(#heroSky)" />
      <circle cx="800" cy="120" r="130" fill="url(#heroSun)" />
      <circle cx="800" cy="120" r="40" fill="#fff6e0" opacity="0.9" />

      {/* terreno */}
      <path d="M0,400 Q260,370 520,392 T1000,378 L1000,560 L0,560 Z" fill="#8fb573" />
      <path d="M0,445 Q300,420 600,434 T1000,428 L1000,560 L0,560 Z" fill="#6f9c57" />

      {/* árvore esquerda */}
      <g>
        <rect x="322" y="330" width="13" height="70" fill="#6b4a30" />
        <circle cx="328" cy="300" r="42" fill="#4d7d3f" />
        <circle cx="298" cy="320" r="30" fill="#588a49" />
        <circle cx="360" cy="320" r="30" fill="#588a49" />
      </g>

      {/* árvore direita */}
      <g>
        <rect x="718" y="318" width="15" height="82" fill="#5c3f28" />
        <circle cx="726" cy="284" r="48" fill="#4a7a3d" />
        <circle cx="690" cy="306" r="32" fill="#588a49" />
        <circle cx="762" cy="306" r="32" fill="#588a49" />
      </g>

      {/* casa */}
      <g>
        <polygon points="460,270 560,182 660,270" fill="#8a4a35" />
        <rect x="460" y="270" width="200" height="150" fill="#eab93a" />
        <rect x="460" y="270" width="200" height="12" fill="#d6a12c" />

        <rect x="612" y="200" width="22" height="46" fill="#7c4531" />

        <g>
          <rect x="480" y="308" width="46" height="46" rx="3" fill="#bfe1f2" />
          <rect x="500" y="308" width="6" height="46" fill="#ffffff" />
          <rect x="480" y="328" width="46" height="6" fill="#ffffff" />
        </g>
        <g>
          <rect x="596" y="308" width="46" height="46" rx="3" fill="#bfe1f2" />
          <rect x="616" y="308" width="6" height="46" fill="#ffffff" />
          <rect x="596" y="328" width="46" height="6" fill="#ffffff" />
        </g>

        <rect x="538" y="356" width="44" height="64" rx="2" fill="#6b4226" />
        <circle cx="572" cy="390" r="2.6" fill="#eecf8f" />

        <rect x="452" y="418" width="216" height="9" fill="#c9954a" />
      </g>

      {/* família em frente à casa */}
      <g fill="#2c3a52">
        <circle cx="535" cy="432" r="13" />
        <path d="M520,448 q15,-10 30,0 l-3,42 q-12,8 -24,0 z" />

        <circle cx="568" cy="444" r="9" />
        <path d="M557,455 q11,-8 22,0 l-2,30 q-9,6 -18,0 z" />

        <circle cx="598" cy="430" r="13" />
        <path d="M583,446 q15,-10 30,0 l-3,44 q-12,8 -24,0 z" />
      </g>
    </svg>
  )
}
