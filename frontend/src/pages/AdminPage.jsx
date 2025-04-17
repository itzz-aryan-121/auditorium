import { useContext, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UsersList from '../components/admin/UsersList';
import AdminDashboard from '../components/admin/AdminDashBoard';
import AuditoriumForm from '../components/admin/AuditoriumForm';
import Alert from '../components/common/Alert';

const AdminPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAuthenticated && user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Render guard
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message="You do not have permission to access this page." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersList />} />
        <Route path="auditoriums/new" element={<AuditoriumForm />} />
        <Route path="auditoriums/:id" element={<AuditoriumForm />} />
      </Routes>
    </div>
  );
};

export default AdminPage;