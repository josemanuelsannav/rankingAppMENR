import React, { useState, useEffect } from 'react';
import eliminarIcono from '../../assets/boton-eliminar.png'; // Ajusta la ruta según sea necesario
import flechaArribaIcono from '../../assets/flecha-hacia-arriba.png'; // Ajusta la ruta según sea necesario
import flechaAbajoIcono from '../../assets/flecha-hacia-abajo.png'; // Ajusta la ruta según sea necesario
import addIcono from '../../assets/anadir.png'; // Ajusta la ruta según sea necesario
import Button from '@mui/material/Button'; // Importación correcta de Button desde MUI

const ListaJugadores = ({ jugadores, setVisibleJugadores }) => {

  const [visibleJugadores, setLocalVisibleJugadores] = useState([]);
  const [restoJugadores, setRestoJugadores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalInvitado, setShowModalInvitado] = useState(false);
  const [nombreInvitado, setNombreInvitado] = useState(''); // Estado para el nombre del invitado


  useEffect(() => {
    const nombresFiltrados = ["Andrés", "Jose", "Juanma", "Sergio", "Alberto", "Juanjo", "Nico", "Javi"];
    const jugadoresFiltrados = jugadores.filter(jugador => nombresFiltrados.includes(jugador.nombre));
    const jugadoresNoFiltrados = jugadores.filter(jugador => !nombresFiltrados.includes(jugador.nombre));
    jugadoresFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    jugadoresNoFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    setLocalVisibleJugadores(jugadoresFiltrados);
    setRestoJugadores(jugadoresNoFiltrados);
  }, [jugadores]);

  useEffect(() => {
    setVisibleJugadores(visibleJugadores);
  }, [visibleJugadores, setVisibleJugadores]);

  const addJugador = (jugador) => {
    setLocalVisibleJugadores([...visibleJugadores, jugador].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    setRestoJugadores(restoJugadores.filter(j => j._id !== jugador._id));
  };

  const removeJugador = (jugador) => {
    setLocalVisibleJugadores(visibleJugadores.filter(j => j._id !== jugador._id));
    setRestoJugadores([...restoJugadores, jugador]);
  };

  const moveJugadorUp = (index) => {
    if (index === 0) return;
    const newVisibleJugadores = [...visibleJugadores];
    [newVisibleJugadores[index - 1], newVisibleJugadores[index]] = [newVisibleJugadores[index], newVisibleJugadores[index - 1]];
    setLocalVisibleJugadores(newVisibleJugadores);
  };

  const moveJugadorDown = (index) => {
    if (index === visibleJugadores.length - 1) return;
    const newVisibleJugadores = [...visibleJugadores];
    [newVisibleJugadores[index + 1], newVisibleJugadores[index]] = [newVisibleJugadores[index], newVisibleJugadores[index + 1]];
    setLocalVisibleJugadores(newVisibleJugadores);
  };

  const handleAddInvitado = () => {
    // Lógica para añadir el invitado
    console.log('Nombre del invitado:', nombreInvitado);
    const invitado = {
      nombre: "Invitado " + nombreInvitado,
      _id: Math.random().toString(36).substr(2, 9)

    };
    setLocalVisibleJugadores(visibleJugadores.concat(invitado));
    setShowModalInvitado(false);
    setNombreInvitado('');
  };

  return (
    <div className="jugadores-container">
      <br />
      <h2>Participantes </h2>
      <Button onClick={() => setShowModal(true)} variant="contained" color="primary">Añadir jugador</Button>
      <br />
      <Button onClick={() => setShowModalInvitado(true)} variant="contained" color="secondary">Añadir invitado</Button>
      <br />
      <br />
      <ul>
        {visibleJugadores.map((jugador, index) => (
          <li key={jugador._id} >
            {index + 1}. {jugador.nombre}
            <div className="button-container">
              <button onClick={() => removeJugador(jugador)} className="btn-icon">
                <img src={eliminarIcono} alt="Eliminar" style={{ width: '20px', height: '20px' }} />
              </button>
              <button onClick={() => moveJugadorUp(index)} type="button" className="btn-icon">
                <img src={flechaArribaIcono} alt="Subir" style={{ width: '20px', height: '20px' }} />
              </button>
              <button onClick={() => moveJugadorDown(index)} type="button" className="btn-icon">
                <img src={flechaAbajoIcono} alt="Bajar" style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Resto de los Jugadores</h2>
            <ul>
              {restoJugadores.map(jugador => (
                <li key={jugador._id}>
                  {jugador.nombre}
                  <button onClick={() => addJugador(jugador)} className="btn-icon">
                    <img src={addIcono} alt="Añadir" style={{ width: '20px', height: '20px' }} />
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
      {showModalInvitado && (
        <div className="modal">
          <div className="modal-content">
            <h2>Añadir Invitado</h2>
            <input
              type="text"
              value={nombreInvitado}
              onChange={(e) => setNombreInvitado(e.target.value)}
              placeholder="Nombre del invitado"
            />
            <br />
            <button onClick={handleAddInvitado}>Añadir</button>
            <br />
            <button onClick={() => setShowModalInvitado(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaJugadores;