import React from 'react';
import sample_image from '$/public/sample-7.jpg';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { get_books } from '@/app/api/api';

const About = () => {
  const books = get_books().slice(0, 7);
  return (
    <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start items-center gap-5 mt-3 mx-6">
      <div className="bg-card rounded-xl p-6 max-w-[600px] gap-3 flex flex-col text-small flex-1">
        {/* Introduction of the author */}
        <div className="flex flex-col gap-3 text-justify">
          <h1 className="font-bold text-2xl">About the Constantine</h1>
          <p className="border-t pt-2 border-white">
            I am the author of the year. I write supernatural story. Sometimes
            good, sometimes bad, It is great to have you.
          </p>
          <Image src={sample_image} alt="s" className="rounded-xl" />
          <p className="border-b pb-4 border-white">
            Beneath the swirling galaxies and shadowy hues of the cosmos,
            Constantine weaves tales that pulse with mystery, depth, and
            boundless imagination. With a style as enigmatic as the stars
            themselves, Constantine invites readers into worlds where reality
            blurs, emotions soar, and every turn of the page reveals a universe
            waiting to be discovered.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 max-w-[500px]">
        <div className="text-center bg-card rounded-xl p-6">
          <h2 className="font-bold text-xl">Donate for The author</h2>
          <div className="mt-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">☕</span>
              <span>x</span>
              <button className="bg-black text-white rounded-full px-3 py-1">
                1
              </button>
              <button className="bg-black text-white rounded-full px-3 py-1">
                3
              </button>
              <button className="bg-black text-white rounded-full px-3 py-1">
                5
              </button>
            </div>
          </div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Name or @yoursocial"
              className="border rounded p-2 w-full"
            />
            <textarea
              placeholder="Say something nice..."
              className="border rounded p-2 w-full mt-2"
            ></textarea>
          </div>
          <button className="bg-rainbow text-white rounded-full px-6 py-3 mt-4">
            Support $3
          </button>
        </div>

        <div className="text-center bg-card rounded-xl p-6 flex flex-col items-center">
          <h2 className="font-bold text-xl">Feature</h2>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full max-w-[250px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] mx-auto mb-[20px] overflow-visible relative"
          >
            <CarouselContent>
              {books.map((book) => (
                <CarouselItem
                  key={book.id}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <a
                    href="https://tailwindcss.com/docs/responsive-design"
                    className="p-1"
                  >
                    <Card className="hover:scale-110 duration-300">
                      <CardContent className="items-center p-3 flex flex-col justify-center">
                        <Image
                          className="rounded-lg mb-2 w-[150px] h-[200px]"
                          src={book.cover}
                          alt="book cover"
                          width={150}
                          height={200}
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
        </div>
      </div>
    </div>
  );
};

export default About;
