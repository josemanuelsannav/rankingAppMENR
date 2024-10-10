import mongoose from "mongoose";


const rankingSchema = new mongoose.Schema({
    nombre: String,
    propietario: String,
    miembros: [{ type: String }],
});


const Ranking = mongoose.model('Ranking', rankingSchema);

export default Ranking;