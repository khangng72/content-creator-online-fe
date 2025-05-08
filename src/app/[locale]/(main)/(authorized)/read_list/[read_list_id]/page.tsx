import SpecificReadList from '@/components/ReadList/SpecificReadList';
import React from 'react';

const ReadListPage = async ({
  params,
}: {
  params: Promise<{ read_list_id: string }>;
}) => {
  const { read_list_id } = await params;
  return <SpecificReadList readListId={read_list_id} />;
};

export default ReadListPage;
