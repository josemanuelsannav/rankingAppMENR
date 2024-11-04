import mongoose from "mongoose";


const comentario = new mongoose.Schema({
    fecha :Date,
    comentario: String,
    usuarioId: String,
    juegoId: String
});


const Comentario = mongoose.model('Comentario', comentario);

export default Comentario;