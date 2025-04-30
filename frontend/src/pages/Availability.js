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
  Fade,
  Card,
  useTheme,
  alpha,
  Skeleton,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Event as EventIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Place as PlaceIcon,
  Groups as GroupsIcon,
  Today as TodayIcon,
  CheckCircleOutline as CheckIcon,
  Block as BlockIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { auditoriums } from '../services/api';
import { format, parseISO, addDays, subDays, isToday, isTomorrow } from 'date-fns';

// Enhanced themed loader for time slots
const TimeSlotSkeletons = () => {
  const theme = useTheme();
  
  return (
    <>
      {Array(6).fill(0).map((_, idx) => (
        <Grid item xs={12} sm={6} md={4} key={`skeleton-${idx}`}>
          <Fade in timeout={300 + (idx * 50)}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.light, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Skeleton 
                  variant="circular" 
                  width={22} 
                  height={22} 
                  sx={{ mr: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.2) }} 
                />
                <Skeleton 
                  variant="text" 
                  width="60%" 
                  height={32} 
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2) }} 
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton 
                  variant="circular" 
                  width={16} 
                  height={16} 
                  sx={{ mr: 0.5, bgcolor: alpha(theme.palette.primary.main, 0.2) }} 
                />
                <Skeleton 
                  variant="text" 
                  width="40%" 
                  height={20} 
                  sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2) }} 
                />
              </Box>
              
              <Skeleton 
                variant="rectangular" 
                height={36} 
                width="100%" 
                sx={{ 
                  mt: 'auto', 
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.2)
                }} 
              />
              
              {/* Animated gradient overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(90deg, 
                    ${alpha(theme.palette.background.paper, 0)} 25%, 
                    ${alpha(theme.palette.primary.main, 0.1)} 50%, 
                    ${alpha(theme.palette.background.paper, 0)} 75%)`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  '@keyframes shimmer': {
                    '0%': {
                      backgroundPosition: '200% 0'
                    },
                    '100%': {
                      backgroundPosition: '-200% 0'
                    }
                  }
                }}
              />
            </Paper>
          </Fade>
        </Grid>
      ))}
    </>
  );
};

// Add a centralized loader component
const LoadingOverlay = ({ loading }) => {
  const theme = useTheme();
  
  if (!loading) return null;
  
  return (
    <Box 
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: alpha(theme.palette.background.paper, 0.7),
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          boxShadow: 3
        }}
      >
        <Box 
          sx={{ 
            position: 'relative', 
            width: 60, 
            height: 60, 
            mb: 2 
          }}
        >
          <CircularProgress 
            size={60} 
            thickness={4} 
            sx={{ color: theme.palette.primary.main }} 
          />
          <TimeIcon 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              color: theme.palette.primary.main,
              fontSize: 28
            }} 
          />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Loading Slots
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Finding available time slots...
        </Typography>
      </Box>
    </Box>
  );
};

const Availability = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // For initial page load
  const [error, setError] = useState('');
  const [auditorium, setAuditorium] = useState(null);
  const [auditoriumLoading, setAuditoriumLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    // Fetch auditorium details
    const fetchAuditoriumDetails = async () => {
      try {
        setAuditoriumLoading(true);
        // This would ideally call a specific API endpoint to get auditorium details
        // For now, using getAll and finding the specific auditorium
        const response = await auditoriums.getAll();
        const foundAuditorium = response.data.find(a => a._id === id);
        if (foundAuditorium) {
          setAuditorium(foundAuditorium);
        }
      } catch (err) {
        console.error('Error fetching auditorium details:', err);
      } finally {
        setTimeout(() => {
          setAuditoriumLoading(false);
        }, 500);
      }
    };
    
    fetchAuditoriumDetails();
  }, [id]);

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
      // Add a small delay to make the loading feel more natural
      setTimeout(() => {
        setLoading(false);
        setInitialLoading(false);
      }, 800);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  
  const goToNextDay = () => {
    setDate(format(addDays(parseISO(date), 1), 'yyyy-MM-dd'));
  };
  
  const goToPrevDay = () => {
    setDate(format(subDays(parseISO(date), 1), 'yyyy-MM-dd'));
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
  
  const getDateLabel = () => {
    const dateObj = parseISO(date);
    if (isToday(dateObj)) return 'Today';
    if (isTomorrow(dateObj)) return 'Tomorrow';
    return format(dateObj, 'EEEE, d MMMM yyyy');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Fullscreen loading overlay for initial page load */}
      <LoadingOverlay loading={initialLoading} />
      
      <Fade in timeout={500}>
        <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
          {auditoriumLoading ? (
            <Box sx={{ p: 3 }}>
              <Skeleton variant="rectangular" height={60} width="60%" sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" height={24} width={120} />
                <Skeleton variant="rectangular" height={24} width={180} />
              </Box>
            </Box>
          ) : auditorium ? (
            <Box 
              sx={{ 
                p: 3, 
                background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.01)})`,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <EventIcon sx={{ mr: 1, WebkitTextFillColor: theme.palette.primary.main }} />
                {auditorium.name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PlaceIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    Location: <strong>{auditorium.location}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GroupsIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    Capacity: <strong>{auditorium.capacity} people</strong>
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : null}
          
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <CalendarIcon color="primary" sx={{ mr: 1 }} />
                Check Availability
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Previous day">
                  <IconButton 
                    size="small" 
                    onClick={goToPrevDay}
                    disabled={parseISO(date) <= new Date() || loading}
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                    }}
                  >
                    <PrevIcon />
                  </IconButton>
                </Tooltip>
                
                <TextField
                  type="date"
                  variant="outlined"
                  size="small"
                  value={date}
                  onChange={handleDateChange}
                  disabled={loading}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: format(new Date(), 'yyyy-MM-dd')
                  }}
                  sx={{ width: 180 }}
                />
                
                <Tooltip title="Next day">
                  <IconButton 
                    size="small" 
                    onClick={goToNextDay}
                    disabled={loading}
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                    }}
                  >
                    <NextIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Refresh availability">
                  <IconButton
                    size="small"
                    onClick={fetchAvailability}
                    disabled={loading}
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                      animation: loading ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': {
                          transform: 'rotate(0deg)',
                        },
                        '100%': {
                          transform: 'rotate(360deg)',
                        },
                      },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Chip 
                icon={<TodayIcon />} 
                label={getDateLabel()} 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ position: 'relative', minHeight: loading && timeSlots.length === 0 ? '300px' : 'auto' }}>
              {/* Content loading indicator */}
              {loading && !initialLoading && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    zIndex: 1,
                  }}
                >
                  <CircularProgress 
                    size={40} 
                    thickness={4} 
                    sx={{ 
                      color: theme.palette.primary.main,
                      mb: 2
                    }} 
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 500,
                      color: theme.palette.primary.main
                    }}
                  >
                    Updating slots...
                  </Typography>
                </Box>
              )}

              {/* Skeleton loaders or content */}
              <Box sx={{ 
                opacity: loading && !initialLoading && timeSlots.length > 0 ? 0.5 : 1,
                transition: 'opacity 0.2s ease-in-out',
                filter: loading && !initialLoading && timeSlots.length > 0 ? 'blur(1px)' : 'none',
              }}>
                {loading && timeSlots.length === 0 ? (
                  <Grid container spacing={2}>
                    <TimeSlotSkeletons />
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    {timeSlots.map((slot, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Fade in timeout={300 + (index * 50)}>
                          <Paper
                            elevation={slot.isAvailable ? 2 : 1}
                            sx={{
                              p: 3,
                              borderRadius: 2,
                              bgcolor: slot.isAvailable 
                                ? alpha(theme.palette.success.light, 0.15) 
                                : alpha(theme.palette.error.light, 0.1),
                              border: `1px solid ${slot.isAvailable 
                                ? alpha(theme.palette.success.main, 0.2) 
                                : alpha(theme.palette.error.main, 0.1)}`,
                              transition: 'all 0.3s ease',
                              '&:hover': slot.isAvailable ? {
                                transform: 'translateY(-4px)',
                                boxShadow: 3,
                                bgcolor: alpha(theme.palette.success.light, 0.25),
                              } : {},
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                              <TimeIcon sx={{ 
                                mr: 1.5, 
                                color: slot.isAvailable ? theme.palette.success.main : theme.palette.error.main,
                                fontSize: 22
                              }} />
                              <Typography 
                                variant="h6"
                                sx={{ 
                                  fontWeight: 600, 
                                  color: slot.isAvailable ? 'text.primary' : 'text.secondary' 
                                }}
                              >
                                {slot.startTime} - {slot.endTime}
                              </Typography>
                            </Box>
                            
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: 2,
                                color: slot.isAvailable ? theme.palette.success.dark : theme.palette.error.dark
                              }}
                            >
                              {slot.isAvailable ? (
                                <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />
                              ) : (
                                <BlockIcon fontSize="small" sx={{ mr: 0.5 }} />
                              )}
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 500,
                                  color: slot.isAvailable ? theme.palette.success.dark : theme.palette.error.dark
                                }}
                              >
                                {slot.isAvailable ? 'Available' : 'Booked'}
                              </Typography>
                            </Box>
                            
                            {slot.isAvailable && (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleBookSlot(slot)}
                                sx={{ 
                                  mt: 'auto',
                                  fontWeight: 500,
                                  boxShadow: 2
                                }}
                              >
                                Book This Slot
                              </Button>
                            )}
                          </Paper>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Box>
          </Box>
        </Card>
      </Fade>
    </Container>
  );
};

export default Availability; 