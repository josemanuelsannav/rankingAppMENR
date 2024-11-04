import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import styled from 'styled-components';
import BarChart from '../RankingPrincipalComponents/BarChart';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { set } from 'mongoose';

const CardJuegoEquipo = ({ juego, juegosIndividuales, juegosPorEquipos, jugadores }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});
  const [config, setConfig] = useState({});
  const navigate = useNavigate();
  const [puntosEnJuego, setPuntosEnJuego] = useState(0);

  const [verMasModal, setVerMasModal] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [user, setUser] = useState(null);


  const closeModal = () => {
    setIsModalOpen(false);
  };

  const partidas = [
    ...juegosIndividuales.filter(j => j.nombre === juego.nombre),
    ...juegosPorEquipos.filter(j => j.nombre === juego.nombre)
  ];

  const inicializarListaJugadores = () => {
    let puntosEnJuego = 0;
    let lista_jugadores = [];
    for (const partida of partidas) {
      if (!partida.equipos) {
        for (const jugador of partida.jugadores) {
          const player = lista_jugadores.find(j => j.nombre === jugador.nombre);
          if (!player) {
            let jugador2 = null;
            jugador2 = {
              nombre: jugador.nombre,
              puntos: jugador.puntos
            };
            lista_jugadores.push(jugador2);

          } else {
            player.puntos = parseInt(player.puntos) + parseInt(jugador.puntos);
          }
          puntosEnJuego = parseInt(puntosEnJuego) + parseInt(jugador.puntos)
        }
      } else {
        for (const equipo of partida.equipos) {
          for (const jugador of equipo.integrantes) {
            const player = lista_jugadores.find(j => j.nombre === jugador.nombre);
            if (!player) {
              let jugador2 = null;
              jugador2 = {
                nombre: jugador.nombre,
                puntos: equipo.puntos
              };
              lista_jugadores.push(jugador2);

            } else {
              player.puntos = parseInt(player.puntos) + parseInt(equipo.puntos);
            }
            puntosEnJuego = parseInt(puntosEnJuego) + parseInt(equipo.puntos)
          }
        }
      }
    }
    return { lista_jugadores, puntosEnJuego };
  };

  const handleBorrar = async () => {
    try {
      const isConfirmed = window.confirm("¿Estás seguro de que deseas borrar este juego?");
      if (!isConfirmed) return;

      await api.delete(`/historico/eliminarHistorico/${juego._id}`);
      await api.delete(`/juegosEquipos/eliminarJuegoEquipo/${juego._id}`);
      navigate("/RankingPrincipal"); // Redirige a la misma ruta para forzar una actualización
    } catch (error) {
      console.log("Error al borrar el juego: ", error);
    }

  }

  const handleStats = () => {

    setIsModalOpen(true);
    const { lista_jugadores, puntosEnJuego } = inicializarListaJugadores();
    setPuntosEnJuego(puntosEnJuego);
    lista_jugadores.sort((a, b) => b.puntos - a.puntos);

    const numPartidas = partidas.length;
    const nombres = lista_jugadores.map(j => j.nombre);
    const valores = lista_jugadores.map(j => j.puntos);


    const data = {
      labels: nombres,
      datasets: [
        {
          label: "Puntos obtenidos",
          data: valores,
          borderColor: 'rgba(75, 192, 192, 0.2)',
          backgroundColor: 'rgba(75, 192, 192, 1)',
        }
      ]
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    };

    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart'
          }
        }
      },
    };

    setData(data);
    setOptions(options);
    setConfig(config);
  };
  const handleComentarios = async (idJuego) => {
    const { data } = (await api.get(`/comentarios/todosLosComentarios/${idJuego}`)).data; 
    setComentarios(data);
    console.log(comentarios);
    setVerMasModal(true);
    setUser(localStorage.getItem('profile'));
  }

  const handleAñadirComentario = async () => {
    if (nuevoComentario.trim() === '') return;
    const comentario = {
      comentario: nuevoComentario,
      fecha: new Date().toLocaleString(),
      juegoId: juego._id,
      usuarioId: user,
    };

    try {
      // Guardar el comentario en la base de datos
      await api.post(`/comentarios/nuevoComentario`, comentario);
      // Actualizar la lista de comentarios
      setComentarios([...comentarios, comentario]);
      setNuevoComentario('');
    } catch (error) {
      console.error('Error al guardar el comentario:', error);
    }
  };

  return (
    <>
      <Card key={juego._id} style={{ boxSizing: 'border-box', border: '3px solid orange' }}>
        <CardBody>
          <CardTitle style={{ fontSize: '2rem', fontWeight: 'bold' }}>{juego.nombre}</CardTitle>
          <div>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              {juego.equipos.map((equipo, index) => (
                <li key={equipo._id}>
                  <div>
                    {index + 1}. <span style={{ fontWeight: 'bold' }}>{equipo.nombre}</span>  : {equipo.integrantes.map(jugador => jugador.nombre).join(', ')}
                  </div>
                  <div>
                    <span style={{ color: 'red', fontWeight: 'bold' }}>Puntos:</span> {equipo.puntos}
                  </div>
                </li>
              ))}
              <br />
              {juego.fecha && <li>{new Date(juego.fecha).toLocaleDateString()}</li>}
              <br />
              <button onClick={handleStats} className='btn btn-primary' style={{ marginRight: '10px' }}>Stats</button>
              <button onClick={handleBorrar} className='btn btn-danger' style={{ marginRight: '10px' }}>Borrar</button>
              <button onClick={() => handleComentarios(juego._id)} className='btn btn-warning'>Comentarios</button>

            </ul>
          </div>
        </CardBody>
      </Card>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>×</CloseButton>
            <h2>Estadísticas del Juego</h2>
            <h5>Partidas jugadas: {partidas.length} <br />
              Puntos en juego: {puntosEnJuego}
            </h5>
            <BarChart data={data} config={config} options={options} />
          </ModalContent>
        </ModalOverlay>
      )}
      {verMasModal && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setVerMasModal(false)}>×</CloseButton>
            <div className='titulo-container'>
              <h2>Comentarios del juego</h2>
            </div>
            <div className='comentarios-container'>
              {comentarios.map((comentario, index) => (
                <div
                  key={index}
                  className={`comentario ${comentario.usuarioId ===  user ? 'comentario-derecha' : 'comentario-izquierda'}`}
                >
                  <p>{comentario.usuarioId}</p>
                  <p>{comentario.comentario} </p>
                  <p>{comentario.fecha}</p>
                </div>
              ))}
            </div>
            <div className='añadir-comentario footer'>
              <input
                type='text'
                placeholder='Añade un comentario'
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              />
              <button className='btn btn-primary' onClick={handleAñadirComentario}>
                Añadir
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

// Estilos personalizados usando styled-components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegúrate de que el valor sea suficientemente alto */
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  position: relative;
  z-index: 1001; /* Asegúrate de que el valor sea suficientemente alto */
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

export default CardJuegoEquipo;