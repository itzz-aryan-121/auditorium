import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Grid, Button, Divider, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { bookings } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#4caf50', '#ff9800', '#f44336'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await bookings.getAllBookings();
        const all = response.data;
        setAllBookings(all);
        const pending = all.filter(b => b.status === 'pending');
        const approved = all.filter(b => b.status === 'approved');
        const rejected = all.filter(b => b.status === 'rejected');
        setStats({
          total: all.length,
          pending: pending.length,
          approved: approved.length,
          rejected: rejected.length,
        });
        setPendingRequests(pending);
      } catch (err) {
        addNotification({ message: 'Failed to fetch dashboard data.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [addNotification]);

  // Prepare data for PieChart
  const pieData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.rejected },
  ];

  // Prepare data for BarChart (bookings per day)
  const bookingsByDate = allBookings.reduce((acc, b) => {
    const date = b.date?.slice(0, 10);
    if (!date) return acc;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(bookingsByDate).map(([date, count]) => ({ date, count }));

  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        <EventAvailableIcon sx={{ mr: 1, fontSize: 36, color: 'primary.main' }} />
        Admin Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 4 }}>
            <EventAvailableIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Total Bookings</Typography>
            <Typography variant="h4" color="primary">{loading ? '--' : stats.total}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 4 }}>
            <PendingActionsIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Pending Requests</Typography>
            <Typography variant="h4" color="warning.main">{loading ? '--' : stats.pending}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Approved</Typography>
            <Typography variant="h4" color="success.main">{loading ? '--' : stats.approved}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 4 }}>
            <CancelIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Rejected</Typography>
            <Typography variant="h4" color="error.main">{loading ? '--' : stats.rejected}</Typography>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PieChartIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Bookings by Status</Typography>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Bookings per Day</Typography>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <ReTooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3f51b5" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Pending Requests
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
            <CircularProgress />
          </Box>
        ) : pendingRequests.length === 0 ? (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography>No pending requests yet.</Typography>
          </Card>
        ) : (
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Auditorium</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell>{req.auditoriumId?.name || 'Unknown'}</TableCell>
                    <TableCell>{req.userId?.name || 'Unknown'}</TableCell>
                    <TableCell>{req.date?.slice(0, 10)}</TableCell>
                    <TableCell>{req.startTime} - {req.endTime}</TableCell>
                    <TableCell>{req.description}</TableCell>
                    <TableCell>
                      <Chip label={req.status} color="warning" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Button variant="contained" color="primary" onClick={() => navigate('/admin/calendar')}>
          Go to Calendar View
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 