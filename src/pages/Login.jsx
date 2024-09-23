import { useState, useEffect } from 'react';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grow,
  Collapse,
  Alert,
} from '@mui/material';
import Swal from 'sweetalert2'; // Importa sweetalert2

function Login() {
  const [email, setEmail] = useState('');
  const [contraseña, setcontraseña] = useState('');
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Redirige al usuario si ya hay un token
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login(email, contraseña);
      localStorage.setItem('authToken', token);

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'accediste al panel. :3',
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate('/dashboard'); 
      }, 2000);
    } catch (error) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      setShowError(true);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `datos invalido: ${error.message}`,
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Grow in>
        <Paper elevation={10} sx={{ padding: 4, marginTop: 5.5 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Iniciar sesión
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
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
              label="Contraseña"
              variant="outlined"
              fullWidth
              type="password"
              value={contraseña}
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
              Iniciar sesión
            </Button>
            <Button
              component={Link}
              to="/register"
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
              ¿No tienes cuenta? Regístrate
            </Button>
          </Box>
        </Paper>
      </Grow>
    </Container>
  );
}

export default Login;
