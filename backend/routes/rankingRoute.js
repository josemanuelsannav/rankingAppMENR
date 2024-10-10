import express from "express";
import mongoose from "mongoose";
const router = express.Router();    
import { getRankingsPropietario, getRankingsMiembro,createRanking,editarRanking } from "../controllers/rankingController.js";

router.post("/nuevoRanking", createRanking);
router.get("/rankingsPropietario/:propietario", getRankingsPropietario);
router.get("/rankingsMiembro/:email", getRankingsMiembro);
router.put("/editarRanking/:id", editarRanking);
export default router;