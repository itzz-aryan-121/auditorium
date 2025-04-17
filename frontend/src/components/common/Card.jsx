import React from 'react';

const Card = ({ 
  children, 
  title, 
  className = '', 
  headerClassName = '', 
  bodyClassName = '',
  actions
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className={`px-4 py-3 border-b ${headerClassName}`}>
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800">{title}</h3>
            {actions && <div className="flex space-x-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;