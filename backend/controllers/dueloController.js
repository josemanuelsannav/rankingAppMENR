import Duelo from "../models/duelo.js";
import mongoose from "mongoose";
import Jugador from "../models/jugador.js";
export const getDuelos = async (req, res) => {
    try {
        const duelos = await Duelo.find();
        res.status(200).json({ success: true, data: duelos });
    } catch (error) {
        console.error("Error al obtener los duelos", error);
        res.status(500).json({ success: false, message: "Error al obtener los duelos" });
    }
};

export const createDuelo = async (req, res) => {
    const duelo = req.body;
    if(!duelo.nombre){
         return res.status(400).send({succes:false,  message: "El nombre es obligatorio"});
       
    }
    
    const nuevoDuelo = new Duelo(duelo);
    try {
        const fechaActual = new Date();
        const offset = fechaActual.getTimezoneOffset();
        const fechaEspaña = new Date(fechaActual.getTime() - (offset * 60 * 1000));
        nuevoDuelo.fecha = fechaEspaña;
        const dueloGuardado = await nuevoDuelo.save();
        res.status(201).json(dueloGuardado);
    } catch (error) {
        console.error("Error al guardar el duelo", error);
        res.status(500).json({ success: false, message: "Error al guardar el duelo" });
    }
};


export const eliminarDuelo = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No existe un duelo con el id: ${id}`);
    }

    const duelo = await Duelo.findById(id);
    const jugadores = await Jugador.find();
    for (const jugador of jugadores) {
        if(jugador.nombre === duelo.ganadorNombre){ //quitandole los puntos
            jugador.puntuacion = Number(jugador.puntuacion) - Number(duelo.apuesta);
            console.log("Jugador antes de actualizar:", jugador);

            const jugadorUpdated = await Jugador.findByIdAndUpdate(jugador._id, { puntuacion: jugador.puntuacion }, { new: true });
            console.log("Jugador después de actualizar:", jugadorUpdated);
        }else if(jugador.nombre === duelo.perdedorNombre){ //devolviendo los puntos
            jugador.puntuacion = Number(jugador.puntuacion) + Number(duelo.apuesta);
            console.log("Jugador antes de actualizar:", jugador);

            const jugadorUpdated = await Jugador.findByIdAndUpdate(jugador._id, { puntuacion: jugador.puntuacion }, { new: true });
            console.log("Jugador después de actualizar:", jugadorUpdated);
        }
    }

    await Duelo.findByIdAndDelete(id);
    res.json({ message: "Duelo eliminado con éxito" });
};