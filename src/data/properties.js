/**
 * ============================================================================
 * FONTE ÚNICA DE DADOS — imóveis e categorias
 * ============================================================================
 *
 * Este arquivo concentra TODO o conteúdo de categorias e imóveis do site:
 * - CATEGORIES alimenta os 3 banners de categoria na Home (Vitrine) e o
 *   cabeçalho de cada página de categoria.
 * - PROPERTIES alimenta os cards de imóvel dentro de cada página de
 *   categoria (/apartamentos, /casas, /terrenos-e-oportunidades).
 *
 * Categorias que ainda não têm fotos reais (isExample: true) usam imóveis
 * FICTÍCIOS só pra validar o layout. Para publicar um imóvel real:
 *
 *   1. Duplique um objeto dentro de PROPERTIES (ou edite um existente).
 *   2. Preencha title, neighborhood, city, areaM2, bedroomsLabel e, se
 *      souber o valor, priceLabel (ex: 'R$ 329.000' — opcional, o card só
 *      mostra o preço quando esse campo existe).
 *   3. Troque isExample para false (isso remove o selo "Imóvel de exemplo").
 *   4. Importe a foto no topo deste arquivo e troque `image` de
 *      `{ kind: 'house', variant: 1 }` (ilustração) para
 *      `{ src: fotoImportada, alt: '...' }` (foto real).
 *
 * Enquanto os dados de um imóvel com foto real ainda não chegaram, use
 * 'Título a informar' / 'Bairro a informar' / 'Quartos a informar' e
 * `areaM2: null` (o card mostra "Metragem a informar" automaticamente) —
 * é o padrão usado nos imóveis de "Casas" abaixo. NUNCA reordene ou troque
 * o `id` de um imóvel já publicado: a ordem dos cards em cada página segue
 * a ordem deste array, e cada novo imóvel enviado depois entra no final
 * da lista da categoria, sem mexer nos anteriores.
 *
 * O botão "Saiba mais" de cada card monta a mensagem do WhatsApp
 * automaticamente a partir de `neighborhood` (bairro) e, quando existe,
 * `areaM2` (metragem) — nunca a partir de `title`, porque o título é só um
 * nome comercial e não ajuda a corretora a identificar o imóvel exato
 * (vários imóveis podem ter títulos parecidos). Por isso é importante
 * manter `neighborhood` sempre preenchido com o bairro real assim que ele
 * chegar — é o dado que de fato diferencia um imóvel do outro.
 *
 * Nada mais no site precisa ser tocado: a Home e as 3 páginas de categoria
 * são geradas automaticamente a partir desta lista.
 */

// Fotos reais dos banners de categoria (Home). Se algum dia precisar tirar
// uma foto (voltando à ilustração de placeholder), basta remover a linha
// `bannerImage` correspondente — o CategoryBanner cai de volta na
// ilustração de `kind` automaticamente.
import fotoCasas from '../assets/images/categoria-casas.webp'
import fotoApartamentos from '../assets/images/categoria-apartamentos.webp'
import fotoTerrenos from '../assets/images/categoria-terrenos.webp'

// Fotos reais dos imóveis de "Casas" (fornecidas pela Schay). A ordem dos
// imports abaixo é a ordem em que os cards aparecem em /casas — mantenha
// essa ordem estável: quando os dados (título, bairro, m², quartos) de
// cada imóvel chegarem depois, "1º imóvel enviado" = casasImovel01, e
// assim por diante.
import casasImovel01 from '../assets/images/imoveis/casas-01.webp'
import casasImovel02 from '../assets/images/imoveis/casas-02.webp'
import casasImovel03 from '../assets/images/imoveis/casas-03.webp'
import casasImovel04 from '../assets/images/imoveis/casas-04.webp'
import casasImovel05 from '../assets/images/imoveis/casas-05.webp'
import casasImovel06 from '../assets/images/imoveis/casas-06.webp'
import casasImovel07 from '../assets/images/imoveis/casas-07.webp'

