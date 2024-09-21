import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';

export default function RowCard({keyJugador, jugador }) {
  return (
    <Card orientation="horizontal" variant="outlined" sx={{ width: 260 }}>
      <CardOverflow>
        <AspectRatio ratio="1" sx={{ width: 90 }}>
          <img
            src= {jugador.foto}
            srcSet={jugador.foto}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography textColor="success.plainColor" sx={{ fontWeight: 'md' }}>
          {jugador.nombre}
        </Typography>
        <Typography level="body-sm">Puntuacion: {jugador.puntuacion}</Typography>
      </CardContent>
      
    </Card>
  );
}
