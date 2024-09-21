import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Duelo = () => {
    const [jugadores, setJugadores] = useState([]);
    const [juegosCategorias, setJuegosCategorias] = useState([]);

    const fetchJuegosCategorias = async () => {
        try {
            const { data } = (await api.get("/juegosCategoria/todosLosJuegosCategoria")).data;
            data.sort((a, b) => a.nombre.localeCompare(b.nombre));
            setJuegosCategorias(data);
        } catch (error) {
            console.log("Error al obtener los juegosCategorias en el nuevo juego individual:  ", error);
        }
    };

    const fetchJugadores = async () => {
        try {
            const { data } = (await api.get("/jugadores/todosLosJugadores")).data;
            data.sort((a, b) => a.nombre.localeCompare(b.nombre));
            setJugadores(data);
        } catch (error) {
            console.log("Error al obtener los jugadores en el home page:  ", error);
        }
    };

    useEffect(() => {
        fetchJuegosCategorias();
        fetchJugadores();
    }, []);

    const handleGuardarDuelo = async (e) => {
        e.preventDefault();
        const selectElement = document.getElementById('miSelectId-juego-normal-duelo');
        const nombreJuego = selectElement.options[selectElement.selectedIndex].text;
        const selectElementGanador = document.getElementById('miSelectId-jugadores-ganador');
        const ganadorId = selectElementGanador.options[selectElementGanador.selectedIndex].value;
        const ganadorNombre = jugadores.find(jugador => jugador._id === ganadorId).nombre;
        const selectElementPerdedor = document.getElementById('miSelectId-jugadores-perdedor');
        const perdedorId = selectElementPerdedor.options[selectElementPerdedor.selectedIndex].value;
        const perdedorNombre = jugadores.find(jugador => jugador._id === perdedorId).nombre;
        const apuesta = Number(document.getElementById('puntos').value);
        const navigate = useNavigate();

        if (ganadorNombre === perdedorNombre) {
            alert("El ganador y el perdedor no pueden ser la misma persona.");
            return;
        }
        if(apuesta <= 0 || apuesta === null || apuesta === undefined) {
            alert("La apuesta debe ser un número positivo.");
            return;
        }


        const dueloData = {
            nombre: nombreJuego,
            ganador: ganadorId,
            ganadorNombre: ganadorNombre,
            perdedor: perdedorId,
            perdedorNombre: perdedorNombre,
            apuesta: apuesta,
        };


        try {
            const response = await api.post('/duelos/nuevoDuelo', dueloData);
            if (response.status === 201) {
                alert('Duelo guardado con éxito');
                try {
                    const putResponseGanador = await api.put(`/jugadores/actualizarPuntuacion/${ganadorId}`, {
                        puntos: apuesta,
                    });
                    const putResponsePerdedor = await api.put(`/jugadores/actualizarPuntuacion/${perdedorId}`, {
                        puntos: apuesta * -1,
                    });
                    if (putResponseGanador.status === 200) {
                        console.log(`Puntuación actualizada para el ganador `);
                    }
                    if (putResponsePerdedor.status === 200) {
                        console.log(`Puntuación actualizada para el perdedor `);
                    }
                } catch (error) {
                    console.error(`Error al actualizar la puntuación de los jugadores:`, error);
                }
                await new Promise(resolve => setTimeout(resolve, 500)); //medio segundo de espera para que se actualicen bien los datos
                const jugadoresResponse = await api.get("/jugadores/todosLosJugadores");
                const jugadoresHistorico = jugadoresResponse.data.data;
                console.log('Jugadores historico:', jugadoresHistorico); // Añade este log para verificar los datos

                const historicoData = {
                    nombre: nombreJuego,
                    jugadores: jugadoresHistorico,
                    fecha: new Date(),
                    idJuego: response.data._id
                };
                const responseHistorico = await api.post('/historico/nuevoHistorico', historicoData);
                if (responseHistorico.status === 201) {
                    console.log('Historico guardado con éxito');
                } else {
                    console.log('Error al guardar el historico');
                }
                navigate(0);
            }
        } catch (error) {
            console.error('Error al guardar el duelo:', error);
        }
    };

    return (
        <div className="form-container">
            <form id="game-form" onSubmit={handleGuardarDuelo}>
                <h1>Nuevo Duelo</h1>

                <span className="select-container-juego-normal">
                    <label htmlFor="nombre-juego">Nombre del Duelo:</label>
                    <select id="miSelectId-juego-normal-duelo" name="miSelect-juego-normal-duelo" required>
                        {Array.isArray(juegosCategorias) && juegosCategorias.map((juegoCategoria) => (
                            <option key={juegoCategoria._id} value={juegoCategoria._id}>
                                {juegoCategoria.nombre}
                            </option>
                        ))}
                    </select>
                </span>
                <br />
                <span className="select-container-juego-normal">
                    <label htmlFor="nombre-juego">Ganador:</label>
                    <select id="miSelectId-jugadores-ganador" name="miSelectId-jugadores-ganador" required>
                        {Array.isArray(jugadores) && jugadores.map((jugador) => (
                            <option key={jugador._id} value={jugador._id}>
                                {jugador.nombre}
                            </option>
                        ))}
                    </select>
                </span>
                <br />
                <span className="select-container-juego-normal">
                    <label htmlFor="nombre-juego">Perdedor:</label>
                    <select id="miSelectId-jugadores-perdedor" name="miSelectId-jugadores-perdedor" required>
                        {Array.isArray(jugadores) && jugadores.map((jugador) => (
                            <option key={jugador._id} value={jugador._id}>
                                {jugador.nombre}
                            </option>
                        ))}
                    </select>
                </span>
                <br />
                <span className="input-container-puntos">
                    <label htmlFor="puntos">Apuesta:</label>
                    <input type="number" id="puntos" name="puntos" required />
                </span>
                <br />
                <button type="submit" className='btn btn-success'>Guardar Duelo</button>

            </form>
        </div>
    )
}

export default Duelo