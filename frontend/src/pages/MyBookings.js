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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import {
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  Room as RoomIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
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
        <TableCell>
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 4 }} />
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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
  
  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const getStatusConfig = (booking) => {
    const now = new Date();
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(parseInt(booking.startTime.split(':')[0]), parseInt(booking.startTime.split(':')[1]));
    
    // First check approval status
    if (booking.status === 'pending') {
      return {
        bgcolor: alpha(theme.palette.warning.main, 0.1),
        color: theme.palette.warning.dark,
        label: 'Pending Approval',
        icon: <PendingIcon fontSize="small" />
      };
    } else if (booking.status === 'rejected') {
      return {
        bgcolor: alpha(theme.palette.error.main, 0.1),
        color: theme.palette.error.dark,
        label: 'Rejected',
        icon: <RejectedIcon fontSize="small" />
      };
    } else if (booking.status === 'approved') {
      // For approved bookings, check if they're past or upcoming
      if (bookingDate < now) {
        return {
          bgcolor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.dark,
          label: 'Completed',
          icon: <CheckCircleIcon fontSize="small" />
        };
      } else {
        return {
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.dark,
          label: 'Approved',
          icon: <ApprovedIcon fontSize="small" />
        };
      }
    }
    
    // Fallback (should not reach here with proper data)
    return {
      bgcolor: alpha(theme.palette.grey[500], 0.1),
      color: theme.palette.grey[800],
      label: 'Unknown',
      icon: <InfoIcon fontSize="small" />
    };
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
                    <TableCell>Status</TableCell>
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
                      const statusConfig = getStatusConfig(booking);
                      return (
                        <TableRow 
                          key={booking._id}
                          hover
                          onClick={() => handleOpenDetails(booking)}
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
                              icon={statusConfig.icon}
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

      {/* Booking Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedBooking && (
          <>
            <DialogTitle sx={{ 
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <EventIcon color="primary" />
              <Typography variant="h6" component="span">
                Booking Details
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip 
                  icon={getStatusConfig(selectedBooking).icon}
                  label={getStatusConfig(selectedBooking).label}
                  sx={{ 
                    bgcolor: getStatusConfig(selectedBooking).bgcolor,
                    color: getStatusConfig(selectedBooking).color,
                    fontWeight: 500
                  }}
                />
                
                {selectedBooking.status === 'rejected' && selectedBooking.adminComment && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="error" gutterBottom>
                      Rejection Reason:
                    </Typography>
                    <Typography variant="body2">
                      {selectedBooking.adminComment}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Auditorium
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedBooking.auditoriumId.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {selectedBooking.auditoriumId.location}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {format(new Date(selectedBooking.date), 'MMMM d, yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Time
                  </Typography>
                  <Typography variant="body1">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Event Description
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2">
                    {selectedBooking.description || "No description provided"}
                  </Typography>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MyBookings; 