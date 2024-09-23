import axios from 'axios';

const API_URL = 'https://a-1-bym0.onrender.com';

export const register = async (nombre, email, telefono, contraseña) => {
  const response = await axios.post(`${API_URL}/register`, { nombre, email, telefono, contraseña });
  console.log('Token recibido al registrar:', response.data.token); // Log para depuración
  localStorage.setItem('token', response.data.token);  
  return response.data;
};

export const login = async (email, contraseña) => {
  const response = await axios.post(`${API_URL}/login`, { email, contraseña });
  console.log('Token recibido al iniciar sesión:', response.data.token); // Log para depuración
  localStorage.setItem('token', response.data.token); 
  return response.data;
};



