import { useEffect, useRef, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@/i18n/routing';
import {
  ChevronDown,
  CircleEllipsis,
  Heart,
  Link2,
  MessageCircle,
} from 'lucide-react';

import StarsDialog from './StarsDialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { Post } from '@/types/Post';
import { formatTimestamp } from '@/utils/FormatTimestamp';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, GET_COMMENT_PAGED } from '@/constants/api';
import { delay } from '@/utils/Delay';
import { Logger } from '@/utils/Logger';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Comment } from '@/types/Comment';
import CommentSecSkeleton from './CommentSecSkeleton';
import CommentInput from './CommentInput';
import DOMPurify from 'dompurify';
import CommentCard from '../Chapter/read/CommentCard';

interface StoryPostDialogProps {
  post: Post;
  openDialog: boolean;
  setTotalComment: React.Dispatch<React.SetStateAction<number>>;
  totalComment: number;
}

const StoryPostDialog = ({
  post,
  openDialog,
  setTotalComment,
  totalComment,
}: StoryPostDialogProps) => {
  const [starred, setStarred] = useState(false);
  const [addedComment, setAddedComment] = useState<Comment[]>([]);

  const latestAddedCommentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (latestAddedCommentRef.current) {
      latestAddedCommentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [addedComment]);

  const fetchComments = async ({ pageParam }: { pageParam: number }) => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(
        generateApi(
          GET_COMMENT_PAGED,
          `${post.chapterId}`,
          `page=${pageParam}&size=10`
        ),
        {
          headers,
        }
      );

      // delay for testing
      await delay();

      return response.data.result;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Logger.error('Error fetching comments:', 'client');
        throw new Error(`Error fetching comments: ${error.message}`);
      } else {
        Logger.error('Unexpected error:', 'client');
        throw new Error('Unexpected error occurred');
      }
    }
  };

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [`comments_${post.chapterId}`],
      queryFn: fetchComments,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage.length ? allPages.length : undefined;
        return nextPage;
      },
      enabled: openDialog,
      staleTime: 1000 * 60 * 5,
    });

  const comments = data?.pages.map((page) =>
    page.map((comment: Comment) => {
      return (
        <CommentCard
          key={comment.commentId}
          comment={comment}
          className="bg-secondary"
        />
      );
    })
  );

  return (
    <DialogContent className="max-w-[97vw] sm:max-w-[90vw] lg:max-w-[70vw] xl:max-w-[60vw] 2xl:max-w-[40vw] bg-card px-0 pt-3 rounded-md gap-0">
      <DialogHeader className="border-b border-background px-4 pb-2">
        <DialogTitle className="text-center text-md flex flex-col">
          <span className="font-bold text-2xl">{post.storyTitle}</span>
          <span className="font-medium">{post.chapterTitle}</span>
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground text-xs">
          Posted by {post.userFirstName} {post.userLastName}
        </DialogDescription>
      </DialogHeader>

      <div className="overflow-auto max-h-[60vh] block px-4 scroll-container pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-[35px] h-[35px]">
              <AvatarImage src={post.userAvatarUrl} alt="user avatar" />
              <AvatarFallback>
                {post.userFirstName.charAt(0)}
                {post.userLastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <h1 className="text-sm font-semibold">
                <Link href="#" className="hover:underline">
                  {post.userFirstName} {post.userLastName}
                </Link>
              </h1>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(post.chapterCreatedTime)}
              </span>
            </div>
          </div>

          <div>
            <CircleEllipsis
              className="text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-200 ease-in-out"
              size={22}
            />
          </div>
        </div>

        <div className="w-full block mt-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Story: {post.storyTitle}</h2>

            <Link href="#" className="hover:underline">
              <h3 className="text-xl font-semibold">
                Chapter {post.chapterNumber}: {post.chapterTitle}
              </h3>
            </Link>
          </div>

          <div className="mt-4">
            <div
              className="text-sm space-y-2"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.chapterContent),
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between mt-5">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="flex items-center gap-2 bg-secondary rounded-md px-2 py-1 active:scale-95"
                  type="button"
                >
                  <span className="text-muted-foreground">21</span>
                  <Heart
                    className="text-purpleRainbow fill-purpleRainbow"
                    size={16}
                  />
                </button>
              </DialogTrigger>

              <StarsDialog />
            </Dialog>
            <div className="text-muted-foreground">
              {totalComment || 0} comments
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 border-t border-b border-muted-foreground py-1 text-muted-foreground">
            <button
              className="flex justify-center items-center py-1 hover:bg-secondary w-full rounded-md hover:cursor-pointer gap-1"
              type="button"
              onClick={() => setStarred(!starred)}
            >
              {starred ? (
                <>
                  <Heart
                    className="text-purpleRainbow fill-purpleRainbow"
                    size={15}
                  />
                  <span className="text-purpleRainbow">Like</span>
                </>
              ) : (
                <>
                  <Heart size={15} />
                  <span>Like</span>
                </>
              )}
            </button>

            <button
              className="flex justify-center items-center py-1 hover:bg-secondary w-full rounded-md hover:cursor-pointer gap-1"
              type="button"
            >
              <MessageCircle size={15} />
              <span>Comment</span>
            </button>

            <div className="flex justify-center items-center py-1 hover:bg-secondary w-full rounded-md hover:cursor-pointer gap-1">
              <Link2 size={15} />
              <span>Copy</span>
            </div>
          </div>

          <div className="mt-2 block">
            {/* filter */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-muted-foreground font-bold flex items-center text-sm">
                    <span>Newest</span>
                    <ChevronDown strokeWidth={2} size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card rounded-md space-y-1">
                  <button className="flex flex-col hover:bg-secondary text-left rounded-md px-3 py-2 w-full">
                    <span className="text-sm">Newest</span>
                    <p className="text-xs text-muted-foreground">
                      Show all comments with the newest comments first.
                    </p>
                  </button>

                  <button className="flex flex-col hover:bg-secondary text-left rounded-md px-3 py-2 w-full">
                    <span className="text-sm">Top Rated</span>
                    <p className="text-xs text-muted-foreground">
                      Show comments with high rated first.
                    </p>
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* comment list */}
            <div className="mt-4 flex flex-col gap-7 pb-5 w-full">
              {/* New comment added by user will be shown first. */}
              {addedComment.map((comment, index) => (
                <CommentCard
                  key={comment.commentId}
                  comment={comment}
                  className="bg-secondary"
                  ref={
                    index === addedComment.length - 1
                      ? latestAddedCommentRef
                      : null
                  }
                />
              ))}

              {/* Comment list */}
              {comments}

              {(isLoading || isFetchingNextPage) && <CommentSecSkeleton />}

              {hasNextPage && !isLoading && (
                <button
                  onClick={() => {
                    fetchNextPage();
                  }}
                  disabled={!hasNextPage || isFetchingNextPage}
                  className="text-muted-foreground font-bold hover:underline hover:cursor-pointer"
                >
                  Show More
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="">
        <CommentInput
          chapterId={post.chapterId}
          setAddedComment={setAddedComment}
          setTotalComment={setTotalComment}
        />
      </DialogFooter>
    </DialogContent>
  );
};

export default StoryPostDialog;
