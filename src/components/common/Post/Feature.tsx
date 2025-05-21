'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bookmark, CircleEllipsis, MessageCircleWarning } from 'lucide-react';
import React, { useCallback, useEffect } from 'react';
import AddStoryToList from '../AddStoryToList/AddStoryToList';
import ReportFeature from './ReportFeature';
import Cookies from 'js-cookie';
import axios from 'axios';
import { CHECK_IF_USER_REPORTED, generateApi } from '@/constants/api';

interface FeatureProps {
  storyId: string;
  chapterId: string;
}

const Feature = ({ storyId, chapterId }: FeatureProps) => {
  const [isUserReported, setIsUserReported] = React.useState(false);

  const checkIfUserReported = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(CHECK_IF_USER_REPORTED, chapterId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsUserReported(response.data);
      } else {
        console.error('Error checking if user reported:', response.status);
      }
    } catch (error) {
      console.error('Error checking if user reported:', error);
    }
  }, [chapterId]);

  useEffect(() => {
    checkIfUserReported();
  }, [checkIfUserReported]);

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
          {isUserReported ? (
            <div className="text-muted-foreground">
              This chapter has been reported by you
            </div>
          ) : (
            <ReportFeature
              chapterId={chapterId}
              checkIfUserReported={checkIfUserReported}
            >
              <button className="flex gap-1 items-center hover:underline">
                <MessageCircleWarning className="w-4 h-4" />
                <span>Report</span>
              </button>
            </ReportFeature>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Feature;
