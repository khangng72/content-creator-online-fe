export interface Chapter {
  chapterId: string;
  chapterTitle: string;
  chapterDescription: string;
  chapterContent: string;
  chapterImageUri: string;

  chapterNumber: number;
  createdTime: string;
  numberOfLikes: number;
  numberOfComments: number;
  nextChapterId: string;

  storyTitle: string;
  storyId: string;
}
