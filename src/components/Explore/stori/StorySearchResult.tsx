'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import React, { useState } from 'react';
import StorySearchCardList from './StorySearchCardList';

interface StorySearchResultProps {
  searchQuery: string;
}

interface FilterType {
  id: 'averageRating' | 'createdDate';
  name: 'Average Rating' | 'Created Date';
}

interface SortType {
  id: 'asc' | 'desc';
  name: 'Ascending' | 'Descending';
}

const filterTypeList: FilterType[] = [
  {
    id: 'averageRating',
    name: 'Average Rating',
  },
  {
    id: 'createdDate',
    name: 'Created Date',
  },
];

const sortDirectionList: SortType[] = [
  {
    id: 'asc',
    name: 'Ascending',
  },
  {
    id: 'desc',
    name: 'Descending',
  },
];

const StorySearchResult = ({ searchQuery }: StorySearchResultProps) => {
  const [filter, setFilter] = useState<FilterType>({
    id: 'averageRating',
    name: 'Average Rating',
  });

  const [sort, setSort] = useState<SortType>({
    id: 'desc',
    name: 'Descending',
  });

  return (
    <div className="w-full lg:w-[90vw flex flex-col items-center mt-[10px]">
      <h2 className="text-3xl font-semibold italic">"{searchQuery}"</h2>

      {/* filter bar */}
      <div className="flex gap-2 mt-4 text-sm">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex gap-1 items-center bg-secondary px-2 py-1 rounded-md hover:opacity-90 w-[170px]">
              <span className="font-bold">Filter: </span>
              <span className="font-thin">{filter.name}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-card shadow-md text-sm w-[180px]">
            <div className="flex flex-col gap-2">
              {filterTypeList.map((filterType) => (
                <button
                  key={filterType.id}
                  className={`${
                    filter.id === filterType.id
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground'
                  } px-2 py-1 rounded-md hover:opacity-90`}
                  onClick={() => setFilter(filterType)}
                >
                  {filterType.name}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex gap-1 items-center bg-secondary px-2 py-1 rounded-md hover:opacity-90 w-[170px]">
              <span className="font-bold">Sort: </span>
              <span className="font-thin">{sort.name}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-card shadow-md text-sm w-[180px]">
            <div className="flex flex-col gap-2">
              {sortDirectionList.map((sortDirection) => (
                <button
                  key={sortDirection.id}
                  className={`${
                    sort.id === sortDirection.id
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground'
                  } px-2 py-1 rounded-md hover:opacity-90`}
                  onClick={() => setSort(sortDirection)}
                >
                  {sortDirection.name}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <StorySearchCardList query={searchQuery} />
    </div>
  );
};

export default StorySearchResult;
