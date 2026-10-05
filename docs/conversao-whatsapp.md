# Revisão de conversão — 05/10/2026

Abertura focada em compradores, CTA direto, catálogo real em grade, busca com envio de preferências, provas de vendas antecipadas e formulário opcional. Contato e fotos preservados. Proprietários possuem chamadas secundárias.

## Configurações externas pendentes

- Fornecer os IDs corretos de GTM/GA4/Google Ads. Nenhuma tag de outro projeto foi copiada.
- O módulo src/lib/analytics.js prepara property_search, search_no_results e whatsapp_click. Não há envio a fornecedores nem armazenamento persistente nesta implementação.
- A futura integração de consentimento deve definir window.schayAnalyticsConsent = true apenas após autorização para mensuração; definir false ao revogar. Eventos anteriores não são armazenados/reprocessados. Configurar também o consentimento das próprias tags e desabilitar a captura de link_url/link_text e parâmetros livres em medições automáticas, pois links wa.me podem conter mensagem pessoal.
- Usar somente os campos permitidos: página, posicionamento, categoria, referência, intenção, faixa de preço e quantidade. Os campos do contato não entram no dataLayer.
- Um clique de WhatsApp NÃO confirma conversa ou venda. Definir processo de atendimento/CRM para registrar conversa, lead qualificado, visita e venda. Associação a anúncios exige implementação específica de atribuição; não está pronta apenas com os eventos do site.
- Vincular Perfil da Empresa ao Google Ads via recursos de local. Verificar informações do perfil e fornecer sua URL oficial antes de inserir link ou avaliações no site.
- Destinos recomendados: /casas, /apartamentos e /terrenos-e-oportunidades, de acordo com a busca. Links com fragmento identificam ofertas específicas dentro da categoria.

## Dados para conferir com a Schay

- casa-04: metragem ausente.
- casa-05, casa-06, casa-07: tipo da área não confirmado. O atributo foi omitido dos cards, sem apagar os valores de origem.
- Confirmar relação atual com a Innovar antes de recolocar referência institucional.
- Confirmar periodicamente disponibilidade e preços. Nenhum preço foi alterado nesta revisão.
- Não foram inventadas avaliações, estatísticas, endereços, prazos ou garantias de financiamento.

## Validação

- npm run lint
- npm run build
- node --test tests/conversion.test.mjs
- Verificação em navegador: rotas, viewport móvel e desktop, filtros, links, eventos, console e rolagem horizontal.

## Publicação

A branch de revisão não aciona o workflow de produção. A publicação continua dependente do merge na branch de deploy. Não houve alteração nas permissões ou no gatilho de publicação.
