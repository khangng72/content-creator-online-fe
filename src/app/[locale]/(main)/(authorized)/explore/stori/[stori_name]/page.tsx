import SearchOption from '@/components/Explore/SearchOption';
import StorySearchResult from '@/components/Explore/stori/StorySearchResult';

const SearchByStoryPage = async ({
  params,
}: {
  params: Promise<{ stori_name: string }>;
}) => {
  const { stori_name } = await params;
  const decodedStoriName = decodeURIComponent(stori_name);
  const formattedStoriName = decodedStoriName.replace(/_/g, ' ');
  return (
    <div className="pt-[60px] flex flex-col items-center">
      <SearchOption searchOption="story" searchQuery={stori_name} />
      <StorySearchResult searchQuery={formattedStoriName} />
    </div>
  );
};

export default SearchByStoryPage;
