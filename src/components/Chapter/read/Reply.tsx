import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@/i18n/routing';
import { Comment } from '@/types/Comment';
import { timeAgo } from '@/utils/timeAgo';
import { forwardRef, useState } from 'react';

import React from 'react';
import LikeComment from './LikeComment';

interface ReplyProps {
  comment: Comment;
  className?: string;
}

const Reply = forwardRef<HTMLDivElement, ReplyProps>(
  ({ comment, className }, ref) => {
    const [numberOfLikes, setNumberOfLikes] = useState(comment.numberOfLikes);

    return (
      <div className="w-full flex items-start justify-between" ref={ref}>
        {/* user things */}
        <div className="flex gap-2 max-w-full">
          {/* avatar */}
          <div>
            <Avatar>
              <AvatarImage
                src={comment.userAvatarUrl}
                alt={`${comment.userFirstName} ${comment.userFirstName} avatar`}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="block space-y-2">
            <div
              className={`flex flex-col ${
                className ? className : 'bg-card'
              } rounded-xl p-3`}
            >
              <Link
                href={`/profile/${comment.userId}/about`}
                className="text-base font-bold hover:underline"
              >
                {comment.userFirstName} {comment.userLastName}
              </Link>
              <div className="whitespace-pre-wrap">
                {comment.comment_content}
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <span className="text-muted-foreground">
                {timeAgo(comment.createdTime)}
              </span>
              <div className="flex items-center justify-center gap-1 text-xs">
                <LikeComment
                  comment={comment}
                  setNumberOfLikes={setNumberOfLikes}
                  className="w-5 h-5"
                />
                <span className="text-muted-foreground">{numberOfLikes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
Reply.displayName = 'Reply';
export default Reply;
