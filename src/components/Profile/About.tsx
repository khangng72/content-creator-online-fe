import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { UserData } from '@/types/UserData';
import DOMPurify from 'dompurify';
import { formatDate } from '@/utils/FormatDate';
import { generateApi, GET_LATEST_STORY_BY_USERID } from '@/constants/api';
import axios from 'axios';
import Cookies from 'js-cookie';
import { StarIcon } from 'lucide-react';

interface AboutProps {
  userData: UserData | null;
}

interface StoryData {
  storyId: string;
  storyTitle: string;
}

const About = ({ userData }: AboutProps) => {
  const [latestStories, setLatestStories] = useState<StoryData[]>([]);

  const fetchLatestStories = useCallback(async () => {
    const token = Cookies.get('token');
    const response = await axios.get(
      generateApi(GET_LATEST_STORY_BY_USERID, userData?.id),
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      setLatestStories(response.data);
    } else {
      console.error('Failed to fetch latest stories');
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      fetchLatestStories();
    }
  }, [fetchLatestStories]);

  if (!userData) {
    return (
      <div className="mt-5 text-xl flex flex-col items-center text-center font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start items-center gap-3 mt-3">
      <div className="bg-card rounded-xl p-6 max-w-[600px] gap-3 flex flex-col text-small flex-1">
        {/* Introduction of the author */}
        {userData.introduction && (
          <div className="flex flex-col gap-3">
            <h1 className="font-bold text-2xl">
              {userData.firstName} {userData.lastName} want to tell something...
            </h1>
            <div
              className="space-y-2 text-sm sm:text-base"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(userData.introduction),
              }}
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl">Info</h1>
          <ul className="space-y-1 text-sm sm:text-base">
            <li>
              {userData.firstName} {userData.lastName}
            </li>
            <li>{formatDate(userData.birthday)}</li>
            <li>{userData.nationality}</li>
            <li>{userData.gender}</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* High rated stories */}
        <div className="text-center bg-card rounded-xl p-6 flex flex-col items-center">
          <h1 className="font-bold text-2xl">High Rated Stories</h1>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-[100vw] sm:w-[40vw] md:w-[30vw] lg:w-[20vw] mx-auto mb-[20px] overflow-visible relative"
          >
            <CarouselContent>
              {latestStories.map((story) => (
                <CarouselItem key={story.storyId}>
                  <a
                    href="https://tailwindcss.com/docs/responsive-design"
                    className="p-1"
                  >
                    <Card className="hover:scale-110 duration-300 bg-secondary">
                      <CardContent className="items-center p-3 flex flex-col justify-center">
                        <Image
                          className="rounded-lg mb-2 w-[150px] h-[200px]"
                          src="/BookCover/sample_cover.jpeg"
                          alt="book cover"
                          width={150}
                          height={200}
                        />
                        <div className="flex gap-1 justify-center mb-2">
                          <StarIcon className="w-4 h-4" />
                          <StarIcon className="w-4 h-4" />
                          <StarIcon className="w-4 h-4" />
                          <StarIcon className="w-4 h-4" />
                          <StarIcon className="w-4 h-4" />
                        </div>
                        <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2">
                          {story.storyTitle}
                        </span>
                      </CardContent>
                    </Card>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-1 sm:-left-4 md:-left-10" />
            <CarouselNext className="absolute -right-1 sm:-right-4 md:-right-10" />
          </Carousel>
        </div>

        {/* latest stories */}
        <div className="text-center bg-card rounded-xl p-6 flex flex-col items-center">
          <h1 className="font-bold text-2xl">Latest Stories</h1>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-[100vw] sm:w-[40vw] md:w-[30vw] lg:w-[20vw] mx-auto mb-[20px] overflow-visible relative"
          >
            <CarouselContent>
              {latestStories.map((story) => (
                <CarouselItem key={story.storyId}>
                  <a
                    href="https://tailwindcss.com/docs/responsive-design"
                    className="p-1"
                  >
                    <Card className="hover:scale-110 duration-300 bg-secondary">
                      <CardContent className="items-center p-3 flex flex-col justify-center">
                        <Image
                          className="rounded-lg mb-2 w-[150px] h-[200px]"
                          src="/BookCover/sample_cover.jpeg"
                          alt="book cover"
                          width={150}
                          height={200}
                        />
                        <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2">
                          {story.storyTitle}
                        </span>
                      </CardContent>
                    </Card>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-1 sm:-left-4 md:-left-10" />
            <CarouselNext className="absolute -right-1 sm:-right-4 md:-right-10" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default About;
