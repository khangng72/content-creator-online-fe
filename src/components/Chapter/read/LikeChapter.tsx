'use client';
import { Heart } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import {
  CHECK_IF_CURRENT_USER_LIKE_CHAPTER,
  generateApi,
  TOGGLE_CURRENT_USER_LIKE_CHAPTER,
} from '@/constants/api';
import axios from 'axios';

interface LikeChapterProps {
  chapterId: string;
  fetchChapter: () => Promise<void>;
}

const LikeChapter = ({ chapterId, fetchChapter }: LikeChapterProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const checkIfUserLikeChapter = useCallback(async () => {
    const token = Cookie.get('token');
    try {
      const response = await axios.get(
        generateApi(CHECK_IF_CURRENT_USER_LIKE_CHAPTER, chapterId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLiked(response.data);
      } else {
        console.error('Error checking like status:', response.status);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }, [chapterId]);

  const toggleLikeChapter = async () => {
    const token = Cookie.get('token');
    try {
      const response = await axios.post(
        generateApi(TOGGLE_CURRENT_USER_LIKE_CHAPTER, chapterId),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLiked((prev) => !prev);
        fetchChapter();
      } else {
        console.error('Error toggling like status:', response.status);
      }
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };

  useEffect(() => {
    checkIfUserLikeChapter();
  }, [checkIfUserLikeChapter]);

  return isLiked ? (
    <button
      className="flex items-center gap-1 text-purpleRainbow font-bold"
      onClick={toggleLikeChapter}
    >
      <span>Liked</span>
      <Heart className="fill-purpleRainbow" />
    </button>
  ) : (
    <button
      className="flex items-center gap-1 hover:text-purpleRainbow hover:font-bold"
      onClick={toggleLikeChapter}
    >
      <span>Like</span>
      <Heart />
    </button>
  );
};

export default LikeChapter;
