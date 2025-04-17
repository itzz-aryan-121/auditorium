import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuditoriumContext } from '../../context/AuditoriumContext';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { formatDateForInput } from '../../utils/helpers';

const AvailabilityChecker = () => {
  const [dates, setDates] = useState({
    startDateTime: '',
    endDateTime: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const { checkAvailability, loading, error } = useContext(AuditoriumContext);
  const [availableAuditoriums, setAvailableAuditoriums] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);
  
  const { startDateTime, endDateTime } = dates;

  const onChange = (e) => {
    setDates({ ...dates, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!startDateTime) errors.startDateTime = 'Start date and time are required';
    if (!endDateTime) errors.endDateTime = 'End date and time are required';
    
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
    
    const available = await checkAvailability(startDateTime, endDateTime);
    setAvailableAuditoriums(available || []);
    setHasChecked(true);
  };

  return (
    <div>
      <Card className="mb-6">
        <div className="p-4">
          <h3 className="font-medium mb-4">Check Auditorium Availability</h3>
          
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            
            <Button
              type="submit"
              loading={loading}
            >
              Check Availability
            </Button>
          </form>
        </div>
      </Card>

      {hasChecked && (
        <div>
          <h3 className="font-medium mb-4">Available Auditoriums</h3>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          ) : availableAuditoriums.length === 0 ? (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md">
              No auditoriums available for the selected time slot.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableAuditoriums.map((auditorium) => (
                <Card key={auditorium._id} className="h-full flex flex-col">
                  <div className="p-4 flex-1">
                    <h4 className="font-semibold">{auditorium.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Location:</span> {auditorium.location}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Capacity:</span> {auditorium.capacity} people
                    </p>
                    
                    {auditorium.facilities && auditorium.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {auditorium.facilities.map((facility, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t mt-auto">
                    <Link 
                      to={`/bookings/new?auditoriumId=${auditorium._id}&startDateTime=${encodeURIComponent(startDateTime)}&endDateTime=${encodeURIComponent(endDateTime)}`}
                    >
                      <Button variant="primary" size="sm" className="w-full">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailabilityChecker;