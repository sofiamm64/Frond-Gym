import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { ServicioProvider } from './pages/ServicioContext.jsx'; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ServicioProvider>
    <Router>
      <App />
    </Router>
  </ServicioProvider>
);
