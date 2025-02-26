import React from "react";
import { Eye } from "lucide-react";
import { Star } from "lucide-react";
import { TableOfContents } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { get_books } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const CardList = () => {
  const get_all_books = () => {
    return get_books();
  };

  const books_list = get_all_books();
  return (
    <div
      className="grid gap-5 justify-center mt-6 
                grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 px-[20px] xl:px-[50px] 2xl:px-[100px]"
    >
      {books_list.map((book) => (
        <Dialog key={book.id}>
          <DialogContent>
            <div className="flex items-center gap-4">
              <img
                src={book.cover}
                alt="book cover"
                className="w-[120px] sm:w-[200px]"
              />

              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl">{book.title}</DialogTitle>
                <div>
                  <Link href="/pages/main/creator/123">by {book.Author}</Link>
                  <div className="flex gap-3 pb-2">
                    <div className="flex gap-1">
                      <Eye className="w-5 h-5" />
                      <span>{book.view_rate}</span>
                    </div>
                    <div className="flex gap-1">
                      <Star className="w-5 h-5" />
                      <span>{book.star_rate}</span>
                    </div>
                    <div className="flex gap-1">
                      <TableOfContents className="w-5 h-5" />
                      <span>{book.number_of_chapters}</span>
                    </div>
                  </div>
                  <DialogDescription>
                    <span>{book.description}</span>
                  </DialogDescription>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                    {book.genre.map((gen) => (
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

          <DialogTrigger className="text-left">
            <Card className="flex pl-3 h-[320px] items-center">
              <div className="w-[400px] h-[300px] flex justify-center items-center">
                <img
                  src={book.cover}
                  alt="book cover"
                  className="w-[400px] h-[200px]"
                />
              </div>
              <div className="flex flex-col gap-0">
                <CardHeader className="mb-0 pb-2">
                  <CardTitle className="text-xl md:text-2xl">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="hover:underline">
                    <Link href="/pages/main/creator/123">by {book.Author}</Link>
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-0 text-sm">
                  <div className="flex gap-3 pb-2">
                    <div className="flex gap-1">
                      <Eye className="w-5 h-5" />
                      <span>{book.view_rate}</span>
                    </div>
                    <div className="flex gap-1">
                      <Star className="w-5 h-5" />
                      <span>{book.star_rate}</span>
                    </div>
                    <div className="flex gap-1">
                      <TableOfContents className="w-5 h-5" />
                      <span>{book.number_of_chapters}</span>
                    </div>
                  </div>
                  <p>{book.description}</p>
                </CardContent>
                <CardFooter className="pl-2 flex justify-start gap-1 mt-3">
                  <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                    Horror
                  </span>
                  <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                    Family
                  </span>
                  <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2 m-auto">
                    Adventure
                  </span>
                </CardFooter>
              </div>
            </Card>
          </DialogTrigger>
        </Dialog>
      ))}
    </div>
  );
};

export default CardList;
