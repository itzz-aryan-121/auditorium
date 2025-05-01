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
router.get('/:id', auth, getBookingById);

// Admin routes
router.get('/admin/all', auth, getAllBookings);
router.patch('/admin/:id/status', auth, updateBookingStatus);

module.exports = router; 