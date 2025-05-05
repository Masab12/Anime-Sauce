import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <FaSpinner 
        className={`animate-spin text-primary ${sizeClass} ${className}`}
        aria-label="Loading..."
      />
      <p className="mt-4 text-muted">Searching...</p>
    </div>
  );
};

export default LoadingSpinner;