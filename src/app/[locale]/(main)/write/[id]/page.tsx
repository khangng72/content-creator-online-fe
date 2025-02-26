"use client";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Images } from "lucide-react";
import { get_chapters } from "@/app/api/api";
import TextareaAutosize from "react-textarea-autosize";

const Page = () => {
  const chapters = get_chapters();
  const [textareas, setTextareas] = useState([1]);

  const addTextarea = () => {
    setTextareas([...textareas, textareas.length + 1]);
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="fixed top-[80px]  bg-card flex flex-col items-center py-3 px-10 rounded-xl">
        <h1 className="font-bold text-large">All Chapters</h1>
        <h1>Work Title</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col items-center gap-3 pb-3">
            <ScrollArea className="h-72 min-w-[200px] md:min-w-[300px] max-w-[300px] md:max-w-[400px]rounded-md border bg-card m-0">
              <div className="flex flex-col">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="border-b-1 pt-4 pb-2 hover:opacity-10 hover:cursor-pointer"
                  >
                    <div className="px-3 text-sm">
                      <span className="font-bold">{chapter.chapter_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Button>New Chapter</Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-[220px] mb-[50px] bg-card flex flex-col items-center p-5 md:min-w-[600px] lg:min-w-[800px] xl:min-w-[1000px] rounded-xl gap-3">
        <input
          type="text"
          placeholder="Enter Chapter title"
          className="text-2xl py-2 px-5 rounded-md w-full"
        />
        <div className="flex flex-col items-center w-full">
          {textareas.map((id) => (
            <div className="flex flex-col items-center w-full" key={id}>
              <TextareaAutosize
                className="w-full p-2 text-lg border rounded min-h-[200px] mb-4"
                placeholder="Enter your content"
              />
              <Images className="mb-2" />
            </div>
          ))}
        </div>

        <Button onClick={addTextarea} className="w-[150px]">
          New Paragraph
        </Button>
        <Button className="w-[150px] bg-rainbow text-foreground">Save</Button>
      </div>
    </div>
  );
};

export default Page;
