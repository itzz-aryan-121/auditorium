const express = require('express');
const router = express.Router();
const { getAllAuditoriums, getAvailability, createAuditorium } = require('../controllers/auditoriumController');

router.get('/', getAllAuditoriums);
router.post('/', createAuditorium);
router.get('/:id/availability', getAvailability);

module.exports = router; 