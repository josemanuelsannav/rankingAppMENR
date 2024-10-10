import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ListaJugadores from './ListaJugadores';
import { useNavigate } from 'react-router-dom';


const NuevoJuegoIndividual = () => {
    const navigate = useNavigate();

    const [juegosCategorias, setJuegosCategorias] = useState([]);
    const [jugadores, setJugadores] = useState([]);
    const [visibleJugadores, setVisibleJugadores] = useState([]);


    const fetchJuegosCategorias = async (id) => {
        try {
            const { data } = (await api.get(`/juegosCategoria/todosLosJuegosCategoria/${id}`)).data;
            data.sort((a, b) => a.nombre.localeCompare(b.nombre));
            setJuegosCategorias(data);
        } catch (error) {
            console.log("Error al obtener los juegosCategorias en el nuevo juego individual:  ", error);
        }
    };

    const fetchJugadores = async (id) => {
        try {
            const { data } = (await api.get(`/jugadores/todosLosJugadores/${id}`)).data;
            data.sort((a, b) => a.nombre.localeCompare(b.nombre));
            setJugadores(data);
        } catch (error) {
            console.log("Error al obtener los jugadores en el home page:  ", error);
        }
    };

    useEffect(() => {
        const storedRankingId = localStorage.getItem('rankingId');
        fetchJuegosCategorias(storedRankingId);
        fetchJugadores(storedRankingId);
    }, []);

    const handleGuardarJuego = async (e) => {
        e.preventDefault();
        const selectElement = document.getElementById('miSelectId-juego-normal');
        const nombreJuego = selectElement.options[selectElement.selectedIndex].text;
        const rankingId = localStorage.getItem('rankingId');

        if (visibleJugadores.length === 0) {
            alert("No hay jugadores en el juego. Por favor, añade jugadores antes de guardar el juego.");
            return;
        }

        const jugadoresActualizados = visibleJugadores.map((jugador, index) => ({
            nombre: jugador.nombre,
            puntos: visibleJugadores.length - index - 1,
            id: jugador._id
        }));

        const juegoData = {
            nombre: nombreJuego,
            jugadores: jugadoresActualizados,
            rankingId : rankingId
        };


        try {
            const response = await api.post('/juegosIndividuales/nuevoJuegoIndividual', juegoData);
            if (response.status === 201) {
                alert('Juego guardado con éxito');
                // Recorrer la lista de jugadores actualizados y hacer una solicitud PUT para cada uno
                visibleJugadores.forEach(async (jugador, index) => {
                    try {

                        const putResponse = await api.put(`/jugadores/actualizarPuntuacion/${jugador._id}`, {
                            puntos: visibleJugadores.length - index - 1,
                        });
                        if (putResponse.status === 200) {
                            console.log(`Puntuación actualizada para el jugador ${jugador.nombre}`);
                        }
                    } catch (error) {
                        console.error(`Error al actualizar la puntuación del jugador ${jugador.nombre}:`, error);
                    }
                });
                await new Promise(resolve => setTimeout(resolve, 500)); //medio segundo de espera para que se actualicen bien los datos

                const jugadoresResponse = await api.get(`/jugadores/todosLosJugadores/${rankingId}`);
                const jugadoresHistorico = jugadoresResponse.data.data;
                console.log('Jugadores historico:', jugadoresHistorico); // Añade este log para verificar los datos

                const historicoData = {
                    nombre: nombreJuego,
                    jugadores: jugadoresHistorico,
                    fecha: new Date(),
                    idJuego: response.data._id,
                    rankingId: rankingId
                };
                const responseHistorico = await api.post('/historico/nuevoHistorico', historicoData);
                if (responseHistorico.status === 201) {
                    console.log('Historico guardado con éxito');
                } else {
                    console.log('Error al guardar el historico');
                }
                navigate("/RankingPrincipal"); // Redirige a la misma ruta para forzar una actualización
            }
            


        } catch (error) {
            console.error('Error al guardar el juego:', error);
        }
    };

    return (

        <div className="form-container">
            <form id="game-form" onSubmit={handleGuardarJuego}>
                <h1>Nuevo Juego</h1>
                <label htmlFor="nombre-juego">Nombre del Juego:</label>
                <span className="select-container-juego-normal">
                    <select id="miSelectId-juego-normal" name="miSelect-juego-normal" required>
                        {Array.isArray(juegosCategorias) && juegosCategorias.map((juegoCategoria) => (
                            <option key={juegoCategoria._id} value={juegoCategoria._id}>
                                {juegoCategoria.nombre}
                            </option>
                        ))}
                    </select>
                </span>
                <br />
                <button type="submit"  className="btn btn-success">Guardar Juego</button>

                <div className="container">

                    <div id="jugadores" className="sortable-list">
                        <ListaJugadores jugadores={jugadores} setVisibleJugadores={setVisibleJugadores} />
                    </div>
                </div>
            </form>
        </div>

    )
}

export default NuevoJuegoIndividual