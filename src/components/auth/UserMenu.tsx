import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function UserMenu() {
  const { user, signOut, updateProfile, uploadAvatar } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newName, setNewName] = useState(user?.full_name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await updateProfile({ full_name: newName });
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAvatar(file);
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload avatar");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback>
                {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>{user?.full_name || user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditingProfile(true)}>
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback>
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <Button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="w-full"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}