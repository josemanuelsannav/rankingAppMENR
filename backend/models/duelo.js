import mongoose from "mongoose";


const duelo = new mongoose.Schema({
    nombre: String,
    apuesta: Number,
    ganador: String,
    ganadorNombre: String,
    perdedor: String,
    perdedorNombre: String,
    fecha : Date
});


const Duelo = mongoose.model('Duelo', duelo);

export default Duelo;