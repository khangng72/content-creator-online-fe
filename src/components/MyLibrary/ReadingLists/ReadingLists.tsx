'use client';
import React from 'react';
import LibraryOptions from '../LibraryOptions';
import Image from 'next/image';
import { Ellipsis, PlusIcon } from 'lucide-react';

const ReadingLists = () => {
  return (
    <>
      <LibraryOptions currentTab="reading_lists" />

      <div className="w-[95vw] md:w-[80vw] flex flex-col items-start mx-auto mt-5">
        <button className="bg-rainbow px-3 py-2 text-sm flex gap-2 rounded-md mb-5 active:scale-95 transition-all duration-200">
          <span>New Reading List</span>
          <PlusIcon className="w-5 h-5" />
        </button>
        <ul className="flex flex-col gap-5 w-full">
          <li className="flex items-center justify-between bg-card p-5 rounded-md shadow-md">
            <div className="flex items-start gap-3">
              <div>
                <Image
                  src="/BookCover/sample_cover.jpeg"
                  alt="Reading List"
                  width={100}
                  height={100}
                  className="w-[50px] h-[70px] md:w-[125px] md:h-[175px] rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <h1 className="text-sm md:text-2xl font-bold max-w-[200px] md:max-w-[400px]">
                  Reading List Title Reading List Title
                </h1>
                <p className="text-sm md:text-md text-muted-foreground mt-2">
                  5 stories
                </p>
              </div>
            </div>
            <div>
              <button
                className="px-3 py-1 bg-background hover:opacity-80 rounded-md active:scale-95 transition-all duration-200"
                type="button"
              >
                <Ellipsis className="w-5 h-5" />
              </button>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ReadingLists;
