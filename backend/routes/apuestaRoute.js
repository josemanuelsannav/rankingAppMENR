import express from "express";
const router = express.Router();    
import { createApuesta,getApuestas,eliminarApuesta} from "../controllers/apuestaController.js";

router.post("/createApuesta", createApuesta);
router.get("/getApuestas/:rankingId", getApuestas);
router.delete("/eliminarApuesta/:id", eliminarApuesta);


export default router;