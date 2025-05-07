const { verifyToken } = require('../config/jwt');

const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Token received:', token.substring(0, 20) + '...');
    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.log('Token verification failed');
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('Token verified successfully, userId:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth; 