'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import CardList from '@/components/Explore/genre/CardList';
import axios from 'axios';
import { generateApi, GET_GENRE_BY_ID } from '@/constants/api';

interface ExploreByGenreProps {
  genre_id: string;
}

interface Genre {
  genreId: string;
  genreName: string;
}

const ExploreByGenre = ({ genre_id }: ExploreByGenreProps) => {
  const [genre, setGenre] = useState<Genre | null>(null);
  const [loadGenre, setLoadGenre] = useState(true);
  const [loadGenreError, setLoadGenreError] = useState(false);

  const fetchGenre = useCallback(async () => {
    try {
      const response = await axios.get(generateApi(GET_GENRE_BY_ID, genre_id));
      if (response.data) {
        setGenre(response.data);
        setLoadGenre(false);
        return;
      }

      setLoadGenreError(true);
      setLoadGenre(false);
    } catch (error) {
      setLoadGenreError(true);
      setLoadGenre(false);
      console.error('Error fetching genre:', error);
    }
  }, [genre_id]);

  useEffect(() => {
    fetchGenre();
  }, [fetchGenre]);

  if (loadGenreError) {
    <div>Error Getting Genre with id {genre_id}</div>;
  }

  if (loadGenre) {
    return (
      <div className="w-full py-[70px] flex justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className=" w-full py-[70px] block">
      {/* Intro text */}
      <div className="text-center mt-3 mb-4">
        <h1 className="font-bold bg-rainbow text-transparent bg-clip-text text-3xl">
          Top {genre?.genreName} Stories
        </h1>
      </div>
      {/* Carousel */}
      {/* <BookCarousel /> */}

      {/* Search bar */}

      <div className="flex gap-3 mx-auto w-[90vw] md:w-[70vw]">
        <Search className="my-auto" />
        <input
          className="border-foreground focus:border-muted-foreground w-full py-2 px-3 rounded-md"
          type="text"
          placeholder="Find your favorite stories"
        />
      </div>

      {/* Card list */}
      <CardList />
    </div>
  );
};

export default ExploreByGenre;
