import { Frown } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { UserData } from '@/types/UserData';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, GET_READING_LIST_BY_USER_ID } from '@/constants/api';
import { ReadList } from '@/types/ReadList';
import ProfileReadListCard from './ProfileReadListCard';

interface ReadListsProps {
  userData: UserData | null;
}
const ReadLists = ({ userData }: ReadListsProps) => {
  const [readLists, setReadLists] = useState<ReadList[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchReadLists = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_READING_LIST_BY_USER_ID, userData?.id),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setReadLists(response.data.result);
      } else {
        console.error('Failed to fetch read lists:', response.status);
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching read lists bug:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      fetchReadLists();
    }
  }, [fetchReadLists, userData]);

  if (loading) {
    <div className="flex flex-col items-center justify-center font-bold text-xl mt-3">
      <div className="flex gap-2 items-center">
        <span>Loading Read list</span>
        <Frown className="w-7 h-7" />
      </div>
    </div>;
  }

  if (error) {
    <div className="flex flex-col items-center justify-center font-bold text-xl mt-3">
      <div className="flex gap-2 items-center">
        <span>Load Read List failed</span>
        <Frown className="w-7 h-7" />
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-5 p-5">
      <h1 className="text-xl font-bold border-b-3 border-foreground">
        Read Lists by {userData?.firstName} {userData?.lastName}
      </h1>
      <div className="flex flex-col gap-5 w-full lg:w-[80vw] xl:w-[75vw] 2xl:w-[60vw]">
        {readLists && (
          <ul className="flex flex-col gap-5 w-full">
            {readLists.map((list: ReadList) => {
              return (
                <ProfileReadListCard readList={list} key={list.read_list_id} />
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReadLists;
