export interface Comment {
  commentId: string;
  comment_content: string;
  createdTime: string;
  numberOfLikes: number;
  isPinned: boolean;

  chapterId: string;

  userId: string;
  userFirstName: string;
  userLastName: string;
  userAvatarUrl: string;
}
