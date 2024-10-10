import express from "express";
const router = express.Router();
import { getUsuario ,createUsuario} from "../controllers/usuarioController.js";


router.get("/getUsuario/:email", getUsuario);
router.post("/nuevoUsuario", createUsuario);

export default router;