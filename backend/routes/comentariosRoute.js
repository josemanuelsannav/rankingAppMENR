import express from "express";
const router = express.Router();    
import { createComentario,getComentarios} from "../controllers/comentarioController.js";

router.post("/nuevoComentario", createComentario);
router.get("/todosLosComentarios/:juegoId", getComentarios);
export default router;