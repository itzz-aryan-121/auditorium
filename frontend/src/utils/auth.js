/**
 * Authentication utilities for token handling and user validation
 */

// Get token from local storage
export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Set token in local storage
  export const setToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
  };
  
  // Remove token from local storage
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
  // Parse JWT token to get user data
  export const parseToken = (token) => {
    if (!token) return null;
    
    try {
      // Extract the payload part of the JWT (second part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decode and parse the payload
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };
  
  // Check if the user has admin role
  export const isAdmin = (user) => {
    return user && user.role === 'admin';
  };
  
  // Check if token is expired
  export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const decoded = parseToken(token);
      if (!decoded || !decoded.exp) return true;
      
      // Check if expiration time has passed
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };
  
  // Format user data from API response
  export const formatUserData = (userData) => {
    if (!userData) return null;
    
    return {
      id: userData.id || userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      contactNumber: userData.contactNumber,
      createdAt: userData.createdAt
    };
  };
  
  export default {
    getToken,
    setToken,
    removeToken,
    isAuthenticated,
    parseToken,
    isAdmin,
    isTokenExpired,
    formatUserData
  };