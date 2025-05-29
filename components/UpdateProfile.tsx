'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateUsernameAndCard } from '@/actions/user.actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type UpdateProfileDialogProps = {
  initialUsername: string;
  initialCardnumber: number;
};

const UpdateProfileDialog: React.FC<UpdateProfileDialogProps> = ({
  initialUsername,
  initialCardnumber,
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [cardnumber, setCardnumber] = useState(initialCardnumber.toString());
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('cardnumber', cardnumber);

    try {
      const result = await updateUsernameAndCard(formData);
      toast.success(result.message || 'Profile updated!');
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-md">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/30 backdrop-blur-lg border border-white/20 text-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Update Profile</DialogTitle>
          <DialogDescription className="text-white/60">
            Modify your username and card number.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-white/80 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none"
              placeholder="Username"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-white/80 mb-1">Card Number</label>
            <input
              type="text"
              value={cardnumber}
              onChange={(e) => setCardnumber(e.target.value)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/40 focus:outline-none"
              placeholder="Card Number"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-white text-black hover:bg-gray-200 rounded-md px-4 py-2 font-semibold flex items-center gap-2"
          >
            {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
