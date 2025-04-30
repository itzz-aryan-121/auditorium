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
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { auditoriums } from '../services/api';

const AuditoriumList = () => {
  const [auditoriumList, setAuditoriumList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuditoriums = async () => {
      try {
        const response = await auditoriums.getAll();
        setAuditoriumList(response.data);
      } catch (err) {
        setError('Failed to fetch auditoriums');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoriums();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Auditoriums
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {auditoriumList.map((auditorium) => (
            <Grid item xs={12} sm={6} md={4} key={auditorium._id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {auditorium.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Location: {auditorium.location}
                  </Typography>
                  <Typography variant="body2">
                    Capacity: {auditorium.capacity} people
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/auditoriums/${auditorium._id}/availability`)}
                    >
                      Check Availability
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default AuditoriumList; 