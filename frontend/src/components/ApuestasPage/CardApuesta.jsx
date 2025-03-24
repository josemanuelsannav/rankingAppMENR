import { Card, CardHeader, CardBody, CardTitle, CardText } from 'reactstrap'; // Importa los componentes correctos de reactstrap
import React from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { set } from 'mongoose';

const CardApuesta = ({ apuesta }) => {
    return (
        <Card>
            <CardHeader>{apuesta.juegoNombre}</CardHeader>
            <CardBody>
                <CardTitle>{apuesta.fecha}</CardTitle>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    {/* Aquí puedes agregar el contenido de las apuestas */}
                    <ul>
                        {apuesta.apuestasPersona.map((apuesta, index) => (
                            <li key={index}>{apuesta.jugador.nombre} apostó {apuesta.apuesta} al equipo {apuesta.resultado}</li>
                        ))}
                    </ul>
                </div>
            </CardBody>
        </Card>
    );
}

export default CardApuesta;