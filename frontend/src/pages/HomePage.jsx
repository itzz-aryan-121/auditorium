import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="py-12 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Auditorium Booking System
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Easily browse, book, and manage auditorium reservations for your events.
            Our streamlined platform helps you find the perfect venue for any occasion.
          </p>
          
          {isAuthenticated ? (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard">
                <Button variant="primary" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/auditoriums">
                <Button variant="outline" size="lg">
                  View Auditoriums
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="py-12 border-t">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                Find Available Auditoriums
              </h3>
              <p className="text-gray-600 text-center">
                Browse through our collection of auditoriums and filter by capacity, location, and amenities.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                Easy Booking Process
              </h3>
              <p className="text-gray-600 text-center">
                Select your preferred date and time, provide event details, and submit your booking request.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                Manage Your Bookings
              </h3>
              <p className="text-gray-600 text-center">
                View, modify or cancel your bookings at any time through your personalized dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 border-t">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <span className="text-xl font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up with your details to access our complete range of services.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <span className="text-xl font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Browse Available Auditoriums</h3>
                <p className="text-gray-600">
                  Search through our selection of auditoriums with various capacities and facilities.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <span className="text-xl font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Book Your Auditorium</h3>
                <p className="text-gray-600">
                  Reserve your chosen auditorium by providing event details and submitting your request.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <span className="text-xl font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Receive Confirmation</h3>
                <p className="text-gray-600">
                  Once approved, you'll receive a confirmation notification for your booking.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 border-t">
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Book Your Auditorium?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our platform today and enjoy a seamless booking experience for all your event needs.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <Button variant="primary">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">
                    Login
                  </Button>
                </Link>
              </div>
            )}
            {isAuthenticated && (
              <Link to="/auditoriums">
                <Button variant="primary">
                  Browse Auditoriums
                </Button>
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;