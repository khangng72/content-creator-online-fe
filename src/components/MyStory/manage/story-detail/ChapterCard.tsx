import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link } from '@/i18n/routing';
import { Chapter } from '@/types/Chapter';
import { formatTimestamp } from '@/utils/FormatTimestamp';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import {
  Ellipsis,
  Heart,
  MessageCircle,
  PenBoxIcon,
  Trash,
} from 'lucide-react';
import React from 'react';
import Cookies from 'js-cookie';
import { DELETE_CHAPTER_BY_ID, generateApi } from '@/constants/api';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

interface ChapterCardProps {
  chapter: Chapter;
  fetchChapters: () => Promise<void>;
}

const ChapterCard = ({ chapter, fetchChapters }: ChapterCardProps) => {
  const handleDeleteChapter = async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.delete(
        generateApi(DELETE_CHAPTER_BY_ID, chapter.chapterId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Handle successful deletion (e.g., show a success message, refresh the chapter list)
        console.log('Chapter deleted successfully');
        fetchChapters();
        toast({
          title: 'Chapter deleted successfully',
          description: 'The chapter has been deleted.',
          variant: 'default',
        });
      } else {
        // Handle error response
        console.log('Error deleting chapter');
        toast({
          title: 'Error deleting chapter',
          description: 'An error occurred while deleting the chapter.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.log('Error', error);
      toast({
        title: 'Error deleting chapter',
        description: 'An error occurred while deleting the chapter.',
        variant: 'destructive',
      });
    }
  };
  return (
    <div className="border-b border-accent px-4 py-3 flex justify-between">
      <div className="flex flex-col gap-2 max-w-[90%]">
        <span className="font-semibold text-lg">{chapter.chapterTitle}</span>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex flex-col gap-1">
            {chapter.isPublished ? (
              <span className="text-purpleRainbow font-semibold">
                Published
              </span>
            ) : (
              <span className="text-muted-foreground">Draft</span>
            )}
            <span>
              <span className="text-muted-foreground">Created at</span>{' '}
              {formatTimestamp(chapter.createdTime)}
            </span>

            <span>
              <span className="text-muted-foreground">Updated at</span>{' '}
              {formatTimestamp(chapter.updatedTime)}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex gap-1 items-center">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {chapter.numberOfComments}
              </span>
            </div>

            <div className="flex gap-1 items-center">
              <Heart className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {chapter.numberOfLikes}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1 rounded-md border-2 border-accent text-muted-foreground hover:bg-accent transition-all duration-200 ease-in-out active:scale-95">
              <Ellipsis className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-48 text-sm flex flex-col gap-3 items-start"
            align="end"
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="hover:underline flex gap-1 items-center">
                  <Trash className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Chapter</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure want to delete this chapter? This action cannot
                    be undone, your data will be deleted permanently from our
                    server
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <DialogFooter className="flex gap-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteChapter}>
                    Accept
                  </AlertDialogAction>
                </DialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Link href="#" className="hover:underline flex gap-1 items-center">
              <PenBoxIcon className="w-4 h-4" />
              <span>Continue Writing</span>
            </Link>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ChapterCard;
