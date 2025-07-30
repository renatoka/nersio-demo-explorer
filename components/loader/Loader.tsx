import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 ${sizeClasses[size]} ${className}`}
    />
  );
}

function LoadingState({
  message = 'Loading animals...',
  className = '',
}: LoadingStateProps) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-4 ${className}`}
    >
      <LoadingSpinner size="lg" />
      <p className="text-sm text-neutral-600">{message}</p>
    </div>
  );
}

export { LoadingSpinner, LoadingState };
