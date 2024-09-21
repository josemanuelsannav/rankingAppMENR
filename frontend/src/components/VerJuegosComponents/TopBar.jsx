import React from 'react'
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
    const navigate = useNavigate();

    return (
        <div >
            <header className="header">
                <h1>Todos los juegos</h1>
                <button onClick={() => navigate("/RankingPrincipal")} >Volver al ranking</button>
            </header>

           
        </div>
    )
}

export default TopBar