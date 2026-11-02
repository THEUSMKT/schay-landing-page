// Apaga da planilha "Leads do site – Schay" as linhas com mais de 1 mês
// (prazo de guarda da Política de Privacidade). Cole este código no MESMO
// projeto do Apps Script que recebe os leads (Extensões → Apps Script),
// abaixo do código que já existe, e rode "criarGatilhoApagarLeads" uma vez.

function apagarLeadsAntigos() {
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const ultima = aba.getLastRow();
  if (ultima < 2) return; // só o cabeçalho

  const limite = new Date();
  limite.setMonth(limite.getMonth() - 1);

  // Coluna A = Data do envio. De baixo pra cima, pra não bagunçar as linhas.
  const datas = aba.getRange(2, 1, ultima - 1, 1).getValues();
  for (let i = datas.length - 1; i >= 0; i--) {
    const data = datas[i][0];
    if (data instanceof Date && data < limite) aba.deleteRow(i + 2);
  }
}

// Rode UMA vez: agenda a limpeza para todos os dias, de madrugada.
function criarGatilhoApagarLeads() {
  ScriptApp.getProjectTriggers()
    .filter((g) => g.getHandlerFunction() === 'apagarLeadsAntigos')
    .forEach((g) => ScriptApp.deleteTrigger(g));
  ScriptApp.newTrigger('apagarLeadsAntigos').timeBased().everyDays(1).atHour(3).create();
}
