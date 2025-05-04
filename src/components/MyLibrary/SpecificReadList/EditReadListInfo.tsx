import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReadList } from '@/types/ReadList';
import { SquarePen } from 'lucide-react';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, UPDATE_READ_LIST } from '@/constants/api';

interface EditReadListInfoProps {
  readListInfo: ReadList | null;
  fetchReadListInfo: () => Promise<void>;
}

const EditReadListInfo = ({
  readListInfo,
  fetchReadListInfo,
}: EditReadListInfoProps) => {
  const [title, setTitle] = useState(readListInfo?.read_list_title || '');
  const [description, setDescription] = useState(
    readListInfo?.read_list_description || ''
  );
  const [open, setOpen] = useState(false);

  const handleSaveChanges = async () => {
    const token = Cookies.get('token');
    const data = {
      readListTitle: title,
      readListDescription: description,
    };

    try {
      const response = await axios.put(
        generateApi(UPDATE_READ_LIST, readListInfo?.read_list_id),
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        console.log('Changes saved successfully');
        fetchReadListInfo();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setOpen(false);
      setTitle(readListInfo?.read_list_title || '');
      setDescription(readListInfo?.read_list_description || '');
    }
  };

  const handleToggleDialog = () => {
    setOpen((prev) => !prev);
    setTitle(readListInfo?.read_list_title || '');
    setDescription(readListInfo?.read_list_description || '');
  };
  return (
    <Dialog open={open} onOpenChange={handleToggleDialog}>
      <DialogTrigger asChild>
        <button className="w-[120px] md:w-[150px] px-2 py-1 bg-foreground text-background hover:opacity-80 rounded-md text-sm md:text-base flex justify-between items-center">
          <span>Edit Info</span>
          <SquarePen className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-left">
            Edit Read List Info
          </DialogTitle>
          <DialogDescription className="hidden">
            <p className="text-sm text-muted-foreground">
              You can edit the title and description of your read list here.
            </p>
          </DialogDescription>
          <div className="flex flex-col items-center gap-2">
            <input
              type="text"
              id="readListTitle"
              defaultValue={readListInfo?.read_list_title}
              className="px-2 py-1 rounded-md border border-accent w-full"
              placeholder="Read List Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              defaultValue={readListInfo?.read_list_description}
              className="px-2 py-1 rounded-md border border-accent w-full"
              placeholder="Read List Description"
              value={description}
              maxLength={255}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              className="px-3 py-2 bg-rainbow rounded-md hover:opacity-80 w-[150px] mt-3"
              type="button"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditReadListInfo;
