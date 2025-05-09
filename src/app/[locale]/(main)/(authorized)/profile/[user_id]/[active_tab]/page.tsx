import Profile from '@/components/Profile/Profile';
import React from 'react';

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ user_id: string; active_tab: string }>;
}) => {
  const { user_id, active_tab } = await params;
  return <Profile userId={user_id} activeTab={active_tab} />;
};

export default UserProfilePage;
