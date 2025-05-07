import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 10000
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token ? 'exists' : 'not found');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Ensure withCredentials is set for each request
    config.withCredentials = true;
    console.log('Request config:', {
      headers: config.headers,
      withCredentials: config.withCredentials
    });
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      console.error('Request config:', error.config);
    } else if (error.request) {
      console.error('No response received:', error.request);
      console.error('Request config:', error.config);
    }
    return Promise.reject(error);
  }
);

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
  getMyBookings: () => api.get('/bookings/me'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  // Admin functions
  getAllBookings: (filters) => api.get('/bookings/admin/all', { params: filters }),
  updateStatus: (id, data) => {
    console.log(`Making PATCH request to: /bookings/admin/${id}/status with data:`, data);
    return api.patch(`/bookings/admin/${id}/status`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }
};

export default api; 