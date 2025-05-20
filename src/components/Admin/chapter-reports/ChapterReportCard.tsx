import React from 'react';
import ChapterReportStatus from './ChapterReportStatus';

interface ChapterReportCardProps {
  status?: string;
}

const ChapterReportCard = ({ status = 'resolved' }: ChapterReportCardProps) => {
  return (
    <div className="bg-card px-3 flex justify-between items-center py-3 rounded-md ">
      <div className="flex flex-col gap-2 text-sm md:text-base max-w-[50%] sm:max-w-[70%]">
        <div>
          <span className="font-extrabold">Report Id: </span>
          <span>b2d6e3c1-2b4e-4fe2-ae9f-8f4a3e79a6c3</span>
        </div>
        <div>
          <span className="font-extrabold">Chapter: </span>
          <span>this is a chapter title</span>
        </div>
        <div className="text-muted-foreground">
          <span className="font-extrabold">Story: </span>
          <span>This is a story title</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <ChapterReportStatus status={status} />
        <button className="px-3 py-1 bg-purpleRainbow rounded-md">View</button>
      </div>
    </div>
  );
};

export default ChapterReportCard;
