const Booking = require('../models/Booking');
const { parseISO } = require('date-fns');

const createBooking = async (req, res) => {
  try {
    const { auditoriumId, date, startTime, endTime } = req.body;
    const userId = req.userId;

    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({
      auditoriumId,
      date: parseISO(date),
      startTime,
      endTime
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create new booking
    const booking = new Booking({
      userId,
      auditoriumId,
      date: parseISO(date),
      startTime,
      endTime
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({ userId })
      .populate('auditoriumId', 'name location')
      .sort({ date: -1, startTime: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings
}; 