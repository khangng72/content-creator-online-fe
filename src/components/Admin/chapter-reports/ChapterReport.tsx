'use client';

import React, { useEffect, useState } from 'react';
import ChapterReportCard from './ChapterReportCard';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, GET_REPORT_PAGINATION } from '@/constants/api';
import { Logger } from '@/utils/Logger';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Report } from '@/types/Report';
import NewestOrOldest from './NewestOrOldest';
import Filter from './Filter';

const ChapterReport = () => {
  const [mounted, setMounted] = useState(false);
  const [resolveState, setResolveState] = useState<
    'all' | 'resolved' | 'unresolved'
  >('all');
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');

  const fetchReports = async ({ pageParam }: { pageParam: number }) => {
    const token = Cookies.get('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(
        generateApi(
          GET_REPORT_PAGINATION,
          '',
          `page=${pageParam}&size=10&resolveState=${resolveState}&direction=${sort}`
        ),
        {
          headers,
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        Logger.error('Error fetching reports:', 'client');
        throw new Error(`Error fetching reports: ${error.message}`);
      } else {
        Logger.error('Unexpected error when getting reports:', 'client');
        throw new Error('Unexpected error occurred');
      }
    }
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['reports'],
    queryFn: fetchReports,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length : undefined;
      return nextPage;
    },
  });

  const reports = data?.pages.flatMap((page) => page) || [];

  useEffect(() => {
    refetch();
  }, [refetch, resolveState, sort]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pt-[100px]">
      <div className="w-full flex items-center justify-center">
        <h1 className="text-2xl font-bold">Chapter Reports</h1>
      </div>

      <div className="w-full justify-center flex gap-2 mt-3">
        <NewestOrOldest sort={sort} setSort={setSort} />
        <Filter resolveState={resolveState} setResolveState={setResolveState} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:w-[80%] w-[98%] mx-auto mt-5">
        {isLoading && (
          <div className="w-full flex justify-center">
            <p className="text-lg">Loading...</p>
          </div>
        )}
        {!isLoading && reports.length === 0 && (
          <div className="w-full flex justify-center">
            <p className="text-lg">No reports found</p>
          </div>
        )}

        {reports.map((report: Report, index) => (
          <ChapterReportCard key={index} report={report} />
        ))}
      </div>

      <div className="w-full flex justify-center">
        {hasNextPage && reports.length >= 10 && (
          <button
            className="bg-purpleRainbow text-white px-4 py-2 rounded-md mt-5 mx-auto"
            onClick={() => {
              fetchNextPage();
            }}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChapterReport;
