
import User from '../models/Users.js';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'bookings',
        model: 'Booking',
        populate: {
          path: 'auditorium',
          model: 'Auditorium'
        }
      });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

export const updateUserProfile = async (req, res) => {
  const { 
    name, 
    department, 
    contactNumber 
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          name, 
          department, 
          contactNumber 
        } 
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

export const getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalBookings = await Booking.countDocuments({ user: userId });

    
    const upcomingBookings = await Booking.find({ 
      user: userId, 
      startDateTime: { $gt: new Date() },
      status: { $in: ['pending', 'approved'] }
    })
    .sort({ startDateTime: 1 })
    .limit(5)
    .populate('auditorium', 'name');


    const eventsOrganized = await Event.countDocuments({ 
      organizer: userId 
    });


    const recentEvents = await Event.find({ 
      organizer: userId 
    })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('auditorium', 'name');

    res.json({
      totalBookings,
      upcomingBookings,
      eventsOrganized,
      recentEvents
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query, role, department } = req.query;

    let searchCriteria = {};

    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ];
    }

    if (role) searchCriteria.role = role;
    if (department) searchCriteria.department = department;

    const users = await User.find(searchCriteria)
      .select('-password')
      .limit(10);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};