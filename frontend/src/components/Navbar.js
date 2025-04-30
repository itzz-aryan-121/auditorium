import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Event as EventIcon,
  Menu as MenuIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  if (!user) return null;

  return (
    <AppBar position="static" color="primary" elevation={0} sx={{ borderRadius: 0 }}>
      <Toolbar sx={{ minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <EventIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              letterSpacing: '0.5px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            Auditorium Booking
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>
                Auditoriums
              </MenuItem>
              <MenuItem onClick={() => { navigate('/my-bookings'); handleMenuClose(); }}>
                My Bookings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ fontWeight: 500 }}
            >
              Auditoriums
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/my-bookings')}
              sx={{ fontWeight: 500 }}
            >
              My Bookings
            </Button>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{ ml: 1 }}
              title="Logout"
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 