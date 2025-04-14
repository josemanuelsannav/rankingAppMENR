import Apuesta from "../models/apuesta.js";
import mongoose from "mongoose";
import Jugador from "../models/jugador.js";


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

export const eliminarApuesta = async (req, res) => {
    const { id } = req.params;
    console.log("Estamos dentro de borrar apuesta", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No existe apuesta con el id: ${id}`);
    }
    const apuesta = await Apuesta.findById(id);
    const jugadores = await Jugador.find();
    for (const jugador of jugadores) {
        for (const apuestaPersona of apuesta.apuestasPersona) {
            if (apuestaPersona.jugador.nombre === jugador.nombre) {
                if(apuestaPersona.resultado === "ganador"){
                    jugador.puntuacion = Number(jugador.puntuacion) - (Number(apuestaPersona.apuesta) * Number(apuesta.cuotaGanador)) + Number(apuestaPersona.apuesta);
                }
                else{
                    jugador.puntuacion = Number(jugador.puntuacion) + Number(apuestaPersona.apuesta) ;
                }
                console.log("Jugador antes de actualizar:", jugador);

                const jugadorUpdated = await Jugador.findByIdAndUpdate(jugador._id, { puntuacion: jugador.puntuacion }, { new: true });
                console.log("Jugador después de actualizar:", jugadorUpdated);
            }
        }
    }
    await Apuesta.findByIdAndDelete(id);
    res.json({ message: "Apuesta eliminado con éxito" });


};