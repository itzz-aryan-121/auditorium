import React from 'react';

const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  placeholder = '',
  onChange,
  error,
  required = false,
  disabled = false,
  min,
  max,
  className = ''
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;