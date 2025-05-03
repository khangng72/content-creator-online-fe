'use client';

import StorySearchCardList from './StorySearchCardList';

interface StorySearchResultProps {
  searchQuery: string;
}

const StorySearchResult = ({ searchQuery }: StorySearchResultProps) => {
  return (
    <div className="w-full lg:w-[90vw flex flex-col items-center mt-[10px]">
      <h2 className="text-3xl font-semibold italic">"{searchQuery}"</h2>

      <StorySearchCardList query={searchQuery} />
    </div>
  );
};

export default StorySearchResult;
