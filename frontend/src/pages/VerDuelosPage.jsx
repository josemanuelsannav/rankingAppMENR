import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TopBar from '../components/VerJuegosComponents/TopBar'
import CardDuelos from '../components/VerDuelosComponents/CardDuelos';
const VerDuelosPage = () => {

  const [duelos, setDuelos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchDuelos();
    };
    fetchData();
  }
    , []);

  const fetchDuelos = async () => {
    try {
      const { data } = (await api.get("/duelos/todosLosDuelos")).data;
      const duelosOrdenados = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setDuelos(duelosOrdenados);
    } catch (error) {
      console.log("Error al obtener los juegos duelos:  ", error);
    }
  };

  return (
    <div>
      <TopBar />
      <br />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginLeft: '16px', marginRight: '16px' }}>
        {duelos.map((duelo, index) => (
          <div key={duelo._id} >
            <CardDuelos duelo={duelo} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default VerDuelosPage