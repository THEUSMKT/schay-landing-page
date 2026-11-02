/**
 * Questionário "Quero receber imóveis no meu perfil" (/minha-busca): as
 * perguntas, a pontuação que classifica o lead (quente / morno / frio), a
 * mensagem do WhatsApp e o envio para a planilha da Schay. Tudo aqui é
 * função pura (sem React), coberta por tests/lead.test.mjs.
 *
 * A temperatura nunca aparece para o visitante nem vai na mensagem do
 * WhatsApp — só na planilha e nos eventos de conversão.
 */

// Web app do Google Apps Script ligado à planilha "Leads do site – Schay"
// (cada envio vira uma linha). As chaves do JSON precisam bater com CHAVES
// do script.
export const LEADS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzIPh-wpikps0oNydzPZvIas6Vb74iebkWZVjiItzOMLpVWPNKs0QNCD5JZOdtWeCg6/exec";

// A partir deste orçamento o resultado é sempre "Há imóveis disponíveis
// para o seu perfil!" (pedido da Schay).
export const HIGH_BUDGET = 200000;

export const QUESTIONS = [
  {
    key: "objetivo",
    title: "Qual é o seu objetivo?",
    options: [
      { value: "morar", label: "Comprar para morar", points: 2 },
      { value: "investir", label: "Investir", points: 2 },
      { value: "pesquisando", label: "Ainda estou pesquisando", points: 0 },
    ],
  },
  {
    key: "tipo",
    title: "Que tipo de imóvel você procura?",
    options: [
      { value: "casa", label: "Casa", category: "casas" },
      { value: "apartamento", label: "Apartamento", category: "apartamentos" },
      { value: "terreno", label: "Terreno", category: "terrenos" },
      { value: "tanto-faz", label: "Tanto faz, quero ver opções" },
    ],
  },
  {
    key: "regiao",
    title: "Em qual cidade?",
    // Única pergunta que não avança sozinha: tem o campo opcional de bairro.
    withNeighborhood: true,
    options: [
      { value: "sao-leopoldo", label: "São Leopoldo" },
      { value: "novo-hamburgo", label: "Novo Hamburgo" },
      { value: "estancia-velha", label: "Estância Velha" },
      { value: "outra", label: "Outra cidade da região" },
    ],
  },
  {
    key: "orcamento",
    title: "Quanto pretende investir?",
    options: [
      { value: "ate-150", label: "Até R$ 150 mil", max: 150000 },
      { value: "150-200", label: "R$ 150 mil a R$ 200 mil", max: 200000 },
      { value: "200-300", label: "R$ 200 mil a R$ 300 mil", max: 300000 },
      { value: "300-500", label: "R$ 300 mil a R$ 500 mil", max: 500000 },
      { value: "500-1000", label: "R$ 500 mil a R$ 1 milhão", max: 1000000 },
      { value: "acima-1000", label: "Acima de R$ 1 milhão", max: Infinity },
    ],
  },
  {
    key: "pagamento",
    title: "Como pretende pagar?",
    options: [
      { value: "a-vista", label: "À vista", points: 3 },
      { value: "aprovado", label: "Financiamento já aprovado", points: 3 },
      { value: "troca", label: "Tenho imóvel para dar na troca", points: 2 },
      { value: "fgts", label: "FGTS + financiamento", points: 1 },
      { value: "financiar", label: "Vou financiar (ainda não simulei)", points: 1 },
    ],
  },
  {
    key: "prazo",
    title: "Quando pretende comprar?",
    options: [
      { value: "30-dias", label: "O quanto antes (até 30 dias)", points: 3 },
      { value: "1-3-meses", label: "Em 1 a 3 meses", points: 2 },
      { value: "3-6-meses", label: "Em 3 a 6 meses", points: 1 },
      { value: "sem-pressa", label: "Sem pressa, só olhando", points: 0 },
    ],
  },
];

const byKey = Object.fromEntries(QUESTIONS.map((q) => [q.key, q]));

export function getOption(key, value) {
  return byKey[key]?.options.find((o) => o.value === value);
}

const labelOf = (key, value) => getOption(key, value)?.label || "";

/** Orçamento mínimo da faixa escolhida (a faixa "até 150 mil" começa em 0). */
function budgetMin(value) {
  const options = byKey.orcamento.options;
  const index = options.findIndex((o) => o.value === value);
  return index > 0 ? options[index - 1].max : 0;
}

export const isHighBudget = (answers) =>
  getOption("orcamento", answers.orcamento) !== undefined &&
  budgetMin(answers.orcamento) >= HIGH_BUDGET;

/**
 * Pontuação (0 a 9): objetivo (0–2) + pagamento (1–3) + prazo (0–3) + 1
 * se o orçamento é de R$ 200 mil pra cima. Quente ≥ 7, morno 4–6, frio
 * ≤ 3 — e quem está "só pesquisando" ou "sem pressa" nunca é quente.
 */
