import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        api.setToken(token);
        
        try {
          const res = await api.get('/api/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          api.setToken(null);
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError('Authentication failed. Please login again.');
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, [token]);
  
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post('/api/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      setLoading(false);
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      setLoading(false);
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    api.setToken(null);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.put('/api/users/profile', profileData);
      setUser(res.data);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Profile update failed');
      setLoading(false);
      return false;
    }
  };

  // Clear errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};