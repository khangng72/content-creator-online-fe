'use client'

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Library, Menu } from 'lucide-react';
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

const Header = () => {
    const { setTheme, theme } = useTheme()
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isOpenExploreMenu, setIsExploreMenu] = useState(false);

    const toggleMenu = () => {
        setIsOpenMenu(!isOpenMenu);
    };

    const toggleExploreMenu = () => {
        setIsExploreMenu(!isOpenExploreMenu);
    }

    const handleSetTheme = () => {
        if (theme == 'dark') {
            setTheme('light');
        }
        else {
            setTheme('dark')
        }
    }

    return (
        <header className='fixed w-full z-20'>
            <nav className="bg-[var(--content-bg-color)] shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className='flex gap-10 items-center'>
                            <div className="flex-shrink-0 flex items-center gap-5">
                                <Library className="text-[var(--foreground)]" />
                                <a href="#" className="text-xl font-bold text-[var(--foreground)]">STORIVERSE</a>
                            </div>

                            {/* Menu Items */}
                            <div className={`hidden md:flex md:items-center md:space-x-4 text-[var(--foreground)] font-bold`}>
                                <a href="#" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm">Home</a>

                                <div className='relative'>
                                    <button onClick={toggleExploreMenu} className='flex gap-1 items-center hover:text-blue-600'>
                                        <div className="pl-3 py-2 rounded-md text-sm">Explore</div>
                                        {isOpenExploreMenu ? <ChevronUp /> : <ChevronDown />}
                                    </button>

                                    {isOpenExploreMenu && (
                                        <ul className="absolute left-0 mt-2 bg-white shadow-lg rounded-md flex items-center">
                                            <ul className='w-48'>
                                                <li>
                                                    <a href="/service1" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Fantasy</a>
                                                </li>
                                                <li>
                                                    <a href="/service2" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Science Fiction</a>
                                                </li>
                                                <li>
                                                    <a href="/service3" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Mystery</a>
                                                </li>
                                                <li>
                                                    <a href="/service3" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Romance</a>
                                                </li>
                                                <li>
                                                    <a href="/service1" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Thriller</a>
                                                </li>

                                            </ul>

                                            <hr className="w-px h-40 bg-gray-400" />

                                            <ul className='w-48'>
                                                <li>
                                                    <a href="/service1" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Horror</a>
                                                </li>
                                                <li>
                                                    <a href="/service2" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Historical Fiction</a>
                                                </li>
                                                <li>
                                                    <a href="/service3" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Young Adult</a>
                                                </li>
                                                <li>
                                                    <a href="/service3" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Non-fiction</a>
                                                </li>
                                                <li>
                                                    <a href="/service3" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Adventure</a>
                                                </li>
                                            </ul>
                                        </ul>
                                    )}
                                </div>

                                <a href="#" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm">Community</a>
                            </div>
                        </div>

                        <div className={`hidden md:flex md:items-center md:space-x-4 text-[var(--foreground)] font-bold`}>
                            <a href="#" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm">Sign Up</a>
                            <a href="/pages/auth" className="text-black bg-slate-100 hover:bg-gray-200 hover:bg-opacity-80 px-3 py-2 rounded-md text-sm cursor-pointer">Log in</a>
                            <button onClick={handleSetTheme} >
                                {
                                    theme == 'dark' ?
                                        (<Moon suppressHydrationWarning />)
                                        :
                                        (<Sun suppressHydrationWarning />)
                                }
                            </button>
                        </div>

                        {/* Hamburger Menu (hidden on larger screens) */}
                        <div className="flex items-center md:hidden">
                            <button onClick={toggleMenu} className="text-[var(--foreground)] focus:outline-none">
                                <Menu />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Mobile Menu with Transition */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out ${isOpenMenu ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'
                        } overflow-hidden`}
                >
                    <div className={`px-2 pt-2 pb-3 space-y-1 font-bold`}>
                        <a href="#" className="block text-[var(--foreground)] hover:text-blue-600 px-3 py-2 rounded-md text-base ">Home</a>

                        {/* Explore button */}
                        <button onClick={toggleExploreMenu} className='flex gap-1 items-center text-[var(--foreground)] hover:text-blue-600'>
                            <div className="block pl-3 py-2 rounded-md text-base ">Explore</div>
                            {isOpenExploreMenu ? <ChevronUp /> : <ChevronDown />}
                        </button>

                        {/* Explore Content: Only show on trigger */}
                        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpenExploreMenu ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'
                            } overflow-hidden`}>

                            <div className='flex-col text-[var(--foreground)] pl-6 font-medium'>
                                <div className="block py-2 rounded-md text-base">Fantasy</div>
                                <div className="block py-2 rounded-md text-base">Science Fiction</div>
                                <div className="block py-2 rounded-md text-base">Mystery</div>
                                <div className="block py-2 rounded-md text-base">Romance</div>
                                <div className="block py-2 rounded-md text-base">Thriller</div>
                                <div className="block py-2 rounded-md text-base">Horror</div>
                                <div className="block py-2 rounded-md text-base">Historical Fiction</div>
                                <div className="block py-2 rounded-md text-base">Young Adult (YA)</div>
                                <div className="block py-2 rounded-md text-base">Non-fiction</div>
                                <div className="block py-2 rounded-md text-base">Adventure</div>
                            </div>
                        </div>

                        <a href="#" className="block text-[var(--foreground)] hover:text-blue-600 px-3 py-2 rounded-md text-base ">Community</a>
                    </div>
                </div>

            </nav>
        </header>
    );
};

export { Header };
