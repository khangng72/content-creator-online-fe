import { Genre } from './Genre';

export interface CurrentRead {
  storyId: string;
  storyTitle: string;
  storyDescription: string;
  coverImageUri: string;
  userPost: string;
  userId: string;
  numberOfViews: number;
  numberOfChapters: number;
  averageRating: number;
  genres: Genre[];
  currentChapterId: string;
}
