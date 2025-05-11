import StarRating from '@/components/Explore/StarRating';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import StoriImage from '@/components/ui/StoriImage';
import { Link } from '@/i18n/routing';
import { BasicStoryInfo } from '@/types/Story';
import {
  CircleAlert,
  Ellipsis,
  Eye,
  TableOfContents,
  Trash,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  DELETE_STORY_BY_ID,
  generateApi,
  GET_PUBLISHED_INFO,
} from '@/constants/api';
import { useToast } from '@/hooks/use-toast';

import UnpublishStoryBtn from './UnpublishStoryBtn';
import { timeAgo } from '@/utils/timeAgo';
import PublishStoryBtn from './PublishStoryBtn';

interface ManageStoryCardProps {
  story: BasicStoryInfo;
  fetchStories: () => Promise<void>;
}

interface PublishedInfo {
  storyId: string;
  published: number;
  draft: number;
}

const ManageStoryCard = ({ story, fetchStories }: ManageStoryCardProps) => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [publishedInfo, setPublishedInfo] = useState<PublishedInfo | null>(
    null
  );

  const handleDeleteStory = async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.delete(
        generateApi(DELETE_STORY_BY_ID, story.storyId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log('Story deleted successfully');
        toast({
          title: 'Story deleted successfully',
          description: 'Your story has been deleted.',
        });
        setOpen(false);
        fetchStories();
      } else {
        console.error('Failed to delete story');
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const fetchPublishedInfo = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_PUBLISHED_INFO, story.storyId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setPublishedInfo(response.data);
      } else {
        console.error('Failed to fetch published info');
      }
    } catch (error) {
      console.error('Error fetching published info:', error);
    }
  }, [story.storyId]);

  useEffect(() => {
    fetchPublishedInfo();
  }, [fetchPublishedInfo]);

  return (
    <div className="px-5 py-4 border-b border-accent flex items-start justify-between">
      <div className="flex gap-3 max-w-[90%]">
        <StoriImage
          source={story.coverImageUri}
          storyTitle={story.storyTitle}
          className="w-[80px] h-[120px] md:w-[120px] md:h-[180px] text-[8px] sm:text-xs"
        />

        <div className="flex flex-col gap-1">
          <Link
            href="#"
            className="font-bold text-sm sm:text-base md:text-lg hover:underline max-w-[95%]"
          >
            {story.storyTitle}
          </Link>
          <div className="text-xs sm:text-sm text-muted-foreground mt-1">
            <span className="text-purpleRainbow font-semibold">
              {publishedInfo?.published} published
            </span>
            {' - '}
            <span className="text-muted-foreground font-semibold">
              {publishedInfo?.draft} Draft
            </span>
          </div>
          <div className="text-muted-foreground text-xs sm:text-sm flex flex-col md:flex-row gap-1">
            <span>Created {timeAgo(story.createdTime)}</span>
            <span className="hidden md:inline"> - </span>
            <span>Updated {timeAgo(story.updatedTime)}</span>
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
        <Link
          href={`/mystory/manage/story-detail/${story.storyId}`}
          className="w-fit sm:w-[100px] px-4 py-1 bg-rainbow rounded-md text-xs sm:text-base text-center active:scale-95 transition-all duration-200 ease-in-out"
        >
          Edit
        </Link>
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1 border-2 border-accent text-muted-foreground rounded-md hover:bg-accent">
              <Ellipsis className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[130px] bg-card border border-accent shadow-md rounded-md p-3 text-xs sm:text-sm text-muted-foreground space-y-3"
            align="end"
          >
            {publishedInfo && publishedInfo?.published > 0 && (
              <UnpublishStoryBtn
                storyId={story.storyId}
                fetchPublishedStories={fetchStories}
                fetchPublishedInfo={fetchPublishedInfo}
              />
            )}

            {publishedInfo && publishedInfo?.published === 0 && (
              <PublishStoryBtn
                storyId={story.storyId}
                fetchStories={fetchStories}
                fetchPublishedInfo={fetchPublishedInfo}
              />
            )}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <button className="flex gap-2 hover:underline items-center">
                  <Trash className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex gap-1 items-center">
                    <CircleAlert className="w-5 h-5 fill-red-500" />
                    <span>Are you absolutely sure?</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your story and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDeleteStory}>
                    Accept
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ManageStoryCard;
