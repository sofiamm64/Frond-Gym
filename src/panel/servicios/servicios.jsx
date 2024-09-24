import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Servicio = () => {
  const [ServicioID, setServicioID] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipo, setTipo] = useState('Servicio');
  const [cantidad, setCantidad] = useState('');
  const [estado, setEstado] = useState('activo');
  const [servicios, setServicios] = useState([]);
  const [filteredServicios, setFilteredServicios] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServicioID, setCurrentServicioID] = useState(null);

  const token = localStorage.getItem('token');

  const fetchServicios = async () => {
    try {
      const response = await axios.get('https://a-1-bym0.onrender.com/servicios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicios(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  // Search filter
  useEffect(() => {
    filterServicios();
  }, [search, servicios]);

  const filterServicios = () => {
    setFilteredServicios(
      servicios.filter((servicio) =>
        servicio.Nombre.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'https://a-1-bym0.onrender.com/servicios',
        {
          ServicioID,
          Nombre: nombre,
          Descripcion: descripcion,
          Precio: precio,
          Tipo: tipo,
          Cantidad: cantidad,
          Estado: estado,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServicios([...servicios, response.data]);
      toast.success('Servicio agregado con éxito!');
      clearInputs();
    } catch (error) {
      handleError(error);
    }
    window.location.reload();
  };
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `https://a-1-bym0.onrender.com/servicios/${currentServicioID}`,
        {
          ServicioID,
          Nombre: nombre,
          Descripcion: descripcion,
          Precio: precio,
          Tipo: tipo,
          Cantidad: cantidad,
          Estado: estado,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServicios((prev) =>
        prev.map((servicio) =>
          servicio.ServicioID === currentServicioID ? response.data : servicio
        )
      );
      toast.success('Servicio actualizado con éxito!');
      clearInputs();
      setIsEditing(false);
    } catch (error) {
      handleError(error);
    }
    window.location.reload();
  };

  const handleDelete = async (ServicioID) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este Servicio?')) {      
      try {
      await axios.delete(`https://a-1-bym0.onrender.com/servicios/${ServicioID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicios((prev) => prev.filter((servicio) => servicio.ServicioID !== ServicioID));
      toast.success('Servicio eliminado con éxito!');
    } catch (error) {
      handleError(error);
    }
    window.location.reload();
  }};

  const handleEstadoChange = async (ServicioID, newEstado) => {
    try {
      const response = await axios.put(
        `https://a-1-bym0.onrender.com/servicios/${ServicioID}`,
        { Estado: newEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServicios((prev) =>
        prev.map((servicio) =>
          servicio.ServicioID === ServicioID ? response.data : servicio
        )
      );
      toast.success('Estado actualizado con éxito!');
    } catch (error) {
      handleError(error);
    }
  };

  const clearInputs = () => {
    setServicioID('');
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setTipo('Servicio');
    setCantidad('');
    setEstado('activo');
  };

  const handleError = (error) => {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Error de red, intenta de nuevo más tarde.');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (servicio) => {
    setServicioID(servicio.ServicioID);
    setNombre(servicio.Nombre);
    setDescripcion(servicio.Descripcion);
    setPrecio(servicio.Precio);
    setTipo(servicio.Tipo);
    setCantidad(servicio.Cantidad);
    setEstado(servicio.Estado);
    setIsEditing(true);
    setCurrentServicioID(servicio.ServicioID);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {isEditing ? 'Actualizar Servicio' : 'Agregar Servicios'}
      </Typography>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <form onSubmit={isEditing ? handleUpdateSubmit : handleAddSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Servicio ID"
                type="number"
                value={ServicioID}
                onChange={(e) => setServicioID(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                label="Tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                fullWidth
                required
              >
                <MenuItem value="Producto">Producto</MenuItem>
                <MenuItem value="Servicio">Servicio</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                label="Estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                fullWidth
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" sx={{
                padding: 1.5,
                backgroundColor: '#3dbd2b',
                '&:hover': {
                  backgroundColor: '#184212',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}>
                {isEditing ? 'Actualizar Servicio' : 'Agregar Servicio'}
              </Button>
              {isEditing && (
              <Button variant="outlined" onClick={clearInputs} sx={{
                padding: 1.5,
                float: 'right',
                '&:hover': {
                  backgroundColor: '#7be36b',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}>
                Cancelar
              </Button>
            )}
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>
        Listado de Servicios
      </Typography>
      <TextField
        label="Buscar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServicios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((servicio) => (
              <TableRow key={servicio.ServicioID}>
                <TableCell>{servicio.ServicioID}</TableCell>
                <TableCell>{servicio.Nombre}</TableCell>
                <TableCell>{servicio.Descripcion}</TableCell>
                <TableCell>{servicio.Precio}</TableCell>
                <TableCell>{servicio.Tipo}</TableCell>
                <TableCell>{servicio.Cantidad}</TableCell>
                <TableCell>
                  <Select
                    value={servicio.Estado}
                    onChange={(e) => handleEstadoChange(servicio.ServicioID, e.target.value)}
                  >
                    <MenuItem value="activo">Activo</MenuItem>
                    <MenuItem value="inactivo">Inactivo</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(servicio)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(servicio.ServicioID)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredServicios.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default Servicio;
