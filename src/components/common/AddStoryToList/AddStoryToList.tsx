'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { ReadList } from '@/types/ReadList';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  ADD_STORY_TO_MANY_READ_LIST,
  CREATE_READING_LIST,
  generateApi,
  GET_READING_LIST_BY_CURRENT_USER,
} from '@/constants/api';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SuccessToast from './SuccessToast';
import ErrorToast from './ErrorToast';

interface AddStoryToListProps {
  children: React.ReactNode;
  storyId: string;
}

const AddStoryToList = ({ children, storyId }: AddStoryToListProps) => {
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [readLists, setReadLists] = useState<ReadList[]>([]);
  const [showAddNewList, setShowAddNewList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const fetchReadLists = useCallback(async () => {
    const token = Cookies.get('token');

    try {
      const response = await axios.get(
        generateApi(GET_READING_LIST_BY_CURRENT_USER),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setReadLists(response.data.result);
        setSelectedListIds(
          response.data.result
            .filter((list: ReadList) => list.story_ids.includes(storyId))
            .map((list: ReadList) => list.read_list_id)
        );
      } else {
        setError(true);
        console.error('Error fetching reading lists:', response.statusText);
      }
    } catch (error) {
      setError(true);
      console.error('Error fetching reading lists:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storyId]);

  const handleSelectList = (listId: string) => {
    if (selectedListIds && selectedListIds.includes(listId)) {
      setSelectedListIds((prev) => prev.filter((id) => id !== listId));
      return;
    }
    setSelectedListIds((prev) =>
      prev.includes(listId) ? prev : [...prev, listId]
    );
  };

  const saveStoryToReadList = async (read_list_ids: string[]) => {
    const token = Cookies.get('token');

    try {
      const response = await axios.post(
        generateApi(ADD_STORY_TO_MANY_READ_LIST, storyId),
        {
          read_list_ids,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        console.error('Error saving story to read list:', response.statusText);
        return;
      }

      toast({
        description: <SuccessToast />,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving story to read list:', error);
      toast({
        description: <ErrorToast />,
        duration: 2000,
      });
    }
  };

  const handleToggleDialog = () => {
    setOpen((prev) => !prev);
    fetchReadLists();
    setShowAddNewList(false);
    setNewListName('');
  };

  const handleCreateNewReadList = async () => {
    if (!newListName) {
      setShowAddNewList(false);
      return;
    }

    const token = Cookies.get('token');
    try {
      const requestBody = {
        readListTitle: newListName,
        readListDescription: '',
      };
      const response = await axios.post(
        generateApi(CREATE_READING_LIST),
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200) {
        console.error('Error creating new read list:', response.statusText);
        return;
      }

      const readList_list = [
        ...selectedListIds,
        response.data.result.read_list_id,
      ];

      saveStoryToReadList(readList_list);
    } catch (error) {
      toast({
        description: <ErrorToast />,
        duration: 2000,
      });
      console.error('Error creating new read list:', error);
    } finally {
      handleToggleDialog();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchReadLists();
  }, [fetchReadLists]);

  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleToggleDialog}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="font-bold text-xl">Add to list</DialogTitle>
            <DialogDescription className="hidden">
              Add story to list
            </DialogDescription>
          </DialogHeader>
          <span className="text-red-500 font-bold w-full text-center">
            Loading Read List Failed
          </span>
        </DialogContent>
      </Dialog>
    );
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={handleToggleDialog}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="text-center">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="font-bold text-xl">Add to list</DialogTitle>
            <DialogDescription className="hidden">
              Add story to list
            </DialogDescription>
          </DialogHeader>
          Loading Read List...
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleToggleDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="font-bold text-xl">Add to list</DialogTitle>
          <DialogDescription className="hidden">
            Add story to list
          </DialogDescription>
        </DialogHeader>
        {readLists && readLists.length > 0 && (
          <ul className="flex flex-col w-full gap-2 max-h-[60vh] overflow-y-auto">
            {readLists.map((list) => (
              <li
                className="flex justify-between items-center gap-2 py-2 hover:cursor-pointer hover:bg-accent px-3 rounded-md"
                key={list.read_list_id}
                onClick={() => handleSelectList(list.read_list_id)}
              >
                <span className="font-semibold">{list.read_list_title}</span>
                <div className="w-6 h-6 rounded-full border-2 border-foreground flex items-center justify-center">
                  {selectedListIds.includes(list.read_list_id) && (
                    <div className="w-3 h-3 rounded-full bg-rainbow"></div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="w-full px-3 py-1 border-y-[1px] border-accent">
          {!showAddNewList && (
            <button
              className="p-2 flex gap-3 items-center hover:bg-accent rounded-md w-full"
              onClick={() => setShowAddNewList(true)}
            >
              <div className="p-2 bg-card">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="font-semibold">Add New ReadList</span>
            </button>
          )}

          {showAddNewList && (
            <div className="flex flex-col gap-2 items-end">
              <input
                type="text"
                placeholder="Enter new read list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="border-2 border-accent rounded-md p-2 w-full text-sm focus:outline-none"
              />
              <div className="flex gap-2 text-sm">
                <button
                  className="text-sm px-2 py-1 bg-accent rounded-md hover:opacity-80"
                  onClick={() => setShowAddNewList(false)}
                >
                  Cancel
                </button>
                <button
                  className="text-sm px-2 py-1 bg-[#8b5cf6] rounded-md hover:opacity-80"
                  onClick={handleCreateNewReadList}
                >
                  Create
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex justify-end">
          <button
            className="bg-[#8b5cf6] rounded-md px-3 py-2 hover:opacity-80 text-sm"
            type="button"
            onClick={() => {
              saveStoryToReadList(selectedListIds);
              handleToggleDialog();
            }}
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStoryToList;
