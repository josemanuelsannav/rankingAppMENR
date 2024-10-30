import '../styles/RankingPrincipal.css'
import React, { useState, useEffect } from 'react';
import api from '../services/api';
////////////////////////////////////////
//Importamos los componentes
////////////////////////////////////////
import TopBar from '../components/RankingPrincipalComponents/TopBar'
import Podio from '../components/RankingPrincipalComponents/Podio'
import ListadoJugadoresRankingPrincipal from '../components/RankingPrincipalComponents/ListadoJugadoresRankingPrincipal'
////////////////////////////////////////


const RankingPrincipal = () => {

  const [jugadores, setJugadores] = useState([]);
  const [juegosIndividuales, setJuegosIndividuales] = useState([]);
  const [juegosEquipos, setJuegosPorEquipos] = useState([]);
  const [duelos, setDuelos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [rankingId, setRankingId] = useState(null);

  const calcularWR = (jugador) => {
    let partidasGanadas = 0;
    let partidasJugadas = 0;
    // Recorrer juegos individuales
    for (let i = 0; i < juegosIndividuales.length; i++) {
      const jugadores = juegosIndividuales[i].jugadores; //jugadores de un juego
      if (jugadores.some(jugadorAux => jugadorAux.id.toString() === jugador._id.toString())) {
        if (jugadores[0].id === jugador._id) {
          partidasGanadas++;
        }
        partidasJugadas++;
      }
    }

    for (let i = 0; i < juegosEquipos.length; i++) {
      const equipos = juegosEquipos[i].equipos; //equipos de un juego
      equipos.sort((a, b) => b.puntos - a.puntos);
      for (let j = 0; j < equipos.length; j++) {
        const equipo = equipos[j]; //equipo de la lista de equipos    
        // if(equipo.integrantes.includes(jugador._id) && j === 0) {
        if (equipo.integrantes.some(jugadorAux => jugadorAux._id.toString() === jugador._id.toString()) && j === 0) {
          partidasJugadas++;
          partidasGanadas++;
        } else if (equipo.integrantes.includes(jugador._id)) {
          partidasJugadas++;
        }
      }
    }
    if (partidasJugadas === 0) {
      return 0; // Evitar división por cero
    }
    const winrate = (partidasGanadas / partidasJugadas) * 100;
    return winrate.toFixed(2); // Devolver el winrate con dos decimales
  };

  const fetchJugadores = async (id) => {
    try {
      const { data } = (await api.get(`/jugadores/todosLosJugadores/${id}`)).data;
      const sortedJugadores = data.sort((a, b) => {
        if (b.puntuacion !== a.puntuacion) {
          return b.puntuacion - a.puntuacion;
        } else {
          return calcularWR(b) - calcularWR(a);
        }
      });

      setJugadores(sortedJugadores);
    } catch (error) {
      console.log("Error al obtener los jugadores en el home page:  ", error);
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

  const fetchHistorico = async (id) => {
    try {
      const { data } = (await api.get(`/historico/todosLosHistoricos/${id}`)).data;
      setHistorico(data);
    } catch (error) {
      console.log("Error al obtener los historicos:  ", error);
    }
  };

 

  useEffect(() => {
    const storedRankingId = localStorage.getItem('rankingId');
    setRankingId(storedRankingId);
    fetchJugadores(storedRankingId);
    fetchJuegosIndividuales(storedRankingId);
    fetchJuegosPorEquipos(storedRankingId);
    fetchDuelos(storedRankingId);
    fetchHistorico(storedRankingId);
  }, []);

  
  return (
    <div>

      <TopBar jugadores={jugadores} historico={historico} />
      <br /><br /><br /><br /><br /><br /><br /><br />

      <Podio jugadoresPodio={jugadores.slice(0, 3)} juegosEquipos={juegosEquipos} juegosIndividuales={juegosIndividuales} duelos={duelos} numJugadores={jugadores.length} />
      <ListadoJugadoresRankingPrincipal jugadores={jugadores.slice(3)} juegosEquipos={juegosEquipos} juegosIndividuales={juegosIndividuales} duelos={duelos} />
      <br />
      <br />
    </div>

  )
}

export default RankingPrincipal