import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import Image from 'next/image';
import coffee from '$/public/coffee.png';
import { Button } from '../ui/button';
const SupporterList = () => {
  return (
    <div>
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

      {/* More donation info */}
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
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SupporterList;
