import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ListaRankings = ({ profile }) => {
    const [showModal, setShowModal] = useState(false);
    const [nombre, setNombre] = useState('');
    const [miembros, setMiembros] = useState(['']);
    const [rankingsProp, setRankingsProp] = useState([]); // Inicializar como array vacío
    const [rankingsMiembro, setRankingsMiembro] = useState([]); // Inicializar como array vacío
    const [loading, setLoading] = useState(true); // Estado para controlar la carga
    const [editingRanking, setEditingRanking] = useState(null); // Estado para el ranking que se está editando
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const resProp = await api.get("/rankings/rankingsPropietario/" + profile.email);
                const resMiembro = await api.get("/rankings/rankingsMiembro/" + profile.email);
                const { data: dataProp } = resProp.data;
                const { data: dataMiembro } = resMiembro.data;
                setRankingsProp(dataProp || []); // Asegurarse de que sea un array
                setRankingsMiembro(dataMiembro || []); // Asegurarse de que sea un array
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false); // Cambiar el estado de carga a false una vez que los datos se hayan cargado
            }
        };

        fetchRankings();
    }, [profile.email]);

    const handleAddMember = () => {
        setMiembros([...miembros, '']);
    };

    const handleMemberChange = (index, value) => {
        const newMiembros = [...miembros];
        newMiembros[index] = value;
        setMiembros(newMiembros);
    };

    const handleRemoveMember = (index) => {
        const newMiembros = miembros.filter((_, i) => i !== index);
        setMiembros(newMiembros);
    };

    const handleCrear = async () => {
        // Filtrar miembros para incluir solo correos electrónicos válidos
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validMiembros = miembros.filter(miembro => emailRegex.test(miembro));

        // Lógica para manejar la creación del ranking
       
        try {
            const res = await api.post("/rankings/nuevoRanking/", {
                nombre: nombre,
                propietario: profile.email,
                miembros: validMiembros
            });
            const { data } = res.data;
            setRankingsProp([...rankingsProp, data]);
        } catch (err) {
            console.log(err);
        }
        // Aquí puedes llamar a una API o realizar cualquier otra acción necesaria
        setShowModal(false);
        setNombre('');
        setMiembros(['']);
    };

    const handleEditarMiembros = (ranking) => {
        setNombre(ranking.nombre);
        setMiembros(ranking.miembros);
        setEditingRanking(ranking);
        setShowModal(true);
    };

    const handleGuardarCambios = async () => {
        // Filtrar miembros para incluir solo correos electrónicos válidos
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validMiembros = miembros.filter(miembro => emailRegex.test(miembro));

        // Lógica para manejar la edición del ranking
       
        try {
            const res = await api.put(`/rankings/editarRanking/${editingRanking._id}`, {
                nombre: nombre,
                miembros: validMiembros
            });
            const { data } = res.data;
            setRankingsProp(rankingsProp.map(r => r === data ? data : r));
            setRankingsMiembro(rankingsMiembro.map(r => r === data ? data : r));

        } catch (err) {
            console.log(err);
        }
        // Aquí puedes llamar a una API o realizar cualquier otra acción necesaria
        setShowModal(false);
        setNombre('');
        setMiembros(['']);
        setEditingRanking(null);
window.location.reload();
    };

    if (loading) {
        return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se cargan los datos
    }

    const handleEntrar = (rankingId) => {
        navigate(`/HomePage/?rankingId=${rankingId}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center' }}>Lista de rankings</h1>
            <br/>

            <button onClick={() => setShowModal(true)} className="btn btn-success" >Crear Ranking</button>
            <br/>
            <br/>

            <h2 style={{ textAlign: 'center' }}>Mis Rankings</h2>
            <br/>
            <ul>
                {rankingsProp.map((ranking, index) => (
                    <li key={index} style={{ marginTop: '10px' }}>
                        {ranking.nombre}
                        <button onClick={() => handleEntrar(ranking._id)} className="btn btn-primary" style={{ marginLeft: '10px' }} >Entrar</button>
                        <button onClick={() => handleEditarMiembros(ranking)} className="btn btn-warning" style={{ marginLeft: '10px' }}>Editar Miembros</button>
                    </li>
                ))}
            </ul>
            <br/>

            <h2 style={{ textAlign: 'center' }} >Rankings como Miembro</h2>
            <br/>

            <ul>
                {rankingsMiembro.map((ranking, index) => (
                    <li key={index} style={{ marginTop: '10px' }}>
                        {ranking.nombre}
                        <button onClick={() => handleEntrar(ranking._id)} className="btn btn-primary" style={{ marginLeft: '10px' }} >Entrar</button>
                    </li>
                ))}
            </ul>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>{editingRanking ? 'Editar Ranking' : 'Crear Nuevo Ranking'}</h2>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </label>
                        <div>
                            <h3>Miembros</h3>
                            {miembros.map((miembro, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="email"
                                        value={miembro}
                                        onChange={(e) => handleMemberChange(index, e.target.value)}
                                        placeholder="Email"
                                    />
                                    <button onClick={() => handleRemoveMember(index)}>Eliminar</button>
                                </div>
                            ))}
                            <button onClick={handleAddMember}>Añadir Miembro</button>
                        </div>
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