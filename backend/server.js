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

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173' // Permite solicitudes desde este origen
  }));

app.use('/api/jugadores', jugadorRoutes);
app.use('/api/juegosIndividuales', juegoIndividualRoutes);
app.use('/api/juegosEquipos', juegoEquipoRoutes);
app.use('/api/juegosCategoria', juegoCategoria);
app.use('/api/duelos', duelosRoutes);
app.use('/api/historico', historicoRoutes);

app.listen(3000, () => {
    connectDB();
    console.log('Server is running on http://localhost:3000' );
});