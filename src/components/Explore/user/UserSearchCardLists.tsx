import { BookIcon, UserPlus, Users } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const users = [
  {
    userId: 1,
    userName: 'John Doe',
    userAvatar: '/default-avatar.jpeg',
    numberOfStories: 10,
    numberOfFollowers: 100,
    userDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    userId: 2,
    userName: 'Jane Doe',
    userAvatar: '/default-avatar.jpeg',
    numberOfStories: 10,
    numberOfFollowers: 100,
    userDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    userId: 3,
    userName: 'Adam Doe',
    userAvatar: '/default-avatar.jpeg',
    numberOfStories: 10,
    numberOfFollowers: 100,
    userDescription:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];

const UserSearchCardLists = () => {
  return (
    <div
      className="grid gap-5 justify-center my-6
            grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-[90vw] xl:w-[80vw] mx-auto"
    >
      {users.map((user) => {
        return (
          <div
            key={user.userId}
            className="flex gap-2 items-center bg-card rounded-md p-4 relative shadow-md"
          >
            <div>
              <Avatar className="w-[40px] h-[40px]">
                <AvatarImage src={user.userAvatar} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span className="text-xl font-bold">{user.userName}</span>
                <ul className="flex gap-3">
                  <li className="flex gap-1 items-center">
                    <BookIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {user.numberOfStories} Stories
                    </span>
                  </li>
                  <li className="flex gap-1 items-center">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {user.numberOfFollowers} Followers
                    </span>
                  </li>
                </ul>
              </div>
              <button className="flex gap-1 px-3 py-1 rounded-md bg-rainbow hover:opacity-90">
                <UserPlus className="w-5 h-5" />
                <span>Follow</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserSearchCardLists;
