import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="w-full p-4 bg-surface rounded-lg border border-error/50 text-center my-4 animate-fade-in">
      <div className="flex items-center justify-center gap-2 text-error">
        <FaExclamationTriangle size={20} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;