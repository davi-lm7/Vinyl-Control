
import prisma from "../data/prisma.js";

export async function listar(req, res) {
  try {
    const movs = await prisma.movimentacao.findMany({
      include: {
        disco: {
          select: { titulo: true, artista: true },
        },
        usuario: {
          select: { nome: true },
        },
      },
      orderBy: { data: "desc" },
    });

    return res.json(movs);
  } catch (error) {
    console.error("Erro ao listar movimentações:", error);
    return res.status(500).json({
      erro: "Erro ao listar movimentações.",
    });
  }
}

export async function criar(req, res) {
  try {
    const {
      discoId,
      usuarioId,
      tipo,
      quantidade,
      data,
      observacao,
    } = req.body ?? {};

    // Validar campos obrigatórios
    if (
      discoId === undefined ||
      discoId === null ||
      discoId === "" ||
      usuarioId === undefined ||
      usuarioId === null ||
      usuarioId === "" ||
      !tipo ||
      quantidade === undefined ||
      quantidade === null ||
      quantidade === "" ||
      !data
    ) {
      return res.status(400).json({
        erro: "Informe disco, usuário, tipo, quantidade e data.",
      });
    }

    // Aceitar ENTRADA, entrada, SAIDA, saída e variações
    const tipoNormalizado = String(tipo)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (!["entrada", "saida"].includes(tipoNormalizado)) {
      return res.status(400).json({
        erro: "Tipo deve ser 'entrada' ou 'saida'.",
      });
    }

    const idDisco = Number(discoId);
    const idUsuario = Number(usuarioId);
    const qtd = Number(quantidade);
    const dataMov = new Date(data);

    if (!Number.isInteger(idDisco) || idDisco <= 0) {
      return res.status(400).json({
        erro: "ID do disco inválido.",
      });
    }

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
      return res.status(400).json({
        erro: "ID do usuário inválido.",
      });
    }

    if (!Number.isInteger(qtd) || qtd <= 0) {
      return res.status(400).json({
        erro: "Quantidade deve ser um inteiro maior que zero.",
      });
    }

    if (Number.isNaN(dataMov.getTime())) {
      return res.status(400).json({
        erro: "Data inválida. Use o formato ISO, por exemplo: 2026-10-23T10:00:00.000Z.",
      });
    }

    const disco = await prisma.disco.findUnique({
      where: { id: idDisco },
    });

    if (!disco) {
      return res.status(404).json({
        erro: "Disco não encontrado.",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: idUsuario },
    });

    if (!usuario) {
      return res.status(404).json({
        erro: "Usuário não encontrado.",
      });
    }

    if (
      tipoNormalizado === "saida" &&
      qtd > disco.qtdEstoque
    ) {
      return res.status(400).json({
        erro: `Estoque insuficiente. Disponível: ${disco.qtdEstoque}.`,
      });
    }

    const novaQtd =
      tipoNormalizado === "entrada"
        ? disco.qtdEstoque + qtd
        : disco.qtdEstoque - qtd;

    const resultado = await prisma.$transaction(async (tx) => {
      const movimentacao = await tx.movimentacao.create({
        data: {
          discoId: idDisco,
          usuarioId: idUsuario,
          tipo: tipoNormalizado,
          quantidade: qtd,
          data: dataMov,
          observacao: observacao || null,
        },
      });

      await tx.disco.update({
        where: { id: idDisco },
        data: { qtdEstoque: novaQtd },
      });

      return movimentacao;
    });

    let alerta = null;

    if (
      tipoNormalizado === "saida" &&
      novaQtd < disco.estoqueMinimo
    ) {
      alerta = `Atenção: "${disco.titulo}" ficou com ${novaQtd} un., abaixo do mínimo (${disco.estoqueMinimo}).`;
    }

    return res.status(201).json({
      movimentacao: resultado,
      estoqueAtual: novaQtd,
      alerta,
    });
  } catch (error) {
    console.error("Erro ao criar movimentação:", error);

    return res.status(500).json({
      erro: "Erro interno ao registrar movimentação.",
    });
  }
}
