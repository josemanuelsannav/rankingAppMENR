import Apuesta from "../models/apuesta.js";
import mongoose from "mongoose";



export const getApuestas = async (req, res) => {
    try {
        const rankingId = req.params.rankingId;
        const apuestas = await Apuesta.find({ rankingId: rankingId });
        res.status(200).json({ success: true, data: apuestas });
    } catch (error) {
        console.error("Error al obtener los apuestas", error);
        res.status(500).json({ success: false, message: "Error al obtener los apuestas" });
    }
};

export const createApuesta = async (req, res) => {
    const apuesta = req.body;
    if(!apuesta.ganador || apuesta.ganador.length === 0 || !apuesta.perdedor || apuesta.perdedor.length === 0){
         return res.status(400).send({succes:false,  message: "El ganador/perdedor es obligatorio"});
    }
    
    const nuevaApuesta = new Apuesta(apuesta);
    try {
        const fechaActual = new Date();
        const offset = fechaActual.getTimezoneOffset();
        const fechaEspaña = new Date(fechaActual.getTime() - (offset * 60 * 1000));
        nuevaApuesta.fecha = fechaEspaña;
        const apuestaGuardada = await nuevaApuesta.save();
        res.status(201).json(apuestaGuardada);
    } catch (error) {
        console.error("Error al guardar el duelo", error);
        res.status(500).json({ success: false, message: "Error al guardar el duelo" });
    }
};