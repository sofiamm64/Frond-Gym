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

const Clientes = () => {
    const [clienteID, setClienteID] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClienteID, setCurrentClienteID] = useState(null);

    const token = localStorage.getItem('token');

    const fetchClientes = async () => {
        try {
            const response = await axios.get('https://a-1-bym0.onrender.com/clientes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClientes(response.data);
            setFilteredClientes(response.data);
        } catch (error) {
            toast.error('Error al obtener la lista de clientes.');
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    useEffect(() => {
        filterClientes();
    }, [search, clientes]);

    const filterClientes = () => {
        if (!search) {
            setFilteredClientes(clientes);
        } else {
            setFilteredClientes(
                clientes.filter((cliente) =>
                    Object.values(cliente).some((val) =>
                        val.toString().toLowerCase().includes(search.toLowerCase())
                    )
                )
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = isEditing
            ? `https://a-1-bym0.onrender.com/clientes/${currentClienteID}`
            : 'https://a-1-bym0.onrender.com/clientes';
        const method = isEditing ? 'put' : 'post';

        try {
            const response = await axios({
                method,
                url,
                data: { clienteID, nombre, apellido, email, telefono },
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(`${isEditing ? 'Cliente actualizado' : 'Cliente agregado'} con éxito!`);
            setClientes((prev) =>
                isEditing
                    ? prev.map((cli) => (cli.clienteID === currentClienteID ? response.data : cli))
                    : [...prev, response.data]
            );
            clearInputs();
            window.location.reload();
        } catch (error) {
            handleError(error);
        }
    };

    const handleEdit = (cliente) => {
        setClienteID(cliente.clienteID);
        setNombre(cliente.nombre);
        setApellido(cliente.apellido);
        setEmail(cliente.email);
        setTelefono(cliente.telefono);
        setIsEditing(true);
        setCurrentClienteID(cliente.clienteID);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                await axios.delete(`https://a-1-bym0.onrender.com/clientes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Cliente eliminado con éxito!');
                setClientes((prev) => prev.filter(cliente => cliente.clienteID !== id));
            } catch (error) {
                handleError(error);
            }
        }
    };

    const handleError = (error) => {
        if (error.response) {
            toast.error(`Error: ${error.response.data.error || error.response.data.mensaje}`);
        } else {
            toast.error('Error de red.');
        }
    };

    const clearInputs = () => {
        setClienteID('');
        setNombre('');
        setApellido('');
        setEmail('');
        setTelefono('');
        setIsEditing(false);
        setCurrentClienteID(null);
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
                {isEditing ? 'Actualizar Cliente' : 'Agregar Cliente'}
            </Typography>
            <Paper elevation={3} style={{ padding: '16px' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="ID Cliente"
                                value={clienteID}
                                onChange={(e) => setClienteID(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                required
                                type="email"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Teléfono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                fullWidth
                                required
                                type="tel"
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                        {isEditing ? 'Actualizar Cliente' : 'Agregar Cliente'}
                    </Button>
                </form>
            </Paper>

            <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                Clientes Agregados
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
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredClientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cliente) => (
                            <TableRow key={cliente.clienteID}>
                                <TableCell>{cliente.clienteID}</TableCell>
                                <TableCell>{cliente.nombre}</TableCell>
                                <TableCell>{cliente.apellido}</TableCell>
                                <TableCell>{cliente.email}</TableCell>
                                <TableCell>{cliente.telefono}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(cliente)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(cliente.clienteID)}>
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
                count={filteredClientes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    );
};

export default Clientes;
