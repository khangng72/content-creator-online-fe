"use client";
import { get_book } from "@/app/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CirclePlus,
  Ellipsis,
  Eye,
  Facebook,
  Instagram,
  Send,
  Star,
  TableOfContents,
} from "lucide-react";
import React from "react";
const page = () => {
  const book = get_book().book;
  return (
    <div className="flex flex-col mt-[100px] mb-[80px] items-center gap-5">
      <div className="flex flex-col items-center gap-5">
        <h1 className="font-bold text-3xl bg-rainbow text-transparent bg-clip-text">
          {book.title}
        </h1>
        <h1 className="font-bold text-2xl">{book.content[0].chapter_title}</h1>
        <ul className="flex text-xl justify-around min-w-[250px]">
          <li className="flex gap-1 items-center j">
            <Eye className="w-5 h-5" />
            <span>{book.rating}</span>
          </li>
          <li className="flex gap-1 items-center">
            <Star className="w-5 h-5" />
            <span>{book.rating}</span>
          </li>
          <li className="flex gap-1 items-center">
            <TableOfContents className="w-5 h-5" />
            <span>{book.content.length}</span>
          </li>
        </ul>

        <div className="flex flex-col p-5 bg-card max-w-[350px] sm:max-w-[400px] md:max-w-[700px] lg:max-w-[1000px] rounded-xl ">
          <span className="text-xl text-justify leading-relaxed">
            {book.content[0].chapter_content}
          </span>
          <br />
          <span className="text-xl text-justify leading-relaxed">
            {book.content[1].chapter_content}
          </span>
        </div>

        <div className="w-full max-w-[300px] sm:max-w-[500px] md:max-w-[700px] flex flex-col items-center gap-5">
          <Button className="w-full">Continue</Button>
          <div className="flex justify-between w-full">
            <div className="w-1/2 flex flex-start gap-4">
              <div className="flex items-center gap-1">
                <span>Add</span>
                <CirclePlus />
              </div>
              <Star />
            </div>
            <div className="w-1/2 flex flex-row-reverse gap-2">
              <Facebook />
              <Instagram />
            </div>
          </div>
          <div className="flex w-full gap-2 items-center">
            <Input className="rounded-full" placeholder="Comment..." />
            <Button className="bg-purple-400 rounded-full flex justify-center items-center h-[40px] w-[40px]">
              <Send />
            </Button>
          </div>

          <div className="flex flex-col w-full gap-5 items-center text-[10px] md:text-sm">
            {/* comment without reply */}
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="rounded-t-xl rounded-br-xl bg-card p-3">
                    <span className="text-sm">
                      The Story is great, plot is astonishing
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <span>13 hours ago</span>
                  <span className="font-bold text-purple-500">Reply</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Ellipsis />
                <Star />
              </div>
            </div>

            {/* Comment with reply */}
            <div className="flex flex-col w-full">
              {/* parent comment */}
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="rounded-t-xl rounded-br-xl bg-card p-3">
                      <span className="text-sm">
                        The Story is great, plot is astonishing
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span>13 hours ago</span>
                    <span className="font-bold text-purple-500">Reply</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Ellipsis />
                  <Star />
                </div>
              </div>

              {/* reply list */}
              <div className="ml-2 md:ml-10 mt-5 flex flex-col gap-5">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src="https://avatars.githubusercontent.com/u/40488299?v=4"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="rounded-t-xl rounded-br-xl bg-card p-3">
                        <span className="text-sm">
                          The Story is great, plot is astonishing. Enough for
                          chilling at night
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span>13 hours ago</span>
                      <span className="font-bold text-purple-500">Reply</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Ellipsis />
                    <Star />
                  </div>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src="https://avatars.githubusercontent.com/u/40488299?v=4"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="rounded-t-xl rounded-br-xl bg-card p-3">
                        <span className="text-sm">
                          The Story is great, plot is astonishing
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span>13 hours ago</span>
                      <span className="font-bold text-purple-500">Reply</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Ellipsis />
                    <Star />
                  </div>
                </div>

                <div className="flex w-full gap-2 items-center">
                  <Input className="rounded-full" placeholder="Comment..." />
                  <Button className="bg-purple-400 rounded-full flex justify-center items-center h-[40px] w-[40px]">
                    <Send />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
