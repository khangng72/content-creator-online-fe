import ChapterRead from '@/components/Chapter/read/ChapterRead';
import React from 'react';

const ReadChapterPage = async ({
  params,
}: {
  params: Promise<{ chapter_id: string }>;
}) => {
  const { chapter_id } = await params;

  return <ChapterRead chapterId={chapter_id} />;
};

export default ReadChapterPage;
