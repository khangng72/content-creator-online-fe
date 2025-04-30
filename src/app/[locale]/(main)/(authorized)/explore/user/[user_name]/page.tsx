import SearchOption from '@/components/Explore/SearchOption';

const SearchByUserPage = async ({
  params,
}: {
  params: Promise<{ user_name: string }>;
}) => {
  const { user_name } = await params;

  return (
    <div className="pt-[60px] flex flex-col items-center">
      <SearchOption searchOption="user" searchQuery={user_name} />
    </div>
  );
};

export default SearchByUserPage;
