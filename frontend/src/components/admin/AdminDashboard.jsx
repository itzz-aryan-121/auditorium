import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingContext } from '../../context/BookingContext';
import { AuditoriumContext } from '../../context/AuditoriumContext';
import { AuthContext } from '../../context/AuthContext';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const { getAllBookings, bookings, loading: bookingLoading, updateBookingStatus } = useContext(BookingContext);
  const { getAuditoriums, auditoriums, loading: auditoriumLoading } = useContext(AuditoriumContext);
  const { user } = useContext(AuthContext);
  
  const [stats, setStats] = useState({
    pendingBookings: 0,
    approvedBookings: 0,
    availableAuditoriums: 0,
    maintenanceAuditoriums: 0
  });

  useEffect(() => {
    getAllBookings();
    getAuditoriums();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      const pendingCount = bookings.filter(b => b.status === 'pending').length;
      const approvedCount = bookings.filter(b => b.status === 'approved').length;
      
      setStats(prev => ({
        ...prev,
        pendingBookings: pendingCount,
        approvedBookings: approvedCount
      }));
    }
  }, [bookings]);

  useEffect(() => {
    if (auditoriums.length > 0) {
      const availableCount = auditoriums.filter(a => a.status === 'available').length;
      const maintenanceCount = auditoriums.filter(a => a.status === 'maintenance').length;
      
      setStats(prev => ({
        ...prev,
        availableAuditoriums: availableCount,
        maintenanceAuditoriums: maintenanceCount
      }));
    }
  }, [auditoriums]);

  const handleStatusChange = async (bookingId, status) => {
    await updateBookingStatus(bookingId, status);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (bookingLoading || auditoriumLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-700">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card title="Pending Bookings">
          <div className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</div>
        </Card>
        
        <Card title="Approved Bookings">
          <div className="text-3xl font-bold text-green-600">{stats.approvedBookings}</div>
        </Card>
        
        <Card title="Available Auditoriums">
          <div className="text-3xl font-bold text-blue-600">{stats.availableAuditoriums}</div>
        </Card>
        
        <Card title="Maintenance">
          <div className="text-3xl font-bold text-red-600">{stats.maintenanceAuditoriums}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="Quick Actions">
          <div className="space-y-4">
            <Link
              to="/admin/users"
              className="block w-full py-3 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/auditoriums"
              className="block w-full py-3 px-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
            >
              Manage Auditoriums
            </Link>
            <Link
              to="/admin/bookings"
              className="block w-full py-3 px-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
            >
              View All Bookings
            </Link>
          </div>
        </Card>

        <Card title="Auditorium Status">
          {auditoriums.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 text-left">Name</th>
                    <th className="py-2 px-3 text-left">Location</th>
                    <th className="py-2 px-3 text-left">Capacity</th>
                    <th className="py-2 px-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditoriums.slice(0, 5).map((auditorium) => (
                    <tr key={auditorium._id} className="border-t">
                      <td className="py-2 px-3">{auditorium.name}</td>
                      <td className="py-2 px-3">{auditorium.location}</td>
                      <td className="py-2 px-3">{auditorium.capacity}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          auditorium.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : auditorium.status === 'maintenance'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {auditorium.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No auditoriums found.</p>
          )}
        </Card>
      </div>

      <Card title="Recent Booking Requests">
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 text-left">Event</th>
                  <th className="py-2 px-3 text-left">User</th>
                  <th className="py-2 px-3 text-left">Auditorium</th>
                  <th className="py-2 px-3 text-left">Date</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings
                  .filter(booking => booking.status === 'pending')
                  .slice(0, 5)
                  .map((booking) => (
                    <tr key={booking._id} className="border-t">
                      <td className="py-2 px-3">{booking.eventName}</td>
                      <td className="py-2 px-3">{booking.user?.name}</td>
                      <td className="py-2 px-3">{booking.auditorium?.name}</td>
                      <td className="py-2 px-3">{formatDate(booking.startDateTime)}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(booking._id, 'approved')}
                            className="px-2 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking._id, 'rejected')}
                            className="px-2 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No pending booking requests.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;