import React, { useEffect,useState } from 'react'
import '../../styles/RankingPrincipal.css'
import copaPrimerPuesto from '../../assets/number1.svg'
import copaSegundoPuesto from '../../assets/number2.svg'
import copaTercerPuesto from '../../assets/number3.svg'
import confetti from 'canvas-confetti';
import JugadorStatsModal from './JugadorStatsModal';
const Podio = ({ jugadoresPodio, juegosEquipos, juegosIndividuales, duelos ,numJugadores}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedJugador, setSelectedJugador] = useState(null);
   
    useEffect(() => {
        confeti();
    }, []);

    const confeti = () => {
        let canvas = document.createElement("canvas");
        let container = document.getElementsByClassName("jss1040")[0];
        canvas.width = 600;
        canvas.height = 600;

        container.appendChild(canvas);

        let confetti_button = confetti.create(canvas);
        confetti_button().then(() => container.removeChild(canvas));
    };

    const calcularWR = (jugador) => {
        let partidasGanadas = 0;
        let partidasJugadas = 0;
        let posiciones = new Array(numJugadores).fill(0);
        // Recorrer juegos individuales
        for (let i = 0; i < juegosIndividuales.length; i++) {
            const jugadores = juegosIndividuales[i].jugadores; //jugadores de un juego
            for (let j = 0; j < jugadores.length; j++) {
                const jugadorAux = jugadores[j]; //jugador de la lista de jugadores

                if (jugadorAux.id.toString() === jugador._id.toString()) { // si es el jugador que estamos buscando
                    console.log("Jugador encontrado: ", jugadorAux);
                    console.log("posiciones ", posiciones[j]);
                    posiciones[j] = posiciones[j] + 1;
                    partidasJugadas++;
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
                }
            }
        }
        if (partidasJugadas === 0) {
            return 0; // Evitar división por cero
        }
        const winrate = (posiciones[0] / partidasJugadas) * 100;
        console.log("Partidas ganadas",partidasGanadas,"Partidas jugadas",partidasJugadas,"Winrate",winrate);
        return winrate.toFixed(2); // Devolver el winrate con dos decimales
    };

    const calcularLR = (jugador) => {
        let partidasPerdidas = 0;
        let partidasJugadas = 0;
        let posiciones = new Array(numJugadores).fill(0);
        // Recorrer juegos individuales
        for (let i = 0; i < juegosIndividuales.length; i++) {
            const jugadores = juegosIndividuales[i].jugadores; //jugadores de un juego
            for (let j = 0; j < jugadores.length; j++) {
                const jugadorAux = jugadores[j]; //jugador de la lista de jugadores

                if (jugadorAux.id.toString() === jugador._id.toString()) { // si es el jugador que estamos buscando
                    console.log("Jugador encontrado: ", jugadorAux);
                    console.log("posiciones ", posiciones[j]);
                    posiciones[j] = posiciones[j] + 1;
                    partidasJugadas++;
                    if(j===jugadores.length-1){
                        partidasPerdidas++;
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
                        partidasPerdidas++;
                    }
                }
            }
        }
        if (partidasJugadas === 0) {
            return 0; // Evitar división por cero
        }
        const winrate = (partidasPerdidas / partidasJugadas) * 100;
        return winrate.toFixed(2); // Devolver el winrate con dos decimales
    }

    const handleImageClick = (jugador) => {
        setSelectedJugador(jugador);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedJugador(null);
    };

    
    return (
        <div className="MuiPaper-root jss1038 MuiPaper-elevation0 MuiPaper-rounded">
            <div className="jss1040">
                {/* Subcampeón */}
                <div className="MuiPaper-root jss1041 jss1043 MuiPaper-elevation1 MuiPaper-rounded">
                    <div className="jss1045">  {/* COPA */}
                        <span
                            style={{ boxSizing: 'border-box', display: 'inline-block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'relative', maxWidth: '100%', }}>
                            <span style={{ boxSizing: 'border-box', display: 'block', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', maxWidth: '100%', }}>
                                <img
                                    alt=""
                                    aria-hidden="true"
                                    src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27120%27%20height=%27120%27/%3e"
                                    style={{ display: 'block', maxWidth: '100%', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', }} />
                            </span>
                            <img
                                alt="sub-campeon"
                                src={copaSegundoPuesto}
                                decoding="async"
                                style={{ position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%', }} />
                        </span>
                        <div className="jss1046">
                            <h4 className="MuiTypography-root MuiTypography-h4">2º</h4>
                        </div>
                    </div>
                    <div className="jss1048"> {/* Foto con el podio y tal */}
                        <div className="foto" id="foto-segundo">
                            {jugadoresPodio[1] && <img src={jugadoresPodio[1].foto} alt="foto del segundo"  onClick={() => handleImageClick(jugadoresPodio[1])}></img>}
                        </div>
                        <div>
                            <div className="jss1039">
                                <h6 className="nombre-podio" id="segundo">
                                    {jugadoresPodio[1] ? jugadoresPodio[1].nombre : "No hay segundo lugar"}
                                </h6>
                            </div>
                            <h6 className="MuiTypography-root MuiTypography-subtitle2" id="puntos-segundo">
                                {jugadoresPodio[1] ? jugadoresPodio[1].puntuacion + " pts.   Wr: " + calcularWR(jugadoresPodio[1]) + "%"  + " Lr: " + calcularLR(jugadoresPodio[1]) + "%" : 0} 
                            </h6>
                        </div>
                    </div>
                </div>

                {/* Campeón */}
                <div className="MuiPaper-root jss1041 jss1042 MuiPaper-elevation1 MuiPaper-rounded">
                    <div className="jss1045">
                        <span style={{ boxSizing: 'border-box', display: 'inline-block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'relative', maxWidth: '100%', }}>
                            <span style={{ boxSizing: 'border-box', display: 'block', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', maxWidth: '100%', }}>
                                <img
                                    alt=""
                                    aria-hidden="true"
                                    src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27120%27%20height=%27120%27/%3e"
                                    style={{ display: 'block', maxWidth: '100%', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', }} />
                            </span>
                            <img
                                alt="campeon"
                                src={copaPrimerPuesto}
                                decoding="async"
                                style={{ position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%', }} />
                        </span>
                        <div className="jss1046">
                            <h4 className="MuiTypography-root MuiTypography-h4">1º</h4>
                        </div>
                    </div>
                    <div className="jss1048">
                        <div className="foto" id="foto-primero">
                            {jugadoresPodio[0] && <img src={jugadoresPodio[0].foto} alt="foto del primero"  onClick={() => handleImageClick(jugadoresPodio[0])}></img>}
                        </div>
                        <div>
                            <div className="jss1039">
                                <h6 className="nombre-podio" id="primero">
                                    {jugadoresPodio[0] ? jugadoresPodio[0].nombre : "No hay primer lugar"}
                                </h6>
                            </div>
                            <h6 className="MuiTypography-root MuiTypography-subtitle2" id="puntos-primero">
                                {jugadoresPodio[0] ? jugadoresPodio[0].puntuacion + " pts.   Wr: " + calcularWR(jugadoresPodio[0]) + "%"  + " Lr: " + calcularLR(jugadoresPodio[0]) + "%": 0}
                            </h6>
                        </div>
                    </div>
                </div>

                {/* Tercer lugar */}
                <div className="MuiPaper-root jss1041 jss1044 MuiPaper-elevation1 MuiPaper-rounded">
                    <div className="jss1045">
                        <span style={{ boxSizing: 'border-box', display: 'inline-block', overflow: 'hidden', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', position: 'relative', maxWidth: '100%', }}>
                            <span style={{ boxSizing: 'border-box', display: 'block', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', maxWidth: '100%', }}>
                                <img
                                    alt=""
                                    aria-hidden="true"
                                    src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27120%27%20height=%27120%27/%3e"
                                    style={{ display: 'block', maxWidth: '100%', width: 'initial', height: 'initial', background: 'none', opacity: 1, border: '0px', margin: '0px', padding: '0px', }} />
                            </span>
                            <img
                                alt="tercer lugar"
                                src={copaTercerPuesto}
                                decoding="async"
                                style={{ position: 'absolute', inset: '0px', boxSizing: 'border-box', padding: '0px', border: 'none', margin: 'auto', display: 'block', width: '0px', height: '0px', minWidth: '100%', maxWidth: '100%', minHeight: '100%', maxHeight: '100%', }} />
                        </span>
                        <div className="jss1046">
                            <h4 className="MuiTypography-root MuiTypography-h4">3º</h4>
                        </div>
                    </div>
                    <div className="jss1048">
                        <div className="foto" id="foto-tercero">
                            {jugadoresPodio[2] && <img src={jugadoresPodio[2].foto} alt="foto del tercero"  onClick={() => handleImageClick(jugadoresPodio[2])}></img>}
                        </div>
                        <div>
                            <div className="jss1039">
                                <h6 className="nombre-podio" id="tercero">
                                    {jugadoresPodio[2] ? jugadoresPodio[2].nombre : "No hay tercer lugar"}
                                </h6>
                            </div>
                            <h6 className="MuiTypography-root MuiTypography-subtitle2" id="puntos-tercero">
                                {jugadoresPodio[2] ? jugadoresPodio[2].puntuacion + " pts.   Wr: " + calcularWR(jugadoresPodio[2]) + "%"  + " Lr: " + calcularLR(jugadoresPodio[2]) + "%" : 0}
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
            {modalVisible && (
                <JugadorStatsModal jugador={selectedJugador} juegosEquipos={juegosEquipos} juegosIndividuales={juegosIndividuales} duelos={duelos} numJugadores={numJugadores} onClose={closeModal} />
            )}
        </div>
    );
}

export default Podio;