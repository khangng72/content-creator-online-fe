'use client';

import React, { useEffect, useState, useRef } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

import GenreMultiSelect from './GenreMultiSelect';
import BasicInfoInput from './BasicInfoInput';
import {
  CREATE_NEW_CHAPTER_STORY,
  CREATE_STORY,
  generateApi,
  GET_ALL_GENRES,
  UPDATE_STORY_GENRE,
} from '@/constants/api';
import axios from 'axios';
import Cookies from 'js-cookie';

import { useToast } from '@/hooks/use-toast';

type Genre = {
  genreId: number;
  genreName: string;
};

const PostInput = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    storyTitle: '',
    chapterName: '',
    chapterContent: '',
  });
  const closeRef = useRef<HTMLButtonElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [textVal, setTextVal] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [basicStep, setBasicStep] = useState<boolean>(true);
  const [genreStep, setGenreStep] = useState<boolean>(false);

  const [genreList, setGenreList] = useState<Genre[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadGenreError, setLoadGenreError] = useState(null);

  const getAllGenre = async () => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

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
  };

  const handlePostStory = async () => {
    const formFile = new FormData();
    formFile.append('file', uploadFile as File);
    const token = Cookies.get('token');

    const uploadFileResult = await axios
      .post('/api/upload', formFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log('Error', error);
      });

    const createStoryRequest = {
      storyTitle: formData.storyTitle,
      releaseDate: new Date(),
      coverImageUri: uploadFileResult?.data.path,
      releaseStatus: true,
    };

    const createStoryResult = await axios
      .post(generateApi(CREATE_STORY), createStoryRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log('Error', error);
      });

    if (!createStoryResult) {
      return;
    }

    const storyId = createStoryResult.data.result.storyId;

    const updateStoryGenreRequest = {
      genreList: selectedGenres,
    };

    await axios
      .put(
        generateApi(UPDATE_STORY_GENRE, storyId.toString()),
        updateStoryGenreRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => {
        console.log('Error', error);
      });

    const createNewChapterRequest = {
      chapterTitle: formData.chapterName,
      chapterContent: formData.chapterContent,
      isPublished: true,
    };

    await axios
      .post(
        generateApi(CREATE_NEW_CHAPTER_STORY, storyId.toString()),
        createNewChapterRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => {
        console.log('Error', error);
      });

    toast({
      duration: 2000,
      title: 'Post new story successfully',
    });

    setBasicStep(true);
    setGenreStep(false);
    setSelectedGenres([]);
    setFormData({
      storyTitle: '',
      chapterName: '',
      chapterContent: '',
    });
    setTextVal('');
    setPreviewImage(null);
    setErrorMessage('');
    setGenreList(null);
    setLoading(true);
    setLoadGenreError(null);
    setTimeout(() => {
      getAllGenre();
    }, 2000);

    closeRef.current?.click();
  };

  useEffect(() => {
    getAllGenre();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="w-full bg-card flex justify-between px-5 py-2 rounded-md items-center hover: cursor-text"
          onClick={() => setErrorMessage('')}
        >
          <div className="flex space-x-3 items-center">
            <span className="text-muted-foreground  text-sm">
              Tell your story... Khang
            </span>
          </div>
          <span className="bg-background px-3 py-1 rounded-md active:scale-95 text-xs sm:text-sm">
            Quick Post
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-card px-0 pt-3 rounded-md">
        <div className="border-b border-background px-4 py-2">
          <DialogTitle className="text-center text-lg font-bold">
            Post a Story
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground">
            This is a quick post feature, your story will be public immediately
          </DialogDescription>
        </div>
        {genreStep && (
          <GenreMultiSelect
            setBasicStep={setBasicStep}
            setGenreStep={setGenreStep}
            setSelectedGenres={setSelectedGenres}
            handlePostStory={handlePostStory}
            selectedGenres={selectedGenres}
            genreList={genreList}
            loading={loading}
            loadGenreError={loadGenreError}
          />
        )}

        {basicStep && (
          <BasicInfoInput
            setPreviewImage={setPreviewImage}
            setErrorMessage={setErrorMessage}
            setFormData={setFormData}
            setBasicStep={setBasicStep}
            setGenreStep={setGenreStep}
            setTextVal={setTextVal}
            setUploadFile={setUploadFile}
            formData={formData}
            errorMessage={errorMessage}
            previewImage={previewImage}
            textVal={textVal}
          />
        )}

        <DialogClose asChild>
          <button ref={closeRef} className="hidden" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default PostInput;
