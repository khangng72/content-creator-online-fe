'use client';

import { useState, useEffect } from 'react';
import { Genre } from './genre';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import axios from 'axios';
import { generateApi, GET_ALL_GENRES } from '@/constants/api';

interface GenreSelectionPageProps {
  onComplete: (genres: number[]) => void;
  onBack: () => void;
  initialSelectedGenres: number[];
  onGenresChange: (genres: number[]) => void;
}

export default function GenreSelectionPage({
  onComplete,
  onBack,
  initialSelectedGenres,
  onGenresChange,
}: GenreSelectionPageProps) {
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    initialSelectedGenres
  );
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedGenres(initialSelectedGenres);
  }, [initialSelectedGenres]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await axios.get(generateApi(GET_ALL_GENRES));

      if (response.data.status === 200) {
        setGenres(response.data.result);
      } else {
        throw new Error('Failed to fetch genres');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch genres');
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genreId: number) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];

    setSelectedGenres(newSelectedGenres);
    onGenresChange(newSelectedGenres);
  };

  const handleSubmit = async () => {
    try {
      onComplete(selectedGenres);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save genre preferences'
      );
    }
  };

  const getRainbowStyle = (index: number) => {
    const hue = (index * 20) % 360;
    return {
      background: `linear-gradient(135deg, 
        hsl(${hue}, 70%, 60%) 0%,
        hsl(${(hue + 30) % 360}, 70%, 60%) 100%
      )`,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchGenres}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-h-[70vh] overflow-y-auto scroll-container">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Select Your Favorite Genres
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre, index) => {
          const isSelected = selectedGenres.includes(genre.genreId);
          return (
            <Card
              key={genre.genreId}
              style={getRainbowStyle(index)}
              onClick={() => toggleGenre(genre.genreId)}
              className={`
                group
                relative
                p-4 
                cursor-pointer 
                transition-all 
                duration-300
                border-2
                hover:shadow-xl
                overflow-hidden
                ${
                  isSelected
                    ? 'border-white scale-105 shadow-lg'
                    : 'border-transparent hover:border-white/30 hover:scale-102'
                }
            `}
            >
              <div
                className={`
                absolute 
                inset-0 
                transition-opacity 
                duration-300
                ${
                  isSelected
                    ? 'bg-black/20'
                    : 'bg-black/0 group-hover:bg-black/10'
                }
              `}
              />

              <div
                className={`
                absolute 
                top-2 
                right-2 
                bg-white 
                rounded-full 
                p-0.5
                transition-all 
                duration-300
                ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
              `}
              >
                <Check className="w-4 h-4 text-primary" />
              </div>

              <h3
                className={`
                font-semibold 
                text-center 
                text-white
                text-shadow
                transition-transform
                duration-300
                ${
                  isSelected
                    ? 'transform translate-y-0'
                    : 'group-hover:transform group-hover:-translate-y-1'
                }
              `}
              >
                {genre.genreName}
              </h3>

              <div
                className={`
                absolute 
                bottom-2 
                left-1/2 
                transform 
                -translate-x-1/2
                text-xs 
                text-white 
                font-medium
                transition-all
                duration-300
                ${
                  isSelected
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }
              `}
              >
                Selected
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''}{' '}
          selected
        </p>
        <div className="flex gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-8 py-2 min-w-[200px]"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            className={`
              px-8 
              py-2 
              min-w-[200px] 
              bg-gradient-to-r 
              from-purple-500 
              to-pink-500 
              hover:from-purple-600 
              hover:to-pink-600 
              text-white
              transition-all
              duration-300
              ${selectedGenres.length > 0 ? 'scale-105' : 'scale-100'}
            `}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
