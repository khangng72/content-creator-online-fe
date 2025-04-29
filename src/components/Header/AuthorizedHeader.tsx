'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import {
  MoonIcon,
  SearchIcon,
  SquarePen,
  SquarePlus,
  SunIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import ProfileMenu from './ProfileMenu';
import NotificationMenu from './NotificationMenu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import axios from 'axios';
import { generateApi, GET_ALL_GENRES } from '@/constants/api';

interface Genre {
  genreId: string;
  genreName: string;
}

export const AuthorizedHeader = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [genreList, setGenreList] = useState<Genre[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const fetchGenreList = useCallback(async () => {
    try {
      const response = await axios.get(generateApi(GET_ALL_GENRES));

      setGenreList(response.data.result);
    } catch (error) {
      console.error('Error fetching genre list:', error);
    }
  }, []);

  useEffect(() => {
    fetchGenreList();
  }, [fetchGenreList]);

  const handleThemeChange = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed w-full bg-card z-20">
      <nav className="relative">
        <div className="flex justify-between items-center py-3 px-2 lg:px-5">
          <div className="flex">
            <span className="bg-rainbow text-transparent bg-clip-text text-[1.25rem] sm:text-[1.5rem] font-bold">
              StoriVerse
            </span>
          </div>
          <div className="hidden lg:flex gap-5">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    href="/home"
                    className={`${navigationMenuTriggerStyle()}`}
                  >
                    <span className="text-[1rem]">Home</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <span className="text-[1rem]">Explore</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 lg:w-[600px] ">
                      {genreList.map((genre: Genre) => (
                        <Link
                          key={genre.genreId}
                          href={`/explore/genre/${genre.genreId}`}
                          className="text-[1rem] font-semibold hover:bg-accent py-1 px-2 rounded-sm"
                        >
                          {genre.genreName}
                        </Link>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center gap-2">
              <SearchIcon />
              <Input
                className="md:w-[200px] lg:w-[400px] xl:w-[600px] rounded-xl"
                type="email"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex gap-2 items-center">
                  <span>Write</span>
                  <SquarePen size={18} className="block sm:hidden" />
                  <SquarePen className="hidden sm:block" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="bg-card max-w-[200px]">
                <ul className="flex flex-col text-xs sm:text-sm gap-4">
                  <li className="flex gap-2 items-center hover:underline">
                    <SquarePlus />
                    <Link href="/mystory/new">Write a Story</Link>
                  </li>
                  <li className="flex gap-2 items-center hover:underline">
                    <Link href="/mystory/manage">My Stories</Link>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
            {mounted && (
              <button
                onClick={handleThemeChange}
                className="hover:cursor-pointer hover:opacity-80"
              >
                {theme === 'dark' ? (
                  <MoonIcon className="text-yellow-300" />
                ) : (
                  <SunIcon className="text-red-500" />
                )}
              </button>
            )}

            <NotificationMenu />

            <ProfileMenu router={router} pathname={pathname} />
          </div>
        </div>
      </nav>
    </header>
  );
};
