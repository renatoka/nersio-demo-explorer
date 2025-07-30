import React from 'react';
import { Animal } from '@/types/animal';

interface AnimalChipProps {
  animal: Animal;
  onClick: (animal: Animal) => void;
}

export default function AnimalChip({
  animal,
  onClick,
}: AnimalChipProps) {
  return (
    <div
      key={animal.id}
      className="flex justify-start items-center gap-2 hover:bg-neutral-100 hover:cursor-pointer hover:rounded-lg p-2"
      onClick={() => onClick(animal)}
    >
      <div
        className="w-9 h-9 rounded-full"
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
