import MyProfile from '@/components/MyProfile/MyProfile';
import React from 'react';

const MyProfilePage = async ({
  params,
}: {
  params: Promise<{ active_tab: string }>;
}) => {
  const { active_tab } = await params;
  return <MyProfile activeTab={active_tab} />;
};

export default MyProfilePage;
