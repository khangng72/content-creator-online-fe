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
import { useDebounce } from 'use-debounce';
import { DialogClose } from '@radix-ui/react-dialog';
import { delay } from '@/utils/Delay';
import { useRouter } from '@/i18n/routing';
import { b64JsonToFile } from '@/utils/b64JsonToFile';

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

  const [customPrompt, setCustomPrompt] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleGenerate = async () => {
    if (!storyTitle || storyTitle.trim() === '') {
      setError('Please enter a story title before generating an image.');
      return;
    }
    setLoading(true);
    try {
      const titlePrompt = `Generate a story cover. The title is: ${storyTitle}. `;

      const response = await axios.post('/api/ai/generate-image', {
        prompt: titlePrompt + customPrompt,
        model: 'gpt-image-1',
        size: '1024x1536',
      });

      const base64Img = response.data.b64_json;
      const file = b64JsonToFile(
        base64Img,
        `${storyTitle.replace(/\s+/g, '_')}_cover.png`
      );

      setPreviewImage(URL.createObjectURL(file));
      setUploadFile(file);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

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
                className="bg-card rounded-md w-[300px] h-[450px] "
              />
              <button
                onClick={deletePreviewImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-400"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              className="bg-card rounded-md w-[300px] h-[450px]  flex items-center justify-center"
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  className="flex px-3 py-1 bg-rainbow active:scale-95 rounded-md relative"
                  disabled={loading}
                  onClick={() => setIsDialogOpen(true)}
                >
                  <span>Generate With AI</span>
                  <Sparkles
                    fill="yellow"
                    color="yellow"
                    className="absolute -top-2 -right-3"
                  />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-card md:min-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Generate Story Cover</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <textarea
                    className="border border-gray-300 rounded p-2 w-full"
                    rows={5}
                    placeholder="Enter your custom prompt here..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                  ></textarea>
                  <button
                    className="bg-rainbow text-white py-2 px-4 rounded active:scale-95"
                    onClick={() => {
                      handleGenerate();
                    }}
                  >
                    {loading ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </DialogContent>
            </Dialog>
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
