import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import bcrypt from 'bcryptjs';

export const registeruser  = async (req, res) => {
    const { name, email, password, department, contactNumber } = req.body;

  try {
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }


    user = new User({
      name,
      email,
      password,
      department,
      contactNumber
    });


    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

   
    await user.save();


    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

   
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
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const loginuser = async (req, res) => {
    const { email, password } = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token, 
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
        }
      );
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


export const getuser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};