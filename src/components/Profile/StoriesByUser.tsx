import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { UserData } from '@/types/UserData';
import axios from 'axios';
import { generateApi, GET_STORY_BY_USERID } from '@/constants/api';
import Cookies from 'js-cookie';
import { useDebounce } from 'use-debounce';
import StoryCard from '../common/Stori/StoryCard';
import { BasicStoryInfo } from '@/types/Story';

interface StoriesByUserProps {
  userData: UserData | null;
}

const StoriesByUser = ({ userData }: StoriesByUserProps) => {
  const [stories, setStories] = useState<BasicStoryInfo[] | null>(null);
  const [searchText, setSearchText] = useState('');
  const [query] = useDebounce(searchText, 500);

  const filteredStories = useMemo(
    () =>
      stories?.filter((story) =>
        story.storyTitle.toLowerCase().includes(query.toLowerCase())
      ),
    [query, stories]
  );

  const fetchStories = useCallback(async () => {
    const token = Cookies.get('token');
    const response = await axios.get(
      generateApi(GET_STORY_BY_USERID, userData?.id),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      setStories(response.data);
    } else {
      console.error('Failed to fetch stories');
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      fetchStories();
    }
  }, [fetchStories, userData]);

  return (
    <div className="flex flex-col justify-center items-center gap-5 p-5">
      <h1 className="text-xl font-bold border-b-3 border-foreground">
        Stories by {userData?.firstName} {userData?.lastName}
      </h1>
      <div className="flex justify-center items-center gap-2 min-w-[300px] sm:min-w-[400px] md:min-w-[500px]">
        <Input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 px-[20px] xl:px-[50px] 2xl:px-[100px]">
        {filteredStories &&
          filteredStories.map((story) => (
            <StoryCard key={story.storyId} story={story} addToList={false} />
          ))}
      </div>
    </div>
  );
};

export default StoriesByUser;
