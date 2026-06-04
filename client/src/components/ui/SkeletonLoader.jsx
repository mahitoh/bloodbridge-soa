import React from 'react';

const SkeletonLoader = ({ 
  height = 16, 
  width = 'full', 
  className = '', 
  animate = true 
}) => {
  const widthStyle = width === 'full' ? 'w-full' : `w-${width}`;
  
  return (
    <div 
      className={`${animate ? 'animate-pulse' : 'bg-gray-200'} ${widthStyle} h-${height} rounded ${className}`} 
    />
  );
};

export default SkeletonLoader;
