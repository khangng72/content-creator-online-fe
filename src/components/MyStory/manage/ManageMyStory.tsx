'use client';

import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import PublishedStories from './PublishedStories';
import AllStories from './AllStories';
import { Link } from '@/i18n/routing';

const tabList = [
  { name: 'Published', id: 'published' },
  { name: 'All Stories', id: 'all' },
];

const ManageMyStory = () => {
  const [activeTab, setActiveTab] = useState(tabList[0].id);
  return (
    <div className="pt-[100px] flex-col w-[98vw] sm:w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] mx-auto pb-[20px]">
      <div className="flex justify-between items-center p-3">
        <h1 className="text-xl xl:text-2xl font-bold bg-rainbow text-transparent bg-clip-text">
          My Stories
        </h1>
        <Link
          href={`/mystory/new`}
          className="px-2 py-1 rounded-md text-sm bg-purpleRainbow active:scale-95 transition-all duration-200 ease-in-out text-white flex gap-1 items-center"
        >
          <Plus size={16} />
          <span>Add New Story</span>
        </Link>
      </div>

      <div className="flex flex-col bg-card mt-2 rounded-md pb-3">
        <div className="flex  border-b border-accent">
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

        {activeTab == 'published' && <PublishedStories />}

        {activeTab == 'all' && <AllStories />}
      </div>
    </div>
  );
};

export default ManageMyStory;
