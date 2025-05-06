'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { StarIcon } from 'lucide-react';

import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  CREATE_USER_STORY_RATING,
  generateApi,
  GET_USER_STORY_RATING,
} from '@/constants/api';

interface RateStoryProps {
  children: React.ReactNode;
  storyId: string;
  storyTitle: string;
  fetchStoryInfo?: () => Promise<void>;
}

const RateStory = ({
  children,
  storyTitle,
  storyId,
  fetchStoryInfo,
}: RateStoryProps) => {
  const [rating, setRating] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [haveRated, setHaveRated] = useState(false);

  const fetchUserStoryRating = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_USER_STORY_RATING, storyId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        if (response.data.rating !== null) {
          setHaveRated(true);
          setRating(response.data.rating);
        }
      } else {
        console.error('Error fetching user story rating:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user story rating:', error);
    }
  }, [storyId]);

  const handleRating = (newRating: number) => {
    if (newRating == 1 && rating == 1) {
      setRating(0);
      return;
    }
    setRating(newRating);
  };

  const handleToggleDialog = () => {
    setOpen((open) => !open);
    setRating(0);
    fetchUserStoryRating();
  };

  const handleSubmitRating = async () => {
    const token = Cookies.get('token');

    try {
      const data = {
        storyId: storyId,
        rating: rating,
      };
      const response = await axios.post(
        generateApi(CREATE_USER_STORY_RATING),
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        console.log('Rating submitted successfully:', response.data);
        if (fetchStoryInfo) {
          await fetchStoryInfo();
        }
      } else {
        console.error('Error submitting rating:', response.data);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      handleToggleDialog();
    }
  };

  useEffect(() => {
    fetchUserStoryRating();
  }, [fetchUserStoryRating]);

  return (
    <Dialog open={open} onOpenChange={handleToggleDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[350px] md:max-w-[400px] rounded-md">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="flex flex-col items-center gap-2">
            <span>Rate story</span>
            <span className="bg-rainbow text-transparent bg-clip-text font-bold text-center">
              {storyTitle}
            </span>
          </DialogTitle>
          <DialogDescription className="hidden">
            Rate this story
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex gap-3 justify-center">
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              onClick={() => handleRating(index + 1)}
              className="hover:cursor-pointer"
            >
              {index < rating ? (
                <StarIcon
                  key={index}
                  className="w-7 h-7 text-yellow-500 fill-yellow-500"
                  fill="yellow"
                />
              ) : (
                <StarIcon key={index} className="w-7 h-7" />
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-center items-center">
          {haveRated && (
            <span className="text-sm text-muted-foreground">
              You have rated this story {rating} star
            </span>
          )}
        </div>
        <div className="flex justify-center items-center">
          <button
            className="w-[120px] py-1 bg-[#8b5cf6] rounded-md text-sm active:scale-95 transition-all duration-200"
            onClick={handleSubmitRating}
          >
            Rate
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateStory;
