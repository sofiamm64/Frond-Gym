import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grow,
  Alert,
  Collapse,
} from '@mui/material';
import Swal from 'sweetalert2'; // Importa sweetalert2

function Register() {
  const [nombre, setName] = useState('');
  const [email, setEmail] = useState('');
  const [Contraseña, setcontraseña] = useState(''); 
  const [telefono, settelefono] = useState('');
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register(nombre, email, telefono, Contraseña);
      const { token } = response;
      localStorage.setItem('authToken', token);

      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente.',
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error al registrar', error.response ? error.response.data : error.message);
      setError('Error al registrar');
      setShowError(true);
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <Grow in>
          <Paper elevation={10} sx={{ padding: 4, marginTop: 0}}>
            <Typography variant="h4" align="center" gutterBottom>
              Registrarse
            </Typography>
            <Box
              component="form"
              onSubmit={handleRegister}
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                value={nombre}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                type="text"
                value={telefono}
                onChange={(e) => settelefono(e.target.value)}
                required
              />
              <TextField
                label="Contraseña"
                variant="outlined"
                fullWidth
                type="password"
                value={Contraseña}
                onChange={(e) => setcontraseña(e.target.value)}
                required
              />
              <Collapse in={showError}>
                <Alert severity="error" onClose={() => setShowError(false)}>
                  {error}
                </Alert>
              </Collapse>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  padding: 1.5,
                  backgroundColor: '#3dbd2b', 
                  '&:hover': {
                    backgroundColor: '#184212',
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
                fullWidth
              >
                Registrar
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  padding: 1.5,
                  marginTop: 2,
                  color: '#184212', 
                  borderColor: '#3dbd2b', 
                  '&:hover': {
                    backgroundColor: '#64d253',
                    borderColor: '#1f6315', 
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
                fullWidth
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Button>
            </Box>
          </Paper>
        </Grow>
      </Container>
    </>
  );
}

export default Register;
