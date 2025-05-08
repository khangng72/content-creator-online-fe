import { ReadList } from '@/types/ReadList';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';
import Cookies from 'js-cookie';
import { generateApi, GET_TOP_STORY_BY_READING_LIST_ID } from '@/constants/api';
import axios from 'axios';
import { BasicStoryInfo } from '@/types/Story';

import { Link } from '@/i18n/routing';
import StoriImage from '@/components/ui/StoriImage';

interface ReadingListCardProps {
  readList: ReadList;
}
const ReadingListCard = ({ readList }: ReadingListCardProps) => {
  const [topStories, setTopStories] = useState<BasicStoryInfo[] | null>(null);

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
        console.error('Error fetching reading lists:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching reading lists:', error);
    }
  }, [readList]);

  useEffect(() => {
    fetchTopStories();
  }, [fetchTopStories]);

  return (
    <li className="flex flex-col bg-card p-3 md:p-5 rounded-md shadow-md">
      <div className="flex flex-col gap-[1px]">
        <Link href={`/read_list/${readList.read_list_id}`}>
          <h1 className="text-lg md:text-xl font-bold flex max-w-[300px]  md:max-w-[500px] hover:underline">
            <span>{readList.read_list_title}</span>
          </h1>
        </Link>
        <p className="text-xs md:text-base text-muted-foreground">
          {readList.number_of_stories} stories
        </p>
      </div>
      {topStories && topStories.length > 0 ? (
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            {topStories.map((story: BasicStoryInfo, index) => {
              let visibilityClass = 'hidden';

              if (index < 2) {
                visibilityClass = 'block';
              } else if (index === 2) {
                visibilityClass = 'hidden lg:block';
              } else {
                visibilityClass = 'hidden xl:block';
              }
              return (
                <div className={visibilityClass} key={story.storyId}>
                  <StoriImage
                    source={story.coverImageUri}
                    storyTitle={story.storyTitle}
                    className="w-[100px] h-[150px] md:w-[160px] md:h-[240px] text-[10px] sm:text-xs"
                  />
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
                    <Link href={`/read_list/${readList.read_list_id}`}>
                      View
                    </Link>
                  </li>
                  <li className="flex gap-2 items-center hover:underline hover:cursor-pointer">
                    <button>Add to your library</button>
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
        </div>
      )}
    </li>
  );
};

export default ReadingListCard;
