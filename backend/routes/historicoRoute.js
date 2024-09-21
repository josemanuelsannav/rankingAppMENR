import express from "express";
const router = express.Router();    
import { createHistorico,getHistoricos,eliminarHistorico } from "../controllers/HistoricoController.js";

router.post("/nuevoHistorico", createHistorico);
router.get("/todosLosHistoricos", getHistoricos);
router.delete("/eliminarHistorico/:idJuego", eliminarHistorico);

export default router;