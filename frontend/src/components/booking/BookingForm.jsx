import { useState, useEffect, useContext } from 'react';
import { BookingContext } from '../../context/BookingContext';
import { AuditoriumContext } from '../../context/AuditoriumContext';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    auditoriumId: '',
    eventName: '',
    startDateTime: '',
    endDateTime: '',
    attendeeCount: '',
    purpose: ''
  });
  
  const [availableAuditoriums, setAvailableAuditoriums] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  
  const { createBooking, loading, error, clearError } = useContext(BookingContext);
  const { checkAvailability, auditoriums, getAuditoriums } = useContext(AuditoriumContext);
  
  const { auditoriumId, eventName, startDateTime, endDateTime, attendeeCount, purpose } = formData;

  useEffect(() => {
    getAuditoriums({ status: 'available' });
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
    if (error) clearError();
    if (successMsg) setSuccessMsg('');
  };

  const onDateChange = async () => {
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      
      if (start >= end) {
        setFormErrors({
          ...formErrors,
          endDateTime: 'End time must be after start time'
        });
        return;
      }
      
      // Check available auditoriums for the selected time slot
      const available = await checkAvailability(startDateTime, endDateTime);
      setAvailableAuditoriums(available);
      
      if (available.length === 0) {
        setFormErrors({
          ...formErrors,
          startDateTime: 'No auditoriums available for this time slot'
        });
      } else {
        // Clear any previous errors
        setFormErrors({
          ...formErrors,
          startDateTime: '',
          endDateTime: ''
        });
      }
    }
  };

  useEffect(() => {
    onDateChange();
  }, [startDateTime, endDateTime]);

  const validateForm = () => {
    const errors = {};
    
    if (!auditoriumId) errors.auditoriumId = 'Please select an auditorium';
    if (!eventName) errors.eventName = 'Event name is required';
    if (!startDateTime) errors.startDateTime = 'Start date and time are required';
    if (!endDateTime) errors.endDateTime = 'End date and time are required';
    if (!attendeeCount) errors.attendeeCount = 'Number of attendees is required';
    
    // Check if end time is after start time
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      
      if (start >= end) {
        errors.endDateTime = 'End time must be after start time';
      }
    }
    
    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Submit booking
    const { success, booking, error } = await createBooking(formData);
    
    if (success) {
      setSuccessMsg('Booking created successfully!');
      // Reset form
      setFormData({
        auditoriumId: '',
        eventName: '',
        startDateTime: '',
        endDateTime: '',
        attendeeCount: '',
        purpose: ''
      });
    } else if (error) {
      setFormErrors({ form: error });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Book an Auditorium</h2>
      
      {error && <Alert type="error" message={error} />}
      {formErrors.form && <Alert type="error" message={formErrors.form} />}
      {successMsg && <Alert type="success" message={successMsg} />}
      
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <FormInput
            label="Event Name"
            type="text"
            name="eventName"
            value={eventName}
            onChange={onChange}
            error={formErrors.eventName}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date & Time"
              type="datetime-local"
              name="startDateTime"
              value={startDateTime}
              onChange={onChange}
              error={formErrors.startDateTime}
              required
            />
            
            <FormInput
              label="End Date & Time"
              type="datetime-local"
              name="endDateTime"
              value={endDateTime}
              onChange={onChange}
              error={formErrors.endDateTime}
              required
            />
          </div>
          
          <FormInput
            label="Number of Attendees"
            type="number"
            name="attendeeCount"
            value={attendeeCount}
            onChange={onChange}
            error={formErrors.attendeeCount}
            required
          />
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Auditorium
            </label>
            <select
              name="auditoriumId"
              value={auditoriumId}
              onChange={onChange}
              className={`w-full px-3 py-2 border ${
                formErrors.auditoriumId ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Select an auditorium</option>
              {(availableAuditoriums.length > 0 ? availableAuditoriums : auditoriums).map((audi) => (
                <option key={audi._id} value={audi._id.toString()}>
                  {audi.name} (Capacity: {audi.capacity})
                </option>
              ))}
            </select>
            {formErrors.auditoriumId && (
              <p className="text-red-500 text-xs mt-1">{formErrors.auditoriumId}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Purpose
            </label>
            <textarea
              name="purpose"
              value={purpose}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          Book Auditorium
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;