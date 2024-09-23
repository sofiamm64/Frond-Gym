import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ServicioContext = createContext();

export const ServicioProvider = ({ children }) => {
  const [servicios, setServicios] = useState([]);

  const fetchServicios = async () => {
    const token = localStorage.getItem('token'); 
  
    try {
      const response = await axios.get('https://a-1-bym0.onrender.com/servicios', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setServicios(response.data);
    } catch (error) {
      toast.error('Error al obtener la lista de servicios: ' + error.message);
    }
  };
  

  useEffect(() => {
    fetchServicios();
  }, []);

  return (
    <ServicioContext.Provider value={{ servicios }}>
      {children}
    </ServicioContext.Provider>
  );
};

export const useS = () => {
  return useContext(ServicioContext);
};
