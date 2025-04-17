import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UserBookings from '../components/booking/UserBookings';
import BookingForm from '../components/booking/BookingForm';
import Button from '../components/common/Button';

const BookingsPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);

  // Check if we are in new booking mode
  useEffect(() => {
    if (location.pathname === '/bookings/new') {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [location]);

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
      {showForm ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">New Booking</h2>
            <Button
              onClick={() => navigate('/bookings')}
              variant="outline"
              size="sm"
            >
              Back to My Bookings
            </Button>
          </div>
          <BookingForm />
        </div>
      ) : (
        <UserBookings />
      )}
    </div>
  );
};

export default BookingsPage;