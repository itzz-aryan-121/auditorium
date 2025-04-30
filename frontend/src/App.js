import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AddAuditorium from './pages/AddAuditorium';
import NewBooking from './pages/NewBooking';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AuditoriumList from './pages/AuditoriumList';
import Availability from './pages/Availability';
import MyBookings from './pages/MyBookings';

// Create theme
// Enhanced theme with modern UI elements
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.25px',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.25px',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057', // Pink
      light: '#ff5983',
      dark: '#bb002f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.1),0px 1px 1px 0px rgba(0,0,0,0.07),0px 1px 3px 0px rgba(0,0,0,0.06)',
    '0px 3px 3px -2px rgba(0,0,0,0.1),0px 2px 2px 0px rgba(0,0,0,0.07),0px 1px 5px 0px rgba(0,0,0,0.06)',
    '0px 3px 4px -2px rgba(0,0,0,0.1),0px 3px 3px -2px rgba(0,0,0,0.07),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 2px 5px -1px rgba(0,0,0,0.1),0px 4px 6px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.06)',
    '0px 3px 6px -1px rgba(0,0,0,0.1),0px 5px 8px rgba(0,0,0,0.07),0px 1px 14px 0px rgba(0,0,0,0.06)',
    '0px 3px 7px -2px rgba(0,0,0,0.1),0px 6px 10px rgba(0,0,0,0.07),0px 1px 18px 0px rgba(0,0,0,0.06)',
    '0px 4px 8px -2px rgba(0,0,0,0.1),0px 7px 12px 1px rgba(0,0,0,0.07),0px 2px 16px 1px rgba(0,0,0,0.06)',
    '0px 5px 11px -3px rgba(0,0,0,0.1),0px 8px 16px 1px rgba(0,0,0,0.07),0px 3px 16px 2px rgba(0,0,0,0.06)',
    '0px 5px 12px -3px rgba(0,0,0,0.1),0px 9px 18px 1px rgba(0,0,0,0.07),0px 3px 16px 3px rgba(0,0,0,0.06)',
    '0px 6px 13px -4px rgba(0,0,0,0.1),0px 10px 20px 1px rgba(0,0,0,0.07),0px 4px 16px 3px rgba(0,0,0,0.06)',
    '0px 6px 14px -4px rgba(0,0,0,0.1),0px 11px 22px 1px rgba(0,0,0,0.07),0px 4px 18px 3px rgba(0,0,0,0.06)',
    '0px 7px 16px -4px rgba(0,0,0,0.1),0px 12px 25px 2px rgba(0,0,0,0.07),0px 5px 20px 4px rgba(0,0,0,0.06)',
    '0px 7px 17px -4px rgba(0,0,0,0.1),0px 13px 27px 2px rgba(0,0,0,0.07),0px 5px 22px 4px rgba(0,0,0,0.06)',
    '0px 7px 18px -5px rgba(0,0,0,0.1),0px 14px 29px 2px rgba(0,0,0,0.07),0px 5px 24px 4px rgba(0,0,0,0.06)',
    '0px 8px 19px -5px rgba(0,0,0,0.1),0px 15px 30px 2px rgba(0,0,0,0.07),0px 6px 24px 5px rgba(0,0,0,0.06)',
    '0px 8px 20px -5px rgba(0,0,0,0.1),0px 16px 32px 2px rgba(0,0,0,0.07),0px 6px 26px 5px rgba(0,0,0,0.06)',
    '0px 8px 22px -5px rgba(0,0,0,0.1),0px 17px 35px 2px rgba(0,0,0,0.07),0px 6px 28px 5px rgba(0,0,0,0.06)',
    '0px 9px 23px -6px rgba(0,0,0,0.1),0px 18px 37px 2px rgba(0,0,0,0.07),0px 7px 28px 5px rgba(0,0,0,0.06)',
    '0px 9px 25px -6px rgba(0,0,0,0.1),0px 19px 39px 2px rgba(0,0,0,0.07),0px 7px 30px 5px rgba(0,0,0,0.06)',
    '0px 10px 26px -6px rgba(0,0,0,0.1),0px 20px 40px 2px rgba(0,0,0,0.07),0px 8px 32px 5px rgba(0,0,0,0.06)',
    '0px 10px 27px -6px rgba(0,0,0,0.1),0px 21px 43px 2px rgba(0,0,0,0.07),0px 8px 34px 6px rgba(0,0,0,0.06)',
    '0px 10px 30px -6px rgba(0,0,0,0.1),0px 22px 45px 3px rgba(0,0,0,0.07),0px 8px 36px 6px rgba(0,0,0,0.06)',
    '0px 11px 31px -7px rgba(0,0,0,0.1),0px 23px 47px 3px rgba(0,0,0,0.07),0px 9px 38px 6px rgba(0,0,0,0.06)',
    '0px 11px 33px -7px rgba(0,0,0,0.1),0px 24px 49px 3px rgba(0,0,0,0.07),0px 9px 40px 7px rgba(0,0,0,0.06)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 16px',
          transition: 'all 0.2s ease-in-out',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&.Mui-focused': {
              boxShadow: '0px 0px 0px 3px rgba(63, 81, 181, 0.1)',
            },
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
  },
});
// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AuditoriumList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auditoriums/:id/availability"
              element={
                <ProtectedRoute>
                  <Availability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route path="/auditoriums/add" element={<AddAuditorium />} />
            <Route
              path="/bookings/new"
              element={
                <ProtectedRoute>
                  <NewBooking />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
