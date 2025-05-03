import React, { useCallback, useEffect, useRef, useState } from 'react';

import { BookHeart, ChevronDown, LogOut, ShoppingCart } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axios from 'axios';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import vietnam_flag from '$/public/vietnam.png';
import american_flag from '$/public/usa.png';
import { generateApi, GET_USER } from '@/constants/api';
import Cookies from 'js-cookie';
import { UserData } from '@/types/UserData';

interface ProfileMenuProps {
  router: ReturnType<typeof useRouter>;
  pathname: ReturnType<typeof usePathname>;
}

const ProfileMenu = ({ router, pathname }: ProfileMenuProps) => {
  const t = useTranslations('AuthorizedHeader');
  const locale = useLocale();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(locale);

  const [myData, setMyData] = useState<UserData | null>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const languageDialogRef = useRef<HTMLDivElement>(null);

  const handleSaveChangeLanguage = () => {
    router.replace(pathname, { locale: selectedLocale });
  };

  const fetchUserData = useCallback(async () => {
    const token = Cookies.get('token');
    const response = await axios.get(generateApi(GET_USER), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      setMyData(response.data.result);
    } else {
      console.error('Failed to fetch user data');
    }
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const logoutResult = await axios.post('/api/auth/logout');

      if (logoutResult.data['success']) {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    const handleOnClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !event.composedPath().includes(profileMenuRef.current)
      ) {
        if (!languageDialogRef.current) {
          setIsProfileMenuOpen(false);
        }
      }
    };

    document.body.addEventListener('click', handleOnClickOutside);
    return () => {
      document.body.removeEventListener('click', handleOnClickOutside);
    };
  }, []);

  return (
    <div ref={profileMenuRef} className="items-center flex">
      <button
        className="relative hover:opacity-80 hover:cursor-pointer"
        onClick={toggleProfileMenu}
      >
        <Avatar>
          <AvatarImage
            src={myData?.avatarUrl}
            alt={`${myData?.firstName} ${myData?.lastName} avatar`}
          />
          <AvatarFallback>
            {myData?.firstName.charAt(0)}
            {myData?.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="rounded-full bg-foreground absolute top-6 left-6">
          <ChevronDown className="text-background" strokeWidth={1} size={18} />
        </div>
      </button>

      {isProfileMenuOpen && (
        <div
          className="
            absolute 
          top-14 
          md:right-3 
          md:translate-x-0 
          md:left-auto 
          left-1/2 
          -translate-x-1/2 
          bg-card w-[90%] 
          md:w-80 
          rounded-md flex-col px-5 pt-2 pb-4 space-y-3 shadow-md"
        >
          <h2 className="font-bold text-md">{t('ProfileMenu.account')}</h2>
          <Link
            className="flex items-center bg-secondary gap-3 px-3 py-1 rounded-md hover:bg-accent hover:cursor-pointer"
            href="/myprofile/about"
          >
            <Avatar>
              <AvatarImage
                src={myData?.avatarUrl}
                alt={`${myData?.firstName} ${myData?.lastName} avatar`}
              />
              <AvatarFallback>
                {myData?.firstName.charAt(0)}
                {myData?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">
              {myData?.firstName} {myData?.lastName}{' '}
            </span>
          </Link>
          <hr className="border-b-[0.5px] border-[#65686C]" />
          <Link
            className="flex items-center bg-secondary  gap-3 px-3 py-2 rounded-md hover:bg-accent hover:cursor-pointer"
            href="/my_library/reading_lists"
          >
            <BookHeart />
            <span className="font-semibold text-sm">
              {t('ProfileMenu.myLibrary')}
            </span>
          </Link>
          <div className="flex items-center bg-secondary  gap-3 px-3 py-2 rounded-md hover:bg-accent hover:cursor-pointer">
            <ShoppingCart />
            <span className="font-semibold text-sm">
              {t('ProfileMenu.cart')}
            </span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <div className="flex items-center bg-secondary  gap-3 px-3 py-2 rounded-md hover:bg-accent hover:cursor-pointer">
                {locale === 'vi' ? (
                  <Image
                    src={vietnam_flag}
                    alt="vietnam_flag"
                    className="w-[24px]"
                  />
                ) : (
                  <Image
                    src={american_flag}
                    alt="american_flag"
                    className="w-[24px]"
                  />
                )}

                <span className="font-semibold text-sm">
                  {t('ProfileMenu.language')}
                </span>
              </div>
            </DialogTrigger>
            <DialogContent
              className="max-w-[95%] sm:max-w-[425px]"
              ref={languageDialogRef}
            >
              <DialogHeader>
                <DialogTitle>{t('LanguageSettings.title')}</DialogTitle>
                <DialogDescription>
                  {t('LanguageSettings.description')}
                </DialogDescription>
              </DialogHeader>
              <div className="flex space-x-2 items-center justify-center sm:justify-start">
                <label htmlFor="dropdown" className=" font-semibold">
                  {t('LanguageSettings.chooseAnOption')}:
                </label>
                <div className="relative">
                  <select
                    id="dropdown"
                    name="dropdown"
                    className="py-1 pl-3 rounded-xl focus:outline-none hover:cursor-pointer appearance-none w-[130px]"
                    value={selectedLocale}
                    onChange={(e) => setSelectedLocale(e.target.value)}
                  >
                    <option value="vi">
                      {t('LanguageSettings.vietnamese')}
                    </option>
                    <option value="en">{t('LanguageSettings.english')}</option>
                  </select>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    ▼
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveChangeLanguage}>
                  {t('LanguageSettings.saveChange')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <button
            className="flex items-center bg-red-500  gap-3 px-3 py-2 rounded-md hover:bg-red-400 hover:cursor-pointer w-full"
            onClick={handleLogout}
          >
            <LogOut />
            <span className="font-semibold text-sm">
              {t('ProfileMenu.logout')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
