/**
 * ============================================================================
 * FONTE ÚNICA DE DADOS — imóveis e categorias
 * ============================================================================
 *
 * Este arquivo concentra TODO o conteúdo dos imóveis mostrados no site:
 * os 3 cards da vitrine na Home e os 3 imóveis de cada página de categoria
 * (/apartamentos, /casas, /terrenos-e-oportunidades).
 *
 * Os imóveis abaixo são EXEMPLOS FICTÍCIOS (isExample: true) só para validar
 * o layout. Para publicar imóveis reais:
 *
 *   1. Duplique um objeto dentro de PROPERTIES (ou edite um existente).
 *   2. Preencha title, neighborhood, city, areaM2, bedroomsLabel, priceLabel.
 *   3. Troque isExample para false (isso remove o selo "Imóvel de exemplo").
 *   4. Para usar uma foto real em vez da ilustração de placeholder, importe
 *      a imagem no topo de src/components/PropertyMedia.jsx e associe o
 *      novo `image` a ela (veja o comentário nesse arquivo).
 *
 * Nada mais no site precisa ser tocado: a Home e as 3 páginas de categoria
 * são geradas automaticamente a partir desta lista.
 */

// Categorias disponíveis. `slug` define a rota (ex: /apartamentos).
export const CATEGORIES = {
  apartamentos: {
    slug: 'apartamentos',
    path: '/apartamentos',
    tag: 'Apartamento',
    navLabel: 'Apartamentos',
    ctaLabel: 'Ver apartamentos',
    pageTitle: 'Apartamentos à venda em São Leopoldo e região',
    pageIntro:
      'Praticidade e boa localização para quem busca um novo endereço para chamar de seu.',
    heroKicker: 'Apartamentos',
  },
  casas: {
    slug: 'casas',
    path: '/casas',
    tag: 'Casa',
    navLabel: 'Casas',
    ctaLabel: 'Ver casas',
    pageTitle: 'Casas à venda em São Leopoldo e região',
    pageIntro:
      'Espaço para a família viver com conforto, do quintal à sala de estar.',
    heroKicker: 'Casas',
  },
  terrenos: {
    slug: 'terrenos',
    path: '/terrenos-e-oportunidades',
    tag: 'Terreno',
    navLabel: 'Terrenos e oportunidades',
    ctaLabel: 'Ver terrenos e oportunidades',
    pageTitle: 'Terrenos e oportunidades em São Leopoldo e região',
    pageIntro:
      'Para quem quer planejar o próximo passo do zero, com liberdade para construir.',
    heroKicker: 'Terrenos e oportunidades',
  },
}

export const CATEGORY_LIST = Object.values(CATEGORIES)

// Imóveis — 3 por categoria. O primeiro de cada categoria é o que aparece
// na vitrine da Home; todos os 3 aparecem na respectiva página de categoria.
export const PROPERTIES = [
  // ---------------------------------------------------------------- Apartamentos
  {
    id: 'apartamento-01',
    category: 'apartamentos',
    title: 'Apartamento para viver bem',
    neighborhood: 'Bairro a informar',
    city: 'São Leopoldo / RS',
    areaM2: 65,
    bedroomsLabel: '2 quartos',
    priceLabel: 'Consulte valores',
    image: { kind: 'apartment', variant: 1 },
    isExample: true,
  },
  {
    id: 'apartamento-02',
    category: 'apartamentos',
    title: 'Apartamento com varanda gourmet',
    neighborhood: 'Bairro a informar',
    city: 'São Leopoldo / RS',
    areaM2: 78,
    bedroomsLabel: '3 quartos',
    priceLabel: 'Consulte valores',
    image: { kind: 'apartment', variant: 2 },
    isExample: true,
  },
  {
    id: 'apartamento-03',
    category: 'apartamentos',
    title: 'Apartamento compacto e bem localizado',
    neighborhood: 'Bairro a informar',
    city: 'São Leopoldo / RS',
    areaM2: 48,
    bedroomsLabel: '1 quarto',
    priceLabel: 'Consulte valores',
    image: { kind: 'apartment', variant: 3 },
    isExample: true,
  },

  // ----------------------------------------------------------------------- Casas
  {
    id: 'casa-01',
    category: 'casas',
    title: 'Casa com jardim privativo',
    neighborhood: 'Bairro a informar',
    city: 'São Leopoldo / RS',
    areaM2: 120,
    bedroomsLabel: '3 quartos',
    priceLabel: 'Consulte valores',
    image: { kind: 'house', variant: 1 },
    isExample: true,
  },
  {
    id: 'casa-02',
    category: 'casas',
    title: 'Casa térrea para a família',
    neighborhood: 'Bairro a informar',
    city: 'São Leopoldo / RS',
    areaM2: 150,
    bedroomsLabel: '3 quartos',
    priceLabel: 'Consulte valores',
    image: { kind: 'house', variant: 2 },
    isExample: true,
  },
  {
    id: 'casa-03',
    category: 'casas',
    title: 'Casa com espaço para ampliar',
    neighborhood: 'Bairro a informar',
    city: 'São Leopoldo / RS',
    areaM2: 95,
    bedroomsLabel: '2 quartos',
    priceLabel: 'Consulte valores',
    image: { kind: 'house', variant: 3 },
    isExample: true,
  },

  // -------------------------------------------------------------------- Terrenos
  {
    id: 'terreno-01',
    category: 'terrenos',
    title: 'Um lugar para o seu projeto',
    neighborhood: 'Bairro a informar',
    city: 'São Leopoldo / RS',
    areaM2: 300,
    bedroomsLabel: 'Sem quartos (terreno)',
    priceLabel: 'Consulte valores',
    image: { kind: 'land', variant: 1 },
    isExample: true,
  },
  {
    id: 'terreno-02',
    category: 'terrenos',
    title: 'Terreno plano, pronto para construir',
    neighborhood: 'Bairro a informar',
    city: 'São Leopoldo / RS',
    areaM2: 360,
    bedroomsLabel: 'Sem quartos (terreno)',
    priceLabel: 'Consulte valores',
    image: { kind: 'land', variant: 2 },
    isExample: true,
  },
  {
    id: 'terreno-03',
    category: 'terrenos',
    title: 'Terreno em condomínio fechado',
    neighborhood: 'Bairro a informar',
    city: 'São Leopoldo / RS',
    areaM2: 250,
    bedroomsLabel: 'Sem quartos (terreno)',
    priceLabel: 'Consulte valores',
    image: { kind: 'land', variant: 3 },
    isExample: true,
  },
]

/** Retorna os imóveis de uma categoria (pela slug usada na URL/CATEGORIES). */
export function getPropertiesByCategory(categorySlug) {
  return PROPERTIES.filter((property) => property.category === categorySlug)
}

/** Retorna o imóvel de destaque (1º cadastrado) de cada categoria — usado na Home. */
export function getFeaturedProperties() {
  return CATEGORY_LIST.map((category) =>
    PROPERTIES.find((property) => property.category === category.slug),
  ).filter(Boolean)
}
