'use client';

import React, { useCallback, useEffect, useState } from 'react';
import LibraryOptions from '../LibraryOptions';
import { CurrentRead } from '@/types/CurrentRead';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, GET_CURRENT_READS } from '@/constants/api';
import CurrentReadCard from './CurrentReadCard';

const CurrentReads = () => {
  const [currentReads, setCurrentReads] = useState<CurrentRead[]>([]);
  const fetchCurrentReads = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(generateApi(GET_CURRENT_READS), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setCurrentReads(response.data);
      } else {
        console.error('Error fetching current reads:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching current reads:', error);
    }
  }, []);

  useEffect(() => {
    fetchCurrentReads();
  }, [fetchCurrentReads]);

  return (
    <>
      <LibraryOptions currentTab="current_reads" />

      <div
        className="grid gap-5 justify-center mt-6 
                grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 w-[90vw] xl:w-[80vw] mx-auto"
      >
        {currentReads.map((story) => {
          return <CurrentReadCard key={story.storyId} story={story} />;
        })}
      </div>
    </>
  );
};

export default CurrentReads;
