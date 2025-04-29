import React, { useState } from 'react';
import { get_books } from '@/app/api/api';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { EyeIcon, PlusIcon, StarIcon, TableOfContents } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const readingLists = [
  { id: 1, title: 'Read list title 1' },
  { id: 2, title: 'Read list title 2' },
  { id: 3, title: 'Read list title 3' },
];

const CardList = () => {
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const get_all_books = () => {
    return get_books();
  };

  const book_list = get_all_books();
  return (
    <div
      className="grid gap-5 justify-center mt-6 
                grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-[90vw] xl:w-[80vw] mx-auto"
    >
      {book_list.map((book) => {
        return (
          <div
            key={book.id}
            className="flex flex-col justify-center items-center bg-card rounded-md p-4 relative"
          >
            <Image
              src={book.cover}
              alt={book.title}
              width={200}
              height={300}
              className="rounded-lg mb-4 w-[150px] h-[210px]"
            />

            <Link href="#">
              <h2 className="text-xl font-semibold hover:underline">
                {book.title}
              </h2>
            </Link>
            <Link href="#" className="text-muted-foreground hover:underline">
              by {book.Author}
            </Link>
            <div className="flex gap-2 justify-center items-center">
              <div className="flex gap-1 items-center">
                <EyeIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">4</span>
              </div>
              <div className="flex gap-1 items-center">
                <TableOfContents className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">5</span>
              </div>
            </div>
            <div className="flex gap-2 items-center mt-2">
              <StarIcon className="w-4 h-4" />
              <StarIcon className="w-4 h-4" />
              <StarIcon className="w-4 h-4" />
              <StarIcon className="w-4 h-4" />
              <StarIcon className="w-4 h-4" />
            </div>
            <div className="mt-3 w-[90%] text-justify text-muted-foreground bg-secondary px-4 py-2 text-sm rounded-tl-3xl rounded-br-3xl h-[95px]">
              <p>{book.description.slice(0, 255)}...</p>
            </div>
            <button className="mt-4 px-3 py-1 bg-rainbow hover:opacity-80 rounded-md text-sm">
              Read Now
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="absolute -top-3 -right-2 bg-secondary hover:bg-muted-foreground rounded-full p-1 border-[1px] border-foreground">
                  <PlusIcon />
                </button>
              </DialogTrigger>
              <DialogContent>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">
                    Add to your Read lists
                  </h3>

                  <div className="flex flex-col gap-2 border-b-[0.5px] border-muted-foreground pb-4">
                    {readingLists.map((readingList) => {
                      return (
                        <div
                          className="flex justify-between items-center gap-2 py-2 hover:cursor-pointer hover:bg-secondary px-3 rounded-md"
                          key={readingList.id}
                          onClick={() => setSelectedListId(readingList.id)}
                        >
                          <span>{readingList.title}</span>
                          <input
                            type="radio"
                            className="w-5 h-5"
                            checked={selectedListId === readingList.id}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      })}
    </div>
  );
};

export default CardList;
