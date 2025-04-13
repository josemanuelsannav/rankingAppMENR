import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TopBar from '../components/VerJuegosComponents/TopBar'
import '../styles/Apuesta.css'
import addIcon from '../assets/anadir.png';
import eliminarIcono from '../assets/boton-eliminar.png'; // Ajusta la ruta según sea necesario
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { set } from 'mongoose';
import CardApuesta from '../components/ApuestasPage/CardApuesta';



const ApuestasPage = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [apuestas, setApuestas] = useState([]); // Asumiendo que tienes un estado para las apuestas
  const [jugadores, setJugadores] = useState([]);
  const [juegosCategorias, setJuegosCategorias] = useState([]);
  const [juegosIndividuales, setJuegosIndividuales] = useState([]);
  const [juegosPorEquipos, setJuegosPorEquipos] = useState([]);
  const [duelos, setDuelos] = useState([]);

  const [juegoApuesta, setJuegoApuesta] = useState(null);

  const [ganadores, setGanadores] = useState([]);
  const [perdedores, setPerdedores] = useState([]);

  const [showGanadoresModal, setShowGanadoresModal] = useState(false);
  const [showPerdedoresModal, setShowPerdedoresModal] = useState(false);

  const [showApuestaPersona, setShowApuestaPersona] = useState(false);

  const [jugadorApuesta, setJugadorApuesta] = useState('');
  const [apuestaApuesta, setApuestaApuesta] = useState(1);
  const [resultadoApuesta, setResultadoApuesta] = useState('ganador');

  const [listaApuestas, setListaApuestas] = useState([]);

  const [cuotaGanador, setCuotaGanador] = useState(1);
  const [cuotaPerdedor, setCuotaPerdedor] = useState(1);


  //const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const fetchJuegosCategorias = async (id) => {
    try {
      const { data } = (await api.get(`/juegosCategoria/todosLosJuegosCategoria/${id}`)).data;
      data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setJuegosCategorias(data);
      setJuegoApuesta(data[0].nombre);
    } catch (error) {
      console.log("Error al obtener los juegosCategorias en el nuevo juego individual:  ", error);
    }
  };

  const fetchApuestas = async (id) => {
    try {
      const { data } = (await api.get(`/apuestas/getApuestas/${id}`)).data;
      data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setApuestas(data);
    } catch (error) {
      console.log("Error al obtener los juegos individuales:  ", error);
    }
  };

  const fetchJugadores = async (id) => {
    try {
      const { data } = (await api.get(`/jugadores/todosLosJugadores/${id}`)).data;
      const sortedData = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setJugadores(sortedData);
      setJugadorApuesta(sortedData[0]._id);
    } catch (error) {
      console.log("Error al obtener los jugadores:  ", error);
    }
  };

  const fetchJuegosIndividuales = async (id) => {
    try {
      const { data } = (await api.get(`/juegosIndividuales/todosLosJuegosIndividuales/${id}`)).data;
      setJuegosIndividuales(data);
    } catch (error) {
      console.log("Error al obtener los juegos individuales:  ", error);
    }
  };

  const fetchJuegosPorEquipos = async (id) => {
    try {
      const { data } = (await api.get(`/juegosEquipos/todosLosJuegosEquipo/${id}`)).data;
      setJuegosPorEquipos(data);
    } catch (error) {
      console.log("Error al obtener los juegos por equipos:  ", error);
    }
  };

  const fetchDuelos = async (id) => {
    try {
      const { data } = (await api.get(`/duelos/todosLosDuelos/${id}`)).data;
      setDuelos(data);
    } catch (error) {
      console.log("Error al obtener los juegos duelos:  ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rankingId = localStorage.getItem('rankingId');
        await fetchApuestas(rankingId);
        await fetchJugadores(rankingId);
        await fetchJuegosCategorias(rankingId);
        await fetchJuegosIndividuales(rankingId);
        await fetchJuegosPorEquipos(rankingId);
        await fetchDuelos(rankingId);
        setDataFetched(true);
      } catch (err) {
        //setError(err);
      } finally {
        //setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAñadirGanador = (jugador) => {
    setGanadores([...ganadores, jugador]);
    setJugadores(jugadores.filter(j => j._id !== jugador._id)); //quitar de la lista de jugadores para luego no poder ponerlo en perdedores
    //Se recalcula la cuota de ganador para poder verla en directo
    let ganadoresAux = [...ganadores, jugador];
    let perdedoresAux = [...perdedores];
    const { cuota } = calcularCuota(ganadoresAux, perdedoresAux, juegoApuesta);
    setCuotaGanador(cuota);
  };

  const handleAñadirPerdedor = (jugador) => {
    setPerdedores([...perdedores, jugador]);
    setJugadores(jugadores.filter(j => j._id !== jugador._id));
    //Se recalcula la cuota de perdedor para poder verla en directo
    let perdedoresAux = [...perdedores, jugador];
    let ganadoresAux = [...ganadores];
    const { cuota } = calcularCuota(perdedoresAux, ganadoresAux, juegoApuesta);
    setCuotaPerdedor(cuota);
  };

  const calcularCuota = (participantes, contrincantes, nombreJuego) => {
    let partidasTotales = 0;
    let partidasGanadas = 0;
    let partidas = [...juegosIndividuales.filter(juego => juego.nombre === nombreJuego), ...juegosPorEquipos.filter(juego => juego.nombre === nombreJuego)];
    let listaDuelos = [...duelos.filter(duelo => duelo.nombre === nombreJuego)];
    let cuota = 0;
    if (participantes.length === 0 || contrincantes.length === 0) {

      return { cuota };
    }


    for (const partida of partidas) {
      if (!partida.equipos) {//si el juego es individual
        for (const participante of participantes) {
          for (const contrincante of contrincantes) {
            const participanteEncontrado = partida.jugadores.find(j => j.nombre === participante.nombre);
            const contrincanteEncontrado = partida.jugadores.find(j => j.nombre === contrincante.nombre);
            if (participanteEncontrado && contrincanteEncontrado) {
              partidasTotales++;
              if (participanteEncontrado.puntos > contrincanteEncontrado.puntos) {
                partidasGanadas++;
              }
            }
          }
        }

      } else {
        for (const equipo of partida.equipos) {
          for (const participante of participantes) {
            const equipoParticipanteEncontrado = equipo.integrantes.find(j => j.nombre === participante.nombre);
            if (equipoParticipanteEncontrado) {
              for (const equipo2 of partida.equipos) {
                for (const contrincante of contrincantes) {
                  const equipoContrincanteEncontrado = equipo2.integrantes.find(j => j.nombre === contrincante.nombre);
                  if (equipoContrincanteEncontrado && equipo2._id !== equipo._id) {
                    partidasTotales++;
                    if (equipo.puntos > equipo2.puntos) {
                      partidasGanadas++;
                    }
                  }
                }
              }
            }
          }

        }
      }
    }

    for (const duelo of listaDuelos) {
      for (const participante of participantes) {
        if (participante.nombre === duelo.ganadorNombre) {
          for (const contrincante of contrincantes) {
            if (contrincante.nombre === duelo.perdedorNombre) {
              partidasTotales++;
              partidasGanadas++;
            }
          }
        }
        if (participante.nombre === duelo.perdedorNombre) {
          for (const contrincante of contrincantes) {
            if (contrincante.nombre === duelo.ganadorNombre) {
              partidasTotales++;
            }
          }
        }

      }

    }
    //Calcular cuota
    let cuotaMIN = 1.1;
    let cuotaMAX = 3;

    if (partidasTotales <= 0) {
      cuota = 1.5;
    } else {
      //fomula pendiente de toda la vida , cuota = -1,9 * porcentaje + 3   , y = m*x + n
      let porcentaje = (partidasGanadas / partidasTotales);
      let m = (cuotaMIN - cuotaMAX) / (1 - 0);
      cuota = m * porcentaje + 3;
      cuota = cuota.toFixed(2);
    }

    return { cuota };
  };


  const handleNewApuestaSubmit = () => {
    const newApuesta = {
      jugador: jugadores.find(j => j._id === jugadorApuesta),
      apuesta: apuestaApuesta,
      resultado: resultadoApuesta,
    };
    setListaApuestas([...listaApuestas, newApuesta]);
    setJugadores(jugadores.filter(j => j._id !== newApuesta.jugador._id));
    setShowApuestaPersona(false);
    setJugadorApuesta(jugadores.filter(j => j._id !== newApuesta.jugador._id)[0]._id);
    setApuestaApuesta(1);
    setResultadoApuesta('ganador');
  };

  const handleInvertirJugadores = () => {
    setGanadores(perdedores);
    setPerdedores(ganadores);

    setCuotaGanador(cuotaPerdedor);
    setCuotaPerdedor(cuotaGanador);

  };

  const handleChangeNombreJuego = (e) => {
    setJuegoApuesta(e.target.value);

    const { cuota: cuotaG } = calcularCuota([...ganadores], [...perdedores], e.target.value);
    setCuotaGanador(parseFloat(cuotaG).toFixed(1));

    const { cuota: cuotaP } = calcularCuota([...perdedores], [...ganadores], e.target.value);
    setCuotaPerdedor(parseFloat(cuotaP).toFixed(1));
  };

  const handleCrearApuesta = async () => {
    //Hasta aqui todo bien 
    const rankingId = localStorage.getItem('rankingId');
    if (ganadores.length === 0 || perdedores.length === 0 || listaApuestas.length === 0) {
      alert("Rellena bien el formulario.");
      return;
    }

    const apuestaData = {
      ganador: ganadores,
      perdedor: perdedores,
      rankingId: rankingId,
      juegoNombre: juegoApuesta,
      apuestasPersona: listaApuestas,
      cuotaGanador: cuotaGanador,
      cuotaPerdedor: cuotaPerdedor,
    };
    console.log("Apuesta data : ", apuestaData);


    try {
      const response = await api.post('/apuestas/createApuesta', apuestaData);
      if (response.status === 201) {
        alert('Apuesta guardado con éxito');
        // Recorrer la lista de jugadores actualizados y hacer una solicitud PUT para cada uno
        // Crear un array de promesas para las solicitudes PUT
        const updatePromises = listaApuestas.map((apuestaPersona) => {
          const puntos =
            apuestaPersona.resultado === "ganador"
              ? (parseFloat(apuestaPersona.apuesta) * parseFloat(cuotaGanador)) - parseFloat(apuestaPersona.apuesta)
              : parseFloat(apuestaPersona.apuesta) * -1;

          return api.put(`/jugadores/actualizarPuntuacion/${apuestaPersona.jugador._id}`, { puntos })
            .then((putResponse) => {
              if (putResponse.status === 200) {
                console.log(`Puntuación actualizada para el jugador ${apuestaPersona.jugador.nombre}`);
              }
            })
            .catch((error) => {
              console.error(`Error al actualizar la puntuación del jugador ${apuestaPersona.jugador.nombre}:`, error);
            });
        });

        // Esperar a que todas las solicitudes PUT se completen
        await Promise.all(updatePromises);
        await new Promise(resolve => setTimeout(resolve, 1000)); //un segundo de espera para que se actualicen bien los datos

        const jugadoresResponse = await api.get(`/jugadores/todosLosJugadores/${rankingId}`);
        const jugadoresHistorico = jugadoresResponse.data.data;
        console.log('Jugadores historico:', jugadoresHistorico); // Añade este log para verificar los datos

        const historicoData = {
          nombre: "Apuesta: "+ juegoApuesta,
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

  const handleEliminarGanador = (ganador) => {

    //Se quita el ganador de la lista de ganadores y se añade a la lista de jugadores
    setGanadores(ganadores.filter(g => g._id !== ganador._id));
    setJugadores([...jugadores, ganador].sort((a, b) => a.nombre.localeCompare(b.nombre))); //se ordena la lista de jugadores por nombre

  }

  const handleEliminarPerdedor = (perdedor) => {
    //Se quita el perdedor de la lista de perdedores y se añade a la lista de jugadores
    setPerdedores(perdedores.filter(p => p._id !== perdedor._id));
    setJugadores([...jugadores, perdedor].sort((a, b) => a.nombre.localeCompare(b.nombre))); //se ordena la lista de jugadores por nombre
  }

  const handleEliminarApuestaPersona = (apuesta) => {
    //Se quita la apuesta de la lista de apuestas y se añade a la lista de jugadores
    setListaApuestas(listaApuestas.filter(a => a.jugador._id !== apuesta.jugador._id));
    setJugadores([...jugadores, apuesta.jugador].sort((a, b) => a.nombre.localeCompare(b.nombre))); //se ordena la lista de jugadores por nombre

  }

  return (
    <div>
      <TopBar />
      <div>
        <button onClick={handleOpenModal}>Crear apuesta</button>
      </div>
      <br />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginLeft: '16px', marginRight: '16px' }}>
        {apuestas.map((apuesta, index) => (
          <div key={apuesta._id} >

            <CardApuesta apuesta={apuesta} />

          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Apuesta</h2>
            <form style={{ width: '100%' }}>
              <label htmlFor="nombre-juego">Nombre del Juego:</label>
              <span className="select-container-juego-normal">
                <select id="miSelectId-juego-normal" name="miSelect-juego-normal" required onChange={(e) => handleChangeNombreJuego(e)}>
                  {Array.isArray(juegosCategorias) && juegosCategorias.map((juegoCategoria) => (
                    <option key={juegoCategoria._id} value={juegoCategoria.nombre}>
                      {juegoCategoria.nombre}
                    </option>
                  ))}
                </select>
              </span>
              <br />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3>Ganadores - Cuota : {cuotaGanador}</h3>
                  <ul>
                    {ganadores.map(ganador => (
                      <li key={ganador._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{ganador.nombre}</span>
                        <button className="btn-icon" type="button" onClick={() => handleEliminarGanador(ganador)} style={{ marginRight: '50px' }}>
                          <img src={eliminarIcono} alt="Eliminar" style={{ width: '20px', height: '20px' }} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <br />
                  <Button type="button" onClick={() => setShowGanadoresModal(true)}>
                    Añadir Ganador
                  </Button>
                </div>
                <div>
                  <h3>Perdedores - Cuota : {cuotaPerdedor} </h3>
                  <ul>
                    {perdedores.map(perdedor => (
                      <li key={perdedor._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{perdedor.nombre}</span>
                        <button className="btn-icon" type="button" onClick={() => handleEliminarPerdedor(perdedor)} style={{ marginRight: '50px' }}>
                          <img src={eliminarIcono} alt="Eliminar" style={{ width: '20px', height: '20px' }} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <br />
                  <Button type="button" onClick={() => setShowPerdedoresModal(true)} >
                    Añadir Perdedor
                  </Button>

                </div>
              </div>
              <br />
              <Button type="button" onClick={() => handleInvertirJugadores(true)} >
                Invertir Jugadores
              </Button>              <br />
              <h3>Apuestas por persona</h3>
              <ul>
                {listaApuestas.map((apuesta, index) => (
                  <li key={index}>
                    {apuesta.jugador.nombre} - {apuesta.apuesta} - {apuesta.resultado}
                    <button className="btn-icon" type="button" onClick={() => handleEliminarApuestaPersona(apuesta)} style={{ marginRight: '50px' }}>
                      <img src={eliminarIcono} alt="Eliminar" style={{ width: '20px', height: '20px' }} />
                    </button>
                  </li>
                ))}
              </ul>
              <Button type="button" onClick={() => setShowApuestaPersona(true)} >
                Añadir apuesta
              </Button>
              <br />
              <Button type="button" onClick={() => handleCrearApuesta()}>
                Crear </Button>
            </form>
          </div>
        </div>
      )}

      {showGanadoresModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Seleccionar Ganadores</h2>
            <ul>
              {jugadores.map(jugador => (
                <li key={jugador._id}>
                  {jugador.nombre}
                  <button className="btn-icon" type="button" onClick={() => handleAñadirGanador(jugador)}>
                    <img src={addIcon} alt="Añadir" style={{ width: '20px', height: '20px' }} />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setShowGanadoresModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
      {showPerdedoresModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Seleccionar Perdedores</h2>
            <ul>
              {jugadores.map(jugador => (
                <li key={jugador._id}>
                  {jugador.nombre}
                  <button className="btn-icon" type="button" onClick={() => handleAñadirPerdedor(jugador)}>
                    <img src={addIcon} alt="Añadir" style={{ width: '20px', height: '20px' }} />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setShowPerdedoresModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
      {showApuestaPersona && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nueva apuesta jugador</h2>

            <form style={{ width: '100%' }}>
              <label htmlFor="jugador" style={{ width: '100%' }}>Apostador:</label>
              <select
                id="jugador"
                name="jugador"
                value={jugadorApuesta}
                onChange={(e) => setJugadorApuesta(e.target.value)}
                required
                style={{ width: '100%' }}>
                {Array.isArray(jugadores) && jugadores.map((jugador) => (
                  <option key={jugador._id} value={jugador._id}>
                    {jugador.nombre}
                  </option>
                ))}
              </select>
              <br />
              <label htmlFor="apuesta" style={{ width: '100%' }}>Apuesta : max 10 pts / min 1 pt</label>
              <input
                type="number"
                id="apuesta"
                value={apuestaApuesta}
                onChange={(e) => setApuestaApuesta(e.target.value)}
                required
                style={{ width: '100%' }}
              />
              <br />
              <label htmlFor="resultado" style={{ width: '100%' }}>Resultado:</label>
              <select
                id="resultado"
                name="resultado"
                value={resultadoApuesta}
                onChange={(e) => setResultadoApuesta(e.target.value)}
                required
                style={{ width: '100%' }}
              >
                <option value="ganador">Ganador</option>
                <option value="perdedor">Perdedor</option>
              </select>
              <br />
            </form>
            <br />
            <Button type="button" onClick={() => handleNewApuestaSubmit()}>Añadir</Button>
            <button type="button" onClick={() => setShowApuestaPersona(false)}>Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApuestasPage;