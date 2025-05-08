'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { BasicStoryInfo } from '@/types/Story';
import axios from 'axios';
import {
  CLONE_READ_LIST,
  generateApi,
  GET_READ_LIST_BY_ID,
  GET_STORIES_BY_READING_LIST_ID,
} from '@/constants/api';
import Cookies from 'js-cookie';

import { ReadList } from '@/types/ReadList';

import StoryCard from '../common/Stori/StoryCard';
import { Link } from '@/i18n/routing';
import { useToast } from '@/hooks/use-toast';
import AddToLibrarySuccessToast from './AddToLibrarySuccessToast';
import AddToLibraryFailToast from './AddToLibraryFailToast';

interface SpecificReadListProps {
  readListId: string;
}

const ReadListDetail = ({ readListId }: SpecificReadListProps) => {
  const [stories, setStories] = useState<BasicStoryInfo[] | null>(null);
  const [error, setError] = useState(false);
  const [readListInfo, setReadListInfo] = useState<ReadList | null>(null);
  const { toast } = useToast();

  const fetchStories = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_STORIES_BY_READING_LIST_ID, readListId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setStories(response.data.result);
      }
    } catch (error) {
      setError(true);
      console.error('Error fetching stories:', error);
    }
  }, [readListId]);

  const handleAddToLibrary = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(
        generateApi(CLONE_READ_LIST, readListId),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast({
          description: <AddToLibrarySuccessToast />,
          variant: 'default',
          duration: 1000,
        });
      } else {
        toast({
          description: <AddToLibraryFailToast />,
          variant: 'default',
          duration: 1000,
        });
      }
    } catch (error) {
      console.error('Error adding to library:', error);
      toast({
        description: <AddToLibraryFailToast />,
        variant: 'default',
      });
    }
  };

  const fetchReadListInfo = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_READ_LIST_BY_ID, readListId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setReadListInfo(response.data);
      }
    } catch (error) {
      setError(true);
      console.error('Error fetching read list info:', error);
    }
  }, [readListId]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  useEffect(() => {
    fetchReadListInfo();
  }, [fetchReadListInfo]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Error Loading Stories</p>
      </div>
    );
  }

  if (!stories) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="py-[100px] w-[95vw] xl:w-[80vw] flex flex-col mx-auto">
        <div className="flex px-4 justify-between py-2 border-b-2 border-accent w-full text-muted-foreground items-center">
          <div className="flex flex-col items-start max-w-[70%]">
            <h1 className="text-xl md:text-3xl font-bold bg-rainbow text-transparent bg-clip-text w-fit">
              {readListInfo?.read_list_title}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-bold">
              {readListInfo?.read_list_description}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {readListInfo?.number_of_stories} stories
            </p>
            <div className="text-xs md:text-sm text-muted-foreground">
              <span>This read list was created by</span>{' '}
              <Link href="#" className="inline hover:underline font-bold">
                {readListInfo?.user_name}
              </Link>
            </div>
          </div>
          <button
            className="px-3 py-1 bg-rainbow rounded-md h-fit text-white text-xs md:text-sm active:scale-95"
            type="button"
            onClick={handleAddToLibrary}
          >
            Add to your library
          </button>
        </div>

        <div
          className="grid gap-5 justify-center mt-6 
                grid-cols-1 sm:grid-cols-2 xl:grid-cols-3  mx-auto"
        >
          {stories.map((story: BasicStoryInfo) => {
            return <StoryCard story={story} key={story.storyId} />;
          })}
        </div>
      </div>
    </>
  );
};

export default ReadListDetail;
