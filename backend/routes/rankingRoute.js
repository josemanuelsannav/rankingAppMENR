import express from "express";
import mongoose from "mongoose";
const router = express.Router();    
import { getRankingsPropietario, getRankingsMiembro,createRanking,editarRanking,aceptarInvitacion,obtenerRankingPorId} from "../controllers/rankingController.js";

router.post("/nuevoRanking", createRanking);
router.get("/rankingsPropietario/:propietario", getRankingsPropietario);
router.get("/rankingsMiembro/:email", getRankingsMiembro);
router.put("/editarRanking/:id", editarRanking);
router.put("/aceptarInvitacion/:id/:email", aceptarInvitacion);
router.get("/obtenerRanking/:id", obtenerRankingPorId);

export default router;