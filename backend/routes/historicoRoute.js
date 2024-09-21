import express from "express";
const router = express.Router();    
import { createHistorico,getHistoricos,eliminarHistorico } from "../controllers/historicoController.js";

router.post("/nuevoHistorico", createHistorico);
router.get("/todosLosHistoricos", getHistoricos);
router.delete("/eliminarHistorico/:idJuego", eliminarHistorico);

export default router;