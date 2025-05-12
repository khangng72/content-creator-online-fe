import StarRating from '@/components/Explore/StarRating';
import StoriImage from '@/components/ui/StoriImage';
import { Link } from '@/i18n/routing';
import { BasicStoryInfo } from '@/types/Story';
import { EyeIcon, PlusIcon, TableOfContents } from 'lucide-react';
import React, { forwardRef } from 'react';
import AddStoryToList from '../AddStoryToList/AddStoryToList';
import DOMPurify from 'dompurify';

interface StoryCardProps {
  story: BasicStoryInfo;
  addToList?: boolean;
}

const StoryCard = forwardRef<HTMLDivElement, StoryCardProps>(
  ({ story, addToList = true }: StoryCardProps, ref) => {
    return (
      <div
        key={story.storyId}
        className="flex flex-col justify-start items-center bg-card rounded-md p-4 relative"
        ref={ref}
      >
        <StoriImage
          source={story.coverImageUri}
          storyTitle={story.storyTitle}
        />

        <Link href={`/stori/${story.storyId}`}>
          <h2 className="text-xl font-semibold hover:underline mt-3">
            {story.storyTitle}
          </h2>
        </Link>
        <Link
          href={`/profile/${story.userId}/about`}
          className="text-muted-foreground hover:underline"
        >
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

        <div
          className="mt-3 w-[90%] text-justify text-muted-foreground bg-secondary px-4 py-2 text-sm rounded-tl-3xl rounded-br-3xl"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              story.storyDescription.slice(0, 200) + '</p>'
            ),
          }}
        ></div>

        {addToList && (
          <AddStoryToList storyId={story.storyId}>
            <button className="absolute -top-3 -right-2 bg-secondary hover:bg-accent rounded-full p-1 border-[1px] border-foreground">
              <PlusIcon />
            </button>
          </AddStoryToList>
        )}
      </div>
    );
  }
);

StoryCard.displayName = 'StoryCard';
export default StoryCard;
