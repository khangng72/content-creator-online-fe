import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { EyeIcon, PlusIcon, TableOfContents } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Cookies from 'js-cookie';
import { generateApi, SEARCH_STORY } from '@/constants/api';
import axios from 'axios';
import { Logger } from '@/utils/Logger';
import { useInfiniteQuery } from '@tanstack/react-query';
import { BasicStoryInfo } from '@/types/Story';
import StarRating from '../StarRating';
import { useInView } from 'react-intersection-observer';

const readingLists = [
  { id: 1, title: 'Read list title 1' },
  { id: 2, title: 'Read list title 2' },
  { id: 3, title: 'Read list title 3' },
];

interface CardListProps {
  query: string;
}

const StorySearchCardList = ({ query }: CardListProps) => {
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
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
              <div
                key={story.storyId}
                className="flex flex-col justify-center items-center bg-card rounded-md p-4 relative"
                ref={index + 1 === stories.length ? ref : null}
              >
                {story.coverImageUri ? (
                  <Image
                    src="/BookCover/sample_cover.jpeg"
                    alt={story.storyTitle}
                    width={200}
                    height={300}
                    className="rounded-lg mb-4 w-[150px] h-[210px]"
                  />
                ) : (
                  <div className="w-[150px] h-[210px] bg-secondary flex flex-col justify-center items-center mb-4 px-4 gap-3">
                    <span className="text-4xl">
                      {story.storyTitle.slice(0, 1)}
                    </span>
                    <span className="text-md text-center">
                      Cover is coming soon
                    </span>
                  </div>
                )}

                <Link href="#">
                  <h2 className="text-xl font-semibold hover:underline">
                    {story.storyTitle}
                  </h2>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:underline"
                >
                  by {story.userPost}
                </Link>
                <div className="flex gap-2 justify-center items-center">
                  <div className="flex gap-1 items-center">
                    <EyeIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {story.numberOfViews}
                    </span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <TableOfContents className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {story.numberOfChapters}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 items-center mt-2">
                  <StarRating rating={story.averageRating} size={20} />
                </div>
                <div className="mt-3 w-[90%] text-justify text-muted-foreground bg-secondary px-4 py-2 text-sm rounded-tl-3xl rounded-br-3xl">
                  <p>{story.storyDescription.slice(0, 255)}...</p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="absolute -top-3 -right-2 bg-secondary hover:bg-muted-foreground rounded-full p-1 border-[1px] border-foreground">
                      <PlusIcon />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-semibold">
                        Add to your Read lists
                      </h3>

                      <div className="flex flex-col gap-2 border-b-[0.5px] border-muted-foreground pb-4">
                        {readingLists.map((readingList) => {
                          return (
                            <div
                              className="flex justify-between items-center gap-2 py-2 hover:cursor-pointer hover:bg-secondary px-3 rounded-md"
                              key={readingList.id}
                              onClick={() => setSelectedListId(readingList.id)}
                            >
                              <span>{readingList.title}</span>
                              <input
                                type="radio"
                                className="w-5 h-5"
                                checked={selectedListId === readingList.id}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default StorySearchCardList;
