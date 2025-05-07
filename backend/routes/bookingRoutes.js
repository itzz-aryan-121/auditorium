const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  createBooking, 
  getUserBookings, 
  getAllBookings, 
  updateBookingStatus,
  getBookingById
} = require('../controllers/bookingController');

// User routes
router.post('/', auth, createBooking);
router.get('/me', auth, getUserBookings);

// Admin routes - must come before /:id route
router.get('/admin/all', auth, getAllBookings);
router.patch('/admin/:id/status', auth, updateBookingStatus);

// Public route for all bookings (for calendar)
router.get('/', getAllBookings);

// Generic routes
router.get('/:id', auth, getBookingById);

module.exports = router; 