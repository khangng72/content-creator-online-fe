'use client';

import { Link } from '@/i18n/routing';
import {
  ChevronLeft,
  SquareMousePointer,
  SquarePen,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import StoryCard from './StoryCard';
import { BasicStoryInfo } from '@/types/Story';
import axios from 'axios';
import {
  DELETE_STORIES_BY_READING_LIST_ID,
  generateApi,
  GET_STORIES_BY_READING_LIST_ID,
} from '@/constants/api';
import Cookies from 'js-cookie';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SpecificReadListProps {
  readListId: string;
}

const SpecificReadList = ({ readListId }: SpecificReadListProps) => {
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [stories, setStories] = useState<BasicStoryInfo[] | null>(null);

  const [selectedStories, setSelectedStories] = useState<string[]>([]);

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
      console.error('Error fetching stories:', error);
    }
  }, [readListId]);

  const handleCancelSelectMode = () => {
    setSelectMode(false);
    setSelectedStories([]);
  };

  const handleSelectAll = () => {
    if (stories) {
      const allStoryIds = stories.map((story) => story.storyId);
      setSelectedStories(allStoryIds);
    }
  };

  const handleDeleteStories = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.delete(
        generateApi(DELETE_STORIES_BY_READING_LIST_ID, readListId),
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { storyIds: selectedStories },
        }
      );

      if (response.status === 200) {
        fetchStories();
      }
    } catch (error) {
      console.error('Error deleting stories:', error);
    } finally {
      setSelectedStories([]);
      setSelectMode(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  if (!stories) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="py-[100px] w-[98vw] md:w-[80vw] flex flex-col mx-auto">
        <div className="flex px-4 justify-between py-2 border-b-2 border-accent w-full text-muted-foreground">
          <Link
            className="text-muted-foreground hover:underline flex gap-1 items-center"
            href="/my_library/reading_lists"
          >
            <ChevronLeft className="w-3 h-3 md:w-5 md:h-5" />
            <span className="text-xs md:text-base">My Library</span>
          </Link>
          <div className="flex flex-col text-right max-w-[70%]">
            <h1 className="text-base md:text-3xl font-bold bg-rainbow text-transparent bg-clip-text">
              Read List title
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Read list description
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2 px-4">
          <button className="w-[120px] px-2 py-1 bg-foreground text-background hover:opacity-80 rounded-md text-sm flex justify-between items-center">
            <span>Edit Info</span>
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            className="w-[120px] px-2 py-1 bg-foreground text-background hover:opacity-80 rounded-md text-sm flex justify-between items-center"
            onClick={() => setSelectMode(true)}
          >
            <span>Select Story</span>
            <SquareMousePointer className="w-4 h-4" />
          </button>
        </div>

        <div
          className="grid gap-5 justify-center mt-6 
                grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-[90vw] xl:w-[80vw] mx-auto"
        >
          {stories.map((story: BasicStoryInfo) => {
            return (
              <StoryCard
                key={story.storyId}
                selectMode={selectMode}
                story={story}
                selectedStories={selectedStories}
                setSelectedStories={setSelectedStories}
              />
            );
          })}
        </div>
      </div>
      {selectMode && (
        <div className="fixed bottom-0 bg-card w-full px-7 py-4 flex justify-between items-center text-xs md:text-base">
          <div className="text-base">{selectedStories.length} selected</div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-background rounded-md hover:bg-accent"
              type="button"
              onClick={handleCancelSelectMode}
            >
              <span>Cancel</span>
            </button>

            <button
              className="px-3 py-2 bg-background rounded-md hover:bg-accent"
              type="button"
              onClick={handleSelectAll}
            >
              <span>Select All</span>
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="px-3 py-2 bg-background rounded-md hover:bg-accent"
                  type="button"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-normal text-left">
                    Are you sure want to delete {selectedStories.length} stories
                    ?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="text-left">
                  This action cannot be undone. This will permanently delete{' '}
                  {selectedStories.length} stories from your read list.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-500 hover:opacity-80"
                    onClick={handleDeleteStories}
                  >
                    Accept
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </>
  );
};

export default SpecificReadList;
