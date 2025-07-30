import React from 'react';
import { Animal } from '@/types/animal';
import AnimalChip from '../chip/Chip';

interface AnimalListProps {
  animals: Animal[];
  onAnimalClick: (animal: Animal) => void;
  emptyMessage: string;
  className?: string;
}

export default function AnimalList({
  animals,
  onAnimalClick,
  emptyMessage,
  className = 'flex flex-col gap-2',
}: AnimalListProps) {
  if (animals.length === 0) {
    return <div className="text-sm text-neutral-600">{emptyMessage}</div>;
  }

  return (
    <div className={className}>
      {animals.map((animal) => (
        <AnimalChip key={animal.id} animal={animal} onClick={onAnimalClick} />
      ))}
    </div>
  );
}
