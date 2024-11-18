'use client';
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, EffectCoverflow } from 'swiper/modules';
import sample_image from '$/public/BookCover/sample_cover.png';
import Image from 'next/image';
import './css/creation-section.css';

type BookSlideProps = {
    bookTitle: string;
};

export const BookSlide = ({ bookTitle }: BookSlideProps) => {
    return (
        <div className='flex justify-center gap-[20px] bg-card p-[20px] rounded-xl text-foreground'>
            <div className='flex justify-center items-center my-auto w-[200px] rounded-xl'>
                <Image src={sample_image} alt="Book Cover" className='rounded-xl' />
            </div>

            <div className="block m-auto space-y-2 w-1/2 md:w-3/4">
                <h1 className='font-bold text-xl md:text-2xl'>{bookTitle}</h1>
                <div className='md:flex gap-[5px] flex-wrap hidden'>
                    <span className='text-[15px] bg-foreground px-2 text-background rounded-[14px]'>Thriller</span>
                    <span className='text-[15px] bg-foreground px-2 text-background rounded-[14px]'>Mystery</span>
                    <span className='text-[15px] bg-foreground px-2 text-background rounded-[14px]'>Romance</span>
                    <span className='text-[15px] bg-foreground px-2 text-background rounded-[14px]'>Horror</span>
                    <span className='text-[15px] bg-foreground px-2 text-background rounded-[14px]'>Adult</span>
                    <span className='text-[15px] bg-foreground px-2 text-background rounded-[14px]'>Religion</span>
                </div>
                <h2 className='font-semibold'>Donald Trump</h2>
                <p>
                    Donald Trump is a businessman, television personality, and the 45th president of the United States (2017-2021)
                </p>


                <a className="bg-rainbow hover:scale-110 duration-300 text-foreground font-bold py-3 px-6 rounded-md inline-block cursor-pointer">
                    {`Let's read`}
                </a>



            </div>
        </div>
    )
}

export const TopBookSection = () => {
    const BookTitle = ['Book Title 1', 'Book Title 2', 'Book Title 3', 'Book Title 4', 'Book Title 5', 'Book Title 6', 'Book Title 7', 'Book Title 8'];
    return (
        <>
            <style>
                {
                    `
                    .swiper-pagination-bullet {
                        width: 16px;
                        height: 16px;
                        background-color: #fff;
                        border-radius: 50%;
                    }

                    .swiper-pagination-bullet-active {
                        background: var(--rainbow);
                        width: 32px;
                        border-radius: 14px;
                        box-shadow: var(--rainbow-shadow);
                        transition: all 0.8s ease-in-out;
                    }
                    `
                }
            </style>
            <section className='block bg-background'>
                <div className="flex mt-[30px] items-center justify-center">
                    <div className="bg-rainbow px-10 py-3 rounded-full">
                        <p className="text-xl md:text-2xl text-foreground font-bold">Top Books</p>
                    </div>
                </div>

                {/* Book list */}
                <div className="w-[90%] mt-[20px] m-auto overflow-hidden flex justify-center rounded-xl">
                    <Swiper
                        modules={[Pagination, EffectCoverflow]}
                        loop={true}
                        speed={1000}
                        grabCursor={true}
                        initialSlide={0}
                        centeredSlides={true}
                        slideToClickedSlide={true}
                        pagination={{
                            el: '.swiper-pagination',
                            clickable: true,
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 80,
                            depth: 200,
                            modifier: 1,
                            slideShadows: false,
                        }}

                        spaceBetween={10}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            900: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            }
                        }}

                    >

                        {BookTitle.map((title, index) => (
                            <SwiperSlide key={index}>
                                <BookSlide bookTitle={title} />
                            </SwiperSlide>
                        ))}


                    </Swiper>
                </div>
                <div className='mt-[40px] relative'>
                    <div className="swiper-pagination"></div>
                </div>
            </section >
        </>
    )
}