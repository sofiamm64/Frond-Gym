import React from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[6],
  },
}));

const TeamCard = ({ image, name, description }) => (
  <StyledCard>
    <CardMedia
      component="img"
      height="140"
      image={image}
      alt={name}
    />
    <CardContent>
      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </StyledCard>
);

function AboutUs() {
  return (
    <Container maxWidth="lg" disableGutters>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', padding: 4, backgroundColor: '#f5f5f5' }}
      >
        <Grid item xs={12} sx={{ mb: 4 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ color: '#333' }}>
            Sobre Nosotros
          </Typography>
          <Typography variant="h6" align="center" paragraph sx={{ color: '#666' }}>
            En FitLife, nos dedicamos a ayudarte a alcanzar tus metas de fitness con programas personalizados y un equipo de entrenadores apasionados. Creemos en el poder del ejercicio para transformar vidas y estamos comprometidos en brindarte el mejor apoyo en tu viaje hacia una vida más saludable.
          </Typography>
        </Grid>
        
        <Grid item xs={12} sx={{ mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#333' }}>
            Nuestro Equipo
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <TeamCard
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOaavi6IWcjgOLulu4n0uPJnXmyQmflVPlcA&s"
                name="Entrenador 1"
                description="Una entredora dura que te hara sacar tu mayor potencial para mejorar tu cuerpo y romper tus limites"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TeamCard
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNywIJMs1IYc5JqW8Zt05_9h-6b7cbJX302A&s"
                name="Entrenador 2"
                description="Una entrenadora con mucha energia que te hara definir tu cuerpo para obtener una mejor estetica en tu figura"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TeamCard
                image="https://static.vecteezy.com/system/resources/previews/004/674/988/large_2x/man-and-woman-personal-trainers-in-the-gym-photo.jpg"
                name="Entrenador 3"
                description="Entrenadores personales para principiantes para que conozcas como inicir con una vida saludable"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#333' }}>
            Nuestros Valores
          </Typography>
          <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', backgroundColor: '#fff', p: 4, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" paragraph sx={{ color: '#666' }}>
              Pasión: Estamos comprometidos con tu éxito y nos apasiona ayudarte a alcanzar tus metas de fitness.
            </Typography>
            <Typography variant="h6" paragraph sx={{ color: '#666' }}>
              Innovación: Utilizamos las últimas técnicas y herramientas para ofrecerte un entrenamiento efectivo y divertido.
            </Typography>
            <Typography variant="h6" paragraph sx={{ color: '#666' }}>
              Comunidad: Fomentamos un ambiente inclusivo y motivador donde todos pueden crecer y mejorar.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AboutUs;
