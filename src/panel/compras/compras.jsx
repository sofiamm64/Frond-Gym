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

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(0);
  const [comprasPorPagina, setComprasPorPagina] = useState(5);

  const [compraID, setCompraID] = useState('');
  const [proveedorID, setProveedorID] = useState('');
  const [servicioID, setServicioID] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioU, setPrecioU] = useState('');
  const [total, setTotal] = useState(0);
  const [fechacomp, setFechacomp] = useState(new Date().toISOString().slice(0, 10));
  const [tipo, setTipo] = useState('pendiente');
  const [editando, setEditando] = useState(false);
  const [compraActualId, setCompraActualId] = useState(null);

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
    fetchData('https://a-1-bym0.onrender.com/compras', setCompras, 'Error al obtener la lista de compras.');
    fetchData('https://a-1-bym0.onrender.com/proveedor', setProveedores, 'Error al obtener la lista de proveedores.');
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

  const comprasFiltradas = compras.filter(compra => {
    const proveedor = proveedores.find(prov => prov.ProveedorID === Number(compra.ProveedorID));
    const servicio = servicios.find(serv => serv.ServicioID === Number(compra.ServicioID));
    const proveedorNombre = proveedor ? proveedor.nombre : '';
    const servicioNombre = servicio ? servicio.Nombre : '';
    return (
      proveedorNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
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

  const registrarCompra = async (e) => {
    e.preventDefault();
    if (!proveedorID || !servicioID || !cantidad) return;
  
    try {
      const response = await axios.post(
        'https://a-1-bym0.onrender.com/compras',
        {
          compraID,
          ProveedorID: proveedorID,
          ServicioID: servicioID,
          Cantidad: Number(cantidad),
          PrecioU: Number(precioU),
          Fechacomp: new Date(fechacomp).toISOString(),
          Total: total,
          Tipo: tipo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (tipo === 'completada') {
        await axios.put(
          `https://a-1-bym0.onrender.com/servicios/${servicioID}/cantidad`,
          { cantidad: Number(cantidad) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (tipo === 'cancelado') {
        await axios.put(
          `https://a-1-bym0.onrender.com/servicios/${servicioID}/cantidad`,
          { cantidad: -Number(cantidad) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
  
      setCompras((prevCompras) => [...prevCompras, response.data]);
      toast.success('Compra registrada con éxito!');
    } catch {
      toast.error('Error al registrar la compra.');
    }
  };

  const editarCompra = (compra) => {
    setCompraID(compra.compraID);
    setProveedorID(compra.ProveedorID);
    setServicioID(compra.ServicioID);
    setCantidad(compra.Cantidad.toString());
    setPrecioU(compra.PrecioU.toString());
    setTotal(compra.Total);
    setFechacomp(compra.Fechacomp.slice(0, 10));
    setTipo(compra.Tipo);
    setCompraActualId(compra._id);
    setEditando(true);
  };

  
  const guardarCambiosCompra = async (e) => {
    e.preventDefault();

    if (!proveedorID || !servicioID || !cantidad) {
        toast.error('Por favor, completa todos los campos obligatorios.');
        return;
    }

    try {
        const compraActual = compras.find(compra => compra._id === compraActualId);

        if (!compraActual) {
            toast.error('Compra no encontrada.');
            return;
        }

        const cantidadServicio = Number(compraActual.Cantidad);
        if (compraActual.Tipo === 'completada' && tipo === 'cancelado') {
          await axios.put(
              `https://a-1-bym0.onrender.com/servicios/${compraActual.ServicioID}/cantidadR`,
              { cantidad: cantidadServicio }, 
              { headers: { Authorization: `Bearer ${token}` } }
          );
      } else if (compraActual.Tipo === 'pendiente' && tipo === 'completada') {
          // Cambia de pendiente a completada: debe sumar al stock
          await axios.put(
              `https://a-1-bym0.onrender.com/servicios/${compraActual.ServicioID}/cantidad`,
              { cantidad: cantidadServicio }, 
              { headers: { Authorization: `Bearer ${token}` } }
          );
      } else if (compraActual.Tipo === 'cancelado' && tipo === 'completada') {
          // Cambia de cancelado a completada: debe sumar al stock
          await axios.put(
              `https://a-1-bym0.onrender.com/servicios/${compraActual.ServicioID}/cantidad`,
              { cantidad: cantidadServicio }, 
              { headers: { Authorization: `Bearer ${token}` } }
          );
      } else if (compraActual.Tipo === 'completada' && tipo === 'pendiente') {
          await axios.put(
              `https://a-1-bym0.onrender.com/servicios/${compraActual.ServicioID}/cantidadR`,
              { cantidad: cantidadServicio }, 
              { headers: { Authorization: `Bearer ${token}` } }
          );
      }
      
        const response = await axios.put(
            `https://a-1-bym0.onrender.com/compras/${compraActualId}`,
            {
                ProveedorID: proveedorID,
                ServicioID: servicioID,
                Cantidad: Number(cantidad),
                PrecioU: Number(precioU),
                Fechacomp: new Date(fechacomp).toISOString(),
                Total: total,
                Tipo: tipo,
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setCompras((prevCompras) =>
            prevCompras.map((compra) =>
                compra._id === compraActualId ? response.data : compra
            )
        );

        toast.success('Compra actualizada con éxito!');
    } catch (error) {
        console.error('Error actualizando la compra:', error.response || error);
        toast.error('Error actualizando la compra. Revisa la consola para más detalles.');
    }
};



  

  const eliminarCompra = async (id) => {
    try {
      await axios.delete(`https://a-1-bym0.onrender.com/compras/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompras((prevCompras) => prevCompras.filter(compra => compra._id !== id));
      toast.success('Compra eliminada con éxito!');
    } catch {
      toast.error('Error al eliminar la compra.');
    }
  };

  const indexUltimaCompra = paginaActual * comprasPorPagina + comprasPorPagina;
  const indexPrimeraCompra = indexUltimaCompra - comprasPorPagina;
  const comprasPaginadas = comprasFiltradas.slice(indexPrimeraCompra, indexUltimaCompra);

  const cambiarPagina = (event, nuevoPagina) => {
    if (nuevoPagina > Math.ceil(comprasFiltradas.length / comprasPorPagina) - 1) {
      setPaginaActual(nuevoPagina - 1);
    } else {
      setPaginaActual(nuevoPagina);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
                {editando ? 'Actualizar Compra' : 'Agregar Compra'}
        </Typography>
        <form onSubmit={editando ? guardarCambiosCompra : registrarCompra}>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={3}>
            <Box width="48%">
              <TextField label="ID Compra" value={compraID} onChange={(e) => setCompraID(e.target.value)} margin='normal' fullWidth />
            </Box>
            <Box width="48%">
              <FormControl fullWidth margin='normal'>
                <InputLabel shrink>Proveedor</InputLabel>
                <Select 
                  value={proveedorID} onChange={(e) => setProveedorID(e.target.value)} displayEmpty
                >
                  <MenuItem value="" disabled>Seleccione un proveedor</MenuItem>
                  {proveedores.map((proveedor) => (
                    <MenuItem key={proveedor.ProveedorID} value={proveedor.ProveedorID}>
                      {proveedor.nombre}
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
              <TextField label="Cantidad" type="number" value={cantidad} onChange={handleCantidadChange} margin='normal' fullWidth />
            </Box>
            <Box width="48%">
              <TextField label="Precio Unitario" type="number" value={precioU} onChange={(e) => setPrecioU(e.target.value)} margin='normal' fullWidth disabled />
            </Box>
            <Box width="48%">
              <TextField label="Total" type="number" value={total} margin='normal' fullWidth disabled />
            </Box>
            <Box width="48%">
              <TextField type="date" label="Fecha" value={fechacomp} onChange={(e) => setFechacomp(e.target.value)} margin='normal' fullWidth />
            </Box>
            <Box width="48%">
              <FormControl fullWidth margin='normal'>
                <InputLabel shrink>Tipo</InputLabel>
                <Select 
                  value={tipo} 
                  onChange={(e) => setTipo(e.target.value)} 
                  displayEmpty
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Button variant="contained" color="primary" type="submit">{editando ? 'Guardar Cambios' : 'Registrar Compra'}</Button>
        </form>
      </Paper>
      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                Compras Agregad
      </Typography>
      <Box mt={3}>
        <TextField 
          label="Buscar..." 
          variant="outlined" 
          fullWidth 
          onChange={(e) => setBusqueda(e.target.value)} 
        />
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Proveedor</TableCell>
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
            {comprasPaginadas.map(compra => {
              const proveedor = proveedores.find(prov => prov.ProveedorID === Number(compra.ProveedorID));
              const servicio = servicios.find(serv => serv.ServicioID === Number(compra.ServicioID));

              return (
                <TableRow key={compra._id}>
                  <TableCell>{compra.compraID}</TableCell>
                  <TableCell>{proveedor ? proveedor.nombre : 'Desconocido'}</TableCell>
                  <TableCell>{servicio ? servicio.Nombre : 'Desconocido'}</TableCell>
                  <TableCell>{compra.Cantidad}</TableCell>
                  <TableCell>{compra.PrecioU}</TableCell>
                  <TableCell>{compra.Total}</TableCell>
                  <TableCell>{new Date(compra.Fechacomp).toLocaleDateString()}</TableCell>
                  <TableCell>{compra.Tipo}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => editarCompra(compra)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => eliminarCompra(compra._id)}>
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
        count={comprasFiltradas.length}
        rowsPerPage={comprasPorPagina}
        page={paginaActual}
        onPageChange={cambiarPagina}
        onRowsPerPageChange={(event) => {
          setComprasPorPagina(parseInt(event.target.value, 10));
          setPaginaActual(0);
        }}
      />
    </Box>
  );
};

export default Compras;