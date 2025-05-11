import React from 'react';
import ChapterCard from './ChapterCard';
import { PlusIcon } from 'lucide-react';

const ContentTable = () => {
  return (
    <div className="py-3 flex flex-col gap-3">
      <div className="w-full pb-3 border-b border-accent px-3">
        <button className="bg-purpleRainbow px-3 py-1 text-sm rounded-md flex gap-1 items-center active:scale-95 transition-all duration-200 ease-in-out">
          <PlusIcon className="w-4 h-4" />
          <span>New Chapter</span>
        </button>
      </div>
      <ChapterCard />

      <ChapterCard />
    </div>
  );
};

export default ContentTable;
