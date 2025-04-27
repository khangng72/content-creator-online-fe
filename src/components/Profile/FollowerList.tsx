import { UserData } from '@/types/UserData';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, GET_FOLLOWERS_BY_USERID } from '@/constants/api';

import { Logger } from '@/utils/Logger';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton'; // Example skeleton
import { Link } from '@/i18n/routing';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface FollowerListProps {
  userData: UserData | null;
  isOpen: boolean; // Prop indicating if the dialog/component is active
}

const FollowerList = ({ userData, isOpen }: FollowerListProps) => {
  const { ref, inView } = useInView();

  const fetchFollowers = async ({ pageParam }: { pageParam: number }) => {
    // Ensure userData and its id exist before attempting to fetch
    if (!userData?.id) {
      Logger.error(
        'fetchFollowers skipped: userData or userData.id missing.',
        'client'
      );

      return [];
    }

    const token = Cookies.get('token');
    if (!token) {
      Logger.error('fetchFollowers failed: Token not found.', 'client');
      throw new Error('Authentication token not found');
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(
        generateApi(GET_FOLLOWERS_BY_USERID, userData.id, `page=${pageParam}`),
        {
          headers,
        }
      );

      return response.data.result;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Logger.error('Error fetching followers:', 'client');
        throw new Error(`Error fetching followers: ${error.message}`);
      } else {
        Logger.error('Unexpected error fetching followers:', 'client');
        throw new Error('Unexpected error occurred while fetching followers');
      }
    }
  };

  const {
    data,
    isLoading, // Represents initial loading state
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['followers', userData?.id],
    queryFn: fetchFollowers,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length : undefined;
      return nextPage;
    },
    enabled: isOpen && !!userData?.id,
  });

  // Effect for infinite scrolling remains the same
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle loading state specifically for the initial load controlled by 'enabled'
  if (isLoading && isOpen) {
    return (
      <div className="mt-5 p-4 space-y-4">
        {/* Example Skeleton Loaders */}
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="mt-5 p-4 text-red-600 text-center">
        Error loading followers: {error?.message || 'Unknown error'}
      </div>
    );
  }

  // Handle case where dialog is open but userData is missing (should be less likely with enabled flag)
  if (isOpen && !userData) {
    return (
      <div className="mt-5 p-4 text-center text-muted-foreground">
        User data not available.
      </div>
    );
  }

  // Combine all pages' results for rendering
  const followers = data?.pages?.flatMap((page) => page || []) ?? []; // Adjust 'content' based on your API

  return (
    <div className="space-y-3 max-h-[60vh] md:max-h-[30vh] overflow-y-auto scroll-container">
      {followers.length > 0
        ? followers.map((follower, index) => (
            <div
              key={follower.id || index}
              className="flex items-center justify-between gap-3 p-2 border rounded"
              ref={index + 1 === followers.length ? ref : null}
            >
              <div className="flex gap-2 items-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={follower.avatarUrl} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {follower.firstName} {follower.lastName}
                </span>
              </div>
              <Link href="#">
                <button className="px-3 py-1 bg-rainbow text-sm rounded-md hover:opacity-80 transition duration-200 hover:cursor-pointer">
                  View Profile
                </button>
              </Link>
            </div>
          ))
        : // Show message if dialog is open but no followers are loaded (and not loading/error)
          isOpen &&
          !isLoading && (
            <p className="text-center text-muted-foreground">
              No followers found.
            </p>
          )}

      {/* Loading indicator for fetching next page */}
      {isFetchingNextPage && (
        <div className="text-center p-4">
          <p>Loading more...</p>
        </div>
      )}
    </div>
  );
};

export default FollowerList;
