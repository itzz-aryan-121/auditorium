import Booking from "../models/Booking.js";
import mongoose from 'mongoose';

export const createBooking = (async (req, res) => {
    const { 
        auditoriumId, 
        eventName, 
        startDateTime, 
        endDateTime, 
        attendeeCount, 
        purpose 
      } = req.body;

      try {
        // Convert auditoriumId string to ObjectId
        const auditoriumObjectId = new mongoose.Types.ObjectId(auditoriumId);
       
        const conflictingBooking = await Booking.findOne({
          auditorium: auditoriumObjectId,
          $or: [
            {
              startDateTime: { $lt: endDateTime },
              endDateTime: { $gt: startDateTime }
            }
          ],
          status: { $ne: 'rejected' }
        });
    
        if (conflictingBooking) {
          return res.status(400).json({ 
            msg: 'Auditorium is already booked for the selected time slot' 
          });
        }
    
        const newBooking = new Booking({
          user: req.user.id,
          auditorium: auditoriumObjectId,
          eventName,
          startDateTime,
          endDateTime,
          attendeeCount,
          purpose,
          department: req.user.department
        });
    
        const booking = await newBooking.save();
        
        await booking.populate('auditorium', 'name');
        await booking.populate('user', 'name email');
    
        res.status(201).json(booking);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
});

export const getUserBookings = (async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
          .populate('auditorium', 'name location')
          .sort({ createdAt: -1 });
        
        res.json(bookings);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
});

export const cancelBookings = (async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
          { 
            _id: req.params.bookingId, 
            user: req.user.id 
          },
          { status: 'rejected' },
          { new: true }
        );
    
        if (!booking) {
          return res.status(404).json({ msg: 'Booking not found' });
        }
    
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
});