import React, { useCallback, useEffect, useState } from 'react';
import ManageStoryCard from './ManageStoryCard';
import { BasicStoryInfo } from '@/types/Story';
import Cookies from 'js-cookie';
import { generateApi, GET_PUBLISHED_STORY } from '@/constants/api';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

const PublishedStories = () => {
  const [publishedStories, setPublishedStories] = useState<BasicStoryInfo[]>(
    []
  );

  const [text, setText] = useState<string>('');

  const [textFiltered] = useDebounce(text, 500);

  const fetchPublishedStories = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(generateApi(GET_PUBLISHED_STORY), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setPublishedStories(response.data);
      } else {
        console.error('Failed to fetch published stories');
      }
    } catch (error) {
      console.error('Error fetching published stories:', error);
    }
  }, []);

  useEffect(() => {
    fetchPublishedStories();
  }, [fetchPublishedStories]);

  const stories = publishedStories.filter((story) => {
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
          <ManageStoryCard key={story.storyId} story={story} />
        ))}
    </div>
  );
};

export default PublishedStories;
