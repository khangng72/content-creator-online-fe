import { AlertCircle, CircleCheck } from 'lucide-react';
import React from 'react';

interface ChapterReportStatusProps {
  status: string;
}
const ChapterReportStatus = ({ status }: ChapterReportStatusProps) => {
  console.log('status', status);
  if (status === 'resolved') {
    return (
      <div className="bg-green-600 px-3 py-1 rounded-md font-semibold flex gap-1 items-center justify-center text-sm">
        <CircleCheck className="w-4 h-4" />
        <span>Resolved</span>
      </div>
    );
  }

  return (
    <div className="bg-red-500 px-3 py-1 rounded-md font-semibold flex gap-1 items-center justify-center text-sm">
      <AlertCircle className="w-4 h-4" />
      <span>Unresolved</span>
    </div>
  );
};

export default ChapterReportStatus;
