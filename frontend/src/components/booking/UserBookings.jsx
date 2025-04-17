import { useState, useEffect, useContext } from 'react';
import { BookingContext } from '../../context/BookingContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import { formatDate, getStatusClass } from '../../utils/helpers';

const UserBookings = () => {
  const [filter, setFilter] = useState('all');
  const { getUserBookings, bookings, cancelBooking, loading, error } = useContext(BookingContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getUserBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const success = await cancelBooking(bookingId);
      if (success) {
        setMessage('Booking canceled successfully');
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading && !bookings.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">My Bookings</h2>
        <Button
          onClick={() => window.location.href = '/bookings/new'}
          variant="primary"
          size="sm"
        >
          New Booking
        </Button>
      </div>

      {message && (
        <Alert 
          type="success" 
          message={message} 
          dismissible 
          onDismiss={() => setMessage('')}
          className="mb-4"
        />
      )}

      {error && (
        <Alert type="error" message={error} className="mb-4" />
      )}

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('pending')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleFilterChange('approved')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => handleFilterChange('rejected')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => handleFilterChange('completed')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">No bookings found</p>
          {filter !== 'all' && (
            <p className="mt-2 text-sm text-gray-500">
              Try changing your filter or make a new booking
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <Card key={booking._id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.eventName}</h3>
                    <p className="text-gray-600 text-sm">
                      {booking.auditorium?.name}, {booking.auditorium?.location}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Date & Time</h4>
                    <div className="mt-1 text-sm">
                      <p>Start: {formatDate(booking.startDateTime)}</p>
                      <p>End: {formatDate(booking.endDateTime)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Details</h4>
                    <div className="mt-1 text-sm">
                      <p>Attendees: {booking.attendeeCount}</p>
                      <p>Department: {booking.department}</p>
                    </div>
                  </div>
                </div>

                {booking.purpose && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Purpose</h4>
                    <p className="mt-1 text-sm text-gray-600">{booking.purpose}</p>
                  </div>
                )}
              </div>

              {(booking.status === 'pending' || booking.status === 'approved') && (
                <div className="px-4 py-3 bg-gray-50 border-t flex justify-end">
                  <Button
                    onClick={() => handleCancel(booking._id)}
                    variant="danger"
                    size="sm"
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );

}

export default UserBookings;