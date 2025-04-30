# Auditorium Booking App

A web application for booking auditoriums. Users can view available auditoriums, check time slots, and make bookings.

## Features

- User authentication (register/login)
- View list of auditoriums
- Check availability for specific dates
- Book available time slots
- View personal bookings

## Tech Stack

### Frontend
- React
- Material-UI
- React Router
- Axios
- date-fns

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd auditorium-booking-app
```

2. Backend Setup:
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/auditorium-booking
JWT_SECRET=your-secret-key
PORT=5000
```

3. Frontend Setup:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start MongoDB service (if using local MongoDB)

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Auditoriums
- GET /api/auditoriums - Get all auditoriums
- GET /api/auditoriums/:id/availability?date=YYYY-MM-DD - Get availability for a specific date

### Bookings
- POST /api/bookings - Create a new booking
- GET /api/bookings/me - Get user's bookings

## License

MIT 