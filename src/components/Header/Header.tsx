'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Link } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import {
  ChevronDown,
  ChevronUp,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const components: { title: string }[] = [
  {
    title: 'Romance',
  },
  {
    title: 'Fantasy',
  },
  {
    title: 'Historical Fiction',
  },
  {
    title: 'Humor',
  },
  {
    title: 'Science Fiction',
  },
  {
    title: 'Non-Fiction',
  },
  {
    title: 'Mystery',
  },
  {
    title: 'Thriller',
  },
  {
    title: 'Horror',
  },
  {
    title: 'Adventure',
  },
  {
    title: 'Dystopian',
  },
  {
    title: 'Drama',
  },
  {
    title: 'Young Adult',
  },
  {
    title: "Children's Fiction",
  },
  {
    title: 'Magical Realism',
  },
  {
    title: 'Steampunk',
  },
  {
    title: 'Cyberpunk',
  },
  {
    title: 'Gothic Fiction',
  },
  {
    title: 'Psychological Fiction',
  },
  {
    title: 'Literary Fiction',
  },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreMenuOpen, setIsExploreMenuOpen] = useState(false);

  const handleThemeChange = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const toggleExploreMenu = () => {
    setIsExploreMenuOpen(!isExploreMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed w-full bg-card z-50">
      <nav className="py-2 lg:py-3 px-2 lg:px-5">
        <div className="flex justify-between items-center ">
          <div className="flex">
            <span className="bg-rainbow text-transparent bg-clip-text text-[1.5rem] font-bold">
              StoriVerse
            </span>
          </div>
          <div className="hidden lg:flex gap-5">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/"
                    className={`${navigationMenuTriggerStyle()}`}
                  >
                    <span className="text-[1rem]">Home</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <span className="text-[1rem]">Explore</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 lg:w-[600px] ">
                      {components.map((component) => (
                        <Link
                          key={component.title}
                          href="/"
                          className="text-[1rem] font-semibold hover:bg-accent py-1 px-2 rounded-sm"
                        >
                          {component.title}
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
                type="text"
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex gap-2">
              <Button>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button>
                <Link href="/register">Register</Link>
              </Button>
            </div>
            {mounted && (
              <button onClick={handleThemeChange}>
                {theme === 'dark' ? (
                  <MoonIcon className="hover:cursor-pointer text-yellow-300 font-" />
                ) : (
                  <SunIcon className="hover:cursor-pointer text-red-500" />
                )}
              </button>
            )}

            <div className=" lg:hidden">
              <MenuIcon
                className="hover:cursor-pointer"
                onClick={toggleMobileMenu}
              />
            </div>
          </div>
        </div>

        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className={`px-2 pt-2 pb-3 space-y-1 font-bold`}>
            <Link href="/" className="hover:bg-accent px-3 py-2 rounded-xl">
              Home
            </Link>

            <hr />

            {/* Explore button */}
            <button
              onClick={toggleExploreMenu}
              className="flex gap-1 items-center  hover:bg-accent rounded-xl px-3 py-2"
            >
              <div className="block ">Explore</div>
              {isExploreMenuOpen ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* Explore Content: Only show on trigger */}
            <div
              className={`lg:hidden transition-all duration-300 ease-in-out ${
                isExploreMenuOpen
                  ? 'max-h-200 opacity-100'
                  : 'max-h-0 opacity-0'
              } overflow-auto`}
            >
              <div className="flex-col  pl-6 font-medium">
                <Link
                  href="/"
                  className="block hover:bg-accent px-3 py-2 rounded-xl"
                >
                  More ...
                </Link>
                {components.slice(0, 5).map((component) => (
                  <Link
                    href="/"
                    className="block hover:bg-accent px-3 py-2 rounded-xl"
                    key={component.title}
                  >
                    {component.title}
                  </Link>
                ))}
              </div>
            </div>
            <hr />

            <div className="flex items-center gap-2 px-3 py-2">
              <SearchIcon />
              <Input
                className=" rounded-xl w-full"
                type="email"
                placeholder="Email"
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export { Header };
