
import Auditorium from '../models/Auditorium.js';
import Booking from '../models/Booking.js';

export const createAuditorium = async (req, res) => {
  try {
    const { 
      name, 
      capacity, 
      location, 
      facilities, 
      amenities 
    } = req.body;

    
    const existingAuditorium = await Auditorium.findOne({ name });
    if (existingAuditorium) {
      return res.status(400).json({ msg: 'Auditorium with this name already exists' });
    }

    const newAuditorium = new Auditorium({
      name,
      capacity,
      location,
      facilities: facilities || [],
      amenities: amenities || []
    });

    const auditorium = await newAuditorium.save();
    res.status(201).json(auditorium);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

export const getAuditoriums = async (req, res) => {
  try {
    const { status, minCapacity } = req.query;
    let query = {};

    if (status) query.status = status;
    if (minCapacity) query.capacity = { $gte: parseInt(minCapacity) };

    const auditoriums = await Auditorium.find(query);
    res.json(auditoriums);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

export const getAuditoriumAvailability = async (req, res) => {
  try {
    const { startDateTime, endDateTime } = req.query;

    if (!startDateTime || !endDateTime) {
      return res.status(400).json({ msg: 'Start and end dates are required' });
    }

    
    const conflictingBookings = await Booking.find({
      $or: [
        {
          startDateTime: { $lt: new Date(endDateTime) },
          endDateTime: { $gt: new Date(startDateTime) }
        }
      ],
      status: { $ne: 'rejected' }
    }).select('auditorium');

    
    const bookedAuditoriumIds = conflictingBookings.map(b => b.auditorium);

    
    const availableAuditoriums = await Auditorium.find({
      _id: { $nin: bookedAuditoriumIds },
      status: 'available'
    });

    res.json(availableAuditoriums);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

export const updateAuditorium = async (req, res) => {
  try {
    const { 
      name, 
      capacity, 
      location, 
      facilities, 
      amenities,
      status 
    } = req.body;

    const auditoriumFields = {};
    if (name) auditoriumFields.name = name;
    if (capacity) auditoriumFields.capacity = capacity;
    if (location) auditoriumFields.location = location;
    if (facilities) auditoriumFields.facilities = facilities;
    if (amenities) auditoriumFields.amenities = amenities;
    if (status) auditoriumFields.status = status;

    const auditorium = await Auditorium.findByIdAndUpdate(
      req.params.id,
      { $set: auditoriumFields },
      { new: true }
    );

    if (!auditorium) {
      return res.status(404).json({ msg: 'Auditorium not found' });
    }

    res.json(auditorium);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

export const deleteAuditorium = async (req, res) => {
  try {
   
    const activeBookings = await Booking.countDocuments({
      auditorium: req.params.id,
      status: { $in: ['pending', 'approved'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete auditorium with active bookings' 
      });
    }

    const auditorium = await Auditorium.findByIdAndDelete(req.params.id);

    if (!auditorium) {
      return res.status(404).json({ msg: 'Auditorium not found' });
    }

    res.json({ msg: 'Auditorium removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};