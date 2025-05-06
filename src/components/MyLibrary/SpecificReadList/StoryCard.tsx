'use client';
import React from 'react';

import { Link } from '@/i18n/routing';
import { Check, EyeIcon, TableOfContents } from 'lucide-react';
import StarRating from '@/components/Explore/StarRating';
import { cn } from '@/lib/utils';
import { BasicStoryInfo } from '@/types/Story';
import StoriImage from '@/components/ui/StoriImage';

interface StoryCardProps {
  selectMode: boolean;
  story: BasicStoryInfo;
  selectedStories?: string[];
  setSelectedStories?: React.Dispatch<React.SetStateAction<string[]>>;
}

const StoryCard = ({
  selectMode,
  story,
  selectedStories,
  setSelectedStories,
}: StoryCardProps) => {
  const isSelected = selectedStories?.includes(story.storyId);

  const handleSelect = () => {
    if (setSelectedStories) {
      if (selectedStories?.includes(story.storyId)) {
        setSelectedStories((prev) => prev.filter((id) => id !== story.storyId));
      } else {
        setSelectedStories((prev) => [...prev, story.storyId]);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-card rounded-md p-4 relative shadow-md">
      <StoriImage source={story.coverImageUri} storyTitle={story.storyTitle} />

      <Link href="#">
        <h2 className="text-xl font-semibold hover:underline">
          {story.storyTitle}
        </h2>
      </Link>
      <Link href="#" className="text-muted-foreground hover:underline">
        by {story.userPost}
      </Link>
      <div className="flex gap-2 justify-center items-center">
        <div className="flex gap-1 items-center">
          <EyeIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {story.numberOfViews}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <TableOfContents className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {story.numberOfChapters}
          </span>
        </div>
      </div>
      <StarRating rating={story.averageRating} size={20} />

      <div className="mt-3 w-[90%] text-justify text-muted-foreground bg-secondary px-4 py-2 text-sm rounded-tl-3xl rounded-br-3xl">
        <p>{story.storyDescription.slice(0, 200)}...</p>
      </div>

      {selectMode && (
        <button
          className={cn(
            `absolute -top-3 -right-2 w-8 h-8  border-2 border-foreground rounded-full flex justify-center items-center`,
            isSelected ? 'bg-rainbow' : 'bg-card'
          )}
          onClick={handleSelect}
          type="button"
        >
          {isSelected && <Check />}
        </button>
      )}
    </div>
  );
};

export default StoryCard;
