import StoryDetailManagement from '@/components/MyStory/manage/story-detail/StoryDetailManagement';
import React from 'react';

const StoryDetailManagementPage = ({
  params,
}: {
  params: { story_id: string };
}) => {
  const { story_id } = params;
  return <StoryDetailManagement storyId={story_id} />;
};

export default StoryDetailManagementPage;
