const Auditorium = require('../models/Auditorium');
const Booking = require('../models/Booking');
const { format, parseISO, addHours } = require('date-fns');

const getAllAuditoriums = async (req, res) => {
  try {
    const auditoriums = await Auditorium.find();
    res.json(auditoriums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAuditorium = async (req, res) => {
  try {
    const { name, location, capacity } = req.body;
    
    // Validate required fields
    if (!name || !location || !capacity) {
      return res.status(400).json({ message: 'Name, location, and capacity are required' });
    }

    // Create new auditorium
    const auditorium = new Auditorium({
      name,
      location,
      capacity: parseInt(capacity)
    });

    await auditorium.save();
    res.status(201).json(auditorium);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Only consider bookings that are not rejected
    const bookings = await Booking.find({
      auditoriumId: id,
      date: parseISO(date),
      status: { $in: ['pending', 'approved'] }
    });

    // Generate all possible time slots (8am to 8pm, 1-hour blocks)
    const timeSlots = [];
    let startTime = parseISO(`${date}T08:00:00`);
    const endTime = parseISO(`${date}T20:00:00`);

    while (startTime < endTime) {
      const slotEndTime = addHours(startTime, 1);
      const slot = {
        startTime: format(startTime, 'HH:mm'),
        endTime: format(slotEndTime, 'HH:mm'),
        isAvailable: true
      };

      // Check if this slot is booked
      const isBooked = bookings.some(booking => 
        booking.startTime === slot.startTime && booking.endTime === slot.endTime
      );

      if (isBooked) {
        slot.isAvailable = false;
      }

      timeSlots.push(slot);
      startTime = slotEndTime;
    }

    res.json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAuditoriums,
  createAuditorium,
  getAvailability
}; 