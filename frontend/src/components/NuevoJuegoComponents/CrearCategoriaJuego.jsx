import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CrearCategoriaJuego = () => {
    const navigate = useNavigate();

    const [juegoCategoria, setJuegoCategoria] = useState({
        nombre: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJuegoCategoria({
            ...juegoCategoria,
            [name]: value,
            rankingId: localStorage.getItem('rankingId') || ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (juegoCategoria.nombre.trim() === "") {
                alert("Por favor, rellene todos los campos");
                return;
            }
            juegoCategoria.nombre = juegoCategoria.nombre.trim();
            console.log("Nombre del juego a añadir:", juegoCategoria);
            const response = await api.post("/juegosCategoria/nuevoJuegoCategoria", juegoCategoria);
            if (response.status === 201) {
                console.log('juegoCategoria creado con éxito:', response.data);
                alert('JuegoCategoria creado con exito');
                navigate("/RankingPrincipal");
            }
            navigate("/RankingPrincipal");
        } catch (error) {
            console.log("Error al añadir el jugador: ", error);
        }

    };

    return (
        <div>
            <div className="container">   
                <form id="new-game" onSubmit={handleSubmit}>
                <h1>Crear Juego</h1>
                    <label htmlFor="nombre-juego-nuevo">Nombre del nuevo juego:</label>
                    <br />
                    <input onChange={handleInputChange} type="text" id="nombre-juego-nuevo" name="nombre" required />
                    <br />
                    <button type="submit"  className="btn btn-success">Guardar Juego</button>
                </form>
            </div>
        </div>
    )
}

export default CrearCategoriaJuego