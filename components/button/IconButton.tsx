import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface IconButtonProps {
  icon: IconDefinition;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export default function IconButton({
  icon,
  onClick,
  className = 'flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 p-2 hover:cursor-pointer',
}: IconButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
