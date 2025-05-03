import StoryDetail from '@/components/Stori/detail/StoryDetail';
import React from 'react';

const StoryDetailPage = async ({
  params,
}: {
  params: Promise<{ stori_id: string }>;
}) => {
  const { stori_id } = await params;

  return <StoryDetail storyId={stori_id} />;
};

export default StoryDetailPage;
