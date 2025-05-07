const express = require('express');
const router = express.Router();
const { register, login, updateProfile, updatePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.patch('/me', auth, updateProfile);
router.patch('/me/password', auth, updatePassword);

module.exports = router; 