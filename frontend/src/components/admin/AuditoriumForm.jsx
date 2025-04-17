import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuditoriumContext } from '../../context/AuditoriumContext';
import Card from '../common/Card';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';

const AuditoriumForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const { 
    createAuditorium, 
    updateAuditorium, 
    getAuditoriums,
    auditoriums,
    loading, 
    error, 
    clearError 
  } = useContext(AuditoriumContext);
  
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    location: '',
    facilities: [],
    amenities: [],
    status: 'available'
  });
  
  const [facilityInput, setFacilityInput] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const { name, capacity, location, facilities, status } = formData;

  useEffect(() => {
    if (isEditing) {
      // If editing, fetch auditoriums if not already loaded
      if (!auditoriums.length) {
        getAuditoriums();
      } else {
        const auditorium = auditoriums.find(a => a._id === id);
        if (auditorium) {
          setFormData({
            name: auditorium.name,
            capacity: auditorium.capacity,
            location: auditorium.location,
            facilities: auditorium.facilities || [],
            amenities: auditorium.amenities || [],
            status: auditorium.status
          });
        }
      }
    }
  }, [isEditing, id, auditoriums]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
    if (error) clearError();
    if (successMessage) setSuccessMessage('');
  };

  const handleFacilityInput = (e) => {
    setFacilityInput(e.target.value);
  };

  const addFacility = () => {
    if (facilityInput.trim()) {
      setFormData({
        ...formData,
        facilities: [...facilities, facilityInput.trim()]
      });
      setFacilityInput('');
    }
  };

  const removeFacility = (index) => {
    setFormData({
      ...formData,
      facilities: facilities.filter((_, i) => i !== index)
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!name) errors.name = 'Name is required';
    if (!capacity) errors.capacity = 'Capacity is required';
    if (capacity && isNaN(Number(capacity))) {
      errors.capacity = 'Capacity must be a number';
    }
    if (!location) errors.location = 'Location is required';
    
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
    
    // Prepare form data
    const auditoriumData = {
      ...formData,
      capacity: Number(capacity)
    };
    
    let success;
    if (isEditing) {
      success = await updateAuditorium(id, auditoriumData);
    } else {
      success = await createAuditorium(auditoriumData);
    }
    
    if (success) {
      setSuccessMessage(`Auditorium ${isEditing ? 'updated' : 'created'} successfully`);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/auditoriums');
      }, 2000);
    }
  };

  if (isEditing && loading && !formData.name) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">
        {isEditing ? 'Edit Auditorium' : 'Add New Auditorium'}
      </h2>
      
      <Card>
        <div className="p-4">
          {error && <Alert type="error" message={error} className="mb-4" />}
          
          {successMessage && (
            <Alert
              type="success"
              message={successMessage}
              className="mb-4"
              dismissible
              onDismiss={() => setSuccessMessage('')}
            />
          )}
          
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <FormInput
                label="Auditorium Name"
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                error={formErrors.name}
                required
              />
              
              <FormInput
                label="Capacity"
                type="number"
                name="capacity"
                value={capacity}
                onChange={onChange}
                error={formErrors.capacity}
                required
              />
              
              <FormInput
                label="Location"
                type="text"
                name="location"
                value={location}
                onChange={onChange}
                error={formErrors.location}
                required
              />
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={status}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Facilities
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={facilityInput}
                    onChange={handleFacilityInput}
                    placeholder="Add a facility"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addFacility}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
                
                {facilities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {facilities.map((facility, index) => (
                      <div 
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-md text-sm flex items-center"
                      >
                        <span>{facility}</span>
                        <button
                          type="button"
                          onClick={() => removeFacility(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/auditoriums')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                >
                  {isEditing ? 'Update Auditorium' : 'Create Auditorium'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AuditoriumForm;