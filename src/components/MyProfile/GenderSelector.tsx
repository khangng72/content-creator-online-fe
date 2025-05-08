'use client';

import { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { genderMap } from '@/constants/common';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command';

export function GenderSelector() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex justify-between items-center bg-card px-2 py-2 rounded-md border border-accent ">
          {selected || 'Select gender'}
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[230px] p-0" align="center">
        <Command>
          <CommandInput placeholder="Search gender..." />
          <CommandEmpty>No nationality found.</CommandEmpty>
          <CommandGroup className="overflow-y-auto max-h-[200px] scroll-container">
            {Object.entries(genderMap).map(([value, label]) => (
              <CommandItem
                key={value}
                onSelect={() => {
                  setSelected(value);
                }}
                className="flex items-center justify-between hover:cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected === value ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
