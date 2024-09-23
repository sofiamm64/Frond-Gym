import React from 'react';
import { Typography, Box, Container } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'green', 
        color: 'white',
        p: 2,
        textAlign: 'center',
        boxShadow: 1,
        width: '100%',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2">
          © 2024 website. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