export function scoreLead(answers) {
  const pontos =
    (getOption("objetivo", answers.objetivo)?.points ?? 0) +
    (getOption("pagamento", answers.pagamento)?.points ?? 0) +
    (getOption("prazo", answers.prazo)?.points ?? 0) +
    (isHighBudget(answers) ? 1 : 0);
  const browsing =
    answers.objetivo === "pesquisando" || answers.prazo === "sem-pressa";
  let temperatura = pontos >= 7 ? "Quente" : pontos >= 4 ? "Morno" : "Frio";
  if (browsing && temperatura === "Quente") temperatura = "Morno";
  return { pontos, temperatura };
}

/** "São Leopoldo – bairro Centro", ou só a cidade. */
export function regionLabel(answers) {
  const city = labelOf("regiao", answers.regiao);
  const bairro = (answers.bairro || "").trim();
  return bairro ? `${city} – bairro ${bairro}` : city;
}

/**
 * Imóveis do site que cabem no orçamento (usado no resultado de quem está
 * abaixo de R$ 200 mil). Filtra pelo tipo escolhido e, quando a cidade é
 * uma das listadas, pela cidade — os da cidade escolhida primeiro.
 */
export function matchProperties(properties, answers, limit = 3) {
  const max = getOption("orcamento", answers.orcamento)?.max ?? Infinity;
  const category = getOption("tipo", answers.tipo)?.category;
  const city = answers.regiao === "outra" ? "" : labelOf("regiao", answers.regiao);
  return properties
    .filter(
      (p) =>
        !p.isExample &&
        p.price != null &&
        p.price <= max &&
        (!category || p.category === category) &&
        (!city || p.city?.startsWith(city)),
    )
    .sort((a, b) => b.price - a.price)
    .slice(0, limit);
}

export function buildLeadMessage(answers) {
  const name = (answers.nome || "").trim();
  return [
    name
      ? `Olá, Schay! Sou ${name} e respondi o questionário do site.`
      : "Olá, Schay! Respondi o questionário do site.",
    `Objetivo: ${labelOf("objetivo", answers.objetivo)}`,
    `Tipo de imóvel: ${labelOf("tipo", answers.tipo)}`,
    `Região: ${regionLabel(answers)}`,
    `Orçamento: ${labelOf("orcamento", answers.orcamento)}`,
    `Pagamento: ${labelOf("pagamento", answers.pagamento)}`,
    `Prazo: ${labelOf("prazo", answers.prazo)}`,
    "Pode me enviar as opções para o meu perfil?",
  ].join("\n");
}

/** Só os dígitos de um telefone brasileiro, sem o 55 do país. */
export function phoneDigits(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.length > 11 && digits.startsWith("55")) digits = digits.slice(2);
  return digits.slice(0, 11);
}

/** "(51) 99278-9076" enquanto a pessoa digita. */
export function formatPhone(value) {
  const d = phoneDigits(value);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  const local = d.slice(2);
  const split = local.length > 8 ? 5 : 4;
  return local.length > split
    ? `(${d.slice(0, 2)}) ${local.slice(0, split)}-${local.slice(split)}`
    : `(${d.slice(0, 2)}) ${local}`;
}

/** DDD válido + celular (9 dígitos começando com 9) ou fixo (8 dígitos). */
export function isValidPhone(value) {
  const d = phoneDigits(value);
  return /^[1-9][1-9](9\d{8}|[2-8]\d{7})$/.test(d);
}

/** Linha da planilha — as chaves batem com CHAVES do Apps Script. */
export function buildLeadPayload(answers, attribution = {}) {
  const { pontos, temperatura } = scoreLead(answers);
  return {
    nome: (answers.nome || "").trim(),
    whatsapp: formatPhone(answers.whatsapp),
    objetivo: labelOf("objetivo", answers.objetivo),
    tipo: labelOf("tipo", answers.tipo),
    regiao: regionLabel(answers),
    orcamento: labelOf("orcamento", answers.orcamento),
    pagamento: labelOf("pagamento", answers.pagamento),
    prazo: labelOf("prazo", answers.prazo),
    temperatura,
    pontos,
    origem: attribution.origem || "Direto",
    campanha: attribution.campanha || "",
    pagina: attribution.pagina || "",
  };
}

/**
 * Envia o lead para a planilha. `no-cors` + corpo text/plain é uma
 * requisição "simples" (sem preflight, que o Apps Script não responde);
 * a resposta fica opaca, então não dá pra saber se gravou — por isso o
 * resultado e o botão do WhatsApp aparecem de qualquer forma. `keepalive`
 * garante o envio mesmo se a pessoa sair da página logo em seguida.
 * Resolve `true` se a requisição chegou ao servidor e `false` se falhou
 * (rede fora do ar, bloqueio) — nunca rejeita.
 */
export function sendLead(payload, endpoint = LEADS_ENDPOINT) {
  return fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  }).then(
    () => true,
    () => false,
  );
}
