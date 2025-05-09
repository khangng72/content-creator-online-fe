'use client';

import {
  CHECK_IF_CURRENT_USER_FOLLOW_GIVEN_ID,
  generateApi,
  TOGGLE_FOLLOW_USER,
} from '@/constants/api';
import axios from 'axios';
import { UserPlus, UserRoundCheck } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface FollowFeatureProps {
  userId: string;
  fetchUserData: () => Promise<void>;
}

const FollowFeature = ({ userId, fetchUserData }: FollowFeatureProps) => {
  const [currentUserFollow, setCurrentUserFollow] = useState(false);

  const checkIfCurrentUserFollow = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(CHECK_IF_CURRENT_USER_FOLLOW_GIVEN_ID, userId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setCurrentUserFollow(response.data);
      } else {
        console.error('Failed to verify user follow status');
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  }, [userId]);

  const handleFollow = async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.put(
        generateApi(TOGGLE_FOLLOW_USER, userId),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setCurrentUserFollow((prev) => !prev);
        fetchUserData();
      } else {
        console.error('Failed to follow/unfollow user');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  useEffect(() => {
    checkIfCurrentUserFollow();
  }, [checkIfCurrentUserFollow]);

  return (
    <div className="mt-2">
      {currentUserFollow ? (
        <button
          className="flex items-center gap-1 justify-center bg-rainbow rounded-md w-[120px] py-1 text-sm"
          onClick={handleFollow}
        >
          <UserRoundCheck className="w-5 h-5" />
          <span>Following</span>
        </button>
      ) : (
        <button
          className="flex items-center gap-1 justify-center bg-card rounded-md w-[120px] py-1 text-sm"
          onClick={handleFollow}
        >
          <UserPlus className="w-5 h-5" />
          <span>Follow</span>
        </button>
      )}
    </div>
  );
};

export default FollowFeature;
