import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Chapter } from '@/types/Chapter';
import { Eye, TableOfContents, ThumbsUp } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, GET_BASIC_INFO_STORY } from '@/constants/api';
import { BasicStoryInfo } from '@/types/Story';

interface ChapterStatisticsProps {
  currentChapter: Chapter | null;
}

const ChapterStatistics = ({ currentChapter }: ChapterStatisticsProps) => {
  const [storyInfo, setStoryInfo] = useState<BasicStoryInfo | null>(null);

  const fetchStoryInfo = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(
        generateApi(GET_BASIC_INFO_STORY, currentChapter?.storyId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setStoryInfo(response.data);
      } else {
        console.error('Error fetching story info:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching story info:', error);
    }
  }, [currentChapter]);

  useEffect(() => {
    if (currentChapter) {
      fetchStoryInfo();
    }
  }, [currentChapter, fetchStoryInfo]);

  return (
    <div className="flex justify-around min-w-[200px] text-sm md:text-base">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1 items-center">
              <Eye className="w-5 h-5" />
              <span>{storyInfo?.numberOfViews}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{storyInfo?.numberOfViews} people viewed this story</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1 items-center">
              <ThumbsUp className="w-5 h-5" />
              <span>{currentChapter?.numberOfLikes}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{currentChapter?.numberOfLikes} liked this chapter</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1 items-center">
              <TableOfContents className="w-5 h-5" />
              <span>{storyInfo?.numberOfChapters}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              This story has {storyInfo?.numberOfChapters} published chapters
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ChapterStatistics;
