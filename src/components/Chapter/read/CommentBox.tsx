import { Send } from 'lucide-react';
import React, { useRef } from 'react';

const CommentBox = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = textarea.scrollHeight + 'px'; // Set to scrollHeight
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
      />
      <button className="bg-purpleRainbow hover:opacity-80 rounded-full flex justify-center items-center h-[35px] w-[35px] absolute right-3 bottom-2">
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CommentBox;
