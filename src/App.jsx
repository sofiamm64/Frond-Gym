import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Clients from './pages/Clients';
import ContactUs from './pages/ContactUs';
import Servicios from './pages/Servicios';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import PrivateRoute from './pages/PrivateRoute';
import Dashboard from './panel/Dashboard';
import Clientes from './panel/clientes/clientes';
import Compras from './panel/compras/compras';
import Ventas from './panel/ventas/ventas';
import Proveedor from './panel/provedor/provedor';
import Servicio from './panel/servicios/servicios';
import DashboardNavbar from './components/DashboarNavbar';
import './App.css';


const App = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {isDashboard ? <DashboardNavbar /> : <Navbar />}
      <Container
        component="main"
        sx={{
          flex: 1,
          p: 2,
        }} 
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard/clientes/*" element={<PrivateRoute><Clientes /></PrivateRoute>} />
          <Route path="/dashboard/compras/*" element={<PrivateRoute><Compras /></PrivateRoute>} />
          <Route path="/dashboard/ventas/*" element={<PrivateRoute><Ventas /></PrivateRoute>} />
          <Route path="/dashboard/Proveedor/*" element={<PrivateRoute><Proveedor /></PrivateRoute>} />
          <Route path="/dashboard/servicio/*" element={<PrivateRoute><Servicio /></PrivateRoute>} />
        </Routes>
      </Container>
      <Footer />
    </Box>
  );
};

export default App;