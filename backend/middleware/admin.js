import { configDotenv } from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
configDotenv();

const admin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ msg: 'Admin access required' });
          }


          next();
    } catch (error) {
        console.error(err);
    res.status(500).json({ msg: 'Server Error' });
    }
};

export default admin;