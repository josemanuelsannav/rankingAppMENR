import mongoose from "mongoose";


const usuarioSchema = new mongoose.Schema({
    nombre: String,
    email: String,
});


const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;