
import bcrypt from "bcryptjs";
import prisma from "../data/prisma.js";

// POST /usuarios — Cadastrar usuário
export async function cadastrar(req, res) {
  try {
    const { nome, email, senha } = req.body ?? {};

    if (!nome?.trim() || !email?.trim() || !senha) {
      return res.status(400).json({
        erro: "Informe nome, email e senha.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    if (senha.length < 6) {
      return res.status(400).json({
        erro: "A senha deve ter pelo menos 6 caracteres.",
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: emailNormalizado },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        erro: "Este email já está cadastrado.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome: nome.trim(),
        email: emailNormalizado,
        senha: senhaCriptografada,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);

    return res.status(500).json({
      erro: "Erro interno ao cadastrar usuário.",
    });
  }
}

// POST /usuarios/login — Fazer login
export async function login(req, res) {
  try {
    const { email, senha } = req.body ?? {};

    if (!email?.trim() || !senha) {
      return res.status(400).json({
        erro: "Informe email e senha.",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailNormalizado },
    });

    if (!usuario) {
      return res.status(401).json({
        erro: "Email não cadastrado.",
      });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha);

    if (!senhaOk) {
      return res.status(401).json({
        erro: "Senha incorreta.",
      });
    }

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    console.error("Erro ao fazer login:", erro);

    return res.status(500).json({
      erro: "Erro interno ao fazer login.",
    });
  }
}
