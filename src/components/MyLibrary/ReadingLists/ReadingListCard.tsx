import { ReadList } from '@/types/ReadList';
import React, { use, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import Cookies from 'js-cookie';
import {
  DELETE_READING_LIST_BY_ID,
  generateApi,
  GET_TOP_STORY_BY_READING_LIST_ID,
} from '@/constants/api';
import axios from 'axios';
import { BasicStoryInfo } from '@/types/Story';
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

interface ReadingListCardProps {
  readList: ReadList;
  fetchReadLists: () => Promise<void>;
}
const ReadingListCard = ({
  readList,
  fetchReadLists,
}: ReadingListCardProps) => {
  const [topStories, setTopStories] = useState<BasicStoryInfo[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTopStories = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(
          GET_TOP_STORY_BY_READING_LIST_ID,
          readList.read_list_id,
          'amount=5'
        ),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setTopStories(response.data.result);
      } else {
        setError(true);
        console.error('Error fetching reading lists:', response.data.message);
      }
    } catch (error) {
      setError(true);
      console.error('Error fetching reading lists:', error);
    } finally {
      setLoading(false);
    }
  }, [readList]);

  const handleDeleteReadList = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.delete(
        generateApi(DELETE_READING_LIST_BY_ID, readList.read_list_id),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        console.log('Read list deleted successfully');
      } else {
        setError(true);
        console.error('Error deleting read list:', response.data.message);
      }
    } catch (error) {
      setError(true);
      console.error('Error deleting read list:', error);
    } finally {
      fetchReadLists();
    }
  };

  useEffect(() => {
    fetchTopStories();
  }, [fetchTopStories]);

  return (
    <li className="flex flex-col bg-card p-3 md:p-5 rounded-md shadow-md">
      <div className="flex flex-col gap-[1px]">
        <h1 className="text-lg md:text-xl font-bold flex max-w-[300px]  md:max-w-[500px] hover:underline">
          <span>{readList.read_list_title}</span>
        </h1>
        <p className="text-xs md:text-base text-muted-foreground">
          {readList.number_of_stories} stories
        </p>
      </div>
      {topStories && topStories.length > 0 ? (
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            {topStories.map((story: BasicStoryInfo, index) => {
              let visibilityClass = 'hidden';

              if (index < 3) {
                visibilityClass = 'block';
              } else if (index === 3) {
                visibilityClass = 'hidden lg:block';
              } else if (index === 4) {
                visibilityClass = 'hidden xl:block';
              }
              return (
                <div className={visibilityClass} key={story.storyId}>
                  {story.coverImageUri ? (
                    <Image
                      src={story.coverImageUri}
                      alt="cover"
                      width={100}
                      height={100}
                      className="rounded-md w-[75px] h-[105px] md:w-[150px] md:h-[210px] object-cover"
                      priority
                    />
                  ) : (
                    <div className="rounded-md w-[75px] h-[105px] md:w-[150px] md:h-[210px] bg-accent flex justify-center items-center px-3 text-[10px] md:text-sm italic text-muted-foreground">
                      {story.storyTitle.slice(0, 25)}...
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-3 py-1 rounded-md bg-background hover:bg-accent hover:cursor-pointer">
                <Ellipsis className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="bg-card max-w-[200px]">
              <div className="w-[200px]">
                <ul className="flex flex-col text-xs sm:text-sm gap-4">
                  <li className="flex gap-2 items-center hover:underline hover:cursor-pointer">
                    <span>Edit</span>
                  </li>
                  <li className="flex gap-2 items-center hover:underline hover:cursor-pointer">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button>Delete</button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg font-normal text-left">
                            Are you sure want to delete{' '}
                            <span className="italic font-bold">
                              "{readList.read_list_title}"
                            </span>
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription className="text-left">
                          This action cannot be undone. This will permanently
                          delete your read list from our servers.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-500 hover:opacity-80"
                            onClick={handleDeleteReadList}
                          >
                            Accept
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </li>
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-2">
          <div className="rounded-md w-[75px] h-[105px] md:w-[150px] md:h-[210px] bg-accent flex justify-center items-center px-3 text-[10px] md:text-sm italic text-muted-foreground">
            No Stories Added
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-3 py-1 rounded-md bg-background hover:bg-accent hover:cursor-pointer">
                <Ellipsis className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="bg-card max-w-[200px]">
              <div className="w-[200px]">
                <ul className="flex flex-col text-xs sm:text-sm gap-4">
                  <li className="flex gap-2 items-center hover:underline hover:cursor-pointer">
                    <span>Edit</span>
                  </li>
                  <li className="flex gap-2 items-center hover:underline hover:cursor-pointer">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button>Delete</button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg font-normal text-left">
                            Are you sure want to delete{' '}
                            <span className="italic font-bold">
                              "{readList.read_list_title}"
                            </span>
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription className="text-left">
                          This action cannot be undone. This will permanently
                          delete your read list from our servers.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-500 hover:opacity-80"
                            onClick={handleDeleteReadList}
                          >
                            Accept
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </li>
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </li>
  );
};

export default ReadingListCard;
