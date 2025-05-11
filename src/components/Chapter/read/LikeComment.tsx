'use client';

import { Heart } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  CHECK_IF_USER_LIKED_COMMENT,
  generateApi,
  TOGGLE_LIKE_COMMENT,
} from '@/constants/api';
import { Comment } from '@/types/Comment';

interface LikeCommentProps {
  comment: Comment;
  setNumberOfLikes: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
}
const LikeComment = ({
  comment,
  setNumberOfLikes,
  className,
}: LikeCommentProps) => {
  const [isLikedComment, setIsLikedComment] = useState(false);

  const toggleLikeComment = () => {
    const token = Cookies.get('token');

    axios
      .post(
        generateApi(TOGGLE_LIKE_COMMENT, comment.commentId),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          fetchIsLikedComment();
          setNumberOfLikes((prev: number) =>
            isLikedComment ? prev - 1 : prev + 1
          );
        } else {
          console.error('Error toggling like status:', response.statusText);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          console.error('Error toggling like status:', error.message);
        } else {
          console.error('Unexpected error occurred while toggling like status');
        }
      });
  };

  const fetchIsLikedComment = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(
        generateApi(CHECK_IF_USER_LIKED_COMMENT, comment.commentId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLikedComment(response.data);
      } else {
        console.error('Error fetching like status:', response.statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching like status:', error.message);
      } else {
        console.error('Unexpected error occurred while fetching like status');
      }
    }
  }, [comment.commentId]);

  useEffect(() => {
    fetchIsLikedComment();
  }, [fetchIsLikedComment]);

  return (
    <button className="hover:cursor-pointer" onClick={toggleLikeComment}>
      {isLikedComment ? (
        <Heart
          className={`${className} text-purpleRainbow fill-purpleRainbow`}
        />
      ) : (
        <Heart className={`${className} text-muted-foreground`} />
      )}
    </button>
  );
};

export default LikeComment;
