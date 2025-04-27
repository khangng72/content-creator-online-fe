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

// Story
export const CREATE_STORY = '/story';
export const UPDATE_STORY_GENRE = '/story/updateGenre';
export const GET_STORY_BY_USERID = '/story/post';
export const GET_STORY_BY_ID = '/story';
export const GET_LATEST_STORY_BY_USERID = '/story/post/latest';

// Chapter
export const CREATE_NEW_CHAPTER_STORY = '/chapter/new';
export const GET_LATEST_CHAPTER_PAGED = '/chapter/latest';

// User
export const REGISTER = '/user/register';
export const GET_USER = '/user/profile';
export const GET_FOLLOWERS_BY_USERID = '/user/followers';

// Comment
export const GET_COMMENT_PAGED = '/comment/chapter';
export const POST_COMMENT = '/comment/chapter';
