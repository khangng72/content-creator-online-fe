import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  CHECK_IF_CHAPTER_IS_PUBLISHED,
  generateApi,
  TOGGLE_CHAPTER_PUBLISH,
} from '@/constants/api';
import { Link } from '@/i18n/routing';
import { toast } from '@/hooks/use-toast';

interface FunctionalBtnProps {
  chapterId: string;
  fetchCurrentChapter: () => Promise<void>;
  updateChapterContent: () => Promise<void>;
}

const FunctionalBtn = ({
  chapterId,
  fetchCurrentChapter,
  updateChapterContent,
}: FunctionalBtnProps) => {
  const [isPublished, setIsPublished] = useState(false);

  const fetchPublishStatus = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(
        generateApi(CHECK_IF_CHAPTER_IS_PUBLISHED, chapterId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const { data } = response;
        setIsPublished(data);
      } else {
        console.error('Error fetching publish status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching publish status:', error);
    }
  }, [chapterId]);

  const togglePublish = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.put(
        generateApi(TOGGLE_CHAPTER_PUBLISH, chapterId),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchPublishStatus();
        fetchCurrentChapter();
      } else {
        console.error('Error toggling publish status:', response.status);
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  }, [chapterId, fetchPublishStatus, fetchCurrentChapter]);

  const handleSaveChapter = async () => {
    try {
      await updateChapterContent();
      toast({
        title: 'Chapter saved',
        description: 'Your chapter has been saved successfully.',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving chapter:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the chapter.',
        duration: 2000,
      });
      return;
    }
  };

  useEffect(() => {
    fetchPublishStatus();
  }, [fetchPublishStatus]);
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        className={'bg-rainbow py-1 px-3 text-sm rounded-md active:scale-95'}
        onClick={togglePublish}
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </button>

      <button
        className="bg-foreground text-background py-1 px-3 text-sm rounded-md active:scale-95"
        onClick={handleSaveChapter}
      >
        Save
      </button>

      <Link
        href={`/chapter/read/${chapterId}`}
        className="bg-foreground text-background py-1 px-3 text-sm rounded-md active:scale-95 text-center"
      >
        Preview
      </Link>
    </div>
  );
};

export default FunctionalBtn;
