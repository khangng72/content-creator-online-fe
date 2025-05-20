import ChapterReportCard from '@/components/Admin/chapter-reports/ChapterReportCard';
import React from 'react';

const ChapterReportsPage = () => {
  return (
    <div className="pt-[100px]">
      <div className="w-full flex items-center justify-center">
        <h1 className="text-2xl font-bold">Chapter Reports</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:w-[80%] w-[98%] mx-auto mt-5">
        <ChapterReportCard />
        <ChapterReportCard />
      </div>
    </div>
  );
};

export default ChapterReportsPage;
