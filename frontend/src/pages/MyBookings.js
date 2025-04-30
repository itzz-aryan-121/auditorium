import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bookings } from '../services/api';
import { format } from 'date-fns';

const MyBookings = () => {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await bookings.getMyBookings();
      setBookingsList(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Bookings
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : bookingsList.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ my: 4 }}>
              You have no bookings yet.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Auditorium</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time Slot</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingsList.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.auditoriumId.name}</TableCell>
                      <TableCell>
                        {format(new Date(booking.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {booking.startTime} - {booking.endTime}
                      </TableCell>
                      <TableCell>{booking.auditoriumId.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default MyBookings; 