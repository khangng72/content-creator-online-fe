'use client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Library } from 'lucide-react';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, UNPUBLISH_STORY } from '@/constants/api';

interface UnpublishStoryBtnProps {
  storyId: string;
  fetchPublishedStories: () => Promise<void>;
}

const UnpublishStoryBtn = ({
  storyId,
  fetchPublishedStories,
}: UnpublishStoryBtnProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleUnpublishStory = async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.put(
        generateApi(UNPUBLISH_STORY, storyId),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Story unpublished successfully.',
        });
        fetchPublishedStories();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to unpublish story.',
        });
        console.error('Failed to unpublish story');
      }
    } catch (error) {
      console.error('Error unpublishing story:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="flex gap-1 text-xs sm:text-sm text-muted-foreground hover:underline items-center">
          <Library className="w-5 h-5 text-muted-foreground" />
          <span>Unpublish</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm sm:text-base">
            Unpublish Story
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Are you sure you want to unpublish this story? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleUnpublishStory}>
            Accept
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnpublishStoryBtn;
