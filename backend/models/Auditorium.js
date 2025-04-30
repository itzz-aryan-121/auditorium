const mongoose = require('mongoose');

const auditoriumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

const Auditorium = mongoose.model('Auditorium', auditoriumSchema);

module.exports = Auditorium; 