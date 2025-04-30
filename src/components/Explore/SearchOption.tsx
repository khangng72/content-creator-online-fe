import { Link } from '@/i18n/routing';
import React from 'react';

interface SearchOptionProps {
  searchOption: string;
  searchQuery: string;
}

const searchOptions = [
  { id: 'story', label: 'Story', link: 'stori' },
  { id: 'user', label: 'User', link: 'user' },
];

const SearchOption = ({ searchOption, searchQuery }: SearchOptionProps) => {
  return (
    <div className="w-[95vw] sm:w-[60vw] mt-3 py-2 px-3 rounded-md mx-auto">
      <div className="flex border-b-2 border-muted-foreground">
        {searchOptions.map((tab, index) => (
          <Link
            key={index}
            className={`flex-1 p-2 text-center text-xl md:text-2xl ${
              searchOption === tab.id
                ? 'border-b-[7px] border-[#8B5CF6] bg-rainbow text-transparent bg-clip-text font-bold text-[1.25rem]'
                : 'text-muted-foreground hover:secondary'
            }`}
            href={`/explore/${tab.link}/${searchQuery}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchOption;
