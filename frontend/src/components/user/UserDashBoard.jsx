import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookingContext } from '../../context/BookingContext';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { formatDate } from '../../utils/helpers';

const UserDashboard = ({ dashboardData }) => {
  const { getUserBookings, bookings, loading } = useContext(BookingContext);
  
  useEffect(() => {
    getUserBookings();
  }, []);

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  const { totalBookings, upcomingBookings, eventsOrganized } = dashboardData;

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

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Bookings">
          <div className="text-4xl font-bold">{totalBookings}</div>
        </Card>
        
        <Card title="Upcoming Events">
          <div className="text-4xl font-bold">{upcomingBookings?.length || 0}</div>
        </Card>
        
        <Card title="Events Organized">
          <div className="text-4xl font-bold">{eventsOrganized}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="Upcoming Bookings">
          {loading ? (
            <Spinner />
          ) : upcomingBookings && upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{booking.eventName}</h4>
                      <p className="text-sm text-gray-600">
                        {booking.auditorium?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(booking.startDateTime)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming bookings found.</p>
          )}
          <div className="mt-4">
            <Link to="/bookings" className="text-blue-600 hover:underline text-sm">
              View all bookings
            </Link>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-4">
            <Link
              to="/auditoriums"
              className="block w-full py-3 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
            >
              Find Available Auditoriums
            </Link>
            <Link
              to="/bookings"
              className="block w-full py-3 px-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
            >
              Make a New Booking
            </Link>
            <Link
              to="/profile"
              className="block w-full py-3 px-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
            >
              Update Profile
            </Link>
          </div>
        </Card>
      </div>

      <Card title="Recent Bookings">
        {loading ? (
          <Spinner />
        ) : bookings && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 text-left">Event</th>
                  <th className="py-2 px-3 text-left">Auditorium</th>
                  <th className="py-2 px-3 text-left">Date</th>
                  <th className="py-2 px-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} className="border-t">
                    <td className="py-2 px-3">{booking.eventName}</td>
                    <td className="py-2 px-3">{booking.auditorium?.name}</td>
                    <td className="py-2 px-3">{formatDate(booking.startDateTime)}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No bookings found.</p>
        )}
      </Card>
    </div>
  );
};

export default UserDashboard;