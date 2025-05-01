const Booking = require('../models/Booking');
const User = require('../models/User');
const { parseISO } = require('date-fns');

const createBooking = async (req, res) => {
  try {
    const { auditoriumId, date, startTime, endTime, description } = req.body;
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
      endTime,
      description,
      status: 'pending'
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

// Admin: Get all bookings
const getAllBookings = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Get query parameters for filtering
    const { status, startDate, endDate } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: parseISO(startDate),
        $lte: parseISO(endDate)
      };
    } else if (startDate) {
      filter.date = { $gte: parseISO(startDate) };
    } else if (endDate) {
      filter.date = { $lte: parseISO(endDate) };
    }

    // Make sure to populate complete user and auditorium data
    const bookings = await Booking.find(filter)
      .populate('userId', 'name email')
      .populate('auditoriumId', 'name location capacity')
      .sort({ date: 1, startTime: 1 });

    // Process the data to ensure no null values
    const processedBookings = bookings.map(booking => {
      const bookingObj = booking.toObject();
      
      // Ensure userId is never null
      if (!bookingObj.userId) {
        bookingObj.userId = { name: 'Unknown User', email: 'No email available' };
      }
      
      // Ensure auditoriumId is never null
      if (!bookingObj.auditoriumId) {
        bookingObj.auditoriumId = { name: 'Unknown Auditorium', location: 'Unknown Location' };
      }
      
      return bookingObj;
    });

    res.json(processedBookings);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;
    
    console.log('Updating booking status:', { id, status, adminComment });

    // Check if user is admin
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      console.log('Access denied - user is not admin:', user);
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Check if booking exists
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status
    booking.status = status;
    if (adminComment) {
      booking.adminComment = adminComment;
    }

    // Save the updated booking
    await booking.save();

    // Populate the booking with user and auditorium details before sending response
    const updatedBooking = await Booking.findById(id)
      .populate('userId', 'name email')
      .populate('auditoriumId', 'name location capacity');

    // Convert to plain object and handle null values
    const bookingResponse = updatedBooking.toObject();
    
    // Ensure userId is never null
    if (!bookingResponse.userId) {
      bookingResponse.userId = { name: 'Unknown User', email: 'No email available' };
    }
    
    // Ensure auditoriumId is never null
    if (!bookingResponse.auditoriumId) {
      bookingResponse.auditoriumId = { name: 'Unknown Auditorium', location: 'Unknown Location' };
    }

    console.log('Booking status updated successfully:', { id, newStatus: status });
    res.json(bookingResponse);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: `Failed to update booking status: ${error.message}` });
  }
};

// Get booking details by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('userId', 'name email')
      .populate('auditoriumId', 'name location capacity');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is admin or booking owner
    const user = await User.findById(req.userId);
    if (!user.isAdmin && booking.userId._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  getBookingById
}; 