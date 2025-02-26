import React from "react";
import sample_image from "$/public/sample-7.jpg";
import coffee from "$/public/coffee.png";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { get_books } from "@/app/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const About = () => {
  const books = get_books().slice(0, 7);
  return (
    <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start items-center gap-5 mt-3 mx-6">
      <div className="bg-card rounded-xl p-6 max-w-[600px] gap-3 flex flex-col text-small flex-1">
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
        <div className="mb-2">
          <h1 className="font-bold text-2xl">Recent Supporters</h1>
          <ul className="flex flex-col gap-5 mt-4">
            <li className="flex gap-3 items-center">
              <Image src={coffee} alt="coffee" className="max-w-[40px]" />
              <p>JohnDoe bought a coffee</p>
            </li>
            <li className="flex gap-3 items-center">
              <Image src={coffee} alt="coffee" className="max-w-[40px]" />
              <p>JohnDoe bought a coffee</p>
            </li>
            <li className="flex gap-3 items-center">
              <Image src={coffee} alt="coffee" className="max-w-[40px]" />
              <p>JohnDoe bought a coffee</p>
            </li>
            <li className="flex gap-3 items-center">
              <Image src={coffee} alt="coffee" className="max-w-[40px]" />
              <p>JohnDoe bought a coffee</p>
            </li>
            <li className="flex gap-3 items-center">
              <Image src={coffee} alt="coffee" className="max-w-[40px]" />
              <p>JohnDoe bought a coffee</p>
            </li>
          </ul>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full rounded-full bg-foreground text-background"
              >
                More
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[300px] sm:max-w-[425px] flex flex-col justify-center items-center">
              <DialogHeader className="flex flex-col items-center">
                <DialogTitle>Supporters</DialogTitle>
                <DialogDescription className="flex flex-col items-center justify-center gap-3">
                  <span>Top Supporters</span>
                  <div className="grid grid-cols-3 gap-x-7">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-500  text-white font-bold rounded-full">
                        2
                      </div>
                      <p>Adamkhoo</p>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                      <div className="flex items-center justify-center w-[50px] h-[50px] bg-amber-500 text-white font-bold rounded-full">
                        1
                      </div>
                      <p>Gump</p>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-2">
                      <div className="flex items-center justify-center w-10 h-10 bg-amber-700 text-white font-bold rounded-full">
                        3
                      </div>
                      <p>Martin</p>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-72 rounded-md border w-full">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    Recent Supporters
                  </h4>
                  <ul className="flex flex-col gap-5 mt-4">
                    <li className="flex gap-3 items-center">
                      <Image
                        src={coffee}
                        alt="coffee"
                        className="max-w-[40px]"
                      />
                      <p>JohnDoe bought a coffee</p>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Image
                        src={coffee}
                        alt="coffee"
                        className="max-w-[40px]"
                      />
                      <p>JohnDoe bought a coffee</p>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Image
                        src={coffee}
                        alt="coffee"
                        className="max-w-[40px]"
                      />
                      <p>JohnDoe bought a coffee</p>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Image
                        src={coffee}
                        alt="coffee"
                        className="max-w-[40px]"
                      />
                      <p>JohnDoe bought a coffee</p>
                    </li>
                    <li className="flex gap-3 items-center">
                      <Image
                        src={coffee}
                        alt="coffee"
                        className="max-w-[40px]"
                      />
                      <p>JohnDoe bought a coffee</p>
                    </li>
                  </ul>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-5 max-w-[500px] ">
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
              align: "start",
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
                        <img
                          className="rounded-lg mb-2 w-[150px] h-[200px]"
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
        </div>
      </div>
    </div>
  );
};

export default About;
