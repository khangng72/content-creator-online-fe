import SpecificReadList from '@/components/MyLibrary/SpecificReadList/SpecificReadList';
import React from 'react';

const SpecificReadListPage = async ({
  params,
}: {
  params: Promise<{ read_list_id: string }>;
}) => {
  const { read_list_id } = await params;
  return <SpecificReadList readListId={read_list_id} />;
};

export default SpecificReadListPage;
