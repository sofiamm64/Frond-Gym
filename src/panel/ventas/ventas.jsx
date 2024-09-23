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

  const [ventaID, setVentaID] = useState('');
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
    if (!clienteID || !servicioID || !cantidad) return;

    try {
      const response = await axios.post(
        'https://a-1-bym0.onrender.com/ventas',
        {
          ventaID,
          ClienteID: clienteID,
          ServicioID: servicioID,
          Cantidad: Number(cantidad),
          PrecioU: Number(precioU),
          FechaVenta: new Date(fechaVenta).toISOString(),
          Total: total,
          Tipo: tipo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVentas((prevVentas) => [...prevVentas, response.data]);
      toast.success('Venta registrada con éxito!');
    } catch {
      toast.error('Error al registrar la venta.');
    }
  };

  const editarVenta = (venta) => {
    setVentaID(venta.ventaID);
    setClienteID(venta.ClienteID);
    setServicioID(venta.ServicioID);
    setCantidad(venta.Cantidad.toString());
    setPrecioU(venta.PrecioU.toString());
    setTotal(venta.Total);
    setFechaVenta(venta.FechaVenta.slice(0, 10));
    setTipo(venta.Tipo);
    setVentaActualId(venta.ventaID); 
    setEditando(true);
  };

  const guardarCambiosVenta = async (e) => {
    e.preventDefault();
    if (!clienteID || !servicioID || !cantidad) return;

    try {
      const response = await axios.put(
        `https://a-1-bym0.onrender.com/ventas/${ventaActualId}`, 
        {
          ClienteID: clienteID,
          ServicioID: servicioID,
          Cantidad: Number(cantidad),
          PrecioU: Number(precioU),
          FechaVenta: new Date(fechaVenta).toISOString(),
          Total: total,
          Tipo: tipo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVentas((prevVentas) => prevVentas.map((venta) =>
        venta.ventaID === ventaActualId ? response.data : venta
      ));
      toast.success('Venta actualizada con éxito!');
    } catch (error) {
      toast.error(`Error al actualizar la venta: ${error.response?.data?.message || 'Error desconocido.'}`);
    }
  };

  const eliminarVenta = async (id) => {
    try {
      await axios.delete(`https://a-1-bym0.onrender.com/ventas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVentas((prevVentas) => prevVentas.filter(venta => venta.ventaID !== id)); 
      toast.success('Venta eliminada con éxito!');
    } catch {
      toast.error('Error al eliminar la venta.');
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
        <form onSubmit={editando ? guardarCambiosVenta : registrarVenta}>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={3}>
            <Box width="48%">
              <TextField label="ID Venta" value={ventaID} onChange={(e) => setVentaID(e.target.value)} margin='normal' fullWidth />
            </Box>
            <Box width="48%">
              <FormControl fullWidth margin='normal'>
                <InputLabel shrink>Cliente</InputLabel>
                <Select 
                  value={clienteID} onChange={(e) => setClienteID(e.target.value)} displayEmpty
                >
                  <MenuItem value="" disabled>Seleccione un cliente</MenuItem>
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.ClienteID} value={cliente.ClienteID}>
                      {cliente.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box width="48%">
              <FormControl fullWidth margin='normal'>
                <InputLabel shrink>Servicio</InputLabel>
                <Select 
                  value={servicioID} onChange={handleServicioChange} displayEmpty
                >
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
              <TextField 
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={handleCantidadChange}
                margin='normal'
                fullWidth
              />
            </Box>
            <Box width="48%">
              <TextField 
                label="Precio Unitario"
                type="number"
                value={precioU}
                disabled
                margin='normal'
                fullWidth
              />
            </Box>
            <Box width="48%">
              <TextField 
                label="Total"
                type="number"
                value={total}
                disabled
                margin='normal'
                fullWidth
              />
            </Box>
            <Box width="48%">
              <TextField 
                label="Fecha de Venta"
                type="date"
                value={fechaVenta}
                onChange={(e) => setFechaVenta(e.target.value)}
                margin='normal'
                fullWidth
              />
            </Box>
            <Box width="48%">
              <FormControl fullWidth margin='normal'>
                <InputLabel shrink>Tipo</InputLabel>
                <Select 
                  value={tipo} onChange={(e) => setTipo(e.target.value)} displayEmpty
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Button variant="contained" type="submit">
            {editando ? 'Guardar Cambios' : 'Registrar Venta'}
          </Button>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ marginTop: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>ventaID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Fecha de Venta</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventasPaginadas.map((venta) => {
                const cliente = clientes.find(cli => Number(cli.ClienteID) === venta.ClienteID);
                const servicio = servicios.find(serv => serv.ServicioID === Number(venta.ServicioID));
                return (
                  <TableRow key={venta.ventaID}>
                    <TableCell>{cliente?.ventaID}</TableCell>
                    <TableCell>{cliente?.nombre}</TableCell>
                    <TableCell>{servicio?.Nombre}</TableCell>
                    <TableCell>{venta.Cantidad}</TableCell>
                    <TableCell>{venta.PrecioU}</TableCell>
                    <TableCell>{venta.Total}</TableCell>
                    <TableCell>{new Date(venta.FechaVenta).toLocaleDateString()}</TableCell>
                    <TableCell>{venta.Tipo}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => editarVenta(venta)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => eliminarVenta(venta.ventaID)}>
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
          onRowsPerPageChange={(e) => {
            setVentasPorPagina(parseInt(e.target.value, 10));
            setPaginaActual(0);
          }}
        />
      </Paper>
    </Box>
  );
};

export default Ventas;
