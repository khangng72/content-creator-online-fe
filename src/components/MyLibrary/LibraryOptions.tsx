import { Link } from '@/i18n/routing';
import React from 'react';

const searchOptions = [
  { id: 'reading_lists', label: 'Reading Lists' },
  { id: 'current_reads', label: 'Current Reads' },
];

interface LibraryOptionsProps {
  currentTab: 'reading_lists' | 'current_reads';
}

const LibraryOptions = ({ currentTab }: LibraryOptionsProps) => {
  return (
    <div className="pt-[100px] w-[95vw] flex flex-col md:w-[80vw]  m-auto">
      <h1 className="md:px-0 text-5xl font-extrabold w-fit bg-rainbow text-transparent bg-clip-text">
        Library
      </h1>
      <div className="w-full mt-3 py-2 rounded-md">
        <div className="flex border-b-2 border-muted-foreground">
          {searchOptions.map((tab, index) => (
            <Link
              key={index}
              className={`flex-1 p-2 text-left text-md md:text-2xl ${
                currentTab === tab.id
                  ? 'border-b-[7px] border-[#8B5CF6] bg-rainbow text-transparent bg-clip-text font-bold'
                  : 'text-muted-foreground hover:secondary'
              }`}
              href={`/my_library/${tab.id}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryOptions;
