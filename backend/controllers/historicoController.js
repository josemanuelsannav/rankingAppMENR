import Historico from "../models/historico.js";
import mongoose from "mongoose";
import JuegoIndividual from "../models/juegoIndividual.js";
import JuegoEquipo from "../models/juegoEquipo.js";
import Duelo from "../models/duelo.js";
import { parse } from "dotenv";

export const getHistoricos = async (req, res) => {
    try {
        const historicos = await Historico.find();
        res.status(200).json({ success: true, data: historicos });
    } catch (error) {
        console.error("Error al obtener los historicos", error);
        res.status(500).json({ success: false, message: "Error al obtener los historicos" });
    }
};

export const createHistorico = async (req, res) => {
    const historico = req.body;
    if (!historico.nombre) {
        return res.status(400).send({ succes: false, message: "El nombre es obligatorio" });

    }

    const nuevoHistorico = new Historico(historico);
    try {
        const fechaActual = new Date();
        const offset = fechaActual.getTimezoneOffset();
        const fechaEspaña = new Date(fechaActual.getTime() - (offset * 60 * 1000));
        nuevoHistorico.fecha = fechaEspaña;
        nuevoHistorico.jugadores.sort((a, b) => b.puntuacion - a.puntuacion);
        await nuevoHistorico.save();
        res.status(201).json({ success: true, data: nuevoHistorico });
    } catch (error) {
        console.error("Error al guardar el historico", error);
        res.status(500).json({ success: false, message: "Error al guardar el historico" });
    }
};

export const eliminarHistorico = async (req, res) => {
    console.log("Estamos dentro de borrar historico");
    const { idJuego } = req.params;
    const historico = await Historico.findOne({ idJuego });
    if (!historico) {
        return res.status(404).send(`No existe un historico con el idJuego: ${idJuego}`);
    }
    const historicos = await Historico.find();
    const juegoIndividual = await JuegoIndividual.findById(idJuego);
    const juegoEquipo = await JuegoEquipo.findById(idJuego);

    if (!juegoIndividual && !juegoEquipo) {
        const duelo = await Duelo.findById(idJuego);
        if (!duelo) {
            return res.status(404).send(`No existe un duelo con el id: ${idJuego}`);
        }
        const index = historicos.findIndex(historico => historico.idJuego === idJuego);
        let cont = 0;
        for (const historicoAux of historicos) {
            if (cont >= index) {
                for (const jugadorHistorico of historicoAux.jugadores) {
                    if (jugadorHistorico.nombre === duelo.ganadorNombre) {
                        jugadorHistorico.puntuacion = parseInt(jugadorHistorico.puntuacion) + parseInt(duelo.apuesta);
                    }else if (jugadorHistorico.nombre === duelo.perdedorNombre) {
                        jugadorHistorico.puntuacion = parseInt(jugadorHistorico.puntuacion) - parseInt(duelo.apuesta);
                    }
                }
                await Historico.findByIdAndUpdate(historicoAux._id, historicoAux);
            }
            cont++;
        }

    } else {
        if (!juegoIndividual) {
            //es juego de equipo
            if (!juegoEquipo) {
                return res.status(404).send(`No existe un juego ni de equipo ni individual con el id: ${idJuego}`);
            }

            const index = historicos.findIndex(historico => historico.idJuego === idJuego);
            let cont = 0;
            for (const historicoAux of historicos) {
                if (cont >= index) {
                    for (const jugadorHistorico of historicoAux.jugadores) {
                        for (const equipo of juegoEquipo.equipos) {
                            for (const jugadorEquipo of equipo.integrantes) {
                                if (jugadorHistorico.nombre === jugadorEquipo) {
                                    let jugadorJuego = historicoAux.jugadores.find(j => j.nombre === jugadorHistorico.nombre);
                                    if (jugadorJuego) {
                                        jugadorHistorico.puntuacion = parseInt(jugadorHistorico.puntuacion) - parseInt(equipo.puntos);
                                    }
                                }
                            }
                        }
                    }
                    await Historico.findByIdAndUpdate(historicoAux._id, historicoAux);
                }
                cont++;
            }
        } else {//es juego individual
            const index = historicos.findIndex(historico => historico.idJuego === idJuego);
            let cont = 0;
            for (const historicoAux of historicos) {
                if (cont >= index) {
                    for (const jugadorHistorico of historicoAux.jugadores) {
                        let jugadorJuego = juegoIndividual.jugadores.find(jugador => jugador.nombre === jugadorHistorico.nombre);
                        if (jugadorJuego) {
                            jugadorHistorico.puntuacion = jugadorHistorico.puntos - jugadorJuego.puntuacion;
                        }
                    }
                    await Historico.findByIdAndUpdate(historicoAux._id, historicoAux);

                }
                cont++;
            }
        }

    }

    await Historico.findByIdAndDelete(historico._id);


    res.json({ message: "Historico eliminado con éxito" });

};