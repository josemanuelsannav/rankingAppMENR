import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
/////////////////////////////////////////////////////////
import jugadorRoutes from './routes/jugadoresRoute.js';
import juegoIndividualRoutes from './routes/juegosIndividualRoute.js';
import juegoEquipoRoutes from './routes/juegosEquipoRoute.js';
import juegoCategoria from './routes/juegoCategoriaRoute.js';
import duelosRoutes from './routes/duelosRoute.js';
import historicoRoutes from './routes/historicoRoute.js';
///////////////////////////////////////////////////
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.REACT_APP_BASE_URL, // Permite solicitudes desde este origen
    credentials: true,
  }));
  app.listen(PORT, () => {
    console.log('Server is running on '+PORT);
});

mongoose.connect(process.env.MONGO_URI);

// Control de errores
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conectado a la base de datos MongoDB");
});

app.use('/api/jugadores', jugadorRoutes);
app.use('/api/juegosIndividuales', juegoIndividualRoutes);
app.use('/api/juegosEquipos', juegoEquipoRoutes);
app.use('/api/juegosCategoria', juegoCategoria);
app.use('/api/duelos', duelosRoutes);
app.use('/api/historico', historicoRoutes);

