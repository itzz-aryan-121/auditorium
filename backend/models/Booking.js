import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      auditorium: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auditorium',
        required: true
      },
      eventName: { 
        type: String, 
        required: true 
      },
      startDateTime: { 
        type: Date, 
        required: true 
      },
      endDateTime: { 
        type: Date, 
        required: true 
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
      },
      attendeeCount: { 
        type: Number, 
        required: true 
      },
      purpose: { 
        type: String 
      },
      department: { 
        type: String 
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;