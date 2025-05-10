import React from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Logger } from '@/utils/Logger';
import { generateApi, GET_COMMENT_PAGED } from '@/constants/api';
import Cookies from 'js-cookie';
import { Comment } from '@/types/Comment';
import CommentCard from './CommentCard';

interface CommentListProps {
  chapterId: string;
}

const CommentList = ({ chapterId }: CommentListProps) => {
  const fetchComments = async ({ pageParam }: { pageParam: number }) => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(
        generateApi(
          GET_COMMENT_PAGED,
          `${chapterId}`,
          `page=${pageParam}&size=5`
        ),
        {
          headers,
        }
      );

      return response.data.result;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Logger.error('Error fetching comments:', 'client');
        throw new Error(`Error fetching comments: ${error.message}`);
      } else {
        Logger.error('Unexpected error:', 'client');
        throw new Error('Unexpected error occurred');
      }
    }
  };

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [`comments_${chapterId}`],
      queryFn: fetchComments,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length ? allPages.length : undefined;
        return nextPage;
      },
      staleTime: 1000 * 60 * 5,
    });

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const comments: Comment[] = data?.pages.flatMap((page) => page) || [];

  return (
    <div className="flex flex-col w-full gap-6 items-center text-sm">
      {comments.map((comment) => (
        <CommentCard key={comment.commentId} comment={comment} />
      ))}
      {hasNextPage && (
        <button
          className="w-full py-2 text-center text-base rounded-md bg-accent font-bold hover:cursor-pointer active:scale-95 transition-all duration-300 ease-in-out"
          type="button"
          onClick={handleLoadMore}
          disabled={isFetchingNextPage}
        >
          View more comments
        </button>
      )}
    </div>
  );
};

export default CommentList;
