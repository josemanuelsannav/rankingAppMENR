import Comentario from "../models/comentario.js";
import mongoose from "mongoose";

export const getComentarios = async (req, res) => {
    try {
        console.log("Aqui tamos");
        const juegoId = req.params.juegoId;
        const comentaios = await Comentario.find({ juegoId: juegoId });
        res.status(200).json({ success: true, data: comentaios });
    } catch (error) {
        console.error("Error al obtener los comentarios", error);
        res.status(500).json({ success: false, message: "Error al obtener los comentarios" });
    }
};

export const createComentario = async (req, res) => {
    const comentario = req.body;
    if(!comentario.comentario){
         return res.status(400).send({succes:false,  message: "El comentario es obligatorio"});
       
    }
    
    const nuevoComentario = new Comentario(comentario);
    try {
        const fechaActual = new Date();
        const offset = fechaActual.getTimezoneOffset();
        const fechaEspaña = new Date(fechaActual.getTime() - (offset * 60 * 1000));
        nuevoComentario.fecha = fechaEspaña;
        const comentarioGuardado = await nuevoComentario.save();
        res.status(201).json(comentarioGuardado);
    } catch (error) {
        console.error("Error al guardar el comentario", error);
        res.status(500).json({ success: false, message: "Error al guardar el comentario" });
    }
};