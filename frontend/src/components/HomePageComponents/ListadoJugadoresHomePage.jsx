import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import RowCard from "../HomePageComponents/RowCard";
const ListadoJugadoresHomePage = ({ jugadores }) => {
    return (
        <div>
            <div className="listado-jugadores d-flex justify-content-center align-items-center mt-3 mb-5">
                <div id="jugadores" >
                    {Array.isArray(jugadores) && jugadores.map(jugador => (
                        <RowCard key={jugador._id} jugador={jugador} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListadoJugadoresHomePage;