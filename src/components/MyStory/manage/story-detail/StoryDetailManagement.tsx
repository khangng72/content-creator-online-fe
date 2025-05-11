'use client';

import StoriImage from '@/components/ui/StoriImage';
import { Link } from '@/i18n/routing';
import { ChevronLeft } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import StoryInfo from './StoryInfo';
import ContentTable from './ContentTable';
import { BasicStoryInfo } from '@/types/Story';
import Cookies from 'js-cookie';
import { generateApi, GET_BASIC_INFO_STORY } from '@/constants/api';
import axios from 'axios';

const tabList = [
  { name: 'Story Info', id: 'info' },
  { name: 'Table of Contents', id: 'content' },
];

interface StoryDetailManagementProps {
  storyId: string;
}

const StoryDetailManagement = ({ storyId }: StoryDetailManagementProps) => {
  const [storyInfo, setStoryInfo] = useState<BasicStoryInfo | null>(null);

  const [activeTab, setActiveTab] = useState(tabList[0].id);

  const fetchStoryInfo = useCallback(async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.get(
        generateApi(GET_BASIC_INFO_STORY, storyId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setStoryInfo(response.data);
      } else {
        console.error('Failed to fetch story info');
      }
    } catch (error) {
      console.error('Error fetching story info:', error);
    }
  }, [storyId]);

  useEffect(() => {
    fetchStoryInfo();
  }, [fetchStoryInfo]);

  return (
    <div className="pt-[100px] flex-col w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[70vw]  m-auto pb-2">
      <div className="w-full justify-between items-end p-3 flex">
        <Link
          href={`/mystory/manage`}
          className="flex gap-1 text-muted-foreground text-xs sm:text-base hover:underline items-center"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to My Stories</span>
        </Link>

        <div className="block text-right">
          <span className="text-sm md:text-xl font-bold text-muted-foreground">
            Edit
          </span>
          <h1 className="text-base md:text-2xl font-bold bg-rainbow text-transparent bg-clip-text">
            {storyInfo?.storyTitle}
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full justify-center items-center md:items-start gap-2 md:gap-0">
        <div className="w-full md:w-[20%] flex justify-center items-center">
          <StoriImage
            source="/BookCover/sample_cover.jpeg"
            storyTitle="ss"
            className="w-[160px] h-[240px] md:w-[100px] md:h-[150px] lg:w-[160px] lg:h-[240px] 2xl:w-[200px] 2xl:h-[300px]"
          />
        </div>
        <div className="w-full md:w-[70%] bg-card rounded-md pb-3">
          <div className="flex justify-center md:justify-start border-b border-accent mb-3">
            {tabList.map((tab) => (
              <button
                key={tab.id}
                className={`${
                  activeTab === tab.id
                    ? 'text-purpleRainbow font-bold border-b-4 border-purpleRainbow'
                    : 'text-muted-foreground'
                } py-3 px-6 text-lg xl:text-xl transition-all duration-200 ease-in-out`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {activeTab == 'info' && storyInfo && <StoryInfo story={storyInfo} />}
          {activeTab == 'content' && <ContentTable />}
        </div>
      </div>
    </div>
  );
};

export default StoryDetailManagement;
