import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  scoreLead,
  isHighBudget,
  matchProperties,
  buildLeadMessage,
  buildLeadPayload,
  formatPhone,
  isValidPhone,
  sendLead,
} from '../src/lib/lead.js'
import { readAttribution } from '../src/lib/attribution.js'
import { trackEvent } from '../src/lib/analytics.js'

const hot = { objetivo: 'morar', tipo: 'casa', regiao: 'sao-leopoldo', orcamento: '300-500', pagamento: 'aprovado', prazo: '30-dias' }

test('scoring: quente, morno e frio nos limites', () => {
  assert.deepEqual(scoreLead(hot), { pontos: 9, temperatura: 'Quente' })
  // 2 + 1 + 3 + 1 = 7
  assert.equal(scoreLead({ ...hot, pagamento: 'financiar' }).temperatura, 'Quente')
  // 2 + 1 + 2 + 1 = 6
  assert.deepEqual(scoreLead({ ...hot, pagamento: 'financiar', prazo: '1-3-meses' }), { pontos: 6, temperatura: 'Morno' })
  // 2 + 1 + 1 + 0 = 4
  assert.equal(scoreLead({ ...hot, orcamento: 'ate-150', pagamento: 'fgts', prazo: '3-6-meses' }).temperatura, 'Morno')
  // 0 + 1 + 1 + 1 = 3
  assert.deepEqual(scoreLead({ ...hot, objetivo: 'pesquisando', pagamento: 'fgts', prazo: '3-6-meses' }), { pontos: 3, temperatura: 'Frio' })
  assert.equal(scoreLead({}).temperatura, 'Frio')
})

test('quem está só pesquisando ou sem pressa nunca é quente', () => {
  // 2 + 3 + 0 + 1 = 6 → morno de qualquer jeito
  assert.equal(scoreLead({ ...hot, prazo: 'sem-pressa' }).temperatura, 'Morno')
  // 0 + 3 + 3 + 1 = 7 → seria quente, fica morno
  assert.deepEqual(scoreLead({ ...hot, objetivo: 'pesquisando' }), { pontos: 7, temperatura: 'Morno' })
})

test('orçamento alto começa em R$ 200 mil', () => {
  assert.equal(isHighBudget({ orcamento: 'ate-150' }), false)
  assert.equal(isHighBudget({ orcamento: '150-200' }), false)
  assert.equal(isHighBudget({ orcamento: '200-300' }), true)
  assert.equal(isHighBudget({ orcamento: 'acima-1000' }), true)
  assert.equal(isHighBudget({}), false)
})

test('imóveis no orçamento respeitam preço, tipo e cidade', () => {
  const props = [
    { id: 'a', category: 'apartamentos', city: 'São Leopoldo / RS', price: 165000 },
    { id: 'b', category: 'apartamentos', city: 'São Leopoldo / RS', price: 198000 },
    { id: 'c', category: 'terrenos', city: 'São Leopoldo / RS', price: 137800 },
    { id: 'd', category: 'casas', city: 'Novo Hamburgo / RS', price: 140000 },
    { id: 'e', category: 'apartamentos', city: 'São Leopoldo / RS', price: null },
    { id: 'f', category: 'apartamentos', city: 'São Leopoldo / RS', price: 120000, isExample: true },
  ]
  const ids = (answers) => matchProperties(props, answers).map((p) => p.id)
  assert.deepEqual(ids({ orcamento: '150-200', tipo: 'tanto-faz', regiao: 'sao-leopoldo' }), ['b', 'a', 'c'])
  assert.deepEqual(ids({ orcamento: 'ate-150', tipo: 'tanto-faz', regiao: 'outra' }), ['d', 'c'])
  assert.deepEqual(ids({ orcamento: '150-200', tipo: 'apartamento', regiao: 'sao-leopoldo' }), ['b', 'a'])
  assert.deepEqual(ids({ orcamento: 'ate-150', tipo: 'casa', regiao: 'sao-leopoldo' }), [])
})

