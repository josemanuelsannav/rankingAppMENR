import React from 'react'
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
    const navigate = useNavigate();

    return (
        <div >
            <header className="header">
                <h1>Crear juego</h1>
                <button onClick={() => navigate("/RankingPrincipal")} >Volver al ranking</button>
                <button onClick={() => window.location.href = 'https://www.sortea2.com/sortear/equipos'}>Equipos/Enfrentamientos aleatorios</button>
            </header>

           
        </div>
    )
}

export default TopBar