import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  Fade,
  useTheme,
  alpha,
  Divider,
  Grid,
  CircularProgress,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Place as PlaceIcon,
  Title as TitleIcon,
  People as PeopleIcon,
  Check as CheckIcon,
  ArrowBack as ArrowBackIcon,
  EventSeat as EventSeatIcon
} from '@mui/icons-material';

const AddAuditorium = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:9000/api/auditoriums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add auditorium');
      }

      setSuccess('Auditorium added successfully!');
      setFormData({
        name: '',
        location: '',
        capacity: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Fade in timeout={800}>
        <Box sx={{ mt: 4, mb: 6 }}>
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
              <EventSeatIcon fontSize="large" color="primary" />
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
              Add New Auditorium
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create a new auditorium space for booking
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

              {success && (
                <Alert 
                  severity="success" 
                  sx={{ mb: 3, p: 2 }}
                  icon={<CheckIcon fontSize="inherit" />}
                  onClose={() => setSuccess('')}
                >
                  <Typography fontWeight={500}>{success}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    You can now view this auditorium in the listing page.
                  </Typography>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    borderRadius: 2,
                    mb: 4,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    Auditorium Details
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Auditorium Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        placeholder="Enter auditorium name"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TitleIcon color="primary" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        placeholder="Enter location"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PlaceIcon color="primary" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Capacity"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        placeholder="Enter seating capacity"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PeopleIcon color="primary" fontSize="small" />
                            </InputAdornment>
                          ),
                          endAdornment: formData.capacity && (
                            <InputAdornment position="end">
                              <Chip 
                                label="people" 
                                size="small" 
                                sx={{ 
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                  color: theme.palette.primary.main,
                                  fontSize: '0.75rem'
                                }} 
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                <Divider sx={{ mb: 4 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/')}
                    startIcon={<ArrowBackIcon />}
                    sx={{ px: 3 }}
                  >
                    Back to List
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    startIcon={loading ? null : <AddIcon />}
                    sx={{ 
                      px: 3,
                      position: 'relative',
                      fontWeight: 600
                    }}
                  >
                    {loading ? 'Adding...' : 'Add Auditorium'}
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
                </Box>
              </form>
            </Box>
          </Card>
        </Box>
      </Fade>
    </Container>
  );
};

export default AddAuditorium; 