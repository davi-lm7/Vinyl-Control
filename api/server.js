
import express from "express";
import cors from "cors";
import "dotenv/config";

import produtosRoutes from "./src/routes/produtos.routes.js";
import movimentacoesRoutes from "./src/routes/movimentacoes.routes.js";
import usuariosRoutes from "./src/routes/usuarios.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/discos", produtosRoutes);
app.use("/movimentacoes", movimentacoesRoutes);
app.use("/usuarios", usuariosRoutes);

// Rota inicial para verificar se a API está funcionando
app.get("/", (req, res) => {
  res.json({
    mensagem: "API Vinyl Control funcionando!",
  });
});

// Tratamento de JSON inválido
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      erro: "JSON inválido. Verifique o corpo da requisição.",
    });
  }

  next(err);
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Vinyl Control rodando na porta ${PORT}`);
});
