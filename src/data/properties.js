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
 * POLÍTICA DE DADOS (importante): PROPERTIES só pode conter imóveis reais,
 * com foto e dados conferidos. NUNCA adicione um imóvel fictício/placeholder
 * aqui pra "preencher" uma categoria — se uma categoria não tem nenhum
 * imóvel real no momento, `getPropertiesByCategory` retorna uma lista vazia
 * de propósito, e a página da categoria mostra um estado vazio (ver
 * EmptyCategoryState) convidando a pessoa a falar com a Schay pelo
 * WhatsApp em vez de exibir cards inventados. O campo `isExample` existe só
 * por segurança (getPropertiesByCategory filtra qualquer imóvel marcado
 * assim antes de chegar na tela) — não é o mecanismo normal de trabalho.
 *
 * Para publicar um imóvel real:
 *   1. Importe a foto no topo deste arquivo.
 *   2. Adicione um objeto novo no fim da categoria correspondente dentro de
 *      PROPERTIES, com: title, neighborhood, city, areaM2, areaType
 *      ('lot' = terreno, 'built' = área construída/privativa, ou `null`
 *      quando o tipo não foi confirmado no anúncio original — NUNCA
 *      presuma), bedroomsLabel e, se souber, priceLabel (ex: 'R$ 329.000' —
 *      opcional, o card só mostra o preço quando esse campo existe).
 *      Por pedido da Schay, os cards NÃO mostram código de anúncio — não
 *      preencha `code` em nenhum imóvel novo.
 *   3. `image: { src: fotoImportada, alt: '...' }`.
 *
 * Imóveis que não são "casa com quartos" (ex: em Terrenos e oportunidades)
 * usam campos opcionais no lugar de areaM2/areaType/bedroomsLabel — o card
 * mostra só os que existirem:
 *   - typeLabel: selo do card ('Casa comercial', 'Sítio', 'Terreno'...);
 *     sem ele, o selo usa o `tag` da categoria.
 *   - areas: [{ label: 'Área total', m2: 3988 }, ...] — com o nome exato
 *     usado no anúncio (nunca converta "área total" em "área do terreno").
 *   - bedrooms / suites, rooms (salas), bathrooms, parkingSpaces (vagas).
 *   - frontM / backM: medidas de frente e fundos, em metros.
 *
 * Enquanto algum dado ainda não chegou, use 'Título a informar' /
 * 'Bairro a informar' / 'Quartos a informar', `areaM2: null` (o card mostra
 * "Metragem a informar" automaticamente) ou `areaType: null` (o card mostra
 * "tipo a confirmar" ao lado da metragem) — nunca invente o valor. NUNCA
 * reordene ou troque o `id` de um imóvel já publicado: a ordem dos cards em
 * cada página segue a ordem deste array, e cada novo imóvel enviado depois
 * entra no final da lista da categoria, sem mexer nos anteriores.
 *
 * O botão "Saiba mais" de cada card monta a mensagem do WhatsApp
 * automaticamente a partir do tipo (typeLabel ou tag da categoria),
 * `neighborhood`, `city` e, quando existe, `priceLabel` — nunca a partir de
 * título, metragens ou quartos, que só deixariam a mensagem mais longa sem
 * ajudar a identificar o imóvel. Por isso é importante manter
 * `neighborhood` e `city` sempre preenchidos.
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
// essa ordem estável conforme novos imóveis forem chegando.
import casasImovel03 from '../assets/images/imoveis/casas-03.webp'
import casasImovel04 from '../assets/images/imoveis/casas-04.webp'
import casasImovel05 from '../assets/images/imoveis/casas-05.webp'
import casasImovel06 from '../assets/images/imoveis/casas-06.webp'
import casasImovel07 from '../assets/images/imoveis/casas-07.webp'
import casasImovel08 from '../assets/images/imoveis/casas-08-lomba-grande.webp'

// Fotos reais de "Terrenos e oportunidades" (fornecidas pela Schay), na
// mesma ordem dos cards em /terrenos-e-oportunidades.
import terrenosCasaComercial from '../assets/images/imoveis/terrenos-01-casa-comercial.webp'
import terrenosSitio from '../assets/images/imoveis/terrenos-02-sitio.webp'
import terrenosTerreno from '../assets/images/imoveis/terrenos-03-terreno.webp'

// Fotos reais de "Apartamentos" (fornecidas pela Schay), na mesma ordem dos
// cards em /apartamentos.
import apartamentoPortoMunique from '../assets/images/imoveis/apartamentos-01-porto-munique.webp'
import apartamentoKaspary from '../assets/images/imoveis/apartamentos-02-edificio-kaspary.webp'

