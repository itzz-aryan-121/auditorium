import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { auditoriums } from '../services/api';
import { format, parseISO } from 'date-fns';

const Availability = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [auditorium, setAuditorium] = useState(null);

  useEffect(() => {
    fetchAvailability();
  }, [id, date]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await auditoriums.getAvailability(id, date);
      setTimeSlots(response.data);
    } catch (err) {
      setError('Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleBookSlot = (slot) => {
    navigate(`/bookings/new`, {
      state: {
        auditoriumId: id,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime
      }
    });
  };

  return (
    <>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <TextField
              type="date"
              label="Select Date"
              value={date}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: format(new Date(), 'yyyy-MM-dd')
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {timeSlots.map((slot, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      bgcolor: slot.isAvailable ? 'success.light' : 'error.light',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h6">
                      {slot.startTime} - {slot.endTime}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {slot.isAvailable ? 'Available' : 'Booked'}
                    </Typography>
                    {slot.isAvailable && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBookSlot(slot)}
                      >
                        Book Now
                      </Button>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Availability; 