import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Reply from './Reply';
import { Comment } from '@/types/Comment';
import { timeAgo } from '@/utils/timeAgo';
import { Link } from '@/i18n/routing';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, GET_REPLIES } from '@/constants/api';

import ReplyBox from './ReplyBox';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const [showReply, setShowReply] = useState(true);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [addedReplies, setAddedReplies] = useState<Comment[]>([]);

  const replyBoxRef = useRef<HTMLDivElement>(null);
  const latestReplyRef = useRef<HTMLDivElement>(null);

  const fetchReplies = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(
        generateApi(GET_REPLIES, comment.commentId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setReplies(response.data.result);
      } else {
        console.error('Error fetching replies:', response.statusText);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching replies:', error.message);
      } else {
        console.error('Unexpected error occurred while fetching replies');
      }
    }
  }, [comment.commentId]);

  const openReplyBox = () => {
    setShowReplyBox(true);

    setTimeout(() => {
      if (replyBoxRef.current) {
        replyBoxRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 50);
  };

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  return (
    <div className="w-full flex flex-col gap-3">
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
                {comment.userFirstName.charAt(0)}{' '}
                {comment.userLastName.charAt(0)}
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
              <div className="whitespace-pre-wrap">
                {comment.comment_content}
              </div>
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
              <button
                className="font-bold text-purpleRainbow hover:underline"
                onClick={openReplyBox}
              >
                Reply
              </button>
            </div>
            {showReply && (
              <div className="block space-y-2">
                {addedReplies.length > 0 &&
                  addedReplies.map((addedReply, index) => (
                    <Reply
                      key={addedReply.commentId}
                      comment={addedReply}
                      ref={
                        index == addedReplies.length - 1 ? latestReplyRef : null
                      }
                    />
                  ))}

                {replies.length > 0 &&
                  replies.map((reply) => (
                    <Reply key={reply.commentId} comment={reply} />
                  ))}

                {replies.length == 0 && addedReplies.length == 0 && (
                  <div className="text-sm text-muted-foreground">
                    No replies yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-1">
          <Heart className="w-5 h-5 text-purpleRainbow fill-purpleRainbow" />
          <span>{comment.numberOfLikes}</span>
        </div>
      </div>

      {showReplyBox && (
        <div className="w-full pl-11" ref={replyBoxRef}>
          <ReplyBox
            parentCommentId={comment.commentId}
            setAddedReplies={setAddedReplies}
            latestReplyRef={latestReplyRef}
          />
        </div>
      )}
    </div>
  );
};

export default CommentCard;
