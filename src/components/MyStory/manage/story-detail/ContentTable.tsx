import React, { useCallback, useEffect, useState } from 'react';
import ChapterCard from './ChapterCard';
import { PlusIcon } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  CREATE_NEW_CHAPTER_STORY,
  generateApi,
  GET_CHAPTERS_BY_STORY_ID_AUTHOR_MODE,
} from '@/constants/api';
import { Chapter } from '@/types/Chapter';
import { useRouter } from '@/i18n/routing';
import { toast } from '@/hooks/use-toast';

interface ContentTableProps {
  storyId: string;
}

const ContentTable = ({ storyId }: ContentTableProps) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  const router = useRouter();

  const fetchChapters = useCallback(async () => {
    const token = Cookies.get('token');
    console.log('here');

    try {
      const response = await axios.get(
        generateApi(GET_CHAPTERS_BY_STORY_ID_AUTHOR_MODE, storyId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setChapters(response.data);
      } else {
        console.log('Error fetching chapters');
      }
    } catch (error) {
      console.log('Error', error);
    }
  }, [storyId]);

  const createNewChapter = async () => {
    const token = Cookies.get('token');

    try {
      const request = {
        chapterTitle: 'Untitled Chapter',
        chapterDescription: '',
        chapterContent: '',
        chapterImageUrl: null,
      };
      const response = await axios.post(
        generateApi(CREATE_NEW_CHAPTER_STORY, storyId),
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log('New chapter created successfully');
        router.push(
          `/mystory/${storyId}/write/${response.data.result.chapterId}`
        );
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create new chapter',
          variant: 'destructive',
        });
        console.log('Error creating new chapter');
      }
    } catch (error) {
      console.log('Error creating new chapter', error);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  return (
    <div className="py-3 flex flex-col gap-3">
      <div className="w-full pb-3 border-b border-accent px-3">
        <button
          className="bg-purpleRainbow px-3 py-1 text-sm rounded-md flex gap-1 items-center active:scale-95 transition-all duration-200 ease-in-out"
          onClick={createNewChapter}
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Chapter</span>
        </button>
      </div>
      {chapters.map((chapter) => (
        <ChapterCard
          key={chapter.chapterId}
          chapter={chapter}
          fetchChapters={fetchChapters}
        />
      ))}

      {/* Placeholder for additional chapters */}
    </div>
  );
};

export default ContentTable;
