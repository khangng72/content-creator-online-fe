import { Send } from 'lucide-react';
import React, { RefObject, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, POST_REPLY } from '@/constants/api';
import { Comment } from '@/types/Comment';

interface ReplyBoxProps {
  parentCommentId: string;
  setAddedReplies: React.Dispatch<React.SetStateAction<Comment[]>>;
  latestReplyRef: RefObject<HTMLDivElement>;
}

const ReplyBox = ({
  parentCommentId,
  setAddedReplies,
  latestReplyRef,
}: ReplyBoxProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');
  const [newComment] = useDebounce(text, 500);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = textarea.scrollHeight + 'px'; // Set to scrollHeight
    }
  };

  const scrollToLatestReply = () => {
    setTimeout(() => {
      if (latestReplyRef && latestReplyRef?.current) {
        latestReplyRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 50);
  };

  const handleReplySubmit = async () => {
    const token = Cookies.get('token');

    try {
      const uploadData = {
        replyContent: newComment,
      };
      const response = await axios.post(
        generateApi(POST_REPLY, parentCommentId),
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setText('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        setAddedReplies((prevReplies) => [response.data, ...prevReplies]);
        scrollToLatestReply();
      } else {
        console.error('Failed to post reply:', response.statusText);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error posting reply:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className="flex w-full gap-2 items-center relative">
      <textarea
        ref={textareaRef}
        className="w-full rounded-xl pl-3 pr-7 py-2 border border-accent overflow-hidden bg-card focus:outline-accent resize-none text-sm"
        maxLength={500}
        onInput={handleInput}
        rows={2}
        placeholder="Write a reply..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="bg-purpleRainbow hover:opacity-80 rounded-full flex justify-center items-center h-[35px] w-[35px] absolute right-3 bottom-2"
        onClick={handleReplySubmit}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ReplyBox;
