import { Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap'; // Importa los componentes correctos de reactstrap
import React from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { set } from 'mongoose';

const CardApuesta = ({ apuesta }) => {

    const handleBorrar = async () => {
        try {
            const isConfirmed = window.confirm("¿Estás seguro de que deseas borrar esta apuesta?");
            if (!isConfirmed) return;

            await api.delete(`/historico/eliminarHistorico/${apuesta._id}`);
            await api.delete(`/juegosIndividuales/eliminarJuegoIndividual/${apuesta._id}`);
            navigate("/RankingPrincipal"); // Redirige a la misma ruta para forzar una actualización
        } catch (error) {
            console.log("Error al borrar la apuesta: ", error);
        }

    }

    return (
        <Card>
            <CardHeader>{apuesta.juegoNombre}</CardHeader>
            <CardBody>
                <CardTitle>
                    {new Date(apuesta.fecha).toLocaleString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}
                </CardTitle>                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <strong>Ganadores: x{apuesta.cuotaGanador}</strong>
                        <ul>
                            {apuesta.ganador.map((ganador, index) => (
                                <li key={index}>{ganador.nombre}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <strong>Perdedores: x{apuesta.cuotaPerdedor}</strong>
                        <ul>
                            {apuesta.perdedor.map((perdedor, index) => (
                                <li key={index}>{perdedor.nombre}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <strong>Apuestas:</strong>
                    <ul>
                        {apuesta.apuestasPersona.map((apuesta, index) => (
                            <li key={index}>

                                {apuesta.jugador.nombre}{" "}{" "}

                                apostó{" "}
                                <span style={{ color: "blue", fontWeight: "bold" }}>
                                    {apuesta.apuesta} pts
                                </span>{" "}
                                al{" "}
                                <span
                                    style={{
                                        color: apuesta.resultado === "ganador" ? "green" : "red",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {apuesta.resultado}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={handleBorrar} className='btn btn-danger' style={{ marginRight: '10px' }}>Borrar</button>
                </div>
            </CardBody>
        </Card>
    );
}

export default CardApuesta;