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
import usuarioRoutes from './routes/usuarioRoute.js';
import rankingRoutes from './routes/rankingRoute.js';
///////////////////////////////////////////////////
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: process.env.REACT_APP_BASE_URL || "http://localhost:5173" || "https://ranking-app-menr-front.vercel.app",
    credentials: true,
}));

// Content Security Policy (CSP) configuration
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'self' https://vercel.live; connect-src 'self' https://vercel.live");
    next();
});

app.listen(PORT, () => {
    console.log('Server is running on ' + PORT);
});

mongoose.connect(process.env.MONGO_URI);


// Error handling
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
    console.log("Conectado a la base de datos MongoDB");
});

// API routes
app.use('/api/jugadores', jugadorRoutes);
app.use('/api/juegosIndividuales', juegoIndividualRoutes);
app.use('/api/juegosEquipos', juegoEquipoRoutes);
app.use('/api/juegosCategoria', juegoCategoria);
app.use('/api/duelos', duelosRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/rankings', rankingRoutes);
