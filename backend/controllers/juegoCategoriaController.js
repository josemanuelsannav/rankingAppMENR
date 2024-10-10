import JuegoCategoria from "../models/juegoCategoria.js";
import mongoose from "mongoose";


export const createJuegoCategoria = async (req, res) => {
    const juegoCategoria = req.body;
    if(!juegoCategoria.nombre){
         return res.status(400).send({succes:false,  message: "El nombre es obligatorio"});
    }
    console.log(juegoCategoria);
    const nuevojuegoCategoria = new JuegoCategoria(juegoCategoria);
    try {
        await nuevojuegoCategoria.save();
        res.status(201).json({ success: true, data: nuevojuegoCategoria });
    } catch (error) {
        console.error("Error al guardar el juegoCategoria", error);
        res.status(500).json({ success: false, message: "Error al guardar el juegoCategoria" });
    }
};

export const getAllJuegosCategoriass = async (req, res) => {
    try {
        const rankingId = req.params.rankingId;
        const juegoCategoria = await JuegoCategoria.find({rankingId:rankingId}).sort({ nombre: 1 });
        res.status(200).json({ success: true, data: juegoCategoria });
    } catch (error) {
        console.error("Error al obtener los juegoCategoria", error);
        res.status(500).json({ success: false, message: "Error al obtener los juegoCategoria" });
    }
};