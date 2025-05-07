import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Divider,
  Fade,
  Container,
  ListItemIcon,
  alpha,
  Tooltip,
  Badge,
  Slide
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Event as EventIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const { mode, toggleTheme } = useThemeMode();
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
    handleUserMenuClose();
  };

  // Generate initials for avatar
  const getInitials = () => {
    if (!user || !user.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  // Check if a path is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  if (!user && !['/login', '/register'].includes(location.pathname)) return null;

  return (
    <Slide appear={false} direction="down" in={!scrolled}>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={scrolled ? 3 : 0} 
        sx={{ 
          borderRadius: 0,
          backdropFilter: 'blur(10px)',
          backgroundColor: scrolled ? 
            alpha(theme.palette.background.paper, 0.95) : 
            alpha(theme.palette.background.paper, 0.8),
          transition: 'all 0.3s ease',
          borderBottom: `1px solid ${alpha(theme.palette.divider, scrolled ? 0.1 : 0)}`
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: { xs: 64, md: 70 }, px: { xs: 1, md: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <IconButton 
                color="primary" 
                sx={{ 
                  mr: 1, 
                  p: 1, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  transition: 'transform 0.3s',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    transform: 'rotate(10deg)'
                  }
                }}
                onClick={() => navigate('/')}
              >
                <EventIcon sx={{ fontSize: 24 }} />
              </IconButton>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transition: 'opacity 0.3s',
                  '&:hover': {
                    opacity: 0.85
                  }
                }}
                onClick={() => navigate('/')}
              >
                AudiBook
              </Typography>
            </Box>

            {!user ? (
              // Login/Register navigation
              <Box sx={{ display: 'flex', gap: 2 }}>
                {location.pathname !== '/login' && (
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderWidth: '1.5px',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderWidth: '1.5px',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Login
                  </Button>
                )}
                {location.pathname !== '/register' && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/register')}
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    Register
                  </Button>
                )}
              </Box>
            ) : isMobile ? (
              // Mobile menu
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {user && (
                    <Tooltip title="Notifications">
                      <IconButton 
                        color="inherit" 
                        onClick={handleNotificationOpen}
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        <Badge color="error" variant="dot" invisible={true}>
                          <NotificationsIcon fontSize="small" />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  )}
                
                  <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                    sx={{ 
                      ml: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 240,
                      borderRadius: 3,
                      boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => { navigate('/'); handleMenuClose(); }}
                    sx={{ 
                      py: 1.5,
                      color: isActive('/') ? theme.palette.primary.main : 'inherit',
                      fontWeight: isActive('/') ? 600 : 400,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <DashboardIcon color={isActive('/') ? "primary" : "inherit"} fontSize="small" />
                    </ListItemIcon>
                    Auditoriums
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { navigate('/my-bookings'); handleMenuClose(); }}
                    sx={{ 
                      py: 1.5,
                      color: isActive('/my-bookings') ? theme.palette.primary.main : 'inherit',
                      fontWeight: isActive('/my-bookings') ? 600 : 400,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <CalendarIcon color={isActive('/my-bookings') ? "primary" : "inherit"} fontSize="small" />
                    </ListItemIcon>
                    My Bookings
                  </MenuItem>
                  {user && user.isAdmin && (
                    <MenuItem 
                      onClick={() => { navigate('/auditoriums/add'); handleMenuClose(); }}
                      sx={{ 
                        py: 1.5,
                        color: isActive('/auditoriums/add') ? theme.palette.primary.main : 'inherit',
                        fontWeight: isActive('/auditoriums/add') ? 600 : 400,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <AddIcon color={isActive('/auditoriums/add') ? "primary" : "inherit"} fontSize="small" />
                      </ListItemIcon>
                      Add Auditorium
                    </MenuItem>
                  )}
                  {user && user.isAdmin && (
                    <MenuItem 
                      onClick={() => { navigate('/admin/bookings'); handleMenuClose(); }}
                      sx={{ 
                        py: 1.5,
                        color: isActive('/admin/bookings') ? theme.palette.primary.main : 'inherit',
                        fontWeight: isActive('/admin/bookings') ? 600 : 400,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <AdminIcon color={isActive('/admin/bookings') ? "primary" : "inherit"} fontSize="small" />
                      </ListItemIcon>
                      Admin Panel
                    </MenuItem>
                  )}
                  {user && user.isAdmin && (
                    <MenuItem 
                      onClick={() => { navigate('/admin/dashboard'); handleMenuClose(); }}
                      sx={{ 
                        py: 1.5,
                        color: isActive('/admin/dashboard') ? theme.palette.primary.main : 'inherit',
                        fontWeight: isActive('/admin/dashboard') ? 600 : 400,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <ListItemIcon>
                        <DashboardIcon color={isActive('/admin/dashboard') ? 'primary' : 'inherit'} fontSize="small" />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={toggleTheme} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                    </ListItemIcon>
                    {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  
                  {/* User info section */}
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                      Signed in as
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user?.name || "User"}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {user?.email || ""}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  
                  {user && (
                    <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }} sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                  )}
                  <MenuItem 
                    onClick={handleLogout} 
                    sx={{ 
                      py: 1.5, 
                      color: theme.palette.error.main,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.05)
                      }
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon sx={{ color: theme.palette.error.main }} fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) :
              // Desktop menu
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate('/')}
                  sx={{ 
                    fontWeight: isActive('/') ? 600 : 500,
                    color: isActive('/') ? theme.palette.primary.main : 'inherit',
                    backgroundColor: isActive('/') ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': { 
                      backgroundColor: isActive('/') ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s',
                    borderRadius: 2
                  }}
                  startIcon={<DashboardIcon />}
                >
                  Auditoriums
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/my-bookings')}
                  sx={{ 
                    fontWeight: isActive('/my-bookings') ? 600 : 500,
                    color: isActive('/my-bookings') ? theme.palette.primary.main : 'inherit',
                    backgroundColor: isActive('/my-bookings') ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    '&:hover': { 
                      backgroundColor: isActive('/my-bookings') ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s',
                    borderRadius: 2
                  }}
                  startIcon={<CalendarIcon />}
                >
                  My Bookings
                </Button>
                
                {user && user.isAdmin && (
                  <Button
                    color="inherit"
                    onClick={() => navigate('/auditoriums/add')}
                    sx={{ 
                      fontWeight: isActive('/auditoriums/add') ? 600 : 500,
                      color: isActive('/auditoriums/add') ? theme.palette.primary.main : 'inherit',
                      backgroundColor: isActive('/auditoriums/add') ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      '&:hover': { 
                        backgroundColor: isActive('/auditoriums/add') ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s',
                      borderRadius: 2
                    }}
                    startIcon={<AddIcon />}
                  >
                    Add New
                  </Button>
                )}
                
                {user && user.isAdmin && (
                  <Button
                    color="inherit"
                    onClick={() => navigate('/admin/bookings')}
                    sx={{ 
                      fontWeight: isActive('/admin/bookings') ? 600 : 500,
                      color: isActive('/admin/bookings') ? theme.palette.primary.main : 'inherit',
                      backgroundColor: isActive('/admin/bookings') ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      '&:hover': { 
                        backgroundColor: isActive('/admin/bookings') ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s',
                      borderRadius: 2
                    }}
                    startIcon={<AdminIcon />}
                  >
                    Admin
                  </Button>
                )}
                
                {user && user.isAdmin && (
                  <Button
                    color="inherit"
                    onClick={() => navigate('/admin/dashboard')}
                    sx={{ 
                      fontWeight: isActive('/admin/dashboard') ? 600 : 500,
                      color: isActive('/admin/dashboard') ? theme.palette.primary.main : 'inherit',
                      backgroundColor: isActive('/admin/dashboard') ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      '&:hover': { 
                        backgroundColor: isActive('/admin/dashboard') ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s',
                      borderRadius: 2
                    }}
                    startIcon={<DashboardIcon />}
                  >
                    Dashboard
                  </Button>
                )}
                
                <Box sx={{ ml: 1 }}>
                  <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
                    {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                  
                  <Tooltip title="Notifications">
                    <IconButton 
                      onClick={handleNotificationOpen}
                      sx={{ 
                        mr: 2, 
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      <Badge color="error" variant="dot" invisible={true}>
                        <NotificationsIcon fontSize="small" />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  
                  <Menu
                    anchorEl={notificationAnchor}
                    open={Boolean(notificationAnchor)}
                    onClose={handleNotificationClose}
                    TransitionComponent={Fade}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 320,
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Notifications
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography color="text.secondary">
                        No new notifications
                      </Typography>
                    </Box>
                  </Menu>
                  
                  <Tooltip title={`Signed in as ${user?.name || 'User'}`}>
                    <IconButton
                      onClick={handleUserMenuOpen}
                      sx={{ 
                        border: `2px solid ${theme.palette.primary.main}`,
                        p: 0.5,
                        transition: 'all 0.3s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: theme.palette.primary.main,
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        {getInitials()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 220,
                      borderRadius: 3,
                      boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                      Signed in as
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user?.name || "User"}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {user?.email || ""}
                    </Typography>
                  </Box>
                  <Divider />
                  {user && (
                    <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      Profile
                    </MenuItem>
                  )}
                  <MenuItem 
                    onClick={handleLogout} 
                    sx={{ 
                      py: 1.5, 
                      color: theme.palette.error.main,
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.05)
                      }
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon sx={{ color: theme.palette.error.main }} fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
}
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  )};




export default Navbar;