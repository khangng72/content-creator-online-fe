'use client';
import { Ref, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

import { Link } from '@/i18n/routing';
import { CircleEllipsis, Link2, MessageCircle, StarIcon } from 'lucide-react';
import { Dialog, DialogTrigger } from '../ui/dialog';
import StarsDialog from './StarsDialog';
import StoryPostDialog from './StoryPostDialog';
import { Post } from '@/types/Post';
import DOMPurify from 'dompurify';

import { formatTimestamp } from '@/utils/FormatTimestamp';

interface StoryPostProps {
  innerRef?: Ref<HTMLDivElement>;

  post: Post;
}

const WORDS_LIMIT = Number(process.env.NEXT_PUBLIC_WORDS_LIMIT) || 100;

const StoryPost = ({ innerRef, post }: StoryPostProps) => {
  const wordCount = post.chapterContent
    .replace(/\n/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = wordCount > WORDS_LIMIT;
  const [totalComment, setTotalComment] = useState<number>(
    post.numberOfComment
  );

  let rawText = post.chapterContent;

  if (!expanded && shouldTruncate) {
    const words = post.chapterContent.match(/\S+\s*/g) || [];
    rawText = words.slice(0, WORDS_LIMIT).join('') + '</p>';
  }

  const displayedText = DOMPurify.sanitize(rawText);

  const [starred, setStarred] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div
      className="bg-card w-full px-5 py-2 rounded-md block space-y-3"
      ref={innerRef}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-[35px] h-[35px]">
            <AvatarImage src={post.userAvatarUrl} alt="@shadcn" />
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

      <div className="w-full block">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">
            <Link href={`/stori/${post.storyId}`} className="hover:underline">
              Story: {post.storyTitle}
            </Link>
          </h2>

          <Link
            href={`/chapter/read/${post.chapterId}`}
            className="hover:underline"
          >
            <h3 className="text-xl font-semibold">
              Chapter {post.chapterNumber}: {post.chapterTitle}
            </h3>
          </Link>
        </div>

        <div className="mt-4">
          <div className="text-sm inline">
            <div
              className="inline space-y-3"
              dangerouslySetInnerHTML={{
                __html: displayedText,
              }}
            />
            {!expanded && shouldTruncate && (
              <>
                <span>... </span>
                <button
                  className="font-bold hover:underline inline"
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                >
                  See more
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-2 bg-secondary rounded-md px-2 py-1 active:scale-95"
                type="button"
              >
                <span className="text-muted-foreground">21</span>
                <StarIcon fill="#facc15" stroke="#facc15" size={16} />
              </button>
            </DialogTrigger>

            <StarsDialog />
          </Dialog>

          <div className="text-muted-foreground">
            {totalComment || 0} comments
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 border-t border-t-muted-foreground py-1 text-muted-foreground">
          <button
            className="flex justify-center items-center py-1 hover:bg-secondary w-full rounded-md hover:cursor-pointer gap-1"
            type="button"
            onClick={() => setStarred(!starred)}
          >
            {starred ? (
              <>
                <StarIcon fill="#facc15" stroke="#facc15" size={15} />
                <span className="text-[#facc15]">Star</span>
              </>
            ) : (
              <>
                <StarIcon size={15} />
                <span>Star</span>
              </>
            )}
          </button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <div className="flex justify-center items-center py-1 hover:bg-secondary w-full rounded-md hover:cursor-pointer gap-1">
                <MessageCircle size={15} />
                <span>Comment</span>
              </div>
            </DialogTrigger>
            <StoryPostDialog
              post={post}
              openDialog={openDialog}
              setTotalComment={setTotalComment}
              totalComment={totalComment}
            />
          </Dialog>
          <div className="flex justify-center items-center py-1 hover:bg-secondary w-full rounded-md hover:cursor-pointer gap-1">
            <Link2 size={15} />
            <span>Copy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPost;