test('mensagem do WhatsApp leva o perfil, mas nunca a temperatura', () => {
  const message = buildLeadMessage({ ...hot, nome: ' Ana Souza ', bairro: 'Centro' })
  assert.match(message, /Sou Ana Souza/)
  assert.match(message, /Orçamento: R\$ 300 mil a R\$ 500 mil/)
  assert.match(message, /Região: São Leopoldo – bairro Centro/)
  assert.match(message, /Pagamento: Financiamento já aprovado/)
  assert.doesNotMatch(message, /quente|morno|frio|pontos/i)
})

test('telefone: máscara e validação', () => {
  assert.equal(formatPhone('51992789076'), '(51) 99278-9076')
  assert.equal(formatPhone('+55 51 99278-9076'), '(51) 99278-9076')
  assert.equal(formatPhone('5133334444'), '(51) 3333-4444')
  assert.equal(formatPhone('519'), '(51) 9')
  assert.equal(formatPhone(''), '')
  assert.equal(isValidPhone('(51) 99278-9076'), true)
  assert.equal(isValidPhone('(51) 3333-4444'), true)
  assert.equal(isValidPhone('(51) 9927-890'), false)
  assert.equal(isValidPhone('(01) 99278-9076'), false)
  assert.equal(isValidPhone('(51) 89278-9076'), false)
})

test('linha da planilha tem exatamente as colunas do Apps Script', () => {
  const payload = buildLeadPayload({ ...hot, nome: 'Ana', whatsapp: '51992789076' }, { origem: 'Google Ads', campanha: 'casas-sl', pagina: '/' })
  assert.deepEqual(Object.keys(payload), ['nome', 'whatsapp', 'objetivo', 'tipo', 'regiao', 'orcamento', 'pagamento', 'prazo', 'temperatura', 'pontos', 'origem', 'campanha', 'pagina'])
  assert.equal(payload.whatsapp, '(51) 99278-9076')
  assert.equal(payload.temperatura, 'Quente')
  assert.equal(payload.origem, 'Google Ads')
  assert.equal(buildLeadPayload(hot).origem, 'Direto')
})

test('envio para a planilha é uma requisição simples, sem preflight', async () => {
  const calls = []
  global.fetch = async (url, options) => calls.push({ url, options })
  await sendLead({ nome: 'Ana' }, 'https://example.test/exec')
  assert.equal(calls[0].url, 'https://example.test/exec')
  assert.equal(calls[0].options.mode, 'no-cors')
  assert.equal(calls[0].options.keepalive, true)
  assert.match(calls[0].options.headers['Content-Type'], /^text\/plain/)
  assert.deepEqual(JSON.parse(calls[0].options.body), { nome: 'Ana' })
  global.fetch = async () => { throw new Error('offline') }
  await sendLead({}, 'https://example.test/exec')
  delete global.fetch
})

test('origem: anúncio do Google, UTM, outro site ou direto', () => {
  const host = 'schaycorretora.com.br'
  assert.deepEqual(readAttribution({ search: '?gclid=abc&utm_campaign=casas', host, pathname: '/' }), { origem: 'Google Ads', campanha: 'casas', pagina: '/' })
  assert.equal(readAttribution({ search: '?utm_source=instagram&utm_medium=bio', host }).origem, 'instagram / bio')
  assert.equal(readAttribution({ referrer: 'https://www.google.com/', host }).origem, 'google.com')
  assert.equal(readAttribution({ referrer: 'https://schaycorretora.com.br/casas', host }).origem, '')
  assert.equal(readAttribution({ referrer: 'not a url', host }).origem, '')
})

test('eventos do questionário passam passo e temperatura, sem dados pessoais', () => {
  global.window = { schayAnalyticsConsent: true, location: { pathname: '/minha-busca' } }
  trackEvent('lead_submit', { lead_temperature: 'quente', price_band: '300-500', nome: 'Ana', whatsapp: '51992789076' })
  trackEvent('lead_form_step', { step: 3 })
  assert.deepEqual(window.dataLayer, [
    { event: 'lead_submit', page_path: '/minha-busca', lead_temperature: 'quente', price_band: '300-500' },
    { event: 'lead_form_step', page_path: '/minha-busca', step: 3 },
  ])
  delete global.window
})
