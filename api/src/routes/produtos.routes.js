import { Router } from "express";
import { listar, buscarPorId, criar, atualizar, excluir } from "../controllers/produtos.controllers.js";

const router = Router();
router.get("/", listar);        // GET /discos?busca=beatles
router.get("/:id", buscarPorId);
router.post("/", criar);
router.put("/:id", atualizar);
router.delete("/:id", excluir);
export default router;