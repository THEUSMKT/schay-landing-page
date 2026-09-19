import venda01 from '../assets/images/vendas/venda-01.webp'
import venda02 from '../assets/images/vendas/venda-02.webp'
import venda03 from '../assets/images/vendas/venda-03.webp'

/**
 * Histórias reais de vendas concluídas (seção "Histórias reais" /
 * "Transformando histórias"). Fotos reais dos fechamentos — pra adicionar
 * mais uma, importe a foto no topo deste arquivo e acrescente um objeto
 * novo no fim do array (não precisa mexer em mais nada).
 */
export const SALES_STORIES = [
  {
    id: 'venda-01',
    kicker: 'Casa vendida · Contrato fechado',
    title: 'Um novo capítulo começou aqui',
    description:
      'Registro real de um contrato de compra e venda de casa concluído com a Schay.',
    image: { src: venda01, alt: 'Fechamento de contrato de compra e venda de casa' },
  },
  {
    id: 'venda-02',
    kicker: 'Casa vendida · Contrato fechado',
    title: 'Mais uma família encontrou seu lugar',
    description: 'Outro contrato fechado: mais uma venda de casa realizada pela Schay.',
    image: { src: venda02, alt: 'Fechamento de contrato de compra e venda de casa' },
  },
  {
    id: 'venda-03',
    kicker: 'Casa vendida · Contrato fechado',
    title: 'Outro sonho se tornou realidade',
    description: 'Mais uma conquista: chaves entregues, negócio fechado com a Schay.',
    image: { src: venda03, alt: 'Fechamento de contrato de compra e venda de casa' },
  },
]
