
import { Router } from "express";
import {
  cadastrar,
  login,
} from "../controllers/usuarios.controllers.js";

const router = Router();

router.post("/", cadastrar);
router.post("/login", login);

export default router;
