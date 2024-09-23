import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    mensaje: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.nombre) tempErrors.nombre = 'El nombre es requerido';
    if (!formData.telefono) tempErrors.telefono = 'El teléfono es requerido';
    if (!validateEmail(formData.email)) tempErrors.email = 'El email no es válido';
    if (!formData.mensaje) tempErrors.mensaje = 'El mensaje es requerido';
    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { nombre, email, telefono, mensaje } = formData;

    emailjs.send('service_ssbgyns', 'template_byjeas6', {
      nombre,
      email,
      telefono,
      mensaje,
    }, 'Q6JO9eQWzQEZxDh7B')
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Enviado!',
          text: 'Tu mensaje ha sido enviado correctamente.',
        });
        
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          mensaje: '',
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Hubo un problema al enviar el mensaje: ${error.message}`,
        });
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contáctenos
        </Typography>
        <Typography variant="body1" gutterBottom>
          Complete el siguiente formulario para agendar su cita.
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          helperText={errors.nombre}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Permite solo números
          }}
          error={!!errors.telefono}
          helperText={errors.telefono}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mensaje"
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          error={!!errors.mensaje}
          helperText={errors.mensaje}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ backgroundColor: 'green', color: 'white' }} 
            type="submit"
          >
            Enviar
          </Button>
        </Box>
      </form>
    </Container>
  );
}
