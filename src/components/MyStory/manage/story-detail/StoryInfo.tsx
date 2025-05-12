import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import GenreSelect from '../../new/GenreSelect';
import { Genre } from '@/types/Genre';
import axios from 'axios';
import { generateApi, GET_ALL_GENRES, UPDATE_STORY } from '@/constants/api';
import Cookies from 'js-cookie';
import { BasicStoryInfo } from '@/types/Story';
import { toast } from '@/hooks/use-toast';

interface StoryInfoProps {
  story: BasicStoryInfo;
  fetchStoryInfo: () => Promise<void>;
}

const StoryInfo = ({ story, fetchStoryInfo }: StoryInfoProps) => {
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [genreList, setGenreList] = useState<Genre[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadGenreError, setLoadGenreError] = useState(null);

  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescription, setStoryDescription] = useState('');

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

  const handleUpdateStory = async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.put(
        generateApi(UPDATE_STORY, story.storyId),
        {
          storyTitle,
          storyDescription,
          genres: selectedGenres,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        console.log('Story updated successfully:', response.data);
        toast({
          title: 'Success',
          description: 'Story updated successfully',
          variant: 'default',
        });
        fetchStoryInfo();
      } else {
        console.error('Failed to update story:', response.data);
        toast({
          title: 'Error',
          description: 'Failed to update story',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating story:', error);
      toast({
        title: 'Error',
        description: 'Error updating story',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    getAllGenre();
  }, []);

  useEffect(() => {
    if (story) {
      setSelectedGenres(story.genres);
      setStoryTitle(story.storyTitle);
      setStoryDescription(story.storyDescription);
    }
  }, [story]);

  return (
    <div className="px-5 py-3 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-lg font-bold text-muted-foreground">
          Story Title
        </label>
        <input
          type="text"
          className="border border-accent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purpleRainbow"
          placeholder="Enter story title"
          value={storyTitle}
          onChange={(e) => setStoryTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-lg font-bold text-muted-foreground">
          Story Description
        </label>
        <textarea
          rows={7}
          className="border border-accent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purpleRainbow resize-none"
          placeholder="Enter story title"
          value={storyDescription}
          onChange={(e) => setStoryDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-lg font-bold text-muted-foreground">
          Genres
        </label>
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-foreground text-background rounded-md w-[150px] py-1 active:scale-95 mb-2">
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
      </div>

      <div className="w-full flex justify-end">
        <button
          className="w-[100px] py-2 text-sm rounded-md bg-rainbow active:scale-95"
          onClick={handleUpdateStory}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default StoryInfo;
