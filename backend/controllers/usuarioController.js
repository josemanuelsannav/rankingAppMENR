import Usuario  from "../models/usuario.js";
import mongoose from "mongoose";


export const getUsuario = async (req, res) => {
    console.log("Obteniendo usuario:" );
    const { email } = req.params;
    try {
        const usuario = await Usuario.findOne({ email: email });        res.status(200).json({ success: true, data: usuario });
    } catch (error) {
        console.error("Error al obtener el usuario", error);
        res.status(500).json({ success: false, message: "Error al obtener el usuario" });
    }

};

export const createUsuario = async (req, res) => {
    const usuario = req.body;
    if(!usuario.nombre){
         return res.status(400).send({succes:false,  message: "El nombre es obligatorio"});
    }
    console.log(usuario);
    const usuarioExistente = await Usuario.findOne({ email: usuario.email });
    if (usuarioExistente) {
        return res.status(202).send({ success: false, message: "Ya existe un usuario con ese email" });
    }
    const nuevoUsuario = new Usuario(usuario);
    try {
        await nuevoUsuario.save();
        res.status(201).json({ success: true, data: nuevoUsuario });
    } catch (error) {
        console.error("Error al guardar el usuario", error);
        res.status(500).json({ success: false, message: "Error al guardar el usuario" });
    }
};