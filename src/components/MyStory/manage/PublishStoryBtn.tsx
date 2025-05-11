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
import { Rocket } from 'lucide-react';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, PUBLISH_STORY } from '@/constants/api';

interface UnpublishStoryBtnProps {
  storyId: string;
  fetchStories: () => Promise<void>;
  fetchPublishedInfo: () => Promise<void>;
}

const PublishStoryBtn = ({
  storyId,
  fetchStories,
  fetchPublishedInfo,
}: UnpublishStoryBtnProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handlePublishStory = async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.put(
        generateApi(PUBLISH_STORY, storyId),
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
          description: 'Story is published successfully.',
        });
        fetchStories();
        fetchPublishedInfo();
        setOpen(false);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to publish story.',
        });
        console.error('Failed to publish story');
      }
    } catch (error) {
      console.error('Error publishing story:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="flex gap-1 text-xs sm:text-sm hover:underline items-center text-purpleRainbow font-bold">
          <Rocket className="w-5 h-5" />
          <span>Publish All</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm sm:text-base">
            Publish Story
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Are you sure you want to publish this story? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="default" onClick={handlePublishStory}>
            Accept
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublishStoryBtn;
