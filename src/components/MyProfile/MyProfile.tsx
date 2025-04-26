'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import About from '@/components/Profile/About';
import Works from '@/components/Profile/Works';
import ReadLists from '@/components/Profile/ReadLists';
import { Link } from '@/i18n/routing';

const tabs = [
  { id: 'about', label: 'About', content: 'Welcome to the Home tab!' },
  { id: 'works', label: 'Works', content: 'This is the About tab content.' },
  {
    id: 'following',
    label: 'Following',
    content: 'Reach us at the Contact tab.',
  },
  {
    id: 'readLists',
    label: 'Read Lists',
    content: 'Reach us at the Contact tab.',
  },
];

interface MyProfileProps {
  activeTab: string | null;
}

export default function MyProfile({ activeTab }: MyProfileProps) {
  return (
    <div className="py-[80px] flex-col justify-center items-center">
      <div className="flex flex-col items-center">
        <Avatar className="w-[80px] h-[80px]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <ul className="grid grid-cols-3 w-[300px] sm:w-[400px] mt-3 bg-card rounded-xl py-1">
          <li className="text-small sm:text-medium flex flex-col items-center justify-center hover:font-bold hover:cursor-pointer">
            <span>6</span>
            <span>Works</span>
          </li>

          <li className="text-small sm:text-medium flex flex-col items-center justify-center hover:font-bold hover:cursor-pointer">
            <span>13</span>
            <span>Read Lists</span>
          </li>

          <li className="text-small sm:text-medium flex flex-col items-center justify-center hover:font-bold hover:cursor-pointer">
            <span>10</span>
            <span>Followers</span>
          </li>
        </ul>
        <div className="w-[300px] sm:w-[500px] mt-3 py-2 px-3 bg-card rounded-xl">
          <div className="flex border-b border-gray-700">
            {tabs.map((tab, index) => (
              <Link
                key={index}
                onClick={() => {
                  console.log(tab.label);
                }}
                className={`flex-1 p-2 text-center text-sm md:text-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-white text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                href={'/myprofile/' + tab.id}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'about' ? <About /> : ''}
      {activeTab === 'works' ? <Works /> : ''}
      {activeTab === 'readLists' ? <ReadLists /> : ''}
    </div>
  );
}
