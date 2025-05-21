import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bookmark, CircleEllipsis, MessageCircleWarning } from 'lucide-react';
import React from 'react';
import AddStoryToList from '../AddStoryToList/AddStoryToList';
import ReportFeature from './ReportFeature';

interface FeatureProps {
  storyId: string;
  chapterId: string;
}

const Feature = ({ storyId, chapterId }: FeatureProps) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <CircleEllipsis
            className="text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-200 ease-in-out"
            size={23}
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-50 bg-card border border-accent shadow-md text-sm p-3 space-y-2"
          align="end"
        >
          <AddStoryToList storyId={storyId}>
            <button className="flex gap-1 items-center hover:underline">
              <Bookmark className="w-4 h-4" />
              <span>Add To Read List</span>
            </button>
          </AddStoryToList>
          <ReportFeature chapterId={chapterId}>
            <button className="flex gap-1 items-center hover:underline">
              <MessageCircleWarning className="w-4 h-4" />
              <span>Report</span>
            </button>
          </ReportFeature>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Feature;
