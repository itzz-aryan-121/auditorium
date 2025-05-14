import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Grid, Button, Divider, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Tooltip, useTheme, alpha, Fade, Grow, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { bookings } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';

const COLORS = ['#4caf50', '#ff9800', '#f44336'];

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <Grow in timeout={1000}>
    <Card 
      sx={{ 
        p: 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 8px 20px ${alpha(color, 0.15)}`,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Icon sx={{ fontSize: 28, color: color }} />
      </Box>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700,
          color: color,
          mb: 1,
          opacity: loading ? 0.5 : 1
        }}
      >
        {loading ? '--' : value}
      </Typography>
      <Box 
        sx={{ 
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at bottom right, ${alpha(color, 0.1)} 0%, transparent 70%)`,
          opacity: 0.5
        }} 
      />
    </Card>
  </Grow>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const theme = useTheme();
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

  // Generate last 7 days data for area chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      date: format(date, 'MMM dd'),
      bookings: bookingsByDate[dateStr] || 0
    };
  }).reverse();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Fade in timeout={800}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <EventAvailableIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
            <Box>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor and manage all auditorium bookings
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="Total Bookings" 
                value={stats.total} 
                icon={EventAvailableIcon} 
                color={theme.palette.primary.main}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="Pending Requests" 
                value={stats.pending} 
                icon={PendingActionsIcon} 
                color={theme.palette.warning.main}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="Approved" 
                value={stats.approved} 
                icon={CheckCircleIcon} 
                color={theme.palette.success.main}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="Rejected" 
                value={stats.rejected} 
                icon={CancelIcon} 
                color={theme.palette.error.main}
                loading={loading}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Grow in timeout={1000}>
                <Card sx={{ p: 3, height: '100%', boxShadow: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PieChartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Bookings by Status</Typography>
                  </Box>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie 
                          data={pieData} 
                          dataKey="value" 
                          nameKey="name" 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={100}
                          innerRadius={60}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              stroke={theme.palette.background.paper}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <ReTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Card>
              </Grow>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grow in timeout={1000}>
                <Card sx={{ p: 3, height: '100%', boxShadow: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <BarChartIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Bookings Trend (Last 7 Days)</Typography>
                  </Box>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={last7Days} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <ReTooltip />
                        <Area 
                          type="monotone" 
                          dataKey="bookings" 
                          stroke={theme.palette.primary.main} 
                          fillOpacity={1} 
                          fill="url(#colorBookings)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </Card>
              </Grow>
            </Grid>
          </Grid>

          <Box sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>
                Pending Requests
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<CalendarMonthIcon />}
                onClick={() => navigate('/admin/calendar')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  }
                }}
              >
                View Calendar
              </Button>
            </Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
                <CircularProgress />
              </Box>
            ) : pendingRequests.length === 0 ? (
              <Card sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <Typography color="text.secondary">No pending requests at the moment.</Typography>
              </Card>
            ) : (
              <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
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
                      <TableRow 
                        key={req._id}
                        hover
                        sx={{ 
                          '&:nth-of-type(even)': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            transform: 'translateX(5px)'
                          }
                        }}
                      >
                        <TableCell>{req.auditoriumId?.name || 'Unknown'}</TableCell>
                        <TableCell>{req.userId?.name || 'Unknown'}</TableCell>
                        <TableCell>{req.date?.slice(0, 10)}</TableCell>
                        <TableCell>{req.startTime} - {req.endTime}</TableCell>
                        <TableCell>{req.description}</TableCell>
                        <TableCell>
                          <Chip 
                            label={req.status} 
                            color="warning" 
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              color: theme.palette.warning.dark
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default AdminDashboard; 