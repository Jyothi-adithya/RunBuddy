import React from 'react';

const Card = ({ children, className = '', strong = false, ...props }) => {
  return (
    <div className={`${strong ? 'rb-glass-card-strong' : 'rb-glass-card'} p-6 md:p-7 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
