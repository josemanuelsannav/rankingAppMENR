import mongoose from "mongoose";


const juegoCategoriaSchema = new mongoose.Schema({
    nombre: String
});


const JuegoCategoria = mongoose.model('JuegoCategoria', juegoCategoriaSchema);

export default JuegoCategoria;