import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import bcrypt from 'bcryptjs';

export const registeruser = async (req, res) => {
  const { name, email, password, department, contactNumber } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      department,
      contactNumber
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // Sign and return JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).send('Server error');
  }
};

export const loginuser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    // Sign and return JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id, // Changed from user?.id to user.id for consistency
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) { // Changed from error to err for consistency
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
};

export const getuser = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'No user ID found in request' });
    }
    
    const user = await User.findById(req.user.id).select('-password');
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).send('Server Error');
  }
};