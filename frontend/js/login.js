/* =========================================================
   login.js - Interface de autenticação (RF01)
   ========================================================= */

// Se já estiver logado, vai direto para a tela principal
if (usuarioLogado()) window.location.href = "principal.html";

const form = document.getElementById("formLogin");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");

function limparErros() {
  [campoEmail, campoSenha].forEach(c => c.classList.remove("campo-invalido"));
  document.getElementById("erroEmail").textContent = "";
  document.getElementById("erroSenha").textContent = "";
  esconderMensagem("msgLogin");
}

function validar() {
  let ok = true;
  const email = campoEmail.value.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    document.getElementById("erroEmail").textContent = "Informe o e-mail.";
    campoEmail.classList.add("campo-invalido");
    ok = false;
  } else if (!regexEmail.test(email)) {
    document.getElementById("erroEmail").textContent = "E-mail em formato inválido.";
    campoEmail.classList.add("campo-invalido");
    ok = false;
  }

  if (campoSenha.value === "") {
    document.getElementById("erroSenha").textContent = "Informe a senha.";
    campoSenha.classList.add("campo-invalido");
    ok = false;
  }
  return ok;
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  limparErros();
  if (!validar()) return;

  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando...";

  try {
    const resposta = await apiLogin(campoEmail.value.trim(), campoSenha.value);
    salvarSessao(resposta.usuario, resposta.token);
    window.location.href = "principal.html";
  } catch (erro) {
    // Informa o motivo da falha e retorna ao formulário de autenticação
    mostrarMensagem("msgLogin", "Falha na autenticação: " + erro.message, "erro");
    alert("Falha na autenticação: " + erro.message);
    campoSenha.value = "";
    campoSenha.focus();
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
});
