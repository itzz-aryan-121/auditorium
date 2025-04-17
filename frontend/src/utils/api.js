import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7001', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set token for all requests
const setToken = (token) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};

// Add token if it's in localStorage
const token = localStorage.getItem('token');
if (token) {
  setToken(token);
}

// Handle API requests
const apiService = {
  setToken,
  
 
  get: async (url) => {
    try {
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // POST request
  post: async (url, data) => {
    try {
      const response = await api.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // PUT request
  put: async (url, data) => {
    try {
      const response = await api.put(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // DELETE request
  delete: async (url) => {
    try {
      const response = await api.delete(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default apiService;