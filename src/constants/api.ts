export const generateApi = (
  apiUrl: string,
  pathParam: string = "",
  queryParam: string = ""
) => {
  return (
    process.env.NEXT_PUBLIC_API_DOMAIN +
    apiUrl +
    (pathParam ? `/${pathParam}` : "") +
    (queryParam ? `?${queryParam}` : "")
  );
};

// Auth
export const API_AUTH_LOGIN = "/auth/login";

// Genre
export const GET_ALL_GENRES = "/genre/all";

// Story
export const CREATE_STORY = "/story";
export const UPDATE_STORY_GENRE = "/story/updateGenre";

// Chapter
export const CREATE_NEW_CHAPTER_STORY = "/chapter/new";
export const GET_LATEST_CHAPTER_PAGED = "/chapter/latest";

// User 
export const REGISTER = "/user/register";
export const USER_PROFILE = "/user/profile";
