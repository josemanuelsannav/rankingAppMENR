import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../../styles/Login/Topbar.css'

const TopBar = ({ profile , logOut}) => {
    const navigate = useNavigate();

    

    return (
        <div className="top-bar-container">
            <h1 className="login-title">LOGIN</h1>
            {profile && (
                <div className="top-bar">
                    <div className="profile-info">
                        <img src={profile.picture} alt={profile.name} className="profile-picture" />
                        <div className="profile-details">
                            <h1>{profile.name}</h1>
                            <h2>{profile.email}</h2>
                        </div>
                    </div>
                    <button className="btn btn-danger" onClick={logOut}>Cerrar sesión</button>
                </div>
            )}
        </div>
    );
}

export default TopBar
