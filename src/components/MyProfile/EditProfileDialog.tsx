import React, { useEffect, useState } from 'react';
import { UserData } from '@/types/UserData';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NationalitySelector } from './NationalitySelector';
import { GenderSelector } from './GenderSelector';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { useToast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';
import axios from 'axios';
import { generateApi, UPDATE_USER } from '@/constants/api';

interface EditProfileDialogProps {
  userData: UserData | null;
  fetchUserData: () => Promise<void>;
}

const EditProfileDialog = ({
  userData,
  fetchUserData,
}: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');

  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Placeholder.configure({
        placeholder: 'Write your chapter here...',
      }),
    ],
    content: '<p></p>',
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class:
          'bg-card border border-accent p-2 rounded-md focus:outline-none text-sm',
      },
    },
  });

  const handleSaveUpdate = async () => {
    if (!firstName) {
      toast({
        title: 'Error',
        description: 'First name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!lastName) {
      toast({
        title: 'Error',
        description: 'Last name is required',
        variant: 'destructive',
      });
      return;
    }

    const token = Cookies.get('token');

    try {
      const updateData = {
        firstName,
        lastName,
        gender,
        nationality,
        birthday,
        introduction: editor?.getHTML(),
      };

      const response = await axios.put(
        generateApi(UPDATE_USER, userData?.id),
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
          variant: 'default',
        });
        fetchUserData();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (editor && userData?.introduction) {
      editor.commands.setContent(userData.introduction);
    }
  }, [editor, userData]);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setBirthday(userData.birthday);
      setGender(userData.gender);
      setNationality(userData.nationality);
    }

    if (editor && userData?.introduction) {
      editor.commands.setContent(userData.introduction);
    }
  }, [userData, open, editor]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-[100px] py-1 text-sm bg-card rounded-md active:scale-95">
          Edit Profile
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-md ">
        <DialogHeader>
          <DialogTitle className="font-extrabold bg-rainbow text-transparent bg-clip-text w-fit">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="hidden">Edit Profile</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 max-h-[75vh] overflow-y-auto">
          <div className="w-full flex flex-col sm:flex-row gap-3 text-sm">
            <div className="w-full flex flex-col gap-[2px]">
              <label className="text-sm font-bold" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full bg-card border border-accent rounded-md p-2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>

            <div className="w-full flex flex-col gap-[2px]">
              <label className="text-sm font-bold" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full bg-card border border-accent rounded-md p-2"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3">
            <div className="w-full md:w-1/2 flex flex-col gap-[2px]">
              <label className="text-sm font-bold" htmlFor="gender">
                Gender
              </label>
              <GenderSelector gender={gender} setGender={setGender} />
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-[2px]">
              <label className="text-sm font-bold" htmlFor="nationality">
                Nationality
              </label>
              <NationalitySelector
                nationality={nationality}
                setNationality={setNationality}
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-[2px]">
            <label className="text-sm font-bold" htmlFor="birthday">
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              className="w-full bg-card border border-accent rounded-md p-2 text-sm"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-[2px]">
            <label className="text-sm font-bold">Introduction</label>
            <EditorContent editor={editor} />
          </div>
        </div>
        <DialogFooter>
          <button
            className="px-3 py-1 text-sm bg-rainbow active:scale-95 rounded-md"
            type="button"
            onClick={handleSaveUpdate}
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
