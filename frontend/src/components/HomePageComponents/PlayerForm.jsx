import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../../styles/HomePage.css";
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PlayerForm = () => {
    const cloudinary_cloud = import.meta.env.VITE_CLOUDINARY_CLOUD;
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [fileName, setFileName] = useState("");

    const [jugador, setJugador] = useState({
        nombre: "",
        foto: "",
        puntuacion: 0,
        winrate: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJugador({ ...jugador, [name]: value, });
    };

    const handleFileChange = (file) => {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        setSelectedFile(file); // Guarda el archivo seleccionado en una variable de estado
    };

    const uploadToCloudinary = async () => {
        if (!selectedFile) {
            console.error("No hay archivo seleccionado para subir");
            return;
        }

        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", "Ranking");

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudinary_cloud}/image/upload`,
                data
            );
            return response.data.secure_url;
        } catch (error) {
            console.error("Error al subir la imagen a Cloudinary", error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (jugador.nombre.trim() === "") {
                alert("Por favor, rellene todos los campos");
                return;
            }
            jugador.nombre = jugador.nombre.trim();


            const imageUrl = await uploadToCloudinary();
            if (imageUrl) {
                jugador.foto = imageUrl;
            }
            console.log("Jugador a añadir:", jugador);
            const response = await api.post("/jugadores/nuevoJugador", jugador);
            if (response.status === 201) {
                console.log('Jugador creado con éxito:', response.data);
                alert('Jugador creado con éxito');                  
            }

        } catch (error) {
            console.log("Error al añadir el jugador: ", error);
        }
    };

    return (
        <div className="form-container">
            <form id="player-form" onSubmit={handleSubmit}>

                <div className="input-group mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre:</label>
                    <input onChange={handleInputChange} type="text" className="form-control" id="nombre" name="nombre" required />
                </div>

                {/* Botón para seleccionar imagen y previsualización */}
                <div className="input-group mb-3">
                    <label htmlFor='foto' className="foto-label">Foto:</label>
                    <input
                        type="file"
                        accept="image/*"
                        id="upload"
                        style={{ display: "none" }}
                        onChange={(e) => handleFileChange(e.target.files[0])}
                    />
                    <label htmlFor="upload" className="btn btn-secondary">
                        Seleccionar Imagen
                    </label>
                    {fileName && <FileName>{fileName}</FileName>}
                    {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}
                </div>

                <button type="submit" className="btn btn-primary btn-custom-width">Añadir jugador</button>
            </form>
            <br />
            <button id="go-to-view2" type="button" className="btn btn-success" onClick={() => navigate("/RankingPrincipal")}>EMPEZAR</button>
            <br />
        </div>
    );
};

// Estilos personalizados
const FileName = styled.p`
  margin-left: 10px;
  font-size: 14px;
  color: #555;
  font-style: italic;
`;

const ImagePreview = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-left: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

export default PlayerForm;
