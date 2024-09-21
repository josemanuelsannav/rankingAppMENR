import React from 'react'
import { Card, CardHeader, CardBody, CardTitle, CardText, Button as ReactstrapButton } from 'reactstrap'; // Importa los componentes correctos de reactstrap
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CardDuelos = ({ duelo }) => {
    const navigate = useNavigate();

    const handleBorrar = async () => {
        try {
            const isConfirmed = window.confirm("¿Estás seguro de que deseas borrar este juego?");
    if (!isConfirmed) return;

          await api.delete(`/historico/eliminarHistorico/${duelo._id}`);
          await api.delete(`/duelos/eliminarDuelo/${duelo._id}`);
          navigate(0); // Redirige a la misma ruta para forzar una actualización
        } catch (error) {
          console.log("Error al borrar el duelo: ", error);
        }
    
    }

    return (
        <Card key={duelo._id} style={{ boxSizing: 'border-box', border: '3px solid orange' }}>
            <CardBody>
            <CardTitle style={{ fontSize: '2rem', fontWeight: 'bold' }}>{duelo.nombre}</CardTitle>

                <div>
                    Ganador: {duelo.ganadorNombre}
                    <br />
                    Perdedor: {duelo.perdedorNombre}
                    <br />
                    Apuesta: {duelo.apuesta}
                    <br />
                    {duelo.fecha && <p>{new Date(duelo.fecha).toLocaleDateString()}</p>}
                    <button onClick={handleBorrar}  className='btn btn-danger'>Borrar</button>
                </div>
            </CardBody>
        </Card>
    )
}

export default CardDuelos