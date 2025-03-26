import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import auth from './routes/auth.js';
import admin from './routes/admin.js';
import bookings from './routes/bookings.js';
import auditoriumRoutes from './routes/auditoriums.js';
import userRoutes from './routes/users.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();


connectDB();


app.use(cors());
app.use(express.json({ extended: false }));


app.use('/api/auth',auth);
app.use('/api/admin',admin);
app.use('/api/bookings',bookings);
app.use('/api/auditoriums',auditoriumRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});