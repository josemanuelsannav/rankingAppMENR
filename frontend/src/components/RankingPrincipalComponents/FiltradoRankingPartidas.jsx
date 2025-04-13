import { set } from 'mongoose';
import React, { useEffect, useState } from 'react'

const FiltradoRankingPartidas = ({ historico }) => {

    const historicoOrdenado = historico.sort((a, b) => {
        return new Date(a.fecha) - new Date(b.fecha);
    });    

    const [juegoSeleccionadoDesde, setJuegoSeleccionadoDesde] = useState('');
    const [juegoSeleccionadoHasta, setJuegoSeleccionadoHasta] = useState('');

    const [showJuegosFiltradosModal, setShowJuegosFiltradosModal] = useState(false);
    const [jugadoresFiltrados, setJugadoresFiltrados] = useState([]);
   

    const handleFiltrar = () => {
        
        const juegoDesde = historicoOrdenado.find((juego) => juego._id === juegoSeleccionadoDesde);
        const juegoHasta = historicoOrdenado.find((juego) => juego._id === juegoSeleccionadoHasta);
        
        const jugadoresResultado = juegoHasta.jugadores.map((jugador) => ({
            ...jugador,
            puntuacion: jugador.puntuacion, 
        }));

       
        for(let jugadorResultado of jugadoresResultado){
            for(const jugadorDesde of juegoDesde.jugadores){
                if(jugadorDesde._id === jugadorResultado._id){
                    jugadorResultado.puntuacion = jugadorResultado.puntuacion - jugadorDesde.puntuacion;
                }
            }
        }
      
        jugadoresResultado.sort((a, b) => b.puntuacion - a.puntuacion);
        setJugadoresFiltrados(jugadoresResultado);
        setShowJuegosFiltradosModal(true);
    }

   

    return (
        <div>
            <label htmlFor="juegos-select">Desde:</label>
            <select
                id="juegos-select"
                value={juegoSeleccionadoDesde}
                onChange={(e) => setJuegoSeleccionadoDesde(e.target.value)}
            >
                <option value="">Todos los juegos</option>
                {historicoOrdenado.map((historico) => (
                    <option key={historico._id} value={historico._id}>
                        {historico.nombre} - {historico.fecha}
                    </option>
                ))}
            </select>
            <br />
            <label htmlFor="juegos-select">Hasta:</label>
            <select
                id="juegos-select"
                value={juegoSeleccionadoHasta}
                onChange={(e) => setJuegoSeleccionadoHasta(e.target.value)}
            >
                <option value="">Todos los juegos</option>
                {historico.map((historico) => (
                    <option key={historico._id} value={historico._id}>
                        {historico.nombre} - {historico.fecha}
                    </option>
                ))}
            </select>
            <br />
            <button id="cerrar-sesion-btn" onClick={handleFiltrar}>
                Filtrar
            </button>
            {showJuegosFiltradosModal && (
                <div
                    className="modal"
                    style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        maxWidth: '500px',
                        margin: '0 auto',
                        position: 'relative',
                        zIndex: 1000,
                    }}
                >
                    <h2>Ranking Filtrado</h2>
                    <ul>
                        {jugadoresFiltrados.map((jugador) => (
                            <li key={jugador._id}>
                                {jugador.nombre} - {jugador.puntuacion}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowJuegosFiltradosModal(false)}>Cerrar</button>
                </div>
            )}

        </div>
    );


}

export default FiltradoRankingPartidas;