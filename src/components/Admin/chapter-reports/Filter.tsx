import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import React from 'react';

const option = ['all', 'resolved', 'unresolved'] as const;

const optionMap = {
  all: 'All',
  resolved: 'Resolved',
  unresolved: 'Unresolved',
};

interface NewestOrOldestProps {
  setResolveState: (resolveState: 'all' | 'resolved' | 'unresolved') => void;
  resolveState: 'all' | 'resolved' | 'unresolved';
}

const Filter = ({ setResolveState, resolveState }: NewestOrOldestProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="items-center flex gap-1 text-sm bg-card hover:opacity-90 border border-accent rounded-md px-3 py-1">
          <span>{optionMap[resolveState]}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] bg-card border border-accent rounded-md p-2">
        <div className="flex flex-col gap-2 px-2 items-start">
          {option.map((opt) => (
            <button
              className="text-sm hover:opacity-90"
              key={opt}
              onClick={() => {
                setResolveState(opt);
              }}
            >
              {optionMap[opt]}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
