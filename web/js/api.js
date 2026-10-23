/* Comunicação com a API Vinyl Control.
   Para apontar para outro servidor, defina window.VINYL_API_URL antes deste arquivo. */
const API_URL = (window.VINYL_API_URL || `http://${window.location.hostname}:3000`).replace(/\/$/, "");

async function requisicao(caminho, metodo = "GET", corpo) {
  const opcoes = { method: metodo, headers: { "Content-Type": "application/json" } };
  if (corpo !== undefined) opcoes.body = JSON.stringify(corpo);

  let resposta;
  try {
    resposta = await fetch(API_URL + caminho, opcoes);
  } catch {
    throw new Error(`Não foi possível conectar à API em ${API_URL}.`);
  }

  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;
  if (!resposta.ok) throw new Error(dados?.mensagem || dados?.erro || `Erro ${resposta.status}.`);
  return dados;
}

function normalizarDisco(disco) {
  return {
    ...disco,
    preco_custo: Number(disco.precoCusto),
    preco_venda: Number(disco.precoVenda),
    quantidade: disco.qtdEstoque,
    estoque_minimo: disco.estoqueMinimo,
  };
}

function paraApiDisco(disco) {
  return {
    titulo: disco.titulo,
    artista: disco.artista,
    genero: disco.genero,
    precoCusto: disco.preco_custo,
    precoVenda: disco.preco_venda,
    qtdEstoque: disco.quantidade,
    estoqueMinimo: disco.estoque_minimo,
  };
}

function normalizarMovimentacao(movimentacao) {
  return {
    ...movimentacao,
    disco_id: movimentacao.discoId,
    usuario_id: movimentacao.usuarioId,
    data_movimentacao: movimentacao.data,
    titulo: movimentacao.disco?.titulo || "-",
    usuario_nome: movimentacao.usuario?.nome || "-",
  };
}

async function apiLogin(email, senha) {
  return requisicao("/usuarios/login", "POST", { email, senha });
}

async function apiCadastrarUsuario(nome, email, senha) {
  return requisicao("/usuarios", "POST", { nome, email, senha });
}

async function apiListarDiscos(busca = "") {
  const consulta = busca ? `?busca=${encodeURIComponent(busca)}` : "";
  return (await requisicao(`/discos${consulta}`)).map(normalizarDisco);
}

async function apiCriarDisco(disco) {
  return normalizarDisco(await requisicao("/discos", "POST", paraApiDisco(disco)));
}

async function apiEditarDisco(id, disco) {
  return normalizarDisco(await requisicao(`/discos/${id}`, "PUT", paraApiDisco(disco)));
}

async function apiExcluirDisco(id) {
  await requisicao(`/discos/${id}`, "DELETE");
  return { ok: true };
}

async function apiRegistrarMovimentacao(movimentacao) {
  const resposta = await requisicao("/movimentacoes", "POST", {
    discoId: movimentacao.disco_id,
    usuarioId: movimentacao.usuario_id,
    tipo: movimentacao.tipo,
    quantidade: movimentacao.quantidade,
    data: movimentacao.data_movimentacao,
  });
  const disco = normalizarDisco(await requisicao(`/discos/${movimentacao.disco_id}`));
  return { ...resposta, movimentacao: normalizarMovimentacao(resposta.movimentacao), disco };
}

async function apiListarMovimentacoes() {
  return (await requisicao("/movimentacoes")).map(normalizarMovimentacao);
}
