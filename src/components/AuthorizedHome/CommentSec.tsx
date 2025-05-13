import React, { Ref, useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

import { Heart } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import StarsDialog from './StarsDialog';
import Reply from './Reply';
import { Comment } from '@/types/Comment';
import axios from 'axios';
import { generateApi, GET_REPLIES } from '@/constants/api';
import Cookies from 'js-cookie';

interface CommentSecProps {
  comment: Comment;
  lastRef?: Ref<HTMLDivElement>;
}

const CommentSec = ({ comment, lastRef }: CommentSecProps) => {
  const [showReply, setShowReply] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const [replies, setReplies] = useState<Comment[]>([]);
  const replyBoxRef = useRef<HTMLTextAreaElement>(null);
  const replyButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleClickReply = useCallback(() => {
    setShowReplyBox(true);
    if (showReplyBox && replyBoxRef.current) {
      // Scroll into view
      replyBoxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      // Focus the textarea
      replyBoxRef.current.focus();
    }
  }, [showReplyBox]);

  useEffect(() => {
    if (showReplyBox && replyBoxRef.current) {
      // Scroll into view
      replyBoxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      // Focus the textarea
      replyBoxRef.current.focus();
    }
  }, [showReplyBox]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  return (
    <div className="block" ref={lastRef}>
      {/* Anchor comment */}
      <div className="flex items-start gap-2 w-full ">
        <Avatar className="w-[35px] h-[35px]">
          <AvatarImage src={comment.userAvatarUrl} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col w-[80%] items-start">
          <div className="px-3 py-1 bg-secondary rounded-md space-y-1">
            <span className="font-bold text-sm">
              {comment.userFirstName} {comment.userLastName}
            </span>
            <p className="text-sm whitespace-pre-wrap">
              {comment.comment_content}
            </p>
          </div>

          <div className="flex justify-between gap-4">
            <div className="text-sm text-muted-foreground flex gap-3">
              <button className="hover:underline" type="button">
                Like
              </button>
              <button
                className="hover:underline"
                type="button"
                onClick={handleClickReply}
                ref={replyButtonRef}
              >
                Reply
              </button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="flex gap-1 items-center px-2 py-1 rounded-full hover:bg-secondary hover:cursor-pointer"
                  type="button"
                >
                  <span className="text-sm text-muted-foreground">20</span>
                  <Heart className="text-purpleRainbow fill-purpleRainbow h-4 w-4" />
                </button>
              </DialogTrigger>
              <StarsDialog />
            </Dialog>
          </div>

          <div className="flex flex-col w-full">
            <button
              className="text-left text-sm text-muted-foreground font-semibold hover:underline"
              type="button"
              onClick={() => setShowReply((s) => !s)}
            >
              {showReply ? 'Hide replies' : 'Show replies'}
            </button>

            {/* Reply list */}
            {showReply && (
              <div className="mt-3 flex flex-col ml-3 gap-4">
                {replies.length > 0 ? (
                  replies.map((reply) => (
                    <Reply key={reply.commentId} comment={reply} />
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No replies yet
                  </span>
                )}
              </div>
            )}

            {showReplyBox && (
              <div className="mt-4 ml-3 flex w-full gap-2 items-start">
                <Avatar className="w-[30px] h-[30px]">
                  <AvatarImage src={comment.userAvatarUrl} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <textarea
                  ref={replyBoxRef}
                  className="w-full bg-secondary rounded-md px-3 py-1 text-sm resize-none"
                  placeholder="Write a reply..."
                  rows={1}
                  onFocus={(e) => {
                    e.target.rows = 1;
                  }}
                  onBlur={(e) => {
                    e.target.rows = 1;
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                ></textarea>
                <button
                  className="bg-rainbow px-3 py-1 rounded-md active:scale-95 text-xs sm:text-sm"
                  type="button"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSec;
