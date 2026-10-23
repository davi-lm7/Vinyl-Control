/* =========================================================
   principal.js - Interface principal (RF02)
   ========================================================= */

const usuario = exigirLogin();
if (usuario) {
  montarTopo(usuario);
  carregarResumo();
}

async function carregarResumo() {
  try {
    const discos = await apiListarDiscos();
    document.getElementById("totalDiscos").textContent = discos.length;
    document.getElementById("totalUnidades").textContent =
      discos.reduce((soma, d) => soma + Number(d.quantidade), 0);
    document.getElementById("totalBaixo").textContent =
      discos.filter(d => Number(d.quantidade) < Number(d.estoque_minimo)).length;

    const movs = await apiListarMovimentacoes();
    // Mais recentes primeiro, mostra até 5
    movs.sort((a, b) => String(b.data_movimentacao).localeCompare(String(a.data_movimentacao)) || b.id - a.id);
    const tbody = document.getElementById("tabelaRecentes");

    if (movs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="vazio">Nenhuma movimentação registrada.</td></tr>`;
      return;
    }
    tbody.innerHTML = movs.slice(0, 5).map(m => `
      <tr>
        <td>${formatarData(m.data_movimentacao)}</td>
        <td>${escaparHTML(m.titulo)}</td>
        <td><span class="tag tag-${m.tipo}">${m.tipo === "entrada" ? "Reposição" : "Venda"}</span></td>
        <td>${m.quantidade}</td>
        <td>${escaparHTML(m.usuario_nome)}</td>
      </tr>`).join("");
  } catch (erro) {
    document.getElementById("tabelaRecentes").innerHTML =
      `<tr><td colspan="5" class="vazio">Erro ao carregar: ${escaparHTML(erro.message)}</td></tr>`;
  }
}
