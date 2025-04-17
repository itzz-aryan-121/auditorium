import { createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, user } = useContext(AuthContext);

  // Get user bookings
  const getUserBookings = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get('/api/bookings');
      setBookings(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch bookings');
      setLoading(false);
      return [];
    }
  };

  // Get all bookings (admin only)
  const getAllBookings = async () => {
    if (!isAuthenticated || user.role !== 'admin') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get('/api/admin/bookings');
      setBookings(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch all bookings');
      setLoading(false);
      return [];
    }
  };

  // Create booking
  const createBooking = async (bookingData) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post('/api/bookings/', bookingData);
      setBookings([res.data, ...bookings]);
      setLoading(false);
      return { success: true, booking: res.data };
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create booking');
      setLoading(false);
      return { success: false, error: err.response?.data?.msg || 'Failed to create booking' };
    }
  };

  
  const cancelBooking = async (bookingId) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.put(`/api/bookings/cancel/${bookingId}`);
      
      setBookings(
        bookings.map(booking => 
          booking._id === bookingId ? res.data : booking
        )
      );
      
      if (currentBooking && currentBooking._id === bookingId) {
        setCurrentBooking(res.data);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to cancel booking');
      setLoading(false);
      return false;
    }
  };

  // Update booking status (admin only)
  const updateBookingStatus = async (bookingId, status) => {
    if (!isAuthenticated || user.role !== 'admin') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.put('/api/admin/bookings/status', { bookingId, status });
      
      setBookings(
        bookings.map(booking => 
          booking._id === bookingId ? res.data : booking
        )
      );
      
      if (currentBooking && currentBooking._id === bookingId) {
        setCurrentBooking(res.data);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update booking status');
      setLoading(false);
      return false;
    }
  };

  // Get user dashboard stats
  const getUserDashboardStats = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get('/api/users/dashboard');
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch dashboard stats');
      setLoading(false);
      return null;
    }
  };

  // Clear errors
  const clearError = () => setError(null);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        currentBooking,
        loading,
        error,
        getUserBookings,
        getAllBookings,
        createBooking,
        cancelBooking,
        updateBookingStatus,
        getUserDashboardStats,
        setCurrentBooking,
        clearError
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};