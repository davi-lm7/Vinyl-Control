# Vinyl Control – Frontend

Frontend do simulado SAEP (loja_de_discos_01_2026), feito em HTML, CSS e JavaScript puro.

## Telas

| Arquivo | Entrega | O que faz |
|---|---|---|
| `index.html` | 4 – Login | E-mail e senha, validação, mensagem com o motivo da falha |
| `principal.html` | 5 – Principal | Nome do usuário, botão Sair, links para as outras telas, resumo |
| `cadastro.html` | 6 – Cadastro de disco | Lista automática, busca, inserir, editar, excluir, validação, voltar |
| `gestao.html` | 7 – Gestão de acervo | Lista em ordem alfabética (Insertion Sort), seleção do disco, entrada/venda, data, alerta de estoque mínimo |

## Como rodar

Abra a pasta no VS Code e use a extensão **Live Server** em `index.html`
(ou `npx serve .`).

### Modo demonstração

Em `js/api.js`, `MODO_DEMO = true` faz o sistema funcionar sem backend, com dados salvos no navegador.

Usuários de teste: `ana@loja.com`, `bruno@loja.com`, `carla@loja.com` — senha `123456`.

Para recomeçar os dados de demonstração, rode no console do navegador: `localStorage.clear()`.

### Ligando ao backend

Em `js/api.js`: `MODO_DEMO = false` e ajuste `API_URL`. O backend precisa liberar CORS.

## Rotas que o backend deve ter

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| POST | `/login` | `{ email, senha }` | `{ usuario: { id, nome, email }, token }` — erro 401 com `{ mensagem: "Senha incorreta." }` |
| GET | `/discos?busca=termo` | – | `[ { id, titulo, artista, preco_custo, quantidade, estoque_minimo } ]` |
| POST | `/discos` | `{ titulo, artista, preco_custo, quantidade, estoque_minimo }` | disco criado |
| PUT | `/discos/:id` | mesmos campos | disco atualizado |
| DELETE | `/discos/:id` | – | `{ ok: true }` |
| POST | `/movimentacoes` | `{ disco_id, usuario_id, tipo: "entrada" \| "saida", quantidade, data_movimentacao: "AAAA-MM-DD" }` | `{ movimentacao, disco }` (disco com quantidade já atualizada) |
| GET | `/movimentacoes` | – | `[ { id, disco_id, usuario_id, tipo, quantidade, data_movimentacao, titulo, usuario_nome } ]` |

Erros devem voltar com status 4xx/5xx e `{ "mensagem": "texto do erro" }` — o frontend mostra esse texto ao usuário.

## Sessão

Após o login, o usuário e o token ficam em `sessionStorage`. Toda tela interna chama `exigirLogin()` e
volta ao login se não houver sessão. O botão **Sair** limpa a sessão e redireciona para `index.html`.
