import Ranking from "../models/ranking.js";
import mongoose from "mongoose";

export const getRankingsPropietario = async (req, res) => {
    const { propietario } = req.params;
    console.log(propietario)
    console.log("Obteniendo rankings Propietario:" );
    try {
        const rankings = await Ranking.find({ propietario: propietario });
        res.status(200).json({ success: true, data: rankings });
    } catch (error) {
        console.error("Error al obtener los rankings", error);
        res.status(500).json({ success: false, message: "Error al obtener los rankings" });
    }
};

export const getRankingsMiembro = async (req, res) => {
    const { email } = req.params;
    console.log("Obteniendo rankings del miembro:", email);
    try {
        const rankings = await Ranking.find({ miembros: email });
        res.status(200).json({ success: true, data: rankings });
    } catch (error) {
        console.error("Error al obtener los rankings", error);
        res.status(500).json({ success: false, message: "Error al obtener los rankings" });
    }
};

export const createRanking = async (req, res) => {
    const ranking = req.body;
    console.log(ranking);
    
    const nuevoRanking = new Ranking(ranking);
    try {
        await nuevoRanking.save();
        res.status(201).json({ success: true, data: nuevoRanking });
    } catch (error) {
        console.error("Error al guardar el jugador", error);
        res.status(500).json({ success: false, message: "Error al guardar el ranking" });
    }
};

export const editarRanking = async (req, res) => {
    const { id } = req.params;
    const ranking = req.body;
    console.log(ranking);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No existe un ranking con el id: ${id}`);
    }
    const rankingActualizado = await Ranking.findByIdAndUpdate(id, { ...ranking, _id: id }, { new: true });
    res.json(rankingActualizado);
};
