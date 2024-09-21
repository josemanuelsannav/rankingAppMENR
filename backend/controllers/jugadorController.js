import Jugador from "../models/jugador.js";
import mongoose from "mongoose";

export const getJugadores = async (req, res) => {
    console.log("Obteniendo jugadores:" + process.env.MONGO_URI);
    try {
        const jugadores = await Jugador.find();
        res.status(200).json({ success: true, data: jugadores });
    } catch (error) {
        console.error("Error al obtener los jugadores", error);
        res.status(500).json({ success: false, message: "Error al obtener los jugadores" });
    }
};

export const createJugador = async (req, res) => {
    const jugador = req.body;
    if(!jugador.nombre){
         return res.status(400).send({succes:false,  message: "El nombre es obligatorio"});
       
    }
    console.log(jugador);
    const nuevoJugador = new Jugador(jugador);
    try {
        await nuevoJugador.save();
        res.status(201).json({ success: true, data: nuevoJugador });
    } catch (error) {
        console.error("Error al guardar el jugador", error);
        res.status(500).json({ success: false, message: "Error al guardar el jugador" });
    }
};

export const actualizarPuntuacion = async (req, res) => {
    const { id } = req.params;
    const { puntos } = req.body;
    if (puntos == undefined) {
        console.log("puntos es undefined", puntos);
        return res.status(400).send({ success: false, message: "Los puntos son obligatorios" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send({ success: false, message: "No se encontró un jugador con el id proporcionado" });
    }
    try {
        const jugador = await Jugador.findById(id);
        if (!jugador) {
            return res.status(404).send({ success: false, message: "No se encontró un jugador con el id proporcionado" });
        }
        jugador.puntuacion += puntos;
        await jugador.save();
        res.status(200).json({ success: true, message: "Puntuación actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar la puntuación del jugador", error);
        res.status(500).json({ success: false, message: "Error al actualizar la puntuación del jugador" });
    }
}

