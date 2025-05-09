export interface Post {
  chapterId: string;
  chapterTitle: string;
  chapterContent: string;
  chapterNumber: number;
  chapterCreatedTime: string;

  storyTitle: string;
  storyId: string;

  userId: string;
  userFirstName: string;
  userLastName: string;
  userAvatarUrl: string;

  numberOfComment: number;
}
