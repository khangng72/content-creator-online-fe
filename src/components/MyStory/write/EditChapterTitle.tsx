import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, UPDATE_CHAPTER_TITLE } from '@/constants/api';

interface EditChapterTitleProps {
  chapterTitle: string;
  chapterId: string;
  fetchCurrentChapter: () => Promise<void>;
  setSaving: (saving: boolean) => void;
}

const EditChapterTitle = ({
  chapterTitle,
  chapterId,
  setSaving,
  fetchCurrentChapter,
}: EditChapterTitleProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');
  const [newTitle] = useDebounce(text, 1000);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
    }
  };

  const updateChapterTitle = useCallback(async () => {
    if (newTitle == chapterTitle) {
      return;
    }

    setSaving(true);

    const token = Cookies.get('token');
    try {
      const response = await axios.put(
        generateApi(UPDATE_CHAPTER_TITLE, chapterId),
        {
          chapterTitle: newTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Chapter title updated successfully');
        fetchCurrentChapter();
      } else {
        console.error('Failed to update chapter title');
      }
    } catch (error) {
      console.error('Error updating chapter title:', error);
    } finally {
      setTimeout(() => {
        setSaving(false);
      }, 3000);
    }
  }, [newTitle, chapterTitle, fetchCurrentChapter, setSaving, chapterId]);

  useEffect(() => {
    setText(chapterTitle);
  }, [chapterTitle]);

  useEffect(() => {
    if (newTitle && newTitle !== chapterTitle) {
      updateChapterTitle();
    }
  }, [newTitle, updateChapterTitle, chapterTitle]);

  return (
    <textarea
      ref={textareaRef}
      className="bg-card w-[98vw] md:w-[90vw] px-4 py-4 text-center focus:outline-none text-xl md:text-3xl border-b-2 border-b-accent rounded-t-md placeholder:text-muted-foreground font-bold md:font-extrabold resize-none m-0 overflow-hidden"
      placeholder="Type your chapter name"
      onInput={handleInput}
      value={text}
      onChange={(e) => setText(e.target.value)}
      rows={1}
    />
  );
};

export default EditChapterTitle;
