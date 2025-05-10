import { Send } from 'lucide-react';
import React, { SetStateAction, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, POST_COMMENT } from '@/constants/api';
import { Comment } from '@/types/Comment';

interface CommentBoxProps {
  setAddedComment: React.Dispatch<SetStateAction<Comment[]>>;
  chapterId: string;
}

const CommentBox = ({ setAddedComment, chapterId }: CommentBoxProps) => {
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

  const handleCommentSubmit = async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.post(
        generateApi(POST_COMMENT, chapterId),
        {
          comment_content: newComment,
        },
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
        const newCommentData = response.data.result;
        setAddedComment((prevComments) => [newCommentData, ...prevComments]);
      } else {
        console.error('Failed to post comment:', response.statusText);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error posting comment:', error.message);
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
        rows={3}
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="bg-purpleRainbow hover:opacity-80 rounded-full flex justify-center items-center h-[35px] w-[35px] absolute right-3 bottom-2"
        onClick={handleCommentSubmit}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CommentBox;
