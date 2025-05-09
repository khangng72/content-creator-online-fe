export interface Chapter {
  chapterId: string;
  chapterTitle: string;
  chapterDescription: string;
  chapterContent: string;

  chapterNumber: number;
  chapterCreatedTime: string;
  numberOfLikes: number;
  numberOfComments: number;
  nextChapterId: string;

  storyTitle: string;
}
