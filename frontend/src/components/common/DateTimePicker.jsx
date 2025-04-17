import React from 'react';

const DateTimePicker = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  minDate,
  maxDate
}) => {
  
  const formatDateForInput = (date) => {
    if (!date) return '';
    
    // If already in proper format, return as is
    if (typeof date === 'string' && date.includes('T')) {
      return date.substring(0, 16); // Cut off seconds and timezone
    }
    
    // Otherwise convert to proper format
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .substring(0, 16);
  };

  // Format min/max dates for the input if provided
  const formattedMinDate = minDate ? formatDateForInput(minDate) : '';
  const formattedMaxDate = maxDate ? formatDateForInput(maxDate) : '';
  
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type="datetime-local"
        value={formatDateForInput(value)}
        onChange={(e) => onChange(e.target.value)}
        min={formattedMinDate}
        max={formattedMaxDate}
        className={`shadow appearance-none border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
        required={required}
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default DateTimePicker;