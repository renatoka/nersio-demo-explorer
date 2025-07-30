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
    <div className="flex flex-col p-4 bg-white rounded-lg border-b border-[1px] border-neutral-200 h-fit">
      <div className="flex items-center justify-between">
        <div className="flex justify-start items-start gap-2">
          <div
            className="w-9 h-9 rounded-full"
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
          className="w-9 h-9 bg-neutral-50 rounded-lg p-2 hover:cursor-pointer"
          onClick={() => handleAnimalClick(animal)}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
      </div>
      <div className="border-t border-neutral-200 my-2" />
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
                  className="flex items-center justify-between w-full"
                >
                  <span className="text-xs font-normal text-neutral-700 capitalize">
                    {key + '\u00A0'}
                  </span>
                  <span className="flex-1 mt-3 border-b border-dashed border-neutral-300"></span>
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
