import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ToggleButtonProps {
  icon: IconDefinition;
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export default function ToggleButton({
  icon,
  label,
  isActive,
  onClick,
  className = '',
}: ToggleButtonProps) {
  const baseClasses =
    'flex h-7 w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm px-[6px] py-[10px]';
  const activeClasses = isActive ? 'bg-white' : 'bg-neutral-100';

  return (
    <button
      className={`${baseClasses} ${activeClasses} ${className}`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="h-4 w-[13px] flex-shrink-0" />
      <p className="text-sm font-medium whitespace-nowrap">{label}</p>
    </button>
  );
}
