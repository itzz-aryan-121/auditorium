import Auditorium from "../models/Auditorium.js";
import Booking from "../models/Booking.js";
import User from "../models/Users.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const updaterole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true },

    ).select("-password");


    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.json(user);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const createAudi = async (req, res) => {
    const { name, capacity, location, facilities,  amenities } = req.body;

    try {
        const newAudi = new Auditorium({
            name,
            capacity,
            location,
            facilities,
            amenities
        });

        const audi = await newAudi.save();
        res.json(audi);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


export const updateAudiStatus = async (req, res) => {
    const { auditoriumId, status } = req.body;
    try {
        const auditorium = await Auditorium.findByIdAndUpdate(
          auditoriumId,
          { status },
          { new: true }
        );
    
        if (!auditorium) {
          return res.status(404).json({ msg: 'Auditorium not found' });
        }
    
        res.json(auditorium);

    }
    catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    

};

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
          .populate('user', 'name email')
          .populate('auditorium', 'name location')
          .sort({ createdAt: -1 });
        
        res.json(bookings);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
};

export const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;
    try {
        const booking = await Booking.findByIdAndUpdate(
          bookingId,
          { 
            status,
            approvedBy: req.user.id 
          },
          { new: true }
        );
    
        if (!booking) {
          return res.status(404).json({ msg: 'Booking not found' });
        }
    
        res.json(booking);

    }catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }   
}