import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ msg: 'No authentication token, authorization denied' });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.status(401).json({ msg: 'Token verification failed, authorization denied' });

        req.user = { id: verified.user.id }; ;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default auth;