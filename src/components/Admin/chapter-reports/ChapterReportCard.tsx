'use client';
import React, { useCallback, useEffect, useState } from 'react';
import ChapterReportStatus from './ChapterReportStatus';
import { Report } from '@/types/Report';

import Cookies from 'js-cookie';
import axios from 'axios';
import {
  generateApi,
  GET_CHAPTER_BY_ID,
  RESOLVE_CHAPTER,
} from '@/constants/api';
import { Chapter } from '@/types/Chapter';
import { formatTimestamp } from '@/utils/FormatTimestamp';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import DOMPurify from 'dompurify';
import StoriImage from '@/components/ui/StoriImage';
import { toast } from '@/hooks/use-toast';

interface ChapterReportCardProps {
  report: Report;
}

const ChapterReportCard = ({ report }: ChapterReportCardProps) => {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [status, setStatus] = useState<'unresolved' | 'resolved'>(
    report.resolveState as 'unresolved' | 'resolved'
  );

  const fetchChapter = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(
        generateApi(GET_CHAPTER_BY_ID, report.chapterId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const chapterData: Chapter = response.data;
        setChapter(chapterData);
      } else {
        console.error('Error fetching chapter:', response.statusText);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching story:', error.message);
      } else {
        console.error('Unexpected error when getting story');
      }
    }
  }, [report.chapterId]);

  const resolveChapter = async (isBanned: boolean) => {
    const token = Cookies.get('token');

    try {
      const response = await axios.put(
        generateApi(RESOLVE_CHAPTER, report.chapterId),
        {
          userReportId: report.userId,
          isBanned: isBanned,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setStatus('resolved');
        toast({
          title: 'Resolve report successfully',
          description: 'The chapter report has been resolved',
          duration: 2000,
        });
      } else {
        console.error('Error banning chapter:', response.statusText);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error banning chapter:', error.message);
      } else {
        console.error('Unexpected error when banning chapter');
      }
    }
  };

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);
  return (
    <div className="bg-card px-3 flex justify-between items-center py-3 rounded-md ">
      <div className="flex flex-col gap-2 text-sm md:text-base max-w-[50%] sm:max-w-[70%]">
        <div>
          <span className="font-extrabold">Chapter: </span>
          <span>{chapter?.chapterTitle}</span>
        </div>
        <div className="text-muted-foreground">
          <span className="font-extrabold">Story: </span>
          <span>{chapter?.storyTitle}</span>
        </div>

        <div className="text-muted-foreground">
          <span className="font-extrabold">Created on: </span>
          <span>{formatTimestamp(report.reportDate)}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <ChapterReportStatus status={status} />

        <Dialog>
          <DialogTrigger>
            <div className="px-3 py-1 bg-purpleRainbow rounded-md hover:opacity-90">
              View
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resolve chapter {chapter?.chapterTitle}</DialogTitle>
              <DialogDescription>Story {chapter?.storyTitle}</DialogDescription>
              {chapter?.isBanned && (
                <div className="text-red-500 font-bold">Banned</div>
              )}
            </DialogHeader>

            <div className="w-full max-h-[60vh] overflow-y-auto flex flex-col items-start gap-2 scroll-container">
              {chapter?.chapterImageUri && (
                <div className="font-bold text-lg text-purpleRainbow">
                  Image
                </div>
              )}

              {chapter?.chapterImageUri && (
                <StoriImage
                  source={chapter?.chapterImageUri}
                  storyTitle="img for chapter"
                  className="w-[300px] h-[200px] object-cover rounded-md"
                />
              )}
              <div className="font-bold text-lg text-purpleRainbow">
                Content
              </div>
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(chapter?.chapterContent || ''),
                }}
              ></div>
            </div>

            <div>
              <span className="font-bold text-purpleRainbow">
                Report Reason
              </span>

              <div className="text-sm">{report.reason}</div>
            </div>

            {report.resolveState == 'unresolved' && (
              <div className="flex gap-2">
                <button className="bg-accent px-3 py-1 rounded-md active:scale-95">
                  Later
                </button>
                <button
                  className="bg-red-500 px-3 py-1 rounded-md active:scale-95"
                  onClick={() => {
                    resolveChapter(true);
                  }}
                >
                  Ban
                </button>
                <button
                  className="bg-purpleRainbow px-3 py-1 rounded-md active:scale-95"
                  onClick={() => {
                    resolveChapter(false);
                  }}
                >
                  Mark as Resolved
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChapterReportCard;
