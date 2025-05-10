import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';
import Reply from './Reply';
import { Comment } from '@/types/Comment';
import { timeAgo } from '@/utils/timeAgo';
import { Link } from '@/i18n/routing';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const [showReply, setShowReply] = useState(true);
  return (
    <div className="w-full flex items-start justify-between border-t border-accent pt-4">
      {/* user things */}
      <div className="flex gap-2 max-w-[90%]">
        {/* avatar */}
        <div>
          <Avatar className="">
            <AvatarImage
              src={comment.userAvatarUrl}
              alt={`${comment.userFirstName} avatar`}
            />
            <AvatarFallback>
              {comment.userFirstName.charAt(0)} {comment.userLastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="block space-y-2">
          <div className="flex flex-col bg-card rounded-xl p-3 w-fit">
            <Link
              href={`/profile/${comment.userId}/about`}
              className="text-base font-bold hover:underline"
            >
              {comment.userFirstName} {comment.userLastName}
            </Link>
            <div>{comment.comment_content}</div>
          </div>
          <div className="flex gap-2 items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">
              {timeAgo(comment.createdTime)}
            </span>
            <button
              className="font-bold text-muted-foreground hover:underline"
              type="button"
              onClick={() => setShowReply((prev) => !prev)}
            >
              {showReply ? 'Hide Replies' : 'View Replies'}
            </button>
            <button className="font-bold text-purpleRainbow hover:underline">
              Reply
            </button>
          </div>
          {showReply && (
            <div className="block space-y-2">
              <Reply />
              <Reply />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-1">
        <Heart className="w-5 h-5 text-purpleRainbow fill-purpleRainbow" />
        <span>220</span>
      </div>
    </div>
  );
};

export default CommentCard;
