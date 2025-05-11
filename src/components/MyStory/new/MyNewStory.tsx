'use client';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import GenreSelect from '@/components/MyStory/new/GenreSelect';
import { Genre } from '@/types/Genre';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  CREATE_NEW_CHAPTER_STORY,
  CREATE_STORY,
  generateApi,
  GET_ALL_GENRES,
  UPDATE_STORY_GENRE,
} from '@/constants/api';
import { ImageIcon, Sparkles } from 'lucide-react';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';
import { useDebounce } from 'use-debounce';
import { DialogClose } from '@radix-ui/react-dialog';
import { delay } from '@/utils/Delay';
import { useRouter } from '@/i18n/routing';

const MyNewStory = () => {
  const [storyTitle, setStoryTitle] = useState('Your Story Title');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [storyDescription] = useDebounce(textAreaValue, 500);
  const router = useRouter();

  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [genreList, setGenreList] = useState<Genre[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadGenreError, setLoadGenreError] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [error, setError] = useState('');

  const [isCreatingStory, setIsCreatingStory] = useState(false);

  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const triggerUploadFile = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }

      setUploadFile(file);

      const objectURL = URL.createObjectURL(file);
      setPreviewImage(objectURL);
    }
  };

  const deletePreviewImage = (): void => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setUploadFile(null);
      setPreviewImage(null);
      fileInputRef.current!.value = '';
    }
  };

  const getAllGenre = async () => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      await axios
        .get(generateApi(GET_ALL_GENRES), { headers })
        .then((response) => {
          setGenreList(response.data.result);
          setLoading(false);
        })
        .catch((error) => {
          setLoadGenreError(error);
          setLoading(false);
        });
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSaveStory = async () => {
    setIsCreatingStory(true);
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      let uploadFileResult = null;
      if (uploadFile) {
        const formFile = new FormData();
        formFile.append('file', uploadFile as File);
        uploadFileResult = await axios
          .post('/api/upload', formFile, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
          .catch((error) => {
            console.log('Error', error);
          });
      }

      const newStory = {
        storyTitle: storyTitle,
        storyDescription: storyDescription,
        coverImageUri: uploadFileResult?.data.path || null,
      };

      const createStoryResult = await axios.post(
        generateApi(CREATE_STORY),
        newStory,
        {
          headers,
        }
      );

      const updateGenreRequestBody = {
        genreList: selectedGenres,
      };

      await axios.put(
        generateApi(UPDATE_STORY_GENRE, createStoryResult.data.result.storyId),
        updateGenreRequestBody,
        {
          headers,
        }
      );

      const createChapterRequestBody = {
        storyId: createStoryResult.data.result.storyId,
        chapterTitle: 'Untitled Chapter',
        chapterContent: '',
      };

      const createNewChapterResult = await axios.post(
        generateApi(
          CREATE_NEW_CHAPTER_STORY,
          createStoryResult.data.result.storyId
        ),
        createChapterRequestBody,
        {
          headers,
        }
      );

      await delay();
      router.push(
        `/mystory/${createStoryResult.data.result.storyId}/write/${createNewChapterResult.data.result.chapterId}`
      );
    } catch (error) {
      console.error('Error saving story:', error);
      setError('Something went wrong, please try again.');
    } finally {
      setIsCreatingStory(false);
    }
  };

  useEffect(() => {
    getAllGenre();
  }, []);

  function b64JsonToFile(b64: string, fileName: string): File {
    const byteString = atob(b64); // decode base64
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ia], fileName, { type: 'image/png' });
  }
  
  const handleGenerate = async () => {
    if (!storyTitle) {
      setError('Please enter a story title before generating an image.');
      return;
    }
    setLoading(true);
    try {
      const originalPrompt = `Generate a story cover. A dark empty road with graves and incense on both sides. The time is afternoon. The title is in Vietnamese: ${storyTitle}.`;

      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            prompt: originalPrompt,
            n: 1,
            size: "1024x1536",
            model: "gpt-image-1",
          }),
        }
      );

      const data = await response.json();
      const base64Img = data.data[0].b64_json;
      // const base64Img = "9xZGlnaXRhbFNvdXJjZVR5cGV4Rmh0dHA6Ly9jdi5pcHRjLm9yZy9uZXdzY29kZXMvZGlnaXRhbHNvdXJjZXR5cGUvdHJhaW5lZEFsZ29yaXRobWljTWVkaWGiZmFjdGlvbm5jMnBhLmNvbnZlcnRlZG1zb2Z0d2FyZUFnZW50v2RuYW1lak9wZW5BSSBBUEn"
      const file = b64JsonToFile(base64Img, `${storyTitle.replace(/\s+/g, "_")}_cover.png`);

      setPreviewImage(URL.createObjectURL(file));
      setUploadFile(file);

    } catch (error) {
      console.error("Error generating image:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center mb-[50px] pt-[100px] h-screen">
      <div className="h-10 rounded-md bg-rainbow px-3">
        <h1 className="text-4xl font-bold text-white">
          {storyTitle || 'Untitled Story'}
        </h1>
      </div>
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="mt-7 flex flex-col gap-4 xl:gap-0 xl:flex-row w-[100vw] md:w-[95vw] xl:w-[80vw] justify-center items-start">
        <div className="w-full xl:w-[40%] flex flex-col items-center justify-center">
          {previewImage ? (
            <div className="relative">
              <Image
                src={previewImage}
                alt="CoverImage"
                height={300}
                width={200}
                className="bg-card rounded-md h-[320px] w-[400px]"
              />
              <div className="loading">
                {loading && (
                  <div className="flex items-center justify-center mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              <button
                onClick={deletePreviewImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-400"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              className="bg-card rounded-md h-[320px] w-[400px] flex items-center justify-center"
              onClick={triggerUploadFile}
            >
              <ImageIcon size={32} className="text-muted-foreground" />
            </button>
          )}

          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              className="flex px-3 py-1 bg-foreground text-background rounded-md active:scale-95"
              onClick={triggerUploadFile}
            >
              Upload File
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex px-3 py-1 bg-rainbow opacity-80 active:scale-95 rounded-md relative"
                    disabled={loading}
                    onClick={()=>{handleGenerate()}}
                  >
                    <span>Generate With AI</span>
                    <Sparkles
                      fill="yellow"
                      color="yellow"
                      className="absolute -top-2 -right-3"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate your cover with our AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="bg-card w-full xl:w-[80%] px-8 py-4 rounded-md flex flex-col items-start gap-4">
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="storyTitle" className="text-lg font-bold">
              Story Title
            </label>
            <input
              type="text"
              id="storyTitle"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              placeholder="Enter your story title"
              className="border border-gray-300 rounded p-2"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="storyContent" className="text-lg font-bold">
              Story Description
            </label>
            <textarea
              id="storyContent"
              rows={10}
              className="border border-gray-300 rounded p-2"
              placeholder="Write your story here..."
              onChange={(e) => setTextAreaValue(e.target.value)}
            ></textarea>
          </div>

          <div className="flex flex-col w-full gap-1">
            <label htmlFor="storyContent" className="text-lg font-bold">
              Story Genre
            </label>

            {/* display chosen genres */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {selectedGenres.map((genre) => (
                  <div
                    key={genre.genreId}
                    className="bg-rainbow rounded-md px-1 py-1 flex items-center justify-center relative"
                  >
                    {/* X Button */}
                    <button
                      onClick={() =>
                        setSelectedGenres((prev) =>
                          prev.filter((g) => g.genreId !== genre.genreId)
                        )
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-400"
                    >
                      ✕
                    </button>

                    <div className="w-full h-full bg-secondary rounded-md flex items-center justify-center py-2">
                      <span className="text-xs sm:text-sm font-mono font-semibold">
                        {genre.genreName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-foreground text-background rounded-md w-[150px] py-1 active:scale-95">
                    Select Genre
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-card md:min-w-[900px]">
                  <DialogHeader className="flex flex-col items-center justify-center pt-2 pb-1">
                    <DialogTitle>
                      <span>Choose some genres (optional)</span>
                    </DialogTitle>
                    <DialogDescription className="hidden">
                      Select the genre of your story from the list below.
                    </DialogDescription>
                  </DialogHeader>
                  <GenreSelect
                    selectedGenres={selectedGenres}
                    setSelectedGenres={setSelectedGenres}
                    genreList={genreList}
                    loading={loading}
                    loadGenreError={loadGenreError}
                  />

                  <DialogFooter className="flex flex-row-reverse items-center justify-start">
                    <DialogClose>
                      <button className="bg-rainbow py-2 w-[100px] text-sm rounded-md active:scale-95">
                        Accept
                      </button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex flex-row-reverse w-full gap-3 items-center">
            <button
              className="bg-rainbow w-[100px] py-1 rounded active:scale-95"
              onClick={handleSaveStory}
            >
              Save Story
            </button>
            <button className="bg-muted-foreground text-background w-[100px] py-1 rounded">
              Skip
            </button>

            {isCreatingStory && (
              <div className="flex items-center justify-center">
                <span className="loader"></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNewStory;
