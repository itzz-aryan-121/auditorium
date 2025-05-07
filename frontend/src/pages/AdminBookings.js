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
  Grid,
  Tabs,
  Tab,
  TextField,
  Alert,
  Badge
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
  Person as PersonIcon,
  FilterList as FilterIcon,
  CheckCircleOutline as CheckIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bookings } from '../services/api';
import { format, parseISO } from 'date-fns';
import { useNotifications } from '../context/NotificationContext';

const BookingSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((item) => (
      <TableRow key={`skeleton-${item}`}>
        <TableCell>
          <Skeleton variant="text" width="80%" height={24} />
        </TableCell>
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
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 4 }} />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="circular" width={36} height={36} />
            <Skeleton variant="circular" width={36} height={36} />
          </Box>
        </TableCell>
      </TableRow>
    ))}
  </>
);

const AdminBookings = () => {
  const [bookingsList, setBookingsList] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminComment, setAdminComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Debug logs
    console.log('Current user:', user);
    console.log('Is admin:', user?.isAdmin);
    
    // Check if user is admin
    if (!user || !user.isAdmin) {
      console.warn('Access denied: User is not an admin or not logged in');
      navigate('/');
      return;
    }
    
    console.log('Admin access granted, fetching bookings...');
    fetchBookings();
  }, [user, navigate]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredBookings(bookingsList);
    } else {
      setFilteredBookings(bookingsList.filter(booking => booking.status === statusFilter));
    }
    setPage(0); // Reset to first page when filter changes
  }, [statusFilter, bookingsList]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await bookings.getAllBookings();
      setBookingsList(response.data);
      setFilteredBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings. ' + (err.response?.data?.message || ''));
    } finally {
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
    setAdminComment('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setActionSuccess('');
    setDialogOpen(false);
  };
  
  const handleStatusChange = (event, newValue) => {
    setStatusFilter(newValue);
  };
  
  const handleApprove = async () => {
    console.log('Approving booking:', selectedBooking?._id);
    await updateBookingStatus('approved');
  };
  
  const handleReject = async () => {
    console.log('Rejecting booking:', selectedBooking?._id);
    if (adminComment.trim().length < 10) {
      setError('Please provide a reason for rejection (at least 10 characters)');
      return;
    }
    await updateBookingStatus('rejected');
  };
  
  const updateBookingStatus = async (status) => {
    if (!selectedBooking) {
      setError('No booking selected.');
      return;
    }
    
    // Verify the booking ID is valid
    if (!selectedBooking._id) {
      console.error('Invalid booking ID:', selectedBooking);
      setError('Invalid booking ID.');
      return;
    }
    
    console.log(`Starting ${status} process for booking:`, selectedBooking._id);
    setActionLoading(true);
    setError('');
    setActionSuccess('');
    
    const payload = {
      status,
      adminComment: adminComment.trim()
    };
    
    console.log('Request payload:', payload);
    console.log('API endpoint:', `/bookings/admin/${selectedBooking._id}/status`);
    
    try {
      console.log('Sending update request for booking:', {
        id: selectedBooking._id,
        status,
        adminComment: adminComment.trim()
      });
      
      // Define the complete URL for debugging
      const backendURL = 'http://localhost:7001/api';
      const endpoint = `/bookings/admin/${selectedBooking._id}/status`;
      console.log('Full request URL:', `${backendURL}${endpoint}`);
      
      // Log headers being sent
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };
      console.log('Headers being sent:', headers);
      
      const response = await bookings.updateStatus(selectedBooking._id, payload);
      
      console.log('Update response:', response.data);
      
      // Update the booking in the lists
      const updatedBooking = response.data;
      
      // Check if we got a valid response
      if (!updatedBooking || !updatedBooking._id) {
        throw new Error('Received invalid response data from server');
      }
      
      setBookingsList(prevList => prevList.map(
        booking => booking._id === updatedBooking._id ? updatedBooking : booking
      ));
      setFilteredBookings(prevList => prevList.map(
        booking => booking._id === updatedBooking._id ? updatedBooking : booking
      ));
      
      setSelectedBooking(updatedBooking);
      setActionSuccess(`Booking ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      
      if (status === 'approved') {
        addNotification({ message: 'Booking approved!', severity: 'success' });
      } else if (status === 'rejected') {
        addNotification({ message: 'Booking rejected.', severity: 'error' });
      }
      
      // Close dialog after a short delay
      if (status === 'approved') {
        setTimeout(() => {
          handleCloseDialog();
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      // Check for specific network errors
      if (err.message === 'Network Error') {
        console.error('Network error details:', {
          error: err,
          server: 'http://localhost:7001/api',
          endpoint: `/bookings/admin/${selectedBooking._id}/status`,
          method: 'PATCH'
        });
        setError('Network Error: Cannot connect to the server. Please check if the backend server is running.');
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
        setError('Failed to update booking status: ' + errorMessage);
      }
      addNotification({ message: 'Failed to update booking status.', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (booking) => {
    switch (booking.status) {
      case 'pending':
        return {
          bgcolor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.dark,
          label: 'Pending Approval',
          icon: <PendingIcon fontSize="small" />
        };
      case 'approved':
        return {
          bgcolor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.dark,
          label: 'Approved',
          icon: <ApprovedIcon fontSize="small" />
        };
      case 'rejected':
        return {
          bgcolor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.dark,
          label: 'Rejected',
          icon: <RejectedIcon fontSize="small" />
        };
      default:
        return {
          bgcolor: alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.grey[800],
          label: 'Unknown',
          icon: <InfoIcon fontSize="small" />
        };
    }
  };
  
  const getPendingCount = () => {
    return bookingsList.filter(booking => booking.status === 'pending').length;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
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
                <EventIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Admin Booking Management
              </Typography>
            </Fade>
            <Typography variant="body2" color="text.secondary">
              Approve or reject booking requests and manage all auditorium bookings
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Filter bookings">
              <IconButton
                color="primary"
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
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
        </Box>
        
        <Tabs
          value={statusFilter}
          onChange={handleStatusChange}
          sx={{ px: 2, pt: 1, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label="All Bookings" 
            value="all" 
            sx={{ fontWeight: 500 }} 
          />
          <Tab 
            label={
              <Badge 
                badgeContent={getPendingCount()} 
                color="warning"
                sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}
              >
                <Box sx={{ px: 1 }}>Pending</Box>
              </Badge>
            } 
            value="pending" 
            sx={{ fontWeight: 500 }} 
          />
          <Tab 
            label="Approved" 
            value="approved" 
            sx={{ fontWeight: 500 }} 
          />
          <Tab 
            label="Rejected" 
            value="rejected" 
            sx={{ fontWeight: 500 }} 
          />
        </Tabs>

        {error && (
          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.05) }}>
            <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
          </Box>
        )}

        {loading ? (
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Auditorium</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <BookingSkeleton />
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : filteredBookings.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <EventIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.2), mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Bookings Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no bookings matching the selected filter.
            </Typography>
          </Box>
        ) : (
          <Box>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      Auditorium
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      User
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      Time
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((booking) => {
                      const statusConfig = getStatusConfig(booking);
                      const isPending = booking.status === 'pending';
                      
                      const auditoriumName = booking?.auditoriumId?.name || 'Unknown Auditorium';
                      const userName = booking?.userId?.name || 'Unknown User';
                      
                      return (
                        <TableRow 
                          key={booking._id}
                          hover
                          sx={{ 
                            '&:nth-of-type(even)': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                            transition: 'background-color 0.2s',
                          }}
                        >
                          <TableCell 
                            onClick={() => handleOpenDetails(booking)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EventIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} />
                              <Typography variant="body2" fontWeight={500}>
                                {auditoriumName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell 
                            onClick={() => handleOpenDetails(booking)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonIcon sx={{ mr: 1, color: theme.palette.grey[600], fontSize: 18 }} />
                              <Typography variant="body2">
                                {userName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell 
                            onClick={() => handleOpenDetails(booking)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarIcon sx={{ mr: 1, color: theme.palette.grey[600], fontSize: 18 }} />
                              {format(new Date(booking.date), 'MMM dd, yyyy')}
                            </Box>
                          </TableCell>
                          <TableCell 
                            onClick={() => handleOpenDetails(booking)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={{ mr: 1, color: theme.palette.grey[600], fontSize: 18 }} />
                              {booking.startTime} - {booking.endTime}
                            </Box>
                          </TableCell>
                          <TableCell 
                            onClick={() => handleOpenDetails(booking)}
                            sx={{ cursor: 'pointer' }}
                          >
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
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {isPending && (
                                <>
                                  <Tooltip title="Approve booking">
                                    <IconButton 
                                      color="success" 
                                      size="small"
                                      onClick={() => handleOpenDetails(booking)}
                                      sx={{ 
                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                        '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) },
                                      }}
                                    >
                                      <CheckIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  
                                  <Tooltip title="Reject booking">
                                    <IconButton 
                                      color="error" 
                                      size="small"
                                      onClick={() => handleOpenDetails(booking)}
                                      sx={{ 
                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) },
                                      }}
                                    >
                                      <BlockIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                              {!isPending && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleOpenDetails(booking)}
                                >
                                  View Details
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredBookings.length}
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
        maxWidth="md"
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
              {actionSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {actionSuccess}
                </Alert>
              )}
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                      Booking Information
                    </Typography>
                    
                    <Box sx={{ mt: 2, mb: 3 }}>
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
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Auditorium
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {selectedBooking?.auditoriumId?.name || 'Unknown Auditorium'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Location
                        </Typography>
                        <Typography variant="body2">
                          {selectedBooking?.auditoriumId?.location || 'Unknown Location'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Date
                        </Typography>
                        <Typography variant="body2">
                          {format(new Date(selectedBooking.date), 'MMMM d, yyyy')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Time
                        </Typography>
                        <Typography variant="body2">
                          {selectedBooking.startTime} - {selectedBooking.endTime}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          User Name
                        </Typography>
                        <Typography variant="body2">
                          {selectedBooking?.userId?.name || 'Unknown User'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Email
                        </Typography>
                        <Typography variant="body2">
                          {selectedBooking?.userId?.email || 'Unknown Email'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Booking ID
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {selectedBooking._id}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    {selectedBooking.status === 'rejected' && selectedBooking.adminComment && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" color="error" gutterBottom>
                          Rejection Reason:
                        </Typography>
                        <Paper 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            bgcolor: alpha(theme.palette.error.main, 0.05),
                            borderColor: alpha(theme.palette.error.main, 0.2)
                          }}
                        >
                          <Typography variant="body2">
                            {selectedBooking.adminComment}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                      Event Description
                    </Typography>
                    
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        flex: 1
                      }}
                    >
                      <Typography variant="body2">
                        {selectedBooking.description || "No description provided"}
                      </Typography>
                    </Paper>
                    
                    {selectedBooking.status === 'pending' && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                          Review Booking
                        </Typography>
                        
                        <TextField
                          label="Admin Comment"
                          placeholder="Provide a reason if rejecting the booking request..."
                          multiline
                          rows={3}
                          fullWidth
                          value={adminComment}
                          onChange={(e) => setAdminComment(e.target.value)}
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={handleApprove}
                            disabled={actionLoading}
                            startIcon={<CheckIcon />}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={handleReject}
                            disabled={actionLoading}
                            startIcon={<BlockIcon />}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
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

export default AdminBookings; 