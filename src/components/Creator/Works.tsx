import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { get_author_works } from "@/app/api/api";
import { TableOfContents } from "lucide-react";
import { Eye } from "lucide-react";
import { Star } from "lucide-react";
import { Link } from "@/i18n/routing";

const Works = () => {
  const books_list = get_author_works();
  return (
    <div className="flex flex-col justify-center items-center gap-5 p-5">
      <h1 className="text-xl font-bold border-b-3 border-foreground">
        InkyPoe Works
      </h1>
      <div className="flex justify-center items-center gap-2 min-w-[300px] sm:min-w-[400px] md:min-w-[500px]">
        <Input type="text" placeholder="Search..." />
        <Button type="submit" className="hover:scale-105 duration-300">
          Search
        </Button>
      </div>

      <div
        className="grid gap-5 justify-center
                grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 px-[20px] xl:px-[50px] 2xl:px-[100px]"
      >
        {books_list.map((book) => (
          <Dialog key={book.title}>
            <DialogContent className="max-w-[500px]">
              <div className="flex items-center gap-4">
                <img
                  src={book.cover}
                  alt="book cover"
                  className="w-[100px] sm:w-[200px]"
                />

                <DialogHeader className="text-left">
                  <DialogTitle className="text-2xl">{book.title}</DialogTitle>
                  <div>
                    <Link href="/pages/main/creator/123">by Author</Link>
                    <div className="flex gap-3 pb-2">
                      <div className="flex gap-1">
                        <Eye className="w-5 h-5" />
                        <span>100</span>
                      </div>
                      <div className="flex gap-1">
                        <Star className="w-5 h-5" />
                        <span>100</span>
                      </div>
                      <div className="flex gap-1">
                        <TableOfContents className="w-5 h-5" />
                        <span>100</span>
                      </div>
                    </div>
                    <DialogDescription>
                      <span>{book.description}</span>
                    </DialogDescription>
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                      {book.genres.map((gen) => (
                        <li key={gen}>
                          <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                            {gen}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </DialogHeader>
              </div>

              <DialogFooter>
                <Button type="submit">Read Now</Button>
              </DialogFooter>
            </DialogContent>

            <DialogTrigger>
              <div className="flex flex-col items-center justify-center sm:flex-row gap-2 hover:scale-105 bg-card py-5 min-w-[250px] rounded-xl md:h-[300px]">
                <div className="w-full sm:w-[40%] flex justify-center">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-[130px] h-[200px] rounded-xl"
                  />
                </div>

                <div className="flex flex-col items-center sm:items-start w-full sm:w-[60%] sm:text-left sm:pr-4 gap-3">
                  <h1 className="font-xl font-bold">{book.title}</h1>
                  <ul className="flex gap-3">
                    <li className="flex gap-1">
                      <Eye className="w-5 h-5" />
                      <span>{book.readers}</span>
                    </li>
                    <li className="flex gap-1">
                      <Star className="w-5 h-5" />
                      <span>{book.stars}</span>
                    </li>
                    <li className="flex gap-1">
                      <TableOfContents className="w-5 h-5" />
                      <span>{book.chapters}</span>
                    </li>
                  </ul>
                  <p className="sm:text-justify">{book.description}</p>
                  <div className="flex justify-start gap-1">
                    <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                      Horror
                    </span>
                    <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                      Family
                    </span>
                    <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                      Adventure
                    </span>
                  </div>
                </div>
              </div>
            </DialogTrigger>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default Works;
