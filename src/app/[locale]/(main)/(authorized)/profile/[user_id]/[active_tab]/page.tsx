import Profile from '@/components/Profile/Profile';
import React from 'react';

const UserProfilePage = async ({
  params,
}: {
  params: { user_id: string; active_tab: string };
}) => {
  const { user_id, active_tab } = params;
  return <Profile userId={user_id} activeTab={active_tab} />;
};

export default UserProfilePage;
