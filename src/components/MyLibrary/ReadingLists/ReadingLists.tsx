'use client';
import React, { useCallback, useEffect, useState } from 'react';
import LibraryOptions from '../LibraryOptions';
import Image from 'next/image';
import { Ellipsis, PlusIcon } from 'lucide-react';
import axios from 'axios';
import { generateApi, GET_READING_LIST_BY_CURRENT_USER } from '@/constants/api';
import Cookies from 'js-cookie';
import { set } from 'zod';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ReadList } from '@/types/ReadList';
import ReadingListCard from './ReadingListCard';

const ReadingLists = () => {
  const [readingLists, setReadingLists] = useState<ReadList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchReadLists = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_READING_LIST_BY_CURRENT_USER),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setReadingLists(response.data.result);
      } else {
        setError(true);
        console.error('Error fetching reading lists:', response.data.message);
      }
    } catch (error) {
      setError(true);
      console.error('Error fetching reading lists:', error);
    } finally {
      setLoading(false);
    }
  }, [setReadingLists]);

  useEffect(() => {
    fetchReadLists();
  }, [fetchReadLists]);

  if (loading) {
    return (
      <>
        <LibraryOptions currentTab="reading_lists" />
        <div className="w-[95vw] md:w-[80vw] flex flex-col items-center mx-auto mt-5">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <LibraryOptions currentTab="reading_lists" />
        <div className="w-[95vw] md:w-[80vw] flex flex-col items-center mx-auto mt-5">
          <h1 className="text-2xl font-bold">Error Loading Read List</h1>
        </div>
      </>
    );
  }

  console.log('Reading Lists:', readingLists);

  return (
    <>
      <LibraryOptions currentTab="reading_lists" />

      <div className="w-[95vw] md:w-[80vw] flex flex-col items-start mx-auto my-5">
        <button className="bg-rainbow px-3 py-2 text-sm flex gap-2 rounded-md mb-5 active:scale-95 transition-all duration-200">
          <span>New Reading List</span>
          <PlusIcon className="w-5 h-5" />
        </button>
        <ul className="flex flex-col gap-5 w-full">
          {readingLists.map((list) => {
            return <ReadingListCard readList={list} />;
          })}
        </ul>
      </div>
    </>
  );
};

export default ReadingLists;
