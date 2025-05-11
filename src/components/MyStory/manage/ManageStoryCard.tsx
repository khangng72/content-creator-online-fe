import StarRating from '@/components/Explore/StarRating';
import StoriImage from '@/components/ui/StoriImage';
import { Link } from '@/i18n/routing';
import { BasicStoryInfo } from '@/types/Story';
import { Ellipsis, Eye, TableOfContents } from 'lucide-react';
import React from 'react';

interface ManageStoryCardProps {
  story: BasicStoryInfo;
}

const ManageStoryCard = ({ story }: ManageStoryCardProps) => {
  return (
    <div className="px-5 py-4 border-b border-accent flex items-start justify-between">
      <div className="flex gap-3 max-w-[80%]">
        <StoriImage
          source={story.coverImageUri}
          storyTitle={story.storyTitle}
          className="w-[80px] h-[120px] md:w-[120px] md:h-[180px] text-[8px] sm:text-xs"
        />

        <div className="flex flex-col gap-1">
          <Link
            href="#"
            className="font-bold text-sm sm:text-base md:text-lg hover:underline"
          >
            {story.storyTitle}
          </Link>
          <div className="text-xs sm:text-sm text-muted-foreground mt-1">
            <span className="text-purpleRainbow font-semibold">
              3 published
            </span>
            {' - '}
            <span className="text-muted-foreground font-semibold">2 Draft</span>
          </div>
          <StarRating rating={story.averageRating} size={14} />
          <div className="flex gap-3 text-muted-foreground text-xs sm:text-sm">
            <div className="flex gap-1 items-center">
              <Eye className="w-4 h-4" />
              <span>{story.numberOfViews}</span>
            </div>
            <div className="flex gap-1 items-center">
              <TableOfContents className="w-4 h-4" />
              <span>{story.numberOfChapters}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <button className="w-fit sm:w-[100px] px-4 py-1 bg-rainbow rounded-md text-xs sm:text-base">
          Edit
        </button>
        <button className="p-1 border-2 border-accent text-muted-foreground rounded-md">
          <Ellipsis className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ManageStoryCard;
