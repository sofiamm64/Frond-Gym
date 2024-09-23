import React, { useState, useEffect } from 'react';
import { TextField, Button, Card, CardContent, Typography, Container, Grid } from '@mui/material';

function Clients() {
  const [opiniones, setOpiniones] = useState([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [opinion, setOpinion] = useState('');

  useEffect(() => {
    
    const storedOpiniones = JSON.parse(localStorage.getItem('opiniones')) || [];
    setOpiniones(storedOpiniones);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaOpinion = { nombre, correo, opinion };
    const updatedOpiniones = [...opiniones, nuevaOpinion];
    
    
    localStorage.setItem('opiniones', JSON.stringify(updatedOpiniones));
    
    
    setOpiniones(updatedOpiniones);
    
   
    setNombre('');
    setCorreo('');
    setOpinion('');
  };

  const handleDelete = (index) => {
    const updatedOpiniones = opiniones.filter((_, i) => i !== index);
    
    
    setOpiniones(updatedOpiniones);
    
   
    
    localStorage.setItem('opiniones', JSON.stringify(updatedOpiniones));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Opiniones de Clientes
      </Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Correo"
              variant="outlined"
              fullWidth
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Opinión"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: 'green', color: 'white' }} >
              Enviar Opinión
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography variant="h5" gutterBottom>
        Opiniones Recibidas
      </Typography>
      <Grid container spacing={2}>
        {opiniones.map((op, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{op.nombre}</Typography>
                <Typography color="textSecondary">{op.correo}</Typography>
                <Typography paragraph>{op.opinion}</Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(index)}
                >
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Clients;
