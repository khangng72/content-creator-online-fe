"use client";
import { get_books } from "@/app/api/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export const BookCarousel = () => {
  const get_top_books = () => {
    const book_arr = get_books();
    return book_arr.slice(0, 14);
  };

  const top_books = get_top_books();

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-[300px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] mx-auto mb-[20px] overflow-visible relative"
    >
      <CarouselContent>
        {top_books.map((book) => (
          <CarouselItem
            key={book.id}
            className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 overflow-visible"
          >
            <a
              href="https://tailwindcss.com/docs/responsive-design"
              className="p-1"
            >
              <Card className="hover:scale-110 duration-300">
                <CardContent className="items-center p-3 flex flex-col justify-center">
                  <img
                    className="rounded-lg mb-2 h-[150px]"
                    src={book.cover}
                    alt="book cover"
                  />
                  <span className="text-sm bg-secondary-foreground rounded-sm text-background px-2">
                    {book.genre[0]}
                  </span>
                </CardContent>
              </Card>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute -left-1 sm:-left-4 md:-left-10" />
      <CarouselNext className="absolute -right-1 sm:-right-4 md:-right-10" />
    </Carousel>
  );
};
