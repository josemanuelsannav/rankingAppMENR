import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TopBar from '../components/VerJuegosComponents/TopBar';
import CardJuegoEquipo from '../components/VerJuegosComponents/CardJuegoEquipo';
import CardJuegoIndividual from '../components/VerJuegosComponents/CardJuegoIndividual';
import { set } from 'mongoose';
const VerJuegosPage = () => {
  const [juegosIndividuales, setJuegosIndividuales] = useState([]);
  const [juegosPorEquipos, setJuegosPorEquipos] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [juegosCategorias, setJuegosCategorias] = useState([]);
  const [selectedJuegoCategoria, setSelectedJuegoCategoria] = useState('');
  const [juegosSinAlterar, setJuegosSinAlterar] = useState([]);
  const [selectedJugador, setSelectedJugador] = useState('');

  const fetchJuegosIndividuales = async () => {
    try {
      const { data } = (await api.get("/juegosIndividuales/todosLosJuegosIndividuales")).data;
      setJuegosIndividuales(data);
    } catch (error) {
      console.log("Error al obtener los juegos individuales:  ", error);
    }
  };

  const fetchJuegosPorEquipos = async () => {
    try {
      const { data } = (await api.get("/juegosEquipos/todosLosJuegosEquipo")).data;
      setJuegosPorEquipos(data);

    } catch (error) {
      console.log("Error al obtener los juegos por equipos:  ", error);
    }
  };

  const fetchJugadores = async () => {
    try {
      const { data } = (await api.get("/jugadores/todosLosJugadores")).data;
      setJugadores(data);
    } catch (error) {
      console.log("Error al obtener los jugadores:  ", error);
    }
  };

  const fetchHistorico = async () => {
    try {
      const { data } = (await api.get("/historico/todosLosHistoricos")).data;
      setHistorico(data);
    } catch (error) {
      console.log("Error al obtener el historico:  ", error);
    }
  };

  const fetchJuegosCategorias = async () => {
    try {
      const { data } = (await api.get("/juegosCategoria/todosLosJuegosCategoria")).data;
      data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setJuegosCategorias(data);
    } catch (error) {
      console.log("Error al obtener los juegosCategorias en el nuevo juego individual:  ", error);
    }
  };

  const combineJuegos = () => {
    try {
      const todosLosJuegos = [...juegosIndividuales, ...juegosPorEquipos].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setJuegos(todosLosJuegos);
      setJuegosSinAlterar(todosLosJuegos);
    } catch (error) {
      console.log("Error al combinar los juegos: ", error);
    }
  };

  const invertirJuegos = () => {
    setJuegos([...juegos].reverse());
  };

  const handleBuscar = () => {
    const selectElement = document.getElementById('miSelectId-juego-normal');
    const selectedValue = selectElement.value;
    console.log("Categoría seleccionada:", selectedValue);
    setJuegos(juegosSinAlterar.filter(juego => juego.nombre === selectedValue));
  };

  const handleBuscarJugador = () => {
    const selectElement = document.getElementById('miSelectId-juego-normal-jugador');
    const selectedValue = selectElement.value;
    console.log("Categoría seleccionada:", selectedValue);
    const juegosFiltrados = [];
    for(const juego of juegosSinAlterar){
      if(juego.equipos){
        for(const equipo of juego.equipos){
          for(const jugador of equipo.integrantes){
            if(jugador.nombre === selectedValue){
              juegosFiltrados.push(juego);
            }
          }
        }
      }else{
        for(const jugador of juego.jugadores){
          if(jugador.nombre === selectedValue){
            juegosFiltrados.push(juego);
          }
        }
      }
    }
    setJuegos(juegosFiltrados);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchJuegosIndividuales();
        await fetchJuegosPorEquipos();
        await fetchJugadores();
        await fetchHistorico();
        await fetchJuegosCategorias();
        setDataFetched(true);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (dataFetched && (juegosIndividuales.length > 0 || juegosPorEquipos.length > 0)) {
      combineJuegos();
    }
  }, [dataFetched, juegosIndividuales, juegosPorEquipos, jugadores]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <TopBar />
      <br />
      <button onClick={invertirJuegos} style={{ marginRight: '10px', marginLeft: '10px' }}>Invertir Lista de Juegos</button>
      <select
        style={{ marginRight: '10px', marginLeft: '10px' }}
        id="miSelectId-juego-normal"
        name="miSelect-juego-normal"
        required
        value={selectedJuegoCategoria}
        onChange={(e) => setSelectedJuegoCategoria(e.target.value)}
      >
        {Array.isArray(juegosCategorias) && juegosCategorias.map((juegoCategoria) => (
          <option key={juegoCategoria._id} value={juegoCategoria.nombre}>
            {juegoCategoria.nombre}
          </option>
        ))}
      </select>
      <button onClick={handleBuscar}>Buscar</button>
      <select 
        style={{marginRight:'10px',marginLeft:'10px'}}
          id="miSelectId-juego-normal-jugador"
          name="miSelect-juego-normal-jugador"
          required
          value={selectedJugador}
          onChange={(e) => setSelectedJugador(e.target.value)}
        >
          {Array.isArray(jugadores) && jugadores.map((jugador) => (
            <option key={jugador._id} value={jugador.nombre}>
              {jugador.nombre}
            </option>
          ))}
        </select>
        <button onClick={handleBuscarJugador}>Buscar</button>
      <br />
      <br />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginLeft: '16px', marginRight: '16px' }}>
        {juegos.map((juego, index) => (
          <div key={juego._id} >
            {juego.equipos ? (// Renderizar detalles específicos para juegos equipos
              <CardJuegoEquipo juego={juego} juegosIndividuales={juegosIndividuales} juegosPorEquipos={juegosPorEquipos} jugadores={jugadores} historico={historico} />
            ) : (
              // Renderizar detalles específicos para juegos individuales
              <CardJuegoIndividual juego={juego} juegosIndividuales={juegosIndividuales} juegosPorEquipos={juegosPorEquipos} jugadores={jugadores} historico={historico} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerJuegosPage