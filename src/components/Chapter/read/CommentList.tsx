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
      <button className="w-full sm:w-[50%] border-2 border-foreground py-2 text-center text-base rounded-md hover:bg-accent font-bold">
        View more comments
      </button>
    </div>
  );
};

export default CommentList;
