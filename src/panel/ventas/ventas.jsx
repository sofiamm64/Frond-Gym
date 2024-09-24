import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(0);
  const [ventasPorPagina, setVentasPorPagina] = useState(5);

  const [VentaID, setVentaID] = useState('');
  const [clienteID, setClienteID] = useState('');
  const [servicioID, setServicioID] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioU, setPrecioU] = useState('');
  const [total, setTotal] = useState(0);
  const [fechaVenta, setFechaVenta] = useState(new Date().toISOString().slice(0, 10));
  const [tipo, setTipo] = useState('pendiente');
  const [editando, setEditando] = useState(false);
  const [ventaActualId, setVentaActualId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchData = async (url, setData, errorMessage) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch {
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchData('https://a-1-bym0.onrender.com/ventas', setVentas, 'Error al obtener la lista de ventas.');
    fetchData('https://a-1-bym0.onrender.com/clientes', setClientes, 'Error al obtener la lista de clientes.');
    fetchData('https://a-1-bym0.onrender.com/servicios', setServicios, 'Error al obtener la lista de servicios.');
  }, []);

  const handleServicioChange = (e) => {
    const selectedServicioID = e.target.value;
    setServicioID(selectedServicioID);

    const servicioSeleccionado = servicios.find(servicio => servicio.ServicioID === Number(selectedServicioID));
    if (servicioSeleccionado) {
      setPrecioU(servicioSeleccionado.Precio);
      if (cantidad) {
        setTotal(Number(servicioSeleccionado.Precio) * Number(cantidad));
      }
    } else {
      setPrecioU('');
      setTotal(0);
    }
  };
  const handleClienteChange = (e) => {
    setClienteID(e.target.value);
  };

  const ventasFiltradas = ventas.filter(venta => {
    const cliente = clientes.find(cli => cli.ClienteID === Number(venta.ClienteID));
    const servicio = servicios.find(serv => serv.ServicioID === Number(venta.ServicioID));
    const clienteNombre = cliente ? cliente.nombre : '';
    const servicioNombre = servicio ? servicio.Nombre : '';
    return (
      clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      servicioNombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  const handleCantidadChange = (e) => {
    const newCantidad = e.target.value;
    setCantidad(newCantidad);
    if (precioU) {
      setTotal(Number(precioU) * Number(newCantidad));
    }
  };
  

  const registrarVenta = async (e) => {
    e.preventDefault();
    console.log({ VentaID, clienteID, servicioID, cantidad, precioU, fechaVenta, tipo });
    if (!clienteID || !servicioID || !cantidad || !precioU || !fechaVenta) return;
  
    try {
      const response = await axios.post(
        'https://a-1-bym0.onrender.com/ventas',
        {
          VentaID,
          ClienteID: clienteID,
          ServicioID: servicioID,
          Cantidad: Number(cantidad),
          PrecioU: Number(precioU),
          FechaVenta: new Date(fechaVenta).toISOString(),
          Tipo: tipo || 'pendiente',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVentas(prevVentas => [...prevVentas, response.data]);
      toast.success('Venta registrada con éxito!');
      resetForm();
  
      if (tipo === 'completada') {
        await axios.put(
          `https://a-1-bym0.onrender.com/servicios/${servicioID}/cantidadR`,
          { cantidad: Number(cantidad) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error('Error al crear la venta:', error.message);
      console.error('Error al registrar la venta:', error.response ? error.response.data : error.message);
      toast.error('Error al registrar la venta.');
    }
  };


  const resetForm = () => {
    setVentaID('');
    setClienteID('');
    setServicioID('');
    setCantidad('');
    setPrecioU('');
    setTotal(0);
    setFechaVenta(new Date().toISOString().slice(0, 10));
    setTipo('pendiente');
    setEditando(false);
  };

  const editarVenta = (venta) => {
    setVentaID(venta.VentaID);
    setClienteID(venta.ClienteID);
    setServicioID(venta.ServicioID);
    setCantidad(venta.Cantidad.toString());
    setPrecioU(venta.PrecioU.toString());
    setTotal(venta.Total);
    setFechaVenta(venta.FechaVenta.slice(0, 10));
    setTipo(venta.Tipo);
    setVentaActualId(venta._id);
    setEditando(true);
  };

  const guardarCambiosVenta = async (e) => {
    e.preventDefault();

    if (!clienteID || !servicioID || !cantidad) {
        toast.error('Por favor, completa todos los campos obligatorios.');
        return;
    }

    const cantidadNum = Number(cantidad);
    if (cantidadNum <= 0) {
        toast.error('La cantidad debe ser un número positivo.');
        return;
    }

    try {
        const ventaActual = await axios.get(`https://a-1-bym0.onrender.com/ventas/${ventaActualId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const tipoVentaActual = ventaActual.data.Tipo;


        if (tipoVentaActual === 'completada' && tipo === 'cancelado') {
            await axios.put(
                `https://a-1-bym0.onrender.com/servicios/${servicioID}/cantidad`,
                { cantidad: cantidadNum },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } else if (tipoVentaActual === 'pendiente' && tipo === 'completada') {
            await axios.put(
                `https://a-1-bym0.onrender.com/servicios/${servicioID}/cantidadR`,
                { cantidad: cantidadNum },
                { headers: { Authorization: `Bearer ${token}`} }
            );
        } else if (tipoVentaActual === 'cancelado' && tipo === 'completada') {
            await axios.put(
                `https://a-1-bym0.onrender.com/servicios/${servicioID}/cantidadR`,
                { cantidad: cantidadNum },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } else if (tipoVentaActual === 'completada' && tipo === 'pendiente') {
            await axios.put(
                `https://a-1-bym0.onrender.com/servicios/${servicioID}/cantidad`,
                { cantidad: cantidadNum },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }


        const response = await axios.put(
          `https://a-1-bym0.onrender.com/ventas/${ventaActualId}`,
          {
              VentaID,
              ClienteID: clienteID,
              ServicioID: servicioID,
              Cantidad: cantidadNum,
              PrecioU: Number(precioU),
              FechaVenta: new Date(fechaVenta).toISOString(),
              Total: total,
              Tipo: tipo,
          },
          { headers: { Authorization: `Bearer ${token}` } }
      );


        setVentas(prevVentas => prevVentas.map(venta =>
            venta._id === ventaActualId ? response.data : venta
        ));
        toast.success('Venta actualizada con éxito!');
        resetForm();
    } catch (error) {
        console.error('Error al registrar la venta:', error.response?.data || error.message);
        toast.error('Error al registrar la venta.');
    }
};

  const eliminarVenta = async (VentaID) => {
    try {
      const token = localStorage.getItem('token'); 
      const respuesta = await axios.delete(`https://a-1-bym0.onrender.com/ventas/${VentaID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,  
        },
      });
      console.log("Venta eliminada exitosamente", respuesta.data);
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
    }
  };

  const indexUltimaVenta = paginaActual * ventasPorPagina + ventasPorPagina;
  const indexPrimeraVenta = indexUltimaVenta - ventasPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(indexPrimeraVenta, indexUltimaVenta);

  const cambiarPagina = (event, nuevoPagina) => {
    if (nuevoPagina > Math.ceil(ventasFiltradas.length / ventasPorPagina) - 1) {
      setPaginaActual(nuevoPagina - 1);
    } else {
      setPaginaActual(nuevoPagina);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
                {editando ? 'Actualizar Venta' : 'Agregar Venta'}
        </Typography>
        <form onSubmit={editando ? guardarCambiosVenta : registrarVenta}>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={3}>
            <Box width="48%">
              <TextField label="ID Venta" value={VentaID} onChange={(e) => setVentaID(e.target.value)} margin='normal' fullWidth />
            </Box>
            <Box width="48%">
            <FormControl fullWidth margin='normal'>
        <InputLabel shrink>Cliente</InputLabel>
        <Select 
          value={clienteID} 
          onChange={handleClienteChange} 
          displayEmpty
        >
          <MenuItem value="" disabled>Seleccione un Cliente</MenuItem>
          {clientes.map(cliente => (
            <MenuItem key={cliente._id} value={cliente._id}>
              {cliente.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
            </Box>
          </Box>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={3}>
            <Box width="48%">
              <FormControl fullWidth margin='normal'>
                <InputLabel shrink>Servicio</InputLabel>
                <Select value={servicioID} onChange={handleServicioChange} displayEmpty>
                  <MenuItem value="" disabled>Seleccione un servicio</MenuItem>
                  {servicios.map((servicio) => (
                    <MenuItem key={servicio.ServicioID} value={servicio.ServicioID}>
                      {servicio.Nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box width="48%">
              <TextField label="Cantidad" type="number" value={cantidad} onChange={handleCantidadChange} margin='normal' fullWidth />
            </Box>
          </Box>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={3}>
            <Box width="48%">
              <TextField label="Precio Unitario" value={precioU} onChange={(e)=> setPrecioU(e.target.value)} margin='normal' fullWidth disabled />
            </Box>
            <Box width="48%">
              <TextField label="Total" value={total} margin='normal' fullWidth disabled />
            </Box>
          </Box>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={3}>
            <Box width="48%">
              <TextField label="Fecha de Venta" type="date" value={fechaVenta} onChange={(e) => setFechaVenta(e.target.value)} margin='normal' fullWidth />
            </Box>
            <Box width="48%">
              <FormControl fullWidth margin='normal'>
                <InputLabel shrink>Tipo</InputLabel>
                <Select value={tipo} onChange={(e) => setTipo(e.target.value)} displayEmpty>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                  <MenuItem value="cancelado">cancelado</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button type="submit" variant="contained" sx={{
                padding: 1.5,
                backgroundColor: '#3dbd2b',
                '&:hover': {
                  backgroundColor: '#184212',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}>
              {editando ? 'Actualizar Venta' : 'Registrar Venta'}
            </Button>
            {editando && (
              <Button variant="outlined" onClick={resetForm} sx={{
                padding: 1.5,
                '&:hover': {
                  backgroundColor: '#7be36b',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}>
                Cancelar
              </Button>
            )}
          </Box>
        </form>
      </Paper>
      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                Ventas Agregadas
      </Typography>
      <Paper elevation={3} sx={{ marginTop: 3 }}>
      <Box mt={3}>
        <TextField 
          label="Buscar..." 
          variant="outlined" 
          fullWidth 
          onChange={(e) => setBusqueda(e.target.value)} 
        />
      </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventasPaginadas.map((venta) => {
                const cliente = clientes.find(cli => cli._id === Number(venta.clienteID));
                const servicio = servicios.find(serv => serv.ServicioID === Number(venta.ServicioID));
                return (
                  <TableRow key={venta._id}>
                    <TableCell>{venta.VentaID}</TableCell>
                    <TableCell>{cliente ? cliente.nombre : 'Desconocido'}</TableCell>
                    <TableCell>{servicio ? servicio.Nombre : 'Desconocido'}</TableCell>
                    <TableCell>{venta.Cantidad}</TableCell>
                    <TableCell>{venta.PrecioU}</TableCell>
                    <TableCell>{venta.Total}</TableCell>
                    <TableCell>{venta.FechaVenta.slice(0, 10)}</TableCell>
                    <TableCell>{venta.Tipo}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => editarVenta(venta)} >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => eliminarVenta(venta._id)} >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={ventasFiltradas.length}
          rowsPerPage={ventasPorPagina}
          page={paginaActual}
          onPageChange={cambiarPagina}
          onRowsPerPageChange={(e) => setVentasPorPagina(parseInt(e.target.value, 10))}
        />
      </Paper>
    </Box>
  );
};

export default Ventas;
