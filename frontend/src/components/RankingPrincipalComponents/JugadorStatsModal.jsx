import React from 'react';
import BarChart from './BarChart'; // Importa el componente de la gráfica de barras
import '../../styles/JugadorStatsModal.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const JugadorStatsModal = ({ jugador, onClose, juegosEquipos, juegosIndividuales, duelos, numJugadores }) => {
    if (!jugador) return null;

    let partidasJugadas = 0;
    let posiciones = new Array(numJugadores).fill(0);
    let nombre_posiciones = [];
    for (let i = 0; i < numJugadores; i++) {
        nombre_posiciones.push("Posicion " + (i + 1));
    }
    let partidasUltimo = 0;
    let contrincantes = [];

    const inicializarTabla = () => {
        for (let i = 0; i < juegosIndividuales.length; i++) {
            const jugadores = juegosIndividuales[i].jugadores; //jugadores de un juego
            for (let j = 0; j < jugadores.length; j++) {
                const jugadorAux = jugadores[j]; //jugador de la lista de jugadores

                if (jugadorAux.id.toString() === jugador._id.toString()) { // si es el jugador que estamos buscando
                    
                    posiciones[j] = posiciones[j] + 1;
                    partidasJugadas++;     
                    if(j===jugadores.length-1){
                        partidasUltimo++;
                    }
                }
            }
        }
        for (let i = 0; i < juegosEquipos.length; i++) {
            const equipos = juegosEquipos[i].equipos; //equipos de un juego
            equipos.sort((a, b) => b.puntos - a.puntos);
            for (let j = 0; j < equipos.length; j++) {
                const equipo = equipos[j]; //equipo de la lista de equipos    
                if (equipo.integrantes.some(jugadorAux => jugadorAux._id.toString() === jugador._id.toString())) {
                    partidasJugadas++;
                    posiciones[j] = posiciones[j] + 1;
                    if(j===equipos.length-1){
                        partidasUltimo++;
                    }
                }
            }
        }
    }

    const inicializarTablaDuelos = () => {
        for (const duelo of duelos) {
            if (duelo.ganador == jugador._id || duelo.perdedor == jugador._id) {

                if (duelo.ganador == jugador._id) {
                    let personaEncontrada = contrincantes.find(persona => persona.nombre === duelo.perdedorNombre);
                    if (personaEncontrada) {
                        personaEncontrada.ganadas++;
                    } else {
                        const contrincante = {
                            nombre: duelo.perdedorNombre,
                            ganadas: 1,
                            perdidas: 0
                        }
                        contrincantes.push(contrincante);
                    }
                } else {
                    let personaEncontrada = contrincantes.find(persona => persona.nombre === duelo.ganadorNombre);
                    if (personaEncontrada) {
                        personaEncontrada.perdidas++;
                    } else {
                        const contrincante = {
                            nombre: duelo.ganadorNombre,
                            ganadas: 0,
                            perdidas: 1
                        }
                        contrincantes.push(contrincante);
                    }
                }
            }

        }
    }

    inicializarTabla();
    inicializarTablaDuelos();

    const labels = nombre_posiciones;
    let nombres_contrincantes = contrincantes.map(persona => persona.nombre);
    let ganadas = contrincantes.map(persona => persona.ganadas);
    let perdidas = contrincantes.map(persona => persona.perdidas);


    // Datos de ejemplo para la gráfica de barras
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Veces en esa posición',
                data: posiciones,
                borderColor: [
                    'rgba(255, 206, 86, 0.2)', // Amarillo
                    'rgba(201, 203, 207, 0.2)', // Gris
                    'rgba(153, 102, 51, 0.2)',  // Marrón
                    ...Array(posiciones.length - 3).fill('rgba(75, 192, 192, 0.2)') // Resto de las barras
                ],
                backgroundColor: [
                    'rgba(255, 206, 86, 1)', // Amarillo
                    'rgba(201, 203, 207, 1)', // Gris
                    'rgba(153, 102, 51, 1)',  // Marrón
                    ...Array(posiciones.length - 3).fill('rgba(75, 192, 192, 1)') // Resto de las barras
                ],
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Permite que el gráfico se ajuste al tamaño del contenedor

        scales: {
            y: {
                beginAtZero: true,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    // Usamos el estilo de punto y asignamos el color de la cuarta barra
                    usePointStyle: true,
                    pointStyle: 'rect', // Cambia el estilo del punto
                    generateLabels: function (chart) {
                        let legend = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
                        legend[0].fillStyle = chart.data.datasets[0].backgroundColor[3]; // Color de la cuarta barra
                        return legend;
                    }
                }
            }
        }
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Bar Chart'
                }
            }
        },
    };

    //////////////////////////////////////////
    /////////////////////////  //GraficaDuelos
    const dataDuelos = {
        labels: nombres_contrincantes,
        datasets: [
            {
                label: "Duelos ganados" ,
                data: ganadas,
                backgroundColor: ['rgba(75, 192, 192, 0.5)'],
                borderColor: ['rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }, {
                label: "Duelos perdidos" , // etiqueta para la segunda barra
                data: perdidas, // valores para la segunda barra
                backgroundColor: ['rgba(255, 99, 132, 0.5)'],
                borderColor: ['rgba(255, 99, 132, 0.5)'],
                borderWidth: 1
            }]

    };

    const configDuelos = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permite que el gráfico se ajuste al tamaño del contenedor
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Bar Chart'
                }
            }
        },
    };

    const optionsDuelos = {
        responsive: true,
        maintainAspectRatio: false, // Permite que el gráfico se ajuste al tamaño del contenedor

        scales: {
            y: {
                beginAtZero: true,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };
    ////////////////////////////////////////////


    return (
        <div className="modal-overlay-jugador">
            <div className="modal-content-jugador">
                <button className="close-button-jugador" onClick={onClose}>X</button>
                <h1>{jugador.nombre}</h1>
                <h6>
                    Partidas jugadas: {partidasJugadas}<br />
                    Partidas ultimo: {partidasUltimo}
                </h6>
                <div className="chart-container-jugador">
                    <BarChart data={data} config={config} options={options} />
                </div>
                <br />
                <h2>Duelos</h2>
                <h6>
                    Total ganados : { ganadas.reduce((acumulador, win) => acumulador + win, 0)}<br />
                    Total perdidos : {perdidas.reduce((acumulador, win) => acumulador + win, 0)}
                </h6>
                <div className="chart-container-jugador">
                    <BarChart data={dataDuelos} config={configDuelos} options={optionsDuelos} />
                </div>
            </div>
        </div>
    );
};

export default JugadorStatsModal;