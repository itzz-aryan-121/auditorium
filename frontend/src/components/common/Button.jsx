import React from 'react';
import Spinner from './Spinner';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'outline':
        return 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'md':
        return 'px-4 py-2';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-md 
        font-medium 
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-500 
        focus:ring-offset-2
        transition
        ${disabled || loading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner size="sm" color="light" className="mr-2" />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;