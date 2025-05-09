'use client';

import {
  CHECK_IF_CURRENT_USER_FOLLOW_GIVEN_ID,
  generateApi,
} from '@/constants/api';
import axios from 'axios';
import { UserPlus, UserRoundCheck } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface FollowFeatureProps {
  userId: string;
}

const FollowFeature = ({ userId }: FollowFeatureProps) => {
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

  useEffect(() => {
    checkIfCurrentUserFollow();
  }, [checkIfCurrentUserFollow]);

  return (
    <div className="mt-2">
      {currentUserFollow ? (
        <button className="flex items-center gap-1 justify-center bg-rainbow rounded-md w-[120px] py-1 text-sm">
          <UserRoundCheck className="w-5 h-5" />
          <span>Following</span>
        </button>
      ) : (
        <button className="flex items-center gap-1 justify-center bg-card rounded-md w-[120px] py-1 text-sm">
          <UserPlus className="w-5 h-5" />
          <span>Follow</span>
        </button>
      )}
    </div>
  );
};

export default FollowFeature;
