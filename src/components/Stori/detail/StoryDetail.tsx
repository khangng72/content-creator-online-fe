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
import { BookOpen, Eye, Lightbulb, List, PlusIcon, Scroll } from 'lucide-react';
import StarRating from '@/components/Explore/StarRating';
import { BasicChapterInfo } from '@/types/BasicChapterInfo';
import { formatTimestamp } from '@/utils/FormatTimestamp';
import { Link } from '@/i18n/routing';
import StoriImage from '@/components/ui/StoriImage';
import AddStoryToList from '@/components/common/AddStoryToList/AddStoryToList';
import RateStory from '@/components/common/RateStory/RateStory';

const mockSuggestions = [
  {
    storyId: '1',
    storyTitle: 'The House Beyond the Fog',
    userPost: 'Eleanor Graves',
    numberOfViews: 58472,
    numberOfChapters: 23,
    averageRating: 4.8,
    coverImageUri: null,
    storyDescription:
      'When a group of friends dares to spend the night in the abandoned Blackridge House, they uncover a haunting history of occult rituals, missing children, and something in the walls that watches... and waits.',
    genres: [
      { genreId: '1', genreName: 'Horror' },
      { genreId: '2', genreName: 'Supernatural' },
      { genreId: '3', genreName: 'Thriller' },
    ],
  },
  {
    storyId: '2',
    storyTitle: 'Whispers in the Cornfield',
    userPost: 'Damien Holloway',
    numberOfViews: 43918,
    numberOfChapters: 17,
    averageRating: 4.7,
    coverImageUri: null,
    storyDescription:
      'Every autumn, strange whispers echo from the cornfields surrounding the small town of Marlowe. When 16-year-old Elsie investigates the mysterious disappearance of her brother, she discovers an ancient scarecrow legend that hungers for more than just fear.',
    genres: [
      { genreId: '1', genreName: 'Horror' },
      { genreId: '2', genreName: 'Psychological' },
      { genreId: '3', genreName: 'Mystery' },
    ],
  },
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
      <div className="w-full bg-card flex flex-col items-center md:flex-row md:justify-center gap-5 p-5 shadow-md">
        <div>
          <StoriImage
            source={story.coverImageUri}
            storyTitle={story.storyTitle}
            className="w-[220px] h-[330px]"
          />
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-4xl font-extrabold bg-rainbow w-fit text-transparent bg-clip-text text-center md:text-left">
            {story.storyTitle}
          </h1>
          <h2 className="text-xl mt-[10px]">{story.userPost}</h2>
          <ul className="flex gap-2 mt-3">
            <li className="flex flex-col items-center text-muted-foreground bg-accent py-1 w-[100px] rounded-md text-xs">
              <div className="flex gap-1 items-center">
                <Eye className="w-5 h-5" />
                <span>Views</span>
              </div>
              <span>{story.numberOfViews}</span>
            </li>

            <li className="flex flex-col items-center text-muted-foreground bg-accent py-1 w-[100px] rounded-md text-xs">
              <div className="flex gap-1 items-center">
                <List className="w-5 h-5" />
                <span>Chapters</span>
              </div>
              <span>{story.numberOfChapters}</span>
            </li>
          </ul>
          <div className="mt-5 flex flex-col items-start gap-2">
            <StarRating rating={story.averageRating} />
            <RateStory
              storyId={storyId}
              storyTitle={story.storyTitle}
              fetchStoryInfo={fetchStoryDetail}
            >
              <button className="text-sm bg-background px-3 py-1 rounded-md hover:opacity-80 text-muted-foreground">
                Rate This Story
              </button>
            </RateStory>
          </div>

          <div className="flex flex-col items-start gap-3 mt-[20px]">
            <div className="flex scale-90 md:scale-100 w-full justify-center md:justify-start">
              <Link
                className="py-2 w-[200px] bg-[#8b5cf6] rounded-md flex gap-2 items-center justify-center hover:opacity-80"
                href={`/immersiveRead/${storyId}`}
              >
                <Lightbulb className="w-5 h-5" />
                <span>Immersive Read</span>
              </Link>
            </div>
            <div className="flex gap-[3px] scale-90 md:scale-100 w-full justify-center md:justify-start">
              <button className="flex gap-2 items-center bg-background justify-center rounded-l-md py-2 w-[200px] hover:opacity-80">
                <BookOpen className="w-5 h-5" />
                <span>Start reading</span>
              </button>
              <AddStoryToList storyId={storyId}>
                <button className="flex gap-3 items-center bg-background justify-center rounded-r-md py-2 px-5 hover:opacity-80">
                  <PlusIcon className="w-6 h-6" />
                </button>
              </AddStoryToList>
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-[30px] flex flex-col lg:flex-row w-full xl:w-[80vw] items-start justify-center gap-4">
        {/* story detail card */}
        <div className="flex flex-col bg-card w-full lg:w-[60%] p-4 md:px-6 rounded-md shadow-md gap-5">
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
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2 w-fit">
                {story.genres.map((genre) => (
                  <li
                    key={genre.genreId}
                    className="flex items-center justify-center bg-background py-1 w-[120px] rounded-md text-xs"
                  >
                    {genre.genreName}
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
        <div className="bg-card w-full lg:w-[40%] flex flex-col p-4 shadow-md rounded-md">
          <h3 className="text-2xl font-extrabold mb-2 w-fit bg-rainbow text-transparent bg-clip-text">
            You may also like
          </h3>
          <div className="flex flex-col gap-3 mt-5 2xl:w-3/4">
            {mockSuggestions.map((suggestion) => {
              return (
                <div
                  className="flex bg-background p-3 rounded-md gap-4"
                  key={suggestion.storyId}
                >
                  <div>
                    <StoriImage
                      source={suggestion.coverImageUri}
                      storyTitle={suggestion.storyTitle}
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-xl font-bold">
                      {suggestion.storyTitle}
                    </h2>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:underline text-sm"
                    >
                      by {suggestion.userPost}
                    </Link>
                    <ul className="flex gap-4 text-sm text-muted-foreground mt-2">
                      <li className="flex flex-col items-center justify-center">
                        <Eye className="w-4 h-4" />
                        <span>{suggestion.numberOfViews}</span>
                      </li>

                      <li className="flex flex-col items-center justify-center">
                        <List className="w-4 h-4" />
                        <span>{suggestion.numberOfChapters}</span>
                      </li>
                    </ul>
                    <StarRating
                      rating={suggestion.averageRating}
                      size={15}
                      className="mt-2"
                    />
                    <div className="text-muted-foreground text-xs mt-2">
                      {suggestion.storyDescription.slice(0, 100)}...
                    </div>
                    <div className="mt-5">
                      <button className="bg-rainbow px-2 py-1 text-sm hover:opacity-80 rounded-md">
                        Read Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
