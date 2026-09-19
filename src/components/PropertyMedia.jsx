import { SCENE_BY_KIND } from './illustrations'

/**
 * Imagem de um card de imóvel (páginas de categoria). Hoje sempre renderiza
 * a ilustração da categoria (ver src/components/illustrations) porque os
 * imóveis em src/data/properties.js são exemplos fictícios — a `variant`
 * só varia um pouco o enquadramento (espelhado / tom) pra não repetir a
 * mesma imagem exata nos 3 exemplos de uma categoria.
 *
 * Para usar uma foto real de um imóvel:
 *   1. Importe a imagem no topo de src/data/properties.js, ex:
 *        import fotoCasaCentro from '../assets/imoveis/casa-centro.jpg'
 *   2. No objeto do imóvel, troque `image` de `{ kind: 'house', variant: 1 }`
 *      para `{ src: fotoCasaCentro }`.
 *   3. Este componente detecta `image.src` automaticamente e usa <img>
 *      no lugar da ilustração — nenhum outro arquivo precisa mudar.
 */
const VARIANT_STYLE = {
  1: {},
  2: { transform: 'scaleX(-1)' },
  3: { filter: 'hue-rotate(-8deg) saturate(1.05)' },
}

export default function PropertyMedia({ image, className = '' }) {
  if (image?.src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={image.src}
          alt={image.alt || ''}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const { kind, variant = 1 } = image || {}
  const Scene = SCENE_BY_KIND[kind] || SCENE_BY_KIND.house

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="h-full w-full" style={VARIANT_STYLE[variant] || undefined}>
        <Scene className="h-full w-full" />
      </div>
    </div>
  )
}
