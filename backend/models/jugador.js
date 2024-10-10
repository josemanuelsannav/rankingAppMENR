import mongoose from "mongoose";


const jugadorSchema = new mongoose.Schema({
    nombre: String,
    foto: String,
    puntuacion: Number,
    rankingId: String,
});


const Jugador = mongoose.model('Jugador', jugadorSchema);

export default Jugador;