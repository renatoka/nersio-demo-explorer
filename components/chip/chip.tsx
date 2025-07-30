import React from 'react';
import { Animal } from '@/types/animal';

interface AnimalChipProps {
  animal: Animal;
  onClick: (animal: Animal) => void;
}

export default function AnimalChip({ animal, onClick }: AnimalChipProps) {
  return (
    <div
      key={animal.id}
      className="flex items-center justify-start gap-2 p-2 hover:cursor-pointer hover:rounded-lg hover:bg-neutral-100"
      onClick={() => onClick(animal)}
    >
      <div
        className="h-9 w-9 rounded-full"
        style={{
          backgroundColor: animal.color,
        }}
      ></div>
      <div className="flex flex-col gap-1">
        <h3>{animal.name}</h3>
        <p className="text-[12px] leading-3.5 font-normal text-neutral-500 capitalize">
          {animal.species}
        </p>
      </div>
    </div>
  );
}
