import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white py-4 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Auditorium Booking System. All rights reserved.
            </p>
          </div>
          <div className="flex justify-center md:justify-end space-x-6">
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
              Help
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;