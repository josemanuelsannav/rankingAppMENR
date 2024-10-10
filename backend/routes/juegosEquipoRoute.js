import express from "express";
const router = express.Router();    
import { createJuegoEquipo,getJuegosEquipo,eliminarJuegoEquipo } from "../controllers/juegoEquipoController.js";

router.post("/nuevoJuegoEquipo", createJuegoEquipo);
router.get("/todosLosJuegosEquipo/:rankingId", getJuegosEquipo);
router.delete("/eliminarJuegoEquipo/:id", eliminarJuegoEquipo);
export default router;