import api from "../services/api";
import React, { useState, useEffect } from 'react';
import "../styles/HomePage/HomePage.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

////////////////////////////////////////
//Importamos los componentes
////////////////////////////////////////
import PlayerForm from '../components/HomePageComponents/PlayerForm';
import ListadoJugadoresHomePage from "../components/HomePageComponents/ListadoJugadoresHomePage";
////////////////////////////////////////

const HomePage = ({rankingId}) => {
  const [jugadores, setJugadores] = useState([]);
  const fetchJugadores = async () => {
    try {
      
      const { data } = (await api.get(`/jugadores/todosLosJugadores/${rankingId}`)).data;
      setJugadores(data);
    } catch (error) {
      console.log("Error al obtener los jugadores en el home page:  ", error);
    }
  };

  useEffect(() => {
    if (rankingId) {
      localStorage.setItem('rankingId', rankingId);
    }
    fetchJugadores();
  }, []);

  return (
    <div>
      <div className="title-container mb-3 mt-3">
        <h1>Bienvenido jugador</h1>
      </div>
      <PlayerForm rankingId={rankingId}/>
      
      <ListadoJugadoresHomePage jugadores={jugadores} />
    </div>
  );
};

export default HomePage