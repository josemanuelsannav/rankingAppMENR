import mongoose from "mongoose";


const juegoIndividualSchema = new mongoose.Schema({
    nombre: String,
    jugadores: [
        {
            nombre: String,
            id: String,
            puntos: Number
        }
    ],
    fecha : Date,
    rankingId: String
});


const JuegoIndividual = mongoose.model('JuegoIndividual', juegoIndividualSchema);

export default JuegoIndividual;