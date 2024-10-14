import Ranking from "../models/ranking.js";
import mongoose from "mongoose";

export const getRankingsPropietario = async (req, res) => {
    const { propietario } = req.params;
    console.log(propietario)
    console.log("Obteniendo rankings Propietario:");
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
        const rankings = await Ranking.find({
            'miembros': {
                $elemMatch: {
                    email: email,
                    estadoInvitacion: 'Aceptado'
                }
            }
        });
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
    res.status(201).json({ success: true, data: rankingActualizado });
};


export const aceptarInvitacion = async (req, res) => {
    const { id, email } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No existe un ranking con el id: ${id}`);
    }

    try {
        const ranking = await Ranking.findById(id);

        if (!ranking) {
            return res.status(404).send(`No existe un ranking con el id: ${id}`);
        }

        const miembro = ranking.miembros.find(miembro => miembro.email === email);

        if (!miembro) {
            return res.status(404).send(`No existe un miembro con el email: ${email} en este ranking`);
        }

        miembro.estadoInvitacion = 'Aceptado';

        await ranking.save();

        res.status(200).json({ success: true, data: ranking });
    } catch (error) {
        console.error("Error al aceptar la invitación", error);
        res.status(500).json({ success: false, message: "Error al aceptar la invitación" });
    }
};

export const obtenerRankingPorId = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No existe un ranking con el id: ${id}`);
    }

    try {
        const ranking = await Ranking.findById(id);

        if (!ranking) {
            return res.status(404).send(`No existe un ranking con el id: ${id}`);
        }

        res.status(200).json({ success: true, data: ranking });
    } catch (error) {
        console.error("Error al obtener el ranking", error);
        res.status(500).json({ success: false, message: "Error al obtener el ranking" });
    }
};