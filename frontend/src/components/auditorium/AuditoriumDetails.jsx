import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuditoriumContext } from '../../context/AuditoriumContext';
import { AuthContext } from '../../context/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import { getStatusClass } from '../../utils/helpers';

const AuditoriumDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuditoriums, auditoriums, loading, error } = useContext(AuditoriumContext);
  const { user } = useContext(AuthContext);
  const [auditorium, setAuditorium] = useState(null);
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!auditoriums.length) {
      getAuditoriums();
    } else {
      const foundAuditorium = auditoriums.find(a => a._id === id);
      if (foundAuditorium) {
        setAuditorium(foundAuditorium);
      }
    }
  }, [id, auditoriums]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading && !auditorium) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!auditorium) {
    return <Alert type="warning" message="Auditorium not found" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/auditoriums')}
            className="mr-3 text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-xl font-bold">Auditorium Details</h2>
        </div>

        <div className="flex space-x-2">
          {isAdmin && (
            <Link to={`/admin/auditoriums/${id}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
          )}
          
          {auditorium.status === 'available' && (
            <Link to={`/bookings/new?auditoriumId=${id}`}>
              <Button variant="primary" size="sm">
                Book Now
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold">{auditorium.name}</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusClass(auditorium.status)}`}>
              {auditorium.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-3">Basic Information</h4>
              <div className="space-y-2">
                <p><span className="font-medium">Location:</span> {auditorium.location}</p>
                <p><span className="font-medium">Capacity:</span> {auditorium.capacity} people</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Facilities</h4>
              {auditorium.facilities && auditorium.facilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {auditorium.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No facilities listed</p>
              )}
            </div>
          </div>

          {auditorium.amenities && auditorium.amenities.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Amenities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {auditorium.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <span className={`mr-2 ${amenity.available ? 'text-green-500' : 'text-red-500'}`}>
                      {amenity.available ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-blue-700">Booking Information</h4>
            <p className="text-blue-600 mb-2">
              This auditorium is currently 
              <span className="font-medium">
                {auditorium.status === 'available' 
                  ? ' available for booking.' 
                  : auditorium.status === 'maintenance'
                  ? ' under maintenance and not available for booking.'
                  : ' currently booked.'}
              </span>
            </p>
            {auditorium.status === 'available' && (
              <Link to={`/bookings/new?auditoriumId=${id}`}>
                <Button variant="primary" className="mt-2">
                  Book This Auditorium
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditoriumDetails;