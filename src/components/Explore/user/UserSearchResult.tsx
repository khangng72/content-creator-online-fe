import React from 'react';
import UserSearchCardLists from './UserSearchCardLists';

interface UserSearchResultProps {
  searchQuery: string;
}

const UserSearchResult = ({ searchQuery }: UserSearchResultProps) => {
  return (
    <div className="w-full lg:w-[90vw flex flex-col items-center mt-[10px]">
      <h2 className="text-3xl font-semibold italic">"{searchQuery}"</h2>

      <UserSearchCardLists />
    </div>
  );
};

export default UserSearchResult;
