import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { createAudi, getBookings, getUsers, updateAudiStatus, updateBookingStatus, updaterole } from '../controllers/adminControllers.js';

const router = express.Router();

router.get('/users', [auth, admin], getUsers);
router.put('/users/role', [auth, admin], updaterole);
router.post('/auditoriums', [auth, admin], createAudi);
router.put('/auditoriums/status', [auth, admin], updateAudiStatus );
router.get('/bookings', [auth, admin], getBookings);
router.put('/bookings/status', [auth, admin], updateBookingStatus);

export default router;