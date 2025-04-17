import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuditoriumList from '../components/auditorium/AuditoriumList';

const AuditoriumsPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Avoid rendering if not authenticated
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AuditoriumList />
    </div>
  );
};

export default AuditoriumsPage;