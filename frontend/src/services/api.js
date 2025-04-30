import axios from 'axios';

const API_URL = 'http://localhost:7001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials)
};

export const auditoriums = {
  getAll: () => api.get('/auditoriums'),
  getAvailability: (id, date) => api.get(`/auditoriums/${id}/availability?date=${date}`)
};

export const bookings = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/me')
};

export default api; 