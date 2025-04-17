import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuditoriumContext } from '../../context/AuditoriumContext';
import { AuthContext } from '../../context/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { getStatusClass } from '../../utils/helpers';

const AuditoriumList = () => {
  const [filters, setFilters] = useState({
    status: '',
    minCapacity: ''
  });
  
  const { getAuditoriums, auditoriums, loading, error } = useContext(AuditoriumContext);
  const { user } = useContext(AuthContext);
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    getAuditoriums(filters);
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold mb-4 md:mb-0">All Auditoriums</h2>
        
        {isAdmin && (
          <Link to="/admin/auditoriums/new">
            <Button variant="primary" size="sm">
              Add New Auditorium
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="font-medium mb-3">Filter Auditoriums</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="booked">Booked</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Capacity
            </label>
            <input
              type="number"
              name="minCapacity"
              value={filters.minCapacity}
              onChange={handleFilterChange}
              placeholder="Enter minimum capacity"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={() => getAuditoriums(filters)}
              className="w-full md:w-auto"
              variant="primary"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}

      {auditoriums.length === 0 ? (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md">
          No auditoriums found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auditoriums.map((auditorium) => (
            <Card 
              key={auditorium._id}
              className="h-full flex flex-col"
            >
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{auditorium.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(auditorium.status)}`}>
                    {auditorium.status}
                  </span>
                </div>
                
                <div className="mt-3 text-sm text-gray-600">
                  <p><span className="font-medium">Location:</span> {auditorium.location}</p>
                  <p><span className="font-medium">Capacity:</span> {auditorium.capacity} people</p>
                  
                  {auditorium.facilities && auditorium.facilities.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Facilities:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {auditorium.facilities.map((facility, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Link to={`/auditoriums/${auditorium._id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  
                  {auditorium.status === 'available' && (
                    <Link to={`/bookings/new?auditoriumId=${auditorium._id}`}>
                      <Button variant="primary" size="sm">
                        Book Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditoriumList;