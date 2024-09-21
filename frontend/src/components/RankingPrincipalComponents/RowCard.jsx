import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';

export default function RowCard({keyJugador, jugador,juegosEquipos, juegosIndividuales, duelos ,onImageClick ,numJugadores}) {


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

  return (
    <Card orientation="horizontal" variant="outlined" sx={{ width: 260 }}>
      <CardOverflow>
        
        <AspectRatio ratio="1" sx={{ width: 90 }}>
          <img
            src= {jugador.foto}
            srcSet={jugador.foto}
            loading="lazy"
            alt=""
            onClick={() => onImageClick(jugador)} // Asignar el evento onClick

          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography  sx={{ fontWeight: 'md' }}>
          {jugador.nombre}
        </Typography>
        <Typography level="body-sm">{jugador.puntuacion} pts. Wr: {calcularWR(jugador)}% Lr: {calcularLR(jugador)}%</Typography>
      </CardContent>
      
    </Card>
  );
}
