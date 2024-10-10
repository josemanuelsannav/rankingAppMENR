import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import api from "../services/api";
import ListaRankings from '../components/LoginComponents/ListaRankings.jsx';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBIcon,
    MDBCheckbox,
    MDBCardText,
    MDBCardImage,
    MDBTypography
}
    from 'mdb-react-ui-kit';

const Login = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            localStorage.setItem('user', JSON.stringify(codeResponse)); // Guardar en localStorage
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        // Verificar si hay un usuario guardado en localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser); // Restablecer el usuario
        }
    }, []);

    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    const profileData = res.data;
                    const usuario = {
                        email: profileData.email,
                        nombre: profileData.name
                    };
                    api.post("/usuarios/nuevoUsuario/", usuario)
                        .then((res) => console.log(res))
                        .catch((err) => console.log(err));

                    setProfile(profileData);
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    const logOut = () => {
        googleLogout();
        setProfile(null);
        localStorage.removeItem('user'); // Eliminar del localStorage al cerrar sesión
        setUser(null);
    };

    return (
        <div>

            {profile ? (
                <div>
                    <div className="vh-100" >
                        <MDBContainer className="container py-5 h-100">
                            <MDBRow className="justify-content-center align-items-center h-100">
                                <MDBCol md="12" xl="4">
                                    <MDBCard style={{ borderRadius: '15px' }}>
                                        <MDBCardBody className="text-center">
                                            <div className="mt-3 mb-4">
                                                <MDBCardImage src={profile.picture}
                                                    className="rounded-circle" fluid style={{ width: '100px' }} />
                                            </div>
                                            <MDBTypography tag="h4">{profile.name}</MDBTypography>
                                            <MDBCardText className="text-muted mb-4">
                                                {profile.email} 
                                            </MDBCardText>
                                           
                                            <MDBBtn rounded size="lg" onClick={logOut}>
                                                Log out
                                            </MDBBtn>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                            </MDBRow>
                            
                        </MDBContainer>
                    </div>
                    <div>
                        <ListaRankings profile={profile} />
                    </div>
                </div>

            ) : (
                <MDBContainer fluid>

                    <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                        <MDBCol col='12'>

                            <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
                                <MDBCardBody className='p-5 w-100 d-flex flex-column'>

                                    <h2 className="fw-bold mb-2 text-center">Sign in</h2>
                                    <p className="text-white-50 mb-3">Please enter your login and password!</p>

                                    <MDBInput wrapperClass='mb-4 w-100' label='Email address' id='formControlLg2' type='email' size="lg" />
                                    <MDBInput wrapperClass='mb-4 w-100' label='Password' id='formControlLg' type='password' size="lg" />

                                    <MDBCheckbox name='flexCheck' id='flexCheckDefault' className='mb-4' label='Remember password' />

                                    <MDBBtn size='lg'>
                                        Login
                                    </MDBBtn>

                                    <hr className="my-4" />

                                    <MDBBtn className="mb-2 w-100" size="lg" style={{ backgroundColor: '#dd4b39' }} onClick={login}>

                                        Sign in with google
                                    </MDBBtn>

                                    <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#3b5998' }}>

                                        Sign in with facebook
                                    </MDBBtn>

                                </MDBCardBody>
                            </MDBCard>

                        </MDBCol>
                    </MDBRow>

                </MDBContainer>
            )}
        </div>
    );
}

export default Login;
