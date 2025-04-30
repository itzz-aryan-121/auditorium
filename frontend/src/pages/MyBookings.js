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
  CircularProgress,
  Fade,
  Chip,
  IconButton,
  Divider,
  Skeleton,
  useTheme,
  alpha,
  Card,
  Tooltip,
  Button,
  TablePagination
} from '@mui/material';
import {
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Room as RoomIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bookings } from '../services/api';
import { format } from 'date-fns';

const BookingSkeleton = () => (
  <>
    {[1, 2, 3].map((item) => (
      <TableRow key={`skeleton-${item}`}>
        <TableCell>
          <Skeleton variant="text" width="80%" height={24} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="60%" height={24} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="50%" height={24} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="70%" height={24} />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const MyBookings = () => {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const theme = useTheme();

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
      // Add a small delay to make the loading feel more natural
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  const handleRefresh = () => {
    fetchBookings();
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (date, startTime) => {
    const now = new Date();
    const bookingDate = new Date(date);
    bookingDate.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]));
    
    if (bookingDate < now) {
      return {
        bgcolor: alpha(theme.palette.success.main, 0.1),
        color: theme.palette.success.dark,
        label: 'Completed'
      };
    } else {
      return {
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.dark,
        label: 'Upcoming'
      };
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Card elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box>
            <Fade in timeout={800}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CalendarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                My Bookings
              </Typography>
            </Fade>
            <Typography variant="body2" color="text.secondary">
              View and manage all your auditorium bookings
            </Typography>
          </Box>
          
          <Tooltip title="Refresh bookings">
            <IconButton
              onClick={handleRefresh}
              color="primary"
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.1) }}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Box>
        )}

        {loading ? (
          <Box sx={{ p: 3 }}>
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
                  <BookingSkeleton />
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : bookingsList.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <EventIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.2), mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Bookings Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't made any auditorium bookings yet.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              startIcon={<EventIcon />}
            >
              View Auditoriums
            </Button>
          </Box>
        ) : (
          <Box>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      Auditorium
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      Time Slot
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingsList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((booking) => {
                      const statusConfig = getStatusColor(booking.date, booking.startTime);
                      return (
                        <TableRow 
                          key={booking._id}
                          hover
                          sx={{ 
                            '&:nth-of-type(even)': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                            transition: 'background-color 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                            }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EventIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} />
                              <Typography variant="body2" fontWeight={500}>
                                {booking.auditoriumId.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarIcon sx={{ mr: 1, color: theme.palette.grey[600], fontSize: 18 }} />
                              {format(new Date(booking.date), 'MMM dd, yyyy')}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={{ mr: 1, color: theme.palette.grey[600], fontSize: 18 }} />
                              {booking.startTime} - {booking.endTime}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <RoomIcon sx={{ mr: 1, color: theme.palette.grey[600], fontSize: 18 }} />
                              {booking.auditoriumId.location}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              size="small"
                              label={statusConfig.label}
                              sx={{ 
                                bgcolor: statusConfig.bgcolor,
                                color: statusConfig.color,
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={bookingsList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}
      </Card>
    </Container>
  );
};

export default MyBookings; 