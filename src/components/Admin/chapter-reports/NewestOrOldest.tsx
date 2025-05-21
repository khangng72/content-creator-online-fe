'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import React from 'react';

const option: Array<'asc' | 'desc'> = ['asc', 'desc'];

const optionMap = {
  desc: 'Newest',
  asc: 'Oldest',
};

interface NewestOrOldestProps {
  setSort: (sort: 'desc' | 'asc') => void;
  sort: 'desc' | 'asc';
}

const NewestOrOldest = ({ setSort, sort }: NewestOrOldestProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="items-center flex gap-1 text-sm bg-card hover:opacity-90 border border-accent rounded-md px-3 py-1">
          <span>{optionMap[sort]}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] bg-card border border-accent rounded-md p-2">
        <div className="flex flex-col gap-2 px-2 items-start">
          {option.map((opt) => (
            <span
              className="text-sm hover:opacity-90"
              key={opt}
              onClick={() => {
                setSort(opt as 'asc' | 'desc');
              }}
            >
              {optionMap[opt]}
            </span>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NewestOrOldest;
