import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../common/Card';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';

const UserProfile = () => {
  const { user, updateProfile, loading, error, clearError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    contactNumber: user?.contactNumber || ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const { name, department, contactNumber } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
    if (error) clearError();
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = () => {
    const errors = {};
    
    if (!name) errors.name = 'Name is required';
    
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
    
    const success = await updateProfile(formData);
    if (success) {
      setSuccessMessage('Profile updated successfully');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6">My Profile</h2>
      
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
              <div className="pb-4 border-b">
                <div className="font-medium text-gray-700 mb-2">Account Information</div>
                <div className="text-gray-600 text-sm mb-3">
                  <p>Email: {user?.email}</p>
                  <p>Role: {user?.role === 'admin' ? 'Administrator' : 'User'}</p>
                </div>
              </div>
              
              <FormInput
                label="Full Name"
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                error={formErrors.name}
                required
              />
              
              <FormInput
                label="Department"
                type="text"
                name="department"
                value={department}
                onChange={onChange}
                error={formErrors.department}
              />
              
              <FormInput
                label="Contact Number"
                type="text"
                name="contactNumber"
                value={contactNumber}
                onChange={onChange}
                error={formErrors.contactNumber}
              />
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={loading}
                >
                  Update Profile
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;