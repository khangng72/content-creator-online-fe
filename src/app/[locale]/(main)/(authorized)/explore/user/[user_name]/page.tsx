import SearchOption from '@/components/Explore/SearchOption';
import UserSearchResult from '@/components/Explore/user/UserSearchResult';

const SearchByUserPage = async ({
  params,
}: {
  params: Promise<{ user_name: string }>;
}) => {
  const { user_name } = await params;
  const decodedStoriName = decodeURIComponent(user_name);
  const formattedUserName = decodedStoriName.replace(/_/g, ' ');

  return (
    <div className="pt-[60px] flex flex-col items-center">
      <SearchOption searchOption="user" searchQuery={user_name} />
      <UserSearchResult searchQuery={formattedUserName} />
    </div>
  );
};

export default SearchByUserPage;
