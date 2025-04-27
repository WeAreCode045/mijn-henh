
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenSquare, UserCircle, Mail, Phone } from "lucide-react";
import { User } from "@/types/user";

interface UserProfileCardProps {
  user: User;
  onUpdateProfile?: (updatedUser: Partial<User>) => Promise<void>;
  inSidebar?: boolean;
}

export function UserProfileCard({ user, onUpdateProfile, inSidebar = false }: UserProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
    phone: user.phone || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateProfile) return;

    setIsUpdating(true);
    try {
      await onUpdateProfile({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback>
              <UserCircle className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{user.full_name}</h3>
          <p className="text-sm text-gray-500 mb-1">{user.role}</p>
          <div className="flex items-center mt-4 space-x-1 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center mt-2 space-x-1 text-sm text-gray-500">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center p-4 pt-0">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <Button variant="outline" size="sm" onClick={handleEditClick} className="space-x-1">
            <PenSquare className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
