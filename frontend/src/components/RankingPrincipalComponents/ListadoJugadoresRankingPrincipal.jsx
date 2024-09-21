import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../../styles/RankingPrincipal.css";
import RowCard from './RowCard';
import JugadorStatsModal from './JugadorStatsModal';

const ListadoJugadoresRankingPrincipal = ({ jugadores,juegosEquipos, juegosIndividuales, duelos  }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedJugador, setSelectedJugador] = useState(null);

    const handleImageClick = (jugador) => {
        setSelectedJugador(jugador);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedJugador(null);
    };

    return (
        <div className="container">
            <div id="jugadores">

                {jugadores.map((jugador, index) => (
                    <div key={jugador._id} className="jugador-item">
                        <span className="numero-posicion">{index + 4}.</span>
                        <RowCard 
                        jugador={jugador} 
                        juegosEquipos={juegosEquipos}
                         juegosIndividuales={juegosIndividuales}
                          duelos={duelos}
                          numJugadores={jugadores.length}
                          onImageClick={handleImageClick} // Pasar handleImageClick como prop
/>
                    </div>
                ))}

            </div>
            {modalVisible && (
                <JugadorStatsModal 
                jugador={selectedJugador}
                 juegosEquipos={juegosEquipos} 
                 juegosIndividuales={juegosIndividuales} 
                 duelos={duelos} 
                 numJugadores={jugadores.length}
                onClose={closeModal} />
            )}
        </div>
    );
};

export default ListadoJugadoresRankingPrincipal;