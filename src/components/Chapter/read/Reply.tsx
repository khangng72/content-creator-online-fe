import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@/i18n/routing';
import { Comment } from '@/types/Comment';
import { timeAgo } from '@/utils/timeAgo';
import { Heart } from 'lucide-react';

import React from 'react';

interface ReplyProps {
  comment: Comment;
}

const Reply = ({ comment }: ReplyProps) => {
  return (
    <div className="w-full flex items-start justify-between">
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
          <div className="flex flex-col bg-card rounded-xl p-3">
            <Link
              href={`/profile/${comment.userId}/about`}
              className="text-base font-bold hover:underline"
            >
              {comment.userFirstName} {comment.userLastName}
            </Link>
            <div>{comment.comment_content}</div>
          </div>
          <div className="flex gap-2 justify-between">
            <span className="text-muted-foreground">
              {timeAgo(comment.createdTime)}
            </span>
            <div className="flex items-center justify-center gap-1 text-xs">
              <Heart className="w-4 h-4 text-purpleRainbow fill-purpleRainbow" />
              <span className="text-muted-foreground">220</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
