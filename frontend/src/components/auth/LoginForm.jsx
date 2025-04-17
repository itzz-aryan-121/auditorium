import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import Alert from '../common/Alert';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  
  const { login, loading, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {error && <Alert type="error" message={error} />}
      
      <form onSubmit={onSubmit}>
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        
        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;