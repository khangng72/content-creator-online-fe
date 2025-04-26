import { ChevronRight, Dot, Eye, Star, TableOfContents } from "lucide-react";
import React from "react";

import { get_author_works } from "@/app/api/api";
const ReadLists = () => {
  const books = get_author_works().slice(0, 5);
  return (
    <div className="flex flex-col justify-center items-center gap-5 p-5">
      <h1 className="text-xl font-bold border-b-3 border-foreground">
        Read Lists
      </h1>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 p-5 bg-card rounded-xl">
          <div className="flex items-center hover:underline hover:cursor-pointer">
            <h1 className="font-bold text-xl ">My Favorite Books</h1>
            <ChevronRight />
          </div>
          <div className="flex text-sm items-center">
            <span>Reading List</span>
            <Dot />
            <span>12 Stories</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-3">
            {books.map((item) => (
              <div
                className="flex flex-col items-center w-[200px] bg-gray-500 py-2 px-2"
                key={item.title}
              >
                <img src={item.cover} className="w-[130px] h-[200px]" />
                <h2 className="line-clamp-2 leading-[1.5] h-[calc(1.5rem*2)] overflow-hidden text-center">
                  {item.title}
                </h2>
                <ul className="flex gap-3">
                  <li className="flex gap-1 items-center text-sm">
                    <Eye className="w-3 h-3" />
                    <span>{item.readers}</span>
                  </li>
                  <li className="flex gap-1 items-center text-sm">
                    <Star className="w-3 h-3" />
                    <span>{item.stars}</span>
                  </li>
                  <li className="flex gap-1 items-center text-sm">
                    <TableOfContents className="w-3 h-3" />
                    <span>{item.chapters}</span>
                  </li>
                </ul>

                <div className="flex justify-start gap-1 mt-1">
                  <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                    Horror
                  </span>
                  <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                    Family
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadLists;
