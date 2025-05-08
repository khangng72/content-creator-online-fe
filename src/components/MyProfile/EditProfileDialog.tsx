import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { UserData } from '@/types/UserData';

interface EditProfileDialogProps {
  userData: UserData | null;
}

const EditProfileDialog = ({ userData }: EditProfileDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-[100px] py-1 text-sm bg-card rounded-md active:scale-95">
          Edit Profile
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-md">
        <DialogTitle className="font-extrabold bg-rainbow text-transparent bg-clip-text w-fit">
          Edit Profile
        </DialogTitle>
        <DialogDescription className="hidden">Edit Profile</DialogDescription>
        <div className="flex flex-col gap-2">
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <div className="w-full flex flex-col gap-[2px]">
              <label className="text-sm font-bold" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full bg-card border border-gray-300 rounded-md p-2"
                defaultValue={userData?.firstName}
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
                className="w-full bg-card border border-gray-300 rounded-md p-2"
                defaultValue={userData?.lastName}
                placeholder="Enter your last name"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
