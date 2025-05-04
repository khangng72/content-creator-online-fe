import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { CREATE_READING_LIST, generateApi } from '@/constants/api';
import { useToast } from '@/hooks/use-toast';

interface CreateNewReadListProps {
  fetchReadLists: () => Promise<void>;
}

const CreateNewReadList = ({ fetchReadLists }: CreateNewReadListProps) => {
  const [open, setOpen] = useState(false);
  const [readListTitle, setReadListTitle] = useState('');
  const [readListDescription, setReadListDescription] = useState('');
  const { toast } = useToast();

  const handleCreateNewReadList = async () => {
    if (!readListTitle) {
      setOpen(false);
      return;
    }

    const token = Cookies.get('token');
    const data = {
      readListTitle,
      readListDescription,
    };

    const response = await axios.post(generateApi(CREATE_READING_LIST), data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      setOpen(false);
      setReadListTitle('');
      setReadListDescription('');
      fetchReadLists();

      toast({
        duration: 2000,
        title: 'Create new Read List successfully',
      });
    } else {
      console.error('Error creating reading list');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-rainbow px-3 py-2 text-sm flex gap-2 rounded-md mb-5 active:scale-95 transition-all duration-200">
          <span>New Reading List</span>
          <PlusIcon className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Read List</DialogTitle>
          <DialogDescription className="hidden">
            Create new Read List
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 items-center">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="readListTitle" className="text-sm font-semibold">
              Read List Title
            </label>
            <input
              type="text"
              value={readListTitle}
              onChange={(e) => setReadListTitle(e.target.value)}
              id="readListTitle"
              placeholder="Enter Read List Title"
              className="text-xs border border-accent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-rainbow"
            />

            <label
              htmlFor="readListDescription"
              className="text-sm font-semibold"
            >
              Read List Description
            </label>
            <input
              type="text"
              id="readListDescription"
              value={readListDescription}
              onChange={(e) => setReadListDescription(e.target.value)}
              placeholder="Enter Read List Description"
              className="text-xs border border-accent rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-rainbow"
            />
          </div>
          <button
            className="bg-rainbow px-3 py-2 text-sm rounded-md active:scale-95 transition-all duration-200 w-[200px]"
            type="button"
            onClick={handleCreateNewReadList}
          >
            Create
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewReadList;
