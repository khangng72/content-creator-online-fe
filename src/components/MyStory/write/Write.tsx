'use client';

import React, { useCallback, useEffect, useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ChevronDown,
  Cross,
  GanttChart,
  PlusCircleIcon,
  TypeOutline,
  WholeWord,
  X,
} from 'lucide-react';
import TipTapMenu from './TipTapMenu';
import ChapterOption from './ChapterOption';
import StarterKit from '@tiptap/starter-kit';
import { useEditor } from '@tiptap/react';
import EditorContentInput from './EditorContentInput';
import { Placeholder } from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Slider } from '@/components/ui/slider';
import { BasicStoryInfo } from '@/types/Story';

import Cookies from 'js-cookie';
import axios from 'axios';
import {
  generateApi,
  GET_CHAPTER_BY_ID,
  GET_CHAPTERS_BY_STORY_ID_AUTHOR_MODE,
  GET_STORY_BY_ID,
  UPDATE_CHAPTER_CONTENT,
} from '@/constants/api';
import { Chapter } from '@/types/Chapter';
import EditChapterTitle from './EditChapterTitle';
import { useDebounce } from 'use-debounce';

interface WriteProps {
  storyId: string;
  chapterId: string;
}

const Write = ({ storyId, chapterId }: WriteProps) => {
  const [story, setStory] = useState<BasicStoryInfo | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);

  const [showToolBar, setShowToolBar] = useState(true);

  const [textSize, setTextSize] = useState(19);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [wordSpacing, setWordSpacing] = useState(3);
  const [isMounted, setIsMounted] = useState(false);

  const [updatedChapterContent, setUpdatedChapterContent] = useState('');

  const [saving, setSaving] = useState(false);

  const [updatedChapterContentDebounced] = useDebounce(
    updatedChapterContent,
    1000
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Placeholder.configure({
        placeholder: 'Write your chapter here...',
      }),
    ],
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class:
          'w-[98vw] md:w-[90vw] bg-card min-h-[60vh] px-5 py-5 rounded-b-md focus:outline-none space-y-3',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setUpdatedChapterContent(html);
    },
  });

  const blurEditor = () => {
    // Find the editor's content DOM element
    (document.activeElement as HTMLElement)?.blur();
    const el = document.querySelector('.ProseMirror');
    if (el instanceof HTMLElement) {
      el.blur();
    }
  };

  const fetchStory = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(generateApi(GET_STORY_BY_ID, storyId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStory(response.data);
    } catch (error) {
      console.error('Error fetching story:', error);
    }
  }, [storyId]);

  const fetchChapters = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(
        generateApi(GET_CHAPTERS_BY_STORY_ID_AUTHOR_MODE, storyId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllChapters(response.data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  }, [storyId]);

  const fetchCurrentChapter = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(
        generateApi(GET_CHAPTER_BY_ID, chapterId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCurrentChapter(response.data);
        editor?.commands.setContent(response.data.chapterContent);
      } else {
        console.error('Error fetching current chapter:', response.data);
      }
    } catch (error) {
      console.error('Error fetching current chapter:', error);
    }
  }, [chapterId, editor]);

  const updateChapterContent = useCallback(async () => {
    const token = Cookies.get('token');
    setSaving(true);

    try {
      const response = await axios.put(
        generateApi(UPDATE_CHAPTER_CONTENT, chapterId),
        {
          chapterContent: updatedChapterContentDebounced,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log('Chapter content updated successfully');
      }
    } catch (error) {
      console.error('Error updating chapter content:', error);
    } finally {
      setTimeout(() => {
        setSaving(false);
      }, 3000);
    }
  }, [chapterId, updatedChapterContentDebounced]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  useEffect(() => {
    fetchCurrentChapter();
  }, [fetchCurrentChapter]);

  useEffect(() => {
    if (updatedChapterContentDebounced) {
      updateChapterContent();
    }
  }, [updatedChapterContentDebounced, updateChapterContent]);

  if (!isMounted || !editor) return null;

  return (
    <div className="pt-[56px] md:pt-[64px] flex flex-col items-center pb-[30px]">
      {!showToolBar && (
        <button
          className="text-xs flex gap-1 items-center fixed left-0 rounded-r-md bg-rainbow opacity-50 hover:opacity-100 px-3 py-1"
          onClick={() => setShowToolBar(true)}
        >
          <span>Tool</span>
          <Cross className="w-4 h-4" />
        </button>
      )}

      {showToolBar && (
        <div className="w-full flex flex-col items-center fixed z-10">
          <div className="w-full lg:w-[90vw] bg-card border border-accent rounded-md py-2 px-3 flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between md:items-center">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-between gap-1 bg-secondary rounded-md px-2 py-1 hover:bg-background md:w-[40%] xl:w-[35%] z-20">
                  <div className="flex flex-col items-start">
                    <h1 className="text-lg md:text-xl font-bold text-left bg-rainbow text-transparent bg-clip-text">
                      {story?.storyTitle}
                    </h1>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm md:text-base text-left font-bold">
                        {currentChapter?.chapterNumber}.{' '}
                        {currentChapter?.chapterTitle}
                      </span>

                      {saving && (
                        <span className="text-sm md:text-base text-purpleRainbow">
                          Saving...
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <ChevronDown className="text-muted-foreground" size={16} />
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-96 bg-secondary flex flex-col px-0 py-2 gap-2 z-20"
                align="center"
              >
                <div className="flex justify-center border-b-2 border-accent py-2 w-full">
                  <h3 className="font-bold">Chapter List</h3>
                </div>
                <ul className="max-h-[250px] overflow-auto w-full scroll-container">
                  {allChapters.map((chapter) => {
                    if (chapter.chapterId !== currentChapter?.chapterId) {
                      return (
                        <ChapterOption
                          key={chapter.chapterId}
                          chapter={chapter}
                          checked={false}
                        />
                      );
                    }

                    return (
                      <ChapterOption
                        key={currentChapter.chapterId}
                        chapter={chapter}
                        checked={true}
                      />
                    );
                  })}
                  {/* Add more chapters here */}
                </ul>
                <div className="flex justify-center">
                  <button className="bg-rainbow py-1 px-4 rounded-md text-sm flex gap-1 items-center active:scale-95">
                    <span>Add</span>
                    <PlusCircleIcon className="w-5 h-5" strokeWidth={1} />
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* functional button */}
            <div className="grid grid-cols-3 gap-2">
              <button className="bg-rainbow py-1 px-3 text-sm rounded-md active:scale-95">
                Publish
              </button>

              <button className="bg-foreground text-background py-1 px-3 text-sm rounded-md active:scale-95">
                Save
              </button>

              <button className="bg-foreground text-background py-1 px-3 text-sm rounded-md active:scale-95">
                Preview
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-2 items-center">
            <TipTapMenu editor={editor} />

            <div className="flex gap-1 items-center">
              {/* word spacing */}
              <Drawer>
                <DrawerTrigger asChild>
                  <button
                    className="bg-secondary flex gap-1 items-center justify-center px-2 py-1 text-xs rounded-md active:scale-95"
                    onClick={blurEditor}
                  >
                    <span>Word Spacing</span>
                    <WholeWord className="hidden sm:block w-4 h-4" />
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm h-[25vh]">
                    <DrawerHeader className="flex flex-col items-center">
                      <DrawerTitle>Modify word spacing</DrawerTitle>
                      <DrawerDescription>
                        Ranging from 2px to 8px
                      </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex flex-col items-center justify-center gap-5">
                      <h1 className="text-6xl font-bold">
                        {wordSpacing}
                        <span className="text-3xl">px</span>
                      </h1>
                      <Slider
                        defaultValue={[3]}
                        min={2}
                        max={8}
                        step={0.5}
                        className="w-[60%]"
                        onValueChange={([val]) => setWordSpacing(val)}
                        value={[wordSpacing]}
                      />
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              {/* line height */}
              <Drawer>
                <DrawerTrigger asChild>
                  <button
                    className="bg-secondary flex gap-1 items-center justify-center px-2 py-1 text-xs rounded-md active:scale-95"
                    onClick={blurEditor}
                  >
                    <span>Line height</span>
                    <GanttChart className="hidden sm:block w-4 h-4" />
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm h-[25vh]">
                    <DrawerHeader className="flex flex-col items-center">
                      <DrawerTitle>Modify line height</DrawerTitle>
                      <DrawerDescription>
                        Ranging from 1.5 to 3
                      </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex flex-col items-center justify-center gap-5">
                      <h1 className="text-6xl font-bold">{lineHeight}</h1>
                      <Slider
                        defaultValue={[1.7]}
                        min={1.5}
                        max={3}
                        step={0.05}
                        className="w-[60%]"
                        onValueChange={([val]) => setLineHeight(val)}
                        value={[lineHeight]}
                      />
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              {/* text size */}
              <Drawer>
                <DrawerTrigger asChild>
                  <button
                    className="bg-secondary flex gap-1 items-center justify-center px-2 py-1 text-xs rounded-md active:scale-95"
                    onClick={blurEditor}
                  >
                    <span>Text Size</span>
                    <TypeOutline className="hidden sm:block w-4 h-4" />
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm h-[25vh]">
                    <DrawerHeader className="flex flex-col items-center">
                      <DrawerTitle>Modify Text Size</DrawerTitle>
                      <DrawerDescription>
                        Ranging from 14 to 32
                      </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex flex-col items-center justify-center gap-5">
                      <h1 className="text-6xl font-bold">{textSize}</h1>
                      <Slider
                        defaultValue={[19]}
                        min={14}
                        max={32}
                        step={0.5}
                        className="w-[60%]"
                        onValueChange={([val]) => setTextSize(val)}
                        value={[textSize]}
                      />
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
              <button className="p-1 flex justify-center items-center rounded-full bg-red-500 hover:opacity-80">
                <X className="w-5 h-5" onClick={() => setShowToolBar(false)} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={
          showToolBar ? 'mt-[240px] md:mt-[150px] bg-card' : 'mt-[30px] bg-card'
        }
      >
        {currentChapter && (
          <EditChapterTitle
            chapterTitle={currentChapter?.chapterTitle}
            chapterId={currentChapter?.chapterId}
            fetchCurrentChapter={fetchCurrentChapter}
            setSaving={setSaving}
          />
        )}

        <EditorContentInput
          editor={editor}
          textSize={textSize}
          lineHeight={lineHeight}
          wordSpacing={wordSpacing}
        />
      </div>
    </div>
  );
};

export default Write;
