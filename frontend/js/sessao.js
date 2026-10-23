/* =========================================================
   sessao.js - Controle de sessão do usuário logado
   ========================================================= */

function salvarSessao(usuario, token) {
  sessionStorage.setItem("usuario", JSON.stringify(usuario));
  sessionStorage.setItem("token", token || "");
}

function usuarioLogado() {
  const dados = sessionStorage.getItem("usuario");
  return dados ? JSON.parse(dados) : null;
}

/* Chamar no início de toda página protegida.
   Se não houver sessão, volta para o login. */
function exigirLogin() {
  const usuario = usuarioLogado();
  if (!usuario) {
    window.location.href = "index.html";
    return null;
  }
  return usuario;
}

function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

/* Preenche o nome do usuário e liga o botão "Sair" do topo */
function montarTopo(usuario) {
  const nome = document.getElementById("nomeUsuario");
  if (nome) nome.textContent = usuario.nome;
  const sair = document.getElementById("btnSair");
  if (sair) sair.addEventListener("click", logout);
}

/* Utilitários de formatação */
function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(dataISO) {
  if (!dataISO) return "-";
  const [a, m, d] = String(dataISO).substring(0, 10).split("-");
  return `${d}/${m}/${a}`;
}

function hojeISO() {
  const h = new Date();
  const m = String(h.getMonth() + 1).padStart(2, "0");
  const d = String(h.getDate()).padStart(2, "0");
  return `${h.getFullYear()}-${m}-${d}`;
}

/* Evita que textos vindos do banco sejam interpretados como HTML */
function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function mostrarMensagem(id, texto, tipo) {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.className = "mensagem mostrar " + tipo;
}

function esconderMensagem(id) {
  document.getElementById(id).className = "mensagem";
}
