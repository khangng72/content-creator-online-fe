import StarRating from '@/components/Explore/StarRating';
import { Ellipsis, Eye, TableOfContents } from 'lucide-react';
import React from 'react';

const ChapterCard = () => {
  return (
    <div className="border-b border-accent px-4 py-3 flex justify-between">
      <div className="flex flex-col gap-2 max-w-[90%]">
        <span className="font-semibold text-lg">
          Chapter Title Chapter Title Chapter Title Chapter Title Chapter Title
        </span>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex flex-col md:flex-row gap-2">
            <span className="text-muted-foreground">Draft</span>
            <span>Updated at February, 7th, 2002</span>
          </div>

          <StarRating rating={3} size={14} />
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 items-center">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">0</span>
            </div>

            <div className="flex gap-1 items-center">
              <TableOfContents className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">0</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button className="p-1 rounded-md border-2 border-accent text-muted-foreground hover:bg-accent transition-all duration-200 ease-in-out active:scale-95">
          <Ellipsis className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChapterCard;
