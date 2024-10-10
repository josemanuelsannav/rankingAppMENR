import express from "express";
const router = express.Router();
import { getUsuario ,createUsuario,getTodosLosUsuarios} from "../controllers/usuarioController.js";


router.get("/getUsuario/:email", getUsuario);
router.post("/nuevoUsuario", createUsuario);
router.get("/todosLosUsuarios", getTodosLosUsuarios);

export default router;