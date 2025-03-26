import mongoose from 'mongoose';

const auditoriumSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
      },
      capacity: { 
        type: Number, 
        required: true 
      },
      location: { 
        type: String, 
        required: true 
      },
      facilities: [{ 
        type: String 
      }],
      status: {
        type: String,
        enum: ['available', 'maintenance', 'booked'],
        default: 'available'
      },
      amenities: [{
        name: String,
        available: Boolean
      }]
});

const Auditorium = mongoose.model('Auditorium', auditoriumSchema);

export default Auditorium;