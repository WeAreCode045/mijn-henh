
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
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    return null;
  }

  // Compute display name from first and last name
  const displayName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
                      (user.email ? user.email.split('@')[0] : 'Unknown');

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateProfile) return;

    setIsUpdating(true);
    try {
      await onUpdateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        // Update full_name to maintain compatibility
        full_name: `${formData.first_name} ${formData.last_name}`.trim()
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // If in sidebar, use a more compact layout
  if (inSidebar) {
    return (
      <div className="flex items-center space-x-3 p-1">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback>
            <UserCircle className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{displayName}</p>
          <p className="text-xs text-white/70 truncate">{user.role}</p>
          <p className="text-xs text-white/70 truncate">{user.email}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-1 p-0 h-6 text-xs text-white/70 hover:text-white"
            onClick={handleEditClick}
          >
            <PenSquare className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="sidebar-first-name">First Name</Label>
                <Input
                  id="sidebar-first-name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sidebar-last-name">Last Name</Label>
                <Input
                  id="sidebar-last-name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sidebar-email">Email</Label>
                <Input
                  id="sidebar-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sidebar-phone">Phone</Label>
                <Input
                  id="sidebar-phone"
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
      </div>
    );
  }

  // Default full card layout
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
          <h3 className="text-xl font-semibold">{displayName}</h3>
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
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
