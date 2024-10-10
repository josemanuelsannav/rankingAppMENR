import express from "express";
const router = express.Router();    
import { createJuegoIndividual,getJuegosIndividuales,eliminarJuegoIndividual } from "../controllers/juegoIndividualController.js";

router.post("/nuevoJuegoIndividual", createJuegoIndividual);
router.get("/todosLosJuegosIndividuales/:rankingId", getJuegosIndividuales);
router.delete("/eliminarJuegoIndividual/:id", eliminarJuegoIndividual);

export default router;