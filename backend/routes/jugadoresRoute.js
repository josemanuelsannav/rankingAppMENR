import express from "express";
import mongoose from "mongoose";
const router = express.Router();    
import { createJugador, getJugadores,actualizarPuntuacion } from "../controllers/jugadorController.js";

router.post("/nuevoJugador", createJugador);
router.get("/todosLosJugadores", getJugadores);
router.put("/actualizarPuntuacion/:id", actualizarPuntuacion);
export default router;