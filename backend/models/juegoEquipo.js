import mongoose from "mongoose";


const juegoEquipoSchema = new mongoose.Schema({
    nombre: String,
    equipos: [
        {
            nombre: String,
            integrantes: [
                {
                    nombre: String,
                    id: String,
                }
            ],
            puntos: Number,
        }
    ],
    fecha : Date,
    rankingId: String
});


const JuegoEquipo = mongoose.model('JuegoEquipo', juegoEquipoSchema);

export default JuegoEquipo;