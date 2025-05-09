import React from 'react';

const UserProfilePage = async ({
  params,
}: {
  params: Promise<{ user_id: string; active_tab: string }>;
}) => {
  const { user_id, active_tab } = await params;
  return (
    <div className="pt-[100px]">
      {user_id} {active_tab}
    </div>
  );
};

export default UserProfilePage;
