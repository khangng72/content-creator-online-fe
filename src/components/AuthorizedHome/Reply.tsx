import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Comment } from '@/types/Comment';

const mock_reply = 'reply to this comment';

interface ReplyProps {
  comment: Comment;
}

const Reply = ({ comment }: ReplyProps) => {
  return (
    <div className="flex items-start gap-2">
      <Avatar className="w-[30px] h-[30px]">
        <AvatarImage src={comment.userAvatarUrl} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="px-3 py-1 bg-secondary rounded-md space-y-1">
        <span className="font-bold text-sm">Khang Nguyen</span>
        <p className="text-sm whitespace-pre-wrap">{mock_reply}</p>
      </div>
    </div>
  );
};

export default Reply;
