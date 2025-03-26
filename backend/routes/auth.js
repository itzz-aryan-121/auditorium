import express from 'express';
import { getuser, loginuser, registeruser } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registeruser);
router.post('/login', loginuser);
router.get('/me', auth, getuser);

export default router;