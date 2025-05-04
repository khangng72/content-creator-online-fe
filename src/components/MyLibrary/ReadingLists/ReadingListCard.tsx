import { ReadList } from '@/types/ReadList';
import React from 'react';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Ellipsis } from 'lucide-react';

interface ReadingListCardProps {
  readList: ReadList;
}
const ReadingListCard = ({ readList }: ReadingListCardProps) => {
  return (
    <li
      className="flex flex-col bg-card p-3 md:p-5 rounded-md shadow-md"
      key={readList.read_list_id}
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-lg md:text-xl font-bold flex gap-1 max-w-[300px]  md:max-w-[500px] hover:underline">
          <span>{readList.read_list_title}</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          100 stories
        </p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          <div className="flex flex-col justify-center item-center">
            <Image
              src="/BookCover/sample_cover.jpeg"
              alt="cover"
              width={100}
              height={100}
              className="rounded-md w-[60px] h-[84px] md:w-[150px] md:h-[210px] object-cover"
            />
          </div>

          <div className="flex flex-col justify-center item-center">
            <Image
              src="/BookCover/sample_cover.jpeg"
              alt="cover"
              width={100}
              height={100}
              className="rounded-md w-[60px] h-[84px] md:w-[150px] md:h-[210px] object-cover"
            />
          </div>

          <div className="flex flex-col justify-center item-center">
            <Image
              src="/BookCover/sample_cover.jpeg"
              alt="cover"
              width={100}
              height={100}
              className="rounded-md w-[60px] h-[84px] md:w-[150px] md:h-[210px] object-cover"
            />
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="px-3 py-1 rounded-md bg-background hover:bg-accent hover:cursor-pointer">
              <Ellipsis className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-card max-w-[200px]">
            <div className="w-[200px]">
              <ul className="flex flex-col text-xs sm:text-sm gap-4">
                <li className="flex gap-2 items-center hover:underline hover:cursor-pointer">
                  <span>Edit</span>
                </li>
                <li className="flex gap-2 items-center hover:underline hover:cursor-pointer">
                  <span>Delete</span>
                </li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </li>
  );
};

export default ReadingListCard;
