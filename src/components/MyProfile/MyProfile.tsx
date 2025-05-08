'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import About from '@/components/Profile/About';
import ReadLists from '@/components/Profile/ReadLists';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { generateApi, GET_USER } from '@/constants/api';
import Cookies from 'js-cookie';
import { UserData } from '@/types/UserData';
import StoriesByUser from '../Profile/StoriesByUser';
import { CameraIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import FollowerList from '../Profile/FollowerList';
import FollowingList from '../Profile/FollowingList';

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'stories', label: 'Stories' },
  { id: 'readLists', label: 'Read Lists' },
];

interface MyProfileProps {
  activeTab: string | null;
}

export default function MyProfile({ activeTab }: MyProfileProps) {
  const [myData, setMyData] = useState<UserData | null>(null);
  const [isFollowerDialogOpen, setIsFollowerDialogOpen] = useState(false);
  const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);
  const uploadAvatarRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <div className="py-[63px] flex-col justify-center items-center">
      <div className="flex flex-col items-center relative">
        <div
          className={cn(
            'w-full absolute -z-10 h-[250px] md:h-[500px]',
            myData?.backgroundUrl ? 'bg-transparent' : 'bg-rainbow opacity-60'
          )}
        >
          {myData?.backgroundUrl && (
            <Image
              src={myData.backgroundUrl}
              alt="avatar"
              width={500}
              height={500}
              className="w-full h-[250px] md:h-[500px] object-cover object-center opacity-80"
              quality={100}
              priority
            />
          )}
          <button className="absolute top-3 right-3 max-w-[100px] sm:max-w-none px-3 py-1 text-xs sm:text-sm bg-secondary rounded-md active:scale-95">
            Change Background
          </button>
        </div>
        <div className="relative">
          <Avatar className="w-[80px] h-[80px] mt-5 relative">
            <AvatarImage src={myData?.avatarUrl} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            ref={uploadAvatarRef}
          />
          <button
            className="absolute right-0 bottom-0 bg-card p-1 rounded-full hover:opacity-70 hover:cursor-pointer"
            type="button"
            onClick={() => {
              uploadAvatarRef.current?.click();
            }}
          >
            <CameraIcon className="w-4 h-4" />
          </button>
        </div>
        <h1 className="font-bold text-xls md:text-2xl underline">
          {myData ? `${myData.firstName} ${myData.lastName}` : 'Loading...'}
        </h1>
        <div className="mt-2">
          <button className="w-[100px] py-1 text-sm bg-card rounded-md active:scale-95">
            Edit
          </button>
        </div>
        <ul className="grid grid-cols-3 w-[300px] sm:w-[400px] mt-2 bg-card rounded-md py-1 text-sm sm:text-md">
          <li className="hover:font-bold hover:cursor-pointer">
            <Link
              href="/myprofile/stories"
              className="flex flex-col items-center justify-center"
            >
              <span>{myData?.numberOfStories}</span>
              <span>Stories</span>
            </Link>
          </li>

          <li className="flex flex-col items-center justify-center hover:font-bold hover:cursor-pointer">
            <Dialog
              open={isFollowerDialogOpen}
              onOpenChange={setIsFollowerDialogOpen}
            >
              <DialogTrigger asChild>
                <button className="flex flex-col items-center justify-center">
                  <span>{myData?.numberOfFollowers}</span>
                  <span>Followers</span>
                </button>
              </DialogTrigger>
              <DialogContent className="px-4">
                <DialogHeader>
                  <DialogTitle>
                    {myData?.numberOfFollowers} Followers
                  </DialogTitle>
                  <DialogDescription className="hidden">
                    Followers
                  </DialogDescription>
                </DialogHeader>
                <FollowerList userData={myData} isOpen={isFollowerDialogOpen} />
              </DialogContent>
            </Dialog>
          </li>

          <li className="flex flex-col items-center justify-center hover:font-bold hover:cursor-pointer">
            <Dialog
              open={isFollowingDialogOpen}
              onOpenChange={setIsFollowingDialogOpen}
            >
              <DialogTrigger asChild>
                <button className="flex flex-col items-center justify-center">
                  <span>{myData?.numberOfFollowing}</span>
                  <span>Following</span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Following</DialogTitle>
                  <DialogDescription className="hidden">....</DialogDescription>
                </DialogHeader>
                <FollowingList
                  userData={myData}
                  isOpen={isFollowingDialogOpen}
                />
              </DialogContent>
            </Dialog>
          </li>
        </ul>
        <div className="w-[95vw] sm:w-[500px] mt-3 py-2 px-3 bg-card rounded-md">
          <div className="flex border-b border-gray-700">
            {tabs.map((tab, index) => (
              <Link
                key={index}
                onClick={() => {
                  console.log(tab.label);
                }}
                className={`flex-1 p-2 text-center text-sm md:text-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-foreground text-muted-foreground'
                    : 'text-gray-400 hover:secondary'
                }`}
                href={'/myprofile/' + tab.id}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'about' ? <About userData={myData} /> : ''}
      {activeTab === 'stories' ? <StoriesByUser userData={myData} /> : ''}
      {activeTab === 'readLists' ? <ReadLists userData={myData} /> : ''}
    </div>
  );
}
