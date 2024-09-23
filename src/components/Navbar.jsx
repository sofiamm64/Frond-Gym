import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setOpen(open);
  };

  const drawer = (
    <Box sx={{ width: 260 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Inicio" />
        </ListItem>
        <ListItem button component={Link} to="/about-us">
          <ListItemText primary="Sobre Nosotros" />
        </ListItem>
        <ListItem button component={Link} to="/clients">
          <ListItemText primary="Clientes" />
        </ListItem>
        <ListItem button component={Link} to="/contact-us">
          <ListItemText primary="Contáctenos" />
        </ListItem>
        <ListItem button component={Link} to="/Servicios">
          <ListItemText primary="Servicios" />
        </ListItem>
        <ListItem button component={Link} to="/login">
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem button component={Link} to="/register">
          <ListItemText primary="register" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'green', mb: 0 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
          <Typography variant="h4">
            FitLife
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button sx={{ color: 'white' }} component={Link} to="/">
              Inicio
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/about-us">
              Sobre Nosotros
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/clients">
              Clientes
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/contact-us">
              Contáctenos
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/Servicios">
              Servicios
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/login">
              Login
            </Button>
            <Button sx={{ color: 'white' }} component={Link} to="/register">
              register
            </Button>
          </Box>
          <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;