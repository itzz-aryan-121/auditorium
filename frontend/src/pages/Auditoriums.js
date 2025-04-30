import { useNavigate } from 'react-router-dom';

const Auditoriums = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Auditoriums
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/auditoriums/add')}
          >
            Add New Auditorium
          </Button>
        </Box>
        // ... existing code ...
      </Box>
    </Container>
  );
}; 