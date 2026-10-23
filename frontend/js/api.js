/* =========================================================
   api.js - Comunicação com o backend
   ---------------------------------------------------------
   MODO_DEMO = true  -> usa dados falsos salvos no navegador
                        (para testar o frontend sem backend)
   MODO_DEMO = false -> chama a API real em API_URL
   ========================================================= */

const API_URL = "http://localhost:3000";
const MODO_DEMO = true;

/* ---------- Chamada HTTP genérica para a API real ---------- */
async function requisicao(caminho, metodo = "GET", corpo = null) {
  const opcoes = {
    method: metodo,
    headers: { "Content-Type": "application/json" }
  };

  const token = sessionStorage.getItem("token");
  if (token) opcoes.headers["Authorization"] = "Bearer " + token;
  if (corpo) opcoes.body = JSON.stringify(corpo);

  let resposta;
  try {
    resposta = await fetch(API_URL + caminho, opcoes);
  } catch (e) {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(dados.mensagem || dados.erro || "Erro " + resposta.status);
  }
  return dados;
}

/* =========================================================
   MODO DEMONSTRAÇÃO (dados no localStorage)
   ========================================================= */
const demo = {
  carregar() {
    if (!localStorage.getItem("demo_discos")) {
      localStorage.setItem("demo_usuarios", JSON.stringify([
        { id: 1, nome: "Ana Souza", email: "ana@loja.com", senha: "123456" },
        { id: 2, nome: "Bruno Lima", email: "bruno@loja.com", senha: "123456" },
        { id: 3, nome: "Carla Mendes", email: "carla@loja.com", senha: "123456" }
      ]));
      localStorage.setItem("demo_discos", JSON.stringify([
        { id: 1, titulo: "Thriller", artista: "Michael Jackson", preco_custo: 120.00, quantidade: 8, estoque_minimo: 3 },
        { id: 2, titulo: "Abbey Road", artista: "The Beatles", preco_custo: 150.00, quantidade: 4, estoque_minimo: 2 },
        { id: 3, titulo: "Clube da Esquina", artista: "Milton Nascimento", preco_custo: 180.00, quantidade: 2, estoque_minimo: 2 },
        { id: 4, titulo: "Dark Side of the Moon", artista: "Pink Floyd", preco_custo: 160.00, quantidade: 6, estoque_minimo: 3 }
      ]));
      localStorage.setItem("demo_movimentacoes", JSON.stringify([
        { id: 1, disco_id: 1, usuario_id: 1, tipo: "entrada", quantidade: 5, data_movimentacao: "2026-10-01" },
        { id: 2, disco_id: 2, usuario_id: 2, tipo: "saida", quantidade: 1, data_movimentacao: "2026-10-05" },
        { id: 3, disco_id: 3, usuario_id: 3, tipo: "saida", quantidade: 2, data_movimentacao: "2026-10-10" }
      ]));
    }
  },
  ler(chave) { this.carregar(); return JSON.parse(localStorage.getItem("demo_" + chave)); },
  salvar(chave, valor) { localStorage.setItem("demo_" + chave, JSON.stringify(valor)); },
  proximoId(lista) { return lista.reduce((max, i) => Math.max(max, i.id), 0) + 1; },
  espera() { return new Promise(r => setTimeout(r, 150)); }
};

/* =========================================================
   FUNÇÕES USADAS PELAS TELAS
   ========================================================= */

/* POST /login  { email, senha } -> { usuario: {id, nome, email}, token } */
async function apiLogin(email, senha) {
  if (!MODO_DEMO) return requisicao("/login", "POST", { email, senha });

  await demo.espera();
  const usuario = demo.ler("usuarios").find(u => u.email === email);
  if (!usuario) throw new Error("E-mail não cadastrado.");
  if (usuario.senha !== senha) throw new Error("Senha incorreta.");
  return { usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }, token: "demo" };
}

/* GET /discos?busca=termo -> [ discos ] */
async function apiListarDiscos(busca = "") {
  if (!MODO_DEMO) return requisicao("/discos?busca=" + encodeURIComponent(busca));

  await demo.espera();
  const termo = busca.trim().toLowerCase();
  return demo.ler("discos").filter(d =>
    d.titulo.toLowerCase().includes(termo) || d.artista.toLowerCase().includes(termo)
  );
}

/* POST /discos { titulo, artista, preco_custo, quantidade, estoque_minimo } */
async function apiCriarDisco(disco) {
  if (!MODO_DEMO) return requisicao("/discos", "POST", disco);

  await demo.espera();
  const discos = demo.ler("discos");
  const novo = { id: demo.proximoId(discos), ...disco };
  discos.push(novo);
  demo.salvar("discos", discos);
  return novo;
}

/* PUT /discos/:id */
async function apiEditarDisco(id, disco) {
  if (!MODO_DEMO) return requisicao("/discos/" + id, "PUT", disco);

  await demo.espera();
  const discos = demo.ler("discos");
  const i = discos.findIndex(d => d.id === id);
  if (i < 0) throw new Error("Disco não encontrado.");
  discos[i] = { ...discos[i], ...disco };
  demo.salvar("discos", discos);
  return discos[i];
}

/* DELETE /discos/:id */
async function apiExcluirDisco(id) {
  if (!MODO_DEMO) return requisicao("/discos/" + id, "DELETE");

  await demo.espera();
  if (demo.ler("movimentacoes").some(m => m.disco_id === id)) {
    throw new Error("Este disco possui movimentações registradas e não pode ser excluído.");
  }
  demo.salvar("discos", demo.ler("discos").filter(d => d.id !== id));
  return { ok: true };
}

/* POST /movimentacoes { disco_id, usuario_id, tipo, quantidade, data_movimentacao }
   -> { movimentacao, disco }  (disco com a quantidade já atualizada) */
async function apiRegistrarMovimentacao(mov) {
  if (!MODO_DEMO) return requisicao("/movimentacoes", "POST", mov);

  await demo.espera();
  const discos = demo.ler("discos");
  const disco = discos.find(d => d.id === mov.disco_id);
  if (!disco) throw new Error("Disco não encontrado.");

  if (mov.tipo === "saida" && mov.quantidade > disco.quantidade) {
    throw new Error("Estoque insuficiente. Disponível: " + disco.quantidade);
  }
  disco.quantidade += mov.tipo === "entrada" ? mov.quantidade : -mov.quantidade;
  demo.salvar("discos", discos);

  const movs = demo.ler("movimentacoes");
  const nova = { id: demo.proximoId(movs), ...mov };
  movs.push(nova);
  demo.salvar("movimentacoes", movs);
  return { movimentacao: nova, disco };
}

/* GET /movimentacoes -> [ { ..., titulo, usuario_nome } ] */
async function apiListarMovimentacoes() {
  if (!MODO_DEMO) return requisicao("/movimentacoes");

  await demo.espera();
  const discos = demo.ler("discos");
  const usuarios = demo.ler("usuarios");
  return demo.ler("movimentacoes").map(m => ({
    ...m,
    titulo: (discos.find(d => d.id === m.disco_id) || {}).titulo || "(excluído)",
    usuario_nome: (usuarios.find(u => u.id === m.usuario_id) || {}).nome || "-"
  }));
}

/* Mostra um aviso no canto quando está em modo demonstração */
if (MODO_DEMO) {
  document.addEventListener("DOMContentLoaded", () => {
    const b = document.createElement("div");
    b.className = "badge-demo";
    b.textContent = "Modo demonstração";
    document.body.appendChild(b);
  });
}
