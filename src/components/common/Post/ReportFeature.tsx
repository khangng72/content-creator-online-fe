'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { CREATE_REPORT, generateApi } from '@/constants/api';
import axios from 'axios';

interface ReportFeatureProps {
  children: React.ReactNode;
  chapterId: string;
  checkIfUserReported: () => Promise<void>;
}

const policies = [
  'Hate Speech, harassment, or bullying',
  'Threats of violence or inciting violence',
  'Child sexual exploitation or abuse',
  'Plagiarism or copyright infringement',
  'Spam or misleading content',
  'Impersonation or misrepresentation',
  'Content that is reactionary against the Socialist Republic of Vietnam',
];

const ReportFeature = ({
  children,
  chapterId,
  checkIfUserReported,
}: ReportFeatureProps) => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
  const [moreDetails, setMoreDetails] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleReport = async () => {
    if (selectedPolicyId === null && moreDetails === '') {
      toast({
        title: 'Please select a policy or provide more details.',
        variant: 'default',
        duration: 2000,
      });
      return;
    }

    const token = Cookies.get('token');

    try {
      const reason =
        selectedPolicyId !== null ? policies[selectedPolicyId] : '';
      const response = await axios.post(
        generateApi(CREATE_REPORT),
        {
          chapterId: chapterId, // Replace with actual chapter ID
          reason: reason + ', ' + moreDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast({
          title: 'Chapter reported successfully.',
          variant: 'default',
          duration: 2000,
        });
        setSelectedPolicyId(null);
        setMoreDetails('');
        checkIfUserReported();
      } else {
        toast({
          title: 'Failed to report the chapter.',
          variant: 'destructive',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error reporting the chapter:', error);
      toast({
        title: 'Error reporting the chapter.',
        variant: 'destructive',
        duration: 2000,
      });
      return;
    } finally {
      setOpenDialog(false);
      setSelectedPolicyId(null);
      setMoreDetails('');
    }
  };

  const handleSelectPolicy = (index: number) => {
    if (index === selectedPolicyId) {
      setSelectedPolicyId(null);
      return;
    }
    setSelectedPolicyId(index);
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this chapter</DialogTitle>
          <DialogDescription>
            If you think this chapter is inappropriate, please let us know.
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col w-full gap-2 max-h-[40vh] overflow-y-auto text-sm">
          {policies.map((policy, index) => (
            <li
              className="flex justify-between items-center gap-2 py-2 hover:cursor-pointer hover:bg-accent px-3 rounded-md"
              key={index}
              onClick={() => {
                handleSelectPolicy(index);
              }}
            >
              <span className="font-semibold max-w-[80%]">{policy}</span>
              <div className="w-6 h-6 rounded-full border-2 border-foreground flex items-center justify-center">
                {selectedPolicyId == index && (
                  <div className="w-3 h-3 rounded-full bg-rainbow"></div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <textarea
          className=" rounded-md w-full mt-2 resize-none focus:outline-none py-2 px-3 text-sm"
          rows={3}
          placeholder="Please provide more details about the issue if possible."
          onChange={(e) => {
            setMoreDetails(e.target.value);
          }}
          value={moreDetails}
        />

        <button
          className="w-[200px] py-1 bg-purpleRainbow rounded-md m-auto hover:opacity-80"
          onClick={handleReport}
        >
          Report
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default ReportFeature;
