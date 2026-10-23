/* =========================================================
   gestao.js - Interface de gestão de acervo e vendas (RF04)
   ========================================================= */

const usuario = exigirLogin();
let acervo = [];             // discos ordenados
let discoSelecionado = null;

if (usuario) {
  montarTopo(usuario);
  document.getElementById("dataMov").value = hojeISO();
  carregarAcervo();
  carregarHistorico();
}

/* ---------------------------------------------------------
   RF04.1 - Algoritmo de ordenação: INSERTION SORT
   Percorre a lista e insere cada disco na posição correta
   entre os já ordenados, comparando os títulos.
   localeCompare trata acentos e maiúsculas/minúsculas.
   --------------------------------------------------------- */
function insertionSort(lista) {
  const v = [...lista];   // cópia para não alterar o original
  for (let i = 1; i < v.length; i++) {
    const atual = v[i];
    let j = i - 1;
    while (j >= 0 && v[j].titulo.localeCompare(atual.titulo, "pt-BR", { sensitivity: "base" }) > 0) {
      v[j + 1] = v[j];   // desloca o maior para a direita
      j--;
    }
    v[j + 1] = atual;
  }
  return v;
}

/* ---------- Listagem do acervo ---------- */
async function carregarAcervo() {
  const tbody = document.getElementById("tabelaAcervo");
  try {
    acervo = insertionSort(await apiListarDiscos());

    if (acervo.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="vazio">Nenhum disco cadastrado.</td></tr>`;
      return;
    }
    tbody.innerHTML = acervo.map(d => {
      const baixo = Number(d.quantidade) < Number(d.estoque_minimo);
      const sel = discoSelecionado && discoSelecionado.id === d.id;
      return `
      <tr class="${sel ? "selecionado" : ""}" style="cursor:pointer" onclick="selecionarDisco(${d.id})">
        <td><input type="radio" name="disco" ${sel ? "checked" : ""} style="width:auto"></td>
        <td>${escaparHTML(d.titulo)}</td>
        <td>${escaparHTML(d.artista)}</td>
        <td class="${baixo ? "estoque-baixo" : ""}">${d.quantidade}</td>
        <td>${d.estoque_minimo}</td>
      </tr>`;
    }).join("");
  } catch (erro) {
    tbody.innerHTML = `<tr><td colspan="5" class="vazio">Erro ao carregar: ${escaparHTML(erro.message)}</td></tr>`;
  }
}

/* ---------- RF04.2 - Seleção do disco ---------- */
function selecionarDisco(id) {
  discoSelecionado = acervo.find(d => d.id === id);
  document.querySelectorAll("#tabelaAcervo tr").forEach(tr => tr.classList.remove("selecionado"));
  const linha = document.querySelector(`#tabelaAcervo tr[onclick="selecionarDisco(${id})"]`);
  if (linha) {
    linha.classList.add("selecionado");
    linha.querySelector("input").checked = true;
  }
  atualizarDiscoEscolhido();
}

function atualizarDiscoEscolhido() {
  const caixa = document.getElementById("discoEscolhido");
  if (!discoSelecionado) {
    caixa.textContent = "Nenhum disco selecionado.";
    return;
  }
  caixa.innerHTML = `<strong>${escaparHTML(discoSelecionado.titulo)}</strong> — ${escaparHTML(discoSelecionado.artista)}<br>
    Estoque atual: <strong>${discoSelecionado.quantidade}</strong> · Mínimo: ${discoSelecionado.estoque_minimo}`;
}

/* ---------- Validação ---------- */
function limparErros() {
  ["tipo", "quantidadeMov", "dataMov"].forEach(c => document.getElementById("erro-" + c).textContent = "");
  ["quantidadeMov", "dataMov"].forEach(c => document.getElementById(c).classList.remove("campo-invalido"));
  esconderMensagem("msgMov");
}

function validarMovimentacao() {
  limparErros();
  const erros = [];
  const tipo = document.querySelector('input[name="tipo"]:checked');
  const qtd = document.getElementById("quantidadeMov").value.trim();
  const data = document.getElementById("dataMov").value;

  if (!discoSelecionado) erros.push("Selecione um disco na lista.");

  if (!tipo) {
    document.getElementById("erro-tipo").textContent = "Escolha reposição ou venda.";
    erros.push("Escolha o tipo de movimentação.");
  }

  if (qtd === "" || !Number.isInteger(Number(qtd)) || Number(qtd) <= 0) {
    document.getElementById("erro-quantidadeMov").textContent = "Informe um número inteiro maior que zero.";
    document.getElementById("quantidadeMov").classList.add("campo-invalido");
    erros.push("Quantidade inválida.");
  } else if (tipo && tipo.value === "saida" && discoSelecionado && Number(qtd) > Number(discoSelecionado.quantidade)) {
    document.getElementById("erro-quantidadeMov").textContent = "Maior que o estoque disponível.";
    document.getElementById("quantidadeMov").classList.add("campo-invalido");
    erros.push(`Estoque insuficiente (disponível: ${discoSelecionado.quantidade}).`);
  }

  if (!data) {
    document.getElementById("erro-dataMov").textContent = "Informe a data.";
    document.getElementById("dataMov").classList.add("campo-invalido");
    erros.push("Informe a data da movimentação.");
  } else if (data > hojeISO()) {
    document.getElementById("erro-dataMov").textContent = "A data não pode ser futura.";
    document.getElementById("dataMov").classList.add("campo-invalido");
    erros.push("A data não pode ser futura.");
  }

  if (erros.length > 0) {
    mostrarMensagem("msgMov", erros.join(" "), "erro");
    return null;
  }

  return {
    disco_id: discoSelecionado.id,
    usuario_id: usuario.id,
    tipo: tipo.value,
    quantidade: Number(qtd),
    data_movimentacao: data
  };
}

/* ---------- Registrar movimentação (RF04.2 / RF04.3 / RF04.4) ---------- */
document.getElementById("formMov").addEventListener("submit", async (e) => {
  e.preventDefault();
  esconderMensagem("msgAlerta");
  const mov = validarMovimentacao();
  if (!mov) return;

  try {
    const resposta = await apiRegistrarMovimentacao(mov);
    const disco = resposta.disco;

    mostrarMensagem("msgMov",
      `${mov.tipo === "entrada" ? "Reposição" : "Venda"} de ${mov.quantidade} unidade(s) registrada. Novo estoque: ${disco.quantidade}.`,
      "sucesso");

    // RF04.4 - Verificação automática após cada venda (saída)
    if (mov.tipo === "saida" && Number(disco.quantidade) < Number(disco.estoque_minimo)) {
      const aviso = `ATENÇÃO: o estoque de "${disco.titulo}" está abaixo do mínimo! ` +
                    `Atual: ${disco.quantidade} | Mínimo: ${disco.estoque_minimo}. Providencie reposição.`;
      mostrarMensagem("msgAlerta", aviso, "aviso");
      alert(aviso);
    }

    document.getElementById("quantidadeMov").value = "";
    await carregarAcervo();
    discoSelecionado = acervo.find(d => d.id === disco.id) || null;
    atualizarDiscoEscolhido();
    carregarHistorico();
  } catch (erro) {
    mostrarMensagem("msgMov", "Erro ao registrar: " + erro.message, "erro");
  }
});

/* ---------- Histórico ---------- */
async function carregarHistorico() {
  const tbody = document.getElementById("tabelaHistorico");
  try {
    const movs = await apiListarMovimentacoes();
    movs.sort((a, b) => String(b.data_movimentacao).localeCompare(String(a.data_movimentacao)) || b.id - a.id);
    if (movs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="vazio">Nenhuma movimentação registrada.</td></tr>`;
      return;
    }
    tbody.innerHTML = movs.map(m => `
      <tr>
        <td>${formatarData(m.data_movimentacao)}</td>
        <td>${escaparHTML(m.titulo)}</td>
        <td><span class="tag tag-${m.tipo}">${m.tipo === "entrada" ? "Reposição" : "Venda"}</span></td>
        <td>${m.quantidade}</td>
        <td>${escaparHTML(m.usuario_nome)}</td>
      </tr>`).join("");
  } catch (erro) {
    tbody.innerHTML = `<tr><td colspan="5" class="vazio">Erro ao carregar: ${escaparHTML(erro.message)}</td></tr>`;
  }
}
