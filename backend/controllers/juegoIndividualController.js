import JuegoIndividual from "../models/juegoIndividual.js";
import mongoose from "mongoose";
import Jugador from "../models/jugador.js";

export const getJuegosIndividuales = async (req, res) => {
    try {
        const rankingId = req.params.rankingId;
        const juegosIndividuales = await JuegoIndividual.find({rankingId:rankingId});
        res.status(200).json({ success: true, data: juegosIndividuales });
    } catch (error) {
        console.error("Error al obtener los juegosIndividuales", error);
        res.status(500).json({ success: false, message: "Error al obtener los juegosIndividuales" });
    }
};

export const createJuegoIndividual = async (req, res) => {
    const juegoIndividual = req.body;
    if (!juegoIndividual.nombre) {
        return res.status(400).send({ succes: false, message: "El nombre es obligatorio" });

    }

    const nuevoJuegoIndividual = new JuegoIndividual(juegoIndividual);
    try {
        const fechaActual = new Date();
        const offset = fechaActual.getTimezoneOffset();
        const fechaEspaña = new Date(fechaActual.getTime() - (offset * 60 * 1000));
        nuevoJuegoIndividual.fecha = fechaEspaña;

        const juegoGuardado = await nuevoJuegoIndividual.save();
        res.status(201).json(juegoGuardado);
    } catch (error) {
        console.error("Error al guardar el juegoIndividual", error);
        res.status(500).json({ success: false, message: "Error al guardar el juegoIndividual" });
    }
};

export const eliminarJuegoIndividual = async (req, res) => {
    const { id } = req.params;
    console.log("Estamos dentro de borrar juego", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No existe un juegoIndividual con el id: ${id}`);
    }
    const juegoIndividual = await JuegoIndividual.findById(id);
    const jugadores = await Jugador.find();
    for (const jugador of jugadores) {
        for (const jugadorIndividual of juegoIndividual.jugadores) {
            if (jugadorIndividual.nombre === jugador.nombre) {
                jugador.puntuacion = Number(jugador.puntuacion) - Number(jugadorIndividual.puntos);
                console.log("Jugador antes de actualizar:", jugador);

                const jugadorUpdated = await Jugador.findByIdAndUpdate(jugador._id, { puntuacion: jugador.puntuacion }, { new: true });
                console.log("Jugador después de actualizar:", jugadorUpdated);
            }
        }
    }
    await JuegoIndividual.findByIdAndDelete(id);
    res.json({ message: "JuegoIndividual eliminado con éxito" });


};

