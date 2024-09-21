import mongoose from "mongoose";


const jugadorSchema = new mongoose.Schema({
    nombre: String,
    foto: String,
    puntuacion: Number,
    winrate: Number
});


const Jugador = mongoose.model('Jugador', jugadorSchema);

export default Jugador;