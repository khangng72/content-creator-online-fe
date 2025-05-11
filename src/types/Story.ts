import { Genre } from './Genre';

export interface BasicStoryInfo {
  storyId: string;
  storyTitle: string;
  storyDescription: string;
  coverImageUri: string;
  userPost: string;
  userId: string;
  numberOfViews: number;
  numberOfChapters: number;
  averageRating: number;
  updatedTime: string;
  createdTime: string;
  genres: Genre[];
}
