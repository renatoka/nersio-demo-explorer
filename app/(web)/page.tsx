'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Animal } from '@/types/animal';
import AnimalCard from '@/components/ui/animal/AnimalCard';
import { getRelatedAnimals, getEmptyMessage } from '@/utils/animal';
import { SwitcherType } from '@/types/common';
import AnimalList from '@/components/list/AnimalList';
import TabSwitcher, {
  ANIMAL_DETAIL_TABS,
} from '@/components/switcher/TabSwitcher';
import AnimalChip from '@/components/chip/Chip';
import Heading from '@/components/ui/heading/Heading';
import { LoadingState } from '@/components/loader/Loader';

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
  const [selectedAnimalSwitcherType, setSelectedAnimalSwitcherType] =
    useState<SwitcherType>('prey');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    data: queryData,
    isLoading,
    isError,
  } = useQuery({
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

  /*
   * Scroll to top on initial load
   * This ensures the user always starts at the top of the list
   */
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

  const relatedAnimals = selectedAnimal
    ? getRelatedAnimals(
        selectedAnimal,
        data.animals,
        selectedAnimalSwitcherType
      )
    : [];

  if (isError) {
    return (
      <div className="h-screen overflow-hidden p-2">
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div className="flex-shrink-0">
            <Heading headingText="Animal Finder" />
          </div>
          <div className="flex min-h-0 w-full flex-1 rounded-b-lg border-[1px] border-b border-neutral-300 bg-[#fbfbfb] p-3 sm:p-6">
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              <div className="text-center">
                <h2 className="mb-2 text-lg font-semibold text-neutral-900">
                  Something went wrong
                </h2>
                <p className="text-sm text-neutral-600">
                  Failed to load animals. Please try refreshing the page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              searchable={!isLoading}
              onSearchChange={handleSearchChange}
            />
          </div>
          <div className="flex min-h-0 w-full flex-1 rounded-b-lg border-[1px] border-b border-neutral-300 bg-[#fbfbfb] p-3 sm:p-6">
            {isLoading ? (
              <LoadingState message="Loading animals..." />
            ) : (
              <div
                className="grid w-full grid-cols-1 content-start items-start gap-3 overflow-y-auto overscroll-contain sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
                onScroll={handleScroll}
              >
                {visibleAnimals.map((animal) => (
                  <AnimalCard
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
            )}
          </div>
        </div>

        {/* Desktop Sidebar */}
        {sideBarOpen && selectedAnimal !== null && (
          <div className="hidden w-full max-w-80 flex-col overflow-hidden md:flex">
            <div className="flex-shrink-0">
              <Heading
                headingText={selectedAnimal.name}
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
                <div className="flex-shrink-0">
                  <TabSwitcher
                    tabs={ANIMAL_DETAIL_TABS}
                    activeTab={selectedAnimalSwitcherType}
                    onTabChange={(tab) =>
                      setSelectedAnimalSwitcherType(tab as 'prey' | 'predators')
                    }
                  />
                </div>
                <div className="min-h-0 w-full flex-1 overflow-y-auto overscroll-contain">
                  <AnimalList
                    animals={relatedAnimals}
                    onAnimalClick={setSelectedAnimal}
                    emptyMessage={getEmptyMessage(selectedAnimalSwitcherType)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      {sideBarOpen && selectedAnimal !== null && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={handleClose}
          />

          <div className="fixed inset-x-0 bottom-0 z-50 flex h-full max-h-[90vh] flex-col overflow-hidden">
            <div className="flex-shrink-0 bg-white px-4 pb-2">
              <Heading
                headingText={selectedAnimal.name}
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
                  <TabSwitcher
                    tabs={ANIMAL_DETAIL_TABS}
                    activeTab={selectedAnimalSwitcherType}
                    onTabChange={(tab) =>
                      setSelectedAnimalSwitcherType(tab as 'prey' | 'predators')
                    }
                    className="flex h-10 w-full gap-2 rounded-md bg-neutral-100 p-1 sm:h-9"
                  />
                </div>

                <div className="-mx-4 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
                  <div className="flex flex-col gap-2 pb-4">
                    {relatedAnimals.length > 0 ? (
                      relatedAnimals.map((animal) => (
                        <div
                          key={animal.id}
                          className="rounded-lg active:bg-neutral-100"
                        >
                          <AnimalChip
                            animal={animal}
                            onClick={setSelectedAnimal}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-sm text-neutral-600">
                        {getEmptyMessage(selectedAnimalSwitcherType)}
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
