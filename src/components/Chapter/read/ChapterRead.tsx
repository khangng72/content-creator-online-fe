'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { DialogDescription } from '@radix-ui/react-dialog';
import {
  Bolt,
  Bookmark,
  ChevronDown,
  CirclePlus,
  CircleX,
  Ellipsis,
  Facebook,
  GanttChart,
  Instagram,
  Send,
  Star,
  TypeOutline,
  WholeWord,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  generateApi,
  GET_BASIC_CHAPTERS_INFO_BY_STORY_ID,
  GET_CHAPTER_BY_ID,
  GET_CURRENT_USER_READ_PREFERENCE,
} from '@/constants/api';
import { Chapter } from '@/types/Chapter';
import DOMPurify from 'dompurify';
import ChapterStatistics from './ChapterStatistics';
import ChapterOption from './ChapterOption';
import { useDebounce } from 'use-debounce';

interface ChapterReadProps {
  chapterId: string;
}
const ChapterRead = ({ chapterId }: ChapterReadProps) => {
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [textSize, setTextSize] = useState(19);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [wordSpacing, setWordSpacing] = useState(3);
  const [displayTool, setDisplayTool] = useState(true);

  const [lineHeightDebounce] = useDebounce(lineHeight, 2000);
  const [wordSpacingDebounce] = useDebounce(wordSpacing, 2000);
  const [textSizeDebounce] = useDebounce(textSize, 2000);

  const fetchChapter = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_CHAPTER_BY_ID, chapterId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCurrentChapter(response.data);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.error('Error fetching chapter:', error);
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  const fetchAllChapters = useCallback(async () => {
    if (!currentChapter) return;
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(
          GET_BASIC_CHAPTERS_INFO_BY_STORY_ID,
          currentChapter.storyId
        ),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setAllChapters(response.data.result);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.error('Error fetching all chapters:', error);
    }
  }, [currentChapter]);

  const fetchReadPreference = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_CURRENT_USER_READ_PREFERENCE),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setTextSize(response.data.defaultReadingTextSize);
        setLineHeight(response.data.defaultReadingLineHeight);
        setWordSpacing(response.data.defaultReadingWordSpacing);
      } else {
        console.error('Error fetching read preference:', response.data);
      }
    } catch (error) {
      console.error('Error fetching read preference:', error);
    }
  }, []);

  const updateReadPreference = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.put(
        generateApi(GET_CURRENT_USER_READ_PREFERENCE),
        {
          defaultReadingTextSize: textSizeDebounce,
          defaultReadingLineHeight: lineHeightDebounce,
          defaultReadingWordSpacing: wordSpacingDebounce,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Read preference updated successfully');
      } else {
        console.error('Error updating read preference:', response.data);
      }
    } catch (error) {
      console.error('Error updating read preference:', error);
    }
  }, [textSizeDebounce, lineHeightDebounce, wordSpacingDebounce]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  useEffect(() => {
    if (currentChapter) {
      fetchAllChapters();
    }
  }, [currentChapter, fetchAllChapters]);

  useEffect(() => {
    fetchReadPreference();
  }, [fetchReadPreference]);

  useEffect(() => {
    if (textSizeDebounce && lineHeightDebounce && wordSpacingDebounce) {
      updateReadPreference();
    }
  }, [
    textSizeDebounce,
    lineHeightDebounce,
    wordSpacingDebounce,
    updateReadPreference,
  ]);

  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-red-500">Error fetching chapter</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-[54px] md:pt-[64px] mb-[80px] items-center gap-5">
      {!displayTool && (
        <button
          className="flex gap-1 items-center justify-center bg-rainbow px-2 py-1 text-sm rounded-r-md fixed left-0 opacity-30 hover:opacity-100 transition-all duration-300 ease-in-out text-white"
          onClick={() => setDisplayTool((prev) => !prev)}
        >
          <span className="hidden md:block">Tools</span>
          <Bolt className="w-5 h-5" />
        </button>
      )}

      {displayTool && (
        <div className="w-[98vw] xl:w-[95vw] bg-card border border-accent fixed rounded-md py-2 px-3 flex flex-col gap-3 md:gap-0 md:flex-row md:justify-between md:items-center z-20 shadow-md">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-between gap-1 bg-secondary rounded-md px-2 py-1 hover:bg-background md:w-[40%] lg:w-[30%] xl:w-[20%]">
                <div className="flex flex-col items-start">
                  <h1 className="text-lg md:text-xl font-bold">
                    {currentChapter?.storyTitle}
                  </h1>
                  <span className="text-sm text-left">
                    {currentChapter?.chapterTitle}
                  </span>
                </div>
                <div>
                  <ChevronDown className="text-muted-foreground" size={16} />
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 bg-secondary flex flex-col px-0 py-2 gap-2">
              <div className="flex justify-center border-b border-b-muted-foreground py-2 w-full">
                <h3 className="font-bold">Chapter List</h3>
              </div>
              <ul className="max-h-[250px] overflow-auto w-full">
                {allChapters &&
                  allChapters.map((chapter) => (
                    <ChapterOption
                      key={chapter.chapterId}
                      chapter={chapter}
                      ticked={chapter.chapterId == currentChapter?.chapterId}
                    />
                  ))}
              </ul>
            </PopoverContent>
          </Popover>

          <div className="grid grid-cols-4 gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-secondary flex gap-1 items-center justify-center px-2 py-1 text-xs rounded-md active:scale-95">
                  <span>Save</span>
                  <Bookmark className="hidden sm:block w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save to</DialogTitle>
                  <DialogDescription className="hidden">
                    Save story to a read list
                  </DialogDescription>
                </DialogHeader>
                content
              </DialogContent>
            </Dialog>

            {/* word spacing */}
            <Drawer>
              <DrawerTrigger asChild>
                <button className="bg-secondary flex gap-1 items-center justify-center px-2 py-1 text-xs rounded-md active:scale-95">
                  <span>Word Spacing</span>
                  <WholeWord className="hidden sm:block w-4 h-4" />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm h-[25vh]">
                  <DrawerHeader className="flex flex-col items-center">
                    <DrawerTitle>Modify word spacing</DrawerTitle>
                    <DrawerDescription>
                      Ranging from 2px to 8px
                    </DrawerDescription>
                  </DrawerHeader>

                  <div className="flex flex-col items-center justify-center gap-5">
                    <h1 className="text-6xl font-bold">
                      {wordSpacing}
                      <span className="text-3xl">px</span>
                    </h1>
                    <Slider
                      defaultValue={[3]}
                      min={2}
                      max={8}
                      step={0.5}
                      className="w-[60%]"
                      onValueChange={([val]) => setWordSpacing(val)}
                      value={[wordSpacing]}
                    />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* line height */}
            <Drawer>
              <DrawerTrigger asChild>
                <button className="bg-secondary flex gap-1 items-center justify-center px-2 py-1 text-xs rounded-md active:scale-95">
                  <span>Line height</span>
                  <GanttChart className="hidden sm:block w-4 h-4" />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm h-[25vh]">
                  <DrawerHeader className="flex flex-col items-center">
                    <DrawerTitle>Modify line height</DrawerTitle>
                    <DrawerDescription>Ranging from 1.5 to 3</DrawerDescription>
                  </DrawerHeader>

                  <div className="flex flex-col items-center justify-center gap-5">
                    <h1 className="text-6xl font-bold">{lineHeight}</h1>
                    <Slider
                      defaultValue={[1.7]}
                      min={1.5}
                      max={3}
                      step={0.05}
                      className="w-[60%]"
                      onValueChange={([val]) => setLineHeight(val)}
                      value={[lineHeight]}
                    />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* text size */}
            <Drawer>
              <DrawerTrigger asChild>
                <button className="bg-secondary flex gap-1 items-center justify-center px-2 py-1 text-xs rounded-md active:scale-95">
                  <span>Text Size</span>
                  <TypeOutline className="hidden sm:block w-4 h-4" />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm h-[25vh]">
                  <DrawerHeader className="flex flex-col items-center">
                    <DrawerTitle>Modify Text Size</DrawerTitle>
                    <DrawerDescription>Ranging from 14 to 32</DrawerDescription>
                  </DrawerHeader>

                  <div className="flex flex-col items-center justify-center gap-5">
                    <h1 className="text-6xl font-bold">{textSize}</h1>
                    <Slider
                      defaultValue={[19]}
                      min={14}
                      max={32}
                      step={0.5}
                      className="w-[60%]"
                      onValueChange={([val]) => setTextSize(val)}
                      value={[textSize]}
                    />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          <button
            className="absolute -bottom-3 right-0 flex items-center justify-center hover:opacity-80"
            onClick={() => setDisplayTool(false)}
          >
            <CircleX className="w-6 h-6" fill="red" />
          </button>
        </div>
      )}

      {/* main content */}
      <div
        className={cn(
          'flex flex-col items-center gap-3',
          displayTool ? 'mt-[120px] md:mt-[100px]' : 'mt-[30px]'
        )}
      >
        <h1 className="font-bold text-3xl bg-rainbow text-transparent bg-clip-text text-center">
          {currentChapter?.storyTitle}
        </h1>
        <h2 className="font-bold text-2xl text-center">
          {currentChapter?.chapterTitle}
        </h2>
        <ChapterStatistics currentChapter={currentChapter} />

        <div
          className="flex flex-col p-5 bg-background w-[98vw] lg:w-[80vw] xl:w-[60vw] rounded-xl gap-5"
          style={{
            fontSize: `${textSize}px`,
            lineHeight: `${lineHeight}`,
            wordSpacing: `${wordSpacing}px`,
          }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(currentChapter?.chapterContent || ''),
          }}
        ></div>

        <div className="w-full max-w-[300px] sm:max-w-[500px] md:max-w-[700px] flex flex-col items-center gap-5">
          <Button className="w-full">Continue</Button>
          <div className="flex justify-between w-full">
            <div className="w-1/2 flex flex-start gap-4">
              <div className="flex items-center gap-1">
                <span>Add</span>
                <CirclePlus />
              </div>
              <Star />
            </div>
            <div className="w-1/2 flex flex-row-reverse gap-2">
              <Facebook />
              <Instagram />
            </div>
          </div>
          <div className="flex w-full gap-2 items-center">
            <Input className="rounded-full" placeholder="Comment..." />
            <Button className="bg-purple-400 rounded-full flex justify-center items-center h-[40px] w-[40px]">
              <Send />
            </Button>
          </div>

          <div className="flex flex-col w-full gap-5 items-center text-[10px] md:text-sm">
            {/* comment without reply */}
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="rounded-t-xl rounded-br-xl bg-card p-3">
                    <span className="text-sm">
                      The Story is great, plot is astonishing
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <span>13 hours ago</span>
                  <span className="font-bold text-purple-500">Reply</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Ellipsis />
                <Star />
              </div>
            </div>

            {/* Comment with reply */}
            <div className="flex flex-col w-full">
              {/* parent comment */}
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="rounded-t-xl rounded-br-xl bg-card p-3">
                      <span className="text-sm">
                        The Story is great, plot is astonishing
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span>13 hours ago</span>
                    <span className="font-bold text-purple-500">Reply</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Ellipsis />
                  <Star />
                </div>
              </div>

              {/* reply list */}
              <div className="ml-2 md:ml-10 mt-5 flex flex-col gap-5">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src="https://avatars.githubusercontent.com/u/40488299?v=4"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="rounded-t-xl rounded-br-xl bg-card p-3">
                        <span className="text-sm">
                          The Story is great, plot is astonishing. Enough for
                          chilling at night
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span>13 hours ago</span>
                      <span className="font-bold text-purple-500">Reply</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Ellipsis />
                    <Star />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src="https://avatars.githubusercontent.com/u/40488299?v=4"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="rounded-t-xl rounded-br-xl bg-card p-3">
                        <span className="text-sm">
                          The Story is great, plot is astonishing
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span>13 hours ago</span>
                      <span className="font-bold text-purple-500">Reply</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Ellipsis />
                    <Star />
                  </div>
                </div>

                <div className="flex w-full gap-2 items-center">
                  <Input className="rounded-full" placeholder="Comment..." />
                  <Button className="bg-purple-400 rounded-full flex justify-center items-center h-[40px] w-[40px]">
                    <Send />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterRead;
