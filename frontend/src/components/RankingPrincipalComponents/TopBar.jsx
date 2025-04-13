import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import "../../styles/Historico.css";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const TopBar = ({ jugadores, historico }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [permiso, setPermisos] = useState(false);

    useEffect(() => {
        // Leer el valor de permiso desde el local storage
        const permisoLocal = localStorage.getItem('permiso');
        setPermisos(permisoLocal === 'true');
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nombres_jugadores = jugadores.map(jugador => jugador.nombre);

    const dias = historico
        .filter(historico => !historico.nombre.startsWith("Apuesta")) // Filtrar los que no empiezan con "Apuesta"
        .map(historico => {
            const fecha = new Date(historico.fecha);
            const fechaFormateada = fecha.toISOString().split('T')[0]; // Obtiene solo el año, mes y día
            return `${fechaFormateada} ${historico.nombre}`;
        });

    const datos = [];

       for (const nombre of nombres_jugadores) {
        const posiciones = [];
    
        // Filtrar el histórico para excluir los juegos que comienzan con "Apuesta"
        const historicoFiltrado = historico.filter(juego => !juego.nombre.startsWith("Apuesta"));
    
        for (const juego of historicoFiltrado) {
            // Buscar el índice del jugador por nombre en la lista de jugadores del día
            juego.jugadores.sort((a, b) => b.puntuacion - a.puntuacion);
            let indice = juego.jugadores.findIndex(jugador => jugador.nombre === nombre);
            // Si el jugador no se encuentra, findIndex devuelve -1
            if (indice === -1) {
                // Si no se encuentra, se asume que la posición es la última
                indice = null;
                posiciones.push(indice);
            } else {
                indice = indice + 1;
                posiciones.push(indice);
            }
        }
    
        datos.push({
            nombre: nombre,
            posiciones: posiciones
        });
    }

    const coloresPredefinidos = [
        '#FF0000', // Rojo
        '#00FF00', // Verde
        '#0000FF', // Azul oscuro
        '#FFD700', // Amarillo
        '#FF00FF', // Magenta
        '#00FFFF', // Cian
        '#590466', // purpura
        '#008080', // Verde azulado
        '#65d6a9',  // verde raro
        '#FF7F50', // naranja
        '#0F84EB',  // azul
        '#b1b448', // amarillo raro
        '#a19f9f', // gris
        '#000000', //negro
        '#ca984d', // marron
        '#b34dca', // morao
        
    ];

    const data = {
        labels: dias,
        datasets: datos.map((persona, index) => ({
            label: persona.nombre,
            data: persona.posiciones,
            borderColor: coloresPredefinidos[index % coloresPredefinidos.length],
            fill: false
        })),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                reverse: true, // Invertir el eje Y
            },

        },
    };



    return (
        <div>
            <div className="header">
                <h1 id="titulo">RANKING "MUNDIAL"</h1>
                <div className="botones-container">
                    {permiso && (
                        <button id="nuevo-juego-btn" onClick={() => navigate("/NuevoJuegoPage")}>
                            Nuevo juego
                        </button>
                    )}
                    <button id="ver-juegos-btn" onClick={() => navigate("/VerJuegosPage")} >Ver todos los juegos</button>
                    <button id="ver-duelos-btn" onClick={() => navigate("/VerDuelosPage")}>Ver duelos</button>
                    <button id="ver-historico-btn" onClick={openModal}>Ver historico</button>
                    <button id="cerrar-sesion-btn" onClick={() => navigate("/ApuestasPage")}>Apuestas</button>
                    <button id="volver-al-home-btn" onClick={() => navigate(`/HomePage/?rankingId=${localStorage.getItem('rankingId')}`)}>Volver al home</button>
                </div>
            </div>

            {isModalOpen && (
                <div id="historico-modal-overlay">
                    <div id="historico-modal-content">
                        <button id="hisotrico-close-button" onClick={closeModal}>×</button>
                        <h2>Evolución Ranking</h2>
                        {/* Contenido adicional del modal */}
                        <div id="historico-chart-container">
                            <Line data={data} options={options} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default TopBar;