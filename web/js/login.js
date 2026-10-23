// Login e cadastro local de usuários.
if (usuarioLogado()) window.location.href = "principal.html";

const formLogin = document.getElementById("formLogin");
const formCadastro = document.getElementById("formCadastroUsuario");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function limparErrosLogin() {
  [campoEmail, campoSenha].forEach((campo) => campo.classList.remove("campo-invalido"));
  document.getElementById("erroEmail").textContent = "";
  document.getElementById("erroSenha").textContent = "";
  esconderMensagem("msgLogin");
}

function validarLogin() {
  let valido = true;
  if (!emailValido.test(campoEmail.value.trim())) {
    document.getElementById("erroEmail").textContent = "Informe um e-mail válido.";
    campoEmail.classList.add("campo-invalido");
    valido = false;
  }
  if (!campoSenha.value) {
    document.getElementById("erroSenha").textContent = "Informe a senha.";
    campoSenha.classList.add("campo-invalido");
    valido = false;
  }
  return valido;
}

function mostrarCadastro() {
  formLogin.hidden = true;
  document.getElementById("btnMostrarCadastro").hidden = true;
  formCadastro.hidden = false;
  document.getElementById("nomeCadastro").focus();
}

function mostrarLogin() {
  formCadastro.hidden = true;
  formLogin.hidden = false;
  document.getElementById("btnMostrarCadastro").hidden = false;
  campoEmail.focus();
}

document.getElementById("btnMostrarCadastro").addEventListener("click", mostrarCadastro);
document.getElementById("btnCancelarCadastro").addEventListener("click", mostrarLogin);

formLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  limparErrosLogin();
  if (!validarLogin()) return;

  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando...";
  try {
    const resposta = await apiLogin(campoEmail.value.trim(), campoSenha.value);
    salvarSessao(resposta.usuario, resposta.token);
    window.location.href = "principal.html";
  } catch (erro) {
    mostrarMensagem("msgLogin", `Falha na autenticação: ${erro.message}`, "erro");
    campoSenha.value = "";
    campoSenha.focus();
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
});

formCadastro.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const nome = document.getElementById("nomeCadastro");
  const email = document.getElementById("emailCadastro");
  const senha = document.getElementById("senhaCadastro");
  const erros = [
    [nome, "erroNomeCadastro", nome.value.trim().length >= 2, "Informe um nome com ao menos 2 caracteres."],
    [email, "erroEmailCadastro", emailValido.test(email.value.trim()), "Informe um e-mail válido."],
    [senha, "erroSenhaCadastro", senha.value.length >= 6, "A senha deve ter pelo menos 6 caracteres."],
  ];

  let valido = true;
  erros.forEach(([campo, erroId, regra, mensagem]) => {
    campo.classList.toggle("campo-invalido", !regra);
    document.getElementById(erroId).textContent = regra ? "" : mensagem;
    if (!regra) valido = false;
  });
  if (!valido) return;

  const botao = document.getElementById("btnCadastrar");
  botao.disabled = true;
  botao.textContent = "Cadastrando...";
  try {
    await apiCadastrarUsuario(nome.value.trim(), email.value.trim(), senha.value);
    const emailCadastrado = email.value.trim();
    formCadastro.reset();
    campoEmail.value = emailCadastrado;
    mostrarLogin();
    mostrarMensagem("msgLogin", "Conta criada com sucesso. Faça seu login.", "sucesso");
  } catch (erro) {
    mostrarMensagem("msgLogin", `Não foi possível cadastrar: ${erro.message}`, "erro");
  } finally {
    botao.disabled = false;
    botao.textContent = "Cadastrar";
  }
});
