import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Skeleton,
  Fade,
  Chip,
  Divider,
  CardActionArea,
  CardMedia,
  useTheme,
  alpha,
  LinearProgress,
  CircularProgress,
  Paper
} from '@mui/material';
import { 
  LocationOn as LocationIcon, 
  People as PeopleIcon, 
  ChevronRight as ChevronRightIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { auditoriums } from '../services/api';

// Random background colors for auditorium cards
const getRandomGradient = (index) => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  ];
  return gradients[index % gradients.length];
};

// Horizontal loading component
const HorizontalLoader = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', mt: 4, mb: 6 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(4px)',
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box sx={{ mb: 2 }}>
          <CircularProgress 
            size={60} 
            thickness={4} 
            sx={{ 
              color: theme.palette.primary.main,
              mb: 3
            }} 
          />
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Loading Auditoriums
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Discovering venues for your next event...
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative', height: '4px', width: '100%', mb: 3 }}>
          <LinearProgress
            sx={{
              height: '4px',
              borderRadius: '2px',
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
          {Array(3).fill(0).map((_, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton 
                variant="circular" 
                width={60} 
                height={60} 
                sx={{ mb: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }} 
              />
              <Skeleton 
                variant="text" 
                width={100} 
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }} 
              />
            </Box>
          ))}
        </Box>
        
        {/* Animated gradient overlay to give a shimmering effect */}
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
            animation: 'shimmer 2s infinite',
            '@keyframes shimmer': {
              '0%': {
                backgroundPosition: '100% 0'
              },
              '100%': {
                backgroundPosition: '-100% 0'
              }
            }
          }}
        />
      </Paper>
    </Box>
  );
};

const AuditoriumList = () => {
  const [auditoriumList, setAuditoriumList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchAuditoriums = async () => {
      try {
        const response = await auditoriums.getAll();
        setAuditoriumList(response.data);
      } catch (err) {
        setError('Failed to fetch auditoriums');
      } finally {
        // Add a small delay to make the loading feel more natural
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchAuditoriums();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Fade in timeout={800}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Available Auditoriums
          </Typography>
        </Fade>
        <Divider sx={{ 
          width: '80px', 
          mx: 'auto', 
          borderWidth: '2px', 
          borderColor: theme.palette.primary.main,
          mb: 3
        }} />
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
        >
          Browse our selection of premium auditoriums and book your next event with ease
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 4, p: 2, bgcolor: alpha(theme.palette.error.main, 0.1), borderRadius: 2 }}>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Box>
      )}

      {loading ? (
        <HorizontalLoader />
      ) : (
        <Fade in timeout={500}>
          <Grid container spacing={3}>
            {auditoriumList.map((auditorium, index) => (
              <Grid item xs={12} sm={6} md={4} key={auditorium._id}>
                <Fade in timeout={500 + (index * 100)}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 140,
                        background: getRandomGradient(index),
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <EventIcon sx={{ fontSize: 60, opacity: 0.7 }} />
                    </CardMedia>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        {auditorium.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <LocationIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {auditorium.location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PeopleIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Capacity: {auditorium.capacity} people
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate(`/auditoriums/${auditorium._id}/availability`)}
                        endIcon={<ChevronRightIcon />}
                        sx={{ 
                          mt: 'auto', 
                          py: 1,
                          borderRadius: '8px' 
                        }}
                      >
                        Check Availability
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}
    </Container>
  );
};

export default AuditoriumList; 