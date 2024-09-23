import React from 'react';
import { useS } from './ServicioContext'; 
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container
} from '@mui/material';

function Servicios() {
  const { servicios } = useS();

  const serviciosActivos = servicios.filter(servicio => servicio.Estado === 'activo');

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Servicios Disponibles
      </Typography>
      <Grid container spacing={3}>
        {serviciosActivos.length > 0 ? (
          serviciosActivos.map((servicio) => (
            <Grid item xs={12} sm={6} md={4} key={servicio.ServicioID}>
              <Card style={{ minHeight: '250px' }}>
                <CardContent>
                  <Typography variant="h5">{servicio.Nombre}</Typography>
                  <Typography variant="body2" color="textSecondary">
                  Descripción: {servicio.Descripcion}
                  </Typography>
                  <Typography variant="h6">${servicio.Precio.toFixed(2)}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Tipo: {servicio.Tipo}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Cantidad disponible: {servicio.Cantidad}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No hay servicios disponibles.</Typography>
        )}
      </Grid>
    </Container>
  );
}

export default Servicios;
