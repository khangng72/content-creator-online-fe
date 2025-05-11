import React, { useCallback, useEffect, useState } from 'react';
import ManageStoryCard from './ManageStoryCard';
import { BasicStoryInfo } from '@/types/Story';
import Cookies from 'js-cookie';
import { generateApi, GET_ALL_STORIES_BY_CURRENT_USER } from '@/constants/api';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

const AllStories = () => {
  const [allStories, setAllStories] = useState<BasicStoryInfo[]>([]);

  const [text, setText] = useState<string>('');

  const [textFiltered] = useDebounce(text, 500);

  const fetchAllStories = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(
        generateApi(GET_ALL_STORIES_BY_CURRENT_USER),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAllStories(response.data);
      } else {
        console.error('Failed to fetch published stories');
      }
    } catch (error) {
      console.error('Error fetching published stories:', error);
    }
  }, []);

  useEffect(() => {
    fetchAllStories();
  }, [fetchAllStories]);

  const stories = allStories.filter((story) => {
    if (textFiltered === '') return true;
    const lowerCaseTitle = story.storyTitle.toLowerCase();
    const lowerCaseText = textFiltered.toLowerCase();
    return lowerCaseTitle.includes(lowerCaseText);
  });

  return (
    <div className="flex flex-col">
      <div className="px-4 py-4 border-b border-accent w-full flex gap-1 items-center">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          className="w-full rounded-md py-2 text-sm px-3 border border-accent focus:outline-none"
          type="text"
          placeholder="Search story..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      {stories.length > 0 &&
        stories.map((story) => (
          <ManageStoryCard
            key={story.storyId}
            story={story}
            fetchStories={fetchAllStories}
          />
        ))}
    </div>
  );
};

export default AllStories;
