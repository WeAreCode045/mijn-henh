
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user";
import { Upload } from "lucide-react";

interface UserProfileFormProps {
  user: User;
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    whatsapp_number: string;
  };
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent, formData: any, avatarFile?: File) => void;
  onCancel: () => void;
  isUpdating: boolean;
  isUploadingAvatar?: boolean;
  inSidebar?: boolean;
}

export function UserProfileForm({ 
  user,
  formData, 
  onFormDataChange, 
  onSubmit, 
  onCancel, 
  isUpdating,
  isUploadingAvatar = false,
  inSidebar = false 
}: UserProfileFormProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar_url || "");
  const idPrefix = inSidebar ? "sidebar-" : "";

  console.log("UserProfileForm - Received formData:", formData);
  console.log("UserProfileForm - User data:", user);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("UserProfileForm - Submitting with formData:", formData);
    onSubmit(e, { ...formData, user_id: user.user_id, id: user.id }, avatarFile || undefined);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>Profile Photo</Label>
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarPreview} alt="Profile photo" />
            <AvatarFallback>
              {formData.first_name?.charAt(0) || user.first_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isUploadingAvatar}
              >
                <Upload className="h-4 w-4" />
                {isUploadingAvatar ? "Uploading..." : "Upload Photo"}
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            {avatarFile && (
              <p className="text-xs text-gray-500">
                Selected: {avatarFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}first-name`}>First Name</Label>
        <Input
          id={`${idPrefix}first-name`}
          value={formData.first_name}
          onChange={(e) => {
            console.log("UserProfileForm - First name changed to:", e.target.value);
            onFormDataChange({ ...formData, first_name: e.target.value });
          }}
          placeholder="Enter first name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}last-name`}>Last Name</Label>
        <Input
          id={`${idPrefix}last-name`}
          value={formData.last_name}
          onChange={(e) => {
            console.log("UserProfileForm - Last name changed to:", e.target.value);
            onFormDataChange({ ...formData, last_name: e.target.value });
          }}
          placeholder="Enter last name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}email`}>Email</Label>
        <Input
          id={`${idPrefix}email`}
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
          placeholder="Enter email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}phone`}>Phone</Label>
        <Input
          id={`${idPrefix}phone`}
          value={formData.phone}
          onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
          placeholder="Enter phone number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}whatsapp`}>WhatsApp Number</Label>
        <Input
          id={`${idPrefix}whatsapp`}
          value={formData.whatsapp_number}
          onChange={(e) => onFormDataChange({ ...formData, whatsapp_number: e.target.value })}
          placeholder="Enter WhatsApp number"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUpdating || isUploadingAvatar}>
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
