import mongoose from "mongoose";


const apuesta = new mongoose.Schema({
    fecha : Date,
    ganador: [
        {
            personaId: String,
            nombre: String
        }
    ],
    perdedor: [
        {
            personaId: String,
            nombre: String
        }
    ],
    rankingId: String,
    juegoNombre: String,
    apuestaId: String,
    apuestasPersona: [
        
    ],
    cuotaGanador: Number,
    cuotaPerdedor: Number,
});


const Apuesta = mongoose.model('Apuesta', apuesta);

export default Apuesta;