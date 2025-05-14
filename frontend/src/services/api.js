import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  updateProfile: (data) => api.patch('/auth/me', data),
  updatePassword: (data) => api.patch('/auth/me/password', data)
};

const auditoriums = {
  getAll: () => api.get('/auditoriums'),
  getAvailability: (id, date) => api.get(`/auditoriums/${id}/availability?date=${date}`)
};

const bookings = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/me'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  // Admin functions
  getAllBookings: (filters) => api.get('/bookings/admin/all', { params: filters }),
  updateStatus: (id, data) => api.patch(`/bookings/admin/${id}/status`, data)
};

// Upload service
const upload = {
  profilePic: async (file) => {
    const formData = new FormData();
    formData.append('profilePic', file);
    
    const response = await api.post('/upload/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export { auth, bookings, upload, auditoriums };
export default api; 