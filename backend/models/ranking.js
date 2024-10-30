import mongoose from "mongoose";


const rankingSchema = new mongoose.Schema({
    nombre: String,
    propietario: String,
    miembros: [{
        email: {
            type: String
        },
        estadoInvitacion: {
            type: String
        },
        permiso : {
            type: Boolean
        }
    }],
});


const Ranking = mongoose.model('Ranking', rankingSchema);

export default Ranking;