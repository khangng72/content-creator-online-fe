export const generateApi = (
  apiUrl: string,
  pathParam: string = '',
  queryParam: string = ''
) => {
  return (
    process.env.NEXT_PUBLIC_API_DOMAIN +
    apiUrl +
    (pathParam ? `/${pathParam}` : '') +
    (queryParam ? `?${queryParam}` : '')
  );
};

// Auth
export const API_AUTH_LOGIN = '/auth/login';

// Genre
export const GET_ALL_GENRES = '/genre/all';
export const GET_GENRE_BY_ID = '/genre';

// Story
export const CREATE_STORY = '/story';
export const UPDATE_STORY_GENRE = '/story/updateGenre';
export const GET_STORY_BY_USERID = '/story/post';
export const GET_STORY_BY_ID = '/story';
export const GET_LATEST_STORY_BY_USERID = '/story/post/latest';
export const GET_STORY_BY_GENREID = '/story/genre';
export const SEARCH_STORY = '/story/search';
export const GET_BASIC_INFO_STORY = '/story/basicInfo';

// Chapter
export const CREATE_NEW_CHAPTER_STORY = '/chapter/new';
export const GET_LATEST_CHAPTER_PAGED = '/chapter/latest';
export const GET_BASIC_CHAPTERS_INFO_BY_STORY_ID = '/chapter/story';

// User
export const REGISTER = '/user/register';
export const GET_USER = '/user/profile';
export const GET_FOLLOWERS_BY_USERID = '/user/followers';
export const GET_FOLLOWING_BY_USERID = '/user/following';
export const SEARCH_USER = '/user/search';

// Comment
export const GET_COMMENT_PAGED = '/comment/chapter';
export const POST_COMMENT = '/comment/chapter';

// Reading List
export const GET_READING_LIST_BY_CURRENT_USER = '/read_list/current_user';
export const GET_TOP_STORY_BY_READING_LIST_ID = '/read_list/top_stories';
export const DELETE_READING_LIST_BY_ID = '/read_list';
