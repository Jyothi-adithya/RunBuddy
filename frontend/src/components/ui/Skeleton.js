import React from 'react';

const Skeleton = ({ className = '' }) => {
  return <div className={`animate-pulse rounded-soft bg-ink-100/90 ${className}`} aria-hidden="true" />;
};

export default Skeleton;
