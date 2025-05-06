import Cookies from 'js-cookie';
import { generateApi, GET_STORY_BY_GENREID } from '@/constants/api';
import axios from 'axios';
import { Logger } from '@/utils/Logger';
import { useInfiniteQuery } from '@tanstack/react-query';

import { BasicStoryInfo } from '@/types/Story';

import StoryCard from '@/components/common/Stori/StoryCard';

interface CardListProps {
  genreId: string;
  query: string;
}

const CardList = ({ genreId, query }: CardListProps) => {
  const fetchStories = async ({ pageParam }: { pageParam: number }) => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(
        generateApi(GET_STORY_BY_GENREID, genreId, `page=${pageParam}&size=10`),
        {
          headers,
        }
      );

      return response.data.result;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Logger.error('Error fetching stories by genre_id:', 'client');
        throw new Error(`Error fetching stories by genre_id: ${error.message}`);
      } else {
        Logger.error('Unexpected error:', 'client');
        throw new Error('Unexpected error occurred');
      }
    }
  };

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['storiesByGenreId', genreId],
    queryFn: fetchStories,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length : undefined;
      return nextPage;
    },
  });

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const stories =
    data?.pages?.flatMap((page: BasicStoryInfo) => page || []) ?? [];

  const filteredStories = stories.filter((story) =>
    story.storyTitle.toLowerCase().includes(query.toLowerCase())
  );

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
        className="grid gap-5 justify-center mt-6 
                grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-[90vw] xl:w-[80vw] mx-auto"
      >
        {filteredStories.map((story) => {
          return <StoryCard key={story.storyId} story={story} />;
        })}
      </div>
      <div className="flex justify-center mt-6">
        {hasNextPage && (
          <button
            className="bg-foreground text-background px-2 py-1 rounded-md active:scale-95 text-xl"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        )}
      </div>
    </>
  );
};

export default CardList;
