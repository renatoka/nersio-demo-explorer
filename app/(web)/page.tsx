'use client';

import { useEffect, useState } from 'react';
import { Animal } from '@/types/animal';
import { useQuery } from '@tanstack/react-query';
import AnimalInfo from '@/components/ui/animal/animal';
import Heading from '@/components/ui/heading/heading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import AnimalChip from '@/components/chip/chip';

export default function Home() {
  const [sideBarOpen, setSidebarOpen] = useState<boolean>(false);
  const [data, setData] = useState<{
    animals: Animal[];
    count: number;
  }>({
    animals: [],
    count: 0,
  });
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(50);
  const [selectedAnimalSwitcherType, setSelectedAnimalSwitcherType] = useState<
    'prey' | 'predators'
  >('prey');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: queryData } = useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      const response = await fetch('/api/animals');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (queryData) {
      setData({
        animals: queryData.data,
        count: queryData.count,
      });
    }
  }, [queryData]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const scrollContainer = document.querySelector('.overflow-y-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    setVisibleCount(50);
  }, [searchQuery]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 200 &&
      visibleCount < filteredAnimals.length
    ) {
      setVisibleCount((prev) => Math.min(prev + 50, filteredAnimals.length));
    }
  };

  const handleAnimalClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    setSidebarOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const filteredAnimals = data.animals.filter((animal) =>
    animal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleAnimals = filteredAnimals.slice(0, visibleCount);

  return (
    <div
      className={`flex h-screen max-h-screen w-full flex-col overflow-hidden md:flex-row ${
        sideBarOpen ? 'gap-2' : 'gap-0'
      }`}
    >
      <div className="flex w-full flex-col">
        <Heading
          headingText="Animal Finder"
          searchable={true}
          onSearchChange={handleSearchChange}
        />
        <div className="flex h-screen max-h-screen w-full rounded-b-lg border-[1px] border-b border-neutral-300 bg-[#fbfbfb] p-6">
          <div
            className="grid w-full grid-cols-1 gap-4 overflow-y-scroll md:grid-cols-2 xl:grid-cols-4"
            onScroll={handleScroll}
          >
            {visibleAnimals.map((animal) => (
              <AnimalInfo
                key={animal.id}
                animal={animal}
                handleAnimalClick={handleAnimalClick}
              />
            ))}
            {visibleCount < filteredAnimals.length && (
              <div className="col-span-full flex justify-center py-4">
                <div>
                  Loading more animals... ({visibleCount} of{' '}
                  {filteredAnimals.length})
                </div>
              </div>
            )}
            {searchQuery && filteredAnimals.length === 0 && (
              <div className="col-span-full flex justify-center py-8">
                <div className="text-neutral-600">
                  No animals found matching "{searchQuery}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {sideBarOpen && selectedAnimal !== null && (
        <div className="ml-auto flex h-screen max-h-screen w-full max-w-80 flex-col">
          <Heading
            headingText={
              selectedAnimal ? selectedAnimal.name : 'Animal Details'
            }
            searchable={false}
            closable={true}
            onClose={() => {
              setSidebarOpen(false);
              setSelectedAnimal(null);
            }}
          />
          <div className="flex h-screen max-h-screen w-full flex-col rounded-b-lg border-[1px] border-b border-neutral-300 bg-[#fbfbfb]">
            <div className="mt-6 flex h-fit w-full flex-col justify-center">
              <div className="flex flex-col items-center">
                <div
                  className="h-32 w-32 rounded-2xl"
                  style={{ backgroundColor: selectedAnimal.color }}
                ></div>
                <div className="mt-2 flex flex-col text-center">
                  <h1>{selectedAnimal.name}</h1>
                  <p className="mt-1 text-[14px] leading-6 text-neutral-700 capitalize">
                    {selectedAnimal.species}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex h-fit w-full flex-col gap-4 p-4">
              <div className="flex h-9 w-full gap-2 rounded-md bg-neutral-100 p-1">
                <div
                  className={`${
                    selectedAnimalSwitcherType === 'prey'
                      ? 'bg-white'
                      : 'bg-neutral-100'
                  } flex h-7 w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm px-[6px] py-[10px]`}
                  onClick={() => setSelectedAnimalSwitcherType('prey')}
                >
                  <FontAwesomeIcon icon={faUtensils} className="h-4 w-[13px]" />
                  <p className="text-sm font-medium">Prey</p>
                </div>
                <div
                  className={`${
                    selectedAnimalSwitcherType === 'predators'
                      ? 'bg-white'
                      : 'bg-neutral-100'
                  } flex h-7 w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm px-[6px] py-[10px]`}
                  onClick={() => setSelectedAnimalSwitcherType('predators')}
                >
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className="h-4 w-[13px]"
                  />
                  <p className="text-sm font-medium">Predators</p>
                </div>
              </div>
              <div className="flex h-[calc(100vh-350px)] w-full flex-col gap-2 overflow-y-scroll">
                {selectedAnimalSwitcherType === 'prey' ? (
                  selectedAnimal.prey.length > 0 ? (
                    selectedAnimal.prey.map((preyId) => {
                      const preyAnimal = data.animals.find(
                        (animal) => animal.id === preyId
                      );
                      return (
                        preyAnimal && (
                          <AnimalChip
                            key={preyAnimal.id}
                            animal={preyAnimal}
                            onClick={setSelectedAnimal}
                          />
                        )
                      );
                    })
                  ) : (
                    <div className="text-sm text-neutral-600">
                      No prey found for this animal.
                    </div>
                  )
                ) : selectedAnimal.predators.length > 0 ? (
                  selectedAnimal.predators.map((predatorId) => {
                    const predatorAnimal = data.animals.find(
                      (animal) => animal.id === predatorId
                    );
                    return (
                      predatorAnimal && (
                        <AnimalChip
                          key={predatorAnimal.id}
                          animal={predatorAnimal}
                          onClick={setSelectedAnimal}
                        />
                      )
                    );
                  })
                ) : (
                  <div className="text-sm text-neutral-600">
                    No predators found for this animal.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
