import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';
import SelectInput from '../common/SelectInput';

const RegisterForm = () => {
  const location = useLocation();
  const isAdminRegistration = location.pathname === '/register/admin';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    contactNumber: '',
    role: isAdminRegistration ? 'admin' : 'user',
    adminCode: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const { register, loading, error, clearError, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { name, email, password, confirmPassword, department, contactNumber, role, adminCode } = formData;

  // Allow switching between regular and admin registration modes
  const toggleAdminRegistration = () => {
    if (isAdminRegistration) {
      navigate('/register');
    } else {
      navigate('/register/admin');
    }
    
    setFormData({
      ...formData,
      role: !isAdminRegistration ? 'admin' : 'user',
      adminCode: ''
    });
  };
 
  useEffect(() => {
    // Only restrict admin page access if it's strictly admin-only in your requirements
    // Currently allowing access to the admin registration page, but will require admin code
    setFormData(prev => ({
      ...prev,
      role: isAdminRegistration ? 'admin' : 'user'
    }));
  }, [isAdminRegistration]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (password && password.length < 6) 
      errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) 
      errors.confirmPassword = 'Passwords do not match';
    if (role === 'admin' && !isAdmin && !adminCode)
      errors.adminCode = 'Admin code is required for administrator registration';
    
    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const { confirmPassword, ...registerData } = formData;
    
    const success = await register(registerData);
    if (success) {
      navigate('/dashboard');
    }
  };

  const roleOptions = [
    { value: 'user', label: 'Regular User' },
    { value: 'admin', label: 'Administrator' }
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isAdminRegistration ? 'Register New Administrator' : 'Register'}
      </h2>
      
      {error && <Alert type="error" message={error} />}
      
      <form onSubmit={onSubmit}>
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
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          error={formErrors.email}
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
        
        {/* Always show role selector but make it read-only if not admin */}
        <SelectInput
          label="Role"
          name="role"
          value={role}
          options={roleOptions}
          onChange={onChange}
          error={formErrors.role}
          disabled={!isAdmin && isAdminRegistration} // Disable if not an admin and on admin registration page
        />
        
        {/* Admin code field for non-admins trying to register as admins */}
        {role === 'admin' && !isAdmin && (
          <FormInput
            label="Admin Authorization Code"
            type="password"
            name="adminCode"
            value={adminCode}
            onChange={onChange}
            error={formErrors.adminCode}
            required
          />
        )}
        
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          error={formErrors.password}
          required
        />
        
        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          error={formErrors.confirmPassword}
          required
        />
        
        <Button
          type="submit"
          className="w-full mb-4"
          loading={loading}
        >
          {isAdminRegistration ? 'Create Administrator' : 'Register'}
        </Button>
        
        {/* Toggle between regular and admin registration */}
        <div className="text-center mt-4">
          <button 
            type="button"
            onClick={toggleAdminRegistration}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {isAdminRegistration 
              ? 'Switch to Regular User Registration' 
              : 'Switch to Admin Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;