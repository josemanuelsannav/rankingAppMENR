import { useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { set } from 'mongoose';

const AceptarInvitacion = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showInvitation, setShowInvitation] = useState({});
    const email = searchParams.get('email');
    const rankingId = searchParams.get('rankingId');

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const res = await api.get(`rankings/obtenerRanking/${rankingId}`);
                const ranking = res.data.data;

                // Comprobar si hay un miembro con el email y estadoInvitacion = "Invitado"
                const miembro = ranking.miembros.find(miembro => miembro.email === email && miembro.estadoInvitacion === 'Invitado');

                if (miembro) {
                    setShowInvitation(true);
                } else {
                    setShowInvitation(false);
                    console.log('No se encontró un miembro con el email especificado y estadoInvitacion = "Invitado"');
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchRanking();
    }, []);



    const handleAccept = async () => {
        // Aquí puedes hacer algo con el email y rankingId
        console.log('Invitación aceptada por:', email, 'con rankingId:', rankingId);
        // Lógica para aceptar la invitación, como actualizar la base de datos
        try {
            const res = await api.put(`/rankings/aceptarInvitacion/${rankingId}/${email}`);

        } catch (err) {
            console.log(err);
        }
        navigate('/');
    };

    return (
        <div>
            {showInvitation ? (
                <div>
                    <h1>Aceptar Invitación</h1>
                    <p>Email: {email}</p>
                    <p>Ranking ID: {rankingId}</p>
                    <button onClick={handleAccept}>Aceptar Invitación</button>
                </div>
            ): (
                <div>
                    <h1>No se encontró la invitación</h1>
                    <p>Por favor, verifica el enlace o contacta al administrador.</p>
                </div>
            )}

        </div>
    )
}

export default AceptarInvitacion