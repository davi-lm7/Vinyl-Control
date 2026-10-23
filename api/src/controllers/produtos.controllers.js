
import prisma from "../data/prisma.js";

function validar(body = {}) {
  const {
    titulo,
    artista,
    genero,
    precoCusto,
    precoVenda,
    qtdEstoque,
    quantidade,
    estoqueMinimo,
  } = body;

  // Aceita "quantidade" ou "qtdEstoque" no JSON
  const estoque = qtdEstoque ?? quantidade;

  if (
    typeof titulo !== "string" ||
    !titulo.trim() ||
    typeof artista !== "string" ||
    !artista.trim() ||
    typeof genero !== "string" ||
    !genero.trim()
  ) {
    return "Título, artista e gênero são obrigatórios.";
  }

  if (
    precoCusto === undefined ||
    precoCusto === null ||
    precoCusto === "" ||
    !Number.isFinite(Number(precoCusto)) ||
    Number(precoCusto) < 0
  ) {
    return "Preço de custo inválido.";
  }

  if (
    precoVenda === undefined ||
    precoVenda === null ||
    precoVenda === "" ||
    !Number.isFinite(Number(precoVenda)) ||
    Number(precoVenda) < 0
  ) {
    return "Preço de venda inválido.";
  }

  if (
    estoque === undefined ||
    estoque === null ||
    estoque === "" ||
    !Number.isInteger(Number(estoque)) ||
    Number(estoque) < 0
  ) {
    return "Quantidade em estoque inválida.";
  }

  if (
    estoqueMinimo === undefined ||
    estoqueMinimo === null ||
    estoqueMinimo === "" ||
    !Number.isInteger(Number(estoqueMinimo)) ||
    Number(estoqueMinimo) < 0
  ) {
    return "Estoque mínimo inválido.";
  }

  return null;
}

export async function listar(req, res) {
  try {
    const { busca } = req.query;

    const discos = await prisma.disco.findMany({
      where: busca
        ? {
            OR: [
              { titulo: { contains: busca } },
              { artista: { contains: busca } },
              { genero: { contains: busca } },
            ],
          }
        : {},
      orderBy: { titulo: "asc" },
    });

    return res.json(discos);
  } catch (error) {
    console.error("Erro ao listar discos:", error);
    return res.status(500).json({ erro: "Erro ao listar discos." });
  }
}

export async function buscarPorId(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ erro: "ID inválido." });
    }

    const disco = await prisma.disco.findUnique({
      where: { id },
    });

    if (!disco) {
      return res.status(404).json({ erro: "Disco não encontrado." });
    }

    return res.json(disco);
  } catch (error) {
    console.error("Erro ao buscar disco:", error);
    return res.status(500).json({ erro: "Erro ao buscar disco." });
  }
}

export async function criar(req, res) {
  try {
    const erro = validar(req.body);

    if (erro) {
      return res.status(400).json({ erro });
    }

    const {
      titulo,
      artista,
      genero,
      precoCusto,
      precoVenda,
      qtdEstoque,
      quantidade,
      estoqueMinimo,
    } = req.body;

    const disco = await prisma.disco.create({
      data: {
        titulo: titulo.trim(),
        artista: artista.trim(),
        genero: genero.trim(),
        precoCusto: Number(precoCusto),
        precoVenda: Number(precoVenda),
        qtdEstoque: Number(qtdEstoque ?? quantidade),
        estoqueMinimo: Number(estoqueMinimo),
      },
    });

    return res.status(201).json(disco);
  } catch (error) {
    console.error("Erro ao criar disco:", error);
    return res.status(500).json({ erro: "Erro ao cadastrar disco." });
  }
}

export async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ erro: "ID inválido." });
    }

    const erro = validar(req.body);

    if (erro) {
      return res.status(400).json({ erro });
    }

    const {
      titulo,
      artista,
      genero,
      precoCusto,
      precoVenda,
      qtdEstoque,
      quantidade,
      estoqueMinimo,
    } = req.body;

    const disco = await prisma.disco.update({
      where: { id },
      data: {
        titulo: titulo.trim(),
        artista: artista.trim(),
        genero: genero.trim(),
        precoCusto: Number(precoCusto),
        precoVenda: Number(precoVenda),
        qtdEstoque: Number(qtdEstoque ?? quantidade),
        estoqueMinimo: Number(estoqueMinimo),
      },
    });

    return res.json(disco);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ erro: "Disco não encontrado." });
    }

    console.error("Erro ao atualizar disco:", error);
    return res.status(500).json({ erro: "Erro ao atualizar disco." });
  }
}

export async function excluir(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ erro: "ID inválido." });
    }

    const disco = await prisma.disco.findUnique({
      where: { id },
    });

    if (!disco) {
      return res.status(404).json({ erro: "Disco não encontrado." });
    }

    const temMov = await prisma.movimentacao.count({
      where: { discoId: id },
    });

    if (temMov > 0) {
      return res.status(409).json({
        erro: "Não é possível excluir: o disco possui movimentações.",
      });
    }

    await prisma.disco.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir disco:", error);
    return res.status(500).json({ erro: "Erro ao excluir disco." });
  }
}
