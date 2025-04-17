import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';
import UserDashboard from '../components/user/UserDashBoard';
import AdminDashboard from '../components/admin/AdminDashBoard';
import Spinner from '../components/common/Spinner';

const DashboardPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { getUserDashboardStats, loading } = useContext(BookingContext);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadDashboard = async () => {
      if (user && user.role === 'user') {
        const data = await getUserDashboardStats();
        setDashboardData(data);
      }
    };

    loadDashboard();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {user && user.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <UserDashboard dashboardData={dashboardData} />
      )}
    </div>
  );
};

export default DashboardPage;