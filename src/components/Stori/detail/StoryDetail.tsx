'use client';

import { generateApi, GET_BASIC_INFO_STORY } from '@/constants/api';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { BasicStoryInfo } from '@/types/Story';
import Image from 'next/image';
import { BookOpen, Eye, List, PlusIcon } from 'lucide-react';
import StarRating from '@/components/Explore/StarRating';
import { mock } from 'node:test';

const mockGenres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 3, name: 'Fantasy' },
  { id: 4, name: 'Horror' },
  { id: 5, name: 'Romance' },
  { id: 6, name: 'Sci-Fi' },
  { id: 7, name: 'Thriller' },
];

interface StoryDetailProps {
  storyId: string;
}
const StoryDetail = ({ storyId }: StoryDetailProps) => {
  const [story, setStory] = useState<BasicStoryInfo | null>(null);

  const fetchStoryDetail = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        generateApi(GET_BASIC_INFO_STORY, storyId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setStory(response.data);
      } else {
        console.error('Failed to fetch story detail:', response.status);
      }
    } catch (error) {
      console.error('Error fetching story detail:', error);
    }
  }, [storyId]);

  useEffect(() => {
    fetchStoryDetail();
  }, [fetchStoryDetail]);

  if (!story) {
    return (
      <div className="pt-[100px] flex flex-col items-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-[66px] flex flex-col items-center">
      <div className="w-full bg-card flex flex-col items-center md:flex-row md:justify-center gap-7 p-5 shadow-md">
        <div>
          <Image
            src={story.coverImageUri}
            alt="jus a placeholder"
            width={150}
            height={210}
            className="rounded-md w-[225px] h-[315px]"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">{story.storyTitle}</h1>
          <h2 className="text-xl mt-[10px]">{story.userPost}</h2>
          <ul className="flex gap-2 mt-3">
            <li className="flex flex-col items-center text-muted-foreground bg-background py-1 w-[100px] rounded-md text-xs">
              <div className="flex gap-1 items-center">
                <Eye className="w-5 h-5" />
                <span>Views</span>
              </div>
              <span>{story.numberOfViews}</span>
            </li>

            <li className="flex flex-col items-center text-muted-foreground bg-background py-1 w-[100px] rounded-md text-xs">
              <div className="flex gap-1 items-center">
                <List className="w-5 h-5" />
                <span>Chapters</span>
              </div>
              <span>{story.numberOfChapters}</span>
            </li>
          </ul>
          <div className="mt-5 flex flex-col items-start gap-2">
            <StarRating rating={story.averageRating} />
            <button className="text-sm bg-background px-3 py-1 rounded-md hover:opacity-80 text-muted-foreground">
              Rate This Story
            </button>
          </div>

          <div className="mt-[50px] flex gap-[3px] scale-90 md:scale-100 w-full justify-center md:justify-start">
            <button className="flex gap-2 items-center bg-[#8b5cf6] justify-center rounded-l-md py-2 px-10 hover:opacity-80">
              <BookOpen className="w-5 h-5" />
              <span>Start reading</span>
            </button>
            <button className="flex gap-3 items-center bg-[#8b5cf6] justify-center rounded-r-md py-2 px-5 hover:opacity-80">
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-red-200 mt-[30px] flex flex-col md:flex-row w-full xl:w-[80vw] items-start justify-center gap-4">
        {/* story detail card */}
        <div className="flex flex-col bg-card w-full md:w-[60%] p-4 rounded-md shadow-md">
          <h3 className="text-2xl font-extrabold mb-5 w-fit bg-rainbow text-transparent bg-clip-text">
            Story Info
          </h3>

          {/* basic info */}
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-bold">Description:</span>
              <p className="text-sm text-muted-foreground">
                {story.storyDescription}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold">Genre:</span>
              <ul className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2 w-fit">
                {mockGenres.map((genre) => (
                  <li
                    key={genre.id}
                    className="flex items-center justify-center bg-background py-1 w-[100px] rounded-md text-xs"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* suggestion card */}
        <div className=" bg-blue-200 w-full md:w-[30%]">suggestion</div>
      </div>
    </div>
  );
};

export default StoryDetail;
