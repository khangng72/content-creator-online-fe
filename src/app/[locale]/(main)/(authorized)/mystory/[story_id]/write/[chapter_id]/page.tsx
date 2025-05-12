import Write from '@/components/MyStory/write/Write';

const WritePage = ({
  params,
}: {
  params: { story_id: string; chapter_id: string };
}) => {
  const { story_id, chapter_id } = params;

  return <Write storyId={story_id} chapterId={chapter_id} />;
};

export default WritePage;
