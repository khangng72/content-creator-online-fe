'use client';

import {
  generateApi,
  GET_BASIC_CHAPTERS_INFO_BY_STORY_ID,
  GET_BASIC_INFO_STORY,
} from '@/constants/api';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { BasicStoryInfo } from '@/types/Story';
import Image from 'next/image';
import { BookOpen, Eye, List, PlusIcon, Scroll } from 'lucide-react';
import StarRating from '@/components/Explore/StarRating';
import { BasicChapterInfo } from '@/types/BasicChapterInfo';
import { formatTimestamp } from '@/utils/FormatTimestamp';

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
  const [chapters, setChapters] = useState<BasicChapterInfo[]>([]);

  const fetchChapters = useCallback(async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        generateApi(GET_BASIC_CHAPTERS_INFO_BY_STORY_ID, storyId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setChapters(response.data.result);
      } else {
        console.error('Failed to fetch chapters:', response.status);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  }, [storyId]);

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
    fetchChapters();
  }, [fetchStoryDetail, fetchChapters]);

  if (!story) {
    return (
      <div className="pt-[100px] flex flex-col items-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="py-[66px] flex flex-col items-center">
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
          <h1 className="text-4xl font-extrabold bg-rainbow w-fit text-transparent bg-clip-text">
            {story.storyTitle}
          </h1>
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

      <div className=" mt-[30px] flex flex-col md:flex-row w-full xl:w-[80vw] items-start justify-center gap-4">
        {/* story detail card */}
        <div className="flex flex-col bg-card w-full md:w-[60%] p-4 md:px-6 rounded-md shadow-md gap-5">
          {/* basic info */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-extrabold mb-2 w-fit bg-rainbow text-transparent bg-clip-text">
              Story Info
            </h3>
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

          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-extrabold mb-2 w-fit bg-rainbow text-transparent bg-clip-text">
              Table of Content
            </h3>
            {chapters && chapters.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {chapters.map((chapter) => (
                  <li
                    key={chapter.chapterId}
                    className="flex flex-col lg:flex-row lg:items-center justify-between bg-background py-3 px-6 w-full rounded-md hover:opacity-80 cursor-pointer"
                  >
                    <div className="flex gap-2 items-center">
                      <Scroll className="w-5 h-5" />
                      <span>{chapter.chapterTitle}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {formatTimestamp(chapter.createdTime)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No chapters available for this story.
              </p>
            )}
          </div>
        </div>

        {/* suggestion card */}
        <div className="bg-card w-full md:w-[40%] flex flex-col p-4 shadow-md rounded-md">
          <h3 className="text-2xl font-extrabold mb-2 w-fit bg-rainbow text-transparent bg-clip-text">
            You may also like
          </h3>
          <div>bunch of bull shit</div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
