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

  useEffect(() => {
    if (sideBarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sideBarOpen]);

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
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

  const handleClose = () => {
    setSidebarOpen(false);
    setSelectedAnimal(null);
    setSelectedAnimalSwitcherType('prey');
  };

  const filteredAnimals = data.animals.filter((animal) =>
    animal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleAnimals = filteredAnimals.slice(0, visibleCount);

  return (
    <div className="h-screen overflow-hidden p-2">
      <div
        className={`flex h-full w-full flex-col overflow-hidden md:flex-row ${
          sideBarOpen ? 'gap-2' : 'gap-0'
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex-shrink-0">
            <Heading
              headingText="Animal Finder"
              searchable={true}
              onSearchChange={handleSearchChange}
            />
          </div>
          <div className="flex min-h-0 w-full flex-1 rounded-b-lg border-[1px] border-b border-neutral-300 bg-[#fbfbfb] p-3 sm:p-6">
            <div
              className="grid w-full grid-cols-1 gap-3 overflow-y-auto overscroll-contain sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
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
                  <div className="text-center text-sm">
                    Loading more animals... ({visibleCount} of{' '}
                    {filteredAnimals.length})
                  </div>
                </div>
              )}
              {searchQuery && filteredAnimals.length === 0 && (
                <div className="col-span-full flex justify-center py-8">
                  <div className="px-4 text-center text-neutral-600">
                    No animals found matching "{searchQuery}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {sideBarOpen && selectedAnimal !== null && (
          <div className="hidden w-full max-w-80 flex-col overflow-hidden md:flex">
            <div className="flex-shrink-0">
              <Heading
                headingText={
                  selectedAnimal ? selectedAnimal.name : 'Animal Details'
                }
                searchable={false}
                closable={true}
                onClose={handleClose}
              />
            </div>
            <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-b-lg border-[1px] border-b border-neutral-300 bg-[#fbfbfb]">
              <div className="mt-6 flex h-fit w-full flex-shrink-0 flex-col justify-center">
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
              <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-hidden p-4">
                <div className="flex h-9 w-full flex-shrink-0 gap-2 rounded-md bg-neutral-100 p-1">
                  <div
                    className={`${
                      selectedAnimalSwitcherType === 'prey'
                        ? 'bg-white'
                        : 'bg-neutral-100'
                    } flex h-7 w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm px-[6px] py-[10px]`}
                    onClick={() => setSelectedAnimalSwitcherType('prey')}
                  >
                    <FontAwesomeIcon
                      icon={faUtensils}
                      className="h-4 w-[13px]"
                    />
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
                <div className="min-h-0 w-full flex-1 overflow-y-auto overscroll-contain">
                  <div className="flex flex-col gap-2">
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
          </div>
        )}
      </div>

      {sideBarOpen && selectedAnimal !== null && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={handleClose}
          />

          <div className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col overflow-hidden">
            <div className="flex-shrink-0 bg-white px-4 pb-2">
              <Heading
                headingText={
                  selectedAnimal ? selectedAnimal.name : 'Animal Details'
                }
                searchable={false}
                closable={true}
                onClose={handleClose}
              />
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-3xl bg-[#fbfbfb]">
              <div className="flex-shrink-0 px-4 pt-4 pb-2">
                <div className="flex flex-col items-center">
                  <div
                    className="h-24 w-24 rounded-2xl sm:h-32 sm:w-32"
                    style={{ backgroundColor: selectedAnimal.color }}
                  ></div>
                  <div className="mt-2 flex flex-col text-center">
                    <h1 className="text-base sm:text-lg">
                      {selectedAnimal.name}
                    </h1>
                    <p className="mt-1 text-sm text-neutral-700 capitalize">
                      {selectedAnimal.species}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4">
                <div className="mb-3 flex-shrink-0">
                  <div className="flex h-10 w-full gap-2 rounded-md bg-neutral-100 p-1 sm:h-9">
                    <button
                      className={`${
                        selectedAnimalSwitcherType === 'prey'
                          ? 'bg-white'
                          : 'bg-neutral-100'
                      } flex h-8 w-full items-center justify-center gap-1.5 rounded-sm px-2 py-2 sm:h-7`}
                      onClick={() => setSelectedAnimalSwitcherType('prey')}
                    >
                      <FontAwesomeIcon
                        icon={faUtensils}
                        className="h-3 w-3 sm:h-4 sm:w-[13px]"
                      />
                      <p className="text-xs font-medium sm:text-sm">Prey</p>
                    </button>
                    <button
                      className={`${
                        selectedAnimalSwitcherType === 'predators'
                          ? 'bg-white'
                          : 'bg-neutral-100'
                      } flex h-8 w-full items-center justify-center gap-1.5 rounded-sm px-2 py-2 sm:h-7`}
                      onClick={() => setSelectedAnimalSwitcherType('predators')}
                    >
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="h-3 w-3 sm:h-4 sm:w-[13px]"
                      />
                      <p className="text-xs font-medium sm:text-sm">
                        Predators
                      </p>
                    </button>
                  </div>
                </div>

                <div className="-mx-4 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
                  <div className="flex flex-col gap-2 pb-4">
                    {selectedAnimalSwitcherType === 'prey' ? (
                      selectedAnimal.prey.length > 0 ? (
                        selectedAnimal.prey.map((preyId) => {
                          const preyAnimal = data.animals.find(
                            (animal) => animal.id === preyId
                          );
                          return (
                            preyAnimal && (
                              <div
                                key={preyAnimal.id}
                                className="rounded-lg active:bg-neutral-100"
                              >
                                <AnimalChip
                                  animal={preyAnimal}
                                  onClick={setSelectedAnimal}
                                />
                              </div>
                            )
                          );
                        })
                      ) : (
                        <div className="py-8 text-center text-sm text-neutral-600">
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
                            <div
                              key={predatorAnimal.id}
                              className="rounded-lg active:bg-neutral-100"
                            >
                              <AnimalChip
                                animal={predatorAnimal}
                                onClick={setSelectedAnimal}
                              />
                            </div>
                          )
                        );
                      })
                    ) : (
                      <div className="py-8 text-center text-sm text-neutral-600">
                        No predators found for this animal.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
