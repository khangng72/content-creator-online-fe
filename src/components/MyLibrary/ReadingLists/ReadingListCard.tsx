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
import { generateApi, GET_TOP_STORY_BY_READING_LIST_ID } from '@/constants/api';
import { GET } from '@/app/api/auth/status/route';
import axios from 'axios';
import { BasicStoryInfo } from '@/types/Story';

interface ReadingListCardProps {
  readList: ReadList;
}
const ReadingListCard = ({ readList }: ReadingListCardProps) => {
  const [topStories, setTopStories] = useState<BasicStoryInfo[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTopStories = useCallback(async () => {
    console.log(
      'Fetching top stories for reading list:',
      readList.read_list_id
    );
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_TOP_STORY_BY_READING_LIST_ID, readList.read_list_id),
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

  useEffect(() => {
    fetchTopStories();
  }, [fetchTopStories]);

  return (
    <li className="flex flex-col bg-card p-3 md:p-5 rounded-md shadow-md">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg md:text-xl font-bold flex gap-1 max-w-[300px]  md:max-w-[500px] hover:underline">
          <span>{readList.read_list_title}</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {readList.number_of_stories} stories
        </p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          {topStories &&
            topStories.map((story: BasicStoryInfo) => {
              return (
                <div
                  className="flex flex-col justify-center item-center"
                  key={story.storyId}
                >
                  {story.coverImageUri ? (
                    <Image
                      src={story.coverImageUri}
                      alt="cover"
                      width={100}
                      height={100}
                      className="rounded-md w-[65px] h-[91px] md:w-[150px] md:h-[210px] object-cover"
                    />
                  ) : (
                    <div className="rounded-md w-[65px] h-[91px] md:w-[150px] md:h-[210px] bg-accent flex justify-center items-center px-3 text-[10px] md:text-sm italic text-muted-foreground">
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
                  <span>Delete</span>
                </li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </li>
  );
};

export default ReadingListCard;
