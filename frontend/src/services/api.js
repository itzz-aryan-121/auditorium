import axios from 'axios';

const API_URL = 'http://localhost:7001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent hanging requests
  timeout: 10000
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
    } else if (error.request) {
      console.error('No response received:', error.request);
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
    return api.patch(`/bookings/admin/${id}/status`, data);
  }
};

export default api; 