import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { createAuditorium, deleteAuditorium, getAuditoriumAvailability, getAuditoriums, updateAuditorium } from '../controllers/auditoriumController.js';

const router = express.Router();

router.post('/', [auth, admin], createAuditorium);
router.get('/', auth, getAuditoriums);
router.get('/availability', auth, getAuditoriumAvailability)
router.put('/:id', [auth, admin], updateAuditorium);
router.delete('/:id', [auth, admin], deleteAuditorium);

export default router;