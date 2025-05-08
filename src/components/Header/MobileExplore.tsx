import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { KeyboardEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Genre } from '@/types/Genre';
import { Link } from '@/i18n/routing';

interface MobileExploreProps {
  textSearch: string;
  genreList: Genre[];
  setTextSearch: (text: string) => void;
  handleEnterSearch: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const MobileExplore = ({
  textSearch,
  genreList,
  setTextSearch,
  handleEnterSearch,
}: MobileExploreProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  const toggleDialog = () => {
    setDialogOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOnClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !event.composedPath().includes(dialogRef.current)
      ) {
        setDialogOpen(false);
      }
    };

    document.body.addEventListener('click', handleOnClickOutside);
    return () => {
      document.body.removeEventListener('click', handleOnClickOutside);
    };
  }, []);

  return (
    <div ref={dialogRef} className="items-center flex">
      <button
        className="relative hover:opacity-80 hover:cursor-pointer"
        onClick={toggleDialog}
      >
        <Search className="w-5 h-5 lg:hidden" />
      </button>
      {dialogOpen && (
        <div className="absolute top-14 md:right-3 md:translate-x-0 md:left-auto left-1/2 -translate-x-1/2 bg-card w-[95%] md:w-80 rounded-md flex flex-col p-3 gap-2 shadow-md border-[0.5px] border-accent">
          <div className="w-full">
            <input
              type="text"
              placeholder="Search stories..."
              className="w-full px-3 py-2 rounded-md bg-background text-sm focus:outline-none"
              value={textSearch}
              onChange={(e) => {
                setTextSearch(e.target.value);
              }}
              onKeyDown={handleEnterSearch}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full px-3 py-2 rounded-md bg-accent text-sm hover:opacity-80">
                Explore by genre
              </button>
            </DialogTrigger>
            <DialogContent className="rounded-md">
              <DialogHeader>
                <DialogTitle>Explore by Genre</DialogTitle>
                <DialogDescription className="hidden">Genres</DialogDescription>
              </DialogHeader>
              {genreList && (
                <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[50vh] overflow-auto pb-2 scroll-container">
                  {genreList.map((genre) => {
                    return (
                      <Link
                        className="rounded-md px-2 py-2 hover:cursor-pointer bg-card active:scale-95"
                        key={genre.genreId}
                        href={`/explore/genre/${genre.genreId}`}
                      >
                        <span className="text-xs sm:text-sm font-semibold">
                          {genre.genreName}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default MobileExplore;
