import React from 'react';
import { UserData } from '@/types/UserData';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NationalitySelector } from './NationalitySelector';
import { GenderSelector } from './GenderSelector';

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
      <DialogContent className="rounded-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-extrabold bg-rainbow text-transparent bg-clip-text w-fit">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="hidden">Edit Profile</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <div className="w-full flex flex-col gap-[2px]">
              <label className="text-sm font-bold" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full bg-card border border-accent rounded-md p-2"
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
                className="w-full bg-card border border-accent rounded-md p-2"
                defaultValue={userData?.lastName}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3">
            <div className="w-full md:w-1/2 flex flex-col gap-[2px]">
              <label className="text-sm font-bold" htmlFor="gender">
                Gender
              </label>
              <GenderSelector />
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-[2px]">
              <label className="text-sm font-bold" htmlFor="nationality">
                Nationality
              </label>
              <NationalitySelector />
            </div>
          </div>

          <div className="w-full flex flex-col gap-[2px]">
            <label className="text-sm font-bold" htmlFor="birthday">
              Birthday
            </label>
            <input
              type="date"
              id="birthday"
              className="w-full bg-card border border-accent rounded-md p-2"
              defaultValue={userData?.birthday}
              placeholder="Enter your first name"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
