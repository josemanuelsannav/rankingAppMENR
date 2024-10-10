import JuegoEquipo from "../models/juegoEquipo.js";
import mongoose from "mongoose";
import Jugador from "../models/jugador.js";

export const getJuegosEquipo = async (req, res) => {
    try {
        const rankingId = req.params.rankingId;
        const juegosEquipo = await JuegoEquipo.find({ rankingId: rankingId });
        res.status(200).json({ success: true, data: juegosEquipo });
    } catch (error) {
        console.error("Error al obtener los juegosEquipo", error);
        res.status(500).json({ success: false, message: "Error al obtener los juegosEquipo" });
    }
};

export const createJuegoEquipo = async (req, res) => {
    const juegoEquipo = req.body;
    if(!juegoEquipo.nombre){
         return res.status(400).send({succes:false,  message: "El nombre es obligatorio"});
       
    }
    console.log(juegoEquipo);
    const nuevoJuegoEquipo = new JuegoEquipo(juegoEquipo);
    try {
        
        const fechaActual = new Date();
        const offset = fechaActual.getTimezoneOffset();
        const fechaEspaña = new Date(fechaActual.getTime() - (offset * 60 * 1000));
        nuevoJuegoEquipo.fecha = fechaEspaña;

        const juegoGuardado = await nuevoJuegoEquipo.save();
        res.status(201).json(juegoGuardado);
    } catch (error) {
        console.error("Error al guardar el juegoEquipo", error);
        res.status(500).json({ success: false, message: "Error al guardar el juegoEquipo" });
    }
};

export const eliminarJuegoEquipo = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No existe un juegoEquipo con el id: ${id}`);
    }
    const juegoEquipo = await JuegoEquipo.findById(id);
    const jugadores = await Jugador.find();
    console.log("Estamos en eliminarJuegoEquipo");
    for (const jugador of jugadores) {
        for(const equipo of juegoEquipo.equipos){
            for(const jugadorEquipo of equipo.integrantes){
                if(jugadorEquipo.nombre === jugador.nombre){
                    jugador.puntuacion = Number(jugador.puntuacion) - Number(equipo.puntos);
                    console.log("Jugador antes de actualizar:", jugador);

                    const jugadorUpdated = await Jugador.findByIdAndUpdate(jugador._id, { puntuacion: jugador.puntuacion }, { new: true });
                    console.log("Jugador después de actualizar:", jugadorUpdated);
                }
            }
        }
    }
    await JuegoEquipo.findByIdAndDelete(id);
    res.json({ message: "JuegoIndividual eliminado con éxito" });
};