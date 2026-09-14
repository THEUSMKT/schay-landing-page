import { Building2, Home, LandPlot } from 'lucide-react'
import PlaceholderPhoto from './PlaceholderPhoto'

/**
 * Imagem de um card de imóvel. Hoje sempre renderiza uma ilustração de
 * placeholder (ver PlaceholderPhoto) porque os imóveis em src/data/properties.js
 * são exemplos fictícios.
 *
 * Para usar uma foto real de um imóvel:
 *   1. Importe a imagem no topo deste arquivo, ex:
 *        import fotoCasaCentro from '../assets/imoveis/casa-centro.jpg'
 *   2. No objeto do imóvel em src/data/properties.js, troque `image`
 *      de `{ kind: 'house', variant: 1 }` para `{ src: fotoCasaCentro }`.
 *   3. Este componente detecta `image.src` automaticamente e usa <img>
 *      no lugar da ilustração — nenhum outro arquivo precisa mudar.
 */

const KIND_CONFIG = {
  apartment: { Icon: Building2, label: 'Foto ilustrativa · apartamento' },
  house: { Icon: Home, label: 'Foto ilustrativa · casa' },
  land: { Icon: LandPlot, label: 'Foto ilustrativa · terreno' },
}

const VARIANT_GRADIENTS = {
  1: 'from-navy-700 via-navy-850 to-navy-950',
  2: 'from-navy-600 via-navy-800 to-navy-950',
  3: 'from-navy-800 via-navy-700 to-navy-950',
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
  const config = KIND_CONFIG[kind] || KIND_CONFIG.house
  const gradientClassName = VARIANT_GRADIENTS[variant] || VARIANT_GRADIENTS[1]

  return (
    <PlaceholderPhoto
      icon={config.Icon}
      gradientClassName={gradientClassName}
      iconClassName="h-28 w-28 sm:h-32 sm:w-32"
      label={config.label}
      className={className}
    />
  )
}
