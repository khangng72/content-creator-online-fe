import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TableOfContents } from 'lucide-react';
import { Eye } from 'lucide-react';
import { Star } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { UserData } from '@/types/UserData';
import axios from 'axios';
import { generateApi, GET_STORY_BY_USERID } from '@/constants/api';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface StoriesByUserProps {
  userData: UserData | null;
}

interface Story {
  storyId: string;
  storyTitle: string;
  storyDescription: string;
}

const StoriesByUser = ({ userData }: StoriesByUserProps) => {
  const [stories, setStories] = useState<Story[] | null>(null);

  const fetchStories = useCallback(async () => {
    const token = Cookies.get('token');
    const response = await axios.get(
      generateApi(GET_STORY_BY_USERID, userData?.id),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      setStories(response.data);
    } else {
      console.error('Failed to fetch stories');
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      fetchStories();
    }
  }, [fetchStories, userData]);

  return (
    <div className="flex flex-col justify-center items-center gap-5 p-5">
      <h1 className="text-xl font-bold border-b-3 border-foreground">
        InkyPoe Works
      </h1>
      <div className="flex justify-center items-center gap-2 min-w-[300px] sm:min-w-[400px] md:min-w-[500px]">
        <Input type="text" placeholder="Search..." />
        <Button type="submit" className="hover:scale-105 duration-300">
          Search
        </Button>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 px-[20px] xl:px-[50px] 2xl:px-[100px]">
        {stories &&
          stories.map((story) => (
            <Dialog key={story.storyId}>
              <DialogContent className="max-w-[500px]">
                <div className="flex items-center gap-4">
                  <Image
                    src="/BookCover/sample_cover.jpeg"
                    alt="book cover"
                    className="w-[100px] sm:w-[200px]"
                    height={100}
                    width={200}
                  />

                  <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl">
                      {story.storyTitle}
                    </DialogTitle>
                    <div>
                      <Link href="/pages/main/creator/123">by Author</Link>
                      <div className="flex gap-3 pb-2">
                        <div className="flex gap-1">
                          <Eye className="w-5 h-5" />
                          <span>100</span>
                        </div>
                        <div className="flex gap-1">
                          <Star className="w-5 h-5" />
                          <span>100</span>
                        </div>
                        <div className="flex gap-1">
                          <TableOfContents className="w-5 h-5" />
                          <span>100</span>
                        </div>
                      </div>
                      <DialogDescription>
                        <span>{story.storyDescription}</span>
                      </DialogDescription>
                      {/* <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                      {book.genres.map((gen) => (
                        <li key={gen}>
                          <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                            {gen}
                          </span>
                        </li>
                      ))}
                    </ul> */}
                    </div>
                  </DialogHeader>
                </div>

                <DialogFooter>
                  <Button type="submit">Read Now</Button>
                </DialogFooter>
              </DialogContent>

              <DialogTrigger>
                <div className="flex flex-col items-center justify-center sm:flex-row gap-2 hover:scale-105 bg-card py-5 min-w-[250px] rounded-xl md:h-[300px]">
                  <div className="w-full sm:w-[40%] flex justify-center">
                    <Image
                      src="/BookCover/sample_cover.jpeg"
                      alt="pen pen"
                      className="w-[130px] h-[200px] rounded-xl"
                      width={130}
                      height={200}
                    />
                  </div>

                  <div className="flex flex-col items-center sm:items-start w-full sm:w-[60%] sm:text-left sm:pr-4 gap-3">
                    <h1 className="font-xl font-bold">{story.storyTitle}</h1>
                    <ul className="flex gap-3">
                      <li className="flex gap-1">
                        <Eye className="w-5 h-5" />
                        <span>15</span>
                      </li>
                      <li className="flex gap-1">
                        <Star className="w-5 h-5" />
                        <span>15</span>
                      </li>
                      <li className="flex gap-1">
                        <TableOfContents className="w-5 h-5" />
                        <span>15</span>
                      </li>
                    </ul>
                    <p className="text-sm">
                      {story.storyDescription.slice(0, 100)}...
                    </p>
                    <div className="flex justify-start gap-1">
                      <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                        Horror
                      </span>
                      <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                        Family
                      </span>
                      <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                        Adventure
                      </span>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
            </Dialog>
          ))}
      </div>
    </div>
  );
};

export default StoriesByUser;
