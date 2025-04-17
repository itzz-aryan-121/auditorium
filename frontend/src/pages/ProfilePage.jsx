import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UserProfile from '../components/user/UserProfile';

const ProfilePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile />
    </div>
  );
};

export default ProfilePage;