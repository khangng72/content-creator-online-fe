import React, { useEffect } from 'react';

import { generateApi, SEARCH_STORY } from '@/constants/api';
import axios from 'axios';
import { Logger } from '@/utils/Logger';
import { useInfiniteQuery } from '@tanstack/react-query';
import { BasicStoryInfo } from '@/types/Story';

import { useInView } from 'react-intersection-observer';
import StoryCard from '@/components/common/Stori/StoryCard';
import Cookies from 'js-cookie';

interface CardListProps {
  query: string;
}

const StorySearchCardList = ({ query }: CardListProps) => {
  const { ref, inView } = useInView();

  const fetchStories = async ({ pageParam }: { pageParam: number }) => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(
        generateApi(
          SEARCH_STORY,
          '',
          `searchTitle=${query}&page=${pageParam}&size=10`
        ),
        {
          headers,
        }
      );

      return response.data.result;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Logger.error('Error searching stories by query:', 'client');
        throw new Error(`Error searching stories by query: ${error.message}`);
      } else {
        Logger.error('Unexpected error:', 'client');
        throw new Error('Unexpected error occurred');
      }
    }
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['searchStory', query],
      queryFn: fetchStories,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length ? allPages.length : undefined;
        return nextPage;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const stories =
    data?.pages?.flatMap((page: BasicStoryInfo) => page || []) ?? [];

  if (isLoading) {
    return (
      <div className="w-full py-[70px] flex justify-center">
        <div>Loading Stories...</div>
      </div>
    );
  }

  return (
    <>
      <div
        className="grid gap-5 justify-center my-6
                  grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-[90vw] xl:w-[80vw] mx-auto"
      >
        {stories &&
          stories.map((story: BasicStoryInfo, index) => {
            return (
              <StoryCard
                key={story.storyId}
                story={story}
                ref={index + 1 === stories.length ? ref : null}
              />
            );
          })}
      </div>
    </>
  );
};

export default StorySearchCardList;
