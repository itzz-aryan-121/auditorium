import { createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../utils/api';

export const AuditoriumContext = createContext();

export const AuditoriumProvider = ({ children }) => {
  const [auditoriums, setAuditoriums] = useState([]);
  const [currentAuditorium, setCurrentAuditorium] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useContext(AuthContext);


  const getAuditoriums = async (filters = {}) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let queryString = '';
      if (filters.status) queryString += `status=${filters.status}`;
      if (filters.minCapacity) {
        queryString += queryString ? '&' : '';
        queryString += `minCapacity=${filters.minCapacity}`;
      }
      
      const url = `/api/auditoriums${queryString ? `?${queryString}` : ''}`;
      const res = await api.get(url);
      
      setAuditoriums(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch auditoriums');
      setLoading(false);
      return [];
    }
  };

  const checkAvailability = async (startDateTime, endDateTime) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.get(`/api/auditoriums/availability?startDateTime=${startDateTime}&endDateTime=${endDateTime}`);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to check availability');
      setLoading(false);
      return [];
    }
  };


  const createAuditorium = async (auditoriumData) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post('/api/auditoriums', auditoriumData);
      setAuditoriums([...auditoriums, res.data]);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create auditorium');
      setLoading(false);
      return false;
    }
  };


  const updateAuditorium = async (id, updates) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.put(`/api/auditoriums/${id}`, updates);
      
      setAuditoriums(
        auditoriums.map(auditorium => 
          auditorium._id === id ? res.data : auditorium
        )
      );
      
      if (currentAuditorium && currentAuditorium._id === id) {
        setCurrentAuditorium(res.data);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update auditorium');
      setLoading(false);
      return false;
    }
  };


  const deleteAuditorium = async (id) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/api/auditoriums/${id}`);
      
      setAuditoriums(auditoriums.filter(auditorium => auditorium._id !== id));
      
      if (currentAuditorium && currentAuditorium._id === id) {
        setCurrentAuditorium(null);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete auditorium');
      setLoading(false);
      return false;
    }
  };


  const updateAuditoriumStatus = async (auditoriumId, status) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.put('/api/admin/auditoriums/status', { auditoriumId, status });
      
      setAuditoriums(
        auditoriums.map(auditorium => 
          auditorium._id === auditoriumId ? res.data : auditorium
        )
      );
      
      if (currentAuditorium && currentAuditorium._id === auditoriumId) {
        setCurrentAuditorium(res.data);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update auditorium status');
      setLoading(false);
      return false;
    }
  };

  
  const clearError = () => setError(null);

  return (
    <AuditoriumContext.Provider
      value={{
        auditoriums,
        currentAuditorium,
        loading,
        error,
        getAuditoriums,
        checkAvailability,
        createAuditorium,
        updateAuditorium,
        deleteAuditorium,
        updateAuditoriumStatus,
        setCurrentAuditorium,
        clearError
      }}
    >
      {children}
    </AuditoriumContext.Provider>
  );
};