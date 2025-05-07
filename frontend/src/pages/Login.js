import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
  Divider,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  EventAvailable as EventIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
// import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        addNotification({ message: 'Login successful!', severity: 'success' });
        navigate('/');
      } else {
        setError(result.message);
        addNotification({ message: result.message || 'Login failed.', severity: 'error' });
      }
    } catch (err) {
      setError('Failed to login');
      addNotification({ message: 'Failed to login', severity: 'error' });
    }

    setLoading(false);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      {/* <Navbar /> */}
      <Fade in timeout={800}>
        <Box sx={{ mt: { xs: 6, md: 10 }, mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box 
              sx={{ 
                display: 'inline-flex',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                p: 2,
                borderRadius: '50%',
                mb: 2
              }}
            >
              <EventIcon fontSize="large" color="primary" />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to AudiBook
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to access your account
            </Typography>
          </Box>
          
          <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleShowPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? null : <LoginIcon />}
                  sx={{ 
                    py: 1.2,
                    position: 'relative',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  {loading && (
                    <CircularProgress 
                      size={24} 
                      sx={{ 
                        position: 'absolute',
                        color: theme.palette.primary.light
                      }}
                    />
                  )}
                </Button>
              </form>
              
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Don't have an account?
                </Typography>
                <Button 
                  component={Link} 
                  to="/register" 
                  variant="outlined" 
                  fullWidth
                  sx={{ fontWeight: 500 }}
                >
                  Create Account
                </Button>
              </Box>
            </Box>
          </Card>
          
          <Typography 
            variant="body2" 
            align="center" 
            color="text.secondary" 
            sx={{ mt: 3 }}
          >
            By signing in, you agree to our Terms and Privacy Policy
          </Typography>
        </Box>
      </Fade>
    </Container>
  );
};

export default Login; 