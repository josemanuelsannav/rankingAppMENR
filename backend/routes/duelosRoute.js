import express from "express";
const router = express.Router();    
import { createDuelo,getDuelos,eliminarDuelo} from "../controllers/dueloController.js";

router.post("/nuevoDuelo", createDuelo);
router.get("/todosLosDuelos/:rankingId", getDuelos);
router.delete("/eliminarDuelo/:id", eliminarDuelo);
export default router;