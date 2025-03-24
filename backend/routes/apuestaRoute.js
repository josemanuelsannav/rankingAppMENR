import express from "express";
const router = express.Router();    
import { createApuesta,getApuestas} from "../controllers/apuestaController.js";

router.post("/createApuesta", createApuesta);
router.get("/getApuestas/:rankingId", getApuestas);

export default router;