import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../../context/BookingContext';
import { AuthContext } from '../../context/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { formatDate, getStatusClass } from '../../utils/helpers';

const BookingDetails = ({ booking, onClose, onCancel }) => {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const { cancelBooking, loading } = useContext(BookingContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const isAdmin = user?.role === 'admin';
  const canCancel = booking.status === 'pending' || booking.status === 'approved';

  const handleCancel = async () => {
    const success = await cancelBooking(booking._id);
    if (success) {
      setConfirmCancel(false);
      if (onCancel) onCancel();
    }
  };

  return (
    <div>
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold">{booking.eventName}</h3>
              <p className="text-gray-600">
                {booking.auditorium?.name}, {booking.auditorium?.location}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(booking.status)}`}>
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Booking Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Start Time:</span> {formatDate(booking.startDateTime)}</p>
                <p><span className="font-medium">End Time:</span> {formatDate(booking.endDateTime)}</p>
                <p><span className="font-medium">Attendees:</span> {booking.attendeeCount} people</p>
                <p><span className="font-medium">Department:</span> {booking.department || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">User Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {booking.user?.name}</p>
                <p><span className="font-medium">Email:</span> {booking.user?.email}</p>
                {booking.approvedBy && (
                  <p><span className="font-medium">Approved By:</span> Admin</p>
                )}
                <p>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {booking.purpose && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Purpose</h4>
              <p className="text-gray-700">{booking.purpose}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onClose || (() => navigate('/bookings'))}
            >
              Back
            </Button>
            {canCancel && (
              <Button
                variant="danger"
                onClick={() => setConfirmCancel(true)}
              >
                Cancel Booking
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Confirm Cancellation"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setConfirmCancel(false)}
            >
              No, Keep Booking
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              loading={loading}
            >
              Yes, Cancel Booking
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default BookingDetails;