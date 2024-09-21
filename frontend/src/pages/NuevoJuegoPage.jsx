import React from 'react'
import'../styles/Nuevo_Juego.css'
import TopBar from '../components/NuevoJuegoComponents/TopBar'
import CrearCategoriaJuego from '../components/NuevoJuegoComponents/CrearCategoriaJuego'
import NuevoJuegoIndividual from '../components/NuevoJuegoComponents/NuevoJuegoIndividual'
import NuevoJuegoEquipo from '../components/NuevoJuegoComponents/NuevoJuegoEquipo'
import Duelo from '../components/NuevoJuegoComponents/Duelo'
const NuevoJuegoPage = () => {
  return (
    <div>
      <TopBar />
      <CrearCategoriaJuego />
      <NuevoJuegoIndividual />
      <br />
      <NuevoJuegoEquipo />
      <br />
      <Duelo />
    </div>
  )
}

export default NuevoJuegoPage