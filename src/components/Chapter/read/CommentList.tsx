import React from 'react';
import Comment from './Comment';

interface CommentListProps {
  chapterId: string;
}

const CommentList = ({ chapterId }: CommentListProps) => {
  console.log('chapterId', chapterId);
  return (
    <div className="flex flex-col w-full gap-6 items-center text-sm">
      <Comment />
      <Comment />
    </div>
  );
};

export default CommentList;
