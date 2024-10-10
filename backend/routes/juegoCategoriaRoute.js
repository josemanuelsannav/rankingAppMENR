import express from "express";
const router = express.Router();    
import { createJuegoCategoria, getAllJuegosCategoriass } from "../controllers/juegoCategoriaController.js";

router.post("/nuevoJuegoCategoria", createJuegoCategoria);
router.get("/todosLosJuegosCategoria/:rankingId", getAllJuegosCategoriass);

export default router;