// Categorias disponíveis. `slug` define a rota (ex: /apartamentos).
export const CATEGORIES = {
  apartamentos: {
    slug: 'apartamentos',
    path: '/apartamentos',
    tag: 'Apartamento',
    kind: 'apartment',
    // Usado na mensagem de WhatsApp do "Saiba mais" (artigo + nome no
    // singular): "Olá! Gostaria de saber mais informações sobre
    // {messageLabel}...".
    messageLabel: 'o apartamento',
    bannerImage: fotoApartamentos,
    navLabel: 'Apartamentos',
    ctaLabel: 'Ver apartamentos',
    // Título do banner de categoria na Home (Vitrine).
    bannerTitle: 'Apartamentos em São Leopoldo e região',
    pageTitle: 'Apartamentos à venda em São Leopoldo e região',
    pageIntro:
      'Praticidade e boa localização para quem busca um novo endereço para chamar de seu.',
    heroKicker: 'Apartamentos',
  },
  casas: {
    slug: 'casas',
    path: '/casas',
    tag: 'Casa',
    kind: 'house',
    messageLabel: 'a casa',
    bannerImage: fotoCasas,
    navLabel: 'Casas',
    ctaLabel: 'Ver casas',
    bannerTitle: 'Casas em São Leopoldo e região',
    pageTitle: 'Casas à venda em São Leopoldo e região',
    pageIntro:
      'Espaço para a família viver com conforto, do quintal à sala de estar.',
    heroKicker: 'Casas',
  },
  terrenos: {
    slug: 'terrenos',
    path: '/terrenos-e-oportunidades',
    tag: 'Terreno',
    kind: 'land',
    messageLabel: 'o terreno',
    bannerImage: fotoTerrenos,
    navLabel: 'Terrenos e oportunidades',
    ctaLabel: 'Ver terrenos e oportunidades',
    bannerTitle: 'Terrenos e oportunidades em São Leopoldo e região',
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
    image: { kind: 'apartment', variant: 3 },
    isExample: true,
  },

  // ----------------------------------------------------------------------- Casas
  // Imóveis reais (fotos + dados enviados pela Schay, extraídos de anúncios
  // da Innovar Imobiliária). Não reordene nem troque o `id` de uma entrada
  // já publicada — novos imóveis entram no fim da lista, como casa-06,
  // casa-07 etc.
  {
    id: 'casa-01', // Card 1 · Código Innovar 52456
    category: 'casas',
    title: 'Casa aconchegante no bairro Campestre',
    neighborhood: 'Campestre',
    city: 'São Leopoldo / RS',
    areaM2: 67,
    bedroomsLabel: '2 quartos',
    priceLabel: 'R$ 329.000',
    image: { src: casasImovel01, alt: 'Foto do imóvel' },
    isExample: false,
  },
  {
    id: 'casa-02', // Card 2 · Código Innovar 43787
    category: 'casas',
    title: 'Casa com 4 quartos à venda',
    neighborhood: 'Campina',
    city: 'São Leopoldo / RS',
    areaM2: 116,
    bedroomsLabel: '4 quartos',
    priceLabel: 'R$ 200.000',
    image: { src: casasImovel02, alt: 'Foto do imóvel' },
    isExample: false,
  },
  {
    id: 'casa-03', // Card 3 · Código Innovar 9265
    category: 'casas',
    title: 'Casa térrea em ótima localização',
    neighborhood: 'Campestre',
    city: 'São Leopoldo / RS',
    // Só a área do terreno estava visível no anúncio (450 m²); não havia
    // área construída/privativa informada.
    areaM2: 450,
    bedroomsLabel: '2 quartos',
    priceLabel: 'R$ 636.000',
    image: { src: casasImovel03, alt: 'Foto do imóvel' },
    isExample: false,
  },
  {
    id: 'casa-04', // Card 4 · Código Innovar 36912
    category: 'casas',
    title: 'Casa aconchegante em Estância Velha',
    neighborhood: 'Campo Grande',
    city: 'Estância Velha / RS',
    // Metragem não estava visível/legível na captura enviada — mantido
    // como "a informar" (não inventar dado), conforme pedido.
    areaM2: null,
    bedroomsLabel: '2 quartos',
    priceLabel: 'R$ 295.000',
    image: { src: casasImovel04, alt: 'Foto do imóvel' },
    isExample: false,
  },
  {
    id: 'casa-05', // Card 5 · Código Innovar 46763
    category: 'casas',
    title: 'Casa com 3 quartos à venda',
    neighborhood: 'Cristo Rei',
    city: 'São Leopoldo / RS',
    areaM2: 300.9,
    bedroomsLabel: '3 quartos (1 suíte)',
    priceLabel: 'R$ 980.000',
    image: { src: casasImovel05, alt: 'Foto do imóvel' },
    isExample: false,
  },
  {
    id: 'casa-06', // Card 6 · Código Innovar 74350 (sobrado em construção)
    category: 'casas',
    title: 'Sobrado com 2 quartos à venda',
    neighborhood: 'Campestre',
    city: 'São Leopoldo / RS',
    areaM2: 99,
    bedroomsLabel: '2 quartos',
    priceLabel: 'R$ 580.000',
    image: { src: casasImovel06, alt: 'Foto do imóvel' },
    isExample: false,
  },
  {
    id: 'casa-07', // Card 7 · Código Innovar 45917
    category: 'casas',
    title: 'Casa de alvenaria na São Borja',
    neighborhood: 'Fazenda São Borja',
    city: 'São Leopoldo / RS',
    areaM2: 108,
    bedroomsLabel: '2 quartos',
    priceLabel: 'R$ 421.880',
    image: { src: casasImovel07, alt: 'Foto do imóvel' },
    isExample: false,
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
    image: { kind: 'land', variant: 3 },
    isExample: true,
  },
]

/** Retorna os imóveis de uma categoria (pela slug usada na URL/CATEGORIES). */
export function getPropertiesByCategory(categorySlug) {
  return PROPERTIES.filter((property) => property.category === categorySlug)
}
