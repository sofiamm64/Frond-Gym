import React from 'react';
import { Typography, Box, Container, Grid, Button } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Container maxWidth="md" disableGutters>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '5vh', padding: 2, textAlign: 'center' }}
      >
        <Grid item xs={10} sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bienvenido a FitLife
          </Typography>
          <Typography variant="h6" paragraph>
            Descubre nuestra amplia gama de servicios.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Link to="/Servicios">
              <Button 
                variant="contained" 
                size="large" 
                sx={{ backgroundColor: 'green', color: 'white' }}
              >
                Explorar servicios
              </Button>
            </Link>
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ width: '100%' }}>
          <Slider {...settings} sx={{ height: '300px' }}>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <img 
                src="https://multigym.fit/images/Gyms/Gymnasio1.jpg" 
                alt="Imagen 1" 
                style={{ width: '100%', height: '270px', objectFit: 'cover', borderRadius: 8 }} 
              />
              <Typography variant="h6" sx={{ position: 'absolute', bottom: 16, left: 16, color: 'white' }}>
                Ofrecemos una variedad de servicios para que mejores tu estilo de vida.
              </Typography>
            </div>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <img 
                src="https://content.jdmagicbox.com/v2/comp/mumbai/f2/022pxx22.xx22.160617160831.x9f2/catalogue/el-gymnasio-the-gym-malad-west-mumbai-gyms-1gnzb7ykzt.jpg" 
                alt="Imagen 2" 
                style={{ width: '100%', height: '270px', objectFit: 'cover', borderRadius: 8 }} 
              />
              <Typography variant="h6" sx={{ position: 'absolute', bottom: 16, left: 16, color: 'white' }}>
                Encuentra los entrenadores y implementos para tu cambio físico.
              </Typography>
            </div>
            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <img 
                src="https://media-cdn.tripadvisor.com/media/photo-m/1280/1c/3a/88/28/gymnasio-time.jpg" 
                alt="Imagen 3" 
                style={{ width: '100%', height: '270px', objectFit: 'cover', borderRadius: 8 }} 
              />
              <Typography variant="h6" sx={{ position: 'absolute', bottom: 16, left: 16, color: 'white' }}>
                Ofrecemos nuestro servicio en las mañanas, tardes y noches. ¿Qué esperas?
              </Typography>
            </div>
          </Slider>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
