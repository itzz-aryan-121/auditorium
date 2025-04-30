import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
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
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as RegisterIcon,
  EventAvailable as EventIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const result = await register(name, email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to register');
    }

    setLoading(false);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm">
      <Fade in timeout={800}>
        <Box sx={{ mt: { xs: 6, md: 8 }, mb: 4 }}>
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
              Create an Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join AudiBook to book auditoriums with ease
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
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  label="Email Address"
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
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                          onClick={toggleShowConfirmPassword}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                  startIcon={loading ? null : <RegisterIcon />}
                  sx={{ 
                    py: 1.2,
                    position: 'relative',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
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
                  Already have an account?
                </Typography>
                <Button 
                  component={Link} 
                  to="/login" 
                  variant="outlined" 
                  fullWidth
                  sx={{ fontWeight: 500 }}
                >
                  Sign In
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
            By creating an account, you agree to our Terms and Privacy Policy
          </Typography>
        </Box>
      </Fade>
    </Container>
  );
};

export default Register; 