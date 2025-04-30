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
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bookings } from '../services/api';

const NewBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await bookings.create({
        auditoriumId: state.auditoriumId,
        date: state.date,
        startTime: state.startTime,
        endTime: state.endTime
      });

      if (response.data) {
        setSuccess('Booking created successfully!');
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

  return (
    <>
     

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Confirm Booking
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Typography variant="body1" gutterBottom>
              Date: {state.date}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Time Slot: {state.startTime} - {state.endTime}
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default NewBooking; 