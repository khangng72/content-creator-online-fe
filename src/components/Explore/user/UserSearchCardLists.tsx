'use client';
import Cookies from 'js-cookie';
import { BookIcon, UserPlus, Users } from 'lucide-react';
import React, { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import { generateApi, SEARCH_USER } from '@/constants/api';
import { Logger } from '@/utils/Logger';
import { useInfiniteQuery } from '@tanstack/react-query';
import { UserData } from '@/types/UserData';
import { useInView } from 'react-intersection-observer';

interface UserSearchCardListsProps {
  searchQuery: string;
}

const UserSearchCardLists = ({ searchQuery }: UserSearchCardListsProps) => {
  const { ref, inView } = useInView();
  const fetchUsers = async ({ pageParam }: { pageParam: number }) => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(
        generateApi(
          SEARCH_USER,
          '',
          `keyword=${searchQuery}&page=${pageParam}&size=20`
        ),
        {
          headers,
        }
      );

      return response.data.result;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Logger.error('Error searching stories by query:', 'client');
        throw new Error(`Error searching stories by query: ${error.message}`);
      } else {
        Logger.error('Unexpected error:', 'client');
        throw new Error('Unexpected error occurred');
      }
    }
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['searchUser', searchQuery],
      queryFn: fetchUsers,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length ? allPages.length : undefined;
        return nextPage;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const users = data?.pages?.flatMap((page: UserData) => page || []) ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[20vh]">
        <span className="text-2xl font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className="grid gap-5 justify-center my-6
            grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-[98vw] xl:w-[80vw] mx-auto"
    >
      {users.map((user, index) => {
        return (
          <div
            key={user.id}
            className="flex gap-2 items-center bg-card rounded-md p-4 relative shadow-md"
            ref={index + 1 === users.length ? ref : null}
          >
            <div>
              <Avatar className="w-[40px] h-[40px]">
                <AvatarImage src={user.avatarUrl} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col">
                <span className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </span>
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
