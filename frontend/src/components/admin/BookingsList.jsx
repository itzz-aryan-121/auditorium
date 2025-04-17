import { useState, useEffect, useContext } from 'react';
import { BookingContext } from '../../context/BookingContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import Table from '../common/Table';
import { formatDate, getStatusClass } from '../../utils/helpers';

const BookingsList = () => {
  const [filter, setFilter] = useState('all');
  const { getAllBookings, bookings, updateBookingStatus, loading, error } = useContext(BookingContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAllBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, status) => {
    const success = await updateBookingStatus(bookingId, status);
    if (success) {
      setMessage(`Booking status updated to ${status}`);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const columns = [
    {
      header: 'Event',
      accessor: 'eventName',
      render: (booking) => (
        <div>
          <div className="font-medium">{booking.eventName}</div>
          <div className="text-xs text-gray-500">
            {booking.department}
          </div>
        </div>
      )
    },
    {
      header: 'User',
      accessor: 'user',
      render: (booking) => (
        <div>
          <div>{booking.user?.name}</div>
          <div className="text-xs text-gray-500">
            {booking.user?.email}
          </div>
        </div>
      )
    },
    {
      header: 'Auditorium',
      accessor: 'auditorium',
      render: (booking) => booking.auditorium?.name
    },
    {
      header: 'Date & Time',
      accessor: 'startDateTime',
      render: (booking) => (
        <div>
          <div>Start: {formatDate(booking.startDateTime)}</div>
          <div>End: {formatDate(booking.endDateTime)}</div>
        </div>
      )
    },
    {
      header: 'Attendees',
      accessor: 'attendeeCount'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (booking) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(booking.status)}`}>
          {booking.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (booking) => (
        <div className="flex justify-end space-x-2">
          {booking.status === 'pending' && (
            <>
              <Button
                onClick={() => handleStatusUpdate(booking._id, 'approved')}
                variant="success"
                size="sm"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                variant="danger"
                size="sm"
              >
                Reject
              </Button>
            </>
          )}
          {booking.status === 'approved' && (
            <Button
              onClick={() => handleStatusUpdate(booking._id, 'completed')}
              variant="primary"
              size="sm"
            >
              Mark Completed
            </Button>
          )}
        </div>
      ),
      className: 'text-right'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Bookings</h2>
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

      <Card>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredBookings}
            emptyMessage={`No ${filter !== 'all' ? filter : ''} bookings found`}
          />
        )}
      </Card>
    </div>
  );
};

export default BookingsList;