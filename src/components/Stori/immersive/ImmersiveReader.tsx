'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bookmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Type,
  Moon,
  Sun,
  TableOfContents,
  Minimize2,
  CheckCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import axios from 'axios';
import Cookies from 'js-cookie';
import { generateApi, GET_STORY_BY_ID } from '@/constants/api';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import { Link } from '@/i18n/routing';

interface ImmersiveReaderProps {
  story_id: string;
}

interface Chapter {
  chapterId: string;
  chapterTitle: string;
  chapterContent: string;
  chapterImageUri: string;
}

interface Story {
  storyId: string;
  storyTitle: string;
  chapters: Chapter[];
}

const ImmersiveReader = ({ story_id }: ImmersiveReaderProps) => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const { theme, setTheme } = useTheme();
  const [readingProgress, setReadingProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [story, setStory] = useState<Story>({
    storyId: '',
    storyTitle: '',
    chapters: [],
  });

  const toggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const fetchStory = useCallback(async () => {
    try {
      console.log('story_id', story_id);
      const token = Cookies.get('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(generateApi(GET_STORY_BY_ID, story_id), {
        headers,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch story');
      }

      const storyData = response.data;
      const chapters = storyData.chapters.map((chapter: Chapter) => ({
        chapterId: chapter.chapterId,
        chapterTitle: chapter.chapterTitle,
        chapterContent: chapter.chapterContent,
        chapterImageUri: chapter.chapterImageUri,
      }));

      setStory({
        storyId: storyData.storyId,
        storyTitle: storyData.storyTitle,
        chapters: chapters,
      });
    } catch (error) {
      console.error('Error fetching story:', error);
    }
  }, [story_id]);

  // Check if DOM has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch story data when component mounts
  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  useEffect(() => {
    setReadingProgress(
      Math.round((currentChapter / (story.chapters.length - 1)) * 100)
    );
  }, [currentChapter, story.chapters.length]);

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const nextChapter = () => {
    if (currentChapter < story.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  console.log('story', story);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-2 border-b z-20 bg-card fixed w-full">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="p-1">
            <BookOpen className="h-5 w-5" />
          </Button>
          <h1 className="text-sm md:text-xl font-bold">{story.storyTitle}</h1>
        </div>
        <div className="flex items-center gap-0 md:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Type className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleFontSizeChange(14)}>
                Small
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFontSizeChange(16)}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFontSizeChange(18)}>
                Large
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={toggleBookmark}>
            <Bookmark
              className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`}
            />
          </Button>

          {story.chapters && story.chapters.length > 0 && (
            <Button variant="ghost" size="icon">
              <Link
                href={`/chapter/read/${story.chapters[currentChapter].chapterId}`}
              >
                <Minimize2 className="h-5 w-5" />
              </Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <TableOfContents className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background">
              <SheetHeader>
                <SheetTitle>Table of Contents</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {story.chapters.map((chapter, index) => (
                  <button
                    key={chapter.chapterId}
                    className="py-2 px-4 rounded-md w-full flex items-center justify-between bg-card text-foreground active:scale-95"
                    onClick={() => setCurrentChapter(index)}
                  >
                    <span>{chapter.chapterTitle}</span>
                    {currentChapter === index && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-3 max-w-5xl mx-auto my-[85px]">
        <div
          className="flex flex-col justify-center items-center"
          style={{ fontSize: `${fontSize}px` }}
        >
          {/* Add conditional check */}
          {story.chapters.length > 0 ? (
            <>
              <h2 className="text-2xl md:text-4xl font-bold mb-3">
                {story.chapters[currentChapter].chapterTitle}
              </h2>
              {story.chapters[currentChapter].chapterImageUri && (
                <Image
                  src={story.chapters[currentChapter].chapterImageUri}
                  alt="chapterImg"
                  width={400}
                  height={350}
                  className="w-[100vw] sm:w-[400px] mb-6 rounded-md"
                />
              )}
              <div
                className="space-y-3"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    story.chapters[currentChapter].chapterContent
                  ),
                }}
              ></div>
            </>
          ) : (
            <p>Loading chapter...</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-card">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-muted">
          <div
            className="h-full bg-rainbow transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-1 sm:p-2 border-t ">
          <Button
            variant="ghost"
            onClick={prevChapter}
            disabled={currentChapter === 0}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous Chapter
          </Button>
          <div className="text-sm text-muted-foreground">
            <span className="hidden sm:block">
              Chapter {currentChapter + 1} of {story.chapters.length} (
              {readingProgress}%)
            </span>
            <span className="block sm:hidden">
              {currentChapter + 1}/{story.chapters.length}
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={nextChapter}
            disabled={currentChapter === story.chapters.length - 1}
          >
            Next Chapter
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveReader;
