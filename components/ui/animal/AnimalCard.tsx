'use client';
import { Animal } from '@/types/animal';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AnimalCardProps {
  animal: Animal;
  handleAnimalClick: (animal: Animal) => void;
}

export default function AnimalCard({
  animal,
  handleAnimalClick,
}: AnimalCardProps) {
  return (
    <div className="flex h-fit flex-col rounded-lg border-[1px] border-b border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start justify-start gap-2">
          <div
            className="h-9 w-9 rounded-full"
            style={{ backgroundColor: animal.color }}
          ></div>
          <div>
            <h2>{animal.name}</h2>
            <p className="text-[12px] leading-3.5 font-normal text-neutral-700 capitalize">
              {animal.species}
            </p>
          </div>
        </div>
        <div
          className="h-9 w-9 rounded-lg bg-neutral-50 p-2 hover:cursor-pointer"
          onClick={() => handleAnimalClick(animal)}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
      </div>
      <div className="my-2 border-t border-neutral-200" />
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-between gap-2">
          {Object.entries(animal).map(
            ([key, value]) =>
              key !== 'id' &&
              key !== 'name' &&
              key !== 'color' &&
              key !== 'species' && (
                <div
                  key={key}
                  className="flex w-full items-center justify-between"
                >
                  <span className="text-xs font-normal text-neutral-700 capitalize">
                    {key + '\u00A0'}
                  </span>
                  <span className="mt-3 flex-1 border-b border-dashed border-neutral-300"></span>
                  <span className="text-xs font-normal text-neutral-500 capitalize">
                    {'\u00A0'}
                    {Array.isArray(value) ? value.length : value}
                  </span>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
