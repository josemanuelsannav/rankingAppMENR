import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import addIcon from '../../assets/anadir.png';
import botonEliminar from '../../assets/boton-eliminar.png';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Card, CardHeader, CardBody, CardTitle, CardText, Button as ReactstrapButton } from 'reactstrap'; // Importa los componentes correctos de reactstrap

const NuevoJuegoEquipo = () => {
    const [juegosCategorias, setJuegosCategorias] = useState([]);
    const [jugadores, setJugadores] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [showEquipoForm, setShowEquipoForm] = useState(false);
    const [equipoNombre, setEquipoNombre] = useState('');
    const [equipoPuntuacion, setEquipoPuntuacion] = useState(0);
    const [equipoIntegrantes, setEquipoIntegrantes] = useState([]);
    const [showIntegrantesModal, setShowIntegrantesModal] = useState(false);
    const [currentEquipoIndex, setCurrentEquipoIndex] = useState(null);


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

    const handleGuardarJuego = async (e) => {
        e.preventDefault();
        const selectElement = document.getElementById('miSelectId-juego-normal-2');
        const nombreJuego = selectElement.options[selectElement.selectedIndex].text;

        const juegoData = {
            nombre: nombreJuego,
            equipos: equipos
        };

        try {
            const response = await api.post('/juegosEquipos/nuevoJuegoEquipo', juegoData);
            if (response.status === 201) {
                alert('Juego guardado con éxito');
                // Recorrer cada equipo y dentro de cada equipo recorrer los integrantes para actualizar su puntuación
                equipos.forEach(async (equipo, equipoIndex) => {
                    equipo.integrantes.forEach(async (integrante, integranteIndex) => {
                        try {
                            const putResponse = await api.put(`/jugadores/actualizarPuntuacion/${integrante._id}`, {
                                puntos: equipo.puntos,
                            });
                            if (putResponse.status === 200) {
                                console.log(`Puntuación actualizada para el jugador ${integrante.nombre}`);
                            }
                        } catch (error) {
                            console.error(`Error al actualizar la puntuación del jugador ${integrante.nombre}:`, error);
                        }
                    });
                });
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
                window.location.reload();
            }
        } catch (error) {
            console.error('Error al guardar el juego:', error);
        }
    };

    const handleAñadirEquipo = () => {

        setShowEquipoForm(true);
        setCurrentEquipoIndex(null);
        setEquipoNombre('');
        setEquipoPuntuacion(0);
        setEquipoIntegrantes([]);
        setShowEquipoForm(true);
    };

    const handleAñadirIntegrante = (jugador) => {
        setEquipoIntegrantes([...equipoIntegrantes, jugador]);
        setJugadores(jugadores.filter(j => j._id !== jugador._id));
    };

    const handleQuitarIntegrante = (jugador) => {
        setEquipoIntegrantes(equipoIntegrantes.filter(j => j._id !== jugador._id));
        setJugadores([...jugadores, jugador]);
    };

    const handleBorrarEquipo = (index) => {

        const equipo = equipos[index];
        console.log("Equipo a borrar: ", equipo);
        console.log("Integrantes del equipo a borrar: ", equipoIntegrantes);
        setEquipos(equipos.filter((_, i) => i !== index));
        setEquipoIntegrantes([]);
        setShowEquipoForm(false);
        if (equipoIntegrantes.length > 0) {
            setJugadores([...jugadores, ...equipoIntegrantes]);
        } else {
            setJugadores([...jugadores, ...equipo.integrantes]);
        }

        setJugadores([...jugadores, ...equipo.integrantes]);
    };

    const handleGuardarEquipo = () => {
        if (!equipoNombre.trim()) {
            alert("El nombre del equipo no puede estar vacío o contener solo espacios en blanco.");
            return;
        }

        // Verificar si el equipo tiene integrantes
        if (equipoIntegrantes.length === 0) {
            alert("El equipo debe tener al menos un integrante.");
            return;
        }

        const nuevoEquipo = {
            nombre: equipoNombre,
            puntos: equipoPuntuacion,
            integrantes: equipoIntegrantes
        };

        if (currentEquipoIndex !== null) {
            const updatedEquipos = [...equipos];
            updatedEquipos[currentEquipoIndex] = nuevoEquipo;
            setEquipos(updatedEquipos);
        } else {
            setEquipos([...equipos, nuevoEquipo]);
        }

        setEquipoNombre('');
        setEquipoPuntuacion(0);
        setEquipoIntegrantes([]);
        setShowEquipoForm(false);
    };


    const handleClose = () => {
        setShowEquipoForm(false);
    };

    const handleEditarEquipo = (index) => {
        const equipo = equipos[index];
        setEquipoNombre(equipo.nombre);
        setEquipoPuntuacion(equipo.puntuacion);
        setEquipoIntegrantes(equipo.integrantes);
        setShowEquipoForm(true);
        setCurrentEquipoIndex(index);
        setEquipos(equipos.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="container-content">

                <div className="form-container">

                    <form id="game-form" onSubmit={handleGuardarJuego}>
                        <h1>Por equipos</h1>

                        <label htmlFor="nombre-juego">Nombre del Juego:</label>
                        <span className="select-container-juego-normal-2">
                            <select id="miSelectId-juego-normal-2" name="miSelect-juego-normal-2" required>
                                {Array.isArray(juegosCategorias) && juegosCategorias.map((juegoCategoria) => (
                                    <option key={juegoCategoria._id} value={juegoCategoria._id}>
                                        {juegoCategoria.nombre}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <br />
                        <button type="submit"  className="btn btn-success">Guardar Juego</button>
                        <br />
                        <button type="button" onClick={handleAñadirEquipo}  className="btn btn-primary">Añadir equipo</button>
                        <br />
                        <div className="equipos-list">
                            <h2>Equipos</h2>
                            {equipos.map((equipo, index) => (

                                <Card key={index}>
                                    <CardHeader as="h5">{equipo.nombre}</CardHeader>
                                    <CardBody>
                                        <CardTitle>Puntuación: {equipo.puntos}</CardTitle>
                                        <div>
                                            <ul>
                                                {equipo.integrantes.map(jugador => (
                                                    <li key={jugador._id}>{jugador.nombre}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <ReactstrapButton onClick={() => handleEditarEquipo(index)} color="warning" >Editar</ReactstrapButton>
                                        <ReactstrapButton onClick={() => handleBorrarEquipo(index)} color="danger" >Borrar</ReactstrapButton>

                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </form>
                </div>
                <Dialog open={showEquipoForm} onClose={handleClose}>
                    <DialogTitle>Añadir Equipo</DialogTitle>
                    <DialogContent>
                        {/* Aquí va el contenido del formulario showEquipoForm */}
                        <form>
                            <div>
                                <label>Nombre del Equipo:</label>
                                <input
                                    type="text"
                                    id="nombre-equipo"
                                    value={equipoNombre}
                                    onChange={(e) => setEquipoNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label >Puntuación:</label>
                                <input
                                    type="number"
                                    id="puntuacion-equipo"
                                    value={equipoPuntuacion}
                                    onChange={(e) => setEquipoPuntuacion(Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div>
                                <label>Integrantes:</label>
                                <ul>
                                    {equipoIntegrantes.map(jugador => (
                                        <li key={jugador._id}>
                                            {jugador.nombre}
                                            <button className='btn-icon' type="button" onClick={() => handleQuitarIntegrante(jugador)}>
                                                <img src={botonEliminar} alt="Quitar" style={{ width: '20px', height: '20px' }} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleGuardarEquipo} color="primary">
                            Guardar
                        </Button>
                        <Button onClick={() => setShowIntegrantesModal(true)}>
                            Añadir integrante
                        </Button>

                    </DialogActions>
                    {showIntegrantesModal && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Seleccionar Jugadores</h2>
                                <ul>
                                    {jugadores.map(jugador => (
                                        <li key={jugador._id}>
                                            {jugador.nombre}
                                            <button className="btn-icon" type="button" onClick={() => handleAñadirIntegrante(jugador)}>
                                                <img src={addIcon} alt="Añadir" style={{ width: '20px', height: '20px' }} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button type="button" onClick={() => setShowIntegrantesModal(false)}>Cerrar</button>
                            </div>
                        </div>
                    )}
                </Dialog>


            </div>
        </div>
    );
};

export default NuevoJuegoEquipo;