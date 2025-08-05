
import React from 'react';
import RizikyLoadingSpinner from '../RizikyLoadingSpinner';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  overlay?: boolean;
  text?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  overlay = false,
  text = "Chargement des données..."
}: LoadingSpinnerProps) => {
  return (
    <RizikyLoadingSpinner 
      size={size}
      className={className}
      overlay={overlay}
      text={text}
    />
  );
};

export default LoadingSpinner;