// Categorias disponíveis. `slug` define a rota (ex: /apartamentos).
export const CATEGORIES = {
  apartamentos: {
    slug: 'apartamentos',
    path: '/apartamentos',
    tag: 'Apartamento',
    kind: 'apartment',
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
    bannerImage: fotoTerrenos,
    navLabel: 'Terrenos e oportunidades',
    ctaLabel: 'Ver terrenos e oportunidades',
    bannerTitle: 'Terrenos e oportunidades em São Leopoldo e região',
    pageTitle: 'Terrenos e oportunidades em São Leopoldo e região',
    pageIntro:
      'Terrenos, sítios e oportunidades comerciais em São Leopoldo, Nova Petrópolis e região — para construir do zero, viver mais perto da natureza ou investir no próprio negócio.',
    heroKicker: 'Terrenos e oportunidades',
  },
}

export const CATEGORY_LIST = Object.values(CATEGORIES)

// Imóveis reais. Categorias sem nenhum imóvel aqui (hoje, apartamentos)
// mostram o estado vazio — ver EmptyCategoryState — em vez de cards
// fictícios.
export const PROPERTIES = [
  // ----------------------------------------------------------------------- Casas
  // Imóveis reais (fotos + dados enviados pela Schay, extraídos de anúncios
  // da Innovar Imobiliária). Não reordene nem troque o `id` de uma entrada
  // já publicada — novos imóveis entram no fim da lista, como casa-06,
  // casa-07 etc.
  {
    id: 'casa-03',
    category: 'casas',
    title: 'Casa térrea em ótima localização',
    neighborhood: 'Campestre',
    city: 'São Leopoldo / RS',
    // Só a área do terreno estava visível no anúncio (450 m²); não havia
    // área construída/privativa informada — por isso areaType: 'lot', pra
    // o card deixar claro que não é a área construída da casa.
    areaM2: 450,
    areaType: 'lot',
    bedroomsLabel: '2 quartos',
    price: 636000,
    priceLabel: 'R$ 636.000',
    image: { src: casasImovel03, alt: 'Casa térrea à venda no bairro Campestre, São Leopoldo' },
    isExample: false,
  },
  {
    id: 'casa-04',
    category: 'casas',
    title: 'Casa aconchegante em Estância Velha',
    neighborhood: 'Campo Grande',
    city: 'Estância Velha / RS',
    // Metragem não estava visível/legível na captura enviada — mantido
    // como "a informar" (não inventar dado), conforme pedido.
    areaM2: null,
    areaType: null,
    bedroomsLabel: '2 quartos',
    price: 295000,
    priceLabel: 'R$ 295.000',
    image: { src: casasImovel04, alt: 'Casa à venda no bairro Campo Grande, Estância Velha' },
    isExample: false,
  },
  {
    id: 'casa-05',
    category: 'casas',
    title: 'Casa com 3 quartos à venda',
    neighborhood: 'Cristo Rei',
    city: 'São Leopoldo / RS',
    // Tipo de área (terreno x construída) não foi confirmado no anúncio
    // original — não presumir; o card mostra "tipo a confirmar".
    areaM2: 300.9,
    areaType: null,
    bedroomsLabel: '3 quartos (1 suíte)',
    price: 980000,
    priceLabel: 'R$ 980.000',
    image: { src: casasImovel05, alt: 'Casa à venda no bairro Cristo Rei, São Leopoldo' },
    isExample: false,
  },
  {
    id: 'casa-06',
    category: 'casas',
    title: 'Sobrado com 2 quartos à venda',
    neighborhood: 'Campestre',
    city: 'São Leopoldo / RS',
    // sobrado em construção
    areaM2: 99,
    areaType: null,
    bedroomsLabel: '2 quartos',
    price: 580000,
    priceLabel: 'R$ 580.000',
    image: { src: casasImovel06, alt: 'Sobrado à venda no bairro Campestre, São Leopoldo' },
    isExample: false,
  },
  {
    id: 'casa-07',
    category: 'casas',
    title: 'Casa de alvenaria na São Borja',
    neighborhood: 'Fazenda São Borja',
    city: 'São Leopoldo / RS',
    areaM2: 108,
    areaType: null,
    bedroomsLabel: '2 quartos',
    price: 421880,
    priceLabel: 'R$ 421.880',
    image: { src: casasImovel07, alt: 'Casa à venda na Fazenda São Borja, São Leopoldo' },
    isExample: false,
  },
  {
    id: 'casa-08-sobrado-lomba-grande',
    category: 'casas',
    title: 'Sobrado moderno em Lomba Grande',
    neighborhood: 'Lomba Grande',
    city: 'Novo Hamburgo / RS',
    areas: [
      { label: 'Área total', m2: 150 },
      { label: 'Área do terreno', m2: 300 },
    ],
    bedrooms: 2,
    suites: 2,
    bathrooms: 4,
    parkingSpaces: 2,
    price: 990000,
    priceLabel: 'R$ 990.000',
    image: {
      src: casasImovel08,
      alt: 'Sobrado moderno de arquitetura contemporânea à venda no Residencial Mirante do Vale, bairro Lomba Grande, Novo Hamburgo',
    },
    isExample: false,
  },

  // ------------------------------------------------ Terrenos e oportunidades
  // Esta categoria reúne tipos diferentes de imóvel, então cada um tem o seu
  // `typeLabel` (selo do card) e só as características informadas no
  // anúncio — `areas` mantém o nome exato de cada metragem, sem presumir se
  // é terreno ou área construída.
  {
    id: 'terreno-01-casa-comercial-boemios',
    category: 'terrenos',
    typeLabel: 'Casa comercial',
    title: 'Casa comercial com 3 salas à venda',
    neighborhood: 'Boêmios',
    city: 'Nova Petrópolis / RS',
    areas: [
      { label: 'Área total', m2: 3988 },
      { label: 'Área privativa', m2: 521 },
    ],
    rooms: 3,
    bathrooms: 3,
    parkingSpaces: 3,
    price: 5100000,
    priceLabel: 'R$ 5.100.000',
    image: {
      src: terrenosCasaComercial,
      alt: 'Casa comercial amarela de estilo colonial à venda no bairro Boêmios, Nova Petrópolis, fotografada ao anoitecer, com vistas aéreas do terreno em destaque',
    },
    isExample: false,
  },
  {
    id: 'terreno-02-sitio-campestre',
    category: 'terrenos',
    typeLabel: 'Sítio',
    title: 'Sítio rural à venda no Campestre',
    neighborhood: 'Campestre',
    city: 'São Leopoldo / RS',
    areas: [{ label: 'Área do terreno', m2: 1009 }],
    bedrooms: 3,
    suites: 2,
    price: 742000,
    priceLabel: 'R$ 742.000',
    image: {
      src: terrenosSitio,
      alt: 'Entrada da casa do sítio rural à venda no bairro Campestre, São Leopoldo, com pérgola de madeira, paredes em tom terracota e muitas plantas',
    },
    isExample: false,
  },
  {
    id: 'terreno-03-fazenda-sao-borja',
    category: 'terrenos',
    typeLabel: 'Terreno',
    title: 'Terreno na Fazenda São Borja',
    neighborhood: 'Fazenda São Borja',
    city: 'São Leopoldo / RS',
    areas: [{ label: 'Área do terreno', m2: 360 }],
    frontM: 12,
    backM: 30,
    price: 137800,
    priceLabel: 'R$ 137.800',
    image: {
      src: terrenosTerreno,
      alt: 'Terreno à venda na Fazenda São Borja, São Leopoldo, com horta cultivada, árvores ao fundo e vista para os morros',
    },
    isExample: false,
  },

  // ----------------------------------------------------------------- Apartamentos
  {
    id: 'apartamento-01-porto-munique',
    category: 'apartamentos',
    title: 'Apartamento com 2 dormitórios no Porto Munique',
    neighborhood: 'Condomínio Porto Munique',
    city: 'São Leopoldo / RS',
    areas: [{ label: 'Área (aproximada)', m2: 41 }],
    bedrooms: 2,
    parkingSpaces: 1,
    price: 165000,
    priceLabel: 'R$ 165.000',
    image: {
      src: apartamentoPortoMunique,
      alt: 'Fachada do condomínio Porto Munique à venda em São Leopoldo, com guarita e céu azul com nuvens',
    },
    isExample: false,
  },
  {
    id: 'apartamento-02-edificio-kaspary',
    category: 'apartamentos',
    // Desocupado (imediato pra mudança) — sem campo próprio no card, mas
    // vale mencionar pra Schay no atendimento.
    title: 'Apartamento térreo de frente no Edifício Kaspary',
    neighborhood: 'Centro',
    city: 'São Leopoldo / RS',
    areas: [{ label: 'Área privativa', m2: 114.31 }],
    bedrooms: 2,
    suites: 1,
    price: 392000,
    priceLabel: 'R$ 392.000',
    image: {
      src: apartamentoKaspary,
      alt: 'Fachada do Edifício Kaspary à venda no Centro de São Leopoldo, na Rua José Bonifácio',
    },
    isExample: false,
  },
]

/**
 * Retorna os imóveis reais de uma categoria (pela slug usada na
 * URL/CATEGORIES). Filtra `isExample` por segurança — mesmo que um imóvel
 * fictício seja adicionado por engano, ele nunca chega à vitrine pública.
 * Lista vazia é um resultado válido e esperado: a página da categoria
 * mostra o estado vazio nesse caso, em vez de inventar conteúdo.
 */
export function getPropertiesByCategory(categorySlug) {
  return PROPERTIES.filter(
    (property) => property.category === categorySlug && !property.isExample,
  )
}
