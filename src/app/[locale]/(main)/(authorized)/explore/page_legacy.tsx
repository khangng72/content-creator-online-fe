import React from 'react'
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"


import { BookCarousel } from '@/components/Explore/BookCarousel';
import CardList from '@/components/Explore/CardList';

const genre = "Horror";


const page = () => {



    return (
        <div className=' w-full py-[70px] block'>
            {/* Intro text */}
            <div className='text-center mt-3'>
                <span className='font-bold bg-rainbow text-transparent bg-clip-text text-2xl'>Top {genre} Stories</span>
            </div>
            {/* Carousel */}
            <BookCarousel />

            {/* Search bar */}
            <div className="mx-auto max-w-[450px] md:max-w-[700px] flex flex-col md:flex-row py-auto gap-3 px-3 justify-center">
                <div className='flex gap-3'>
                    <Search className='my-auto' />
                    <Input className="border-foreground md:min-w-[300px]" type="text" placeholder="Hmmm...What to read" />
                </div>
                <div className='flex gap-3 justify-center'>
                    <div className='min-w-[150px]'>
                        <Select>
                            <SelectTrigger >
                                <SelectValue placeholder="Search by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Search by</SelectLabel>
                                    <SelectItem value="Genre">Genre</SelectItem>
                                    <SelectItem value="Author">Author</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className='font-bold bg-rainbow text-foreground hover:scale-110 duration-300'>Search</Button>
                </div>
            </div>

            {/* Filter */}
            <div className='flex justify-center items-center mt-3 gap-3 mx-auto max-w-[450px] md:max-w-[700px] px-3'>
                <Select>
                    <SelectTrigger >
                        <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Genre</SelectLabel>
                            <SelectItem value="Horror">Horror</SelectItem>
                            <SelectItem value="Funny">Funny</SelectItem>
                            <SelectItem value="Comic">Comic</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger >
                        <SelectValue placeholder="Sort by stars" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort by stars</SelectLabel>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" className='rounded-full' />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Premium
                    </label>
                </div>
            </div>

            {/* Card list */}
            <CardList />

        </div>
    )
}

export default page