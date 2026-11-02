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
  assert.equal(await sendLead({ nome: 'Ana' }, 'https://example.test/exec'), true)
  global.fetch = async () => { throw new Error('offline') }
  assert.equal(await sendLead({}, 'https://example.test/exec'), false)
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

const adsConfig = { id: 'AW-1', labels: { LABEL_LEAD_FORMULARIO: 'abc', LABEL_LEAD_QUENTE: '', LABEL_CLIQUE_WHATSAPP: ' wa1 ' } }

test('conversão do Ads só dispara com rótulo preenchido e gtag carregado', async () => {
  const { trackAdsConversion, ADS_CONFIG } = await import('../src/lib/adsConversions.js')
  const calls = []
  global.window = { gtag: (...args) => calls.push(args) }
  trackAdsConversion('LABEL_LEAD_FORMULARIO', adsConfig)
  trackAdsConversion('LABEL_LEAD_QUENTE', adsConfig)
  trackAdsConversion('LABEL_CLIQUE_WHATSAPP', adsConfig)
  assert.deepEqual(calls, [
    ['event', 'conversion', { send_to: 'AW-1/abc' }],
    ['event', 'conversion', { send_to: 'AW-1/wa1' }],
  ])
  assert.equal(ADS_CONFIG.id, 'AW-18481242347')
  assert.deepEqual(Object.keys(ADS_CONFIG.labels), ['LABEL_LEAD_FORMULARIO', 'LABEL_LEAD_QUENTE', 'LABEL_CLIQUE_WHATSAPP'])
  assert.ok(Object.values(ADS_CONFIG.labels).every((l) => l === '' || l.length > 0))
  delete global.window.gtag
  trackAdsConversion('LABEL_LEAD_FORMULARIO', adsConfig)
  assert.equal(calls.length, 2)
  delete global.window
})

test('um listener só conta cliques em links do WhatsApp, sem impedir o clique', async () => {
  const { installWhatsAppConversion } = await import('../src/lib/adsConversions.js')
  const calls = []
  const listeners = new Set()
  global.document = { addEventListener: (_, f) => listeners.add(f), removeEventListener: (_, f) => listeners.delete(f) }
  global.window = { gtag: (...args) => calls.push(args), location: { href: 'https://schaycorretora.com.br/casas' } }
  const stop = installWhatsAppConversion(adsConfig)
  assert.equal(listeners.size, 1)
  const click = (href, extra = {}) => {
    const event = { defaultPrevented: false, target: { closest: () => (href === null ? null : { href, hasAttribute: () => false }) }, ...extra }
    for (const fn of listeners) fn(event)
  }
  click('https://wa.me/5551992789076?text=Oi')
  click('https://api.whatsapp.com/send?phone=5551992789076')
  click('https://example.com/')
  click('/casas')
  click(null)
  click('https://wa.me/5551992789076', { defaultPrevented: true })
  assert.equal(calls.length, 2)
  // link já contado por quem abriu o WhatsApp (formulário do fim da página)
  for (const fn of listeners)
    fn({ defaultPrevented: false, target: { closest: () => ({ href: 'https://wa.me/5551992789076', hasAttribute: (n) => n === 'data-ads-counted' }) } })
  assert.equal(calls.length, 2)
  stop()
  assert.equal(listeners.size, 0)
  delete global.window
  delete global.document
})
