import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import FormInput from '../components/common/FormInput';
import DateTimePicker from '../components/common/DateTimePicker';
import SelectInput from '../components/common/SelectInput';

const NewBookingPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { createBooking, loading, error, clearErrors } = useContext(BookingContext);
  const [loadingAuditoriums, setLoadingAuditoriums] = useState(true);
  
  // Define the Raman Block auditorium
  const ramanBlockAuditorium = {
    _id: "raman-block-123", // Use the actual ID if available, or a placeholder
    name: "Raman Block",
    location: "Main Campus",
    capacity: 250
  };
  
  const [formData, setFormData] = useState({
    eventName: '',
    purpose: '',
    auditoriumId: ramanBlockAuditorium._id, // Pre-select Raman Block
    auditoriumName: ramanBlockAuditorium.name, // Save name for display
    startDateTime: '',
    endDateTime: '',
    attendeeCount: '',
    department: user?.department || '',
    additionalRequirements: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Simulate loading for consistency
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingAuditoriums(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    if (error) {
      clearErrors();
    }
  };

  const handleDateTimeChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.eventName) errors.eventName = 'Event name is required';
    if (!formData.startDateTime) errors.startDateTime = 'Start date and time is required';
    if (!formData.endDateTime) errors.endDateTime = 'End date and time is required';
    if (!formData.attendeeCount) errors.attendeeCount = 'Number of attendees is required';
    if (formData.attendeeCount && isNaN(formData.attendeeCount)) errors.attendeeCount = 'Attendee count must be a number';
    
    // Check if end time is after start time
    if (formData.startDateTime && formData.endDateTime) {
      const start = new Date(formData.startDateTime);
      const end = new Date(formData.endDateTime);
      
      if (end <= start) {
        errors.endDateTime = 'End time must be after start time';
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const success = await createBooking(formData);
    if (success) {
      navigate('/bookings');
    }
  };

  if (loadingAuditoriums) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">New Booking Request</h1>
        
        <Card>
          {error && <Alert type="error" message={error} className="mb-6" />}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormInput
                  label="Event Name"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  error={formErrors.eventName}
                  required
                />
              </div>
              
              <div>
                {/* Display the selected auditorium as read-only */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Auditorium
                  </label>
                  <div className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 bg-gray-50">
                    Raman Block auditorium (Main Campus) - Capacity: 250
                  </div>
                  <input
                    type="hidden"
                    name="auditoriumId"
                    value={formData.auditoriumId}
                  />
                </div>
              </div>
              
              <div>
                <FormInput
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  error={formErrors.department}
                />
              </div>
              
              <div>
                <DateTimePicker
                  label="Start Date & Time"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={(value) => handleDateTimeChange('startDateTime', value)}
                  error={formErrors.startDateTime}
                  required
                  minDate={new Date()}
                />
              </div>
              
              <div>
                <DateTimePicker
                  label="End Date & Time"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={(value) => handleDateTimeChange('endDateTime', value)}
                  error={formErrors.endDateTime}
                  required
                  minDate={formData.startDateTime ? new Date(formData.startDateTime) : new Date()}
                />
              </div>
              
              <div>
                <FormInput
                  label="Number of Attendees"
                  name="attendeeCount"
                  type="number"
                  value={formData.attendeeCount}
                  onChange={handleChange}
                  error={formErrors.attendeeCount}
                  required
                  min="1"
                />
              </div>
              
              <div className="md:col-span-2">
                <FormInput
                  label="Purpose of Event"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  error={formErrors.purpose}
                  multiline
                  rows={3}
                />
              </div>
              
              <div className="md:col-span-2">
                <FormInput
                  label="Additional Requirements"
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  error={formErrors.additionalRequirements}
                  multiline
                  rows={3}
                  placeholder="Audio/Visual equipment, seating arrangement, etc."
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/bookings')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={loading}
              >
                Submit Booking Request
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NewBookingPage;