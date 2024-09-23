import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useHandleLogout } from '../utils/auth'; 

function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const handleLogout = useHandleLogout();

  const toggleDrawer = (open) => () => {
    setOpen(open);
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/panel/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/clientes">
          <ListItemText primary="Clientes" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/compras">
          <ListItemText primary="compras" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/provedor">
          <ListItemText primary="Proveedor" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/servicio">
          <ListItemText primary="Servicios" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard/ventas">
          <ListItemText primary="Ventas" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Cerrar sesión" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'green' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
            FitLife
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button sx={{ color: 'white' }} component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/dashboard/clientes">
              Clientes
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/dashboard/compras">
              Compras
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/dashboard/proveedor">
              Proveedores
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/dashboard/servicio">
              Servicios
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/dashboard/ventas">
              Ventas
            </Button>
            <Button sx={{ color: 'white' }} onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Box>
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' } }}
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default DashboardNavbar;