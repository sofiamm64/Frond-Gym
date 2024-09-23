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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Proveedor = () => {
  const [proveedorID, setProveedorID] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState(''); 
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProveedorID, setCurrentProveedorID] = useState(null);

  const token = localStorage.getItem('token');

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('https://a-1-bym0.onrender.com/proveedor', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProveedores(response.data);
      setFilteredProveedores(response.data);
    } catch (error) {
      toast.error('Error al obtener los proveedores.');
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  useEffect(() => {
    filterProveedores();
  }, [search, proveedores]);

  const filterProveedores = () => {
    if (!search) {
      setFilteredProveedores(proveedores);
    } else {
      setFilteredProveedores(
        proveedores.filter((proveedor) =>
          Object.values(proveedor).some((val) =>
            val.toString().toLowerCase().includes(search.toLowerCase())
          )
        )
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isEditing
      ? `https://a-1-bym0.onrender.com/proveedor/${currentProveedorID}`
      : 'https://a-1-bym0.onrender.com/proveedor';
    const method = isEditing ? 'put' : 'post';

    try {
      const response = await axios({
        method,
        url,
        data: { ProveedorID: proveedorID, nombre, apellido, email, telefono, Direccion: direccion },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`${isEditing ? 'Proveedor actualizado' : 'Proveedor agregado'} con éxito!`);
      setProveedores((prev) =>
        isEditing
          ? prev.map((prov) => (prov.ProveedorID === currentProveedorID ? response.data : prov))
          : [...prev, response.data]
      );
      clearInputs();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error de red.');
    }
  };

  const handleEdit = (proveedor) => {
    setProveedorID(proveedor.ProveedorID);
    setNombre(proveedor.nombre);
    setApellido(proveedor.apellido);
    setEmail(proveedor.email);
    setTelefono(proveedor.telefono);
    setDireccion(proveedor.Direccion); 
    setIsEditing(true);
    setCurrentProveedorID(proveedor.ProveedorID);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        await axios.delete(`https://a-1-bym0.onrender.com/proveedor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Proveedor eliminado con éxito!');
        setProveedores(proveedores.filter((prov) => prov.ProveedorID !== id));
      } catch (error) {
        toast.error(error.response?.data?.mensaje || 'Error de red.');
      }
    }
  };

  const clearInputs = () => {
    setProveedorID('');
    setNombre('');
    setApellido('');
    setEmail('');
    setTelefono('');
    setDireccion(''); 
    setIsEditing(false);
    setCurrentProveedorID(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {isEditing ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
      </Typography>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="ID"
                value={proveedorID}
                onChange={(e) => setProveedorID(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
            {isEditing ? 'Actualizar Proveedor' : 'Agregar Proveedor'}
          </Button>
        </form>
      </Paper>
      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
        Proveedores Agregados
      </Typography>
      <TextField
        label="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        style={{ marginBottom: '16px' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProveedores.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((proveedor) => (
              <TableRow key={proveedor.ProveedorID}>
                <TableCell>{proveedor.ProveedorID}</TableCell>
                <TableCell>{proveedor.nombre}</TableCell>
                <TableCell>{proveedor.apellido}</TableCell>
                <TableCell>{proveedor.email}</TableCell>
                <TableCell>{proveedor.telefono}</TableCell>
                <TableCell>{proveedor.Direccion}</TableCell> {/* Mostrar dirección */}
                <TableCell>
                  <IconButton onClick={() => handleEdit(proveedor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(proveedor.ProveedorID)}>
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
        count={filteredProveedores.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default Proveedor;
