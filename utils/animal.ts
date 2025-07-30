import { Animal } from '@/types/animal';

export const getRelatedAnimals = (
  selectedAnimal: Animal,
  allAnimals: Animal[],
  type: 'prey' | 'predators'
): Animal[] => {
  const relatedIds = selectedAnimal[type];
  return relatedIds
    .map((id) => allAnimals.find((animal) => animal.id === id))
    .filter((animal): animal is Animal => animal !== undefined);
};

export const getEmptyMessage = (type: 'prey' | 'predators'): string => {
  return `No ${type} found for this animal.`;
};
