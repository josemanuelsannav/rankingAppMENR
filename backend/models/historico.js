import mongoose from "mongoose";

// Definir el subesquema para los jugadores
const jugadorSchema = new mongoose.Schema({
    nombre: String,
    puntuacion: Number,
    winrate: Number,
    // otros campos relevantes
});

const historicoSchema = new mongoose.Schema({
    nombre: String,
    idJuego: String,
    jugadores: {
        type: [jugadorSchema], // Usar el subesquema para definir el campo jugadores
        default: []
    },
    fecha: Date
});

const Historico = mongoose.model('Historico', historicoSchema);

export default Historico;