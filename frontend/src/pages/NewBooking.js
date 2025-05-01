import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Card,
  useTheme,
  alpha,
  Fade,
  Grow,
  Divider,
  Chip,
  Grid,
  Backdrop,
  FormHelperText
} from '@mui/material';
import {
  EventAvailable as EventIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bookings } from '../services/api';
import { format, parseISO } from 'date-fns';

const NewBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate description
    if (!description.trim()) {
      setDescriptionError('Please provide a description for your booking request');
      return;
    } else if (description.length < 10) {
      setDescriptionError('Description should be at least 10 characters long');
      return;
    } else {
      setDescriptionError('');
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await bookings.create({
        auditoriumId: state.auditoriumId,
        date: state.date,
        startTime: state.startTime,
        endTime: state.endTime,
        description
      });

      if (response.data) {
        setSuccess('Booking request submitted successfully! Admin will review your request.');
        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!state) {
    return null;
  }

  const formattedDate = format(parseISO(state.date), 'EEEE, MMMM d, yyyy');

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <Fade in timeout={600}>
        <Card elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.05), 
            py: 3,
            px: 4,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EventIcon sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }} />
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Confirm Booking
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Please provide details and confirm your auditorium booking request
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {error && (
              <Grow in timeout={500}>
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  action={
                    <Button color="inherit" size="small" onClick={() => setError('')}>
                      Dismiss
                    </Button>
                  }
                >
                  {error}
                </Alert>
              </Grow>
            )}

            {success && (
              <Grow in timeout={500}>
                <Alert 
                  severity="success" 
                  sx={{ mb: 3 }}
                  icon={<CheckIcon fontSize="inherit" />}
                >
                  {success}
                </Alert>
              </Grow>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Booking Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <CalendarIcon sx={{ mr: 2, color: theme.palette.primary.main, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Date
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formattedDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <TimeIcon sx={{ mr: 2, color: theme.palette.primary.main, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Time Slot
                        </Typography>
                        <Chip 
                          label={`${state.startTime} - ${state.endTime}`} 
                          sx={{ 
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.dark,
                            fontWeight: 500,
                            px: 1
                          }} 
                        />
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <DescriptionIcon sx={{ mr: 2, color: theme.palette.primary.main, mt: 0.5 }} />
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Event Description
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          placeholder="Describe your event purpose, expected attendees, and any special requirements..."
                          variant="outlined"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          error={!!descriptionError}
                          disabled={loading}
                          sx={{ 
                            bgcolor: 'background.paper',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                        {descriptionError && (
                          <FormHelperText error>{descriptionError}</FormHelperText>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Your booking request will be reviewed by an administrator. Please provide a clear description.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  startIcon={<CloseIcon />}
                  sx={{ px: 3 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? null : <CheckIcon />}
                  sx={{ 
                    px: 3,
                    position: 'relative'
                  }}
                >
                  {loading ? 'Processing...' : 'Submit Request'}
                  {loading && (
                    <CircularProgress 
                      size={24} 
                      sx={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      </Fade>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      />
    </Container>
  );
};

export default NewBooking; 