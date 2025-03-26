import express from 'express';
import auth from '../middleware/auth.js';
import { cancelBookings, createBooking, getUserBookings } from '../controllers/BookingController.js';
const router = express.Router();

router.post('/', auth, createBooking);
router.get('/', auth, getUserBookings);
router.put('/cancel/:bookingId', auth, cancelBookings);

export default router;