import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { EyeIcon, PlusIcon, StarIcon, TableOfContents } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Cookies from 'js-cookie';
import { generateApi, SEARCH_STORY } from '@/constants/api';
import axios from 'axios';
import { Logger } from '@/utils/Logger';
import { useInfiniteQuery } from '@tanstack/react-query';

const readingLists = [
  { id: 1, title: 'Read list title 1' },
  { id: 2, title: 'Read list title 2' },
  { id: 3, title: 'Read list title 3' },
];

interface CardListProps {
  query: string;
}

interface Story {
  storyId: string;
  storyTitle: string;
  storyDescription: string;
  coverImageUri: string;
}

const StorySearchCardList = ({ query }: CardListProps) => {
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

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

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['searchStory', query],
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

  const stories = data?.pages?.flatMap((page: Story) => page || []) ?? [];

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
        {stories &&
          stories.map((story: Story) => {
            return (
              <div
                key={story.storyId}
                className="flex flex-col justify-center items-center bg-card rounded-md p-4 relative"
              >
                <Image
                  src="/BookCover/sample_cover.jpeg"
                  alt="Book Cover"
                  width={200}
                  height={300}
                  className="rounded-lg mb-4 w-[150px] h-[210px]"
                />

                <Link href="#">
                  <h2 className="text-xl font-semibold hover:underline">
                    {story.storyTitle}
                  </h2>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:underline"
                >
                  by Author Name
                </Link>
                <div className="flex gap-2 justify-center items-center">
                  <div className="flex gap-1 items-center">
                    <EyeIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">4</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <TableOfContents className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">5</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center mt-2">
                  <StarIcon className="w-4 h-4" />
                  <StarIcon className="w-4 h-4" />
                  <StarIcon className="w-4 h-4" />
                  <StarIcon className="w-4 h-4" />
                  <StarIcon className="w-4 h-4" />
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
      <div className="flex justify-center mt-5">
        {hasNextPage && (
          <button
            className="bg-foreground text-background px-2 py-1 rounded-md active:scale-95"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        )}
      </div>
    </>
  );
};

export default StorySearchCardList;
