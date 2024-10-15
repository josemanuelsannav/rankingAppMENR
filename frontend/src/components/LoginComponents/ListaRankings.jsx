import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import "../../styles/Login/ListaRankings.css";

const ListaRankings = ({ profile }) => {
    const [showModal, setShowModal] = useState(false);
    const [nombre, setNombre] = useState('');
    const [miembros, setMiembros] = useState([]);
    const [email, setEmail] = useState('');
    const [rankingsProp, setRankingsProp] = useState([]);
    const [rankingsMiembro, setRankingsMiembro] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRanking, setEditingRanking] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const resProp = await api.get("/rankings/rankingsPropietario/" + profile.email);
                const resMiembro = await api.get("/rankings/rankingsMiembro/" + profile.email);
                const { data: dataProp } = resProp.data;
                const { data: dataMiembro } = resMiembro.data;
                setRankingsProp(dataProp || []);

                setRankingsMiembro(dataMiembro || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, [profile.email]);

    const handleAddMember = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            const miembroAux = {
                email: email,
                estadoInvitacion: 'Pendiente'
            }
            setMiembros([...miembros, miembroAux]);
            setEmail('');
        } else {
            alert('Por favor, introduce un correo electrónico válido.');
        }
    };

    const handleRemoveMember = (email) => {
        setMiembros(prevMiembros => prevMiembros.filter(miembro => miembro.email !== email));
    };

    const handleCrear = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let validMiembros = miembros.filter(miembro => emailRegex.test(miembro.email));

        try {
            const res = await api.post("/rankings/nuevoRanking/", {
                nombre: nombre,
                propietario: profile.email,
                miembros: validMiembros
            });
            const { data } = res.data;
            enviarInvitacion(data);
            validMiembros = miembros.filter(miembro => emailRegex.test(miembro.email))
                .map(miembro => {
                    if (miembro.estadoInvitacion === 'Pendiente') {
                        return { ...miembro, estadoInvitacion: 'Invitado' };
                    }
                    return miembro;
                });

            const res2 = await api.put(`/rankings/editarRanking/${data._id}`, {
                nombre: nombre,
                miembros: validMiembros
            });
            setRankingsProp([...rankingsProp, res2.data.data]);
            // Limpiar el formulario solo si la creación es exitosa
            setShowModal(false);
            setNombre('');
            setMiembros([]);

        } catch (err) {
            console.log(err);
        }
    };

    const handleEditarMiembros = (ranking) => {
        setNombre(ranking.nombre);
        setMiembros(ranking.miembros);
        console.log(ranking.nombre, ranking.miembros);
        setEditingRanking(ranking);
        setShowModal(true);
    };

    const handleGuardarCambios = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let validMiembros = miembros.filter(miembro => emailRegex.test(miembro.email));
        editingRanking.miembros = validMiembros;
        try {

            enviarInvitacion(editingRanking);

            validMiembros = miembros.filter(miembro => emailRegex.test(miembro.email))
                .map(miembro => {
                    if (miembro.estadoInvitacion === 'Pendiente') {
                        return { ...miembro, estadoInvitacion: 'Invitado' };
                    }
                    return miembro;
                });

            const res = await api.put(`/rankings/editarRanking/${editingRanking._id}`, {
                nombre: nombre,
                miembros: validMiembros
            });
            const { data } = res.data;
            setRankingsProp(rankingsProp.map(r => r._id === data._id ? data : r));
            setRankingsMiembro(rankingsMiembro.map(r => r === data ? data : r));
            setShowModal(false);
            setNombre('');
            setMiembros([]);
            setEditingRanking(null);
            //window.location.reload();
        } catch (err) {
            console.log(err);
        }

    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    const handleEntrar = (rankingId) => {
        navigate(`/HomePage/?rankingId=${rankingId}`);
    };

    const handleOpenModal = () => {
        setNombre('');
        setMiembros([]);
        setEmail('');
        setEditingRanking(null);
        setShowModal(true);
    };

    const enviarInvitacion = async (data) => {
        // Iterar sobre la lista de miembros
        for (let miembro of data.miembros) {
            if (miembro.estadoInvitacion === 'Pendiente') {
                try {
                    const templateParams = {
                        from_email: data.propietario,  // El correo del propietario del ranking
                        to_email: miembro.email,  // El correo del miembro
                        message: 'Te invitamos a nuestro ranking!',
                        link: `https://ranking-app-menr-front.vercel.app/aceptar-invitacion?email=${encodeURIComponent(miembro.email)}&rankingId=${data._id}`,
                    };

                    const response = await emailjs.send(
                        'service_jkqv3ck',     // Coloca tu Service ID
                        'template_ti8pdyp',    // Coloca tu Template ID
                        templateParams,
                        'AajwQs1wUMjIICGgw'         // Coloca tu User ID
                    );

                    console.log('Correo enviado exitosamente a:', miembro.email, response.status, response.text);
                } catch (error) {
                    console.error('Error al enviar el correo a:', miembro.email, error);
                }
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center' }}>Lista de rankings</h1>
            <br />

            <button onClick={handleOpenModal} className="btn btn-success">Crear Ranking</button>
            <br />
            <br />

            <h2 style={{ textAlign: 'center' }}>Mis Rankings</h2>
            <br />
            <ul>
                {rankingsProp.map((ranking, index) => (
                    <li key={index} style={{ marginTop: '10px' }}>
                        {ranking.nombre}
                        <button onClick={() => handleEntrar(ranking._id)} className="btn btn-primary " style={{ marginLeft: '10px' }}>Entrar</button>
                        <button onClick={() => handleEditarMiembros(ranking)} className="btn btn-warning " style={{ marginLeft: '10px' }}>Editar Miembros</button>
                    </li>
                ))}
            </ul>
            <br />

            <h2 style={{ textAlign: 'center' }}>Rankings como Miembro</h2>
            <br />

            <ul>
                {rankingsMiembro.map((ranking, index) => (
                    <li key={index} style={{ marginTop: '10px' }}>
                        {ranking.nombre}
                        <button onClick={() => handleEntrar(ranking._id)} className="btn btn-primary" style={{ marginLeft: '10px' }}>Entrar</button>
                    </li>
                ))}
            </ul>

            {showModal && (
                <div className="modal">
                    <div className="modal-content modal-mobile"> {/* Añadir la clase modal-mobile */}
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>{editingRanking ? 'Editar Ranking' : 'Crear Nuevo Ranking'}</h2>
                        <br />
                        <label>
                            Nombre:
                            <input
                                style={{ marginLeft: "20px" }}
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </label>
                        <br />
                        <div>
                            <h3>Invitar Miembros</h3>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                            <button onClick={handleAddMember} style={{ marginLeft: "20px" }}>Enviar Invitación</button>
                        </div>
                        <br />
                        <div>
                            <h3>Miembros pendientes</h3>
                            {miembros
                                .filter(miembro => miembro.estadoInvitacion === 'Pendiente')
                                .map((miembro, index) => (
                                    <div key={miembro.email} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span>{miembro.email}</span>
                                        <button onClick={() => handleRemoveMember(miembro.email)} style={{ marginLeft: '10px' }}>Eliminar</button>
                                    </div>
                                ))}
                            <br />
                            <h3>Miembros Invitados</h3>
                            {miembros
                                .filter(miembro => miembro.estadoInvitacion === 'Invitado')
                                .map((miembro, index) => (
                                    <div key={miembro.email} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span>{miembro.email}</span>
                                        <button onClick={() => handleRemoveMember(miembro.email)} style={{ marginLeft: '10px' }}>Eliminar</button>
                                    </div>
                                ))}
                            <br />
                            <h3>Miembros confirmados</h3>
                            {miembros
                                .filter(miembro => miembro.estadoInvitacion === 'Aceptado')
                                .map((miembro, index) => (
                                    <div key={miembro.email} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span>{miembro.email}</span>
                                        <button onClick={() => handleRemoveMember(miembro.email)} style={{ marginLeft: '10px' }}>Eliminar</button>
                                    </div>
                                ))}
                        </div>
                        <br />
                        <button onClick={editingRanking ? handleGuardarCambios : handleCrear}>
                            {editingRanking ? 'Guardar Cambios' : 'Crear'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListaRankings;
