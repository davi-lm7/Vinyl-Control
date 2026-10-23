/* =========================================================
   cadastro.js - Interface de cadastro de disco (RF03)
   ========================================================= */

const usuario = exigirLogin();
let discosNaTela = [];   // discos exibidos na tabela

const form = document.getElementById("formDisco");
const campos = ["titulo", "artista", "genero", "preco_custo", "preco_venda", "quantidade", "estoque_minimo"];

if (usuario) {
  montarTopo(usuario);
  carregarDiscos();   // RF03.1 - carrega automaticamente ao abrir a tela
}

/* ---------- Listagem ---------- */
async function carregarDiscos(termo = "") {
  const tbody = document.getElementById("tabelaDiscos");
  try {
    discosNaTela = await apiListarDiscos(termo);
    if (discosNaTela.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="vazio">${
        termo ? "Nenhum disco encontrado para \"" + escaparHTML(termo) + "\"." : "Nenhum disco cadastrado."
      }</td></tr>`;
      return;
    }
    tbody.innerHTML = discosNaTela.map(d => {
      const baixo = Number(d.quantidade) < Number(d.estoque_minimo);
      return `
      <tr>
        <td>${d.id}</td>
        <td>${escaparHTML(d.titulo)}</td>
        <td>${escaparHTML(d.artista)}</td>
        <td>${escaparHTML(d.genero)}</td>
        <td>${formatarMoeda(d.preco_custo)}</td>
        <td>${formatarMoeda(d.preco_venda)}</td>
        <td class="${baixo ? "estoque-baixo" : ""}">${d.quantidade}</td>
        <td>${d.estoque_minimo}</td>
        <td class="acoes">
          <button class="btn btn-secundario btn-pequeno" onclick="editarDisco(${d.id})">Editar</button>
          <button class="btn btn-perigo btn-pequeno" onclick="excluirDisco(${d.id})">Excluir</button>
        </td>
      </tr>`;
    }).join("");
  } catch (erro) {
    tbody.innerHTML = `<tr><td colspan="9" class="vazio">Erro ao carregar: ${escaparHTML(erro.message)}</td></tr>`;
  }
}

/* ---------- Busca (RF03.2) ---------- */
document.getElementById("formBusca").addEventListener("submit", (e) => {
  e.preventDefault();
  carregarDiscos(document.getElementById("termoBusca").value.trim());
});

document.getElementById("btnLimparBusca").addEventListener("click", () => {
  document.getElementById("termoBusca").value = "";
  carregarDiscos();
});

/* ---------- Validação (RF03.6) ---------- */
function marcarErro(campo, mensagem) {
  document.getElementById(campo).classList.add("campo-invalido");
  document.getElementById("erro-" + campo).textContent = mensagem;
}

function limparErros() {
  campos.forEach(c => {
    document.getElementById(c).classList.remove("campo-invalido");
    document.getElementById("erro-" + c).textContent = "";
  });
  esconderMensagem("msgForm");
}

function validarFormulario() {
  limparErros();
  const erros = [];

  const titulo = document.getElementById("titulo").value.trim();
  const artista = document.getElementById("artista").value.trim();
  const genero = document.getElementById("genero").value.trim();
  const preco = document.getElementById("preco_custo").value.trim();
  const precoVenda = document.getElementById("preco_venda").value.trim();
  const qtd = document.getElementById("quantidade").value.trim();
  const minimo = document.getElementById("estoque_minimo").value.trim();

  if (titulo === "") { marcarErro("titulo", "Informe o título."); erros.push("Título"); }
  else if (titulo.length < 2) { marcarErro("titulo", "Mínimo de 2 caracteres."); erros.push("Título"); }

  if (artista === "") { marcarErro("artista", "Informe o artista ou banda."); erros.push("Artista"); }
  else if (artista.length < 2) { marcarErro("artista", "Mínimo de 2 caracteres."); erros.push("Artista"); }

  if (genero === "") { marcarErro("genero", "Informe o gênero."); erros.push("Gênero"); }

  if (preco === "") { marcarErro("preco_custo", "Informe o preço de custo."); erros.push("Preço"); }
  else if (isNaN(preco) || Number(preco) <= 0) { marcarErro("preco_custo", "O preço deve ser maior que zero."); erros.push("Preço"); }

  if (precoVenda === "") { marcarErro("preco_venda", "Informe o preço de venda."); erros.push("Preço de venda"); }
  else if (isNaN(precoVenda) || Number(precoVenda) <= 0) { marcarErro("preco_venda", "O preço deve ser maior que zero."); erros.push("Preço de venda"); }

  if (qtd === "") { marcarErro("quantidade", "Informe a quantidade."); erros.push("Quantidade"); }
  else if (!Number.isInteger(Number(qtd)) || Number(qtd) < 0) { marcarErro("quantidade", "Use um número inteiro igual ou maior que zero."); erros.push("Quantidade"); }

  if (minimo === "") { marcarErro("estoque_minimo", "Informe o estoque mínimo."); erros.push("Estoque mínimo"); }
  else if (!Number.isInteger(Number(minimo)) || Number(minimo) < 0) { marcarErro("estoque_minimo", "Use um número inteiro igual ou maior que zero."); erros.push("Estoque mínimo"); }

  if (erros.length > 0) {
    const msg = "Verifique os campos: " + erros.join(", ") + ".";
    mostrarMensagem("msgForm", msg, "erro");
    alert(msg);
    return null;
  }

  return {
    titulo,
    artista,
    genero,
    preco_custo: Number(Number(preco).toFixed(2)),
    preco_venda: Number(Number(precoVenda).toFixed(2)),
    quantidade: Number(qtd),
    estoque_minimo: Number(minimo)
  };
}

/* ---------- Inserir / Editar (RF03.3 e RF03.4) ---------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const disco = validarFormulario();
  if (!disco) return;

  const id = document.getElementById("discoId").value;
  try {
    if (id) {
      await apiEditarDisco(Number(id), disco);
      mostrarMensagem("msgLista", `Disco "${disco.titulo}" atualizado com sucesso.`, "sucesso");
    } else {
      await apiCriarDisco(disco);
      mostrarMensagem("msgLista", `Disco "${disco.titulo}" cadastrado com sucesso.`, "sucesso");
    }
    resetarFormulario();
    carregarDiscos(document.getElementById("termoBusca").value.trim());
  } catch (erro) {
    mostrarMensagem("msgForm", "Erro ao salvar: " + erro.message, "erro");
  }
});

function editarDisco(id) {
  const d = discosNaTela.find(x => x.id === id);
  if (!d) return;
  limparErros();
  document.getElementById("discoId").value = d.id;
  campos.forEach(c => document.getElementById(c).value = d[c]);
  document.getElementById("tituloForm").textContent = "Editando disco #" + d.id;
  document.getElementById("btnSalvar").textContent = "Salvar alterações";
  document.getElementById("btnCancelar").style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("titulo").focus();
}

function resetarFormulario() {
  form.reset();
  document.getElementById("discoId").value = "";
  document.getElementById("tituloForm").textContent = "Novo disco";
  document.getElementById("btnSalvar").textContent = "Cadastrar";
  document.getElementById("btnCancelar").style.display = "none";
  limparErros();
}

document.getElementById("btnCancelar").addEventListener("click", resetarFormulario);

/* ---------- Excluir (RF03.5) ---------- */
async function excluirDisco(id) {
  const d = discosNaTela.find(x => x.id === id);
  if (!d) return;
  if (!confirm(`Deseja realmente excluir o disco "${d.titulo}"?`)) return;

  try {
    await apiExcluirDisco(id);
    mostrarMensagem("msgLista", `Disco "${d.titulo}" excluído.`, "sucesso");
    if (document.getElementById("discoId").value == id) resetarFormulario();
    carregarDiscos(document.getElementById("termoBusca").value.trim());
  } catch (erro) {
    mostrarMensagem("msgLista", "Erro ao excluir: " + erro.message, "erro");
  }
}
